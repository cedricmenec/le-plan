# Implementation Plan - Mission Detail Page

This plan covers the implementation of the Mission Detail page at `/missions/[id]`, featuring inline editing for mission details and a two-column layout including subtask management.

## Phase 1: Routing & Basic Structure
Goal: Setup the URL structure and the basic layout of the page.

- [x] Task: Create mission detail page route at `app/missions/[id]/page.tsx` with basic mission data fetching. (5e97264)
- [x] Task: Implement two-column layout (Mission Info Left, Subtasks Right) and mobile responsiveness. (2085e89)
- [~] Task: Implement breadcrumb navigation tailored to the mission's context (standalone vs project-linked).
- [ ] Task: Update `MissionCard` component to link the "Détails" button to the new route.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Routing & Basic Structure' (Protocol in workflow.md)

## Phase 2: Inline Editing & Metadata
Goal: Enable fluid editing of mission fields directly on the page.

- [ ] Task: Create `InlineEditableField` component or pattern to handle text, textarea, and select inputs.
- [ ] Task: Implement inline editing for Title, Goal, and Notes fields.
- [ ] Task: Implement inline editing for Metadata fields (Project, Status, Type, Estimation, Confidence).
- [ ] Task: Add loading and success/error feedback (Toasts) for auto-saving operations.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Inline Editing & Metadata' (Protocol in workflow.md)

## Phase 3: Subtask Integration & Refinement
Goal: Ensure robust subtask management and final UI polish.

- [ ] Task: Integrate `SubtaskList` into the right column of the detail page.
- [ ] Task: Refactor/Enhance `SubtaskList` if necessary to ensure it fits the detail page layout perfectly.
- [ ] Task: Final UI polish (spacing, shadows, transitions) according to Product Guidelines.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Subtask Integration & Refinement' (Protocol in workflow.md)
