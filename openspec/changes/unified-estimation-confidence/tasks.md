# Tasks — Unified Estimation & Confidence

## 1. Modèle de données & Migration

- [x] 1.1 Supprimer `rom_size` et `load_source` du type `Mission` dans `src/lib/db.ts`
- [x] 1.2 Changer `confidence` de `number` à `1|2|3|4|5|null` dans le type `Mission`
- [x] 1.3 Bump version Dexie de 1 à 2 dans le constructeur de `LePlanDB`
- [x] 1.4 Mettre à jour les types dans `src/types/database.types.ts`
- [x] 1.5 Créer une fonction de migration `migrateConfidence(percentage: number): 1|2|3|4|5` pour convertir les existants
- [x] 1.6 Ajouter la logique de migration au démarrage (premier chargement après mise à jour)

## 2. Créer le composant ConfidenceSelector

- [x] 2.1 Créer `src/components/ui/confidence-select.tsx` avec 5 niveaux cliquables (dots/circles)
- [x] 2.2 Ajouter les labels qualitatifs : Très faible, Faible, Moyen, Haute, Très haute
- [x] 2.3 Ajouter tooltip d'aide par niveau (signification contextuelle)
- [x] 2.4 Styliser : niveaux remplis avant la sélection, vides après

## 3. Nettoyer les utilitaires

- [x] 3.1 Supprimer `romToDays()`, `ROM_MAPPING`, `ROMSize` de `src/lib/load-utils.ts`
- [x] 3.2 Nettoyer les imports dans tous les fichiers qui utilisaient ces fonctions
- [x] 3.3 Supprimer les tests `romToDays` de `src/lib/load-utils.test.ts`

## 4. Modifier le formulaire de création (MissionForm)

- [x] 4.1 Ajouter les boutons preset T-shirt (XS-XXL) à côté du champ estimation
- [x] 4.2 Remplacer le champ confidence % par ConfidenceSelector
- [x] 4.3 Définir les valeurs par défaut : estimation=3, confidence=3
- [x] 4.4 Supprimer l'envoi de `rom_size` et `load_source` dans `createMission`
- [x] 4.5 Ne pas persister le preset — seule la valeur numérique est envoyée

## 5. Modifier le dialog d'édition (EditMissionModal)

- [x] 5.1 Remplacer le champ confidence % par ConfidenceSelector
- [x] 5.2 Ajouter les boutons preset T-shirt à côté du champ estimation
- [x] 5.3 Supprimer les champs `rom_size` et `load_source` du formulaire

## 6. Modifier les composants d'affichage de la charge (MissionCard, CondensedMissionRow)

- [x] 6.1 Remplacer `romDays`/`tasksDays` par `mission.estimation` direct dans `MissionCard`
- [x] 6.2 Afficher le badge de confiance (niveau + label) à côté de l'estimation
- [x] 6.3 Ajouter tooltip sur la card : estimation+confiance, charge par tâches, nb tâches restantes/total
- [x] 6.4 Mêmes changements dans `CondensedMissionRow`
- [x] 6.5 Remplacer LoadIcon (Shirt/ListTodo) par une icône générique d'estimation

## 7. Modifier le détail de mission (MissionHeroBlock)

- [x] 7.1 Supprimer la section "Estimation Settings" (ROM selector + load source toggle + panels comparaison)
- [x] 7.2 Remplacer par une suggestion "Ajuster l'estimation aux tâches" si charge par tâches diffère
- [x] 7.3 Afficher ConfidenceSelector modifiable dans le détail
- [x] 7.4 Supprimer les imports et constantes liés à `ROM_MAPPING`, `LOAD_SOURCE_OPTIONS`

## 8. Capture de la durée réelle à la complétion

- [x] 8.1 Ajouter une étape dans le flux Terminé (state machine) qui détecte la transition vers Done
- [x] 8.2 Si la mission a des tâches complétées, proposer de remplacer estimation par la somme des tâches
- [x] 8.3 Si pas de tâches, afficher un prompt pour saisir la durée réelle
- [x] 8.4 Permettre à l'utilisateur d'accepter, de modifier ou d'ignorer

## 9. Correction du bug Home page

- [x] 9.1 Ajouter un `useEffect` dans `MissionList` qui appelle `getMissions()` si `initialMissions` n'est pas fourni
- [x] 9.2 Gérer l'état loading correctement pendant le chargement

## 10. Tests & Validation

- [x] 10.1 Vérifier que les tests existants passent (notamment `load-utils.test.ts`)
- [x] 10.2 Vérifier que le build Vite passe (`vite build`)
- [x] 10.3 Tester la migration des missions existantes (confidence % → niveau)
- [x] 10.4 Tester la création de mission avec preset et saisie libre
- [x] 10.5 Tester l'affichage correct de l'estimation dans les cards, condensed rows, détail
- [x] 10.6 Tester la suggestion d'ajustement aux tâches
- [x] 10.7 Tester la capture de durée réelle à la complétion
