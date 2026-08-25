## ADDED Requirements

### Requirement: Project workload lifecycle view

The system SHALL organize a project's non-terminated missions into distinct `Active`, `Suspended`, ordered `Queued`, and `Backlog` sections.

#### Scenario: View project workload
- **WHEN** the user opens a project containing missions in multiple lifecycle states
- **THEN** active missions appear as prominent solid cards
- **AND** suspended missions appear in a distinct attention area with their reason
- **AND** queued missions appear as ranked pending cards with a muted surface and dashed border
- **AND** queued missions provide access to their mission detail for inspection
- **AND** backlog missions appear in a compact secondary list

#### Scenario: Lifecycle section is empty
- **WHEN** a project has no missions in one lifecycle category
- **THEN** the interface does not confuse missions from another state with that category
- **AND** preserves clear labels for the categories relevant to current planning

### Requirement: Project mission summary

The system SHALL report active, queued, and backlog mission counts separately in project summaries.

#### Scenario: View project card counts
- **WHEN** the user views a project card
- **THEN** the system shows a queued count that excludes Backlog missions
- **AND** does not label the combined Backlog and Queued total as a single upcoming count

### Requirement: Global grouped queue visibility

The system SHALL show project queues as separate groups in the global mission view without defining a total cross-project order.

#### Scenario: View all mission queues
- **WHEN** the user opens the global mission view
- **THEN** queued missions are grouped and ordered within their project or standalone scope
- **AND** the interface does not imply an order between different project queues
- **AND** queued missions provide access to their mission detail for inspection

