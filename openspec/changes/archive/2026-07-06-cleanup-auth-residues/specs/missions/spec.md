## MODIFIED Requirements

### Requirement: Create Mission

The system SHALL allow a user to create a new mission with a title, type, optional project association, and optional goal and notes.

#### Scenario: User creates a mission from project page

- GIVEN a user on a project detail page
- WHEN the user clicks "Create Mission" from the header
- THEN the system opens a mission creation form
- AND the mission is pre-associated with the current project
- AND the project field is locked

#### Scenario: User creates a standalone mission

- GIVEN a user on the mission creation page
- WHEN the user provides mission details without selecting a project
- THEN the system creates a mission without project association

### Requirement: Mission Types

The system SHALL support mission types: feature, study, support, documentation.

#### Scenario: User selects mission type during creation

- GIVEN a user creating a mission
- WHEN the user selects a mission type from the available options
- THEN the system records the selected type
- AND the type is displayed on the mission card

### Requirement: Mission States

The system SHALL manage mission lifecycle through explicit macro-states: Backlog, Queued, Active, Suspended, Terminated.

#### Scenario: User transitions mission from Backlog to Queued

- GIVEN a user viewing a mission in Backlog state
- WHEN the user moves the mission to Queued state
- THEN the system records the state transition
- AND the mission appears in the Queued view

#### Scenario: User suspends an active mission

- GIVEN a user viewing a mission in Active state
- WHEN the user moves the mission to Suspended state
- THEN the system records the state transition
- AND the system requires a reason for suspension (Blocked, Deprioritized)

#### Scenario: User terminates a mission

- GIVEN a user viewing a mission in Active or Suspended state
- WHEN the user moves the mission to Terminated state
- THEN the system records the state transition
- AND the system requires a reason (Done, Cancelled)

### Requirement: Mission Priority

The system SHALL support priority levels: low, medium, high, critical.

#### Scenario: User sets mission priority

- GIVEN a user creating or editing a mission
- WHEN the user selects a priority level
- THEN the system records the priority
- AND the priority is displayed on the mission card

### Requirement: Mission Estimation

The system SHALL support two estimation methods: ROM (T-Shirt sizes: XS, S, M, L, XL) and task-based (sum of subtasks).

#### Scenario: User sets ROM estimation

- GIVEN a user creating or editing a mission
- WHEN the user selects a ROM size
- THEN the system records the estimation
- AND the ROM size is displayed on the mission card

#### Scenario: User sets task-based estimation

- GIVEN a user with subtasks defined
- WHEN the system calculates the sum of subtask estimations
- THEN the system displays the total effort
- AND the mission load source is set to "tasks"

### Requirement: Mission Delivery Dates

The system SHALL track both estimated delivery date and desired delivery date for each mission.

#### Scenario: User sets delivery dates

- GIVEN a user creating or editing a mission
- WHEN the user provides estimated and/or desired delivery dates
- THEN the system records the dates
- AND the dates are displayed on the mission card

### Requirement: Mission Status History

The system SHALL record every state transition in an audit trail.

#### Scenario: User views mission status history

- GIVEN a user viewing a mission detail
- WHEN the user accesses the status history
- THEN the system displays a chronological list of all state transitions
- AND each transition includes the timestamp, new state, and reason

### Requirement: Mission Archive

The system SHALL allow users to view and reopen terminated missions from an archive.

#### Scenario: User views terminated mission archive

- GIVEN a user with terminated missions
- WHEN the user accesses the archive view
- THEN the system displays all terminated missions
- AND each mission shows its completion details

#### Scenario: User reopens a terminated mission

- GIVEN a user viewing a terminated mission in archive
- WHEN the user clicks "Reopen" and confirms
- THEN the system moves the mission to Queued state
- AND the mission appears in the active mission list

### Requirement: Mission Goal and Notes

The system SHALL allow users to add a main goal and supplementary notes to each mission.

#### Scenario: User adds mission goal

- GIVEN a user creating or editing a mission
- WHEN the user provides a main goal
- THEN the system records the goal
- AND the goal is displayed in the mission detail view

#### Scenario: User adds mission notes

- GIVEN a user creating or editing a mission
- WHEN the user provides supplementary notes
- THEN the system records the notes
- AND the notes are displayed in the mission detail view

## REMOVED Requirements

### Requirement: Mission Data Isolation

**Reason**: L'authentification et la séparation multi-utilisateur ont été supprimées. L'application est 100% locale (IndexedDB), il n'y a plus de notion de propriété ni de row-level security.

**Migration**: Aucune migration nécessaire — les données sont stockées localement dans IndexedDB et accessibles directement.