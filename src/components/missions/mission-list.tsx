'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionCard, MissionWithProject } from './mission-card'
import { GridPlaceholder } from '@/components/ui/grid-placeholder'
import { CondensedMissionList } from './condensed-mission-list'
import { DeleteMissionDialog } from './delete-mission-dialog'
import { EditMissionModal } from './edit-mission-modal'
import { MissionState } from '@/lib/types'
import { sortMissions } from '@/lib/utils'
import { updateMission, deleteMission, getMission } from '@/app/missions/actions'
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { ProjectEmptyState } from '@/components/projects/project-empty-state'
import { getMissions, getProjects, getSubtasks } from '@/lib/db'
import { QueuedMissionList, parseQueueRowId } from './queued-mission-list'
import { useToast } from '@/components/ui/use-toast'
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, useDroppable, pointerWithin, type CollisionDetection, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'

/**
 * Détection de collision stricte : une cible n'est valide que si le pointeur est
 * réellement au-dessus d'elle. Empêche un drop « n'importe où » de déclencher
 * la transition vers la zone la plus proche (comportement de closestCenter).
 * pointerWithin retourne [] si le pointeur n'est sur aucune cible ou en drag clavier.
 */
const strictPointerWithin: CollisionDetection = pointerWithin

/** Zone de dépôt « Missions actives » (droppable, non draggable — sens unique Queued → Active) */
function ActiveDropZone({ children, transitioning }: { children: React.ReactNode; transitioning: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'active-zone', disabled: transitioning })
  return (
    <div
      ref={setNodeRef}
      className={
        isOver
          ? 'rounded-xl ring-2 ring-blue-500 bg-blue-50/80 dark:bg-blue-950/40 ring-offset-2 ring-offset-transparent transition-colors'
          : 'rounded-xl transition-colors'
      }
    >
      {children}
    </div>
  )
}

/** Bandeau de réception affiché pendant le drag d'une mission en file vers les actives (homogène avec QueueDropZone) */
function ActiveDropHint({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <p className="rounded-xl border border-dashed border-blue-300 dark:border-blue-700 p-3 text-sm text-blue-500 dark:text-blue-400">
      Déposez ici pour démarrer la mission.
    </p>
  )
}

interface MissionListProps {
  initialMissions?: MissionWithProject[]
  onUpdate?: () => void
  layout?: 'grid' | 'split'
  showProjectName?: boolean
  projectId?: string
}

