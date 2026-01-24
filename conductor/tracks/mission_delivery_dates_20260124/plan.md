# Implementation Plan: Delivery Dates for Missions

This plan implements two new optional fields for missions: `estimated_delivery_date` and `desired_delivery_date`, including UI updates, sorting logic, and validation.

## Phase 1: Database & Types Update [checkpoint: 8f09a83]
- [x] Task: Create Supabase migration to add `estimated_delivery_date` and `desired_delivery_date` to `missions` table. 207ff4d
- [x] Task: Update Database Types and Mission interfaces. d9d68c2
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Types Update' (Protocol in workflow.md) 8f09a83
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database & Types Update' (Protocol in workflow.md)

## Phase 2: Domain Logic & Helpers
- [ ] Task: Implement a utility function `formatRelativeDuration(date: Date): string` in `lib/utils.ts` to handle the approximation logic (days, weeks, 0.5 months).
- [ ] Task: Write tests for `formatRelativeDuration` covering all approximation cases.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Domain Logic & Helpers' (Protocol in workflow.md)

## Phase 3: Forms & Actions
- [ ] Task: Update `MissionForm` to include manual text inputs for the new dates.
- [ ] Task: Add validation logic to `MissionForm` (valid date format, past date warning).
- [ ] Task: Update `missions/actions.ts` to handle the new fields in `upsertMission`.
- [ ] Task: Update mission action tests to verify saving the new dates.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Forms & Actions' (Protocol in workflow.md)

## Phase 4: UI Integration & Sorting
- [ ] Task: Update `MissionCard` to display the relative duration if `estimated_delivery_date` exists.
- [ ] Task: Update Mission Detail page (`app/missions/[id]/page.tsx`) to display both dates.
- [ ] Task: Modify the default sorting logic in `getMissions` or relevant data fetching hooks to sort by `estimated_delivery_date`.
- [ ] Task: Update `MissionCard` and Detail view tests.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI Integration & Sorting' (Protocol in workflow.md)
