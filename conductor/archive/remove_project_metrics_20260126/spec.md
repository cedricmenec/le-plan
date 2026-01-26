# Specification: Remove Project Dashboard Metrics

## Overview
This track involves removing the summary metrics section from the Project detail page. This section currently displays cards for "En cours" (In Progress), "À faire" (To Do), and "Charge restante" (Remaining Workload). The goal is to simplify the UI and focus on the mission lists.

## Functional Requirements
- **Remove Metrics Section**: The three cards displaying mission counts and total workload must be removed from the Project detail page.
- **Cleanup**: The `ProjectDashboard` component and its associated unit tests should be deleted from the codebase as they are no longer used.

## Non-Functional Requirements
- **Layout Consistency**: The "Missions actives" section (and the rest of the content in `ProjectMissionList`) must shift up to fill the space previously occupied by the metrics, maintaining standard spacing and padding.
- **Maintain Stability**: Ensure that removing the component does not break the `ProjectMissionList` or the Project detail page.

## Acceptance Criteria
- [ ] The Project detail page no longer displays the "En cours", "À faire", and "Charge restante" cards.
- [ ] The missions list is positioned immediately below the "Retour aux projets" button (with appropriate spacing).
- [ ] The `components/projects/project-dashboard.tsx` file is deleted.
- [ ] The `components/projects/project-dashboard.test.tsx` file is deleted.
- [ ] The application builds and runs without errors.

## Out of Scope
- Any changes to the main Dashboard page (if it uses similar but distinct components).
- Changes to how missions are filtered or displayed beyond their position on the page.
