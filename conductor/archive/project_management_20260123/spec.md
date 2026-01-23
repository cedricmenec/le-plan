# Track Specification: Project Management (CRUD)

## Overview
This track implements the "Project" entity to allow users to group missions by high-level objectives or clients. It provides a dedicated management page with a grid of `ProjectCard` components and modals for Creating, Editing, and Deleting projects.

## Functional Requirements

### 1. Data Model (`Project`)
- **Name**: Required string.
- **Label**: Optional string (short identifier).
- **Description**: Optional text.
- **Status**: Enum (`active`, `archived`). Defaults to `active`.
- **Color**: String (hex or tailwind class) chosen from a predefined selection.
- **Relations**: A Project has many Missions.

### 2. Project Management Page
- Accessible via the "Projects" link in the sidebar.
- Displays a grid of `ProjectCard` components.
- By default, filters out `archived` projects (MVP will focus on `active`).
- Includes an "Add Project" button that opens a creation dialog.

### 3. ProjectCard Component
- Displays:
    - **Name** and **Label**.
    - **Color** indicator (e.g., a colored border or badge).
    - **Statistics**: Count of incomplete tasks (Active/Not Started) across all missions in the project.
- **Actions Menu**: "Three dots" (horizontal) icon with options:
    - **Edit**: Opens the edit modal.
    - **Delete**: Disabled if the project has missions attached, with a tooltip explaining that missions must be removed or deleted first, and noting that "Archive" is coming soon.

### 4. Forms (Create/Edit)
- **Fields**: Name (required), Label, Description, Status (toggle/select), Color selection.
- **Color Picker**: A predefined palette of 6-8 colors.
- **Validation**: Name is mandatory.

## Non-Functional Requirements
- **Consistency**: Use existing UI patterns (Shadcn/ui, Lucide icons, horizontal three-dots menu).
- **Feedback**: Tooltips for disabled actions and toast notifications for CRUD success/failure.

## Acceptance Criteria
- [ ] Users can create a project with a name and color.
- [ ] Users can view their active projects in a grid.
- [ ] Users can edit project details including its status.
- [ ] Users CANNOT delete a project that has missions attached.
- [ ] The delete button shows a helpful tooltip when disabled.
- [ ] The project card accurately reflects the number of pending tasks from its missions.

## Out of Scope
- Global search for projects.
- Complex "Archive" view (archived projects are simply filtered out for now).
- Icon selection for projects (deferred to later, only Color is implemented).
