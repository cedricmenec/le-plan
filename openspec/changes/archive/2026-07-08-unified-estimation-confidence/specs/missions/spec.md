# Missions Specification — Delta

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Mission Estimation (ROM/Task toggle)

**Reason**: Replaced by unified estimation system. The dual-mode (ROM vs Task-based) with load_source toggle created confusion and bugs. The new system uses a single estimation field with T-shirt presets as UX shortcuts only.

**Migration**: Existing missions with `rom_size` and `load_source` fields will ignore these fields. The `estimation` field (already present) becomes the single source of truth. `confidence` migrates from percentage (0-100) to qualitative level (1-5).