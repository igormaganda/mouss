Recueil de Prompts Stratégiques : Refonte de la Plateforme CréaScope

1. Introduction et Objectifs de la Refonte

Le projet CréaScope, fruit du partenariat entre Echo Entreprendre et Gidef/BGE, s'inscrit dans une démarche de Diagnostic Expert (prestation de 3 heures en entretien individuel) pour les demandeurs d'emploi. L'enjeu de cette refonte est structurel : les statistiques indiquent que 70% des projets entrepreneuriaux s'interrompent avant l'immatriculation par manque de visibilité sur leur viabilité.

La stratégie de refonte s'articule autour de trois axes directifs :

* Sécurisation du parcours et aide à la décision : Permettre une sortie claire vers l'un des trois résultats officiels : 1. Poursuite et développement du projet, 2. Réorientation totale vers le salariat (recherche de transférabilité), 3. Réorientation partielle (pivot avec emploi à temps partiel).
* Innovation IA & State Management : Intégration massive de l'IA (Claude) via le SDK dédié pour automatiser la rédaction et l'analyse prédictive, tout en optimisant la persistance des données.
* Conformité Institutionnelle et Accessibilité : Respect strict de l'identité visuelle France Travail et des normes WCAG 2.1 Level AA (standard BGE Bretagne).


--------------------------------------------------------------------------------


2. Prompt : Module Business Plan Dynamique

Ce prompt orchestre la logique du module BusinessPlanAnalyzer.tsx et ses interactions avec le groupe "Ma Modélisation".

**System Role:** Architecte Expert en Stratégie Entrepreneuriale.
**Context:** Analyse des données structurées issues de l'interface `BusinessPlanAnalyzer.tsx` et du stockage local (`bp-creer-data`).
**Task:** Produire une évaluation critique et générer les livrables de modélisation.

**Instructions de traitement :**
1. **Analyse de l'onglet Marché :** Évaluer la cohérence entre les champs [Marché cible], [Proposition de valeur] et [Concurrence]. Déterminer si le facteur de différenciation est suffisant pour le marché cible identifié.
2. **Génération de Business Model Canvas (BMC) :** Appeler la logique correspondant à l'API `/api/business-plan/bmc` pour remplir les 9 blocs (Partenaires Clés, Activités, Ressources, Proposition de Valeur, Relations Clients, Canaux, Segments, Structure de Coûts, Flux de Revenus).
3. **Structuration du BP Pitch (10 Slides) :** Préparer le contenu pour un Pitch Deck de 10 slides incluant : 1. Titre/Tagline, 2. Problème, 3. Solution, 4. Marché (TAM/SAM/SOM), 5. Produit, 6. Business Model, 7. Traction, 8. Compétitivité, 9. Équipe, 10. Levée de fonds.
4. **Scoring :** Attribuer un score de viabilité (0-100) et une note alphabétique (A à E) en croisant les données de l'onglet Financier (investissement/revenus) et de l'onglet Analyse (SWOT).

**Constraint:** Utiliser uniquement les données persistées dans `localStorage` pour le module "BP Créer".



--------------------------------------------------------------------------------


3. Prompts : Rapports de Diagnostic Final

3.1. Version Initiale (Diagnostic 360°)

Ce prompt traite la restitution de l'entretien de 3 heures en se focalisant sur la psychologie et la technique.

**Context:** Restitution après entretien individuel de 3 heures pour la prestation CréaScope.
**Input Data:** Profil utilisateur, Bilan Découverte, et test RIASEC.
**Task:** Générer le rapport officiel "Diagnostic 360°".

**Structure attendue :**
1. **Diagnostic :** Analyser la cohérence personne/projet en s'appuyant sur les 6 dimensions RIASEC (Réaliste, Investigateur, Artistique, Social, Entrepreneur, Conventionnel). Évaluer la faisabilité financière et le stade d'avancement.
2. **Préconisations :** Lister les mesures correctives sur les compétences identifiées comme manquantes ou les points de vigilance financiers.
3. **Orientations (Tranchage impératif) :** Définir explicitement l'issue de la prestation :
    - Poursuite et développement du projet entrepreneurial.
    - Réorientation totale vers le salariat (Capitalisation sur les compétences acquises).
    - Réorientation partielle (Poursuite avec implication à temps partiel).


3.2. Version Enrichie (Feuille de Route & Recommandations)

Ce prompt transforme le diagnostic en plan d'action opérationnel sur 6 mois.

