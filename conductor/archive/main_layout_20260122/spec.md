# Specification: Main Layout & Active Mission List Implementation

## Overview
This track involves refactoring the application's root layout and mission display to align with the "Active Missions Dashboard" design sample. The goal is to provide a more professional, clear, and focused interface for managing missions, moving away from the initial two-column layout to a more modern dashboard structure.

## Functional Requirements

### 1. Main Dashboard Layout
- **Sidebar (Desktop):** A persistent left sidebar containing:
    - App Logo/Branding.
    - Navigation links: Dashboard, Missions (active), Projects, History, Settings.
    - Logout button at the bottom.
- **Header:**
    - Page title ("Active Missions") and description.
    - "Filter" button (UI placeholder).
    - "Quick Add Mission" button.
- **Main Content Area:** A scrollable area with a max-width container for the mission grid.

### 2. Mission Creation Flow
- Remove the permanent `MissionForm` from the main page.
- Implement a `Dialog` (shadcn/ui) that hosts the `MissionForm`.
- Trigger this dialog via the "Quick Add Mission" button.

### 3. Enhanced Mission List & Cards
- **Grid Layout:** Missions displayed in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop).
- **Mission Cards:** Refactor `MissionList` cards to include:
    - **Header:** Mission type icon/badge and confidence score indicator (e.g., "90%").
    - **Body:** Mission title and parent project tag.
    - **Progress:** A visual progress bar. *Note: Since actual progress data isn't available yet, this will use mock/calculated values for visual fidelity.*
    - **Footer:** Last updated timestamp and action buttons (Edit/Delete).

## Non-Functional Requirements
- **Visual Consistency:** Use existing project fonts, Tailwind colors, and Lucide React icons.
- **Responsiveness:** The layout must work on mobile (sidebar hidden or accessible via menu) and desktop.
- **Maintainability:** Reuse existing components (`MissionForm`, `MissionList`, `MissionActions`) while updating their layout/styling.

## Acceptance Criteria
- [ ] The application uses the new dashboard layout with a sidebar.
- [ ] Clicking "Quick Add Mission" opens a modal to create a mission.
- [ ] Successfully creating a mission closes the modal and refreshes the list.
- [ ] Missions are displayed in a responsive grid.
- [ ] Mission cards show a progress bar and confidence indicator.
- [ ] Sidebar navigation items (other than Missions/Logout) are present but clearly indicated as placeholders.

## Out of Scope
- Implementation of Projects, History, or Settings pages.
- Backend implementation of "Hours Logged" or real-time progress tracking.
- Advanced filtering logic.
