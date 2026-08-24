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

#### Scenario: Drop outside the active missions section is ignored
- **WHEN** the user drops a dragged queued mission outside the active missions drop zone
- **THEN** the system performs no state transition
- **AND** the mission remains in its queue

#### Scenario: Drag starts only after an intentional movement
- **WHEN** the user presses on a queued mission handle without moving beyond the activation distance
- **THEN** no drag begins and no state transition occurs

#### Scenario: Floating preview follows the pointer during drag
- **WHEN** a queued mission drag toward the active section is in progress
- **THEN** a floating preview of the mission follows the pointer via a drag overlay

#### Scenario: Active drop zone highlights while hovered
- **WHEN** a dragged queued mission hovers over the active missions drop zone
- **THEN** that zone shows a visual highlight indicating it accepts the drop

#### Scenario: Active section shows a drop hint while a queue drag is in progress
- **WHEN** a queued mission drag is active
- **THEN** the active missions section displays a hint inviting the user to drop the mission there

#### Scenario: Active list updates without page reload after transition
- **WHEN** the `Queued → Active` transition succeeds
- **THEN** the mission appears in the active missions section immediately without a page reload

