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
import { DndContext, closestCenter, useDroppable, type DragEndEvent } from '@dnd-kit/core'

/** Zone de dépôt « Missions actives » (droppable, non draggable — sens unique Queued → Active) */
function ActiveDropZone({ children, transitioning }: { children: React.ReactNode; transitioning: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'active-zone', disabled: transitioning })
  return (
    <div ref={setNodeRef} className={isOver ? 'rounded-2xl ring-2 ring-blue-500/60 ring-offset-4 ring-offset-transparent' : undefined}>
      {children}
    </div>
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
  const reorderHandlers = useRef(new Map<string, (event: { activeId: string; overId: string }) => void>())
  const { toast } = useToast()
  const navigate = useNavigate()

  const sortedMissions = useMemo(() => sortMissions(missions), [missions])

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
      refreshAfterChange()
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

  /** Routage partagé du drag end : même file → reorder interne ; active-zone → transition d'état */
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    if (over.id === 'active-zone') {
      const parsed = parseQueueRowId(String(active.id))
      if (parsed && !transitioningId) void handleStartMission(parsed.missionId)
      return
    }
    const overParsed = parseQueueRowId(String(over.id))
    if (!overParsed) return
    const handler = reorderHandlers.current.get(overParsed.scope)
    handler?.({ activeId: String(active.id).split(':').pop()!, overId: overParsed.missionId })
  }

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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {/* Active Missions Section — droppable (drop zone Queued → Active) */}
            <ActiveDropZone transitioning={!!transitioningId}>
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
              {activeMissions.length > 0 ? (
                renderGrid(activeMissions, 3)
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GridPlaceholder label="C'est le calme plat... Profites-en pour prendre un café ☕" />
                  <GridPlaceholder label="Rien à signaler. C'est louche, non ?" />
                  <GridPlaceholder label="Libre comme l'air ! (Ou presque)" />
                </div>
              )}
            </div>
            </ActiveDropZone>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><span className="h-4 w-1.5 rounded-full bg-amber-500" />Missions suspendues</h3>
              {suspendedMissions.length ? renderGrid(suspendedMissions) : <p className="text-sm text-slate-500">Aucune mission suspendue.</p>}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><span className="h-4 w-1.5 rounded-full bg-violet-500" />File d'attente</h3>
              {projectId !== undefined ? <QueuedMissionList missions={queuedMissions} projectId={projectId} dragDisabled={!!transitioningId} registerDragEnd={registerDragEnd} /> :
                Array.from(new Map(queuedMissions.map(m => [m.project_id ?? '__standalone__', m])).keys()).map(scope => {
                  const group = queuedMissions.filter(m => (m.project_id ?? '__standalone__') === scope)
                  return <section key={scope} className="space-y-2"><h4 className="text-sm font-bold text-slate-500">{group[0]?.projects?.name ?? 'Missions autonomes'}</h4><QueuedMissionList missions={group} projectId={scope === '__standalone__' ? null : scope} dragDisabled={!!transitioningId} registerDragEnd={registerDragEnd} /></section>
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
