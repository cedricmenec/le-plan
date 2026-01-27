# Track Specification: Project Detail Empty State Placeholder

## Overview
When a user visits a Project Detail page that has no associated missions, the interface currently looks empty or incomplete. This track implements a "Ghost Grid" placeholder to provide visual structure and a clear call to action to create the first mission.

## Functional Requirements
- **Empty State Detection**: Detect when a project has zero associated missions on the Project Detail page (`/projects/[id]`).
- **Ghost Grid UI**: Display a set of faint, grayed-out "skeleton" mission cards to represent the future layout.
- **Call to Action**: Include a prominent "Create your first mission" button within or alongside the ghost grid.
- **Trigger Creation Flow**: Clicking the button must open the existing "Add Mission" dialog, with the current project automatically selected.

## Non-Functional Requirements
- **Visual Consistency**: The skeleton cards should mimic the dimensions and spacing of the actual `MissionCard` components used in the project grid.
- **Responsiveness**: The ghost grid must adapt to different screen sizes (mobile/desktop) just like the active mission grid.

## Acceptance Criteria
- [ ] If a project has missions, the standard mission grid is displayed.
- [ ] If a project has NO missions, the "Ghost Grid" placeholder is displayed instead.
- [ ] The "Create your first mission" button is clearly visible in the empty state.
- [ ] Clicking the button opens the `AddMissionDialog`.
- [ ] The `AddMissionDialog` is correctly linked to the current project.

## Out of Scope
- Adding placeholders to the main Dashboard or Projects List page.
- Modifying the existing "Add Mission" form logic itself.
