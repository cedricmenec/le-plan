# Implementation Plan: Mission Card Improvements (Notes & Goals)

This plan covers the refactoring of the mission card into a standalone component and the enhancement of "notes" and "goals" fields with tooltips and hover interactions.

## Phase 1: Preparation & Refactoring [checkpoint: db7c16b]
- [x] Task: Create `MissionCard` component - Extract the mission card logic from `MissionList.tsx` into a new `components/missions/mission-card.tsx` file. [2cef0a8]
- [x] Task: Update `MissionList` - Replace the inline rendering logic with the new `MissionCard` component. [2cef0a8]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Refactoring' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Refactoring' (Protocol in workflow.md)

## Phase 2: Enhanced Goal Interaction
- [ ] Task: Implement Truncation Detection - Add logic (e.g., using a ref and `scrollHeight` vs `clientHeight`) to detect if the goal text is truncated.
- [ ] Task: Goal Tooltip - Wrap the goal text in a `Tooltip` that only activates when truncation is detected.
- [ ] Task: Goal Hover Style - Add Tailwind classes to change the goal text color on hover.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Enhanced Goal Interaction' (Protocol in workflow.md)

## Phase 3: Notes Icon & Tooltip Polish
- [ ] Task: Notes Icon - Ensure the `StickyNote` icon is correctly positioned and visible only when `notes` exist (already partially implemented in `MissionList`).
- [ ] Task: Notes Tooltip - Verify the `Tooltip` for notes is using consistent styling and handles long text correctly with `whitespace-pre-wrap`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Notes Icon & Tooltip Polish' (Protocol in workflow.md)
