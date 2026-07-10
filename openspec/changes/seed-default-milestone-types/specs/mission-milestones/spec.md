## ADDED Requirements

### Requirement: Default milestone types are available
The system SHALL ensure a local installation has default milestone types available before a user creates or edits mission milestones.

#### Scenario: Application starts with no milestone types
- **WHEN** the application initializes against a local database containing no milestone types
- **THEN** the system creates the default milestone types
- **AND** the mission milestone form provides at least one selectable type

#### Scenario: Application starts with existing milestone types
- **WHEN** the application initializes against a local database that already contains milestone types
- **THEN** the system preserves the existing milestone types
- **AND** does not create duplicate default types

### Requirement: Milestone type seeding is idempotent
The system SHALL allow reference-data initialization to run repeatedly without changing the effective set of milestone types after the first successful initialization.

#### Scenario: Reference data initialization runs more than once
- **WHEN** reference-data initialization is executed multiple times
- **THEN** the default milestone types exist only once
- **AND** subsequent milestone type reads return the same logical set of types
