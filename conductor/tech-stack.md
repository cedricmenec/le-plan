# Tech Stack

## 1. Frontend & Framework
*   **Framework :** [Next.js](https://nextjs.org/) (React) - Pour la rapidité de développement, le routage intégré et les performances.
*   **Langage :** TypeScript - Pour la sécurité du typage et la maintenabilité.
*   **Stylisation :** [Tailwind CSS](https://tailwindcss.com/) - Pour un design aéré, réactif et une itération rapide sur l'UI.
*   **Iconographie :** [Lucide React](https://lucide.dev/) - Pour une bibliothèque d'icônes cohérente et légère.
*   **Composants UI :** [Shadcn/ui](https://ui.shadcn.com/) (basé sur Radix UI) - Pour des composants accessibles et hautement personnalisables. Inclut désormais **Popover**.
*   **Drag & Drop :** [@dnd-kit](https://dndkit.com/) - Pour une gestion performante et accessible du réordonnancement des tâches.
*   **Gestion des dates :** [date-fns](https://date-fns.org/) - Pour le formatage, la manipulation des dates et le calcul de durée de réalisation.
*   **Logique de Charge :** Utilitaires de calcul personnalisés (`lib/load-utils.ts`) pour le mapping ROM et la somme des tâches.

## 2. Backend & Base de données
*   **Infrastructure/BaaS :** [Supabase](https://supabase.com/) - Pour l'authentification, la base de données PostgreSQL et le stockage.
*   **Base de données :** PostgreSQL (via Supabase) - Pour la gestion structurée des missions et de la charge de travail.
*   **ORM / Client DB :** [Prisma](https://www.prisma.io/) ou Supabase Client.

## 3. Déploiement & Outils
*   **Hébergement :** Vercel (optimisé pour Next.js).
*   **Gestion de version :** Git (GitHub).
*   **Tests :** [Vitest](https://vitest.dev/) - Pour les tests unitaires et d'intégration rapides.
