# Implementation Plan: Mission Priority Management

This plan outlines the steps to add a "Priority" field to Missions, including database updates, UI components, and integration into existing views.

## Phase 1: Database & Schema [checkpoint: 9ead29c]
- [x] Task: Create Supabase migration to add `priority` column to `missions` table
    - [x] Create migration file `supabase/migrations/<timestamp>_add_priority_to_missions.sql`
    - [x] Add `priority` column as `TEXT` with `DEFAULT 'medium'` and `CHECK` constraint
    - [x] Run migration against local Supabase instance
- [x] Task: Update TypeScript types
    - [x] Update `types/database.types.ts` (or re-generate) to include the new `priority` field
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Schema' (Protocol in workflow.md)

## Phase 2: Core UI Components [checkpoint: 5d3c49d]
- [x] Task: Create `PriorityBadge` component
    - [x] Implement a reusable badge using `shadcn/ui` Badge
    - [x] Define color mapping and icon mapping for `low`, `medium`, `high`, `critical`
    - [x] Write unit tests for rendering different priority states
- [x] Task: Create `PrioritySelect` component
    - [x] Implement a reusable select component using `shadcn/ui` Select
    - [x] Write unit tests for value selection
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core UI Components' (Protocol in workflow.md)

## Phase 3: Mission Management Integration [checkpoint: 863c2f2]
- [x] Task: Update Mission Actions
    - [x] Update `app/missions/actions.ts` to handle `priority` in `createMission` and `updateMission`
    - [x] Update existing tests in `app/missions/actions.test.ts`
- [x] Task: Update Add Mission Dialog
    - [x] Add `PrioritySelect` to `components/missions/add-mission-dialog.tsx`
    - [x] Update form schema and submission logic
    - [x] Update tests in `components/missions/add-mission-dialog.test.tsx`
- [x] Task: Update Edit Mission Modal
    - [x] Add `PrioritySelect` to `components/missions/edit-mission-modal.tsx`
    - [x] Update tests in `components/missions/edit-mission-modal.test.tsx`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Mission Management Integration' (Protocol in workflow.md)

## Phase 4: View Integration & In-line Editing
- [ ] Task: Implement In-line Editing on Mission Detail Page
    - [ ] Add `PriorityBadge` with `InlineEditableField` support in `app/missions/[id]/page.tsx`
    - [ ] Ensure the update action is correctly wired
    - [ ] Add/Update tests for `app/missions/[id]/page.test.tsx`
- [ ] Task: Update Project Detail Page List
    - [ ] Display `PriorityBadge` in the "Missions non commencées" list in `app/projects/[id]/page.tsx`
    - [ ] Update tests in `app/projects/[id]/page.test.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 4: View Integration & In-line Editing' (Protocol in workflow.md)
