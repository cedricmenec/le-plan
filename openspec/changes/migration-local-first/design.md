# Migration Local-First Design

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Architecture                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐     ┌─────────────────┐     ┌────────────────┐  │
│  │   Browser       │     │   IndexedDB     │     │  Static Files  │  │
│  │                 │◄───►│                 │◄───►│                │  │
│  │  Vite + React   │     │  (persistance)  │     │  (HTML/CSS/JS) │  │
│  │  (Client SPA)   │     │                 │     │  (dist/)       │  │
│  │  - React Router │     │                 │     │                │  │
│  │  - Dexie        │     │                 │     │                │  │
│  └─────────────────┘     └─────────────────┘     └────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Composants React                            │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │    │
│  │  │  Layout     │  │  Pages      │  │  UI (shadcn/ui)     │   │    │
│  │  │  - Shell    │  │  - Missions │  │  - Dialogues        │   │    │
│  │  │  - Sidebar  │  │  - Projects │  │  - Formulaires      │   │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Service Layer                              │    │
│  │  ┌─────────────────┐  ┌─────────────────┐                    │    │
│  │  │   DB Service    │  │   Export/Import │                    │    │
│  │  │   (lib/db.ts)   │  │   (lib/db.ts)   │                    │    │
│  │  │   - Dexie CRUD  │  │   - JSON export │                    │    │
│  │  │   - IndexedDB   │  │   - JSON import │                    │    │
│  │  └─────────────────┘  └─────────────────┘                    │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Data Models                               │    │
│  │  Project, Mission, Subtask, Milestone, MilestoneType,        │    │
│  │  StatusHistory                                                │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Technical Decisions

### 1. IndexedDB Selection

**Decision**: Utiliser IndexedDB comme stockage principal

**Rationale**:
- Persistance persistante dans le navigateur
- Support natif sans dépendances externes
- Capacité suffisante pour nos données (< 1MB)
- API asynchrone non bloquante

**Alternatives considered**:
- localStorage: Limité à 5-10MB, synchrone, moins performant
- WebSQL: Obsolète, pas supporté par tous les navigateurs
- Files API: Plus complexe, nécessite gestion de fichiers

### 2. Library de wrapper

**Decision**: Utiliser `idb` ou `dexie` pour simplifier l'API IndexedDB

**Rationale**:
- API plus simple que l'API native IndexedDB
- Gestion des promesses intégrée
- Mécanismes de versionnement

**Choice**: `idb` (plus léger) vs `dexie` (plus complet)

### 3. Architecture des services

**Decision**: Créer un service de base de données abstrait

```typescript
// lib/db.ts
export class DatabaseService {
  private db: IDBDatabase | null = null;
  
  async init(): Promise<void> {
    // Ouvrir la base de données
  }
  
  async createProject(project: Project): Promise<string> {
    // Opération CREATE
  }
  
  async getProject(id: string): Promise<Project | null> {
    // Opération READ
  }
  
  async updateProject(project: Project): Promise<void> {
    // Opération UPDATE
  }
  
  async deleteProject(id: string): Promise<void> {
    // Opération DELETE
  }
}
```

### 4. Migration des données

**Decision**: Script de migration unidirectionnel

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Supabase DB    │────▶│  Export JSON    │────▶│  IndexedDB      │
│  (PostgreSQL)   │     │  (migration.js) │     │  (import)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Process**:
1. Export SQL depuis Supabase
2. Script Node.js pour conversion JSON
3. Import dans IndexedDB via le service

### 5. Gestion des états

**Decision**: Conserver le modèle d'états existant

```
Mission States:
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Backlog │────▶│ Queued  │────▶│ Active  │────▶│Suspended│────▶│Terminated│
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
     ▲                                                             │
     └─────────────────────────────────────────────────────────────┘
```

**Transitions valides**:
- Backlog → Queued
- Queued → Active
- Active → Suspended (avec raison: Blocked, Deprioritized)
- Active → Terminated (avec raison: Done, Cancelled)
- Suspended → Active
- Suspended → Terminated (avec raison: Done, Cancelled)
- Terminated → Queued (Réouverture)

### 6. Indexation

**Decision**: Créer des indexes pour les requêtes fréquentes

