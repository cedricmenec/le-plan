# Specification: Task List UI Update - Status Icons

## Overview
This track aims to improve the task list UI in the mission detail page by replacing the text-based status selector with a more compact icon-based one. This will save space and align the UI with modern design patterns while maintaining clarity through a descriptive dropdown menu.

## Functional Requirements
- **Status Trigger**:
    - Replace the text (e.g., "À FAIRE") in the `SelectTrigger` with a status-specific icon.
    - Icons to use:
        - `todo`: `Square`
        - `in_progress`: `PlayCircle`
        - `done`: `CheckSquare`
    - Maintain existing color coding for icons:
        - `todo`: Muted/Slate
        - `in_progress`: Blue
        - `done`: Green
- **Status Selection (Dropdown)**:
    - Each dropdown item (`SelectItem`) must display both the status icon and the corresponding text.
    - Format: `[Icon] Status Text` (e.g., `[PlayCircle] En cours`).
    - Change text styling from uppercase to sentence case for better readability in the dropdown.

## Non-Functional Requirements
- **Consistency**: Use Lucide React icons as per the project's tech stack.
- **Accessibility**: Ensure the `Select` component remains accessible with appropriate `aria-label` or screen reader support if the text is removed from the trigger.

## Acceptance Criteria
- [ ] In the task list, the status column shows only an icon.
- [ ] Clicking the icon opens a dropdown where each option shows an icon followed by text.
- [ ] Selecting a new status correctly updates the task and the trigger icon.
- [ ] The layout remains stable and compact.

## Out of Scope
- Modifying the task list in other views (if any).
- Changing the underlying task status logic or database schema.
