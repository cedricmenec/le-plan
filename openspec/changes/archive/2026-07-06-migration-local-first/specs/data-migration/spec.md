# Data Migration Specification

## Purpose

Définir comment exporter les données depuis Supabase (PostgreSQL) vers un format JSON utilisable par IndexedDB. Cette spécification couvre l'export des entités: users, projects, missions, subtasks, milestones, et mission_status_history.

## Requirements

### Requirement: Export des projets

The system SHALL export all projects belonging to the authenticated user with their associated metadata (name, label, description, color, image_url, status, timestamps).

#### Scenario: Export des projets depuis Supabase

- GIVEN an authenticated user with existing projects in Supabase
- WHEN the user initiates a data export
- THEN the system exports all projects as JSON
- AND each project includes all fields: id, name, label, description, color, image_url, status, created_at, updated_at

### Requirement: Export des missions

The system SHALL export all missions with their relationships to projects, including all mission fields (title, type, estimation, confidence, state, priority, goal, notes, delivery dates, ROM size, load source).

#### Scenario: Export des missions avec relations

- GIVEN an authenticated user with existing missions in Supabase
- WHEN the user initiates a data export
- THEN the system exports all missions as JSON
- AND each mission includes project_id reference (or null if standalone)
- AND each mission includes all fields: id, title, type, estimation, confidence, state, priority, goal, notes, estimated_delivery_date, desired_delivery_date, rom_size, load_source, created_at, updated_at

### Requirement: Export des tâches (subtasks)

The system SHALL export all subtasks with their mission associations, including completion status and position.

#### Scenario: Export des tâches

- GIVEN an authenticated user with existing subtasks in Supabase
- WHEN the user initiates a data export
- THEN the system exports all subtasks as JSON
- AND each subtask includes mission_id reference
- AND each subtask includes all fields: id, title, is_completed, position, estimation, status, created_at, updated_at

### Requirement: Export des jalons (milestones)

The system SHALL export all milestones with their mission associations and milestone types.

#### Scenario: Export des jalons

- GIVEN an authenticated user with existing milestones in Supabase
- WHEN the user initiates a data export
- THEN the system exports all milestones as JSON
- AND each milestone includes mission_id and type_id references
- AND each milestone includes all fields: id, title, date, note, created_at

### Requirement: Export de l'historique des états

The system SHALL export all mission status history entries for audit trail reconstruction.

#### Scenario: Export de l'historique

- GIVEN an authenticated user with existing status history in Supabase
- WHEN the user initiates a data export
- THEN the system exports all status history entries as JSON
- AND each entry includes mission_id reference
- AND each entry includes all fields: id, mission_id, status, reason, note, created_at

### Requirement: Export des utilisateurs

The system SHALL export user data necessary for local authentication (email, password hash if local auth is implemented).

#### Scenario: Export des données utilisateur

- GIVEN an authenticated user in Supabase
- WHEN the user initiates a data export
- THEN the system exports user data as JSON
- AND the export includes: id, email, created_at, updated_at
- AND sensitive data (passwords) are handled according to security policy

### Requirement: Validation de l'intégrité des données

The system SHALL validate that all exported data maintains referential integrity (foreign key relationships).

#### Scenario: Validation des relations

- GIVEN an exported dataset
- WHEN the system validates the data
- THEN the system confirms all mission.project_id values reference existing projects
- AND all subtask.mission_id values reference existing missions
- AND all milestone.mission_id values reference existing missions
- AND all status_history.mission_id values reference existing missions

### Requirement: Format d'export standardisé

The system SHALL export data in a standardized JSON format with a version identifier and metadata.

#### Scenario: Format JSON structuré

- GIVEN an authenticated user initiating export
- WHEN the export completes
- THEN the system produces a JSON file with structure:
  ```json
  {
    "version": "1.0",
    "exported_at": "ISO8601 timestamp",
    "user": { "id": "...", "email": "..." },
    "projects": [...],
    "missions": [...],
    "subtasks": [...],
    "milestones": [...],
    "status_history": [...]
  }
  ```

### Requirement: Import vers IndexedDB

The system SHALL import exported JSON data into IndexedDB with proper indexing and relationships.

#### Scenario: Import vers IndexedDB

- GIVEN a valid exported JSON file
- WHEN the user imports the data
- THEN the system creates all object stores in IndexedDB
- AND all data is persisted with correct relationships
- AND the application can query the data without network access