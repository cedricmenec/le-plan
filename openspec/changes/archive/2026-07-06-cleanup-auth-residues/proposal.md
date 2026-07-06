## Why

L'application a migré vers une architecture 100% locale (IndexedDB, Vite, React Router) sans authentification. Cependant, les artefacts OpenSpec — specs principales, config, et code résiduel — contiennent encore des références à l'authentification Supabase et à la notion d'utilisateur authentifié. Cette dette documentaire crée de la confusion et peut induire en erreur les futurs changements (le LLM se base sur ces specs pour générer des recommandations).

## What Changes

- **Suppression** du spec `authentication/spec.md` (obsolète — l'authentification n'existe plus)
- **Mise à jour** des specs `missions/spec.md`, `projects/spec.md`, `tasks/spec.md` : remplacer "authenticated user" par "user" et reformuler les scénarios pour refléter l'absence d'authentification
- **Mise à jour** de `openspec/config.yaml` : corriger le contexte technique (stack, architecture, contraintes de sécurité, déploiement)
- **Nettoyage** du commentaire résiduel dans `src/components/projects/project-mission-list.tsx` (mention Supabase obsolète)
- **Suppression** de la notion d'utilisateur dans les specs — l'application est mono-utilisateur locale, pas de concept d'identité

## Capabilities

### New Capabilities

Aucune nouvelle capability — il s'agit d'un cleanup de spécifications existantes.

### Modified Capabilities

- `missions`: Suppression de la notion d'utilisateur authentifié dans tous les scénarios
- `projects`: Suppression de la notion d'utilisateur authentifié dans tous les scénarios
- `tasks`: Suppression de la notion d'utilisateur authentifié dans tous les scénarios

## Impact

- **Specs** : 1 fichier supprimé (`authentication/spec.md`), 3 fichiers modifiés
- **Config** : `openspec/config.yaml` mis à jour (stack, architecture, sécurité, déploiement)
- **Code** : 1 commentaire nettoyé dans `project-mission-list.tsx`
- **Aucun impact fonctionnel** — le code est déjà propre, seul le résidu documentaire est traité
