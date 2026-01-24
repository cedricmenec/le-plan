# Implementation Plan - Task List Enhancements

This plan covers the renaming of the `SubtaskList` component to `TaskList`, the integration of drag-and-drop reordering using `@dnd-kit`, and the implementation of inline editing for task titles.

## Phase 1: Infrastructure and Renaming

- [x] Task: Database Schema Update - Add `position` to `subtasks`
    - [x] Create a new Supabase migration to add `position` column (INT, default 0) to `subtasks` table.
    - [x] Update existing subtasks to have sequential positions based on `created_at`.
- [x] Task: Project-wide Renaming - `SubtaskList` to `TaskList`
    - [x] Rename file `components/missions/subtask-list.tsx` to `components/missions/task-list.tsx`.
    - [x] Rename file `components/missions/subtask-list.test.tsx` to `components/missions/task-list.test.tsx`.
    - [x] Update all imports and component references in the codebase.
- [x] Task: Install Dependencies
    - [x] Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure and Renaming' (Protocol in workflow.md)

## Phase 2: Inline Editing

- [ ] Task: Implement Inline Editing in `TaskList` item
    - [ ] Write tests for double-click to edit, Enter to save, and Escape to cancel.
    - [ ] Implement the `InlineEditableField` (or reuse if existing) within the task item.
    - [ ] Add visual "pending" state (e.g., subtle color change) during save.
- [ ] Task: Server Action for Renaming
    - [ ] Create/Update server action to persist title changes.
    - [ ] Integrate optimistic UI update in the component.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Inline Editing' (Protocol in workflow.md)

## Phase 3: Drag & Drop Reordering

- [ ] Task: Integrate `@dnd-kit` in `TaskList`
    - [ ] Wrap task items with `DndContext`, `SortableContext`, and `VerticalSortStrategy`.
    - [ ] Implement `SortableItem` wrapper for individual tasks.
    - [ ] Add drag handle or allow dragging the whole item (to be determined during implementation for best UX).
- [ ] Task: Server Action for Reordering
    - [ ] Write tests for the reordering logic and server action.
    - [ ] Create server action to update multiple task positions in a single transaction (if possible) or efficiently.
    - [ ] Implement optimistic UI for reordering with "pending" visual feedback.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Drag & Drop Reordering' (Protocol in workflow.md)
