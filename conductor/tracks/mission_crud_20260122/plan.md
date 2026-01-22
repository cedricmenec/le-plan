# Implementation Plan: Mission Update and Delete Operations

This plan covers the implementation of update and delete operations for missions, including UI components for editing, confirmation dialogs for deletion, and managing subtasks within the edit flow.

## Phase 1: Infrastructure & Database Verification [checkpoint: eb92bb8]
- [x] Task: Verify Database Cascade Deletes 08620e5
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Database Verification' (Protocol in workflow.md) eb92bb8

## Phase 2: Actions Menu & UI Components
- [ ] Task: Implement Mission Actions Dropdown
    - [ ] Write tests for `MissionActions` component (Edit/Delete options).
    - [ ] Create `MissionActions` component using Shadcn `DropdownMenu`.
    - [ ] Integrate `MissionActions` into the `MissionList` cards.
- [ ] Task: Implement Delete Confirmation Dialog
    - [ ] Write tests for `DeleteMissionDialog`.
    - [ ] Create `DeleteMissionDialog` using Shadcn `AlertDialog`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Actions Menu & UI Components' (Protocol in workflow.md)

## Phase 3: Mission Update Logic & Modal
- [ ] Task: Implement Mission Edit Modal
    - [ ] Write tests for `EditMissionModal` (form rendering with existing data).
    - [ ] Create `EditMissionModal` using Shadcn `Dialog`.
    - [ ] Include all fields: Title, Type, Estimation, Confidence, Project Parent, and Status.
- [ ] Task: Implement Update Logic
    - [ ] Write tests for mission update action/logic.
    - [ ] Implement Supabase update call in the modal submission handler.
    - [ ] Add loading states to the modal and card during saving.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Mission Update Logic & Modal' (Protocol in workflow.md)

## Phase 4: Subtask Management in Edit Modal
- [ ] Task: Integrate Subtask Editing in Modal
    - [ ] Write tests for subtask management within the `EditMissionModal`.
    - [ ] Allow adding, updating, and removing subtasks inside the modal.
    - [ ] Ensure subtask changes are persisted (either via bulk update or individual calls).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Subtask Management in Edit Modal' (Protocol in workflow.md)

## Phase 5: Deletion Logic & Cleanup
- [ ] Task: Implement Delete Logic
    - [ ] Write tests for mission deletion.
    - [ ] Implement Supabase delete call.
    - [ ] Ensure UI updates correctly (removal from list) after deletion.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Deletion Logic & Cleanup' (Protocol in workflow.md)
