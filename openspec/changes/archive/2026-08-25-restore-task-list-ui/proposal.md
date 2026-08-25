## Why

La liste de tâches (sous-tâches de mission) a disparu de l'interface lors de la migration local-first (`2026-07-08-migration-local-first`) : le composant `TaskList` a été remplacé par une coquille vide (`return <div />`). La couche données (table Dexie `subtasks`, actions CRUD, calculs de charge) est intacte et fonctionnelle, mais l'utilisateur ne peut plus voir ni gérer le découpage opérationnel de ses missions. Les tâches servent à découper une mission en sous-actions, estimer le temps par tâche, calculer le temps réalisé et visualiser ce qui reste à faire — cette capacité est actuellement invisible.

## What Changes

- Restaurer le rendu du composant `src/components/missions/task-list.tsx` en s'appuyant sur les actions Dexie déjà disponibles (`createTask`, `updateTask`, `reorderTasks`, `deleteTask` dans `src/app/missions/actions.ts`, `getSubtasks` dans `src/lib/db.ts`)
- Réintégrer les fonctionnalités conformes à la spec `tasks` existante : création, édition inline du titre, estimation en demi-journées, complétion par checkbox, réordonnancement drag & drop, suppression, masquage des tâches terminées avec toggle, compteur "X restantes / Y total"
- Supprimer les imports morts et le composant `SortableTaskItem` incomplet laissés par la migration interrompue
- Supprimer le fichier mort `src/components/missions/mission-detail-page-client.tsx` (composant `MissionDetailContent` non référencé, doublon obsolète de `src/pages/MissionDetail.tsx`)
- Aucun changement de schéma de données : la table `subtasks` et ses index existants sont conservés tels quels

## Capabilities

### New Capabilities

Aucune — la spec `tasks` existe déjà dans `openspec/specs/tasks/spec.md` et décrit exactement le comportement attendu.

### Modified Capabilities

Aucune au niveau des requirements — il s'agit d'une restauration d'implémentation pour se conformer à la spec `tasks` existante, pas d'un changement de comportement spécifié.

## Impact

- **Code modifié** : `src/components/missions/task-list.tsx` (réécriture du rendu), suppression de `src/components/missions/mission-detail-page-client.tsx`
- **Code inchangé** : `src/lib/db.ts`, `src/app/missions/actions.ts`, `src/lib/load-utils.ts`, `src/pages/MissionDetail.tsx`
- **Tests** : restaurer un test unitaire pour `TaskList` (l'ancien `task-list.test.tsx` a été supprimé lors de la migration ; les tests actuels mockent le composant, ce qui masquait la régression)
- **Données** : aucune migration requise ; les sous-tâches existantes en IndexedDB redeviennent visibles immédiatement
- **Risques** :
  - L'ancien code appelait `deleteTaskAction(missionId, id)` alors que l'action Dexie expose `deleteTask(id)` — attention au branchement
  - Vérifier que le rendu restauré respecte le mode `readonly` (missions Terminated) déjà présent dans la page
