# Track Specification: Mission Detail Actions Menu

## Overview
Add a centralized "Actions" menu (Dropdown) to the Mission Detail page (`MissionHeaderHero` component) to provide quick access to administrative tasks such as editing and deleting a mission.

## Functional Requirements
- **Menu Location:** Top-right corner of the `MissionHeaderHero` component, aligned with the existing settings button.
- **Menu Trigger:** A "three dots" icon button (`MoreVertical` or `MoreHorizontal` from Lucide).
- **Actions:**
    - **Modifier (Edit):** Opens the existing `EditMissionModal`. The modal should be pre-filled with the current mission data.
    - **Supprimer (Delete):** Opens the existing `DeleteMissionDialog` for confirmation. Upon confirmation, the mission should be deleted and the user redirected to the projects or dashboard page.
- **State Management:** The menu must handle the open/close state of the Edit Modal and the Delete Dialog.

## Non-Functional Requirements
- **Consistency:** Use existing UI components (`DropdownMenu`, `EditMissionModal`, `DeleteMissionDialog`).
- **User Experience:** Ensure the deletion confirmation is clear and prevents accidental data loss.
- **Responsive Design:** The menu should be easily accessible on mobile devices.

## Acceptance Criteria
- [ ] A vertical ellipsis icon button is visible in the mission header.
- [ ] Clicking the icon opens a dropdown menu with "Modifier" and "Supprimer" options.
- [ ] Clicking "Modifier" opens the `EditMissionModal` with correct data.
- [ ] Saving changes in the `EditMissionModal` updates the mission and refreshes the view.
- [ ] Clicking "Supprimer" opens the `DeleteMissionDialog`.
- [ ] Confirming deletion removes the mission and redirects the user.
- [ ] Canceling either action closes the respective modal/dialog without changes.

## Out of Scope
- Adding new fields to the mission model.
- Implementing bulk actions.
