# Cycle de vie d’une mission

Cette page décrit le cycle de vie actuellement appliqué par le système. Une mission possède toujours un **macro-état**. Pour les états `Suspended` et `Terminated`, un **motif** obligatoire précise la situation.

## Vue d’ensemble

```text
                         ┌─────────────┐
                  ┌─────▶│   Backlog   │──────┐
                  │      └─────────────┘      │
                  │             │             │
                  │             ▼             │
             ┌─────────────┐  Queued          │
             │             │ « Next up »      │
             │             └──────┬───────────┘
             │                    │
             │                    ▼
             │             ┌─────────────┐
             │             │   Active    │
             │             │ « En cours »│
             │             └──────┬──────┘
             │                    │
             │          ┌─────────┴─────────┐
             │          ▼                   ▼
             │   ┌─────────────┐     ┌─────────────┐
             │   │  Suspended  │────▶│ Terminated  │
             │   └──────┬──────┘     └──────┬──────┘
             │          │                   │
             │          └────▶ Active       └────▶ Queued
             │                                  (réouverture)
             └────────────────────────────────────────────
```

Transitions exactes autorisées :

| État courant | États suivants autorisés |
|---|---|
| `Backlog` | `Queued`, `Active` |
| `Queued` | `Backlog`, `Active` |
| `Active` | `Suspended`, `Terminated` |
| `Suspended` | `Active`, `Terminated` |
| `Terminated` | `Queued` |

Le système accepte également une mise à jour conservant le même état. Elle ne constitue toutefois pas une transition et ne crée pas d’entrée dans l’historique.

## Les états

### Backlog — à qualifier ou à arbitrer

`Backlog` contient une mission identifiée, mais pas encore engagée dans la file des prochains travaux.

- **Rôle dans le pilotage :** conserver les sujets à considérer sans les présenter comme un engagement proche.
- **À utiliser quand :** la mission existe, mais sa priorité, son opportunité, son périmètre ou son calendrier ne justifie pas encore de la placer dans les prochaines missions.
- **Motif :** aucun motif n’est accepté.
- **Entrées possibles :** création d’une mission (état par défaut), retour depuis `Queued`.
- **Sorties possibles :** vers `Queued` lorsqu’elle devient prochaine, ou directement vers `Active` si elle démarre sans passage par la file d’attente.
- **Visibilité :** comptée parmi les missions à venir/non commencées.

### Queued — prochaine mission (« Next up »)

`Queued` indique que la mission est retenue et positionnée dans la file ordonnée des prochains travaux, sans avoir encore commencé.

- **Rôle dans le pilotage :** matérialiser un engagement à court terme et rendre visible ce qui doit démarrer ensuite.
- **À utiliser quand :** la mission est suffisamment arbitrée pour être prochaine, mais aucun travail actif n’a commencé.
- **Motif :** aucun motif n’est accepté.
- **Entrées possibles :** depuis `Backlog`, ou depuis `Terminated` lors d’une réouverture. Toute entrée ajoute la mission en fin de file.
- **Sorties possibles :** vers `Active` au démarrage, ou vers `Backlog` si l’engagement à court terme est retiré. La sortie retire son rang et compacte la file restante.
- **Visibilité :** affichée séparément du backlog avec un rang persistant ; le temps passé dans cet état est calculable à partir de l’historique.

Chaque projet possède sa propre file. Les missions sans projet appartiennent à une file autonome distincte ; il n’existe aucun ordre global entre projets. L’ordre est manuel et indépendant de la priorité, des dates, de l’estimation et de la date de création. Un changement de projet déplace une mission en fin de file de destination. Une suppression compacte la file d’origine.

Le rang 1 signifie « prochaine mission prévue », pas « mission démarrée ». Une activation reste toujours une transition humaine explicite : l’arrêt, la suspension ou la suppression d’une mission active n’active jamais automatiquement la première mission en file.

### Active — en cours

`Active` signifie qu’un travail est effectivement engagé sur la mission.

- **Rôle dans le pilotage :** représenter la charge en cours et le travail qui consomme actuellement de la capacité.
- **À utiliser quand :** la mission a réellement démarré, y compris lorsqu’elle est lancée directement depuis le backlog.
- **Motif :** aucun motif n’est accepté.
- **Entrées possibles :** depuis `Backlog`, `Queued` ou `Suspended`.
- **Sorties possibles :** vers `Suspended` en cas d’arrêt temporaire, ou vers `Terminated` en cas de clôture.
- **Visibilité :** affichée parmi les missions actives ; sa durée active alimente les indicateurs et la frise de cycle de vie.

