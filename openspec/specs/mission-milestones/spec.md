# Mission Milestones Specification

## Purpose

Define how mission milestones are managed: the milestone type catalog (seeded reference data), migration of legacy types, and how milestone notes are surfaced in the timeline.

## Requirements

### Requirement: Milestone Type Catalog

The system SHALL maintain a milestone type catalog seeded with the following French types: « Cadrage / Kick-off », « Réunion / Review », « Meeting / Workshop », « Livraison intermédiaire », « Documentation », « Autre ». The seeding SHALL be idempotent by type name and SHALL NOT duplicate existing types.

#### Scenario: Fresh database receives the full catalog

- **WHEN** the application starts with an empty local database
- **THEN** the milestone type catalog contains exactly the six French types listed above
- **AND** each type is selectable in the milestone form

#### Scenario: Existing database receives missing types without duplication

- **WHEN** the application starts with a local database that already contains milestone types
- **THEN** any catalog type absent from the database is added
- **AND** types already present are left untouched, without duplicates

#### Scenario: User-created types are preserved

- **WHEN** the application seeds the catalog on a database containing user-created milestone types
- **THEN** user-created types remain present and unchanged after seeding

### Requirement: Milestone Type Migration for Existing Data

The system SHALL migrate milestones referencing legacy English type names to their French equivalents: Start → Cadrage / Kick-off, Decision → Réunion / Review, Review → Réunion / Review, Deadline → Livraison intermédiaire, Delivery → Livraison intermédiaire. Legacy types SHALL be removed only after all their milestones have been remapped.

#### Scenario: Milestones referencing legacy types are remapped

- **WHEN** the application starts with a database containing milestones whose types use legacy English names
- **THEN** each milestone references the corresponding French type according to the mapping above
- **AND** no milestone points to a removed legacy type

#### Scenario: Migration is idempotent

- **WHEN** the migration runs again on an already-migrated database
- **THEN** no milestone is modified and no type is duplicated or removed

### Requirement: Unresolved Milestone Type Falls Back to "Autre"

The system SHALL display a milestone whose type cannot be resolved using the real « Autre » catalog type (name and icon), rather than a hard-coded label.

#### Scenario: Milestone with orphan type reference

- **WHEN** a milestone references a type id that no longer exists in the catalog
- **THEN** the milestone is displayed with the name and icon of the « Autre » type

### Requirement: Milestone Note Access via Always-Visible Symbol and Popover

The system SHALL display a note symbol (sticky-note icon) on every milestone that has a note. The symbol SHALL be always visible (not hover-dependent) in the mission milestone list. Activating the symbol SHALL open the note content in a popover.

#### Scenario: Milestone with a note shows the symbol

- **WHEN** the mission milestone list displays a milestone that has a note
- **THEN** a sticky-note symbol is visible on the milestone item without requiring hover

#### Scenario: Opening the note popover

- **WHEN** the user activates the sticky-note symbol of a milestone
- **THEN** a popover opens displaying the full note content
- **AND** the popover can be dismissed via Escape key or clicking outside

#### Scenario: Milestone without a note shows no symbol

- **WHEN** the mission milestone list displays a milestone without a note
- **THEN** no note symbol is displayed for that milestone

#### Scenario: Inline expansion is replaced

- **WHEN** the user views a milestone with a note
- **THEN** the previous inline expand/collapse control is no longer present
- **AND** the popover is the single mechanism to read the note

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
