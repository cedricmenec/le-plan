# Implementation Plan - Project Management (CRUD)

This plan covers the implementation of the Project entity, its database schema, and the management interface (listing, creation, edition, and deletion with constraints).

## Phase 1: Foundation & Schema
- [x] Task: Update Database Schema 58b5c20
    - [x] Create `projects` table in Supabase (id, created_at, user_id, name, label, description, status, color).
    - [x] Add `project_id` foreign key to `missions` table.
    - [x] Update RLS policies for the `projects` table.
- [x] Task: Update Types and Client 86f7c2f
    - [x] Update Database types (run supabase gen types or manual update).
    - [x] Add project-related helper functions in Supabase client if necessary.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Schema' (Protocol in workflow.md)

## Phase 2: Core Components & Data Fetching
- [ ] Task: Implement Project Service/Actions
    - [ ] Create server actions for `getProjects`, `createProject`, `updateProject`, and `deleteProject`.
- [ ] Task: Create ProjectCard Component
    - [ ] Implement UI for `ProjectCard` with name, label, color indicator, and task statistics.
    - [ ] Add the "three-dots" horizontal menu for Edit/Delete actions.
    - [ ] Implement the disabled Delete button logic with tooltip.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Components & Data Fetching' (Protocol in workflow.md)

## Phase 3: Project Management Page & CRUD UI
- [ ] Task: Implement Projects Page
    - [ ] Create `app/projects/page.tsx`.
    - [ ] Implement the grid layout for `ProjectCard`s.
    - [ ] Add "Add Project" button and logic.
- [ ] Task: Implement ProjectForm (Create/Edit)
    - [ ] Create a reusable `ProjectForm` component.
    - [ ] Implement predefined color palette selection.
    - [ ] Integrate with `AddProjectDialog` and `EditProjectModal`.
- [ ] Task: Update Sidebar
    - [ ] Ensure the "Projects" link in the sidebar correctly navigates to `/projects`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Project Management Page & CRUD UI' (Protocol in workflow.md)

## Phase 4: Integration & Refinement
- [ ] Task: Update Mission Form
    - [ ] Allow associating a mission with a project during creation/edition.
- [ ] Task: Final Polish & UX
    - [ ] Add toast notifications for all CRUD operations.
    - [ ] Ensure responsive behavior for the project grid.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Refinement' (Protocol in workflow.md)
