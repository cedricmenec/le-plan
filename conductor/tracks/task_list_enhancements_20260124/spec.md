# Track Specification - Task List Enhancements (Drag & Drop, Rename, Reorder)

## Overview
This track focuses on improving the user experience for managing subtasks within a mission. The primary goals are to allow users to easily reorder tasks via drag and drop, rename tasks in-place (inline editing), and rename the `SubtaskList` component to `TaskList` for better semantic clarity.

## Functional Requirements
- **Renaming Component:** Rename `SubtaskList` to `TaskList` throughout the codebase.
- **Drag & Drop Reordering:**
    - Integrate `@dnd-kit/core` and `@dnd-kit/sortable` to enable vertical reordering of tasks.
    - Provide visual feedback during drag operations (e.g., active item styling).
- **Inline Editing:**
    - Allow users to rename a task by **double-clicking** its title.
    - The title transforms into an input field; pressing `Enter` or blurring the field saves the change.
    - Pressing `Escape` cancels the edit.
- **Persistence & Optimistic UI:**
    - Use **Optimistic UI updates** for both reordering and renaming.
    - Provide a **subtle visual indicator** (e.g., changed text color or opacity) while the change is being persisted to the database.
    - Implement a new `position` (integer) column in the `subtasks` table to maintain order.

## Technical Requirements
- **Database Schema:** Add a `position` column (INT) to the `subtasks` table.
- **Libraries:** Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- **Server Actions:**
    - Update `reorderTasks` action to handle bulk position updates.
    - Update `renameTask` action for title modifications.

## Acceptance Criteria
- [ ] Users can drag and drop tasks to change their vertical order.
- [ ] The new order is persisted and maintained after page refresh.
- [ ] Double-clicking a task title allows renaming it.
- [ ] Changes are visible immediately (optimistic UI) with a "pending" visual state until confirmed by the server.
- [ ] All references to `SubtaskList` are updated to `TaskList`.

## Out of Scope
- Dragging tasks between different missions.
- Complex nesting of tasks (sub-sub-tasks).
