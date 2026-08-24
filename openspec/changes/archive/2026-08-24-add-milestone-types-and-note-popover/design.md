## Context

Le référentiel des types de jalons vit dans IndexedDB (table `milestoneTypes`, Dexie) et est seedé au démarrage par `initializeReferenceData()` → `seedDefaultMilestoneTypes()` (`src/lib/db.ts`). Le seed actuel est tout-ou-rien : si la table contient déjà des lignes, il ne fait rien. Les types seedés sont en anglais (`Start`, `Decision`, `Deadline`, `Review`, `Delivery`).

Le composant timeline `mission-milestone-item.tsx` maintient une map `TYPE_ICONS` indexée par nom de type en français (`Cadrage / Kick-off`, `Réunion / Review`, `Livraison intermédiaire`, `Documentation`) avec fallback `MoreHorizontal`. Aucun type seedé ne correspond → tous les jalons affichent l'icône générique.

L'affichage d'une note existante repose sur un toggle expand/collapse artisanal (ChevronDown/ChevronUp) dans la zone d'actions au hover. Le composant Shadcn `popover.tsx` est déjà présent dans le projet.

Contraintes documentées : application locale mono-utilisateur, Dexie/IndexedDB, Vitest pour les tests, déploiement statique.

## Goals / Non-Goals

**Goals:**

- Référentiel de types de jalons 100 % français, aligné avec la map d'icônes, incluant « Meeting / Workshop » et « Autre ».
- Les bases IndexedDB existantes reçoivent les nouveaux/renommés types sans duplication ni perte.
- Note de jalon accessible via un symbole `StickyNote` toujours visible ouvrant un Popover.

**Non-Goals:**

- Gestion CRUD des types de jalon par l'utilisateur (le référentiel reste seedé par le code).
- Modification du schéma Dexie (aucune nouvelle table/index nécessaire).
- Suppression ou ré-attribution manuelle des anciens types anglais côté UI.
- Internationalisation du reste de l'application.

## Decisions

### D1 — Référentiel cible en français, aligné icônes

Liste finale des types seedés :

| Nom | Description | Icône lucide |
|---|---|---|
| Cadrage / Kick-off | Début de la mission | Flag |
| Réunion / Review | Point de décision ou revue | Users |
| Meeting / Workshop | Session de travail collaboratif | Presentation |
| Livraison intermédiaire | Livraison partielle | Package |
| Documentation | Livrable documentaire | FileText |
| Autre | Type non classé | CircleEllipsis |

Rationale : un seul alignement noms ↔ icônes élimine la divergence actuelle. « Réunion / Review » fusionne les rôles des anciens `Decision` et `Review`. Alternatives écartées : garder l'anglais et franciser les icônes via clés techniques (impose une colonne `key` supplémentaire — sur-ingénierie pour du ref data local).

### D2 — Migration ensure-by-name, sans bump de version Dexie

`seedDefaultMilestoneTypes()` devient idempotent par nom :
1. Lire les types existants.
2. Pour chaque type cible absent **par nom exact**, l'insérer.
3. Pour les anciens types anglais encore présents (`Start`, `Decision`, `Deadline`, `Review`, `Delivery`), remapper leurs jalons vers le type français correspondant (voir D3), puis supprimer l'ancien type.

Alternative écartée : bump de version Dexie avec migration formelle — inutile car aucun index/schéma ne change ; la migration est purement data-level et peut s'exécuter dans `initializeReferenceData()`, comme le seed initial.

### D3 — Mapping des anciens types anglais

Les jalons existants pointant vers un ancien `type_id` sont réattribués :

| Ancien (anglais) | Nouveau (français) |
|---|---|
| Start | Cadrage / Kick-off |
| Decision | Réunion / Review |
| Review | Réunion / Review |
| Deadline | Livraison intermédiaire |
| Delivery | Livraison intermédiaire |

Rationale : mapping conservateur, aucune donnée perdue. Les jalons dont le `type_id` serait orphelin (type supprimé manuellement) tombent sur le fallback existant qui sélectionne désormais « Autre ».

### D4 — Fallback « Autre » comme type réel

Le fallback d'affichage (`milestone.milestone_types?.name || 'Autre'`) est remplacé par une résolution vers le vrai type « Autre » : si le type d'un jalon n'est pas résolu, l'item affiche le nom/icône du type « Autre » issu du référentiel. Le formulaire liste naturellement « Autre » puisque le seed l'insère. Alternative écartée : garder un label hard-codé — créerait deux « Autre » visuellement identiques mais sémantiquement distincts.

### D5 — Popover StickyNote toujours visible, remplaçant l'expand

- L'icône `StickyNote` (lucide) remplace le couple ChevronDown/ChevronUp.
- Elle est rendue hors de la zone conditionnelle au hover : visible en permanence quand `milestone.note` est truthy.
- Le clic ouvre un `Popover` Shadcn (déjà dans `src/components/ui/popover.tsx`) affichant le contenu de la note ; fermeture native (clic extérieur, Escape).
- L'état `isExpanded` et son toggle sont supprimés.

Rationale : un seul mécanisme d'accès à la note, accessible au clavier et géré par Radix via Shadcn, contre deux mécanismes redondants auparavant.

## Risks / Trade-offs

- [Jalon avec note + actions au hover se chevauchent] → l'icône note étant toujours visible, vérifier l'espacement dans la zone d'actions ; l'icône reste cliquable même pendant que les actions apparaissent.
- [Utilisateur ayant créé des types personnalisés] → D2 n'insère que les types absents par nom ; les types personnalisés sont préservés tels quels.
- [Renommage = nouveaux ids] → les types français reçoivent de nouveaux ids ; le mapping D3 doit s'exécuter avant suppression des anciens types, dans une même passe pour éviter un état intermédiaire incohérent si l'utilisateur ferme l'app.
- [Popover dans une timeline dense] → tester le z-index et le positionnement (`side`, `align`) pour éviter le clipping par conteneurs overflow.

## Migration Plan

1. Modifier `seedDefaultMilestoneTypes()` (liste française + ensure-by-name) et ajouter la logique de remap/suppression des anciens types dans la même fonction appelée par `initializeReferenceData()` au démarrage.
2. Mettre à jour `db.test.ts` : liste attendue des types, idempotence, scénario base existante avec anciens types anglais (jalons remappés, anciens types supprimés).
3. Mettre à jour `mission-milestone-item.tsx` (map icônes, popover note).
4. Rollback : aucun rollback data nécessaire — les anciens types sont supprimés seulement après remap réussi ; en cas d'échec partiel, le seed relance une passe idempotente au démarrage suivant.

## Open Questions

- Faut-il conserver « Meeting / Workshop » avec ce libellé bilingue ou choisir un libellé purement français (« Atelier ») ? Décision produit — le libellé bilingue proposé respecte la demande initiale.
