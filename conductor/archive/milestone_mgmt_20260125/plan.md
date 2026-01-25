# Implementation Plan: Milestone Management (Edit & Delete)

This plan covers adding edit and delete functionality to milestones, including a contextual action menu with a hover delay and inline deletion confirmation.

## Phase 1: Milestone Action Menu Component [checkpoint: 727c8ce]
**Goal:** Create a reusable component for milestone actions with inline confirmation.

- [x] Task: Create `MilestoneActions` component in `components/missions/milestone-actions.tsx`. [6731154]
    - [x] Implement `DropdownMenu` with "Modifier" and "Supprimer" items.
    - [x] Implement inline confirmation logic for the "Supprimer" item (Toggle text to "Confirmer ?").
    - [x] Reset confirmation state if the dropdown is closed.
- [x] Task: Write unit tests for `MilestoneActions`. [6731154]
    - [x] Verify both clicks are required for deletion.
    - [x] Verify `onEdit` is called immediately.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Milestone Action Menu Component' (Protocol in workflow.md)

## Phase 2: Hover Logic & Integration [checkpoint: 0d7279c]
**Goal:** Update `MissionMilestoneItem` to handle the contextual action button visibility with delay.

- [x] Task: Update `MissionMilestoneItem` in `components/missions/mission-milestone-item.tsx`. [709ee86]
    - [x] Add state for action button visibility.
    - [x] Implement `onMouseEnter` with a 1000ms `setTimeout`.
    - [x] Implement `onMouseLeave` with immediate `clearTimeout` and visibility reset.
    - [x] Integrate the `MilestoneActions` component.
- [x] Task: Write unit tests for `MissionMilestoneItem`. [709ee86]
    - [x] Test the 1s delay before visibility (mock timers).
    - [x] Test immediate disappearance on mouse leave.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Hover Logic & Integration' (Protocol in workflow.md)

## Phase 3: Wiring UI to Backend Actions [checkpoint: b3c3b7f]
**Goal:** Connect the UI components to the existing server actions and handle dialog state.

- [x] Task: Update `MissionDetailMilestones` in `components/missions/mission-detail-milestones.tsx`. [4c39949]
    - [x] Add state to track the milestone currently being edited.
    - [x] Pass `onEdit` callback to `MissionMilestoneList` -> `MissionMilestoneItem`.
    - [x] Pass `onDelete` callback (calling `deleteMilestone`) to `MissionMilestoneItem`.
    - [x] Wire up the `EditMilestoneDialog` with the selected milestone data.
- [x] Task: Add integration tests for the full Edit/Delete flow. [4c39949]
- [x] Task: Conductor - User Manual Verification 'Phase 3: Wiring UI to Backend Actions' (Protocol in workflow.md)
