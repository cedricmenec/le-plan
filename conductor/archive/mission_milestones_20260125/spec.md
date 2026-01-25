# Specification: Mission Milestones (Jalons)

## Overview
The goal is to add "Milestones" (Jalons) to missions to provide stakeholders (e.g., Product Managers) with short-term visibility into long-running missions. This helps break down missions into intermediate steps, reinforcing confidence through better pilotage.

## Functional Requirements

### 1. Data Model
- **Relationship:** A mission can have 0, 1, or many milestones.
- **Attributes:**
    - **Type:** (Reference table `milestone_types`) e.g., Scoping, Intermediate Delivery, Meeting, Documentation.
    - **Date:** Granularity is per day (no time).
    - **Title:** Short descriptive label.
    - **Note:** Optional free text for details.
- **State:** Milestones are "Active" (future or today) or "Past" based on the current date.

### 2. User Interface (Mission Detail Page)
- **MissionMilestoneList Component:**
    - **Default View:** Displays only "Upcoming/Active" milestones (today or in the future), sorted by date (closest first).
    - **"View All" Link:** Clicking this expands the list inline to show all milestones, including past ones.
    - **Visual Style:** Past milestones must have a distinct visual style (e.g., dimmed, crossed out) to clearly indicate they are completed.
- **Creation/Edition:**
    - A button/action on the mission detail page to open a Dialog (modal) for adding or editing a milestone.

## Non-Functional Requirements
- **Database:** Use a separate reference table for milestone types for maximum extensibility.
- **Performance:** Ensure light and fast interactions within the mission detail page.

## Acceptance Criteria
- [ ] Users can create a milestone for a mission with a specific type, date, and title.
- [ ] The mission detail page shows the next upcoming milestones by default.
- [ ] Users can toggle "View All" to see the full history of milestones inline.
- [ ] Past milestones are visually distinct from upcoming ones.
- [ ] Milestone types are managed via a dedicated database table.

## Out of Scope
- Global view or calendar for all milestones.
- External sharing/link sharing (presentation is done live for MVP).
