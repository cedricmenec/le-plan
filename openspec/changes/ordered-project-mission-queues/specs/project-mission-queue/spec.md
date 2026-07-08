## ADDED Requirements

### Requirement: Project-scoped mission queue

The system SHALL maintain an explicitly ordered queue of `Queued` missions for each project, and SHALL maintain a separate standalone scope for queued missions without a project.

#### Scenario: View a project queue
- **WHEN** the user views a project containing queued missions
- **THEN** the system displays only that project's queued missions in persisted queue order
- **AND** each queued mission displays its one-based rank

#### Scenario: View standalone queued missions
- **WHEN** the user views queued missions without a project
- **THEN** the system displays them in a dedicated standalone queue
- **AND** the system does not merge them into any project's queue

### Requirement: Queue entry and exit

The system SHALL append a mission to the end of its queue scope whenever it enters `Queued`, and SHALL remove its queue membership whenever it leaves `Queued`.

#### Scenario: Mission enters queued state
- **WHEN** a mission transitions from `Backlog` to `Queued`
- **THEN** the system appends it after all currently queued missions in the same scope
- **AND** existing queued mission positions remain unchanged

#### Scenario: Mission leaves queued state
- **WHEN** a queued mission transitions to `Backlog` or `Active`
- **THEN** the system clears its queue position
- **AND** compacts the remaining positions in the same scope

#### Scenario: Queued mission changes project
- **WHEN** a queued mission is reassigned to another project
- **THEN** the system removes it from the previous queue
- **AND** appends it to the end of the destination project queue

#### Scenario: Queued mission is deleted
- **WHEN** the user deletes a queued mission
- **THEN** the system removes it from the queue
- **AND** compacts the remaining positions in that scope

### Requirement: Manual queue reordering

The system SHALL allow users to change the order of queued missions within one queue scope and SHALL persist the resulting order atomically.

#### Scenario: Reorder with drag and drop
- **WHEN** the user drags a queued mission to another position within its project queue
- **THEN** the system immediately displays the proposed order
- **AND** persists contiguous queue positions for the complete project queue

#### Scenario: Reorder with keyboard controls
- **WHEN** the user invokes an available keyboard reorder control on a queued mission
- **THEN** the system moves the mission within the same queue
- **AND** announces or displays its updated rank

#### Scenario: Reorder persistence fails
- **WHEN** persistence of a proposed queue order fails
- **THEN** the interface restores the last persisted order
- **AND** informs the user that the reorder was not saved

#### Scenario: Cross-project move is attempted
- **WHEN** the user interacts with queues in the global mission view
- **THEN** the system prevents dragging a mission into another project's queue

### Requirement: Stable manual ordering

The system SHALL treat queue position independently from mission priority, delivery dates, estimation, and creation date.

#### Scenario: Queued mission metadata changes
- **WHEN** the user changes priority, delivery dates, estimation, or other non-state metadata of a queued mission
- **THEN** its queue position remains unchanged

### Requirement: Queue data normalization

The system SHALL ensure that queued mission positions are unique and contiguous within each queue scope and that non-queued missions have no queue position.

#### Scenario: Existing data is migrated
- **WHEN** the application upgrades data created before explicit queue ordering
- **THEN** it assigns each existing queued mission a deterministic contiguous position within its scope
- **AND** preserves every mission and its lifecycle state

#### Scenario: Legacy data is imported
- **WHEN** imported mission data omits queue positions or contains invalid queue positions
- **THEN** the system normalizes queued missions into deterministic contiguous positions per scope
- **AND** clears queue positions from non-queued missions

### Requirement: No automatic activation

The system SHALL require an explicit user transition before a queued mission becomes active.

#### Scenario: Active mission stops
- **WHEN** an active mission is suspended, terminated, or deleted
- **THEN** the first queued mission remains in `Queued`
- **AND** no queued mission is automatically promoted to `Active`

