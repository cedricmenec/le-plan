# Specification: Project Dashboard Mission Organization

## Overview
This track aims to improve the organization and readability of missions within the `ProjectDashboard` (and eventually the main mission list). It introduces a clear distinction between "Active Missions" (In Progress) and "Not Started" missions (Todo), using different UI components for each to optimize screen space and focus.

## Functional Requirements

### 1. Mission Categorization
- **Active Missions:** Missions with status `in_progress`.
- **Not Started Missions:** Missions with status `todo`.
- **Note:** `done` missions are excluded from these specific views by default.

### 2. UI Layout (Project Dashboard & Mission List)
- **Section 1: Active Missions**
    - **Component:** `MissionCard` (existing).
    - **Layout:** Adaptive grid with a maximum of 3 columns.
    - **Content:** Full details as currently displayed.
- **Section 2: Not Started Missions**
    - **Component:** New `CondensedMissionList` (or similar name).
    - **Layout:** Modern, condensed list format.
    - **Row Content:**
        - Mission Title
        - Type (via Icon or Badge)
        - Estimation (Charge)
        - Project Name (Only when viewed from the main Mission List, NOT within a `ProjectDashboard`)
        - Quick Actions (Edit/Delete - visible on hover or persistent)

### 3. Sorting Logic
Within both sections, missions must be sorted by:
1. **Estimated Delivery Date** (Ascending - soonest first).
2. **Creation Date** (Descending - newest first) for those without an estimated date.

## Non-Functional Requirements
- **Reusability:** Components created for the `ProjectDashboard` must be usable in the main `app/missions/page.tsx`.
- **Responsive Design:** The active missions grid must adapt to screen size (1 to 3 columns).

## Acceptance Criteria
- [ ] `ProjectDashboard` displays `in_progress` missions in a 3-column max grid.
- [ ] `ProjectDashboard` displays `todo` missions in a condensed list below the active ones.
- [ ] The condensed list shows Title, Type, Estimation, and Quick Actions.
- [ ] The condensed list shows the Project Name ONLY on the main mission list page.
- [ ] Sorting follows the "Delivery Date > Creation Date" logic.
- [ ] "Done" missions are correctly filtered out of these specific sections.
