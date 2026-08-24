## Why

Les jalons de mission reposent sur un référentiel de types seedé en anglais (`Start`, `Decision`, `Deadline`, `Review`, `Delivery`) alors que l'interface attend des noms français pour afficher les icônes : aucun type seedé ne correspond à la map d'icônes du composant timeline, donc tous les jalons tombent sur l'icône générique. Par ailleurs, l'utilisateur souhaite enrichir le référentiel avec deux types métier (« Meeting / Workshop » et « Autre ») et pouvoir repérer d'un coup d'œil les jalons portant une note.

## What Changes

- Ajout de deux types de jalon au référentiel : « Meeting / Workshop » et « Autre ».
- Réalignement complet des types de jalons en français, cohérent avec la map d'icônes de la timeline :
  - « Cadrage / Kick-off », « Réunion / Review », « Livraison intermédiaire », « Documentation », « Meeting / Workshop », « Autre ».
- Le seeding du référentiel passe d'un comportement tout-ou-rien à une stratégie *ensure-by-name* idempotente : les bases IndexedDB existantes reçoivent les nouveaux types et les types renommés sans duplication.
- Le type « Autre » devient un type réel sélectionnable dans le formulaire de jalon ; le fallback d'affichage quand un jalon n'a pas de type résolu sélectionne désormais ce type « Autre ».
- Dans la liste des jalons d'une mission, un jalon possédant une note affiche un symbole `StickyNote` **toujours visible** ; un clic ouvre la note dans un Popover (Shadcn/ui), remplaçant l'expand/collapse actuel (ChevronDown/ChevronUp).

## Capabilities

### New Capabilities

- `mission-milestones`: Gestion des jalons de mission — référentiel de types (seed idempotent, types français alignés avec les icônes), création/édition avec note optionnelle, et affichage de la note via symbole toujours visible + popover dans la timeline.

### Modified Capabilities

<!-- Aucune : la spec missions existante ne couvre pas les jalons. -->

## Impact

- `src/lib/db.ts` : `seedDefaultMilestoneTypes()` (nouvelle liste française + stratégie ensure-by-name), potentiellement `initializeReferenceData()`.
- `src/lib/db.test.ts` : mise à jour des tests de seed (liste des types, idempotence, migration des bases existantes).
- `src/components/missions/mission-milestone-item.tsx` : map `TYPE_ICONS` (noms français), remplacement de l'expand/collapse par un Popover avec icône `StickyNote` toujours visible.
- `src/components/missions/milestone-form.tsx` : aucune modification structurelle attendue (lit déjà `getMilestoneTypes()`), le nouveau type « Autre » apparaît automatiquement.
- Données : bases IndexedDB existantes des utilisateurs (migration de données, pas de changement de schéma Dexie).
- Risques : les jalons existants référencent d'anciens `type_id` (types anglais) — décision de mapping requise lors du renommage (voir design).
