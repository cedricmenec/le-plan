# Auth Removal Specification

## Purpose

Définir la suppression de l'authentification Supabase et la transition vers un accès direct local. Cette spécification couvre la suppression des dépendances d'authentification, la gestion des données utilisateur, et les implications de cette suppression.

## Requirements

### Requirement: Suppression de Supabase Auth

The system SHALL remove all Supabase authentication dependencies and replace them with direct local access.

#### Scenario: Suppression des providers d'authentification

- GIVEN the application with Supabase Auth configured
- WHEN the system removes authentication
- THEN all OAuth providers (Google, GitHub, etc.) are removed
- AND the login page is replaced with a direct access landing page

#### Scenario: Suppression des middlewares d'authentification

- GIVEN middleware.ts protecting routes
- WHEN the system removes authentication
- THEN the middleware is simplified or removed
- AND all routes are accessible without authentication

### Requirement: Accès direct aux données

The system SHALL provide direct access to user data without authentication barriers.

#### Scenario: Accès immédiat à l'application

- GIVEN a user opening the application
- WHEN the user navigates to any page
- THEN the system loads data from IndexedDB
- AND no login prompt is shown

#### Scenario: Gestion des données utilisateur

- GIVEN the application without authentication
- WHEN the user creates or modifies data
- THEN the system stores data in IndexedDB
- AND associates data with the current browser context

### Requirement: Suppression des API routes d'authentification

The system SHALL remove all authentication-related API routes.

#### Scenario: Suppression des routes d'inscription

- GIVEN API routes for user registration
- WHEN the system removes authentication
- THEN the routes are deleted
- AND no registration functionality is needed

#### Scenario: Suppression des routes de connexion

- GIVEN API routes for login/logout
- WHEN the system removes authentication
- THEN the routes are deleted
- AND no session management is needed

### Requirement: Nettoyage des dépendances

The system SHALL remove Supabase client and authentication libraries from the project.

#### Scenario: Suppression du client Supabase

- GIVEN the application using @supabase/supabase-js
- WHEN the system removes authentication
- THEN the package is removed from package.json
- AND all imports are removed from the codebase

#### Scenario: Suppression des environnements

- GIVEN .env files with Supabase credentials
- WHEN the system removes authentication
- THEN SUPABASE_URL and SUPABASE_KEY are removed
- AND the files are cleaned up

### Requirement: Migration des données utilisateur

The system SHALL ensure user data is properly migrated before authentication removal.

#### Scenario: Export des données avant suppression

- GIVEN existing user data in Supabase
- WHEN the system prepares for auth removal
- THEN the user exports all data to JSON
- AND the data is imported into IndexedDB

#### Scenario: Validation des données migrées

- GIVEN exported data
- WHEN the system imports data into IndexedDB
- THEN all user projects, missions, and tasks are present
- AND the data is queryable without authentication

### Requirement: Interface utilisateur adaptée

The system SHALL update the UI to remove authentication-related elements.

#### Scenario: Suppression du menu de déconnexion

- GIVEN a navigation menu with logout option
- WHEN the system removes authentication
- THEN the logout option is removed
- AND the menu is simplified

#### Scenario: Redirection des pages d'accueil

- GIVEN a login page as the default route
- WHEN the system removes authentication
- THEN the dashboard or projects page becomes the default
- AND users land directly on the main application

### Requirement: Sécurité des données locales

The system SHALL ensure data security in the local-first model.

#### Scenario: Isolation des données par navigateur

- GIVEN multiple users on the same machine
- WHEN different browsers access the application
- THEN each browser has its own IndexedDB
- AND data is isolated between browsers

#### Scenario: Protection contre la perte accidentelle

- GIVEN user data in IndexedDB
- WHEN the user clears browser data
- THEN the system warns about data loss
- AND offers export functionality

### Requirement: Plan pour futur vault

The system SHALL prepare for future implementation of a local vault for sensitive data.

#### Scenario: Architecture extensible

- GIVEN the local-first architecture
- WHEN a vault is implemented in the future
- THEN the system can add encryption for sensitive fields
- AND API keys can be stored securely

#### Scenario: Migration vers vault

- GIVEN a user with sensitive data
- WHEN the vault is implemented
- THEN the system prompts for vault password
- AND encrypts sensitive fields (API keys, etc.)