# Specification: Mission Task List Enhancements

## Overview
This track aims to improve the clarity and usability of the task list within the Mission Detail page. Key improvements include reducing visual noise by hiding completed tasks by default, clarifying the task counter, and streamlining the time estimation editing experience.

## Functional Requirements

### 1. Task Visibility Management
- **Default State:** The task list should only display tasks that are NOT in the 'done' status.
- **Toggle Mechanism:** A link/button should be added at the bottom of the task list (similar to the Milestones section) to "Show completed tasks" (Voir les tâches terminées).
- **Persistent View:** Once clicked, it should show all tasks. Clicking it again (labeled "Hide completed tasks" / "Masquer les tâches terminées") should revert to the default filtered view.

### 2. Time Estimation Inline Editing
- **Display Mode:** By default, the task estimation should be displayed as static text (e.g., "0.5 j") instead of a permanent input field.
- **Interaction:** Double-clicking the estimation text should open a **Popover** containing the input field to allow updating the value.
- **Feedback:** The UI should provide visual feedback during the update (e.g., loading state within the popover or on the text).

### 3. Task Counter Clarification
- **New Format:** Update the task counter (currently "X/Y") to be more explicit.
- **Wording:** Use the format: "X remaining / Y total" (e.g., "3 remaining / 7 total" or "3 restantes / 7 au total").

## Acceptance Criteria
- [ ] Completed tasks are hidden by default when opening a mission.
- [ ] A "Voir les tâches terminées" link appears at the bottom if completed tasks exist.
- [ ] Clicking the link displays all tasks and changes the link to "Masquer les tâches terminées".
- [ ] Time estimation is shown as text and is not directly editable via a visible input field.
- [ ] Double-clicking the time estimation text opens a Popover with the input field.
- [ ] The task counter displays exactly "X remaining / Y total" (or the French equivalent "X restantes / Y au total").

## Out of Scope
- Adding new task statuses beyond 'todo', 'in_progress', and 'done'.
- Bulk editing of tasks.
