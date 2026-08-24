## ADDED Requirements

### Requirement: Queue a backlog mission by drag and drop
The system SHALL allow the user to move a backlog mission into its queue by dragging it from the backlog list onto the queue section of its own scope, which SHALL trigger the `Backlog → Queued` state transition.

#### Scenario: Drop a backlog mission on its scope queue
- **WHEN** the user drops a backlog mission on the queue section matching the mission's project scope (or the standalone queue for a mission without project)
- **THEN** the system transitions the mission to `Queued` state through the existing state machine validation
- **AND** the mission is appended at the end of that queue with a queue position
- **AND** existing queued missions keep their positions unchanged

#### Scenario: Drop restricted to the mission's own scope
- **WHEN** the user drags a backlog mission in a view showing multiple queues
- **THEN** only the queue of the mission's own scope accepts the drop
- **AND** other queues do not react to the drag hover

#### Scenario: Optimistic feedback with rollback on failure
- **WHEN** persistence of the `Backlog → Queued` transition fails
- **THEN** the system restores the mission in the backlog list
- **AND** informs the user that the transition was not saved

#### Scenario: Drop on active missions section is ignored
- **WHEN** the user drops a backlog mission on the active missions section
- **THEN** the system performs no state transition
- **AND** the mission remains in the backlog

#### Scenario: Backlog rows are draggable but not reorderable
- **WHEN** the user views the backlog list
- **THEN** each row can be dragged toward a queue
- **AND** the system does not offer reordering rows within the backlog