### Suspended — arrêt temporaire

`Suspended` indique que la mission a commencé, mais qu’elle n’avance momentanément plus. Cet état n’est pas une clôture : une reprise reste prévue ou possible.

- **Rôle dans le pilotage :** sortir explicitement une mission de la charge active tout en rendant visible la cause de son arrêt.
- **Entrée possible :** uniquement depuis `Active`.
- **Sorties possibles :** retour vers `Active`, ou clôture vers `Terminated`.
- **Visibilité :** affichée avec les missions actives, mais distinguée par son motif ; la durée de suspension est calculable séparément.

Un motif est obligatoire :

| Motif | Libellé affiché | Signification |
|---|---|---|
| `Blocked` | **Bloqué** | Une dépendance ou un obstacle empêche la poursuite du travail. La mission reste pertinente et attend une levée du blocage. |
| `Deprioritized` | **Dépriorisé** | La mission est volontairement mise en pause au profit d’un travail plus prioritaire. Aucun obstacle externe n’est nécessairement en cause. |

### Terminated — clôture

`Terminated` indique que la mission est fermée et ne fait plus partie du travail courant. Le motif distingue une livraison d’un abandon.

- **Rôle dans le pilotage :** retirer la mission des listes courantes, figer sa consultation et conserver son résultat dans l’historique.
- **Entrées possibles :** depuis `Active` ou `Suspended`.
- **Sortie possible :** vers `Queued` uniquement, pour une réouverture explicite ; le motif est alors effacé.
- **Visibilité :** la mission devient consultable en lecture seule dans l’archive. Les vues « récemment terminées » ne retiennent actuellement que les missions au motif `Done`.

Un motif est obligatoire :

| Motif | Libellé affiché | Signification |
|---|---|---|
| `Done` | **Terminé** | Le résultat attendu est considéré comme réalisé. Lors de cette transition, l’interface peut proposer de renseigner la charge réelle. |
| `Cancelled` | **Annulé** | La mission est définitivement abandonnée sans être considérée comme réalisée. |

## Règles transverses

### Création

Sans état explicitement fourni, une nouvelle mission est créée dans `Backlog`. Le système permet techniquement une création dans n’importe lequel des cinq états, à condition de fournir un motif valide lorsque l’état l’exige.

### Validation des transitions

Les transitions sont validées côté logique applicative. Une transition non prévue dans le tableau est rejetée. Un état sans motif (`Backlog`, `Queued`, `Active`) exige un motif nul ; `Suspended` et `Terminated` exigent au contraire l’un de leurs deux motifs autorisés.

### Historique et durées

Chaque **changement effectif d’état** ajoute une entrée contenant le nouvel état, son motif éventuel et un horodatage. Cet historique sert à afficher la chronologie et à calculer séparément les durées actives, suspendues, en file et en backlog.

Deux limites actuelles sont importantes pour interpréter ces données :

- la création initiale d’une mission ne crée pas d’entrée d’historique ; le premier segment mesurable commence donc au premier changement d’état enregistré ;
- une mise à jour qui conserve le même état ne crée pas d’entrée, même si elle modifie son motif.

### Suppression et clôture

La **clôture** (`Terminated`) conserve la mission, ses tâches, ses jalons et son historique. La **suppression** est une opération distincte et définitive qui supprime également les tâches, jalons et entrées d’historique associés. Elle ne fait pas partie de l’automate d’états.

## Lecture métier recommandée

Pour garder une vue de pilotage cohérente :

1. placer dans `Backlog` tout sujet non engagé ;
2. réserver `Queued` aux missions réellement pressenties à court terme ;
3. limiter `Active` au travail qui consomme effectivement de la capacité ;
4. utiliser `Blocked` pour un obstacle et `Deprioritized` pour un arbitrage volontaire ;
5. utiliser `Done` uniquement si le résultat est atteint, sinon `Cancelled` ;
6. réouvrir une mission seulement si elle redevient un travail à planifier : elle revient alors dans `Queued`, jamais directement dans `Active`.
