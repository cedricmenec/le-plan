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

## Phase 2: Data Access & Sorting [checkpoint: 4bef452]
- [x] Task: Update `getProjects` server action
    - [x] Modify `app/projects/actions.ts` to sort projects by `name` ascending
    - [x] Ensure missions are being fetched along with projects (needed for the card summary)
    - [x] Update existing tests in `app/projects/actions.test.ts`
- [x] Task: Conductor - User Manual Verification 'Phase 2: Data Access & Sorting' (Protocol in workflow.md)

## Phase 3: UI Components Enhancement [checkpoint: 53aa278]
- [x] Task: Refactor `ProjectCard` component
    - [x] Implement Hero image section with 16:9 aspect ratio and placeholder fallback
    - [x] Add active missions section (max 3, sorted by estimated delivery date)
    - [x] Add "missions à venir" count in the footer
    - [x] Integrate `formatRelativeDuration` for mission deadlines
    - [x] Update styles to match the modern "hero" layout
- [x] Task: Update `ProjectGrid` tests
    - [x] Update `components/projects/project-grid.test.tsx` and `project-card.test.tsx` to reflect new UI structure and data requirements
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Components Enhancement' (Protocol in workflow.md)
