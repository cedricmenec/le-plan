# Le Plan

Application de gestion de projets et missions en local-first (100% navigateur).

## Stack

- **Framework** : Vite + React 19
- **Routage** : React Router v7
- **Stockage** : IndexedDB (via Dexie)
- **UI** : Tailwind CSS v4 + shadcn/ui
- **Build** : Static (SPA pure)

## Getting Started

```bash
npm install
npm run dev
# or
pnpm install && pnpm dev
# or
yarn
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the application.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Build TypeScript puis build Vite vers `dist/` |
| `npm run preview` | Prévisualise le build statique localement |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run test` | Exécute les tests avec Vitest |
| `npm run check` | Lint + tests + TypeScript check complet |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Browser (SPA)                   │
├─────────────────────────────────────────────────┤
│  Vite + React 19   |   React Router v7          │
│  Tailwind CSS v4   |   shadcn/ui composants     │
│  Dexie (IndexedDB) |   Export/Import JSON       │
└─────────────────────────────────────────────────┘
```

L'application fonctionne **entièrement en local** dans le navigateur, sans serveur backend. Toutes les données sont stockées dans IndexedDB.

## Fonctionnalités

- Gestion de projets (CRUD)
- Gestion de missions (CRUD, transitions d'état)
- Gestion de tâches (CRUD, réordonnancement)
- Jalons (milestones) avec types
- Historique des changements de statut
- Fonctionnement hors ligne complet
- Export/Import des données (JSON)
- Indicateur réseau (online/offline)

## Déploiement

### Build statique

```bash
npm run build
```

Le build est généré dans le dossier `dist/`.

### GitHub Pages

1. Mettre à jour `vite.config.ts` : décommenter `base: '/le-plan/'` (ou le nom de votre repo)
2. Build : `npm run build`
3. Déployer le dossier `dist/` sur GitHub Pages

### Hostinger (FTP)

1. Build : `npm run build`
2. Uploader le contenu du dossier `dist/` via FTP vers le répertoire public

## Tests

```bash
npm run test        # Exécute tous les tests
npx vitest --ui     # Interface vitest UI
npx vitest run      # Mode run (sans watch)
```

## Données

L'application stocke toutes les données localement dans IndexedDB. Pour sauvegarder ou transférer vos données :

1. Allez dans les paramètres de l'application
2. Utilisez "Exporter les données" pour télécharger un fichier JSON
3. Sur un autre appareil/navigateur, utilisez "Importer les données"

## Projet initial

This project was originally bootstrapped with Next.js (`create-next-app`) and Supabase backend, then migrated to a local-first architecture with Vite + React + IndexedDB.

## License

MIT
