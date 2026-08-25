## 1. Réintégration du rang de file

- [x] 1.1 Ajouter dans `MissionHeaderHero` l'affichage « Rang #N dans <projet> · Voir la file du projet » (lien vers `/projects/:id`) sous la ligne de métadonnées, uniquement si `state === 'Queued'` ; formulation « Rang #N dans la file autonome » sans lien si pas de projet (design D1, risque R3)

## 2. Suppression du widget

- [x] 2.1 Retirer l'import et le rendu de `<MissionLifecycle>` dans `src/pages/MissionDetail.tsx`
- [x] 2.2 Grep `MissionLifecycle` pour vérifier l'absence d'autres références (dont `MissionDetail.test.tsx`), puis supprimer `mission-lifecycle.tsx` et `mission-lifecycle.test.tsx` (design D2, D3)

## 3. Tests et validation

- [x] 3.1 Adapter/ajouter un test sur `MissionHeaderHero` : mission Queued avec projet affiche rang + lien ; mission Active n'affiche pas de rang
- [x] 3.2 Lancer la suite complète (`npx vitest run`) et `npm run build` — zéro erreur
- [x] 3.3 Validation manuelle via navigateur : mission Queued avec projet (rang + lien fonctionnel), mission Queued sans projet, mission Active (pas de rang), vérifier que le widget Cycle de vie a disparu de la sidebar
