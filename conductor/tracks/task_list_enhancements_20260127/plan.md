# Implementation Plan: Mission Task List Enhancements

This plan details the improvements to the task list in the Mission Detail page, focusing on visibility management, inline editing for estimations, and counter clarification.

## Phase 1: Task Counter Clarification
Focus on making the task counter more explicit to avoid confusion.

- [ ] Task: Update the task counter format in `TaskList` component
    - [ ] Modify `components/missions/task-list.tsx` to change the counter display from `X / Y` to `X restantes / Y au total`.
    - [ ] Update the calculation logic to ensure 'X' correctly represents the number of non-completed tasks.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Task Counter' (Protocol in workflow.md)

## Phase 2: Task Visibility Management (Show/Hide Completed)
Implement the "Hide by default" behavior for completed tasks with a toggle link.

- [ ] Task: Implement filtered task display in `TaskList`
    - [ ] Add `showCompleted` state (defaulting to `false`).
    - [ ] Filter the `tasks` array displayed in the list based on `showCompleted`.
- [ ] Task: Add the "Voir les tâches terminées" toggle link
    - [ ] Append a button/link at the bottom of the list when completed tasks are hidden.
    - [ ] Ensure the link text changes to "Masquer les tâches terminées" when they are visible.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Visibility Management' (Protocol in workflow.md)

## Phase 3: Inline Editing for Time Estimation
Replace the permanent input box with a double-click Popover interaction.

- [ ] Task: Refactor `SortableTaskItem` estimation display
    - [ ] Replace the `<Input />` for estimation with a static text display.
    - [ ] Implement a Popover (using shadcn/ui) that triggers on `doubleClick`.
    - [ ] Move the estimation `<Input />` inside the Popover content.
- [ ] Task: Handle estimation updates and Popover closing
    - [ ] Ensure the update is triggered correctly on input change or "Enter" inside the popover.
    - [ ] Ensure the Popover closes after a successful update or when clicking outside.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Inline Editing' (Protocol in workflow.md)

## Phase 4: Final Verification and Polish
Final review of the integrated features.

- [ ] Task: Run full test suite and verify UI consistency
    - [ ] Ensure drag-and-drop still works correctly with the new visibility logic.
    - [ ] Verify responsive behavior on mobile.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
