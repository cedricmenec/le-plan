## 1. Préparation

- [x] 1.1 Vérifier les signatures exactes des actions dans `src/app/missions/actions.ts` (`createTask`, `updateTask`, `deleteTask`, `reorderTasks`) et de `getSubtasks` dans `src/lib/db.ts` (design D2, risque R1)
- [x] 1.2 Extraire l'ancienne version du composant depuis git (`git show 2cb3da4^:components/missions/task-list.tsx`) comme référence de travail

## 2. Restauration du composant

- [x] 2.1 Réécrire `src/components/missions/task-list.tsx` : charger les tâches via `getSubtasks(missionId)` au montage, supprimer tous les imports morts et le `SortableTaskItem` incomplet actuels (design D1)
- [x] 2.2 Implémenter `SortableTaskItem` complet : grip, checkbox complétion, titre éditable inline (`InlineEditableField`), estimation en demi-journées via popover double-clic, bouton suppression (spec : Create Task, Task Estimation, Task Completion)
- [x] 2.3 Brancher les actions avec les signatures actuelles : création (position max + 1, estimation 0.5 par défaut), mise à jour optimiste avec rollback, suppression, réordonnancement drag & drop @dnd-kit avec persistance des positions (design D2, D3 ; spec : Task Reordering, Task Position Persistence)
- [x] 2.4 Implémenter l'en-tête "Tâches" + compteur "X restantes / Y total", le toggle d'affichage des tâches terminées, et le champ d'ajout en bas (masqués ou désactivés si `readonly`) (spec : Hide Completed Tasks, Task Count Display)
- [x] 2.5 Respecter le mode `readonly` sur tous les éléments interactifs (grip non-draggable, checkbox disabled, pas d'édition ni suppression) pour les missions Terminated

## 3. Tests

- [x] 3.1 Créer `src/components/missions/task-list.test.tsx` avec mock de `@/app/missions/actions` et `@/lib/db` : rendu initial, compteur restantes/total, toggle terminées
- [x] 3.2 Tester la création d'une tâche (appel `createTask` avec position max + 1 et estimation 0.5) et la complétion (appel `updateTask`)
- [x] 3.3 Tester la suppression (appel `deleteTask(id)` — un seul argument, cf. R1) et le mode readonly (aucune action interactive)

## 4. Nettoyage et validation

- [x] 4.1 Supprimer `src/components/missions/mission-detail-page-client.tsx` après grep confirmant l'absence de références (risque R4)
- [x] 4.2 Lancer la suite de tests complète (`npx vitest run`) et le build (`npx next build` ou tâche workspace) — zéro erreur
- [x] 4.3 Validation manuelle : créer, éditer, estimer, compléter, réordonner et supprimer une tâche sur une mission réelle ; vérifier que les sous-tâches existantes en IndexedDB s'affichent ; vérifier le readonly sur une mission Terminated ; vérifier la cohérence de l'indicateur de charge restante
