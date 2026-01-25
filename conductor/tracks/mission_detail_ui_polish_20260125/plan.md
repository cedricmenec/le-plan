# Implementation Plan: Mission Detail UI Polishing

## Phase 1: Header and Metadata Cleanup
Refactor the `MissionHeaderHero` component to reduce the title size, reorganize the metadata row, and remove shadows.

- [x] Task: Update `MissionHeaderHero.tsx` title styling and metadata layout (5e121d3)
    - [x] Change title font size from `text-5xl` to `text-3xl`
    - [x] Move Project Name, Type, and Status to a single row above the title
    - [x] Remove `shadow-md` and other shadow classes from the hero container
- [x] Task: Remove redundant metadata grid from Mission Detail page (5e121d3)
    - [x] Locate and remove the grid containing Estimation, Confidence, and Delivery Dates in `app/missions/[id]/page.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Header and Metadata Cleanup' (Protocol in workflow.md)

## Phase 2: Section Reorganization
Reorder the "Objectif Principal", "Timeline & Scheduling", and "Notes" sections in the main layout.

- [ ] Task: Reorder sections in `app/missions/[id]/page.tsx`
    - [ ] Move "Objectif Principal" block before the Timeline/Hero block
    - [ ] Ensure "Timeline & Scheduling" (currently integrated in `MissionHeaderHero`) is extracted or repositioned as requested
- [ ] Task: Remove remaining shadows from page components
    - [ ] Remove `shadow-sm` from the "Notes & Contexte" container in `app/missions/[id]/page.tsx`
    - [ ] Remove `shadow-md` from the Sidebar container in `app/missions/[id]/page.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Section Reorganization' (Protocol in workflow.md)

## Phase 3: Final Polishing & Verification
Ensure all styles are consistent and no shadows remain.

- [ ] Task: Audit `app/missions/[id]/page.tsx` and its components for any missed shadow classes
- [ ] Task: Verify the layout hierarchy matches the specification (Metadata -> Title -> Objective -> Timeline -> Notes)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Polishing & Verification' (Protocol in workflow.md)