**System Role:** Coach en Performance Entrepreneuriale.
**Task:** Générer une "Feuille de route à 6 mois adaptée" avec objectifs SMART.
**Logic:**
- Récupérer les Soft Skills issues du **Radar Kiviat** (Leadership, Créativité, Résilience, etc.).
- Intégrer une analyse SWOT complète basée sur les données `localStorage` du projet.
- Planifier les jalons sur une **chronologie de 6 mois** (M+1 à M+6).
- Intégrer des recommandations personnalisées pour lever les freins identifiés dans le Diagnostic 360°.



--------------------------------------------------------------------------------


4. Prompt : Refonte Architecturale Globale

Destiné au Senior Frontend Developer pour la structuration de la SPA.

**Context:** Restructuration de la Single Page Application (SPA) CréaScope.
**Tech Stack:** React, Zustand (`useAppStore`), Framer Motion.

**Instructions Architecturales :**
1. **State Management :** Utiliser la variable d'état `userTab` dans le store Zustand pour piloter le Conditional Rendering du contenu principal.
2. **Logic de Déblocage (Gatekeeper) :** Implémenter une logique de verrouillage strict (Bloc 9). L'accès aux modules "Bilan Découverte", "RIASEC" et "Pépites" est interdit tant que le module "Profil & CV" n'est pas validé via l'endpoint `PUT /api/profile`.
3. **API Handshaking :** 
    - `GET /api/notifications` pour le Header.
    - `GET /api/profil-createur/progress` pour la mise à jour dynamique des badges (0/4) et de la barre de progression.
4. **Composants :** Structurer la Sidebar pour refléter les 5 phases du parcours avec des indicateurs visuels de complétion.



--------------------------------------------------------------------------------


5. Prompt : Implémentation du Co-branding (France Travail x Gidef)

**Task:** Configuration de l'identité visuelle et sémantique institutionnelle.
**Identity Guidelines:**

| Zone Interface | Élément à Intégrer | Spécification Technique |
| :--- | :--- | :--- |
| **Header (Gauche)** | Logos "République Française" & "France Travail" | Logo Marianne conforme, aligné à gauche. |
| **Footer** | Contact Accessibilité BGE Bretagne | Mail : accessibilite@bge-bretagne.com |
| **Exports PDF** | Co-branding complet + Badge "CréaScope" | En-tête officiel Diagnostic Expert. |
| **Sémantique** | Terminologie "Diagnostic Expert" | Remplacer "Bilan" par "Diagnostic Expert". |

**Constraint:** Respecter le système de design Gidef tout en intégrant les éléments régaliens France Travail.



--------------------------------------------------------------------------------


6. Prompt : Restructuration Ergonomique du Dashboard

**System Role:** Expert UX/UI & Accessibilité.
**Task:** Optimisation du Dashboard (18 blocs fonctionnels) avec focus engagement et accessibilité.

**Priorités Ergonomiques :**
1. **Gamification (Module Pépites) :** Implémenter l'interface "Tinder-style" pour l'identification des soft skills parmi plus de 40 compétences. Les swipes doivent alimenter dynamiquement le Radar Kiviat.
2. **Engagement IA :** Configurer le composant "Conseil IA" rotatif avec un polling/changement de texte toutes les 6 secondes.
3. **Accessibilité (Standard BGE Bretagne) :** Garantir la présence des fonctionnalités suivantes via le widget dédié :
    - Police spécifique Dyslexie.
    - Masque de lecture (Reading Mask).
    - Ajustements des contrastes et mode Grayscale.
4. **Édition Rapide :** Permettre l'édition inline du nom et du téléphone dans le Bloc 5 ("CV Live") avec validation Zod en temps réel.

**Note :** Ne générer aucun élément non-renderable (ex: diagrammes Mermaid).



--------------------------------------------------------------------------------


7. Tableau de Synthèse Technique

Module	Fonction Principale	Stockage / API
BP Créer	Rédaction structurée (6 sections)	localStorage (bp-creer-data)
BP Canvas	Business Model Canvas (9 blocs)	POST /api/business-plan/bmc (Session only)
BP Pitch	Pitch Deck IA (10 slides)	POST /api/business-plan/pitch-deck (Session only)
Juridique	Statuts & Recommandations	PostgreSQL (/api/juridique) + POST /api/ai/chat
Profil & CV	Gatekeeper du parcours	PUT /api/profile (PostgreSQL)
RIASEC	Intérêts (6 dimensions)	PostgreSQL + Loterie 20 tags
Pépites	Soft Skills (40+ compétences)	localStorage -> Push vers Radar Kiviat
Dashboard	Pilotage de la progression	GET /api/profil-createur/progress
