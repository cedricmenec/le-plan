# Static Build Specification

## Purpose

Définir comment configurer Vite pour produire un build statique déployable sur n'importe quel hébergeur de fichiers statiques (GitHub Pages, Hostinger, etc.). Cette spécification couvre la configuration Vite, le routage client-side, et les adaptations nécessaires pour un build statique pur.

## Requirements

### Requirement: Configuration Vite statique

The system SHALL configure Vite to produce a static build output to `/dist`.

#### Scenario: Build statique réussi

- GIVEN the application configured with Vite
- WHEN the user runs `npm run build`
- THEN the system produces a `/dist` directory with static HTML, CSS, and JS files
- AND no server-side rendering is required
- AND the application is a pure SPA with client-side routing

### Requirement: Suppression des API routes dynamiques

The system SHALL remove or convert all dynamic API routes to client-side operations using IndexedDB.

#### Scenario: Suppression des routes d'authentification

- GIVEN the application with Supabase auth API routes
- WHEN the system migrates to local-first
- THEN the auth routes are removed or converted to client-side IndexedDB operations

#### Scenario: Conversion des routes de données

- GIVEN API routes for CRUD operations on projects, missions, tasks
- WHEN the system migrates to local-first
- THEN the data operations are performed client-side via IndexedDB
- AND the routes are either removed or become no-ops

### Requirement: Adaptation des composants pour client-side

The system SHALL adapt all data-fetching components to work with client-side IndexedDB instead of server-side data fetching.

#### Scenario: Chargement des projets côté client

- GIVEN a Projects page component
- WHEN the user navigates to /projects
- THEN the component fetches data from IndexedDB on mount
- AND displays a loading state while data loads

#### Scenario: Formulaires de création/modification

- GIVEN a Create/Edit Project form
- WHEN the user submits the form
- THEN the form saves data to IndexedDB
- AND updates the UI optimistically

### Requirement: Préfetching des données statiques

The system SHALL prefetch static data at build time where possible to improve initial load performance.

#### Scenario: Préfichage des données utilisateur par défaut

- GIVEN a new user with no data
- WHEN the application loads for the first time
- THEN the system creates empty IndexedDB stores
- AND displays the empty state UI

### Requirement: Gestion des routes dynamiques

The system SHALL handle dynamic routes (e.g., /projects/[id], /missions/[id]) using client-side routing with IndexedDB data.

#### Scenario: Navigation vers un projet existant

- GIVEN an authenticated user with projects
- WHEN the user clicks on a project from the list
- THEN the system uses React Router client-side routing
- AND the project detail page loads data from IndexedDB

#### Scenario: Accès direct à une URL dynamique

- GIVEN a user accessing /projects/123 directly
- WHEN the application loads
- THEN React Router matches the route and renders the component
- AND loads the project data from IndexedDB
- OR shows a not-found state if the project doesn't exist

### Requirement: Optimisation des assets statiques

The system SHALL optimize static assets for fast loading in a static deployment environment.

#### Scenario: Compression des assets

- GIVEN the build process via Vite
- WHEN the system generates static files
- THEN CSS and JS files are minified by Vite
- AND images are optimized via vite-plugin

#### Scenario: Cache des assets

- GIVEN static assets with content hashes
- WHEN the user revisits the application
- THEN the browser uses cached assets
- AND only new assets are downloaded

### Requirement: Configuration de déploiement

The system SHALL provide configuration for deploying to static hosting platforms.

#### Scenario: Déploiement sur GitHub Pages

- GIVEN the static build output from Vite
- WHEN deploying to GitHub Pages
- THEN the `dist` directory is deployed to the gh-pages branch
- AND the application is accessible at the GitHub Pages URL

#### Scenario: Déploiement sur Hostinger

- GIVEN the static build output from Vite
- WHEN deploying to Hostinger
- THEN the `dist` directory contents are uploaded via FTP
- AND the application is accessible at the configured domain

### Requirement: Fallback pour données vides

The system SHALL handle the case where IndexedDB is empty (new user or cleared data) gracefully.

#### Scenario: Première utilisation

- GIVEN a new user or cleared IndexedDB
- WHEN the user opens the application
- THEN the system shows empty state UI
- AND provides clear instructions to import data

#### Scenario: Données non trouvées

- GIVEN a user accessing a non-existent project
- WHEN the user navigates to /projects/nonexistent
- THEN the system shows a 404 page
- OR redirects to the projects list with an error message

### Requirement: Performance du build statique

The system SHALL achieve fast initial load times with static assets.

#### Scenario: Temps de chargement initial

- GIVEN a user accessing the application
- WHEN the static files are loaded
- THEN the initial HTML is served instantly
- AND the application becomes interactive within 2 seconds

#### Scenario: Taille des bundles

- GIVEN the static build
- WHEN the build completes
- THEN the total JavaScript bundle size is under 500KB
- AND CSS is under 100KB