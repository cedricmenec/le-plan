import { useEffect, useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { MissionWithProject } from './mission-card'
import { reorderQueue } from '@/app/missions/actions'

function QueueRow({ mission, rank, total, move }: { mission: MissionWithProject; rank: number; total: number; move: (delta: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: mission.id })
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
    className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
    <button {...attributes} {...listeners} aria-label={`Déplacer ${mission.title}`} className="cursor-grab text-slate-400"><GripVertical className="h-5 w-5" /></button>
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

export function QueuedMissionList({ missions, projectId }: { missions: MissionWithProject[]; projectId: string | null }) {
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
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex(m => m.id === active.id), to = items.findIndex(m => m.id === over.id)
    if (from >= 0 && to >= 0) void persist(arrayMove(items, from, to), items)
  }
  if (!items.length) return <p className="rounded-xl border border-dashed p-5 text-sm text-slate-500">Aucune mission en file.</p>
  return <DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={items.map(m => m.id)} strategy={verticalListSortingStrategy}>
    <div className="space-y-3">{items.map((mission, index) => <QueueRow key={mission.id} mission={mission} rank={index + 1} total={items.length} move={delta => move(index, delta)} />)}</div>
  </SortableContext></DndContext>
}
