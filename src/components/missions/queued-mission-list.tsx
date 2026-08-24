import { useEffect, useState } from 'react'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { MissionWithProject } from './mission-card'
import { reorderQueue } from '@/app/missions/actions'

export const QUEUE_SCOPE_STANDALONE = 'standalone'

/** Identifiant de scope de file : `queue:<projectId|standalone>` */
export function queueScopeId(projectId: string | null): string {
  return `queue:${projectId ?? QUEUE_SCOPE_STANDALONE}`
}

/** Identifiant préfixé d'une row triable : `<scope>:<missionId>` */
export function queueRowId(scope: string, missionId: string): string {
  return `${scope}:${missionId}`
}

/** Décompose un identifiant de row/drop en `{ scope, missionId }` */
export function parseQueueRowId(id: string): { scope: string; missionId: string } | null {
  if (!id.startsWith('queue:')) return null
  const rest = id.slice('queue:'.length)
  const sep = rest.indexOf(':')
  if (sep < 0) return null
  return { scope: rest.slice(0, sep), missionId: rest.slice(sep + 1) }
}

function QueueRow({ mission, rowId, rank, total, move, dragDisabled, dropDisabled }: { mission: MissionWithProject; rowId: string; rank: number; total: number; move: (delta: number) => void; dragDisabled: boolean; dropDisabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: rowId, disabled: { draggable: dragDisabled, droppable: dropDisabled } })
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
    className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
    <button {...attributes} {...(dragDisabled ? {} : listeners)} aria-label={`Déplacer ${mission.title}`} className="cursor-grab text-slate-400"><GripVertical className="h-5 w-5" /></button>
    <span className="w-8 text-center text-lg font-bold text-slate-400" aria-label={`Rang ${rank}`}>{rank}</span>
    <div className="min-w-0 flex-1">
      <Link to={`/missions/${mission.id}`} className="block truncate font-semibold hover:text-blue-600 hover:underline">
        {mission.title}
      </Link>
      <p className="text-xs text-slate-500">{mission.projects?.name ?? 'Missions autonomes'}</p>
    </div>
    <Button size="icon" variant="ghost" disabled={rank === 1} onClick={() => move(-1)} aria-label={`Monter ${mission.title}`}><ArrowUp className="h-4 w-4" /></Button>
    <Button size="icon" variant="ghost" disabled={rank === total} onClick={() => move(1)} aria-label={`Descendre ${mission.title}`}><ArrowDown className="h-4 w-4" /></Button>
  </div>
}

/** Zone de dépôt de la file entière : accepte les missions Backlog même sur une file vide (design D3) */
function QueueDropZone({ scope, dropDisabled, children }: { scope: string; dropDisabled: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `queuezone:${scope}`, disabled: dropDisabled })
  return (
    <div
      ref={setNodeRef}
      className={
        isOver
          ? 'rounded-xl ring-2 ring-violet-500 bg-violet-50/80 dark:bg-violet-950/40 ring-offset-2 ring-offset-transparent transition-colors'
          : 'rounded-xl transition-colors'
      }
    >
      {children}
    </div>
  )
}

interface QueuedMissionListProps {
  missions: MissionWithProject[]
  projectId: string | null
  /** Désactive l'initiation d'un drag pendant une transition en cours */
  dragDisabled?: boolean
  /** Désactive la réception d'un drop (cible invalide : scope différent de la mission draggée, design D3) */
  dropDisabled?: boolean
  /** Enregistre le gestionnaire de reorder interne pour ce scope, appelé par le DndContext partagé */
  registerDragEnd?: (scope: string, handler: ((event: { activeId: string; overId: string }) => void) | null) => void
}

export function QueuedMissionList({ missions, projectId, dragDisabled = false, dropDisabled = false, registerDragEnd }: QueuedMissionListProps) {
  const scope = queueScopeId(projectId)
  const ordered = [...missions].sort((a, b) => (a.queue_position ?? 0) - (b.queue_position ?? 0))
  const [items, setItems] = useState(ordered)
  const { toast } = useToast()
  useEffect(() => setItems(ordered), [missions])

  const persist = async (next: MissionWithProject[], previous: MissionWithProject[]) => {
    setItems(next)
    try { await reorderQueue(projectId, next.map(m => m.id)) }
    catch { setItems(previous); toast({ title: 'Ordre non enregistré', description: "L'ordre précédent a été restauré.", variant: 'destructive' }) }
  }
  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    void persist(arrayMove(items, index, target), items)
  }
  const dragEnd = ({ activeId, overId }: { activeId: string; overId: string }) => {
    if (!overId || activeId === overId) return
    const from = items.findIndex(m => m.id === activeId), to = items.findIndex(m => m.id === overId)
    if (from >= 0 && to >= 0) void persist(arrayMove(items, from, to), items)
  }

  useEffect(() => {
    registerDragEnd?.(scope, dragEnd)
    return () => registerDragEnd?.(scope, null)
  })

  if (!items.length) return <QueueDropZone scope={scope} dropDisabled={dropDisabled}><p className="rounded-xl border border-dashed p-5 text-sm text-slate-500">Aucune mission en file.</p></QueueDropZone>
  return <>
    <QueueDropZone scope={scope} dropDisabled={dropDisabled}>
      <SortableContext items={items.map(m => queueRowId(scope, m.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">{items.map((mission, index) => <QueueRow key={mission.id} mission={mission} rowId={queueRowId(scope, mission.id)} rank={index + 1} total={items.length} move={delta => move(index, delta)} dragDisabled={dragDisabled} dropDisabled={dropDisabled} />)}</div>
      </SortableContext>
    </QueueDropZone>
  </>
}
