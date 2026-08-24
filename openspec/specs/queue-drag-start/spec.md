# queue-drag-start Specification

## Purpose
TBD - created by archiving change queue-to-active-drag-drop. Update Purpose after archive.
## Requirements
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

