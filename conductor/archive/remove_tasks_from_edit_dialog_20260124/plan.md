# Implementation Plan - Remove Task List from Mission Edit Dialog

Removing the `TaskList` component from `EditMissionModal` to simplify the interface and focus on core mission attributes.

## Phase 1: Test Preparation & Verification
Update existing tests to reflect the desired state where the task list is no longer part of the edit dialog.

- [x] Task: Update `components/missions/edit-mission-modal.test.tsx` 4397bf4
    - [ ] Modify the test to expect that the "Tâches" text or `TaskList` component is NOT present.
    - [ ] Verify that the test fails (Red Phase).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Test Preparation & Verification' (Protocol in workflow.md) [checkpoint: 4397bf4]

## Phase 2: Implementation
Remove the `TaskList` component and related styling from the `EditMissionModal`.

- [x] Task: Modify `components/missions/edit-mission-modal.tsx` 54d3f78
    - [x] Move the "Projet (Optionnel)" field to the top of the form, above the "Titre" field. c38572a
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation' (Protocol in workflow.md)

## Phase 3: Final Quality Checks
Ensure overall system stability and code quality.

- [x] Task: Run full test suite and linting c38572a
    - [ ] Execute `npm test` to ensure no regressions.
    - [ ] Execute `npm run lint` to ensure code style is maintained.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Quality Checks' (Protocol in workflow.md)
