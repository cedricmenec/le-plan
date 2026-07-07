import { MissionState, MissionReason } from '@/lib/types'
import { MissionStateMachine } from '@/lib/missions/state-machine'
import { StateBadge } from './state-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  PauseCircle, 
  CheckCircle2, 
  Inbox, 
  ListTodo,
  ChevronRight
} from 'lucide-react'

interface MissionStateActionsProps {
  state: MissionState
  reason?: MissionReason | null
  estimation?: number
  subtasks?: Array<{ is_completed: boolean; estimation: number }>
  onUpdate: (updates: { state: MissionState, reason?: MissionReason | null, estimation?: number }) => Promise<void>
}

const STATE_ICONS: Record<string, any> = {
  [MissionState.Backlog]: Inbox,
  [MissionState.Queued]: ListTodo,
  [MissionState.Active]: Play,
  [MissionState.Suspended]: PauseCircle,
  [MissionState.Terminated]: CheckCircle2,
}

const REASON_LABELS: Record<string, string> = {
  [MissionReason.Blocked]: 'Bloqué',
  [MissionReason.Deprioritized]: 'Dépriorisé',
  [MissionReason.Done]: 'Terminé / Fait',
  [MissionReason.Cancelled]: 'Annulé',
}

export function MissionStateActions({ state, reason, estimation, subtasks = [], onUpdate }: MissionStateActionsProps) {
  const nextStates = MissionStateMachine.getValidNextStates(state)

  const handleTransition = async (nextState: MissionState, nextReason?: MissionReason | null) => {
    const updates: { state: MissionState; reason?: MissionReason | null; estimation?: number } = { state: nextState, reason: nextReason }
    if (nextState === MissionState.Terminated && nextReason === MissionReason.Done) {
      const completedLoad = subtasks.filter(task => task.is_completed).reduce((sum, task) => sum + (Number(task.estimation) || 0), 0)
      const answer = window.prompt(completedLoad > 0 ? 'Durée réelle en jours (calculée depuis les tâches complétées). Modifiez, validez ou laissez vide pour ignorer.' : 'Durée réelle en jours. Laissez vide pour ignorer.', String(completedLoad || estimation || ''))
      if (answer !== null && answer.trim() !== '') {
        const actual = Number(answer)
        if (!Number.isFinite(actual) || actual < 0) return
        updates.estimation = actual
      }
    }
    await onUpdate(updates)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <StateBadge state={state} reason={reason} className="cursor-pointer hover:brightness-95 transition-all" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Changer l'état</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {nextStates.map((nextState) => {
          const Icon = STATE_ICONS[nextState]
          const reasons = MissionStateMachine.getValidReasons(nextState)

          if (reasons.length > 0) {
            return (
              <DropdownMenuSub key={nextState}>
                <DropdownMenuSubTrigger>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{nextState}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {reasons.map((r) => (
                    <DropdownMenuItem key={r} onClick={() => handleTransition(nextState, r)}>
                      <span>{REASON_LABELS[r] || r}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          }

          return (
            <DropdownMenuItem key={nextState} onClick={() => handleTransition(nextState, null)}>
              <Icon className="mr-2 h-4 w-4" />
              <span>{nextState}</span>
            </DropdownMenuItem>
          )
        })}

        {nextStates.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-slate-500 italic">
            Aucune transition possible depuis cet état.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
