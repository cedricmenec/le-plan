# Implementation Plan: Project Dashboard Mission Organization

Improve the project detail and mission list pages by splitting missions into "Active" (grid) and "Not Started" (condensed list) sections with specific sorting logic.

## Phase 1: Data Logic & Filtering [checkpoint: c4b181b]

- [x] Task: Update mission fetching/sorting logic. (71421ee)
    - [x] Update (or create a helper) to sort missions by `estimated_delivery_date` (ASC) then `created_at` (DESC).
    - [x] Add unit tests for this sorting logic in `lib/utils.test.ts` or a new utility file.
    - [x] Add unit tests for this sorting logic in `lib/utils.test.ts` or a new utility file.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Logic & Filtering' (Protocol in workflow.md) (c4b181b)

## Phase 2: Condensed UI Components [checkpoint: 0d7bb95]

- [x] Task: Create the `CondensedMissionList` and `CondensedMissionRow` components. (9ef44a0)
    - [x] Create `components/missions/condensed-mission-row.tsx` with Title, Type, Estimation, and Quick Actions. (9ef44a0)
    - [x] Add support for optional Project Name display in `CondensedMissionRow`. (9ef44a0)
    - [x] Create `components/missions/condensed-mission-list.tsx` to wrap the rows. (9ef44a0)
    - [x] Write unit tests for `CondensedMissionRow` (checking display logic for project name and actions). (9ef44a0)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Condensed UI Components' (Protocol in workflow.md) (0d7bb95)

## Phase 3: Project Dashboard Integration [checkpoint: b3b4150]

- [x] Task: Refactor `ProjectDashboard` to use the new layout. (58bbd33)
    - [x] Split missions into `in_progress` and `todo` arrays. (58bbd33)
    - [x] Render `in_progress` missions using the existing grid (max 3 cols). (58bbd33)
    - [x] Render `todo` missions using the new `CondensedMissionList`. (58bbd33)
    - [x] Update `components/projects/project-dashboard.test.tsx` to verify the split rendering. (58bbd33)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Project Dashboard Integration' (Protocol in workflow.md) (b3b4150)

## Phase 4: Mission List Integration [checkpoint: 98c1fce]

- [x] Task: Update the main Missions page (`app/missions/page.tsx`). (58bbd33)
    - [x] Apply the same split layout (Active Grid vs. Not Started Condensed List). (58bbd33)
    - [x] Ensure `CondensedMissionRow` displays the Project Name in this view. (58bbd33)
    - [x] Update `components/missions/mission-list.test.tsx` (if applicable) or add integration tests for the page. (58bbd33)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Mission List Integration' (Protocol in workflow.md) (98c1fce)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Mission List Integration' (Protocol in workflow.md)
