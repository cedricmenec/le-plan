## MODIFIED Requirements

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
- THEN the system displays all projects in alphabetical order
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

## REMOVED Requirements

### Requirement: Project Data Isolation

**Reason**: L'authentification et la séparation multi-utilisateur ont été supprimées. L'application est 100% locale (IndexedDB), il n'y a plus de notion de propriété ni de row-level security.

**Migration**: Aucune migration nécessaire — les données sont stockées localement dans IndexedDB et accessibles directement.