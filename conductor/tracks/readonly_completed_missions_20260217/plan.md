# Implementation Plan: ReadOnly View and Re-open for Completed Missions

This plan details the steps to implement a dedicated read-only view for completed missions and the ability to re-open them to the `Next Up` state.

## Phase 1: Logic & Actions
Focus on the backend transitions and ensuring we can fetch the data needed for the read-only view.

- [x] Task: Update mission actions to support the "Re-open" transition. c3868fa
    - [x] Write tests for a new `reopenMission` action that transitions from `Terminated` to `Next Up`.
    - [x] Implement `reopenMission` in `app/missions/actions.ts` using Prisma.
- [x] Task: Ensure data fetching for completed missions includes all necessary historical data (tasks, milestones). c3868fa
    - [x] Verify that existing fetching logic in `app/missions/[id]` retrieves completed tasks and milestones correctly.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Logic & Actions' (Protocol in workflow.md)

## Phase 2: ReadOnly UI Components
Create the read-only versions of the core mission detail components.

- [ ] Task: Create a ReadOnly wrapper or variant for `TaskList`.
    - [ ] Write tests for `TaskList` in a disabled/read-only state (no checkboxes, no drag & drop, no inline editing).
    - [ ] Implement the read-only state in `components/missions/task-list.tsx`.
- [ ] Task: Create a ReadOnly variant for `MissionTimeline` and `MilestoneList`.
    - [ ] Write tests for `MissionTimeline` and `MilestoneList` in a read-only state.
    - [ ] Implement the read-only state in `components/missions/mission-timeline.tsx` and `components/missions/mission-milestone-list.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: ReadOnly UI Components' (Protocol in workflow.md)

## Phase 3: Dedicated ReadOnly View
Implement the new page structure for viewing completed missions.

- [ ] Task: Implement the dedicated ReadOnly view page.
    - [ ] Create `app/missions/[id]/readonly/page.tsx` (or a conditional branch in the main detail page if more appropriate, but the spec calls for a dedicated view).
    - [ ] Write tests to ensure the page renders all sections (Metadata, Tasks, Milestones, Duration) without interactive elements.
    - [ ] Implement the page layout using the read-only components.
- [ ] Task: Implement the "Re-open" button in the ReadOnly view.
    - [ ] Add the "Re-open" button to the header of the ReadOnly view.
    - [ ] Connect the button to the `reopenMission` action.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dedicated ReadOnly View' (Protocol in workflow.md)

## Phase 4: Integration & Navigation
Connect the existing UI to the new ReadOnly view.

- [ ] Task: Update Project Detail view to link to the ReadOnly view.
    - [ ] Update `components/projects/project-mission-list.tsx` (or wherever completed missions are listed) to link to the ReadOnly view instead of the standard (editable) detail page for terminated missions.
- [ ] Task: Update Recently Completed Missions list.
    - [ ] Update `components/missions/recently-completed-missions.tsx` to link to the new ReadOnly view.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Navigation' (Protocol in workflow.md)
