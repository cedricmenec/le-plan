# Le Plan

Le Plan rend la charge de travail visible et facilite les arbitrages entre missions. Cette application web personnelle s’adresse aux professionnels qui pilotent plusieurs sujets en parallèle et souhaitent expliquer leurs priorités et leurs délais à des Product Managers sans recourir à un outil de suivi du temps ou de gestion de tâches complexe.

L’application fonctionne sans compte ni backend. Les projets, missions, tâches, jalons et historiques sont conservés localement dans le navigateur avec IndexedDB.

## Fonctionnalités principales

- organisation des missions par projet et par état (`Backlog`, `Queued`, `Active`, `Suspended`, `Terminated`) ;
- priorisation et réordonnancement des files de missions ;
- estimation de charge, niveau de confiance et dates de livraison ;
- décomposition en tâches et suivi de jalons ;
- historique des changements d’état ;
- import et export des données au format JSON.

Le Plan est volontairement mono-utilisateur. Il ne fournit ni authentification, ni synchronisation entre appareils, ni fonctions collaboratives, et n’a pas vocation à devenir un outil de time tracking exhaustif.

## Démarrage rapide

### Prérequis

- Node.js 20 ;
- npm.

1. Installez les dépendances :

   ```bash
   npm ci
   ```

2. Lancez le serveur de développement :

   ```bash
   npm run dev
   ```

3. Ouvrez [http://localhost:5173/le-plan/](http://localhost:5173/le-plan/). Le tableau de bord de Le Plan doit s’afficher.

## Données locales

Les données restent dans le profil du navigateur et sont associées à l’origine depuis laquelle l’application est ouverte. Effacer les données du site ou changer de navigateur, de profil ou d’adresse peut donc rendre le contenu local inaccessible.

Utilisez les fonctions d’export et d’import JSON de l’application pour sauvegarder vos données ou les transférer vers un autre navigateur.

## Scripts utiles

| Commande | Résultat |
| --- | --- |
| `npm run dev` | Lance le serveur de développement Vite. |
| `npm run test` | Exécute la suite de tests avec Vitest. |
| `npm run build` | Vérifie TypeScript et génère le site statique dans `dist/`. |
| `npm run preview` | Sert localement le contenu généré dans `dist/`. |

## Architecture et déploiement

Le Plan est une SPA React 19 et TypeScript construite avec Vite. L’interface utilise Tailwind CSS et des composants shadcn/ui ; Dexie fournit l’accès à IndexedDB. Le routage par fragment (`#/...`) permet de servir l’application depuis un hébergement statique sans règle de réécriture côté serveur.

Pour produire les fichiers à déployer :

```bash
npm run build
```

Le dépôt configure Vite pour le chemin de base `/le-plan/`. Adaptez la propriété `base` de `vite.config.ts` si l’application doit être publiée sous un autre chemin. Le workflow [Deploy to GitHub Pages](.github/workflows/deploy-github-pages.yml) construit et déploie automatiquement `dist/` lors d’un push sur `main`.

## Contribuer

Le projet n’est pas encore suffisamment mature pour accueillir des contributions externes dans de bonnes conditions. Les modalités de contribution seront publiées dès que le processus sera prêt. Merci de votre intérêt et de votre compréhension.

## Pour aller plus loin

- [Vision, objectifs et limites du produit](project-goals-fr.md)
- [Cycle de vie d’une mission](docs/cycle-de-vie-mission.md)
- [Spécifications des missions](openspec/specs/missions/spec.md)
- [Spécifications des projets](openspec/specs/projects/spec.md)
- [Spécifications des tâches](openspec/specs/tasks/spec.md)
