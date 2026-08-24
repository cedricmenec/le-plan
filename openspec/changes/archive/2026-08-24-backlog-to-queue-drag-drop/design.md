## Context

Ce changement s'appuie directement sur l'architecture mise en place par `queue-to-active-drag-drop` : un `DndContext` partagé dans `mission-list.tsx`, un routage du `onDragEnd` selon les ids source/destination, et le pattern d'update optimiste avec rollback.

Le Backlog est rendu par `CondensedMissionList` (rows compactes, pas d'ordre manuel). La transition `Backlog → Queued` est légale sans raison ; à l'entrée en file, `db.ts` attribue déjà `queue_position = fin de queue` du scope et la spec `project-mission-queue` couvre ce comportement.

Contrainte spécifique : une mission Backlog appartient potentiellement à un projet ; elle ne peut être déposée que dans la file de ce même scope (règle anti-cross-project existante). En vue globale, plusieurs files sont affichées — seule celle du scope de la mission draggée accepte le drop.

## Goals / Non-Goals

**Goals:**
- Permettre de placer une mission Backlog dans sa file d'attente par drag & drop.
- Réutiliser sans duplication le contexte de drag partagé et le pattern optimiste.
- Cibler visuellement la bonne file en vue multi-scopes.

**Non-Goals:**
- Ordre manuel dans le Backlog.
- Drag Backlog → missions actives.
- Drag inter-scopes.

## Decisions

### D1 — Rows Backlog : `useDraggable`, pas sortable
Les rows du Backlog deviennent des sources de drag simples (`useDraggable`). Pas de réordonnancement interne : le Backlog n'a pas d'ordre persisté, introduire un sortable serait un changement de spec non demandé.

### D2 — Routage par combinaison source/destination
Le `onDragEnd` partagé route explicitement :
```
source \ dest      queue:<scope>        active-zone
backlog:<id>       → update Queued      → ignoré
queue:<scope>      → reorder interne    → update Active
```
Toute autre combinaison est ignorée silencieusement. *Alternative rejetée* : accepter Backlog → active-zone (transition légale) — hors périmètre acté, gardé pour un éventuel changement futur.

### D3 — Drop ciblé sur la file du scope de la mission
En vue multi-scopes, seules les files dont le scope correspond au `project_id` de la mission draggée acceptent le drop (`canDrop`). Les autres sections de file ne réagissent pas au survol. Une mission autonome (sans projet) ne peut être déposée que dans la file « Missions autonomes ».

### D4 — Optimiste + rollback, pattern commun
Même mécanisme que `queue-to-active-drag-drop` : retrait immédiat de la liste locale, appel `updateMission(id, { state: 'Queued' })`, rafraîchissement via le canal existant ; restauration + toast destructif sur échec. Drag désactivé pendant la persistance.

## Risks / Trade-offs

- [Surcharge visuelle : trois zones interactives dans la même vue] → feedbacks distincts mais sobres (highlight uniquement sur cible valide).
- [Drop ambigu en vue multi-scopes] → `canDrop` restreint à la file du scope (D3).
- [Régression du drop file → actives] → tests existants maintenus + nouveau test de non-régression du routage.

## Migration Plan

Aucune migration. Dépend de l'implémentation de `queue-to-active-drag-drop` (contexte partagé) — à implémenter après celui-ci. Rollback = revert du commit.

## Open Questions

- Aucune.
