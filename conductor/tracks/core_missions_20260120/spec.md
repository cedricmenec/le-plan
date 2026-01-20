# Specification: Initialisation et Cœur des Missions

## 1. Objectif
Mettre en place les fondations techniques du projet et implémenter la gestion centrale des missions.

## 2. Portée (Scope)
*   **Infrastructure :** Setup Next.js, Tailwind CSS, Shadcn/ui et connexion Supabase.
*   **Modèle de Données :** Table 'missions' avec nom, type, estimation, score de confiance, et projet parent.
*   **Fonctionnalités :**
    *   Création, lecture, mise à jour et suppression (CRUD) de missions.
    *   Gestion des sous-tâches simples.
    *   Calcul de la charge totale par semaine.
*   **Interface :** Dashboard minimaliste avec liste des missions et indicateurs de charge globale.

## 3. Contraintes Techniques
*   Next.js 14+ (App Router).
*   TypeScript.
*   Authentification via Supabase.
