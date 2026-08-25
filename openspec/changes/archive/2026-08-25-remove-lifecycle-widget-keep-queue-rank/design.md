## Context

La page de détail mission (`src/pages/MissionDetail.tsx`) affiche dans sa sidebar le composant `MissionLifecycle` : une rangée de pills représentant les 5 macro-états (Backlog → Queued → Active → Terminated, avec branche ↳ Suspended), l'état courant surligné. Pour les missions Queued, il ajoute une ligne « Rang #N dans <projet> » avec un lien vers la file du projet.

L'état courant est déjà visible dans le hero via `StateBadge` (rendu par `MissionStateActions`, ou badge ARCHIVE si Terminated). Les transitions d'état sont gérées par le menu `MissionStateActions`. Le widget cycle de vie est donc redondant pour sa fonction principale.

Données disponibles : `mission.state`, `mission.queue_position`, `mission.project_id`, `mission.projects.name` — toutes déjà chargées par la page, aucune requête supplémentaire nécessaire.

## Goals / Non-Goals

**Goals:**
- Supprimer le widget « Cycle de vie » de la page de détail
- Conserver l'information de rang de file pour les missions Queued, en la réintégrant dans le hero
- Nettoyer le composant et son test

**Non-Goals:**
- Aucune modification de `MissionStateActions`, `StateBadge` ou de la state machine
- Aucun changement de données ni d'API
- Pas de refonte du hero au-delà de l'ajout du rang de file

## Decisions

### D1 — Rang de file affiché dans le hero, sous la ligne de métadonnées

Le texte « Rang #N dans <projet> · Voir la file du projet » apparaît dans `MissionHeaderHero`, sous la ligne Project/Type/State, uniquement quand `state === 'Queued'`. Style discret (texte small muted) cohérent avec les métadonnées existantes.

*Alternatives :*
- Intégrer dans le StateBadge lui-même : surcharge un composant partagé utilisé ailleurs
- Tooltip : information importante cachée derrière un hover, contraire à l'esprit « visibility first » du produit

### D2 — Suppression complète du composant et de son test

`mission-lifecycle.tsx` et `mission-lifecycle.test.tsx` supprimés ; import retiré de `MissionDetail.tsx`. Le code mort n'est pas conservé (récupérable dans git).

### D3 — Vérification préalable des références croisées

Grep sur `MissionLifecycle` avant suppression ; vérifier que `MissionDetail.test.tsx` ne mocke pas ou n'affirme pas sur ce composant (adapter si besoin).

## Risks / Trade-offs

- **[R1] Perte du rang de file si la réintégration hero est oubliée** → Mitigation : scénario de spec dédié + tâche de test explicite
- **[R2] Tests MissionDetail cassés par la suppression** → Mitigation : grep + exécution de la suite avant commit
- **[R3] Missions Queued sans projet** : l'ancien widget affichait « la file autonome » → conserver cette formulation dans le hero

## Migration Plan

1. Ajouter le rang de file dans le hero (D1)
2. Retirer `<MissionLifecycle>` de `MissionDetail.tsx`
3. Supprimer composant + test (D2, D3)
4. Suite de tests + build complet
5. Validation manuelle : mission Queued avec projet (rang + lien), mission Queued sans projet, mission Active (pas de rang affiché)

Rollback trivial : revert du commit.

## Open Questions

Aucune.
