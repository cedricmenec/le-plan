import { MissionState, MissionReason } from '@prisma/client';

export class MissionStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<MissionState, MissionState[]> = {
    [MissionState.Backlog]: [MissionState.Queued, MissionState.Active],
    [MissionState.Queued]: [MissionState.Backlog, MissionState.Active],
    [MissionState.Active]: [MissionState.Suspended, MissionState.Terminated],
    [MissionState.Suspended]: [MissionState.Active, MissionState.Terminated],
    [MissionState.Terminated]: [],
  };

  private static readonly STATE_REASONS: Record<MissionState, MissionReason[]> = {
    [MissionState.Backlog]: [],
    [MissionState.Queued]: [],
    [MissionState.Active]: [],
    [MissionState.Suspended]: [MissionReason.Blocked, MissionReason.Deprioritized],
    [MissionState.Terminated]: [MissionReason.Done, MissionReason.Cancelled],
  };

  /**
   * Validates if a transition from current state to next state is allowed.
   */
  static isValidTransition(current: MissionState, next: MissionState): boolean {
    if (current === next) return true;
    const allowed = this.ALLOWED_TRANSITIONS[current];
    return allowed.includes(next);
  }

  /**
   * Validates if the given reason is valid for the given state.
   */
  static validateStateAndReason(state: MissionState, reason: MissionReason | null): boolean {
    const requiredReasons = this.STATE_REASONS[state];
    
    if (requiredReasons.length === 0) {
      return reason === null;
    }

    if (reason === null) {
      return false;
    }

    return requiredReasons.includes(reason);
  }

  /**
   * Returns the list of valid next states from a current state.
   */
  static getValidNextStates(current: MissionState): MissionState[] {
    return this.ALLOWED_TRANSITIONS[current];
  }

  /**
   * Returns the valid reasons for a given state.
   */
  static getValidReasons(state: MissionState): MissionReason[] {
    return this.STATE_REASONS[state];
  }
}
