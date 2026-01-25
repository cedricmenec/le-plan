# Specification: Milestone Management (Edit & Delete)

## Overview
This track aims to complete the Milestone management lifecycle by adding Edit and Delete capabilities. To maintain a clean UI, these actions will be accessible via a contextual menu that appears only on hover with a deliberate delay.

## Functional Requirements

### 1. Contextual Action Menu
- **Trigger:** A `MoreVertical` (three dots) icon button.
- **Visibility:** The button is hidden by default and only appears when the user hovers over a milestone item.
- **Delay:** A 1-second hover delay is required before the button becomes visible (Navigation Best Practice).
- **Exit Behavior:** The button disappears immediately when the mouse leaves the milestone item.

### 2. Deletion with Inline Confirmation
- **Interaction:** Within the dropdown menu, clicking "Supprimer" will change the item's label to "Confirmer ?".
- **Execution:** A second click on "Confirmer ?" triggers the `deleteMilestone` server action.
- **Feedback:** A success toast is displayed after deletion, and the UI is updated.

### 3. Edition Dialog
- **Interaction:** Clicking "Modifier" in the dropdown menu opens the `EditMilestoneDialog`.
- **Scope:** All fields (Type, Date, Title, Note) are editable.
- **Persistence:** Uses the `updateMilestone` server action.

## Non-Functional Requirements
- **Consistency:** Use the existing `DropdownMenu` component pattern from Shadcn/ui.
- **Performance:** Ensure the hover delay and transition feel deliberate but responsive.

## Acceptance Criteria
- [ ] Milestone action button appears only after 1s of hovering over the item.
- [ ] Milestone action button disappears immediately on mouse leave.
- [ ] Clicking "Supprimer" requires a second confirmation click ("Confirmer ?") within the menu.
- [ ] Clicking "Modifier" opens a functional edition dialog with pre-filled data.
- [ ] All milestone fields are successfully updatable.
- [ ] Deletion successfully removes the milestone from the database and UI.
