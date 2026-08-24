## Why

Pour faire passer une mission du Backlog à la file d'attente, l'utilisateur doit aujourd'hui ouvrir la mission et passer par les actions d'état. Sur la vue missions (layout split), le Backlog condensé et la file d'attente sont visibles simultanément : glisser une mission de l'un vers l'autre est le geste naturel, cohérent avec le drag & drop déjà implémenté entre file d'attente et missions actives (`queue-to-active-drag-drop`).

## What Changes

- Ajout du drag & drop d'une mission depuis la liste Backlog condensée vers sa file d'attente de scope (drop zone globale sur la section « File d'attente »), déclenchant la transition `Backlog → Queued` (légale dans la machine à états, aucune raison requise).
- Réutilisation du `DndContext` partagé introduit par `queue-to-active-drag-drop` : les rows Backlog deviennent draggables, chaque section de file devient droppable.
- À l'entrée en file : la mission est **ajoutée en fin de queue** de son scope avec attribution de `queue_position` (comportement déjà spécifié dans `project-mission-queue` — « Mission enters queued state » — et implémenté côté données).
- Feedback optimiste avec rollback : la carte quitte le Backlog immédiatement ; en cas d'échec, restauration et toast destructif.
- Drag désactivé pendant qu'une transition est en cours.

## Capabilities

### New Capabilities
- `backlog-drag-queue`: Interaction de drag & drop permettant de placer une mission du Backlog dans sa file d'attente, avec ajout en fin de queue et rollback sur échec.

### Modified Capabilities
<!-- Aucune : l'entrée en file lors d'une transition Backlog → Queued est déjà
     spécifiée dans project-mission-queue (« Mission enters queued state »).
     Le changement est une nouvelle voie d'interaction. -->

## Impact

- **Code** :
  - `src/components/missions/mission-list.tsx` — étend le routage du `onDragEnd` partagé avec la destination « file » ; le backlog devient source de drag.
  - `src/components/missions/condensed-mission-list.tsx` / `condensed-mission-row.tsx` — rows rendues draggables (`useDraggable`, pas de sortable : pas d'ordre interne au Backlog).
  - `src/components/missions/queued-mission-list.tsx` — section file droppable pour les drags provenant du Backlog.
  - `src/app/missions/actions.ts` — réutilisé tel quel (`updateMission(id, { state: 'Queued' })`) ; l'attribution de `queue_position` en fin de file est gérée par `db.ts`.
- **Tests** : nouveaux tests de drop Backlog → file ; tests existants du reorder et du drop vers actives maintenus verts.
- **Données** : aucun changement de schéma ni de machine à états.
- **Dépendances** : aucune nouvelle dépendance.

## Non-goals

- Réordonnancement manuel du Backlog (pas d'ordre persisté dans le Backlog).
- Drag depuis le Backlog directement vers les missions actives (la transition `Backlog → Active` est légale mais hors périmètre ; à envisager séparément si besoin).
- Drag inter-scopes (une mission Backlog ne peut être déposée que dans la file de son propre scope projet, conformément à la règle anti-cross-project de `project-mission-queue`).

## Risks

- Collision entre draggable Backlog et sortables de la file pendant le survol → ids distincts (`backlog:<id>` vs `queue:<scope>`) et collision detection inchangée.
- Un drop Backlog sur la zone des missions actives ne doit déclencher aucune action → le routage du `onDragEnd` ignore cette combinaison source/destination.

## Unresolved decisions

- Aucune bloquante.
