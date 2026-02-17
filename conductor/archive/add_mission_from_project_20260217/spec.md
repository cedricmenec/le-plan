# Specification: Add Mission from Project Page

## Overview
This track aims to improve the user experience by allowing users to create a new mission directly from a specific project's management page. This reduces navigation friction by pre-selecting and locking the project context.

## Functional Requirements
- **Header Action:** Add an "Add Mission" button in the header of the Project Detail page (`app/projects/[id]/page.tsx`).
- **Visuals:** The button will use the `Plus` icon and the label "Add Mission".
- **Contextual Creation:** Clicking the button opens the existing mission creation dialog.
- **Pre-selection & Locking:**
    - The `projectId` field must be automatically populated with the current project's ID.
    - In this specific context, the project selection field in the dialog should be replaced by a non-actionable visual indicator (Badge or Text label) to confirm the context to the user without allowing changes.
- **Post-Creation Flow:**
    - The user remains on the project page.
    - A success toast is displayed.
    - The success toast must include a link/action to navigate to the newly created mission's detail page.
    - The project's mission list should refresh to include the new mission.

## Non-Functional Requirements
- **Consistency:** Use existing `Button`, `Toast`, and `Dialog` components from the UI library.
- **Performance:** Ensure the project page reflects the new mission without a full page reload (using Next.js server actions and `revalidatePath` or client-side state update).

## Acceptance Criteria
- [ ] "Add Mission" button is visible in the project header.
- [ ] Clicking the button opens the creation dialog with the project already set.
- [ ] The project field in the dialog is not editable when opened from a project page.
- [ ] After creation, a toast appears with a "View Mission" link.
- [ ] The new mission appears in the project's mission list immediately after creation.

## Out of Scope
- Modifying the mission creation flow from the main dashboard or other pages (unless shared logic requires it).
- Bulk mission creation.
