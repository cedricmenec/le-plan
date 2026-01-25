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

## Phase 2: Hover Logic & Integration
**Goal:** Update `MissionMilestoneItem` to handle the contextual action button visibility with delay.

- [~] Task: Update `MissionMilestoneItem` in `components/missions/mission-milestone-item.tsx`.
    - [ ] Add state for action button visibility.
    - [ ] Implement `onMouseEnter` with a 1000ms `setTimeout`.
    - [ ] Implement `onMouseLeave` with immediate `clearTimeout` and visibility reset.
    - [ ] Integrate the `MilestoneActions` component.
- [ ] Task: Update unit tests for `MissionMilestoneItem`.
    - [ ] Test the 1s delay before visibility (mock timers).
    - [ ] Test immediate disappearance on mouse leave.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Hover Logic & Integration' (Protocol in workflow.md)

## Phase 3: Wiring UI to Backend Actions
**Goal:** Connect the UI components to the existing server actions and handle dialog state.

- [ ] Task: Update `MissionDetailMilestones` in `components/missions/mission-detail-milestones.tsx`.
    - [ ] Add state to track the milestone currently being edited.
    - [ ] Pass `onEdit` callback to `MissionMilestoneList` -> `MissionMilestoneItem`.
    - [ ] Pass `onDelete` callback (calling `deleteMilestone`) to `MissionMilestoneItem`.
    - [ ] Wire up the `EditMilestoneDialog` with the selected milestone data.
- [ ] Task: Add integration tests for the full Edit/Delete flow.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Wiring UI to Backend Actions' (Protocol in workflow.md)
