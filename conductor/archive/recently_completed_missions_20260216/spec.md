# Specification: Recently Completed Missions Component

## Overview
This track introduces a new component to display missions that have been recently completed. It aims to provide visibility into past achievements and historical data (actual load and duration) directly on the project detail page.

## Functional Requirements
- **Component Placement:** Displayed only on the **Project Detail Page**, positioned at the bottom, below the active missions and placeholders.
- **Visual Style:** Similar to the "Current Mission List" but with a table-like layout focusing on different data points.
- **Data Columns:**
  - **Type:** The mission type (Feature, Étude, Support, etc.).
  - **Mission:** The name/title of the mission.
  - **Actual Load (Charge réelle):** The sum of all task estimations for the mission.
  - **Duration:** The time elapsed between the date the mission status changed to "in progress" and the completion date. 
    - *Note:* If the "in progress" date is missing, display "n/a".
- **Filtering:**
  - Default view: Missions completed within the last **15 days**.
  - Filter options via a **Dropdown Menu**: 7 days, 15 days, 1 month.

## Non-Functional Requirements
- **Performance:** Efficiently query only completed missions for the specific project within the selected timeframe.
- **UI/UX:** Consistency with the existing dashboard aesthetic (Tailwind CSS, Shadcn/ui).

## Acceptance Criteria
- [ ] A "Recently Completed Missions" section appears at the bottom of the Project Detail page.
- [ ] The list displays missions completed within the default 15-day window.
- [ ] Users can change the filter window (7d, 15d, 1m) via a dropdown, and the list updates accordingly.
- [ ] Each row correctly displays Type, Mission Name, Actual Load (sum of tasks), and Duration (or "n/a").
- [ ] The UI matches the project's styling and feels integrated with the existing mission lists.

## Out of Scope
- Displaying this component on the global missions list page.
- Advanced custom date range pickers (beyond the 7d/15d/1m presets).
- Refined logic for capturing the "in progress" transition date if not already tracked in the database (will be addressed in a future track).
