# Implementation Plan: Mission Task List Enhancements

This plan details the improvements to the task list in the Mission Detail page, focusing on visibility management, inline editing for estimations, and counter clarification.

## Phase 1: Task Counter Clarification [checkpoint: 8384e7c]
Focus on making the task counter more explicit to avoid confusion.

- [x] Task: Update the task counter format in `TaskList` component e7dc629
    - [x] Modify `components/missions/task-list.tsx` to change the counter display from `X / Y` to `X restantes / Y au total`.
    - [x] Update the calculation logic to ensure 'X' correctly represents the number of non-completed tasks.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Task Counter' (Protocol in workflow.md)

## Phase 2: Task Visibility Management (Show/Hide Completed) [checkpoint: d48be00]
Implement the "Hide by default" behavior for completed tasks with a toggle link.

- [x] Task: Implement filtered task display in `TaskList` bc682fd
    - [x] Add `showCompleted` state (defaulting to `false`).
    - [x] Filter the `tasks` array displayed in the list based on `showCompleted`.
- [x] Task: Add the "Voir les tâches terminées" toggle link bc682fd
    - [x] Append a button/link at the bottom of the list when completed tasks are hidden.
    - [x] Ensure the link text changes to "Masquer les tâches terminées" when they are visible.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Visibility Management' (Protocol in workflow.md)

## Phase 3: Inline Editing for Time Estimation [checkpoint: dae6c09]
Replace the permanent input box with a double-click Popover interaction.

- [x] Task: Refactor `SortableTaskItem` estimation display a76c578
    - [x] Replace the `<Input />` for estimation with a static text display.
    - [x] Implement a Popover (using shadcn/ui) that triggers on `doubleClick`.
    - [x] Move the estimation `<Input />` inside the Popover content.
- [x] Task: Handle estimation updates and Popover closing a76c578
    - [x] Ensure the update is triggered correctly on input change or "Enter" inside the popover.
    - [x] Ensure the Popover closes after a successful update or when clicking outside.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Inline Editing' (Protocol in workflow.md)

## Phase 4: Final Verification and Polish [checkpoint: 0344ebd]
Final review of the integrated features.

- [x] Task: Run full test suite and verify UI consistency 0344ebd
    - [x] Ensure drag-and-drop still works correctly with the new visibility logic.
    - [x] Verify responsive behavior on mobile.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
