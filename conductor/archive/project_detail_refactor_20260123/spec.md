# Track Specification: Project Detail Refactor & Sidebar Navigation Fix

## Overview
This track aims to improve UI consistency by reusing the standard `MissionCard` component within the Project Detail page and fixing a navigation bug where the "Projects" sidebar item (and potentially others) fails to highlight when active.

## Functional Requirements

### 1. MissionCard Component Reuse
- **Target:** `app/projects/[id]/page.tsx` (or the relevant sub-component listing missions).
- **Change:** Replace the existing mission listing logic/components with the `MissionCard` component found in `components/missions/mission-card.tsx`.
- **Behavior:** The `MissionCard` must function identically to its usage on the main "Missions" page, including all actions and display elements.

### 2. Sidebar Navigation Highlighting Fix
- **Target:** `components/layout/sidebar.tsx`.
- **Bug:** The sidebar menu items do not correctly reflect the active state based on the current URL path.
- **Fix:** Update the active link detection logic to ensure that:
    - The "Projects" item is highlighted when the user is on `/projects` or any sub-path (e.g., `/projects/[id]`).
    - The active state logic is robust across all sidebar navigation links.

## Non-Functional Requirements
- **Consistency:** Ensure the look and feel of mission cards in project details matches the rest of the application.
- **Maintainability:** Use a centralized logic for active path detection to prevent similar bugs in the future.

## Acceptance Criteria
- [ ] Navigating to `/projects` highlights the "Projects" item in the sidebar.
- [ ] Navigating to `/projects/[id]` (any project) keeps the "Projects" item highlighted in the sidebar.
- [ ] All other sidebar links (e.g., "Missions") highlight correctly when active.
- [ ] The Project Detail page displays missions using the `MissionCard` component.
- [ ] All actions on the `MissionCard` (Edit, Delete, etc.) work correctly within the Project Detail context.

## Out of Scope
- Modifying the `MissionCard` layout specifically for the Project Detail view.
- Adding new features to the sidebar beyond fixing the active state highlighting.