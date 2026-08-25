## Context

La migration local-first (`2026-07-08-migration-local-first`) a remplacé le composant `TaskList` (383 lignes, branché sur Supabase) par une coquille vide (`return <div />`). La couche données est entièrement migrée et fonctionnelle :

- Table Dexie `subtasks` avec index `id, mission_id, is_completed, position` (`src/lib/db.ts`)
- Actions CRUD complètes : `getSubtasks`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks` (`src/app/missions/actions.ts`, wrappers autour de `db.ts`)
- Calculs de charge : `calculateTaskRemainingLoad` (`src/lib/load-utils.ts`) alimente déjà cartes mission et hero

La page active `src/pages/MissionDetail.tsx` rend `<TaskList missionId={id} readonly={isReadonly} />` dans la colonne latérale. L'ancienne version du composant est récupérable dans l'historique git (`2cb3da4^:components/missions/task-list.tsx`) mais nécessite un rebranchement : elle appelait Supabase directement et utilisait une signature différente pour la suppression.

Contraintes :
- Stack : Vite + React + TypeScript, Tailwind, shadcn/ui, Dexie, @dnd-kit pour le drag & drop
- Mode `readonly` obligatoire pour les missions en état `Terminated`
- Tests Vitest ; les tests existants mockent `task-list`, ce qui a masqué la régression

## Goals / Non-Goals

**Goals:**
- Restaurer le rendu complet de `TaskList` conforme à la spec `openspec/specs/tasks/spec.md` : création, édition inline, estimation en demi-journées, complétion, drag & drop, suppression, toggle des terminées, compteur
- Brancher sur les actions Dexie existantes sans modification de la couche données
- Réintroduire des tests unitaires sur `TaskList` pour éviter que ce type de régression ne repasse inaperçu
- Nettoyer le code mort laissé par la migration (imports inutilisés, `SortableTaskItem` incomplet, `mission-detail-page-client.tsx` non référencé)

**Non-Goals:**
- Aucune évolution fonctionnelle au-delà de la spec existante (pas de temps réel passé vs estimé, pas de sous-sous-tâches)
- Aucun changement de schéma de données ni migration
- Pas de refonte UI : reprendre le design visuel de l'ancienne version (cohérent avec le reste de l'app)
- Ne pas toucher aux indicateurs de charge existants (cartes, hero) qui fonctionnent déjà

## Decisions

### D1 — Réécrire le rendu à partir de l'ancienne version, en adaptant la couche d'accès aux données

Récupérer le JSX et la logique d'état de `2cb3da4^:components/missions/task-list.tsx`, mais remplacer l'appel direct Supabase par `getSubtasks(missionId)` depuis `src/lib/db.ts`.

*Alternatives considérées :*
- Réécrire de zéro : perte inutile d'un design validé et testé en production
- Garder la coquille et créer un nouveau composant : dupliquerait le concept

### D2 — Signatures d'actions : utiliser celles de `src/app/missions/actions.ts`

L'ancien code appelait `deleteTaskAction(missionId, id)` ; l'action actuelle expose `deleteTask(id)`. Le nouveau code utilise les signatures actuelles : `createTask({ mission_id, title, position, is_completed, estimation })`, `updateTask(id, updates)`, `deleteTask(id)`, `reorderTasks(missionId, updates)`.

*Risque associé : voir R1.*

### D3 — État local optimiste avec rollback

Conserver le pattern de l'ancienne version : mise à jour immédiate du state local, appel action, rollback en cas d'erreur. Cohérent avec le reste de l'app (composants missions existants) et adapté au local-first où les erreurs sont rares (IndexedDB local).

*Alternatives :* React Query / SWR — dépendance supplémentaire injustifiée pour une app mono-utilisateur locale.

### D4 — Chargement initial via `getSubtasks` + rechargement géré par la page parente

`TaskList` charge ses tâches au montage via `getSubtasks(missionId)`. Après création/suppression, l'état local suffit. La page `MissionDetail.tsx` recharge déjà les données mission via `loadData()` après `handleUpdate` — aucun couplage supplémentaire nécessaire puisque les indicateurs de charge sont calculés côté serveur-actions à partir de la base.

### D5 — Placement dans la page : conserver la position actuelle

`MissionDetail.tsx` place `<TaskList>` en bas de la colonne principale. On conserve cet emplacement (l'ancienne version y était aussi). Pas de déplacement vers la sidebar.

### D6 — Tests : tests unitaires du composant avec mock des actions

Réintroduire `task-list.test.tsx` (inspiré de l'ancien, adapté aux actions Dexie) : mock de `@/app/missions/actions` et `@/lib/db`, vérification du rendu, de la création, du toggle completed, du compteur. Les mocks de `MissionDetail.test.tsx` restent inchangés.

## Risks / Trade-offs

- **[R1] Signature `deleteTask` différente entre ancien et nouveau code** → Mitigation : vérifier la signature exacte dans `actions.ts` avant branchement ; test unitaire sur la suppression.
- **[R2] Drag & drop @dnd-kit : régression silencieuse possible** → Mitigation : test sur `handleDragEnd` avec positions persistées ; vérification manuelle incluse dans les tasks.
- **[R3] Données existantes avec positions/estimations héritées de l'ère Supabase pourraient avoir des formats légèrement différents** → Mitigation : `calculateTaskRemainingLoad` tolère déjà les valeurs nulles (`Number(x) || 0`) ; affichage robuste conservé.
- **[R4] Suppression de `mission-detail-page-client.tsx` : vérifier qu'aucun import caché ne subsiste** → Mitigation : grep avant suppression ; build de validation.

## Migration Plan

1. Restaurer le composant (D1–D2), nettoyer les imports morts
2. Ajouter les tests (D6)
3. Supprimer `mission-detail-page-client.tsx` (R4)
4. Build + suite de tests complète
5. Validation manuelle : créer/éditer/compléter/réordonner/supprimer une tâche sur une mission réelle, vérifier readonly sur mission Terminated

Rollback trivial : revert du commit unique.

## Open Questions

Aucune décision bloquante identifiée. Le périmètre est strictement une restauration conforme à la spec existante.
