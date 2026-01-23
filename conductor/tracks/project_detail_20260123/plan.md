# Implementation Plan - Project Detail View with Dashboard & Breadcrumbs

This plan covers the implementation of the project detail page, including breadcrumbs, dashboard statistics, and a filtered mission list.

## Phase 1: Foundation & Navigation
- [x] Task: Create `Breadcrumb` UI component (915540c)
    - [ ] Define the `Breadcrumb` component using `shadcn/ui` patterns or a custom implementation if not available in the library.
    - [ ] Write unit tests for the `Breadcrumb` component to ensure it renders links and labels correctly.
- [x] Task: Implement Project Detail Page Route (546b4a2)
    - [ ] Create the page at `app/projects/[id]/page.tsx`.
    - [ ] Write tests to verify the page renders and fetches project data based on the ID.
- [x] Task: Integrate Breadcrumbs into Project Detail Page (546b4a2)
    - [ ] Add the `Breadcrumb` component to the top of the project detail page.
    - [ ] Verify that it displays `Projects > [Project Name]`.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Navigation' (Protocol in workflow.md)

## Phase 2: Data & Dashboard
- [ ] Task: Update Data Fetching for Project Missions
    - [ ] Implement a Supabase query to fetch missions for a specific project ID, including their status and estimations.
    - [ ] Write tests to ensure the data fetching logic correctly filters by project and retrieves necessary fields.
- [ ] Task: Create Dashboard Statistic Cards
    - [ ] Implement a `ProjectDashboard` component that displays Metric Cards for task counts (by status) and remaining workload.
    - [ ] Logic: Remaining workload = Sum of `estimated_days` for missions with status NOT 'Completed'.
    - [ ] Write unit tests for the dashboard logic and rendering.
- [ ] Task: Integrate Dashboard into Project Detail Page
    - [ ] Place the `ProjectDashboard` below the breadcrumbs.
    - [ ] Verify that statistics update correctly based on the fetched mission data.
- [ ] Task: Conductor - User Manual Verification 'Data & Dashboard' (Protocol in workflow.md)

## Phase 3: Filtered Mission List
- [ ] Task: Implement Mission Filtering Toggle
    - [ ] Add a "Show non-started missions" toggle (Switch or Checkbox) above the mission list.
    - [ ] Write tests for the toggle's state management.
- [ ] Task: Adapt Mission List for Project Detail View
    - [ ] Integrate a mission list component that filters based on the toggle state.
    - [ ] Filter logic:
        - Toggle OFF: Show only `In Progress`.
        - Toggle ON: Show `In Progress` and `Not Started`.
        - Always exclude `Completed`.
    - [ ] Write integration tests for the filtering logic.
- [ ] Task: Conductor - User Manual Verification 'Filtered Mission List' (Protocol in workflow.md)
