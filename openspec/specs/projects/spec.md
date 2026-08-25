# Projects Specification

## Purpose

Define how users create, manage, and view projects. Projects are logical groupings of missions sharing a common objective, providing consolidated workload visibility for stakeholders.

## Requirements

### Requirement: Create Project

The system SHALL allow a user to create a new project with a name, optional label, description, and optional hero image.

#### Scenario: User creates a new project

- GIVEN a user on the project creation page
- WHEN the user provides a project name and optional details
- THEN the system creates a new project record
- AND the user is redirected to the project detail view

### Requirement: View Project List

The system SHALL display a list of all projects, sorted alphabetically by name.

#### Scenario: User views projects page

- GIVEN a user with existing projects
- WHEN the user navigates to the projects section
- THEN the system displays all user projects in alphabetical order
- AND each project shows its name, label, and status

#### Scenario: User has no projects

- GIVEN a user with no projects
- WHEN the user navigates to the projects section
- THEN the system displays an empty state with a call-to-action to create a project

### Requirement: Edit Project

The system SHALL allow a user to modify project details including name, label, description, status, and hero image.

#### Scenario: User edits project details

- GIVEN a user viewing a project detail page
- WHEN the user modifies project fields and saves
- THEN the system updates the project record
- AND the changes are persisted
- AND the user sees the updated information

### Requirement: Project Status

The system SHALL track project status as either "active" or "inactive".

#### Scenario: User changes project status

- GIVEN a user editing a project
- WHEN the user changes the status field
- THEN the system updates the project status
- AND the new status is reflected in the project list

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