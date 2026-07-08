# Estimation Unifiée & Confiance Qualitative

## Why

Le système d'estimation actuel est confus et source de bugs :

- **3 artefacts** (`estimation`, `rom_size`, `load_source`) pour exprimer **1 seule chose** : "combien de temps ça va prendre ?"
- La règle métier "source officielle" (ROM vs tâches) est complexe à comprendre pour l'utilisateur
- `rom_size` n'est pas défini à la création des missions → `romToDays(null)` → **0j affiché** (bug)
- L'ancien champ `estimation` (legacy) est ignoré par l'affichage mais utilisé dans le dialog d'édition → incohérence perceptible

Le besoin utilisateur est simple : estimer rapidement une mission au début, puis affiner avec le temps. Pas besoin de deux champs concurrents ni d'une règle de "source officielle".

## What Changes

### Simplification du modèle

**Suppression** de `rom_size` et `load_source` du modèle de données Mission.

**Unification** autour d'un unique champ `estimation` (nombre, en jours) qui est LA valeur de référence.

**Migration** de `confidence` d'un pourcentage (0-100) vers un niveau qualitatif à 5 paliers (1-5).

### Nouveau comportement

- **Les T-shirts (XS-XXL) deviennent des presets UX** : cliquer sur "M" remplit `estimation = 5`. Ce ne sont pas des artefacts persistants.
- **La charge par tâches devient un indicateur** : `calculateTaskRemainingLoad()` est conservé mais affiché comme information contextuelle (tooltip, détail mission), pas comme source alternative.
- **5 niveaux de confiance** : Très faible, Faible, Moyen, Haute, Très haute — stockés comme entier 1-5.
- **Capture de la durée réelle à la complétion** : quand une mission passe en Terminé, on propose de remplacer `estimation` par la durée réelle.
- **Valeur par défaut** : `estimation = 3j`, `confidence = 3 (Moyen)`.

### Corrections incluses

- Le bug `rom_size=null → 0j` est résolu par conception (suppression du champ source du bug).
- La page d'accueil (`Home.tsx`) doit charger les missions depuis IndexedDB (actuellement `MissionList` n'a pas de fallback de chargement).

## Capabilities

### New Capabilities
- `unified-estimation`: Estimation unifiée en jours avec presets T-shirt et 5 niveaux de confiance qualitative

### Modified Capabilities
- `load-estimation`: Remplace le système ROM/Tasks par une estimation unique avec indicateur de charge par tâches
- `confidence`: Remplace le pourcentage (0-100) par 5 niveaux qualitatifs (1-5)

## Impact

### Fichiers à modifier

| Fichier | Changement |
|---|---|
| `src/lib/db.ts` — type `Mission` | Supprimer `rom_size`, `load_source` ; `confidence` → `1\|2\|3\|4\|5\|null` |
| `src/lib/db.ts` — Dexie schema | Idem, version DB bump |
| `src/lib/load-utils.ts` | Supprimer `romToDays`, `ROM_MAPPING`, `ROMSize` ; garder `calculateTaskRemainingLoad` |
| `src/types/database.types.ts` | Mettre à jour les types Mission |
| `src/components/missions/mission-form.tsx` | Presets T-shirt + saisie libre + slider confiance 5 niveaux |
| `src/components/missions/edit-mission-modal.tsx` | Remplacer input confidence % par slider 5 niveaux |
| `src/components/missions/mission-card.tsx` | Afficher `estimation` + badge confiance ; tooltip charge tâches |
| `src/components/missions/condensed-mission-row.tsx` | Idem |
| `src/components/missions/mission-header-hero.tsx` | Supprimer settings ROM/load_source ; suggestion ajustement aux tâches |
| `src/components/missions/mission-timeline.tsx` | Utiliser `estimation` directement (inchangé) |
| `src/components/missions/mission-list.tsx` | Corriger le bug de chargement page d'accueil |
| `src/app/missions/actions.ts` | createMission sans rom_size/load_source |
| `src/lib/load-utils.test.ts` | Supprimer tests `romToDays` |

### Fichiers à créer

| Fichier | Description |
|---|---|
| `src/components/ui/confidence-select.tsx` | Slider/selecteur à 5 niveaux avec labels qualitatifs et tooltip d'aide |

### Suppressions

- `rom_size` et `load_source` dans le modèle et l'UI
- `romToDays()`, `ROM_MAPPING`, `ROMSize` dans `load-utils.ts`
- Tests associés à `romToDays`
- Le mode "Estimation Settings" dans `MissionHeroBlock`

### Migration des données

Les missions existantes ont :
- `rom_size` = `null` et `load_source` = `'rom'` (bug)
- `estimation` = valeur legacy correcte
- `confidence` = pourcentage

**Migration** : ignorer `rom_size`/`load_source` (supprimés), conserver `estimation` tel quel, convertir `confidence` (pourcentage → niveau 1-5).