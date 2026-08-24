## 1. Référentiel de types (db.ts)

- [x] 1.1 Remplacer la liste des types par défaut par le catalogue français : « Cadrage / Kick-off », « Réunion / Review », « Meeting / Workshop », « Livraison intermédiaire », « Documentation », « Autre » (design D1).
- [x] 1.2 Rendre `seedDefaultMilestoneTypes()` idempotent par nom : insérer uniquement les types absents, préserver les types existants et créés par l'utilisateur (spec: Milestone Type Catalog).
- [x] 1.3 Ajouter la migration des anciens types anglais : remapper les jalons selon Start→Cadrage / Kick-off, Decision/Review→Réunion / Review, Deadline/Delivery→Livraison intermédiaire, puis supprimer les anciens types après remap complet (design D3, spec: Milestone Type Migration).

## 2. Tests du référentiel (db.test.ts)

- [x] 2.1 Mettre à jour le test de seed sur base vide : exactement les six types français attendus.
- [x] 2.2 Mettre à jour le test d'idempotence : exécutions répétées sans duplication.
- [x] 2.3 Ajouter un test base existante avec types personnalisés : ils sont préservés après seed.
- [x] 2.4 Ajouter un test de migration : jalons pointant vers les anciens types anglais remappés, anciens types supprimés, aucune modification lors d'une seconde exécution.

## 3. Timeline des jalons (mission-milestone-item.tsx)

- [x] 3.1 Aligner `TYPE_ICONS` sur les noms français du catalogue avec les icônes décidées (Flag, Users, Presentation, Package, FileText, CircleEllipsis) (design D1).
- [x] 3.2 Remplacer le fallback hard-codé « Autre » par la résolution vers le vrai type « Autre » du référentiel (nom + icône) (spec: Unresolved Milestone Type Falls Back to "Autre").
- [x] 3.3 Supprimer l'expand/collapse inline (`isExpanded`, ChevronDown/ChevronUp) et afficher une icône `StickyNote` toujours visible pour tout jalon possédant une note (spec: Milestone Note Access via Always-Visible Symbol and Popover).
- [x] 3.4 Ouvrir la note dans un Popover Shadcn au clic sur l'icône, avec fermeture native (Escape, clic extérieur) ; vérifier positionnement/z-index dans la timeline.

## 4. Validation finale

- [x] 4.1 Exécuter la suite de tests Vitest complète et résoudre les régressions.
- [x] 4.2 Exécuter le build de production.
- [x] 4.3 Vérifier manuellement : nouveaux types dans le formulaire, icônes correctes en timeline, popover de note fonctionnel.
- [x] 4.4 Lancer la validation OpenSpec pour `add-milestone-types-and-note-popover`.
