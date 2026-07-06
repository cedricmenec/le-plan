## Context

Le projet a migré de Next.js + Supabase (avec authentification OAuth) vers Vite + React Router + IndexedDB (100% locale, sans authentification). Cette migration a été réalisée dans le cadre du changement `migration-local-first`, mais les artefacts OpenSpec n'ont pas été mis à jour pour refléter la nouvelle réalité :

- Les specs principales (`missions/`, `projects/`, `tasks/`) mentionnent encore "authenticated user"
- `config.yaml` décrit une stack technique et des contraintes de sécurité obsolètes (Supabase Auth, RLS, Vercel)
- Le spec `authentication/` est un artefact mort décrivant un système qui n'existe plus
- Un commentaire résiduel dans le code mentionne Supabase

## Goals / Non-Goals

**Goals:**
- Supprimer le spec `authentication/spec.md` (artefact mort)
- Mettre à jour les 3 specs principales en remplaçant "authenticated user" par "user" et en supprimant les concepts de data isolation / row-level security
- Mettre à jour `config.yaml` avec la stack technique réelle (Vite, Dexie/IndexedDB, React Router) et les contraintes actuelles (pas d'auth, pas de backend distant)
- Nettoyer le commentaire résiduel dans le code source

**Non-Goals:**
- Ne modifie aucun comportement fonctionnel — le code est déjà propre
- N'introduit pas de nouveau concept (pas de nouveau design system, pas de nouvelle architecture)
- Ne touche pas aux autres résidus potentiels (README, conductor/) — scope volontairement limité

## Decisions

### Decision 1: Suppression vs. archivage du spec authentication

**Choix** : Supprimer `openspec/specs/authentication/` complètement.

**Alternative considérée** : Le conserver avec une mention "obsolète".

**Raison** : Le spec décrit un système qui n'a jamais été implémenté dans sa forme finale (c'était un projet abandonné). Le garder pollue le contexte LLM et pourrait faire croire qu'il faut le réactiver. La spec delta dans le change sert d'archive.

### Decision 2: "authenticated user" → "user" (pas "utilisateur" en français)

**Choix** : Remplacer "an authenticated user" par "a user" et "the authenticated user" par "the user" dans les specs en anglais.

**Raison** : Les specs sont en anglais, on reste dans la même langue. Le remplacement est minimal et mécanique. On supprime la notion d'authentification sans changer le reste de la grammaire.

### Decision 3: Suppression des requirements de "Data Isolation"

**Choix** : Supprimer les 3 requirements de data isolation (missions, projects, tasks) en les marquant REMOVED dans le delta spec.

**Raison** : Ces requirements parlaient de row-level security et de séparation multi-utilisateur. Dans un contexte IndexedDB 100% local, il n'y a pas de notion de "propriété" ni de "barrière d'accès entre utilisateurs" — le navigateur est mono-utilisateur par construction.

## Risks / Trade-offs

- **[Proprement aucun]** — C'est une mise à jour documentaire uniquement. Le code ne change pas. Aucun risque fonctionnel.
- **[config.yaml pas à jour]** — Le context du config.yaml sert à alimenter le LLM. Si ce nettoyage n'est pas fait, les prochains changements pourraient être générés avec des hypothèses fausses. C'est exactement ce qu'on résout ici.
- **[Sync formelle après archive]** — Après archivage de ce change, il faudra synchroniser les specs delta vers les specs principales via `openspec sync-specs`.