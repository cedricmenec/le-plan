# Implementation Plan: Recently Completed Missions Component

This plan covers the creation of a new component to display missions completed in the last 7, 15, or 30 days, integrated into the Project Detail page.

## Phase 1: Data Access & Logic
- [ ] Task: Update Database Types (if needed) and verify `completed_at` and `started_at` (in-progress) fields.
- [ ] Task: Implement a utility function or server action to fetch completed missions for a project with a date filter.
    - [ ] Add `getRecentlyCompletedMissions(projectId, days)` in `app/projects/actions.ts`.
- [ ] Task: Implement calculation logic for "Actual Load" (sum of tasks) and "Duration".
    - [ ] Ensure `lib/load-utils.ts` or similar has the necessary helpers.

## Phase 2: Component Development (TDD)
- [ ] Task: Create `RecentlyCompletedMissions` component.
    - [ ] Write tests for the component's rendering and filtering logic.
    - [ ] Implement the component using Shadcn/ui (Table, Dropdown Menu).
    - [ ] Ensure columns match: Type, Mission, Actual Load, Duration.
- [ ] Task: Implement the filter dropdown.
    - [ ] Default to 15 days.
    - [ ] Update the list when selecting 7 days or 1 month.

## Phase 3: Integration
- [ ] Task: Integrate the component into the Project Detail page.
    - [ ] Place at the bottom of `app/projects/[id]/page.tsx` (or the relevant detail component).
    - [ ] Verify layout and responsive behavior.
- [ ] Task: Final UI polish and verification.

## Phase 4: Finalization
- [ ] Task: Conductor - User Manual Verification 'Recently Completed Missions' (Protocol in workflow.md)
