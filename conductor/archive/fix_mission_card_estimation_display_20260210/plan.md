# Implementation Plan - Fix MissionCard Estimation Display [checkpoint: 28a9d26]

Correct the estimation display in `MissionCard` and `CondensedMissionRow` to show the correct value and icon based on the mission's `load_source`.

## Phase 1: Fix Data Fetching [checkpoint: 86a731d]
Ensure all mission queries include subtasks so that task-based estimations can be calculated correctly.

- [x] Task: Update `app/projects/actions.ts` to include `subtasks(*)` in `getProjects` and `getProject` queries. fe81dbf
- [x] Task: Update `components/projects/project-mission-list.tsx` to include `subtasks(*)` in the `fetchMissions` query. 86a731d
- [x] Task: Conductor - User Manual Verification 'Data Fetching Fix' (Protocol in workflow.md)

## Phase 2: Update UI Components (TDD) [checkpoint: 82f622b]
Update the display logic in `MissionCard` and `CondensedMissionRow` to match the specification.

- [x] Task: Write failing tests for `MissionCard` verifying the new estimation display logic (ROM showing days only, correct icons). 82f622b
- [x] Task: Update `components/missions/mission-card.tsx` to pass the tests. 82f622b
- [x] Task: Write failing tests for `CondensedMissionRow` verifying the new estimation display logic. 82f622b
- [x] Task: Update `components/missions/condensed-mission-row.tsx` to pass the tests. 82f622b
- [x] Task: Conductor - User Manual Verification 'UI Components Update' (Protocol in workflow.md)

## Phase 3: Final Verification [checkpoint: 28a9d26]
- [x] Task: Run all project tests to ensure no regressions. 28a9d26
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)