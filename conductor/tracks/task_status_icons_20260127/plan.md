# Implementation Plan - Task Status UI Update

This plan outlines the steps to replace the text-based status selector in the task list with a compact icon-based selector, as defined in the `spec.md`.

## Phase 1: Preparation & Testing Setup
- [x] Task: Create a reproduction/baseline test for `SortableTaskItem` to ensure existing functionality (status updates) is preserved. [da5f953]
    - [x] Add a test case in `components/missions/task-list.test.tsx` (if it exists) or create it to verify status selection triggers the `onUpdate` callback.

## Phase 2: UI Implementation
- [x] Task: Update `SortableTaskItem` component in `components/missions/task-list.tsx`. [c727aaa]
    - [x] Import `Square`, `PlayCircle`, and `CheckSquare` from `lucide-react`.
    - [x] Refactor `SelectTrigger` to display only the icon corresponding to the current status.
    - [x] Ensure the icon maintains its color coding (Slate for todo, Blue for in_progress, Green for done).
    - [x] Update `SelectContent` and `SelectItem` to include both the icon and the text in a row.
    - [x] Update status text from uppercase (e.g., "À FAIRE") to sentence case (e.g., "À faire").
    - [x] Add `aria-label` to the `Select` or `SelectTrigger` for accessibility since text is removed from the visible trigger.

## Phase 3: Verification & Cleanup
- [ ] Task: Manual Verification.
    - [ ] Verify that clicking the icon opens the dropdown.
    - [ ] Verify that the dropdown items look correct (Icon + Text).
    - [ ] Verify that selecting an item updates the task status and the trigger icon.
- [ ] Task: Run existing tests to ensure no regressions in task management.
- [ ] Task: Conductor - User Manual Verification 'Task Status UI Update' (Protocol in workflow.md)
