# Tasks Specification — Delta

## ADDED Requirements

### Requirement: Task-Based Load Indicator

The system SHALL calculate and display the remaining task-based load (sum of estimations for non-completed tasks) as a contextual indicator alongside the mission's unified estimation. This SHALL NOT replace or toggle the mission's main estimation field.

#### Scenario: Task load appears in mission card tooltip

- GIVEN a mission with subtasks that have estimations
- WHEN the user hovers over the estimation area on a mission card
- THEN the system displays a tooltip showing:
  - Mission estimation + confidence level
  - Task-based remaining load vs estimation
  - Number of remaining tasks / total tasks

#### Scenario: Task load appears in mission detail

- GIVEN a user viewing a mission with subtasks
- WHEN the mission detail page is displayed
- THEN the system shows the task-based remaining load as an informational block
- AND includes a suggestion to adjust the mission estimation to match the task-based load when they differ significantly

## REMOVED Requirements

### Requirement: Task Estimation as alternative source

**Reason**: Tasks are no longer an alternative "source" for mission estimation. The mission has a single estimation field. Task-based load is purely informational — displayed as a contextual indicator and comparison point.

**Migration**: The `load_source` toggle is removed. Task-based calculations remain available as read-only indicators.