```typescript
// Indexes par store
projects: ['name', 'status', 'userId']
missions: ['state', 'priority', 'projectId', 'userId', 'estimatedDeliveryDate']
subtasks: ['missionId', 'isCompleted', 'position']
milestones: ['missionId', 'date']
statusHistory: ['missionId', 'createdAt']
```

### 7. Cache et performance

**Decision**: Utiliser le cache navigateur pour les assets statiques

- HTML/CSS/JS: Cache avec content-hash
- Images: Optimisées et mises en cache
- Données: IndexedDB avec requêtes indexées

### 8. Sécurité

**Decision**: Confiance en l'utilisateur unique

- Pas de chiffrement (données non sensibles)
- Isolation par navigateur
- Export/import pour sauvegarde

**Future**: Implémenter un vault pour les clés API sensibles

### 9. Framework Vite (remplacement de Next.js)

**Decision**: Remplacer Next.js par Vite + React Router

**Rationale**:
- Application 100% client-side (plus de SSR, Server Components, ou API routes)
- Next.js bloque le build statique avec `output: 'export'` pour les routes dynamiques
- Vite produit un build statique pur sans runtime serveur
- React Router gère les routes dynamiques sans configuration
- Build plus rapide, bundle plus léger, zéro complexité serveur

**Alternatives considered**:
- Next.js `output: 'export'` + `generateStaticParams()`: impossible car les données sont dans IndexedDB
- Remix: Même problème de server-centric design
- SvelteKit: Sur-engineering pour une SPA

**Migration**:
```
next.config.ts          → vite.config.ts
app/layout.tsx           → src/App.tsx + src/main.tsx
app/page.tsx             → src/pages/Home.tsx
app/projects/page.tsx    → src/pages/Projects.tsx
app/projects/[id]/*      → src/pages/ProjectDetail.tsx
app/missions/[id]/*      → src/pages/MissionDetail.tsx
app/error/page.tsx       → src/pages/Error.tsx
app/globals.css          → src/index.css
pages/ not found         → 404.tsx / route fallback
components/*             → src/components/*  (identique)
lib/*                    → src/lib/*  (identique)
```

### 10. Routing

**Decision**: Utiliser React Router v7+ (ou v6) pour le routing client-side

**Rationale**:
- Routes dynamiques natives (`/projects/:id`, `/missions/:id`)
- Aucune configuration spéciale pour le build statique
- Navigation instantanée avec chargement des données depuis IndexedDB
- Pas besoin de `generateStaticParams()` ni de pré-génération

## Dependencies to Remove / Change

```json
{
  "removed": [
    "next",
    "next-env.d.ts (file)",
    "@supabase/supabase-js",
    "@supabase/ssr",
    "@prisma/client",
    "@prisma/adapter-pg",
    "prisma",
    "pg",
    "@types/pg",
    "eslint-config-next"
  ],
  "added": [
    "react-router-dom",
    "@tailwindcss/vite"
  ],
  "kept": [
    "react",
    "react-dom",
    "tailwindcss",
    "typescript",
    "dexie",
    "lucide-react",
    "date-fns",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "@dnd-kit/core",
    "@dnd-kit/sortable",
    "@dnd-kit/utilities",
    "@radix-ui/*",
    "vitest",
    "jsdom",
    "@testing-library/react",
    "@vitejs/plugin-react"
  ]
}
```

## Files to Create

- `vite.config.ts`
- `index.html` (à la racine)
- `src/main.tsx`
- `src/App.tsx`
- `src/pages/Home.tsx`
- `src/pages/Projects.tsx`
- `src/pages/ProjectDetail.tsx`
- `src/pages/MissionDetail.tsx`
- `src/pages/Error.tsx`
- `src/index.css`
- `src/404.tsx`

## Files to Delete

- `next.config.ts`
- `next-env.d.ts`
- `app/` (tout le dossier)
- `middleware.ts`
- `prisma/` (tout le dossier)
- `public/` (à recréer proprement)
- `lib/supabase/`
- `lib/prisma.ts`

## Files to Move (conserver le contenu)

- `lib/` → `src/lib/`
- `types/` → `src/types/`
- `components/` → `src/components/`