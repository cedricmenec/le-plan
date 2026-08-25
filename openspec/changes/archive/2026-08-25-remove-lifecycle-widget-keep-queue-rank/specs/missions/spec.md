## MODIFIED Requirements

### Requirement: Mission lifecycle context

The system SHALL show the mission's current state via its state badge in the mission detail header and SHALL provide queue context for queued missions within the same header. The system SHALL NOT display a dedicated lifecycle widget (multi-state pills with suspension branch) in the mission detail view.

#### Scenario: View mission state
- **WHEN** the user opens a mission detail view
- **THEN** the system displays the current macro-state via the state badge in the header
- **AND** no dedicated lifecycle widget is rendered

#### Scenario: View queued mission context
- **WHEN** the user opens a queued mission
- **THEN** the header displays its current queue rank and queue scope
- **AND** provides navigation to the corresponding project queue when the mission belongs to a project

#### Scenario: Change queued mission state from detail
- **GIVEN** a user has opened a queued mission detail
- **WHEN** the user opens the mission state action
- **THEN** the system offers Backlog and Active as valid next states
- **AND** does not require a reason for either transition
