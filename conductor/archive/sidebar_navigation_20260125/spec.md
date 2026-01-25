# Specification: Sidebar Navigation Enhancement

## Overview
This track aims to improve navigation by providing direct access to individual projects from the sidebar. It reorganizes the main navigation items to prioritize the Project Dashboard and introduces a collapsible "Projects" folder that lists all available projects.

## Functional Requirements

### 1. Navigation Menu Reordering
- The sidebar menu items shall be reordered as follows:
    1. **Dashboard**: A new top-level item pointing to the current Project Dashboard (`/projects`).
    2. **Projects**: A collapsible folder containing a list of individual projects.
    3. **Missions**: The existing missions navigation item, moved after the Projects folder.

### 2. "Dashboard" Menu Item
- **Label**: "Dashboard"
- **Icon**: Appropriate icon (e.g., `LayoutDashboard` from Lucide).
- **Target**: Navigates to the main projects listing page (`/projects`).

### 3. "Projects" Collapsible Folder
- **Behavior**:
    - Clicking the "Projects" label toggles the expansion/collapse of the project list.
    - It does **not** trigger navigation when the label itself is clicked.
    - By default, the folder is **expanded** to show all projects.
- **Content**:
    - Displays a list of all active projects fetched from the database.
    - Each item represents a project with an **Icon + Project Name**.
    - Clicking a project item navigates directly to that project's detail page (`/projects/[id]`).
- **Dynamic State**:
    - If the user navigates to a project detail page (e.g., via a link), the "Projects" folder should automatically expand to reveal and highlight the active project.

### 4. Visual Design
- Maintain consistency with the existing sidebar styling (Shadcn/ui + Tailwind).
- Sub-items (projects) should be slightly indented to clearly indicate hierarchy.
- Use Lucide icons for all menu items.

## Non-Functional Requirements
- **Performance**: Project list fetching should be efficient and integrated into the layout's data requirements.
- **Accessibility**: Ensure the collapsible folder and its items are keyboard-accessible and screen-reader friendly.

## Acceptance Criteria
- [ ] The sidebar displays items in the order: Dashboard, Projects (folder), Missions.
- [ ] Clicking "Dashboard" navigates to `/projects`.
- [ ] Clicking the "Projects" label toggles the sub-menu without navigating.
- [ ] Individual project links in the sidebar navigate to the correct `/projects/[id]` pages.
- [ ] The "Projects" folder is open by default on initial load.
- [ ] Navigating to a project page automatically expands the "Projects" folder in the sidebar.

## Out of Scope
- Direct CRUD operations (Create/Edit/Delete) for projects from within the sidebar sub-menu.
- Displaying mission counts or progress indicators within the sidebar project items.
