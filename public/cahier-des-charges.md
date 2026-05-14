# 📋 Cahier des Charges — 100 Jours Pour Entreprendre

> **Version** : 2.0 — État actuel au 25 avril 2026  
> **Plateforme** : SaaS Lead Generation & Affiliate  
> **URL** : https://100jourspourentreprendre.fr  
> **Stack** : Next.js 16 · TypeScript · PostgreSQL · Prisma · Tailwind CSS 4 · shadcn/ui

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs business](#2-objectifs-business)
3. [Architecture technique](#3-architecture-technique)
4. [Pages publiques](#4-pages-publiques)
5. [Espace utilisateur (Dashboard)](#5-espace-utilisateur-dashboard)
6. [Espace administrateur (Back Office)](#6-espace-administrateur-back-office)
7. [Système de paiement](#7-système-de-paiement)
8. [Base de données](#8-base-de-données)
9. [API Routes](#9-api-routes)
10. [CMS de la page d'accueil](#10-cms-de-la-page-daccueil)
11. [Système d'affiliation](#11-système-daffiliation)
12. [Design & UX](#12-design--ux)
13. [Sécurité](#13-sécurité)
14. [Fonctionnalités manquantes / Roadmap](#14-fonctionnalités-manquantes--roadmap)
15. [Données de référence](#15-données-de-référence)

---

## 1. Présentation du projet

### 1.1 Concept

**100 Jours Pour Entreprendre** est une plateforme SaaS de type *lead generation* et *affiliate marketing* destinée aux entrepreneurs francophones. La plateforme guide les créateurs d'entreprise à travers 4 phases clés (Réflexion, Création, Gestion, Croissance) en leur proposant :

- Un **audit gratuit** personnalisé selon leur profil et phase de projet
- Des **recommandations d'outils** bancaires, comptables, juridiques et d'assurance
- Du **contenu éditorial** (articles, guides, comparatifs)
- Un **suivi de progression** dans leur parcours entrepreneurial
- Des **formules payantes** d'accompagnement

### 1.2 Public cible

| Profil | Description |
|---|---|
| **Étudiant entrepreneur** | Jeune diplômé souhaitant lancer sa première activité |
| **Salarié en transition** | Envisageant une reconversion vers l'entrepreneuriat |
| **Freelance / Auto-entrepreneur** | Déjà lancé, cherche à optimiser sa gestion |
| **TPE / PME** | Petite structure cherchant des outils adaptés |

### 1.3 Modèle économique

1. **Affiliation** : Commissions sur les outils recommandés (banque, comptabilité, assurance)
2. **Lead generation** : Qualification de prospects via l'audit gratuit
3. **Abonnements payants** : Formules Starter (gratuit), Pro (29€/mois), Premium (79€/mois)

---

## 2. Objectifs business

| Objectif | Description | KPI |
|---|---|---|
| **Acquisition** | Attirer des entrepreneurs via SEO et contenu | Trafic organique, taux de rebond |
| **Qualification** | Convertir les visiteurs en leads via l'audit | Nombre de leads, taux de conversion audit |
| **Monétisation** | Générer des revenus via affiliation et abonnements | Revenue par lead, MRR |
| **Rétention** | Fidéliser via le suivi de progression | Taux de rétention, DAU/MAU |

---

## 3. Architecture technique

### 3.1 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1 |
| **Langage** | TypeScript | 5 |
| **Runtime** | Bun | Latest |
| **Base de données** | PostgreSQL | Remote (`109.123.249.114:5432/100jours`) |
| **ORM** | Prisma | 6.19 |
| **Styling** | Tailwind CSS | 4 |
| **UI Components** | shadcn/ui (New York) | Latest |
| **State serveur** | TanStack React Query | 5 |
| **State client** | Zustand | 5 |
| **Animations** | Framer Motion | 12 |
| **Authentification** | NextAuth.js | 4 (JWT) |
| **Graphiques** | Recharts | 2.15 |
| **Icônes** | Lucide React | Latest |
| **Polices** | Geist Sans + Geist Mono | — |
| **Reverse Proxy** | Caddy | Port 81 |

### 3.2 Structure du projet

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (providers, fonts, toaster)
│   ├── page.tsx                # Page d'accueil
│   ├── actualites/
│   │   ├── page.tsx            # Page blog dédiée
│   │   └── actualites-page.tsx # Composant client blog
│   ├── login/page.tsx          # Connexion
│   ├── register/page.tsx       # Inscription
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout dashboard (auth)
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── audit/page.tsx      # Résultats de l'audit
│   │   └── progress/page.tsx   # Suivi de progression
│   ├── admin/
│   │   ├── layout.tsx          # Layout admin (sidebar)
│   │   ├── page.tsx            # Dashboard admin
│   │   ├── leads/page.tsx      # Gestion des leads
│   │   ├── tools/page.tsx      # Gestion des outils
│   │   ├── blog/page.tsx       # Gestion du blog
│   │   ├── tasks/page.tsx      # Gestion des tâches
│   │   └── campaigns/page.tsx  # Gestion des campagnes email
│   └── api/
│       ├── route.ts                    # Health check
│       ├── register/route.ts           # Inscription API
│       ├── audit/route.ts              # Audit API
│       ├── click/route.ts              # Tracking affiliation
│       ├── posts/route.ts              # Articles publics
│       ├── tools/route.ts              # Outils publics
│       ├── packs/route.ts              # Formules tarifaires
│       ├── packs/seed/route.ts         # Seed packs
│       ├── stripe/
│       │   ├── create-checkout/route.ts
│       │   └── verify/route.ts
│       ├── user/
│       │   ├── audit/route.ts          # Audit utilisateur
│       │   └── progress/route.ts       # Progression utilisateur
│       ├── admin/
│       │   ├── stats/route.ts          # Statistiques dashboard
│       │   ├── leads/route.ts & [id]/
│       │   ├── tools/route.ts & [id]/
│       │   ├── posts/route.ts & [id]/
│       │   ├── tasks/route.ts & [id]/
│       │   └── campaigns/route.ts & [id]/
│       ├── home/
│       │   ├── sections/route.ts       # CMS sections
│       │   ├── sections/[id]/route.ts
│       │   ├── sections/[id]/items/route.ts
│       │   ├── sections/[id]/items/[itemId]/route.ts
│       │   └── seed/route.ts           # Seed sections
│       └── auth/[...nextauth]/route.ts # NextAuth
├── components/
│   ├── ui/                  # 46 composants shadcn/ui
│   ├── sections/            # 11 sections de la home
│   ├── admin/               # Composants admin (KPI, badges, table)
│   ├── header.tsx           # En-tête du site
│   ├── footer.tsx           # Pied de page
│   └── providers.tsx        # QueryClient provider
├── hooks/
│   ├── use-session.ts       # Hook session NextAuth
│   ├── use-toast.ts         # Hook notifications
│   └── use-mobile.ts        # Hook détection mobile
└── lib/
    └── db.ts                # Client Prisma PostgreSQL
```

### 3.3 Middleware & Authentification

| Route | Protection | Rôle requis |
|---|---|---|
| `/admin/*` | Middleware NextAuth | `admin` |
| `/dashboard/*` | Middleware NextAuth | `user` ou `admin` |
| `/login`, `/register` | Publique | — |
| `/`, `/actualites` | Publique | — |

- **Stratégie** : JWT (pas de session DB)
- **Provider** : Credentials (email + mot de passe)
- **Hashage** : bcryptjs (12 rounds)
- **Rôles** : `admin`, `user`

---

## 4. Pages publiques

### 4.1 Page d'accueil (`/`)

Page unique-page composée de **8 sections** ordonnées :

| # | Section | ID | Type | Description |
|---|---|---|---|---|
| 1 | **Hero** | `#accueil` | Statique | Titre principal, sous-titre, 2 CTA, 4 stats chiffrées |
| 2 | **Roadmap** | `#roadmap` | Statique | 4 phases entrepreneuriales (Réflexion → Croissance) |
| 3 | **Profils** | `#profils` | Statique | 4 cartes profils cibles (Étudiant, Salarié, Freelance, TPE/PME) |
| 4 | **Points de douleur** | `#solutions` | Statique | 4 problèmes récurrents des entrepreneurs |
| 5 | **Thématiques** | `#solutions` | Statique | 6 domaines (Création, Banque, Compta, Assurance, Juridique, Marketing) |
| 6 | **Outils** | `#outils` | Dynamique | Catalogue filtrable (12 outils, 6 catégories, notes, badges) |
| 7 | **Actualités** | `#actualites` | Dynamique | Aperçu blog (6 articles, filtres par catégorie) |
| 8 | **Tarifs** | `#tarifs` | Dynamique | 3 formules (Starter/Pro/Premium) avec CTA paiement |
| 9 | **Audit** | `#audit` | Statique | Formulaire 4 étapes (profil, phase, problème, coordonnées) |

**Header** : Logo 100 Jours + Navigation (Outils, Tarifs, Audit Gratuit) + CTA + Menu mobile  
**Footer** : 5 colonnes (Marque, Navigation, Ressources, Légal, Newsletter) + Partenaires + Copyright

### 4.2 Page Actualités (`/actualites`)

- **Hero** : Titre, description, barre de recherche
- **Filtres** : 7 catégories (Tous, Création, Finance, Comptabilité, Assurance, Marketing, Gestion)
- **Grille** : 3 colonnes desktop, 2 tablette, 1 mobile
- **Pagination** : 9 articles par page
- **Carte article** : Image/gradient, badge catégorie, titre, extrait, date, temps de lecture, tags
- **Navigation** : Retour à l'accueil, header + footer

### 4.3 Page Connexion (`/login`)

- Formulaire email + mot de passe
- Lien d'inscription
- Redirection : admin → `/admin`, user → `/dashboard`

### 4.4 Page Inscription (`/register`)

- Formulaire : Nom, Email, Mot de passe, Confirmation
- Redirection vers `/login` après inscription

---

## 5. Espace utilisateur (Dashboard)

### 5.1 Dashboard principal (`/dashboard`)

- **Profil** : Nom, email, rôle
- **Phase** : Phase actuelle du parcours
- **Score audit** : Note sur 100
- **Tâches complétées** : Compteur
- **Outils recommandés** : Basés sur les résultats de l'audit (Banque, Compta, Assurance)
- **Liens rapides** : Audit, Progression

### 5.2 Résultats de l'audit (`/dashboard/audit`)

- **Score circulaire** : Note sur 100 avec indicateur coloré
- **Profil** : Profil entrepreneurial détecté
- **Phase** : Phase recommandée
- **Point de douleur** : Problème principal identifié
- **Recommandations** : 
  - Banque recommandée (si audit result existant)
  - Comptabilité recommandée
  - Assurance recommandée
- Chaque recommandation avec nom, description, note, lien "Découvrir"

### 5.3 Suivi de progression (`/dashboard/progress`)

- **4 phases** avec barres de progression :
  1. 🤔 Réflexion
  2. 🚀 Création
  3. 📊 Gestion
  4. 📈 Croissance
- **Tâches cochables** dans chaque phase
- **Barre de progression** par phase (pourcentage)
- **Barre globale** de progression

---

## 6. Espace administrateur (Back Office)

### 6.1 Dashboard (`/admin`)

| Widget | Type | Description |
|---|---|---|
| Total Leads | KPI Card | Nombre total de leads captés |
| Conversions | KPI Card | Leads convertis (status = converti) |
| Revenue estimé | KPI Card | Somme des revenus affiliation |
| Taux de conversion | KPI Card | % de leads convertis |
| Leads / jour | Line Chart | Évolution sur 30 jours |
| Leads par profil | Pie Chart | Répartition par type de profil |
| Leads récents | Table | 10 derniers leads |
| Top outils | Bar Chart | Outils par nombre de clics |

### 6.2 Gestion des Leads (`/admin/leads`)

- **Tableau paginé** avec recherche (nom/email)
- **Filtres** : Profil (4 types), Statut (Nouveau, Contacté, Converti, Perdu)
- **Actions** : Voir détails, Modifier, Supprimer
- **Export CSV** de tous les leads
- **Détails lead** : Coordonnées, profil, phase, résultat d'audit, clics affiliation

### 6.3 Gestion des Outils (`/admin/tools`)

- **Grille de cartes** filtrable par catégorie (6 catégories)
- **Informations carte** : Nom, slogan, note, catégorie, tarification, clics, commission
- **CRUD complet** : Créer, Modifier, Supprimer
- **Champs** : Nom, slug, slogan, description, catégorie, tarification, site web, URL affiliation, commission, note, avantages, inconvénients, fonctionnalités
- **Toggle** actif/inactif

### 6.4 Gestion du Blog (`/admin/blog`)

- **Tableau** avec filtres (Tous / Publié / Brouillon)
- **CRUD complet** : Créer, Modifier, Supprimer, Publier/Dépublier
- **Champs** : Titre (slug auto), catégorie, tags, extrait, contenu (Markdown), image de couverture

### 6.5 Gestion des Tâches (`/admin/tasks`)

- **Vue par phase** avec onglets (Réflexion, Création, Gestion, Croissance)
- **Drag & Drop** pour réorganiser (via @dnd-kit)
- **CRUD complet** : Créer, Modifier, Supprimer
- **Toggle** actif/inactif
- **Champs** : Titre, description, phase

### 6.6 Campagnes Email (`/admin/campaigns`)

- **Tableau** avec statistiques (envoyés, ouverts, clics)
- **Statuts** : Brouillon, Planifié, Envoyé
- **CRUD** : Créer, Modifier, Supprimer
- **Champs** : Nom, objet, corps (HTML), segment cible, date d'envoi planifiée

---

## 7. Système de paiement

### 7.1 Formules tarifaires

| Formule | Prix | Description |
|---|---|---|
| **Starter** | 0€ | Découverte de la plateforme, audit gratuit, contenu de base |
| **Pro** | 29€/mois | Accès complet + recommandations personnalisées + suivi avancé |
| **Premium** | 79€/mois | Accès VIP + conseil dédié + outils premium + priorité support |

### 7.2 Flow de paiement (actuel : simulé)

1. L'utilisateur clique "Choisir ce plan" sur une formule payante
2. Un dialogue demande l'email
3. Appel `POST /api/stripe/create-checkout` → Crée un `Order` en base
4. Pour les formules gratuites : complétion immédiate (status = "completed")
5. Pour les formules payantes : URL de checkout simulée
6. Vérification via `POST /api/stripe/verify` → Met à jour le statut

### 7.3 Intégration Stripe (à compléter)

- Champs `stripePriceId` existants sur le modèle `Pack`
- Champs `stripeSession` sur `Order` et `stripePaymentId` sur `Payment`
- Webhook Stripe non implémenté
- Modèle `Subscription` et `Invoice` prêts mais non utilisés

---

## 8. Base de données

### 8.1 Schéma relationnel

```
User ─────────┬─── Post (authorId)
              └─── UserProgress (userId)

Lead ─────────┬─── AuditResult (leadId, 1:1)
              └─── AffiliateClick (leadId)

Tool ──────────── AffiliateClick (toolId)

Task ──────────── UserProgress (taskId)

Pack ──────────── Order (packId)

Order ──────────── Payment (orderId, 1:1)

HomeSection ────── HomeSectionItem (sectionId, 1:N)
```

### 8.2 Modèles de données

#### Utilisateurs & Auth
| Modèle | Champs clés | Description |
|---|---|---|
| **User** | id, email, name, password, role | Comptes utilisateurs |
| **Lead** | id, email, firstName, lastName, phone, profile, phase, painPoint, status, source | Prospects captés |
| **AuditResult** | id, leadId, profile, phase, painPoint, bankRec, comptaRec, insurRec, score, summary | Résultats d'audit |

#### Contenu
| Modèle | Champs clés | Description |
|---|---|---|
| **Post** | id, title, slug, excerpt, content, coverImage, published, authorId, category, tags | Articles de blog |
| **Tool** | id, name, slug, tagline, description, category, pricing, rating, pros, cons, features, affiliateUrl, commission | Outils recommandés |
| **Task** | id, phase, title, description, order, active | Tâches roadmap |
| **HomeSection** | id, type, title, subtitle, badge, active, order, settings | Sections CMS home |
| **HomeSectionItem** | id, sectionId, label, content, icon, color, data, active, order | Items sections CMS |

#### Monétisation
| Modèle | Champs clés | Description |
|---|---|---|
| **Pack** | id, name, slug, price, features, stripePriceId, active | Formules tarifaires |
| **Order** | id, packId, amount, status, email, packName, stripeSession | Commandes |
| **Payment** | id, orderId, amount, status, stripePaymentId | Paiements |
| **Subscription** | id, userId, email, packId, stripeSubId, status | Abonnements |
| **Invoice** | id, orderId, subscriptionId, email, amount, status, invoiceNumber | Factures |
| **AffiliateClick** | id, toolId, leadId, ip, referer, converted, revenue | Clics affiliation |

#### Marketing
| Modèle | Champs clés | Description |
|---|---|---|
| **EmailCampaign** | id, name, subject, body, segment, status, sentCount, openCount, clickCount | Campagnes email |
| **GeneratedDocument** | id, userId, email, type, title, content, pdfUrl, status | Documents générés |

### 8.3 Inventaire des données actuelles

| Table | Nombre d'enregistrements |
|---|---|
| Post | 20 |
| Tool | 12 |
| Task | 24 |
| Lead | 121 |
| AuditResult | 81 |
| AffiliateClick | 212 |
| User | 2 |
| Order | 25 |
| Payment | 25 |
| EmailCampaign | 6 |
| HomeSection | 10 |
| HomeSectionItem | 39 |
| UserProgress | 7 |
| Pack | 3 |
| Subscription | 0 |
| Invoice | 0 |

---

## 9. API Routes

### 9.1 Routes publiques

| Endpoint | Méthode | Description | Paramètres |
|---|---|---|---|
| `/api` | GET | Health check | — |
| `/api/register` | POST | Inscription | `{ name, email, password }` |
| `/api/audit` | POST | Soumettre l'audit | `{ email, profile, phase, painPoint, ... }` |
| `/api/click` | POST | Tracking clic affiliation | `{ toolSlug, leadId? }` |
| `/api/posts` | GET | Articles publiés | `?category=&limit=&offset=` |
| `/api/tools` | GET | Outils actifs | `?category=` |
| `/api/packs` | GET | Formules tarifaires | — |
| `/api/packs/seed` | POST | Initialiser les packs | — |

### 9.2 Routes utilisateur (authentifiées)

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/user/audit` | GET | Récupérer résultat audit + recommandations |
| `/api/user/progress` | GET | Récupérer progression tâches |
| `/api/user/progress` | POST | Marquer une tâche comme complétée |

### 9.3 Routes admin

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/admin/stats` | GET | Statistiques agrégées (KPI, graphiques) |
| `/api/admin/leads` | GET, PUT, DELETE | CRUD leads avec pagination/recherche |
| `/api/admin/leads/[id]` | GET, PUT, DELETE | Lead individuel avec audit + clics |
| `/api/admin/tools` | GET, POST | Liste/Créer outils avec compteurs de clics |
| `/api/admin/tools/[id]` | PUT, DELETE | Modifier/Supprimer un outil |
| `/api/admin/posts` | GET, POST | Liste/Créer articles avec auteur |
| `/api/admin/posts/[id]` | PUT, DELETE | Modifier/Supprimer un article |
| `/api/admin/tasks` | GET, POST, PUT, DELETE | CRUD complet tâches |
| `/api/admin/campaigns` | GET, POST, PUT, DELETE | CRUD complet campagnes |

### 9.4 Routes CMS home

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/home/sections` | GET | Toutes les sections (actives uniquement côté public) |
| `/api/home/sections/[id]` | PUT | Modifier une section |
| `/api/home/sections/[id]/items` | GET, POST | Liste/Créer items d'une section |
| `/api/home/sections/[id]/items/[itemId]` | PUT, DELETE | Modifier/Supprimer un item |
| `/api/home/seed` | POST | Initialiser 10 sections par défaut |

### 9.5 Routes paiement

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/stripe/create-checkout` | POST | Créer une commande + session checkout |
| `/api/stripe/verify` | POST | Vérifier et compléter un paiement |

---

## 10. CMS de la page d'accueil

### 10.1 Concept

La page d'accueil est pilotée par un CMS basé sur les modèles `HomeSection` et `HomeSectionItem`. Chaque section peut être activée/désactivée, réordonnée et personnalisée depuis l'API.

### 10.2 Sections CMS disponibles

| Type | Titre | Items |
|---|---|---|
| `hero` | Hero principal | 4 statistiques |
| `profiles` | Profils entrepreneurs | 4 profils |
| `pain_points` | Points de douleur | 4 problèmes |
| `thematic` | Thématiques | 6 domaines |
| `roadmap` | Roadmap | 4 phases |
| `audit` | Audit gratuit | Formulaire |
| `testimonials` | Témoignages | — |
| `faq` | FAQ | Questions/réponses |
| `newsletter` | Newsletter | — |
| `social_proof` | Preuve sociale | Chiffres clés |

### 10.3 Fonctionnalités CMS

- ✅ Activation / désactivation de chaque section
- ✅ Réordonnancement (champ `order`)
- ✅ Personnalisation titre, sous-titre, badge
- ✅ Gestion des items (label, contenu, icône, couleur)
- ✅ JSON settings pour configurations avancées
- ⚠️ Interface admin CMS (`/admin/home`) non encore créée

---

## 11. Système d'affiliation

### 11.1 Fonctionnement

1. Un outil est affiché sur le site (home ou page dédiée)
2. L'utilisateur clique sur "Découvrir"
3. Le clic est enregistré (`POST /api/click`) avec :
   - `toolSlug` : outil cliqué
   - `leadId` : lead associé (si connecté)
   - `sessionId` : identifiant de session
   - `ip` : adresse IP
   - `referer` : page d'origine
4. Redirection vers `affiliateUrl` ou `website`

### 11.2 Suivi des conversions

- Champ `converted` sur `AffiliateClick`
- Champ `revenue` pour tracker les revenus générés
- Dashboard admin : top outils par clics, revenue estimé

### 11.3 Commissions par outil

Chaque outil a un champ `commission` (Float) représentant le pourcentage ou montant de commission. Actuellement 12 outils avec commissions de 0% à 40%.

---

## 12. Design & UX

### 12.1 Système de couleurs

| Variable | Usage | Valeur |
|---|---|---|
| `--primary` | Actions principales | Emerald (oklch) |
| `--accent` | Mise en avant | Amber |
| `--muted` | Arrière-plans | Gris neutre |
| `--destructive` | Erreurs/danger | Rose |

### 12.2 Typographie

- **Corps** : Geist Sans
- **Code** : Geist Mono
- **Titres** : `font-bold` à `tracking-tight`

### 12.3 Composants UI

- **46 composants shadcn/ui** (Button, Card, Dialog, Table, etc.)
- **Design responsive** : Mobile-first avec breakpoints `sm:`, `md:`, `lg:`, `xl:`
- **Animations** : Framer Motion + tailwindcss-animate
- **Dark mode** : Support via classe `.dark` (non activé par défaut)

### 12.4 Conventions UX

| Élément | Convention |
|---|---|
| Cards arrondis | `rounded-2xl` |
| Espacement sections | `py-20 sm:py-28` |
| Conteneur max | `max-w-7xl` |
| Grilles responsive | 1 → 2 → 3 colonnes |
| Boutons CTA | `bg-primary hover:bg-primary/90` |
| Boutons secondaires | `variant="outline"` |
| États de chargement | Skeleton shadcn/ui |
| Notifications | Toast (Sonner) |

---

## 13. Sécurité

### 13.1 Points forts

- ✅ Mots de passe hashés (bcryptjs, 12 rounds)
- ✅ JWT Stateless (pas de session côté serveur)
- ✅ Middleware de protection des routes admin/dashboard
- ✅ Validation des inputs côté API
- ✅ Protection CSRF via SameSite cookies

### 13.2 Points d'amélioration

| Risque | Sévérité | Description |
|---|---|---|
| URL DB hardcodée | 🔴 Critique | URL PostgreSQL en clair dans `src/lib/db.ts` |
| Pas de rate limiting | 🟠 Élevé | API publiques non protégées contre le brute force |
| Pas de protection API admin | 🟠 Élevé | Seules les pages sont protégées par middleware, pas les routes API |
| Pas de validation côté Prisma | 🟡 Moyen | Pas de Zod sur toutes les routes |
| `ignoreBuildErrors: true` | 🟡 Moyen | Erreurs TypeScript masquées en build |
| Secrets en clair | 🟡 Moyen | `NEXTAUTH_SECRET` = valeur temporaire |

---

## 14. Fonctionnalités manquantes / Roadmap

### 14.1 Critique (P0)

| Fonctionnalité | Description |
|---|---|
| **Stripe réel** | Remplacer la simulation par l'API Stripe (checkout session, webhook) |
| **Pages articles individuelles** | Créer `/actualites/[slug]` pour le SEO |
| **Protection API admin** | Vérifier le rôle `admin` côté serveur sur chaque route |
| **Rate limiting** | Protéger les routes publiques (audit, register, click) |
| **Secrets sécurisés** | Utiliser un vault ou variables d'environnement réelles |

### 14.2 Important (P1)

| Fonctionnalité | Description |
|---|---|
| **Envoi d'emails réel** | Intégrer Brevo/Sendinblue pour les campagnes |
| **Interface admin CMS** | Page `/admin/home` pour gérer les sections dynamiquement |
| **Facturation** | Générer des factures PDF pour les commandes |
| **Abonnements** | Gérer les renouvellements et annulations via Stripe |
| **Export de données admin** | Export CSV des leads, outils, articles |
| **Recherche globale** | Barre de recherche sur tout le site |

### 14.3 Nice to have (P2)

| Fonctionnalité | Description |
|---|---|
| **Dark mode** | Activer le thème sombre |
| **i18n** | Traduire le site (next-intl est en dépendance) |
| **SEO avancé** | Sitemaps, meta descriptions, structured data |
| **Tests** | Tests unitaires et d'intégration (Playwright/Vitest) |
| **Notifications push** | Alerte pour les utilisateurs sur leur progression |
| **Chatbot IA** | Assistant virtuel pour guider les entrepreneurs |
| **Nettoyage modèles legacy** | Supprimer b2bfr, b2c, cv2, secu inutilisés |

---

## 15. Données de référence

### 15.1 Outils affiliés (12)

| Outil | Catégorie | Tarification | Note | Commission |
|---|---|---|---|---|
| Shine | Banque | Gratuit | 4.2 | 15% |
| Qonto | Banque | Freemium | 4.5 | 25% |
| Shine Neo | Banque | Gratuit | 3.8 | 12% |
| Indy | Comptabilité | Freemium | 4.4 | 20% |
| Freebe | Comptabilité | Gratuit | 4.0 | 10% |
| Shine Compta | Comptabilité | Payant | 3.9 | 18% |
| Alan | Assurance | Payant | 4.6 | 35% |
| Wenity | Assurance | Payant | 3.7 | 30% |
| Hostinger | Marketing | Freemium | 4.3 | 40% |
| Mailchimp | Marketing | Freemium | 4.1 | 15% |
| Canva Pro | Marketing | Payant | 4.7 | 12% |
| Stripe | Autre | Payant | 4.5 | 0% |

### 15.2 Formules tarifaires (3)

| Formule | Prix | Fonctionnalités |
|---|---|---|
| Starter | 0€ | Audit gratuit, contenu de base, outils communautaires |
| Pro | 29€/mois | Accès complet, recommandations personnalisées, suivi avancé, support prioritaire |
| Premium | 79€/mois | Tout Pro + conseil dédié, outils premium, formations exclusives |

### 15.3 Tâches roadmap (24)

- **Réflexion** (6 tâches) : Définir son projet, Étudier le marché, Choisir son statut, etc.
- **Création** (6 tâches) : Immatriculation, Ouverture compte bancaire, Souscrire assurances, etc.
- **Gestion** (6 tâches) : Comptabilité, Facturation, Déclarations fiscales, etc.
- **Croissance** (6 tâches) : Recrutement, Marketing, Financement, etc.

### 15.4 Catégories de contenus

| Catégorie | Articles | Outils |
|---|---|---|
| Création | ✅ | — |
| Finance | ✅ | — |
| Comptabilité | ✅ | 3 outils |
| Assurance | ✅ | 2 outils |
| Marketing | ✅ | 3 outils |
| Gestion | ✅ | — |
| Banque | — | 3 outils |
| Juridique | — | 0 outil |
| CRM | — | 0 outil |

---

## Annexe A — Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@100jours.fr` | À définir en base |

## Annexe B — Variables d'environnement

| Variable | Description | Valeur actuelle |
|---|---|---|
| `DATABASE_URL` | Connexion PostgreSQL | `postgresql://admin_100jours:***@109.123.249.114:5432/100jours` |
| `NEXTAUTH_SECRET` | Secret JWT | À changer en production |
| `NEXTAUTH_URL` | URL de l'app | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Clé Stripe | Non configurée |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | Non configuré |

## Annexe C — Dépendances principales

| Package | Version | Usage |
|---|---|---|
| `next` | 16.1 | Framework |
| `react` / `react-dom` | 19 | UI |
| `typescript` | 5 | Langage |
| `tailwindcss` | 4 | Styling |
| `prisma` | 6.19 | ORM |
| `@tanstack/react-query` | 5 | Data fetching |
| `zustand` | 5 | State client |
| `next-auth` | 4 | Authentification |
| `framer-motion` | 12 | Animations |
| `recharts` | 2.15 | Graphiques |
| `lucide-react` | — | Icônes |
| `@dnd-kit/core` | — | Drag & drop (tâches) |
| `bcryptjs` | — | Hashage mots de passe |
| `sonner` | — | Toasts |
| `zod` | — | Validation |
| `class-variance-authority` | — | Variants UI |

---

*Document généré automatiquement le 25 avril 2026 — Version 2.0*
