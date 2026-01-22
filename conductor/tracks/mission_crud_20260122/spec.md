# Specification: Mission Update and Delete Operations

## Overview
This track implements the ability for users to update existing mission details and delete missions. This completes the core CRUD (Create, Read, Update, Delete) lifecycle for missions within the application.

## User Interactions

### 1. Accessing Actions
- Each mission card in the `MissionList` will feature an "Actions" dropdown menu (using Shadcn UI `DropdownMenu`).
- Options: "Edit Mission" and "Delete Mission".

### 2. Updating a Mission
- **Trigger:** Clicking "Edit Mission" in the actions menu.
- **Interface:** A Modal/Dialog (using Shadcn UI `Dialog`).
- **Editable Fields:**
    - Title (Input)
    - Type (Select: Feature, Étude, Support, Documentation, Autre)
    - Estimation in days (Number Input)
    - Confidence score (Number Input)
    - Project Parent (Input)
    - Status (Select: e.g., todo, in_progress, done)
    - **Subtasks:** Users can manage (add/edit/delete) subtasks directly within this modal.
- **Feedback:** While saving, the modal/card should display a loading state.

### 3. Deleting a Mission
- **Trigger:** Clicking "Delete Mission" in the actions menu OR a "Delete" button inside the Edit Modal.
- **Safety:** A confirmation dialog (using Shadcn UI `AlertDialog`) must appear to prevent accidental deletion.
- **Feedback:** During deletion, the mission item should show a loading state before being removed from the list.

## Functional Requirements
- **Update Logic:** Use Supabase `update` to modify the mission record and its associated subtasks.
- **Delete Logic:** Use Supabase `delete` for the mission. Ensure subtasks are also handled (rely on database cascade delete if configured, or handle manually).
- **Synchronization:** Components must reflect changes immediately after the server response is received (re-fetching or state update).

## Technical Constraints
- Use existing Shadcn UI components where possible.
- Adhere to the current TDD workflow by writing tests for the new components and logic.
- Ensure type safety with TypeScript.

## Acceptance Criteria
- [ ] Users can open an edit modal for any mission they own.
- [ ] Changes made in the edit modal are persisted to the database.
- [ ] Status updates reflect correctly in the `MissionList` (e.g., Badge color changes).
- [ ] Deletion requires explicit confirmation.
- [ ] Deleted missions are removed from the UI without requiring a page refresh.
- [ ] Subtasks can be edited/added/removed within the mission edit modal.
