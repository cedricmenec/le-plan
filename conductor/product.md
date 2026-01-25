# Initial Concept

# 🎯 Objectifs Produit – Contexte Initial du Projet (AI-ready)

## 🧭 Vision Produit

Concevoir et développer un **outil personnel de visibilité et d’arbitrage de la charge de travail** permettant de rendre les missions professionnelles **explicites, compréhensibles et arbitrables** aussi bien pour l’utilisateur que pour le Product Management, sans devenir un gestionnaire de tâches complexe ni un outil de time tracking rigide.

Le produit doit **réduire la charge cognitive**, **faciliter les discussions de priorisation** et **justifier les délais de livraison par des éléments factuels**, tout en restant léger, simple et rapide à utiliser.

---

## 👤 Utilisateurs Cibles

### Utilisateur Principal

* Un professionnel unique gérant plusieurs missions en parallèle
* Fort changement de contexte, délais courts, arbitrages fréquents
* Besoin de clarté, de contrôle et de réduction de la pression

### Utilisateurs Secondaires (indirects – MVP)

* Product Managers (principaux stakeholders)
* Management (secondaire)
* Accès via **présentation en direct uniquement** (pas de partage d’accès dans le MVP)

---

## 🎯 Objectifs Produit Principaux

### PG-01 — Rendre la charge visible et compréhensible

Permettre à l’utilisateur de visualiser clairement :

* la charge en cours
* la charge à venir
* la charge terminée
* l’absence ou la rareté de capacité disponible dans le temps

📌 La visibilité doit être **immédiatement lisible et parlante** pour les Product Managers.

---

### PG-02 — Faciliter les arbitrages factuels de priorisation

Permettre aux Product Managers de :

* comprendre pourquoi une mission ne peut pas être planifiée plus tôt
* identifier clairement les arbitrages possibles entre missions
* justifier en amont des besoins de repriorisation ou de recrutement

📌 L’outil doit **rendre visibles les contraintes**, pas des opinions.

---

### PG-03 — Justifier les délais de livraison de manière crédible

Garantir que lorsqu’un délai de livraison est annoncé :

* il est soutenu par des contraintes de planification visibles
* aucune capacité cachée n’existe sans changement de priorité

📌 Les conflits de planning doivent apparaître de manière **indiscutable**.

---

### PG-04 — Améliorer le pilotage quotidien des missions

Aider l’utilisateur à :

* planifier ses missions à l’échelle hebdomadaire
* suivre l’avancement avec un effort minimal
* décomposer les missions en tâches si nécessaire
* gérer à la fois des travaux cadrés et des sujets flous / exploratoires

📌 L’usage quotidien doit rester limité à :

* **5 minutes pour la planification**
* **2 minutes pour le suivi**

---

### PG-05 — Préserver la simplicité et le confort émotionnel

Le produit doit :

* éviter la complexité et la sur-ingénierie
* éviter le time tracking rigide ou intrusif
* éviter de devenir un équivalent de Jira

📌 Le ressenti émotionnel recherché pour l’utilisateur est :

* **apaisement**
* **motivation**

---

## 🧱 Concepts Métier (Haut Niveau)

* **Mission** (objet central)

  * plusieurs types (feature, étude, support, documentation, etc.)
  * rattachement optionnel à un projet
  * décomposable en tâches

* **Projet**

  * regroupement logique de missions partageant un objectif commun
  * permet de consolider la charge et la visibilité pour des stakeholders spécifiques
  * attributs simples (Nom, Description)

* **Charge de travail**

  * exprimée en heures ou en jours
  * estimée avec une marge de sécurité et/ou un score de confiance
  * adaptée aux sujets précis comme aux sujets flous

* **Vues temporelles**

  * semaine (unité principale de pilotage)
  * PI / horizon 3 mois (support aux discussions Product Management)

---

## 🚫 Non-objectifs explicites

Le produit ne doit PAS être :

* un outil complet de gestion de tâches
* un outil de time tracking exhaustif
* un outil de reporting RH
* une plateforme collaborative complexe

---

## ✅ Critères de Succès du MVP

Le MVP est considéré comme réussi si :

* les discussions de planification avec les Product Managers sont plus rapides et plus claires
* les contraintes de charge sont comprises sans effort de justification
* l’utilisateur se sent plus en contrôle et moins sous pression
* l’outil est utilisé quotidiennement grâce à une faible friction

---

## 🔁 Contraintes d’Évolution

* Prioriser la **lisibilité** plutôt que la précision absolue
* Mettre en avant les **contraintes explicites** plutôt que l’optimisation
* Privilégier le **contrôle manuel** plutôt que l’automatisation au début
* Toute nouvelle fonctionnalité doit **réduire la charge cognitive**, jamais l’augmenter


# Product Definition

## 1. Vue d'ensemble
Le projet consiste à développer une **application Web** personnelle de visibilité et d'arbitrage de la charge de travail. Elle vise à rendre les missions professionnelles explicites et arbitrables, réduisant ainsi la charge cognitive et facilitant les discussions factuelles avec le management.

## 2. Plateforme
*   **Type :** Application Web (accessible via navigateur moderne).
*   **Accessibilité :** Conçue pour une utilisation rapide sur ordinateur de bureau (contexte professionnel).

## 3. Fonctionnalités Clés (MVP)
*   **Tableau de Bord de Charge (Inclus) :** Interface de type Dashboard avec barre de navigation latérale, header d'actions rapides et grille de missions active.
*   **Gestion des Projets :** Création, modification et vue détaillée des projets.
    *   **Vue détaillée (Inclus) :** Visualisation de toutes les missions non-terminées d'un projet (actives et à venir) avec des indicateurs visuels de capacité (Grid Placeholders).
    *   **Dashboard de projet (Inclus) :** Indicateurs de charge totale (jours restants) et décompte des tâches par statut (À faire, En cours).
    *   Indicateurs de charge totale et d'avancement pour les stakeholders (PI/Release planning).
    *   Facilitation de la priorisation des missions par un **tri automatique par date de livraison estimée**.
    *   Système de navigation par breadcrumbs (Inclus).
*   **Gestion des Missions :** Création, lecture et suivi de missions (Feature, Étude, Support, Docs) avec estimation de charge, score de confiance, **objectif principal (Main Goal)**, **notes complémentaires**, ainsi que des **dates de livraison estimées et souhaitées**.
    *   **Jalons (Milestones) (Inclus) :** Définition d'étapes intermédiaires datées (Cadrage, Review, Livraison) pour améliorer la visibilité court terme.
*   **Indicateurs de Délai (Inclus) :** Affichage de la durée restante approximative (jours, semaines, mois) basée sur la date de livraison estimée pour faciliter la visibilité immédiate des échéances.
*   **Tâches (Inclus) :** Décomposition des missions en actions simples avec suivi d'état (checkbox), réordonnancement par drag & drop et édition in-line.
*   **Authentification (Inclus) :** Sécurisation des données par utilisateur via Supabase Auth.
*   **Vues Temporelles :**
    *   *Vue Hebdomadaire* pour le pilotage tactique.
    *   *Vue Trimestrielle (PI)* pour les arbitrages stratégiques.
*   **Indicateurs de Capacité :** Mise en évidence visuelle immédiate des surcharges et des conflits de planning.

## 4. Principes d'Expérience Utilisateur
*   **Friction Minimale :** Moins de 5 minutes par jour pour la planification.
*   **Clarté Visuelle :** L'information doit être compréhensible par un tiers (Product Manager) sans explication complexe.
*   **Sérénité :** L'interface doit favoriser un sentiment de contrôle et d'apaisement.