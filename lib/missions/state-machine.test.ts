import { describe, it, expect } from 'vitest';
import { MissionStateMachine } from './state-machine';
import { MissionState, MissionReason } from '@prisma/client';

describe('MissionStateMachine', () => {
  describe('isValidTransition', () => {
    it('should allow transition from Backlog to Queued', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Backlog, MissionState.Queued)).toBe(true);
    });

    it('should allow transition from Queued to Backlog', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Queued, MissionState.Backlog)).toBe(true);
    });

    it('should allow transition from Backlog to Active', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Backlog, MissionState.Active)).toBe(true);
    });

    it('should allow transition from Queued to Active', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Queued, MissionState.Active)).toBe(true);
    });

    it('should allow transition from Active to Suspended', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Active, MissionState.Suspended)).toBe(true);
    });

    it('should allow transition from Suspended to Active', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Suspended, MissionState.Active)).toBe(true);
    });

    it('should allow transition from Active to Terminated', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Active, MissionState.Terminated)).toBe(true);
    });

    it('should allow transition from Suspended to Terminated', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Suspended, MissionState.Terminated)).toBe(true);
    });

    it('should NOT allow transition from Backlog to Terminated', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Backlog, MissionState.Terminated)).toBe(false);
    });

    it('should NOT allow transition from Queued to Terminated', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Queued, MissionState.Terminated)).toBe(false);
    });

    it('should NOT allow transition from Terminated to Active', () => {
      expect(MissionStateMachine.isValidTransition(MissionState.Terminated, MissionState.Active)).toBe(false);
    });
  });

  describe('validateStateAndReason', () => {
    it('should be valid for Backlog with no reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Backlog, null)).toBe(true);
    });

    it('should be valid for Suspended with Blocked reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Suspended, MissionReason.Blocked)).toBe(true);
    });

    it('should be valid for Suspended with Deprioritized reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Suspended, MissionReason.Deprioritized)).toBe(true);
    });

    it('should be INVALID for Suspended with no reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Suspended, null)).toBe(false);
    });

    it('should be INVALID for Suspended with Done reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Suspended, MissionReason.Done)).toBe(false);
    });

    it('should be valid for Terminated with Done reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Terminated, MissionReason.Done)).toBe(true);
    });

    it('should be valid for Terminated with Cancelled reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Terminated, MissionReason.Cancelled)).toBe(true);
    });

    it('should be INVALID for Terminated with no reason', () => {
      expect(MissionStateMachine.validateStateAndReason(MissionState.Terminated, null)).toBe(false);
    });
  });

  describe('getValidNextStates', () => {
    it('should return valid next states for Active', () => {
      const states = MissionStateMachine.getValidNextStates(MissionState.Active);
      expect(states).toContain(MissionState.Suspended);
      expect(states).toContain(MissionState.Terminated);
      expect(states.length).toBe(2);
    });
  });

  describe('getValidReasons', () => {
    it('should return valid reasons for Suspended', () => {
      const reasons = MissionStateMachine.getValidReasons(MissionState.Suspended);
      expect(reasons).toContain(MissionReason.Blocked);
      expect(reasons).toContain(MissionReason.Deprioritized);
      expect(reasons.length).toBe(2);
    });
  });
});
