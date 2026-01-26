# Implementation Plan: Project Card Enhancement & Alphabetical Sorting

This plan covers the database migration, server action updates for alphabetical sorting, and the UI overhaul of the ProjectCard component.

## Phase 1: Database & Schema [checkpoint: 343fdec]
- [x] Task: Create Supabase migration to add `image_url` to `projects` table
    - [x] Create `supabase/migrations/<timestamp>_add_image_url_to_projects.sql`
    - [x] Add `image_url` column as `TEXT` (nullable)
    - [x] Run migration against local Supabase instance
- [x] Task: Update TypeScript types
    - [x] Update `types/database.types.ts` to include `image_url` in the projects table
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Schema' (Protocol in workflow.md)

## Phase 2: Data Access & Sorting
- [ ] Task: Update `getProjects` server action
    - [ ] Modify `app/projects/actions.ts` to sort projects by `name` ascending
    - [ ] Ensure missions are being fetched along with projects (needed for the card summary)
    - [ ] Update existing tests in `app/projects/actions.test.ts`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Data Access & Sorting' (Protocol in workflow.md)

## Phase 3: UI Components Enhancement
- [ ] Task: Refactor `ProjectCard` component
    - [ ] Implement Hero image section with 16:9 aspect ratio and placeholder fallback
    - [ ] Add active missions section (max 3, sorted by estimated delivery date)
    - [ ] Add "missions à venir" count in the footer
    - [ ] Integrate `formatRelativeDuration` for mission deadlines
    - [ ] Update styles to match the modern "hero" layout
- [ ] Task: Update `ProjectGrid` tests
    - [ ] Update `components/projects/project-grid.test.tsx` and `project-card.test.tsx` to reflect new UI structure and data requirements
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Components Enhancement' (Protocol in workflow.md)
