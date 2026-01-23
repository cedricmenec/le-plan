# Specification: Project Detail View with Dashboard & Breadcrumbs

## 1. Overview
Implement a dedicated detail view for a Project. This page provides a high-level overview of the project's progress via a dashboard and a filtered list of associated missions. It also introduces a breadcrumb navigation system for improved context.

## 2. Functional Requirements

### 2.1 Navigation & Breadcrumbs
- Implement a `Breadcrumb` UI component.
- Display the breadcrumb at the top of the project detail page.
- Format: `Projects` (Link to project grid) `>` `[Project Name]` (Current page).

### 2.2 Project Dashboard (Top Section)
- **Task Statistics:** Display a breakdown of tasks by their current status.
- **Remaining Workload Estimation:** 
    - Calculate and display the total estimated days remaining.
    - Calculation includes all missions that are "Active" (started, not finished) or "Not Started".
- **Visual Style:** Use Metric Cards to display these key indicators prominently.

### 2.3 Mission List (Bottom Section)
- Display a list of missions associated with the project.
- **Default View:** Only show "Active" missions (Status: In Progress/Started and not Completed).
- **Filtering:** 
    - Provide a simple toggle to include "Not Started" missions in the list.
- **Exclusion:** "Completed" missions are NOT displayed in this view (reserved for a future "History" view).

## 3. Technical Requirements
- **Page Route:** `/projects/[id]`
- **Data Fetching:** Fetch project details and related missions from Supabase.
- **State Management:** Handle the "Show Not Started" toggle state locally.
- **UI Components:** 
    - Reuse `MissionList` or similar components if possible.
    - Create a new `Breadcrumb` component using `shadcn/ui` patterns.

## 4. Acceptance Criteria
- [ ] User can navigate to a project detail page from the project grid.
- [ ] Breadcrumbs correctly show `Projects > [Current Project Name]`.
- [ ] Dashboard cards accurately display task counts and remaining workload.
- [ ] Mission list defaults to active missions only.
- [ ] Toggle correctly adds/removes "Not Started" missions from the list.
- [ ] "Completed" missions are never shown.

## 5. Out of Scope
- Historical view of completed missions.
- Editing project details from this view (separate track).
- Advanced multi-status filtering beyond the "Not Started" toggle.
