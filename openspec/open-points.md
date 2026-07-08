# Open Points

## Functional Questions

- [ ] What is the exact definition of "PI" (Program Increment) and how should the quarterly view work?
  - Context: The product documentation mentions a PI view for strategic arbitrage, but implementation details are unclear
  - Impact: Affects timeline visualization and capacity planning features
  - Suggested default: Implement quarterly view showing mission distribution across weeks
  - Evidence status: `assumed`
  - Status: `open`

- [ ] How should the "load source" field be used for capacity planning?
  - Context: Missions have a `load_source` field (rom/tasks) but the exact workflow for switching sources is unclear
  - Impact: Affects how users view and plan capacity
  - Suggested default: Default to ROM for planning, allow override to tasks when subtasks are complete
  - Evidence status: `assumed`
  - Status: `open`

- [ ] What is the exact workflow for milestone creation and management?
  - Context: Milestones exist in the database with types (Cadrage, Review, Livraison) but UI workflow is not documented
  - Impact: Affects mission detail view and planning features
  - Suggested default: Allow milestone creation from mission detail with predefined types
  - Evidence status: `inferred`
  - Status: `open`

- [ ] How should the "risk zone" be calculated in the mission timeline?
  - Context: Product documentation mentions a risk zone for critical delays, but calculation logic is not defined
  - Impact: Affects timeline visualization and user warnings
  - Suggested default: Show risk zone when estimated delivery date is past desired delivery date
  - Evidence status: `assumed`
  - Status: `open`

## Technical Questions

- [ ] What is the exact schema for the `rom_size` field values?
  - Context: ROM sizes are referenced but exact enum values are not clear from schema
  - Impact: Affects UI dropdown options and data validation
  - Suggested default: XS, S, M, L, XL (standard T-shirt sizing)
  - Evidence status: `assumed`
  - Status: `open`

- [ ] How should the audit trail handle bulk updates?
  - Context: Status history is tracked per mission, but bulk operations are not defined
  - Impact: Affects data integrity and user experience
  - Suggested default: Each mission transition creates a separate history entry
  - Evidence status: `assumed`
  - Status: `open`

- [ ] What is the expected behavior when a mission's project is deleted?
  - Context: Foreign key constraint allows null project_id, but cascade behavior is not defined
  - Impact: Affects data integrity and user expectations
  - Suggested default: Keep mission but remove project association
  - Evidence status: `assumed`
  - Status: `open`

## Product Scope Questions

- [ ] Should project-level mission queues eventually be consolidated into a single global queue?
  - Context: The initial scope uses one explicitly ordered `Queued` mission queue per project. The user may alternate between missions belonging to different projects and therefore eventually needs a cross-project view of the intended execution order.
  - Impact: Affects queue ownership, ordering semantics, drag-and-drop behavior, standalone missions, and the relationship between project-level and global planning views.
  - Suggested default: Keep project-level queues as the current source of truth; consider a global queue only as a later product evolution, without deriving an artificial total order from project-local positions.
  - Evidence status: `confirmed`
  - Status: `open`

- [ ] Should there be a global mission view across all projects?
  - Context: Product mentions project-level views but not a consolidated mission view
  - Impact: Affects navigation and workload visibility
  - Suggested default: Provide both project-level and global views
  - Evidence status: `assumed`
  - Status: `open`

- [ ] How should completed missions be displayed in the project view?
  - Context: Product mentions "missions terminées" section but exact display format is not specified
  - Impact: Affects project detail page layout
  - Suggested default: Show as a list with type, actual load, and duration
  - Evidence status: `inferred`
  - Status: `open`

## UX/UI Questions

- [ ] What is the expected behavior for the "Ghost Grid" empty state?
  - Context: Product mentions skeleton cards for empty states but exact implementation is not defined
  - Impact: Affects user onboarding experience
  - Suggested default: Show skeleton cards with prominent "Create first mission" button
  - Evidence status: `assumed`
  - Status: `open`

- [ ] How should priority be visually represented on mission cards?
  - Context: Priority levels exist but visual treatment is not specified
  - Impact: Affects quick scanning and prioritization
  - Suggested default: Color-coded badges (low=gray, medium=blue, high=orange, critical=red)
  - Evidence status: `assumed`
  - Status: `open`

## Data Model Questions

- [ ] Should the `confidence` field be editable by users?
  - Context: Field exists in schema but editability is not specified
  - Impact: Affects estimation accuracy and user control
  - Suggested default: Allow editing with default of 100%
  - Evidence status: `assumed`
  - Status: `open`

- [ ] What is the relationship between `estimation` and `rom_size` fields?
  - Context: Both fields exist on missions but their relationship is unclear
  - Impact: Affects how estimates are displayed and calculated
  - Suggested default: `rom_size` is a categorical estimate, `estimation` is a numeric value in days
  - Evidence status: `assumed`
  - Status: `open`
