# Implementation Plan: Mission State Model Refactoring

This plan outlines the steps to refactor the mission state management from a simple string-based status to a structured macro-state model with explicit transition rules, as defined in `spec.md`.

## Phase 1: Database & Core Logic
This phase focuses on updating the data model and implementing the centralized state machine that will govern all transitions.

- [ ] Task: Update Prisma schema to include `MissionState` and `MissionReason` enums and add `state` and `reason` columns to the `missions` model.
- [ ] Task: Create a database migration to add the new columns and perform the initial data mapping (`todo` -> `Backlog`, `in_progress` -> `Active`, `done` -> `Terminated/Done`).
- [ ] Task: Implement the `MissionStateMachine` in `lib/missions/state-machine.ts` with transition validation logic.
- [ ] Task: Write unit tests for the `MissionStateMachine` covering all allowed and forbidden transitions.
- [ ] Task: Conductor - User Manual Verification 'Database & Core Logic' (Protocol in workflow.md)

## Phase 2: Backend Integration
Refactor the server actions and API layer to use the new state model and the state machine for validations.

- [ ] Task: Update `Mission` TypeScript types and Prisma client usage to reflect the new schema.
- [ ] Task: Refactor `createMission` action to initialize missions in the `Backlog` state (or as specified in the form).
- [ ] Task: Refactor `updateMission` and any dedicated status-update actions to use the `MissionStateMachine` for validation before saving.
- [ ] Task: Update mission fetching logic to ensure `state` and `reason` are properly handled and the old `status` field is deprecated/removed.
- [ ] Task: Conductor - User Manual Verification 'Backend Integration' (Protocol in workflow.md)

## Phase 3: UI/UX Refactoring
Update the frontend components to display the new semantic labels and handle state transitions through the new model.

- [ ] Task: Update `PriorityBadge` or create a new `StateBadge` component to handle semantic labeling (e.g., showing "Blocked" for `Suspended/Blocked`).
- [ ] Task: Update Mission Cards and Detail views to use the new badge and display logic.
- [ ] Task: Update `MissionForm` and `EditMissionModal` to include state and reason selection with dynamic fields (e.g., showing reason dropdown only for `Suspended` or `Terminated`).
- [ ] Task: Update any filtering logic (e.g., in Project Detail view) that relies on mission status.
- [ ] Task: Conductor - User Manual Verification 'UI/UX Refactoring' (Protocol in workflow.md)

## Phase 4: Cleanup & Finalization
Remove legacy code and ensure the system is fully aligned with the new model.

- [ ] Task: Remove the legacy `status` column from the `missions` table and update all remaining references in the codebase.
- [ ] Task: Perform a final end-to-end verification of mission lifecycle (Creation -> Queued -> Active -> Suspended -> Terminated).
- [ ] Task: Conductor - User Manual Verification 'Cleanup & Finalization' (Protocol in workflow.md)
