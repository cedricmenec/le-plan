## MODIFIED Requirements

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

## ADDED Requirements

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

