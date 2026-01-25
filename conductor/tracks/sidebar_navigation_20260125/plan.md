# Implementation Plan: Sidebar Navigation Enhancement

This plan outlines the steps to refactor the sidebar navigation to include a direct project list and reorder main navigation items.

## Phase 1: Data Access & Types
Prepare the necessary data fetching to retrieve the list of projects for the sidebar.

- [x] Task: Ensure sidebar has access to project list.
    - [x] Identify if `Sidebar` component or its parent needs to fetch the projects list from Supabase.
    - [x] Update types if necessary to include project navigation items.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Access & Types' (Protocol in workflow.md)

## Phase 2: Sidebar Component Refactoring
Modify the sidebar UI to support collapsible folders and the new navigation structure.

- [x] Task: Update Sidebar structure and reorder items.
    - [x] Add "Dashboard" link at the top (pointing to `/projects`).
    - [x] Move "Missions" link below the new "Projects" folder.
    - [x] Implement the collapsible "Projects" folder structure using Shadcn/ui components.
- [x] Task: Implement project list in sidebar.
    - [x] Map through the fetched projects to create sub-navigation items.
    - [x] Use Icon + Project Name for each item.
    - [x] Add indentation for sub-items.
- [x] Task: Implement auto-expansion logic.
    - [x] Add logic to expand the "Projects" folder if the current pathname matches a project detail route (`/projects/[id]`).
    - [x] Ensure the folder is expanded by default on initial load.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Sidebar Component Refactoring' (Protocol in workflow.md)

## Phase 3: Verification & Polish
Ensure the new navigation works correctly across all pages and handle edge cases.

- [x] Task: Write tests for the updated Sidebar.
    - [x] Verify "Dashboard" link presence and target.
    - [x] Verify "Projects" folder toggle behavior (no navigation on label click).
    - [x] Verify navigation to individual projects from the sidebar.
    - [x] Verify auto-expansion logic when on a project page.
- [x] Task: Final UI polish.
    - [x] Ensure icons and spacing match the project's design system.
    - [x] Verify responsiveness and mobile sidebar behavior.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification & Polish' (Protocol in workflow.md)
