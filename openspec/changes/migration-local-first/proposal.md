# Migration vers application Local-First (IndexedDB)

## Why

L'application actuelle dépend d'un backend Supabase (PostgreSQL hébergé) pour la persistance des données et l'authentification. Cette dépendance crée une dépendance réseau, des coûts d'hébergement et une complexité inutile pour une application personnelle.

La migration vers une architecture **Local-First** avec **IndexedDB** permettra:
- D'avoir une application 100% fonctionnelle hors ligne
- De supprimer les coûts d'hébergement Supabase
- D'obtenir un build statique déployable sur n'importe quel hébergeur de fichiers statiques
- De simplifier l'architecture en supprimant la couche backend

## What Changes

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Avant (Cloud)                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)  │  Backend (Supabase)  │  Auth (Supabase)│
│  - SSR/SSG           │  - PostgreSQL        │  - OAuth        │
│  - API Routes        │  - RLS               │  - Sessions     │
│  - SWR               │  - Realtime          │                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Après (Local-First)                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Vite + React)   │  IndexedDB (Browser)            │
│  - Build statique pur      │  - Persistance locale           │
│  - Client-side only        │  - Aucun backend requis         │
│  - React Router            │  - Aucun Auth (accès direct)    │
│  - Pas de runtime serveur  │                                 │
└─────────────────────────────────────────────────────────────┘
```

### Fonctionnalités supprimées
- Authentification Supabase (remplacée par accès direct)
- Synchronisation en temps réel
- API Routes dynamiques
- Row-Level Security

### Fonctionnalités conservées
- Gestion des projets
- Gestion des missions
- Gestion des tâches
- Historique des changements
- États des missions (Backlog, Queued, Active, Suspended, Terminated)
- Priorité, estimation, dates de livraison

## Capabilities

| Capability | Description |
| --- | --- |
| `data-migration` | Exporter les données depuis Supabase vers un format JSON utilisable par IndexedDB |
| `indexeddb-storage` | Implémenter un service de persistance IndexedDB pour les entités (projects, missions, tasks, milestones) |
| `static-build` | Configurer Next.js pour produire un build statique (output: 'export') |
| `auth-removal` | Supprimer l'authentification Supabase et les API routes associées |
| `offline-support` | Ajouter la gestion des données hors ligne avec persistance automatique |

## Impact

### Utilisateur
- ✅ Application disponible hors ligne
- ✅ Pas de connexion requise
- ✅ Temps de chargement instantané
- ❌ Pas de synchronisation multi-appareils (pour le MVP)

### Technique
- ✅ Réduction des dépendances externes
- ✅ Build statique plus simple
- ✅ Coûts d'hébergement éliminés
- ✅ Tests plus simples (pas de mock backend)

### Données
- ✅ Toutes les données existantes migrées
- ✅ Format JSON exportable/importable
- ✅ Sauvegarde possible via localStorage

## Risks

1. **Perte de données**: Risque d'erreur pendant l'export. Mitigation: export JSON de secours avant migration.
2. **Capacité IndexedDB**: Pour des volumes importants, IndexedDB a des limites. Notre cas (30 tâches) est anecdotique.
3. **Compatibilité navigateur**: IndexedDB nécessite un navigateur moderne. Supporté par 99% des navigateurs actuels.

## Success Criteria

- [ ] Application buildable en statique (Vite `vite build` → `/dist`)
- [ ] Application fonctionnelle sans connexion réseau
- [ ] Routes dynamiques fonctionnelles (`/projects/:id`, `/missions/:id`)
- [ ] Build déployable sur GitHub Pages ou Hostinger
- [ ] Bundle JS < 300KB, temps de chargement < 1.5s