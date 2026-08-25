## Why

Le composant visuel « Cycle de vie » dans la page de détail d'une mission n'apporte rien à l'utilisateur : l'état courant est déjà affiché par le `StateBadge` du hero, et les transitions d'état sont gérées par `MissionStateActions` juste à côté. Ce widget est une redite pédagogique de la state machine qui encombre la sidebar. Seule information non redondante : le rang de file des missions Queued, qui doit être préservé ailleurs.

## What Changes

- Supprimer le composant `MissionLifecycle` (`src/components/missions/mission-lifecycle.tsx`) et son test de la page de détail de mission
- Réintégrer l'information de rang de file (« Rang #N dans <projet> » + lien vers la file du projet) dans le hero de la page de détail, à proximité du badge d'état, pour les missions `Queued`
- L'affichage de l'état courant reste assuré par le `StateBadge` existant dans `MissionHeaderHero` — aucun changement sur ce point

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `missions` : le requirement « Mission lifecycle context » change — l'indicateur compact de cycle de vie (pills des macro-états avec branche Suspended) disparaît de la vue détail ; l'état courant reste visible via le badge d'état du hero. Le contexte de file pour les missions Queued (rang + portée + navigation vers la file projet) est conservé mais présenté dans le hero plutôt que dans un widget dédié.

## Impact

- **Code supprimé** : `src/components/missions/mission-lifecycle.tsx`, `src/components/missions/mission-lifecycle.test.tsx`
- **Code modifié** : `src/pages/MissionDetail.tsx` (retrait du composant), `src/components/missions/mission-header-hero.tsx` (affichage du rang de file pour missions Queued)
- **Données** : aucun changement
- **Risques** :
  - Perte de visibilité du rang de file si la réintégration dans le hero est oubliée — atténué par un scénario de spec dédié
  - Le test `MissionDetail.test.tsx` pourrait référencer le composant supprimé — vérifier avant suppression
