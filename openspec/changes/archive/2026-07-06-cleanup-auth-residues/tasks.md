## 1. Supprimer le spec authentication

- [x] 1.1 Supprimer `openspec/specs/authentication/spec.md`
- [x] 1.2 Supprimer le dossier `openspec/specs/authentication/` (vide après suppression du fichier)

## 2. Mettre à jour les specs principales

- [x] 2.1 Missions spec : remplacer "authenticated user" par "user" dans tous les scénarios et requirements
- [x] 2.2 Missions spec : supprimer le requirement "Mission Data Isolation" (et son scénario)
- [x] 2.3 Projects spec : remplacer "authenticated user" par "user" dans tous les scénarios et requirements
- [x] 2.4 Projects spec : supprimer le requirement "Project Data Isolation" (et son scénario)
- [x] 2.5 Tasks spec : remplacer "authenticated user" par "user" dans tous les scénarios et requirements
- [x] 2.6 Tasks spec : supprimer le requirement "Task Data Isolation" (et son scénario)

## 3. Mettre à jour config.yaml

- [x] 3.1 Remplacer "Next.js" par "Vite" dans la stack technique
- [x] 3.2 Remplacer "Supabase (PostgreSQL), Prisma ORM" par "Dexie (IndexedDB)"
- [x] 3.3 Remplacer "Single-user web application with authentication" par "Single-user local web application (no authentication)"
- [x] 3.4 Remplacer les contraintes de sécurité Supabase Auth/RLS par "No authentication — data stored locally in IndexedDB"
- [x] 3.5 Remplacer "Vercel optimized for Next.js" par "Static hosting (GitHub Pages, Hostinger, any static server)"

## 4. Nettoyer le code résiduel

- [x] 4.1 Supprimer le commentaire obsolète dans `src/components/projects/project-mission-list.tsx`

## 5. Vérification

- [x] 5.1 Vérifier qu'il ne reste aucune mention de "authenticated" dans les specs principales
- [x] 5.2 Vérifier qu'il ne reste aucune mention de Supabase/Auth dans le code source
- [x] 5.3 Vérifier que le build passe (`vite build`)