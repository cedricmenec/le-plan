# Specification: ReadOnly Access for Completed Missions

## Overview
Currently, once a mission reaches a terminal state (Terminated), it is no longer easily accessible for viewing details like tasks and milestones. This track introduces a dedicated ReadOnly view for completed missions and allows users to re-open them if necessary.

## Functional Requirements
- **ReadOnly View Implementation:** Create a dedicated view for missions in the `Terminated` state.
- **Content Display:** The view must display:
    - Task list (all executed tasks).
    - Milestones timeline (achieved dates).
    - Mission metadata (Goal, notes, priority, type).
    - Actual duration and final effort recorded.
- **UI Interaction:**
    - Disable all inline editing and standard action buttons (except Re-open).
    - Visual indicator that the mission is in "Archive/Completed" mode.
- **Access Points:**
    - Accessible via clicking a completed mission in the Project Detail view (Recently Completed list).
    - Accessible via any global mission history or search features.
- **Re-open Functionality:**
    - Provide a "Re-open" action within the ReadOnly view.
    - Transition the mission state from `Terminated` to `Next Up`.

## Non-Functional Requirements
- **Clarity:** The distinction between an active mission and a completed one must be visually obvious.
- **Consistency:** Use existing components (TaskList, Timeline) but in a disabled/read-only state.

## Acceptance Criteria
- [ ] Clicking a completed mission opens the ReadOnly view.
- [ ] No fields can be edited in the ReadOnly view.
- [ ] All requested sections (tasks, milestones, metadata, duration) are visible.
- [ ] Clicking "Re-open" successfully moves the mission back to `Next Up`.
- [ ] The mission becomes editable again after being re-opened.

## Out of Scope
- Creating a global "Mission History" page (if not already existing, this track focuses on the view and navigation from existing points).