export function MissionList({ 
  initialMissions, 
  onUpdate, 
  layout = 'grid',
  showProjectName = false,
  projectId
}: MissionListProps) {
  const [missions, setMissions] = useState<MissionWithProject[]>(initialMissions || [])
  const [loading, setLoading] = useState(!initialMissions)
  const [missionToDelete, setMissionToDelete] = useState<any | null>(null)
  const [missionToEdit, setMissionToEdit] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [transitioningId, setTransitioningId] = useState<string | null>(null)
  /** Scope de la mission draggée (`<projectId|standalone>`), pour restreindre les cibles de drop valides (design D3) */
  const [draggingScope, setDraggingScope] = useState<string | null>(null)
  const reorderHandlers = useRef(new Map<string, (event: { activeId: string; overId: string }) => void>())
  /** Mission en cours de drag, pour l'aperçu DragOverlay */
  const [dragPreview, setDragPreview] = useState<MissionWithProject | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const sortedMissions = useMemo(() => sortMissions(missions), [missions])

  /**
   * Sensors avec contrainte d'activation : le drag ne démarre qu'après 8px de déplacement,
   * un simple clic sur la poignée ne déclenche aucune transition.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const activeMissions = useMemo(() => 
    sortedMissions.filter(m => m.state === MissionState.Active), 
  [sortedMissions])
  const suspendedMissions = useMemo(() => sortedMissions.filter(m => m.state === MissionState.Suspended), [sortedMissions])
  const queuedMissions = useMemo(() => missions.filter(m => m.state === MissionState.Queued), [missions])
  const backlogMissions = useMemo(() => 
    sortedMissions.filter(m => m.state === MissionState.Backlog), 
  [sortedMissions])

  useEffect(() => {
    if (initialMissions) {
      setMissions(initialMissions)
      setLoading(false)
    }
  }, [initialMissions])

  useEffect(() => {
    if (initialMissions !== undefined) return
    let cancelled = false
    setLoading(true)
    Promise.all([getMissions(projectId), getProjects()]).then(async ([rows, projects]) => {
      const hydrated = await Promise.all(rows.map(async mission => ({ ...mission, projects: projects.find(project => project.id === mission.project_id) ?? null, subtasks: await getSubtasks(mission.id) })))
      if (!cancelled) setMissions(hydrated)
    }).catch(error => console.error('Impossible de charger les missions', error)).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [initialMissions, projectId])

  useEffect(() => {
    const onCreated = () => {
      if (onUpdate) {
        onUpdate()
      } else {
        window.location.reload()
      }
    }

    window.addEventListener('missions:created', onCreated)
    return () => window.removeEventListener('missions:created', onCreated)
  }, [initialMissions, onUpdate])

  const handleUpdate = async (data: any) => {
    if (!missionToEdit) return

    setUpdatingId(missionToEdit.id)
    try {
      await updateMission(missionToEdit.id, data)
      setMissionToEdit(null)
      if (onUpdate) {
        onUpdate()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!missionToDelete) return

    const idToDelete = missionToDelete.id
    setDeletingId(idToDelete)
    setMissionToDelete(null)

    try {
      await deleteMission(idToDelete)
      if (onUpdate) {
        onUpdate()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  const handleStartMission = async (missionId: string) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return
    setTransitioningId(missionId)
    setMissions(prev => prev.filter(m => m.id !== missionId))
    try {
      await updateMission(missionId, { state: MissionState.Active })
      // Mise à jour locale : la mission apparaît dans les actives sans rechargement
      setMissions(prev => [...prev, { ...mission, state: MissionState.Active, queue_position: null }])
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error(error)
      setMissions(prev => (prev.some(m => m.id === missionId) ? prev : [...prev, mission]))
      toast({ title: 'Transition non enregistrée', description: `« ${mission.title} » est restée dans la file d'attente.`, variant: 'destructive' })
    } finally {
      setTransitioningId(null)
    }
  }

  const refreshAfterChange = () => {
    if (onUpdate) onUpdate()
    else window.location.reload()
  }

  /** Transition Backlog → Queued : retrait optimiste du Backlog, rollback + toast destructif sur échec (design D4) */
  const handleQueueBacklogMission = async (missionId: string) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return
    setTransitioningId(missionId)
    setMissions(prev => prev.filter(m => m.id !== missionId))
    try {
      await updateMission(missionId, { state: MissionState.Queued })
      // Mise à jour locale : la mission apparaît en fin de file sans rechargement.
      // La position exacte est attribuée par db.ts (fin de queue du scope) ; on l'estime localement.
      setMissions(prev => {
        const maxPos = Math.max(-1, ...prev.filter(m => (m.project_id ?? null) === (mission.project_id ?? null) && m.state === MissionState.Queued).map(m => m.queue_position ?? -1))
        return [...prev, { ...mission, state: MissionState.Queued, queue_position: maxPos + 1 }]
      })
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error(error)
      setMissions(prev => (prev.some(m => m.id === missionId) ? prev : [...prev, mission]))
      toast({ title: 'Transition non enregistrée', description: `« ${mission.title} » est restée dans le backlog.`, variant: 'destructive' })
    } finally {
      setTransitioningId(null)
    }
  }

  /** Track le début d'un drag pour identifier la mission et son scope (design D3) + aperçu overlay */
  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeId = String(active.id)
    if (activeId.startsWith('backlog:')) {
      const missionId = activeId.slice('backlog:'.length)
      const mission = missions.find(m => m.id === missionId)
      setDraggingScope(mission?.project_id ?? 'standalone')
      setDragPreview(mission ?? null)
    } else if (activeId.startsWith('queue:')) {
      const parsed = parseQueueRowId(activeId)
      setDraggingScope(parsed?.scope ?? null)
      setDragPreview(missions.find(m => m.id === parsed?.missionId) ?? null)
    }
  }

  /**
   * Routage partagé du drag end (design D2) :
   * - queue:<scope> → active-zone : transition Queued → Active
   * - backlog:<id> → queue:<scope> : transition Backlog → Queued (si scope correspondant)
   * - backlog:<id> → active-zone ou toute autre combinaison : ignoré silencieusement
   */
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    const activeId = String(active.id)
    if (activeId.startsWith('backlog:')) {
      if (transitioningId) return
      const overId = String(over.id)
      // Drop restreint à la file du scope de la mission (design D3) ; zone actives ignorée
      // Cibles valides : une row de la file (`queue:<scope>:<id>`) ou la zone de file entière (`queuezone:queue:<scope>`)
      const dragged = missions.find(m => m.id === activeId.slice('backlog:'.length))
      const expectedScope = dragged?.project_id ?? 'standalone'
      const overScope = overId.startsWith('queuezone:')
        ? overId.slice('queuezone:'.length).replace(/^queue:/, '')
        : parseQueueRowId(overId)?.scope
      if (!overScope || overScope !== expectedScope) return
      void handleQueueBacklogMission(activeId.slice('backlog:'.length))
      return
    }
    if (over.id === 'active-zone') {
      const parsed = parseQueueRowId(activeId)
      if (parsed && !transitioningId) void handleStartMission(parsed.missionId)
      return
    }
    const overParsed = parseQueueRowId(String(over.id))
    if (!overParsed) return
    const handler = reorderHandlers.current.get(overParsed.scope)
    handler?.({ activeId: activeId.split(':').pop()!, overId: overParsed.missionId })
  }

  /** Réinitialise le scope draggé et l'aperçu en fin de drag */
  const clearDraggingScope = () => { setDraggingScope(null); setDragPreview(null) }

  const registerDragEnd = useCallback((scope: string, handler: ((event: { activeId: string; overId: string }) => void) | null) => {
    if (handler) reorderHandlers.current.set(scope, handler)
    else reorderHandlers.current.delete(scope)
  }, [])

  if (loading) {
    return <p className="text-slate-500 animate-pulse">Chargement des missions...</p>
  }

  const renderGrid = (items: MissionWithProject[], fillTo: number = 0) => {
    const placeholdersCount = fillTo > items.length 
      ? fillTo - items.length 
      : (items.length % 3 !== 0 ? 3 - (items.length % 3) : 0);

    const humorousLabels = [
      "Encore de la place pour sauver le monde ?",
      "Un créneau de libre ? C'est rare !",
      "Prêt pour une nouvelle aventure ?",
      "Emplacement réservé aux génies.",
      "Silence... une mission pourrait apparaître ici.",
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onEdit={() => setMissionToEdit(mission)}
            onDelete={() => setMissionToDelete(mission)}
            isUpdating={updatingId === mission.id}
            isDeleting={deletingId === mission.id}
          />
        ))}
        {Array.from({ length: placeholdersCount }).map((_, i) => (
          <GridPlaceholder 
            key={`placeholder-${i}`} 
            label={humorousLabels[i % humorousLabels.length]} 
          />
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-10">
        {missions.length === 0 ? (
          <ProjectEmptyState projectId={projectId} />
        ) : layout === 'split' ? (
          <DndContext sensors={sensors} collisionDetection={strictPointerWithin} onDragStart={handleDragStart} onDragEnd={(event) => { handleDragEnd(event); clearDraggingScope() }} onDragCancel={clearDraggingScope}>
            {/* Aperçu flottant de la mission en cours de drag */}
            {dragPreview && (
              <DragOverlay>
                <div className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#15202b] shadow-lg px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                  {dragPreview.title}
                </div>
              </DragOverlay>
            )}
            {/* Active Missions Section — zone de réception compacte (drop Queued → Active), homogène avec QueueDropZone */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-4 w-1.5 rounded-full bg-blue-500" />
                  Missions actives
                </h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {activeMissions.length} mission{activeMissions.length > 1 ? 's' : ''} en cours
                </span>
              </div>
              <ActiveDropZone transitioning={!!transitioningId}>
                {draggingScope !== null && (
                  <div className="mb-4">
                    <ActiveDropHint visible />
                  </div>
                )}
                {activeMissions.length > 0 ? (
                  renderGrid(activeMissions, 3)
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GridPlaceholder label="C'est le calme plat... Profites-en pour prendre un café ☕" />
                    <GridPlaceholder label="Rien à signaler. C'est louche, non ?" />
                    <GridPlaceholder label="Libre comme l'air ! (Ou presque)" />
                  </div>
                )}
              </ActiveDropZone>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><span className="h-4 w-1.5 rounded-full bg-amber-500" />Missions suspendues</h3>
              {suspendedMissions.length ? renderGrid(suspendedMissions) : <p className="text-sm text-slate-500">Aucune mission suspendue.</p>}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><span className="h-4 w-1.5 rounded-full bg-violet-500" />File d'attente</h3>
              {projectId !== undefined ? <QueuedMissionList missions={queuedMissions} projectId={projectId} dragDisabled={!!transitioningId} dropDisabled={draggingScope !== null && draggingScope !== projectId} registerDragEnd={registerDragEnd} /> :
                Array.from(new Map([
                  ...queuedMissions.map(m => [m.project_id ?? '__standalone__', m] as const),
                  // File vide pour les scopes ayant des missions Backlog : cible de drop Backlog → file (design D3)
                  ...backlogMissions.filter(m => m.project_id).map(m => [m.project_id as string, m] as const),
                ]).keys()).map(scope => {
                  const group = queuedMissions.filter(m => (m.project_id ?? '__standalone__') === scope)
                  return <section key={scope} className="space-y-2"><h4 className="text-sm font-bold text-slate-500">{group[0]?.projects?.name ?? 'Missions autonomes'}</h4><QueuedMissionList missions={group} projectId={scope === '__standalone__' ? null : scope} dragDisabled={!!transitioningId} dropDisabled={draggingScope !== null && draggingScope !== (scope === '__standalone__' ? 'standalone' : scope)} registerDragEnd={registerDragEnd} /></section>
                })}
            </div>
            <details open className="space-y-4 rounded-xl">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-4 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  Backlog
                </h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {backlogMissions.length} mission{backlogMissions.length > 1 ? 's' : ''}
                </span>
              </summary>
              <CondensedMissionList
                missions={backlogMissions}
                showProjectName={showProjectName}
                onEdit={(m) => setMissionToEdit(m)}
                onDelete={(m) => setMissionToDelete(m)}
                updatingId={updatingId}
                deletingId={deletingId}
                dragDisabled={!!transitioningId}
              />
            </details>
          </DndContext>
        ) : (
          renderGrid(sortedMissions)
        )}

        {missionToEdit && (
          <EditMissionModal
            mission={missionToEdit}
            open={!!missionToEdit}
            onOpenChange={(open) => !open && setMissionToEdit(null)}
            onSubmit={handleUpdate}
            onDelete={() => {
              setMissionToDelete(missionToEdit)
              setMissionToEdit(null)
            }}
            loading={updatingId === missionToEdit.id}
          />
        )}

        <DeleteMissionDialog
          open={!!missionToDelete}
          onOpenChange={(open) => !open && setMissionToDelete(null)}
          onConfirm={handleDelete}
          loading={deletingId === (missionToDelete?.id)}
        />
            </div>
          </TooltipProvider>
        )
      }
