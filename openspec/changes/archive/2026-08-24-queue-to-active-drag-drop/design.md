## Context

La vue missions en layout `split` (`src/components/missions/mission-list.tsx`) affiche côte à côte les sections « Missions actives » (grille de `MissionCard`) et « File d'attente » (`QueuedMissionList`). Le drag & drop existe déjà dans la file (`@dnd-kit/core` + `@dnd-kit/sortable`) mais son `DndContext` est confiné à `QueuedMissionList`, ce qui empêche tout drag inter-sections.

La transition `Queued → Active` est légale dans `MissionStateMachine` (aucune raison requise) et la sortie de file avec compaction des positions est déjà implémentée dans `src/lib/db.ts` et spécifiée dans `project-mission-queue`. Le changement est donc purement une couche d'interaction UI au-dessus de mécanismes existants et testés.

Contraintes : application locale mono-utilisateur (Dexie/IndexedDB), pas de backend ; pattern d'update optimiste avec rollback déjà établi dans `QueuedMissionList.persist`.

## Goals / Non-Goals

**Goals:**
- Permettre de démarrer une mission en la glissant de la file vers la section « Missions actives ».
- Conserver intact le reorder interne de la file (drag + boutons clavier).
- Feedback immédiat (optimiste) avec restauration de l'état en cas d'échec.

**Non-Goals:**
- Transition `Active → Queued` (interdite par la machine à états, décision maintenue).
- Drag Backlog → File d'attente (changement séparé).
- Ordre manuel des missions actives.
- Modification du schéma de données ou de la machine à états.

## Decisions

### D1 — Un seul `DndContext` remonté dans `MissionList`
Le `DndContext` est déplacé de `QueuedMissionList` vers un wrapper englobant la zone actives + file. Les rows de la file restent des `useSortable` ; la section « Missions actives » devient un `useDroppable` avec l'id `active-zone`.
*Alternative rejetée* : deux `DndContext` — impossible, @dnd-kit ne fait pas transiter un draggable entre contextes distincts.

### D2 — Drop zone globale, pas d'insertion positionnelle
Un drop n'importe où sur la section « Missions actives » déclenche la même action : `updateMission(id, { state: 'Active' })`. Les missions actives restent triées par `sortMissions` ; aucune position n'est persistée pour elles.
*Rationale* : lié à Q2 de l'exploration — introduire un ordre manuel des actives serait un changement de spec plus large sans besoin exprimé.

### D3 — Sens unique Queued → Active
Seules les rows de la file sont draggables. La zone active est droppable mais ses cartes ne sont pas des sources de drag vers la file. Cela rend le refus de `Active → Queued` invisible par construction (pas d'état « drop invalide » à gérer).

### D4 — Update optimiste avec rollback, réutilisant le pattern existant
Au drop : retrait immédiat de la mission de la liste locale de la file, appel `updateMission`, puis rafraîchissement via le canal existant (`onUpdate` / `missions:created` reload). En cas d'échec : restauration de la mission dans la file et toast destructif, comme dans `persist`.
*Mitigation concurrence* : le drag est désactivé pendant qu'une transition est en cours (flag local), évitant deux transitions concurrentes sur la même mission.

### D5 — Identifiants de droppables préfixés par scope
La vue globale regroupe les files par projet (`mission-list.tsx`). Chaque file garde un id de contexte `queue:<projectId|standalone>` et la zone active un id unique `active-zone`. Le `onDragEnd` partagé route selon l'id de destination : même file → reorder interne ; `active-zone` → transition d'état.

## Risks / Trade-offs

- [Collision d'ids droppables casse le reorder interne] → ids préfixés (D5) + tests existants du reorder maintenus verts.
- [Drop pendant persistance] → drag désactivé pendant la transition en cours (D4).
- [Tests mockant `DndContext` localement dans `queued-mission-list.test.tsx`] → adaptation des mocks ; le comportement de reorder reste couvert.
- [Feedback visuel du drop moins précis qu'une insertion positionnelle] → accepté, trade-off assumé de D2 ; un highlight de la zone active pendant le survol suffit.

## Migration Plan

Aucune migration de données. Déploiement statique habituel. Rollback = revert du commit (feature purement UI).

## Open Questions

- Aucune.
