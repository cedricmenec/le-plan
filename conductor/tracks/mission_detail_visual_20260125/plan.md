# Implementation Plan: Mission Detail Header & Timeline Visualization

This plan covers the restructuring of the mission detail page header and the implementation of a new "hero" visual block featuring a minimalist horizontal timeline.

## Phase 1: Logic & Utils Preparation [checkpoint: 9d198d2]

- [x] Task: Create date calculation utilities for the timeline (6c1696f)
- [x] Task: Conductor - User Manual Verification 'Logic & Utils Preparation' (Protocol in workflow.md) (9d198d2)

## Phase 2: Component Development [checkpoint: 6018ddb]

- [x] Task: Create `MissionTimeline` component (d4047cd)
    - [ ] Write tests for `MissionTimeline` in `components/missions/mission-timeline.test.tsx`.
    - [ ] Implement `MissionTimeline` using Tailwind CSS and Lucide icons.
    - [ ] Ensure responsiveness and "n/a" handling for missing dates.
- [x] Task: Create `MissionHeaderHero` component (4cd2e0b)
    - [ ] Write tests for `MissionHeaderHero` in `components/missions/mission-header-hero.test.tsx`.
    - [ ] Implement `MissionHeaderHero` to group: Project name, Mission title, badges, and the `MissionTimeline`.
    - [ ] Integrate "Danger" alert logic if Estimated > Desired delivery.
- [x] Task: Conductor - User Manual Verification 'Component Development' (Protocol in workflow.md) (6018ddb)

## Phase 3: Integration & Refactoring [checkpoint: a2c1d49]

- [x] Task: Integrate `MissionHeaderHero` into the Mission Detail Page (3f59577)
- [x] Task: UI Polish - MissionTimeline Refinement (match screenshot) (119b453)
- [x] Task: Verification & Cleanup (a2c1d49)
- [x] Task: Conductor - User Manual Verification 'Integration & Refactoring' (Protocol in workflow.md) (a2c1d49)
