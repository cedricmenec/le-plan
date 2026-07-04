# IndexedDB Storage Specification

## Purpose

Définir comment les données sont stockées, récupérées et synchronisées dans IndexedDB. Cette spécification couvre la création des stores, les opérations CRUD, et la gestion des relations entre entités.

## Requirements

### Requirement: Création des object stores

The system SHALL create IndexedDB object stores for each entity type with appropriate indexes for efficient querying.

#### Scenario: Initialisation de IndexedDB

- GIVEN a user accessing the application for the first time
- WHEN the application initializes the database
- THEN the system creates object stores: projects, missions, subtasks, milestones, status_history
- AND each store has indexes on foreign keys and query fields

### Requirement: Opérations CRUD sur les projets

The system SHALL support Create, Read, Update, Delete operations on projects stored in IndexedDB.

#### Scenario: Lecture d'un projet

- GIVEN an authenticated user with projects in IndexedDB
- WHEN the user navigates to a project detail view
- THEN the system retrieves the project by ID
- AND displays the project data

#### Scenario: Mise à jour d'un projet

- GIVEN an authenticated user editing a project
- WHEN the user saves the changes
- THEN the system updates the project in IndexedDB
- AND the changes are persisted for future sessions

#### Scenario: Suppression d'un projet

- GIVEN an authenticated user deleting a project
- WHEN the user confirms deletion
- THEN the system removes the project from IndexedDB
- AND all related missions are either deleted or have their project_id set to null

### Requirement: Opérations CRUD sur les missions

The system SHALL support full CRUD operations on missions with state transition tracking.

#### Scenario: Création d'une mission

- GIVEN an authenticated user creating a mission
- WHEN the user saves the mission
- THEN the system creates the mission in IndexedDB
- AND the mission is associated with the current user

#### Scenario: Transition d'état d'une mission

- GIVEN an authenticated user changing a mission state
- WHEN the user saves the state change
- THEN the system updates the mission state
- AND creates a status_history entry

#### Scenario: Réouverture d'une mission terminée

- GIVEN an authenticated user viewing a terminated mission
- WHEN the user clicks "Reopen"
- THEN the system moves the mission to "Queued" state
- AND creates a status_history entry with the transition

### Requirement: Opérations CRUD sur les tâches

The system SHALL support task management with completion tracking and reordering.

#### Scenario: Ajout d'une tâche

- GIVEN an authenticated user viewing a mission with tasks
- WHEN the user adds a new task
- THEN the system creates the task in IndexedDB
- AND the task is associated with the mission

#### Scenario: Marquage comme terminé

- GIVEN an authenticated user viewing a task
- WHEN the user checks the completion checkbox
- THEN the system updates is_completed to true
- AND the task is visually styled as completed

#### Scenario: Réordonnancement des tâches

- GIVEN an authenticated user dragging tasks
- WHEN the user drops a task at a new position
- THEN the system updates the position values
- AND the new order is persisted

### Requirement: Gestion des relations

The system SHALL maintain referential integrity between entities in IndexedDB.

#### Scenario: Récupération des tâches d'une mission

- GIVEN an authenticated user viewing a mission detail
- WHEN the user opens the task list
- THEN the system queries subtasks by mission_id
- AND displays all tasks in the correct order

#### Scenario: Récupération des jalons d'une mission

- GIVEN an authenticated user viewing a mission detail
- WHEN the user views milestones
- THEN the system queries milestones by mission_id
- AND displays all milestones with their types

### Requirement: Cache et performance

The system SHALL cache frequently accessed data and use indexes for efficient queries.

#### Scenario: Accès rapide aux projets

- GIVEN an authenticated user navigating to the projects page
- WHEN the user loads the page
- THEN the system uses the name index to retrieve projects
- AND displays them in alphabetical order

#### Scenario: Calcul de la charge restante

- GIVEN an authenticated user viewing a project
- WHEN the system calculates remaining load
- THEN the system queries all active missions
- AND sums their estimations

### Requirement: Persistance entre sessions

The system SHALL persist all data changes across browser sessions.

#### Scenario: Retour utilisateur après fermeture du navigateur

- GIVEN an authenticated user who made changes
- WHEN the user closes and reopens the browser
- THEN the system restores all data from IndexedDB
- AND the user sees their last state

### Requirement: Gestion des erreurs IndexedDB

The system SHALL handle IndexedDB errors gracefully with fallback mechanisms.

#### Scenario: IndexedDB non disponible

- GIVEN a browser without IndexedDB support
- WHEN the application starts
- THEN the system falls back to localStorage
- AND displays a warning about limited functionality

#### Scenario: Erreur de lecture IndexedDB

- GIVEN an IndexedDB read error
- WHEN the system attempts to read data
- THEN the system shows an error message
- AND offers to retry or restore from backup