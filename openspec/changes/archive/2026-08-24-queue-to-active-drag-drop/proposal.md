## Why

Démarrer une mission en file d'attente oblige aujourd'hui à ouvrir la mission et passer par le formulaire/les actions d'état. Sur la vue missions (layout split), la file d'attente et les missions actives sont visibles côte à côte : le geste naturel est de glisser la mission de l'une vers l'autre. Le drag & drop réduit la friction du passage à l'action quotidienne.

## What Changes

- Ajout du drag & drop d'une mission depuis la file d'attente vers la section « Missions actives » (drop zone globale), déclenchant la transition `Queued → Active` (déjà légale dans la machine à états).
- Ajout du drag & drop inverse visuellement symétrique **uniquement pour les transitions légales** : aucune transition `Active → Queued` n'est introduite (la machine à états l'interdit et ce choix est maintenu). Les cartes actives ne sont donc pas des sources de drag vers la file.
- Remontée du `DndContext` existant (activement confiné dans `QueuedMissionList`) vers un contexte partagé englobant la file et la zone des missions actives.
- Feedback optimiste avec rollback : la carte quitte la file immédiatement ; en cas d'échec de persistance, l'état précédent est restauré et un toast informe l'utilisateur.
- La compaction des `queue_position` restants après sortie de file est déjà implémentée côté données et reste inchangée.

## Capabilities

### New Capabilities
- `queue-drag-start`: Interaction de drag & drop permettant de démarrer une mission en la glissant de la file d'attente vers la zone des missions actives, avec feedback optimiste et rollback sur échec.

### Modified Capabilities
<!-- Aucune : la sortie de file lors d'un passage à Active est déjà spécifiée dans
     project-mission-queue (« Mission leaves queued state ») et la transition
     Queued → Active existe déjà dans la spec missions. Le changement est une
     nouvelle voie d'interaction, pas un changement de comportement métier. -->

## Impact

- **Code** :
  - `src/components/missions/queued-mission-list.tsx` — le `DndContext` doit être remonté/partagé ; les rows restent triables.
  - `src/components/missions/mission-list.tsx` — héberge le `DndContext` partagé et la drop zone sur la section « Missions actives ».
  - `src/app/missions/actions.ts` — réutilisé tel quel (`updateMission(id, { state: 'Active' })`) ; validation par `MissionStateMachine`.
- **Tests** : `queued-mission-list.test.tsx` (mocks de `DndContext` à ajuster) ; nouveaux tests pour le drop vers la zone active.
- **Données** : aucun changement de schéma ni de machine à états.
- **Dépendances** : aucune nouvelle dépendance (`@dnd-kit/core` déjà présent).

## Non-goals

- Drag Backlog → File d'attente (changement OpenSpec séparé, à implémenter après celui-ci).
- Transition `Active → Queued` (refusée : interdite par la machine à états, décision maintenue).
- Ordre manuel des missions actives (elles restent triées par `sortMissions`).

## Risks

- La remontée du `DndContext` peut perturber le reorder interne de la file si les identifiants de droppables entrent en collision ; mitigé par des ids distincts (`queue:<scope>` vs `active-zone`).
- Un drop pendant une persistance en cours pourrait créer deux transitions concurrentes ; mitigé par désactivation du drag pendant `updatingId`.

## Unresolved decisions

- Aucune bloquante. Décisions actées en exploration : drop zone globale, sens unique Queued → Active, optimistic update avec rollback.
