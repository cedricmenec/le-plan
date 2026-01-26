# Specification: Mission Priority Management

## Overview
This track introduces a "Priority" field to the "Mission" entity to help users categorize and arbitrate their workload. Missions can be assigned one of four priority levels: `low`, `medium`, `high`, or `critical`. The `critical` level represents an absolute emergency that takes precedence over all other tasks.

## Functional Requirements

### 1. Data Model
- Add a `priority` column to the `missions` table in PostgreSQL.
- Type: `TEXT` with a `DEFAULT` value of `medium`.
- Constraint: Must be one of `('low', 'medium', 'high', 'critical')`.

### 2. Priority Selection & Management
- **Creation:** Add a "Priority" dropdown to the "Add Mission" dialog.
- **Edition:** Add a "Priority" dropdown to the "Edit Mission" modal.
- **In-line Edition:** Allow modifying the priority directly on the Mission Detail page using an `InlineEditableField`.

### 3. User Interface & Visualization
- **Visual Cues:**
    - Each priority level will have a semantic color (e.g., Low: Slate, Medium: Blue, High: Orange, Critical: Red).
    - Each priority level will be accompanied by a specific icon (e.g., Lucide icons like `SignalLow`, `SignalMedium`, `SignalHigh`, `AlertTriangle` for Critical).
- **Mission Detail Page:** Display the priority badge (Icon + Label) prominently in the header or info section.
- **Project Detail Page:** Display the priority badge in the "Missions non commencées" list to facilitate prioritization.

## Non-Functional Requirements
- **Consistency:** Ensure colors and icons align with the existing UI design (using Shadcn/ui and Tailwind).
- **Responsiveness:** Priority badges and selectors must remain legible on smaller screens.

## Acceptance Criteria
- [ ] A user can set the priority when creating a mission.
- [ ] A user can change the priority in the edit modal.
- [ ] A user can change the priority in-line on the mission detail page.
- [ ] The priority is correctly displayed with its specific color and icon in the mission list and detail views.
- [ ] Database integrity is maintained via the `CHECK` constraint.

## Out of Scope
- Automatic sorting/reordering of lists based on priority (to be considered in a future track).
- Notification or alerts triggered by "Critical" priority.
