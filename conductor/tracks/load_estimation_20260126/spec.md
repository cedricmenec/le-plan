# Specification: Load Estimation Evolution (ROM & Tasks)

## 1. Overview
Currently, missions have a single manual "estimation" field, leading to friction and inaccuracies as the mission progresses. This track introduces a two-tiered estimation system:
1. **ROM (Rough Order of Magnitude):** T-Shirt sizing for early-stage, "fuzzy" estimation.
2. **Task-Based (Detailed):** Automatic calculation of remaining load based on granular subtasks.

The goal is to provide reliable visibility into remaining workload without the overhead of complex time-tracking or "Jira-like" micro-management.

## 2. Functional Requirements

### 2.1 Mission Estimation Fields
- **ROM Size:** A T-Shirt size selection for the mission.
  - Sizes & Values (in half-days):
    - `XS`: 0.5d
    - `S`: 2d
    - `M`: 5d
    - `L`: 15d
    - `XL`: 45d
    - `XXL`: 100d
- **Official Load Source:** A toggle to choose which estimation to use for capacity/planning views:
  - `ROM` (Default for new missions)
  - `Task Sum` (Sum of estimations for all non-completed tasks)

### 2.2 Subtask Enhancements
- **Mandatory Estimation:** Every subtask MUST have an estimation in half-days (0.5d units).
- **Status Workflow:** Subtasks now have three states:
  - `Todo` (Remaining)
  - `In Progress` (Remaining)
  - `Done` (Not Remaining)
- **Calculation Logic:** "Task Remaining" = Sum of estimations of all subtasks NOT in `Done` status.

### 2.3 User Experience (UX)
- **Explicit Toggle:** A clear control in the mission detail view to switch between ROM and Task Sum.
- **Visual Distinction:** Use distinct icons (e.g., "T-Shirt" vs. "List") next to the load value to indicate the source.
- **Smart Transition:** If a mission is set to `ROM` but has estimated tasks, the UI should suggest switching to `Task Sum` as the official source.
- **Consistency:** In lists (Dashboard, Project view), only the "Official" load value is displayed to maintain clarity.

## 3. Data Model Changes

### 3.1 `missions` Table
- Add `rom_size` (TEXT).
- Add `load_source` (TEXT: 'rom' or 'tasks').

### 3.2 `subtasks` Table
- Add `estimation` (NUMERIC).
- Add `status` (TEXT: 'todo', 'in_progress', 'done').
- Migrate `is_completed` (boolean) to the new `status` field.

## 4. Acceptance Criteria
- [ ] A mission can be assigned a ROM size (XS-XXL).
- [ ] Subtasks can be created with a mandatory estimation (defaulting to 0.5d or 1d).
- [ ] Switching "Official Load Source" immediately updates the displayed load in the dashboard and project views.
- [ ] The "Task Remaining" value correctly sums only non-completed tasks.
- [ ] The UI displays a "T-shirt" icon for ROM-based values and a "List" icon for Task-based values.

## 5. Out of Scope
- Time tracking (hours/minutes).
- Burn-down charts or velocity tracking.
- Automated status transitions for missions based on subtasks.
