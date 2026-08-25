# Missions Specification

## Purpose

Define how users create, manage, track, and view missions. Missions are the central entity representing work items with types (feature, study, support, documentation), optional project association, and decomposable into tasks.

## Requirements

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

The system SHALL manage mission lifecycle through explicit macro-states: Backlog, Queued, Active, Suspended, Terminated, and SHALL present each non-terminated state as a distinct planning category.

#### Scenario: User transitions mission from Backlog to Queued

- GIVEN a user viewing a mission in Backlog state
- WHEN the user moves the mission to Queued state
- THEN the system records the state transition
- AND the mission is appended to its project or standalone queue
- AND the mission appears in the ordered Queued view rather than the Backlog view

#### Scenario: User suspends an active mission

- GIVEN a user viewing a mission in Active state
- WHEN the user moves the mission to Suspended state
- THEN the system records the state transition
- AND the system requires a reason for suspension (Blocked, Deprioritized)
- AND the mission appears in a suspended-work area rather than the active-work area

#### Scenario: User terminates a mission

- GIVEN a user viewing a mission in Active or Suspended state
- WHEN the user moves the mission to Terminated state
- THEN the system records the state transition
- AND the system requires a reason (Done, Cancelled)

#### Scenario: User views backlog missions

- GIVEN missions in Backlog and Queued states
- WHEN the user views a mission list grouped by lifecycle
- THEN only Backlog missions appear in the compact Backlog section
- AND Queued missions appear in the separate ordered queue

#### Scenario: User moves queued mission back to backlog

- GIVEN a user viewing a mission in Queued state
- WHEN the user moves the mission to Backlog state
- THEN the system records the state transition
- AND removes the mission from its project or standalone queue
- AND the mission appears in the Backlog section

#### Scenario: User starts queued mission

- GIVEN a user viewing a mission in Queued state
- WHEN the user moves the mission to Active state
- THEN the system records the state transition
- AND removes the mission from its project or standalone queue
- AND the mission appears in the Active section

### Requirement: Start a queued mission by drag and drop

The system SHALL allow the user to start a queued mission by dragging it from its queue onto the active missions section, which SHALL trigger the `Queued → Active` state transition.

#### Scenario: Drop a queued mission on the active missions section

- **WHEN** the user drops a queued mission anywhere on the active missions section
- **THEN** the system transitions the mission to `Active` state through the existing state machine validation
- **AND** the mission leaves its queue and the remaining queue positions are compacted
- **AND** the mission appears in the active missions section

#### Scenario: Optimistic feedback with rollback on failure

- **WHEN** persistence of the `Queued → Active` transition fails
- **THEN** the system restores the mission in its queue at its previous position
- **AND** informs the user that the transition was not saved

#### Scenario: Queue reordering still works within the shared drag context

- **WHEN** the user drags a queued mission to another position within the same queue scope
- **THEN** the system performs the internal queue reorder as specified in project-mission-queue
- **AND** no state transition occurs

#### Scenario: Active missions are not draggable to the queue

- **WHEN** the user views an active mission card
- **THEN** the system does not offer dragging that card into a queue
- **AND** the `Active → Queued` transition remains forbidden by the state machine

#### Scenario: Drag is disabled while a transition is pending

- **WHEN** a `Queued → Active` transition is being persisted for a mission
- **THEN** the system prevents initiating another drag for missions until the transition completes or rolls back

### Requirement: Mission Priority

The system SHALL support priority levels: low, medium, high, critical.

#### Scenario: User sets mission priority

- GIVEN a user creating or editing a mission
- WHEN the user selects a priority level
- THEN the system records the priority
- AND the priority is displayed on the mission card

### Requirement: Mission Estimation

The system SHALL provide a single estimation field (in days) for each mission, with optional T-shirt size presets as quick-entry shortcuts. The system SHALL also track a qualitative confidence level (1-5) indicating certainty of the estimation.

The estimation SHALL be the single source of truth for load display. Task-based load calculation SHALL be available as a contextual indicator, not as an alternative estimation mode.

#### Scenario: User sets estimation via T-shirt preset

- GIVEN a user creating or editing a mission
- WHEN the user clicks a T-shirt size preset (XS=0.5, S=2, M=5, L=15, XL=45, XXL=100)
- THEN the system sets the estimation field to the corresponding day value
- AND the preset label is NOT persisted — only the numeric value is stored

#### Scenario: User sets estimation via manual input

- GIVEN a user creating or editing a mission
- WHEN the user types a numeric value in the estimation field
- THEN the system records the value as the mission estimation
- AND the estimation is displayed on mission cards, condensed rows, and detail view

#### Scenario: User sets confidence level

- GIVEN a user creating or editing a mission
- WHEN the user selects a confidence level on a 5-level qualitative scale
- THEN the system records the confidence level (1-5)
- AND the confidence is displayed alongside the estimation

#### Scenario: Default estimation and confidence

- GIVEN a user creating a new mission
- WHEN the mission form is displayed
- THEN the estimation field defaults to 3 days
- AND the confidence field defaults to level 3 (Moyen)

#### Scenario: Task-based load shown as indicator

- GIVEN a user viewing a mission that has subtasks with estimations
- WHEN the mission card or detail view is displayed
- THEN the system displays the task-based remaining load as a contextual indicator
- AND the indicator is visually distinct from the main estimation
- AND the tooltip shows: estimation + confidence, task-based load comparison, and remaining/total task count

### Requirement: Mission Completion — Real Duration Capture

The system SHALL, when a mission transitions to Terminated state with reason Done, propose capturing the actual duration.

#### Scenario: User confirms real duration from tasks

- GIVEN a mission with completed tasks being terminated
- WHEN the system has task-based load data available
- THEN the system proposes updating the estimation to match the total actual task load
- AND the user may accept or decline the proposal

#### Scenario: User enters real duration manually

- GIVEN a mission being terminated without sufficient task data
- WHEN the system cannot calculate actual duration from tasks
- THEN the system prompts the user to enter the actual duration manually
- AND the user may provide the value or skip

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
- AND appends it to the end of its project or standalone queue
- AND the mission appears in the ordered Queued view

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

### Requirement: Mission lifecycle context

The system SHALL show a mission's current position in the lifecycle from its detail view and SHALL provide queue context for queued missions.

#### Scenario: View mission lifecycle
- **WHEN** the user opens a non-terminated mission
- **THEN** the system displays a compact lifecycle indicator highlighting its current macro-state
- **AND** represents suspension as a branch from active work rather than as active work

#### Scenario: View queued mission context
- **WHEN** the user opens a queued mission
- **THEN** the system displays its current queue rank and queue scope
- **AND** provides navigation to the corresponding project queue when the mission belongs to a project

#### Scenario: Change queued mission state from detail
- **GIVEN** a user has opened a queued mission detail
- **WHEN** the user opens the mission state action
- **THEN** the system offers Backlog and Active as valid next states
- **AND** does not require a reason for either transition
