# Implementation Plan: Mission Detail Header & Timeline Visualization

This plan covers the restructuring of the mission detail page header and the implementation of a new "hero" visual block featuring a minimalist horizontal timeline.

## Phase 1: Logic & Utils Preparation

- [x] Task: Create date calculation utilities for the timeline (6c1696f)
    - [ ] Write tests in `lib/utils.test.ts` for timeline percentage calculations (start, end, duration).
    - [ ] Implement `calculateTimelineMetrics` in `lib/utils.ts` to return percentages and status (danger).
- [ ] Task: Conductor - User Manual Verification 'Logic & Utils Preparation' (Protocol in workflow.md)

## Phase 2: Component Development

- [ ] Task: Create `MissionTimeline` component
    - [ ] Write tests for `MissionTimeline` in `components/missions/mission-timeline.test.tsx`.
    - [ ] Implement `MissionTimeline` using Tailwind CSS and Lucide icons.
    - [ ] Ensure responsiveness and "n/a" handling for missing dates.
- [ ] Task: Create `MissionHeaderHero` component
    - [ ] Write tests for `MissionHeaderHero` in `components/missions/mission-header-hero.test.tsx`.
    - [ ] Implement `MissionHeaderHero` to group: Project name, Mission title, badges, and the `MissionTimeline`.
    - [ ] Integrate "Danger" alert logic if Estimated > Desired delivery.
- [ ] Task: Conductor - User Manual Verification 'Component Development' (Protocol in workflow.md)

## Phase 3: Integration & Refactoring

- [ ] Task: Integrate `MissionHeaderHero` into the Mission Detail Page
    - [ ] Update `app/missions/[id]/page.tsx` to use the new hero component.
    - [ ] Reposition Project Name above the title.
    - [ ] Remove the redundant metrics grid from the bottom of the page.
- [ ] Task: Verification & Cleanup
    - [ ] Run full test suite: `npm test`.
    - [ ] Verify visual alignment and responsiveness on mobile/desktop.
- [ ] Task: Conductor - User Manual Verification 'Integration & Refactoring' (Protocol in workflow.md)
