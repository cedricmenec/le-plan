## 1. Sources de drag Backlog

- [x] 1.1 Rendre les rows de `CondensedMissionList` draggables (`useDraggable`, id `backlog:<missionId>`) sans introduire de réordonnancement interne — cf. design D1, spec « Backlog rows are draggable but not reorderable »
- [x] 1.2 Ajouter un affordance visuelle de drag (handle ou curseur) cohérente avec celle de la file

## 2. Cibles de drop et routage

- [x] 2.1 Étendre le routage du `onDragEnd` partagé : source backlog + destination `queue:<scope>` → `updateMission(id, { state: 'Queued' })` ; source backlog + destination `active-zone` → ignoré — cf. design D2
- [x] 2.2 Restreindre l'acceptation du drop à la file du scope de la mission (`canDrop`) en vue multi-scopes ; highlight uniquement sur la cible valide — cf. design D3, spec « Drop restricted to the mission's own scope »
- [x] 2.3 Vérifier que le drop d'une mission Backlog sur la zone des missions actives ne déclenche rien — cf. spec « Drop on active missions section is ignored »

## 3. Feedback optimiste et garde-fous

- [x] 3.1 Implémenter le retrait optimiste de la row du Backlog avec rollback + toast destructif en cas d'échec (pattern commun) — cf. spec « Optimistic feedback with rollback on failure »
- [x] 3.2 Désactiver le drag pendant qu'une transition est en cours
- [x] 3.3 Vérifier que la mission est bien ajoutée en fin de queue avec positions existantes inchangées (comportement db.ts existant, test de non-régression)

## 4. Tests

- [x] 4.1 Nouveau test : drop Backlog → file du bon scope déclenche `updateMission` avec `{ state: 'Queued' }`
- [x] 4.2 Nouveau test : drop Backlog → file d'un autre scope ignoré ; drop Backlog → zone actives ignoré
- [x] 4.3 Nouveau test : échec de persistance restaure la mission dans le Backlog et affiche le toast
- [x] 4.4 Non-régression : tests existants du reorder file et du drop file → actives toujours verts

## 5. Validation

- [x] 5.1 Vérification manuelle en vue projet et vue globale multi-scopes : drag Backlog → file correcte, cibles invalides inertes, rollback simulé
