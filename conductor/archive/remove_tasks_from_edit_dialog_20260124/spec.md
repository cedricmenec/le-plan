# Track Specification - Remove Task List from Mission Edit Dialog

## Overview
This track aims to simplify the `EditMissionModal` by removing the `TaskList` component. This will reduce visual clutter and focus the dialog on editing mission-level attributes, as tasks are already comprehensively managed on the dedicated Mission Detail page.

## Functional Requirements
- Remove the `TaskList` component and its associated imports from `components/missions/edit-mission-modal.tsx`.
- Remove the visual separator (border and padding) that preceded the task list in the dialog.
- Move the "Projet (Optionnel)" field to the top of the form, above the "Titre" field.
- Ensure the dialog remains functional and visually balanced after the removal and reordering.

## Non-Functional Requirements
- Maintain existing coding standards and UI consistency using Shadcn/UI and Tailwind CSS.
- Ensure no regressions in mission attribute editing (title, type, goal, notes, etc.).

## Acceptance Criteria
- [ ] The `TaskList` component is no longer visible in the "Modifier la mission" dialog.
- [ ] The dialog height is reduced, focusing only on mission fields.
- [ ] Users can still edit and save all mission fields (Title, Type, Status, Goal, Notes, Dates, Estimation, Confidence, Project).
- [ ] Automated tests for `EditMissionModal` pass.

## Out of Scope
- Adding navigation or links to the Mission Detail page from the edit dialog.
- Modifying the `TaskList` component itself or its behavior on the Mission Detail page.
