# Track Specification: Mission Status History & Audit Trail

## Overview
This track aims to implement a robust tracking system for mission status changes. The primary goal is to calculate the total lead time (from first being "In Progress" to "Completed") and provide a visual audit trail of the mission's lifecycle, including time spent in "Paused" or "Blocked" states.

## Functional Requirements

### 1. Data Capture & Storage
- **Audit Table:** Create a new `MissionStatusHistory` table to record every status transition.
- **Captured Data:**
    - `missionId`: Reference to the mission.
    - `status`: The new status being transitioned into.
    - `timestamp`: The exact time of the transition.
    - `reason`: The reason for the change (if provided during the transition).
- **Automated Logging:** Every time a mission status changes via the existing state machine, a new entry must be automatically created in this table.

### 2. Duration Calculations
- **Total Lead Time:** Calculate the duration from the first transition to "In Progress" until the mission reaches the "Completed" state.
- **Segmented Durations:** Calculate the time spent in each specific state (Active, Paused, Blocked) to allow for "Net Active Time" reporting.

### 3. User Interface
- **Mission Card:** Display a small indicator showing the current duration (e.g., "In Progress for 3 days").
- **Recently Completed List:** Display the total lead time for each mission.
- **Mission Detail Page:**
    - **History Section:** A list or timeline showing the history of status changes and reasons.
    - **Status Timeline Component:** A new multi-colored horizontal timeline visualization:
        - **Black:** Active time.
        - **Light Grey:** Paused time.
        - **Red:** Blocked time.
- **Mission Archive View:** Include the status history and final duration metrics in the read-only archive view.

## Non-Functional Requirements
- **Performance:** Ensure duration calculations are efficient and don't slow down mission list rendering.
- **Consistency:** The history must be the "Source of Truth" for any status-related metrics.

## Acceptance Criteria
- [ ] Changing a mission status creates a record in `MissionStatusHistory`.
- [ ] Mission cards show accurate duration since entering "In Progress".
- [ ] The horizontal timeline in the Mission Detail view correctly visualizes the distribution of states.
- [ ] "Recently Completed" missions display their total lead time correctly.
- [ ] History and reasons are visible in the Mission Archive.

## Out of Scope
- Editing or deleting historical status entries manually.
- Tracking changes to fields other than `status`.
