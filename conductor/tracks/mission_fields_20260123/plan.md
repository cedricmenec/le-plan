# Implementation Plan: Mission Goal and Notes Fields

This plan outlines the steps to add "Main Goal" and "Notes" fields to the Mission entity, covering database changes, type updates, and UI modifications in both forms and list views.

## Phase 1: Database and Types [checkpoint: 61dfc5c]
Add the new columns to the Supabase schema and ensure TypeScript reflects these changes.

- [x] Task: Create Supabase migration to add `goal` and `notes` columns to the `missions` table. e9da76a
- [x] Task: Update TypeScript database types in `types/database.types.ts`. cddf5e4
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database and Types' (Protocol in workflow.md)

## Phase 2: Form Updates
Update the mission form to allow users to input and edit the new fields.

- [ ] Task: Write failing tests for `mission-form.tsx` to include "Main Goal" and "Notes" fields.
- [ ] Task: Update `mission-form.tsx` to include the new `textarea` fields for `goal` and `notes`.
- [ ] Task: Update Zod schema (if used) and form submission logic to handle the new fields.
- [ ] Task: Verify that `add-mission-dialog.tsx` and `edit-mission-modal.tsx` correctly pass down data and handle submission.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Form Updates' (Protocol in workflow.md)

## Phase 3: UI Display Updates
Display the "Main Goal" and "Notes" tooltip in the mission list view.

- [ ] Task: Write failing tests for mission display (in `mission-list.tsx` or equivalent) to show the `goal` and `notes` icon.
- [ ] Task: Update the UI to display the "Main Goal" below the mission title.
- [ ] Task: Integrate `shadcn/ui` Tooltip to display "Notes" when hovering over the new icon.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Display Updates' (Protocol in workflow.md)

## Phase 4: Final Polish and Verification
Final verification of the end-to-end flow.

- [ ] Task: Run full test suite to ensure no regressions.
- [ ] Task: Verify mobile responsiveness for the new UI elements.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish and Verification' (Protocol in workflow.md)
