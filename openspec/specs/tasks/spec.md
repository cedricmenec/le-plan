# Tasks Specification

## Purpose

Define how users decompose missions into tasks, estimate effort, track completion, and reorder tasks. Tasks are the actionable items within missions, with half-day estimations and checkbox completion tracking.

## Requirements

### Requirement: Create Task

The system SHALL allow users to create tasks within a mission.

#### Scenario: User creates a new task

- GIVEN a user viewing a mission with tasks
- WHEN the user adds a new task with a title
- THEN the system creates the task
- AND the task appears in the task list
- AND the task has a default estimation of 0.5 days

### Requirement: Task Estimation

The system SHALL allow users to estimate tasks in half-day increments (0.5, 1, 1.5, 2, etc.).

#### Scenario: User edits task estimation

- GIVEN a user viewing a task
- WHEN the user double-clicks the estimation field
- THEN the system shows an editable input
- WHEN the user enters a valid half-day value and confirms
- THEN the system updates the task estimation

### Requirement: Task Completion

The system SHALL allow users to mark tasks as completed via checkbox.

#### Scenario: User marks task as completed

- GIVEN a user viewing a task list
- WHEN the user checks the task completion checkbox
- THEN the system marks the task as completed
- AND the task is visually styled as completed

#### Scenario: User unmarks task as completed

- GIVEN a user viewing a completed task
- WHEN the user unchecks the task completion checkbox
- THEN the system marks the task as not completed
- AND the task returns to active state

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

### Requirement: Task Reordering

The system SHALL allow users to reorder tasks via drag and drop.

#### Scenario: User reorders tasks via drag and drop

- GIVEN a user viewing a task list
- WHEN the user drags a task to a new position
- THEN the system updates the task order
- AND the tasks are persisted in the new order

### Requirement: Task Position Persistence

The system SHALL maintain task order across sessions.

#### Scenario: User returns to task list

- GIVEN a user who previously reordered tasks
- WHEN the user revisits the mission
- THEN the system displays tasks in the previously saved order

### Requirement: Hide Completed Tasks

The system SHALL hide completed tasks by default with an option to show them.

#### Scenario: User views task list with completed tasks hidden

- GIVEN a user viewing a mission with completed tasks
- WHEN the user opens the task list
- THEN the system hides completed tasks by default
- AND displays a toggle to show completed tasks

#### Scenario: User toggles completed tasks visibility

- GIVEN a user viewing a task list
- WHEN the user clicks "Show completed tasks"
- THEN the system displays all tasks including completed ones
- AND the toggle changes to "Hide completed tasks"

### Requirement: Task Count Display

The system SHALL display the count of remaining tasks and total tasks.

#### Scenario: User views task count

- GIVEN a user viewing a mission with tasks
- WHEN the task list is displayed
- THEN the system shows "X remaining / Y total" count
