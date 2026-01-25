# Spec: Project Detail UI Refinement & Grid Placeholders

## Overview
Improve the Project Detail page UI to enhance clarity, professional feel, and capacity visibility. This includes styling section headers, introducing a "Grid Placeholder" component to visualize free capacity, and refactoring the planned missions list to match a cleaner, more structured design.

## Functional Requirements

### 1. Section Title Styling
- Add a small rounded rectangle icon before section titles.
- **Color Coding:**
    - Blue (`#3B82F6` or similar primary blue) for "Active Missions".
    - Gray (`#9CA3AF` or similar neutral gray) for "Planned Missions" (Not started).

### 2. Mission Status Indicators
- Display the count of missions at the far right of the section header line.
- Format: `X missions en cours` for active missions, `X missions en attente` for planned missions.

### 3. Grid Placeholder Component
- **Purpose:** Represent empty "slots" in a grid to visualize remaining capacity.
- **Visuals:** A card-sized container with a dashed border and centered, customizable text.
- **Behavior:** Dynamically fill the remainder of the grid row in the "Active Missions" section (e.g., if there are 1 or 2 missions in a 3-column layout, add placeholders to complete the row of 3).

### 4. Planned Missions List Refactoring
- **Structure:** A contained list with rounded corners and subtle border.
- **Styling:** 
    - Subtle horizontal separators between items.
    - Subtle background change on hover.
- **Columns:**
    - **Mission:** Title and brief description/ID.
    - **Type:** Mission type badge.
    - **Charge Estimée:** Estimated effort (e.g., "3.5 jours").
    - **Priorité:** Displays "n/a" in a very light gray text.
- **Interactions:** 
    - Clicking anywhere on the row navigates to the mission detail page.
    - **Hover Actions:** A "three dots" (ellipsis) menu appears on hover at the end of the row, allowing "Edit" and "Delete" actions (matching the Active Missions card functionality).

## Non-Functional Requirements
- **Consistency:** Use existing Tailwind CSS and Shadcn/ui patterns.
- **Reusability:** The `GridPlaceholder` should be a standalone component usable in other grids.

## Acceptance Criteria
- [ ] Section headers have the correct color-coded rectangle and mission counts.
- [ ] Active missions grid fills up to 3 columns with `GridPlaceholder` components.
- [ ] Planned missions are displayed in the new list format with hover effects.
- [ ] Clicking a planned mission row navigates to its detail page.
- [ ] Hovering over a planned mission row reveals an ellipsis menu with Edit/Delete options.
- [ ] The Priority column displays "n/a" in light gray.

## Out of Scope
- Implementing actual priority logic or data.
- Modifying the mission detail pages themselves.
