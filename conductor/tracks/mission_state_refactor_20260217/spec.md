# Specification: Mission State Model Refactoring

## 1. Overview
Le but de ce track est de refondre le système de gestion des états des missions pour passer d'un simple statut textuel à un modèle de macro-états plus robuste, explicite et aligné sur les besoins métier. Cela améliorera la clarté, garantira des règles de transition strictes et fournira une base solide pour des fonctionnalités futures comme le reporting automatisé ou la planification de capacité.

## 2. Exigences Fonctionnelles

### 2.1 Nouveau Modèle d'État
Les missions seront désormais gouvernées par cinq macro-états, certains nécessitant une "raison" (reason) spécifique :
- **Backlog** : Non planifiée ou pas prête.
- **Queued** : Planifiée et prête à être prise en charge (next up).
- **Active** : En cours de réalisation.
- **Suspended** : Travail mis en pause. Nécessite une `reason` : `Blocked` ou `Deprioritized`.
- **Terminated** : Travail terminé. Nécessite une `reason` : `Done` ou `Cancelled`.

### 2.2 Règles de Transition
Les transitions doivent suivre un automate strictement défini :
- `Backlog` <--> `Queued`
- `Backlog` --> `Active`
- `Queued` --> `Active`
- `Active` <--> `Suspended`
- `Active` --> `Terminated`
- `Suspended` --> `Terminated`

### 2.3 Détails d'Implémentation
- **Schéma de Base de Données** : Ajouter les colonnes `state` et `reason` à la table `missions` dans Prisma.
- **Logique Métier** : Implémenter une `MissionStateMachine` centralisée en TypeScript (dans `lib/`) pour valider tous les changements d'état.
- **Mise à jour de l'UI** :
    - Mettre à jour les cartes de mission (Mission Cards) et les vues détaillées pour afficher un badge sémantique unique reflétant le statut "final" (ex: "Bloqué" au lieu de "Suspendu").
    - Mettre à jour les formulaires et les menus d'actions pour gérer les nouveaux états et leurs raisons obligatoires.
- **Migration** : Les données existantes seront migrées comme suit :
    - `todo` -> `Backlog`
    - `in_progress` -> `Active`
    - `done` -> `Terminated` (Reason: `Done`)

## 3. Critères d'Acceptation
- [ ] La table `missions` possède les colonnes `state` et `reason` (Enums ou Strings strictes).
- [ ] Une `MissionStateMachine` centrale empêche toute transition non définie dans le diagramme d'état.
- [ ] L'UI affiche correctement les libellés sémantiques pour tous les états et raisons.
- [ ] Toutes les missions existantes sont correctement migrées vers le nouveau modèle sans perte de données.
- [ ] Les formulaires de création et d'édition de missions supportent la sélection des nouveaux états et raisons le cas échéant.

## 4. Hors Périmètre
- Ajout d'automatisation de workflow complexe (ex: suspension automatique basée sur des déclencheurs externes).
- Historique/Audit log des changements d'état (bien que le schéma doive y être préparé).
