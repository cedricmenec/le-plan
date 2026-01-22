# Implementation Plan: Main Layout & Active Mission List

This plan refactors the application's root layout and mission display to align with a modern dashboard structure.

## Phase 1: Dashboard Foundation & Navigation

- [x] Task: Create `Sidebar` component with navigation links and branding
    - Create `components/layout/sidebar.tsx` with Lucide icons
    - Implement responsive behavior (hidden on mobile, fixed on desktop)
- [x] Task: Create `DashboardHeader` component
    - Create `components/layout/dashboard-header.tsx`
    - Include title, description, and "Quick Add Mission" button placeholder
- [x] Task: Refactor Root Layout
    - Update `app/layout.tsx` to include the `Sidebar`
    - Ensure correct main content area with proper padding/max-width
- [x] Task: Conductor - User Manual Verification 'Phase 1: Dashboard Foundation' (Protocol in workflow.md) [checkpoint: 8ddac5a]

## Phase 2: Mission Creation Flow Refactoring

- [x] Task: Implement `AddMissionDialog`
    - Create `components/missions/add-mission-dialog.tsx` using shadcn `Dialog`
    - Move `MissionForm` into this dialog
- [x] Task: Update `DashboardHeader` with Dialog trigger
    - Connect the "Quick Add Mission" button to the `AddMissionDialog`
- [x] Task: Clean up `app/page.tsx`
    - Remove the permanent `MissionForm` sidebar
    - Integrate `DashboardHeader` and the refreshed `MissionList`
- [x] Task: Conductor - User Manual Verification 'Phase 2: Mission Creation Flow' (Protocol in workflow.md) [checkpoint: e783987]

## Phase 3: Mission List & Card Refresh

- [ ] Task: Refactor `MissionList` for Grid Layout
    - Update `components/missions/mission-list.tsx` to use a responsive grid (1/2/3 columns)
- [ ] Task: Enhance `MissionCard` visuals
    - Update mission cards with type icons, confidence indicators, and a progress bar (mocked)
    - Ensure style alignment with the dashboard aesthetic
- [ ] Task: Verify overall responsiveness and final touches
    - Check mobile view and navigation
    - Ensure all placeholder links are styled correctly
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Mission List & Card Refresh' (Protocol in workflow.md)
