## 1. Refactor du contexte de drag

- [x] 1.1 Extraire le `DndContext` de `QueuedMissionList` vers un wrapper partagé dans `mission-list.tsx`, avec routage du `onDragEnd` selon l'id de destination (`queue:<scope>` vs `active-zone`) — cf. design D1, D5
- [x] 1.2 Préfixer les identifiants des rows triables et vérifier que le reorder interne (drag + boutons) reste fonctionnel — cf. spec « Queue reordering still works within the shared drag context »

## 2. Drop zone missions actives

- [x] 2.1 Rendre la section « Missions actives » droppable (`useDroppable`, id `active-zone`) avec highlight visuel pendant le survol d'un draggable issu de la file — cf. design D2
- [x] 2.2 Au drop sur `active-zone`, appeler `updateMission(id, { state: 'Active' })` puis rafraîchir via `onUpdate`/reload existant — cf. spec « Drop a queued mission on the active missions section »

## 3. Feedback optimiste et garde-fous

- [x] 3.1 Implémenter le retrait optimiste de la carte de la file avec rollback + toast destructif en cas d'échec (réutiliser le pattern `persist` de `QueuedMissionList`) — cf. spec « Optimistic feedback with rollback on failure »
- [x] 3.2 Désactiver l'initiation d'un drag tant qu'une transition est en cours — cf. spec « Drag is disabled while a transition is pending »
- [x] 3.3 Vérifier qu'aucune carte active n'est draggable vers la file (sens unique maintenu) — cf. spec « Active missions are not draggable to the queue »

## 4. Tests

- [x] 4.1 Adapter les mocks `DndContext` de `queued-mission-list.test.tsx` au nouveau contexte partagé ; reorder interne toujours vert
- [x] 4.2 Nouveau test : drop file
- [x] 4.3 Nouveau test : échec de persistance

## 5. Validation

- [x] 5.1 Vérification manuelle en vue globale (files multi-projets) et vue projet : drag Queued → Active, reorder interne, rollback simulé
