import { NextResponse } from "next/server";

// ─── Full static data for all 12 services ─────────────────────────────────────

const services = [
  {
    slug: "marketing-digital",
    shortTitle: "Marketing Digital",
    title: "Accompagnement Marketing Digital",
    description:
      "Le créateur a son entreprise mais ne sait pas comment attirer des clients en ligne. Notre accompagnement marketing digital lui fournit une stratégie complète, de l'audit initial à la mise en place de campagnes performantes.",
    shortDescription:
      "Stratégie marketing complète : audit, réseaux sociaux, Google Ads, SEO basique et reporting pour attirer vos premiers clients.",
    category: "Marketing",
    priceFrom: 490,
    priceUnit: "€/mois",
    icon: "Megaphone",
    gradient: "from-violet-500 to-purple-600",
    features: [
      "Audit digital initial (SEO, social, ads, site, branding)",
      "Stratégie social media personnalisée",
      "Création et optimisation de campagnes Google Ads / Meta Ads",
      "SEO basique et optimisation de contenu",
      "Landing pages optimisées et A/B testing",
      "Email marketing automatisé",
      "Analytics avancés et tableau de bord KPI",
      "Consultation stratégique mensuelle",
      "Reporting hebdomadaire / mensuel détaillé",
    ],
    deliverables: [
      "Audit initial livré sous 7 jours",
      "Calendrier éditorial 3 mois",
      "Rapport mensuel avec KPIs (trafic, conversions, CPA, ROI)",
      "Configuration outils (GA4, Search Console, Meta Pixel)",
    ],
    tiers: [
      {
        name: "Starter",
        price: "490€ HT/mois",
        description: "Idéal pour démarrer en ligne",
        includes: [
          "Audit en ligne initial",
          "Stratégie social media (2 plateformes)",
          "4 posts/mois",
          "Reporting mensuel",
        ],
        duration: "Sans engagement",
        cta: "Démarrer Starter",
        popular: false,
      },
      {
        name: "Growth",
        price: "990€ HT/mois",
        description: "Pour scaler votre présence",
        includes: [
          "Tout Starter + Google Ads / Meta Ads",
          "SEO basique (5 mots-clés)",
          "Landing page optimisée",
          "A/B testing",
          "Reporting hebdo",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Growth",
        popular: true,
      },
      {
        name: "Scale",
        price: "1 990€ HT/mois",
        description: "Pour une stratégie complète",
        includes: [
          "Tout Growth + Funnel complet (3 LP)",
          "Email marketing automatisé",
          "Analytics avancés",
          "Consultation stratégique 2h/mois",
          "KPI dashboard",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Scale",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Quelles plateformes sociales couvrez-vous ?",
        answer:
          "Nous couvrons LinkedIn, Instagram, Facebook, Twitter/X et TikTok selon votre cible. La formule Starter inclut 2 plateformes au choix, Scale inclut toutes les plateformes pertinentes pour votre secteur.",
      },
      {
        question: "Le budget publicitaire est-il inclus ?",
        answer:
          "Non, le budget Ads (Google Ads, Meta Ads) est en sus. Nous gérons et optimisons vos campagnes mais le budget média est facturé directement par les plateformes. Nous vous aidons à définir le budget optimal.",
      },
      {
        question: "Combien de temps pour voir des résultats ?",
        answer:
          "Les premiers résultats visibles apparaissent généralement entre 1 et 3 mois. Le SEO nécessite 3 à 6 mois pour des résultats significatifs. Nous vous fournissons un calendrier prévisionnel dès le départ.",
      },
    ],
  },
  {
    slug: "community-management",
    shortTitle: "Community Management",
    title: "Community Management",
    description:
      "Le dirigeant n'a pas le temps ni les compétences pour gérer ses réseaux sociaux, mais c'est devenu indispensable. Nous prenons en charge la création de contenu, l'engagement avec votre communauté et la stratégie éditoriale.",
    shortDescription:
      "Gestion complète de vos réseaux sociaux : contenu, engagement, stories, reels et stratégie de croissance.",
    category: "Marketing",
    priceFrom: 390,
    priceUnit: "€/mois",
    icon: "Users",
    gradient: "from-pink-500 to-rose-600",
    features: [
      "Gestion de 1 à 3 plateformes sociales",
      "Création de posts carrousel et visuels",
      "Publication de stories quotidiennes",
      "Création de Reels / Shorts (2/mois Influence)",
      "Réponses aux commentaires et messages",
      "Stratégie de hashtags optimisée",
      "Veille concurrentielle mensuelle",
      "Influence marketing et micro-influenceurs",
      "Reporting et analytics détaillés",
    ],
    deliverables: [
      "6 à 16 posts par mois selon la formule",
      "Stories quotidiennes (15-20/mois)",
      "Rapport de veille concurrentielle mensuel",
      "Calendrier éditorial validé en amont",
    ],
    tiers: [
      {
        name: "Présence",
        price: "390€ HT/mois",
        description: "1 plateforme, l'essentiel",
        includes: [
          "1 plateforme (au choix)",
          "6 posts/mois",
          "Réponses commentaires",
          "1 story/semaine",
        ],
        duration: "Sans engagement",
        cta: "Démarrer Présence",
        popular: false,
      },
      {
        name: "Engagement",
        price: "690€ HT/mois",
        description: "2 plateformes, croissance",
        includes: [
          "2 plateformes",
          "12 posts/mois",
          "Stories quotidiennes",
          "Réponses + hashtag strategy",
          "Reporting mensuel",
        ],
        duration: "Sans engagement",
        cta: "Démarrer Engagement",
        popular: true,
      },
      {
        name: "Influence",
        price: "1 290€ HT/mois",
        description: "3 plateformes, stratégie complète",
        includes: [
          "3 plateformes",
          "16 posts/mois",
          "Reels/Shorts (2/mois)",
          "Influence marketing",
          "Stratégie éditoriale",
          "Analytics détaillé",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Influence",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Créez-vous le contenu visuel ?",
        answer:
          "Oui, nous créons tous les visuels (posts carrousels, stories, thumbnails). Pour les photos de produits ou vidéos spécifiques, nous vous guidons avec des briefs clairs ou nous pouvons intégrer votre propre contenu.",
      },
      {
        question: "Puis-je valider les contenus avant publication ?",
        answer:
          "Absolument ! Chaque contenu est soumis à votre validation via un calendrier éditorial partagé avant publication. Vous gardez le contrôle total sur votre image de marque.",
      },
      {
        question: "Le pack Launch Boost est-il intéressant ?",
        answer:
          "Le Launch Boost à 590€ est idéal pour les nouvelles créations. C'est un mois intensif pour capitaliser sur le lancement : teaser, compte à rebours, annonces d'ouverture et engagement initial. Un excellent complément au Pack Créer.",
      },
    ],
  },
  {
    slug: "supports-communication",
    shortTitle: "Supports de Communication",
    title: "Création de Supports de Communication",
    description:
      "Le créateur a besoin d'une identité visuelle professionnelle mais n'a pas le budget d'une agence. Nous proposons des solutions abordables pour créer votre image de marque, du logo au brand book complet.",
    shortDescription:
      "Identité visuelle professionnelle : logo, charte graphique, kit de lancement et brand book pour votre marque.",
    category: "Design",
    priceFrom: 290,
    priceUnit: "€",
    icon: "Palette",
    gradient: "from-amber-500 to-orange-600",
    features: [
      "Création de logo professionnel",
      "Identité de marque complète (palette, typographies)",
      "Kit de lancement (carte de visite, papeterie, signatures)",
      "Templates réseaux sociaux personnalisés",
      "Charte graphique complète (Brand Book)",
      "Templates Canva / PowerPoint",
      "Guidelines voix de marque",
      "Supports print (flyers, brochures, roll-ups)",
      "Présentations investor pitch",
    ],
    deliverables: [
      "Fichiers source (AI/PNG/SVG) pour le logo",
      "Guide d'utilisation basique de l'identité",
      "Carte de visite et papeterie complète (Kit de Lancement)",
      "Brand Book PDF de 20+ pages (Brand Book)",
    ],
    tiers: [
      {
        name: "Logo Essentiel",
        price: "290€ HT",
        description: "Un logo professionnel",
        includes: [
          "2 propositions de logo",
          "2 rounds de révision",
          "Fichiers source (AI/PNG/SVG)",
          "Versions couleur/noir/blanc",
        ],
        duration: "5 jours",
        cta: "Commander mon logo",
        popular: false,
      },
      {
        name: "Identité de Marque",
        price: "690€ HT",
        description: "Une identité complète",
        includes: [
          "Logo (3 propositions)",
          "Palette couleurs + Typographies",
          "Variations (icône, favicon, social)",
          "Guide d'utilisation basique",
        ],
        duration: "10 jours",
        cta: "Choisir mon identité",
        popular: true,
      },
      {
        name: "Kit de Lancement",
        price: "1 490€ HT",
        description: "Tout pour démarrer",
        includes: [
          "Identité complète",
          "Carte de visite + Papeterie",
          "3 templates réseaux sociaux",
          "Signature email pro + Favicon",
        ],
        duration: "15 jours",
        cta: "Commander mon kit",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Combien de révisions sont incluses ?",
        answer:
          "Le Logo Essentiel inclut 2 rounds de révision, l'Identité de Marque et le Kit de Lancement incluent 3 rounds. Chaque round permet des ajustements significatifs. Des révisions supplémentaires sont possibles à 50€/round.",
      },
      {
        question: "Le Kit de Lancement est-il le meilleur choix après création ?",
        answer:
          "Oui, c'est l'offre idéale juste après avoir reçu votre KBIS. Vous avez besoin de tout : logo, carte de visite, signature email, templates réseaux... À 1 490€ c'est 50 à 80% moins cher qu'une agence pour un résultat équivalent.",
      },
    ],
  },
  {
    slug: "lead-generation",
    shortTitle: "Lead Generation B2B",
    title: "Lead Generation B2B",
    description:
      "Le manque de prospection est la cause n°1 d'échec en année 1. Nous mettons en place des stratégies outbound et inbound pour générer un flux constant de prospects qualifiés pour votre entreprise.",
    shortDescription:
      "Génération de prospects qualifiés B2B via prospection LinkedIn, email outreach, landing pages et campagnes ciblées.",
    category: "Commercial",
    priceFrom: 790,
    priceUnit: "€/mois",
    icon: "Target",
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "Profil LinkedIn optimisé",
      "Prospection automatique (demandes de connexion)",
      "Scripts de prospection personnalisés",
      "Séquences email cold outreach",
      "LinkedIn Sales Navigator",
      "Scoring et qualification des leads",
      "CRM et pipeline management",
      "Landing pages et lead magnets",
      "Séquences email nurturing",
      "Consultation vente mensuelle",
    ],
    deliverables: [
      "15 à 500 leads qualifiés/mois selon la formule",
      "CRM configuré (Notion, Trello, HubSpot ou Pipedrive)",
      "Reporting mensuel avec pipeline détaillé",
      "Scripts et templates de prospection personnalisés",
    ],
    tiers: [
      {
        name: "Prospect Starter",
        price: "790€ HT/mois",
        description: "Démarrez votre prospection",
        includes: [
          "Profil LinkedIn optimisé",
          "100 demandes de connexion/semaine",
          "Script de prospection personnalisé",
          "CRM basique (Notion/Trello)",
          "Reporting mensuel",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Starter",
        popular: false,
      },
      {
        name: "Outbound Machine",
        price: "1 790€ HT/mois",
        description: "Machine à prospection",
        includes: [
          "Tout Prospect Starter",
          "Séquences email cold outreach",
          "LinkedIn Sales Navigator",
          "Scoring et qualification",
          "Pipeline management",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Outbound",
        popular: true,
      },
      {
        name: "Full Funnel",
        price: "3 990€ HT/mois",
        description: "Approche 360°",
        includes: [
          "Outbound + Inbound combiné",
          "CRM avancé (HubSpot/Pipedrive)",
          "Automation workflows",
          "Consultation vente 2h/mois",
          "Optimisation continue",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Full Funnel",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Quelle garantie de résultats proposez-vous ?",
        answer:
          "Sur les formules Outbound et supérieures, nous garantissons 30 leads minimum par mois. Sinon, 20% de remise le mois suivant. Le CPL max est fixé au contrat. Tout lead non joignable ou non qualifié est remplacé gratuitement.",
      },
      {
        question: "Quel est le CPL effectif ?",
        answer:
          "Notre CPL effectif est de 25-50€ grâce à la connaissance préalable de votre ICP (Ideal Customer Profile). C'est bien inférieur au marché classique (80-250€/lead) car nous optimisons continuellement nos campagnes.",
      },
    ],
  },
  {
    slug: "business-plan",
    shortTitle: "Business Plan",
    title: "Business Plan & Prévisionnel Financier",
    description:
      "Le créateur a besoin d'un business plan pour obtenir un financement (banque, BPI, investisseurs). C'est souvent obligatoire pour les prêts d'honneur et subventions. Nous pré-remplissons 60% du document grâce aux données de création.",
    shortDescription:
      "Business plan professionnel et prévisionnel financier 3 ans, pré-rempli avec vos données de création pour un gain de temps maximal.",
    category: "Finance",
    priceFrom: 290,
    priceUnit: "€",
    icon: "FileBarChart",
    gradient: "from-emerald-500 to-green-600",
    features: [
      "Business plan pré-rempli (données du secteur)",
      "Prévisionnel financier 3 ans",
      "Étude de marché personnalisée",
      "Stratégie marketing & commerciale",
      "Analyse SWOT",
      "Pitch deck (10 slides)",
      "Scénarios (base/optimiste/pessimiste)",
      "Dossier BPI France complet",
      "Coaching présentation en banque",
    ],
    deliverables: [
      "Business plan en PDF professionnel",
      "Prévisionnel financier (CA, charges, résultat, trésorerie)",
      "Pitch deck pour investisseurs",
      "2 à 4h de coaching selon la formule",
    ],
    tiers: [
      {
        name: "BP Express",
        price: "490€ HT",
        description: "Rapide et efficace",
        includes: [
          "BP pré-rempli (IA-assisted)",
          "Prévisionnel financier 3 ans",
          "Mise en page PDF professionnelle",
        ],
        duration: "5 jours ouvrés",
        cta: "Commander BP Express",
        popular: false,
      },
      {
        name: "BP Expert",
        price: "1 290€ HT",
        description: "Complet et convaincant",
        includes: [
          "BP Express + Étude de marché",
          "Stratégie marketing & commerciale",
          "Analyse SWOT",
          "Pitch deck (10 slides)",
          "2h de coaching présentation",
        ],
        duration: "10 jours",
        cta: "Choisir BP Expert",
        popular: true,
      },
      {
        name: "BP Investor",
        price: "2 490€ HT",
        description: "Pour lever des fonds",
        includes: [
          "BP Expert + Prévisionnel détaillé",
          "Scénarios (base/optimiste/pessimiste)",
          "Dossier BPI France complet",
          "Relecture expert-comptable",
          "4h de coaching",
        ],
        duration: "15 jours",
        cta: "Choisir BP Investor",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Pourquoi votre BP est-il moins cher qu'un cabinet ?",
        answer:
          "Parce que nous avons déjà 60% de vos données dans notre système (forme juridique, secteur, localisation). Cela réduit considérablement le temps de création tout en garantissant une qualité professionnelle. Un cabinet facturerait le même travail 3 000 à 15 000€.",
      },
      {
        question: "Le BP Express suffit-il pour une demande de prêt bancaire ?",
        answer:
          "Oui, le BP Express est adapté aux demandes de prêt classiques. Pour des demandes plus complexes (BPI France, investisseurs, levée de fonds), nous recommandons le BP Expert ou BP Investor qui incluent une étude de marché et un coaching présentation.",
      },
    ],
  },
  {
    slug: "recouvrement",
    shortTitle: "Recouvrement de Créances",
    title: "Recouvrement de Créances",
    description:
      "25% des faillites de TPE sont dues à des impayés. Notre service de recouvrement amiable est 100% au succès : vous ne payez que si nous récupérons votre argent. Aucun frais avancés.",
    shortDescription:
      "Recouvrement amiable 100% au succès : relances, négociation et suivi jusqu'au paiement. Zéro frais avancés.",
    category: "Finance",
    priceFrom: 0,
    priceUnit: "Au succès",
    icon: "Banknote",
    gradient: "from-red-500 to-rose-600",
    features: [
      "Relances email et téléphoniques",
      "Mise en demeure (modèle fourni)",
      "Lettre recommandée AR",
      "Négociation avec le débiteur",
      "Plan d'échéancier",
      "Coordination avec huissier partenaire",
      "Audit du poste client",
      "Scoring clients et prévention",
      "Recommandations de conditions de vente",
    ],
    deliverables: [
      "Rapport de suivi de recouvrement",
      "Modèles de conditions générales renforcées",
      "Rapport d'analyse du poste client (Audit)",
      "Scoring clients avec recommandations",
    ],
    tiers: [
      {
        name: "Relance Douce",
        price: "8% (min. 49€)",
        description: "Relances amiables",
        includes: [
          "3 relances email",
          "2 relances téléphoniques",
          "Mise en demeure (modèle)",
          "Suivi pendant 30 jours",
        ],
        duration: "30 jours",
        cta: "Démarrer relance",
        popular: false,
      },
      {
        name: "Recouvrement Actif",
        price: "12% (min. 99€)",
        description: "Action renforcée",
        includes: [
          "Tout Relance Douce",
          "Lettre recommandée AR",
          "Négociation avec le débiteur",
          "Plan d'échéancier",
          "Suivi max 90 jours",
        ],
        duration: "90 jours",
        cta: "Démarrer recouvrement",
        popular: true,
      },
      {
        name: "Recouvrement Premium",
        price: "15% (min. 199€)",
        description: "Service complet",
        includes: [
          "Tout Recouvrement Actif",
          "Sommation interpellative",
          "Coordination huissier",
          "Reporting complet",
          "Analyse prévention",
        ],
        duration: "90 jours",
        cta: "Démarrer Premium",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Y a-t-il des frais avancés ?",
        answer:
          "Non, absolument aucun. Notre modèle est 100% au succès : vous ne payez que si nous récupérons votre créance. C'est notre façon de garantir notre engagement et de vous protéger.",
      },
      {
        question: "Que se passe-t-il si le recouvrement amiable échoue ?",
        answer:
          "En cas d'échec du recouvrement amiable, nous vous orientons vers notre partenaire huissier de justice pour les étapes contentieuses. Vous ne nous devez rien, et nous vous fournissons tous les documents nécessaires pour la procédure.",
      },
    ],
  },
  {
    slug: "copilote-entreprise",
    shortTitle: "Copilote Entreprise",
    title: "Copilote Entreprise (Coaching Opérationnel)",
    description:
      "Le dirigeant est seul et porte toutes les casquettes. Notre Copilote Entreprise est un partenaire opérationnel qui le décharge sur le commercial, la finance, la stratégie et le mindset. C'est notre service phare et différenciant.",
    shortDescription:
      "Coaching opérationnel sur-mesure : sessions visio, support Slack illimité, tableau de bord KPIs et Pain Tracker exclusif.",
    category: "Coaching",
    priceFrom: 149,
    priceUnit: "€/session",
    icon: "Compass",
    gradient: "from-emerald-600 to-teal-600",
    features: [
      "Sessions visio régulières (planification + bilan)",
      "Support Slack/WhatsApp illimité",
      "Pain Tracker exclusif (suivi des points de douleur)",
      "Tableau de bord KPIs partagé",
      "Objectifs trimestriels",
      "Accès aux templates & outils",
      "Accompagnement recrutement",
      "Relecture contrats",
      "Mise en relation partenaires",
      "Revue stratégique mensuelle",
    ],
    deliverables: [
      "Sessions visio enregistrées avec compte-rendu",
      "Tableau de bord KPIs en temps réel",
      "Pain Tracker avec scoring de santé entreprise",
      "Checklists et outils partagés (Notion)",
    ],
    tiers: [
      {
        name: "Copilote Light",
        price: "490€ HT/mois",
        description: "Le pied à l'étrier",
        includes: [
          "2 sessions visio de 45 min/mois",
          "Support Slack/WhatsApp (< 48h)",
          "Checklists et outils partagés",
          "1 audit trimestriel",
        ],
        duration: "Sans engagement",
        cta: "Démarrer Light",
        popular: false,
      },
      {
        name: "Copilote Pro",
        price: "990€ HT/mois",
        description: "Accompagnement renforcé",
        includes: [
          "4 sessions visio de 1h/mois",
          "Support prioritaire (< 24h)",
          "Tableau de bord KPIs",
          "Objectifs trimestriels",
          "Session stratégique trimestrielle (2h)",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Pro",
        popular: true,
      },
      {
        name: "Copilote Premium",
        price: "1 790€ HT/mois",
        description: "Partenaire stratégique",
        includes: [
          "Sessions hebdomadaires (1h)",
          "Support dédié (< 4h)",
          "Dashboards avancés",
          "Accompagnement recrutement (1/an)",
          "Relecture contrats",
          "Revue stratégique mensuelle (2h)",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Premium",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Qu'est-ce que le Pain Tracker ?",
        answer:
          "C'est notre innovation propriétaire. C'est un tableau de bord qui suit vos 'pains' (points de douleur) en temps réel : priorités, statut, actions en cours. Chaque session commence par le Pain Tracker et vous voyez votre progression mois par mois. C'est addictif et extrêmement efficace.",
      },
      {
        question: "Sur quoi pouvez-vous m'accompagner concrètement ?",
        answer:
          "Le Copilote couvre 5 domaines : Commercial (trouver des clients, négocier, pricing), Finance (trésorerie, fiscalité, investissements), RH (recrutement, statuts), Stratégie (pivot, levée de fonds, partenariats) et Mindset (délégation, gestion du stress, syndrome de l'imposteur).",
      },
      {
        question: "Le Copilote Boost à 149€/session en vaut-il la peine ?",
        answer:
          "Oui, c'est parfait pour un diagnostic ponctuel ou une question urgente. Sans engagement, c'est un excellent moyen de découvrir le service avant de s'engager sur un forfait mensuel.",
      },
    ],
  },
  {
    slug: "daf-externalise",
    shortTitle: "DAF Externalisé",
    title: "DAF Externalisé & Pilotage Financier",
    description:
      "Les PME de 10-50 salariés n'ont pas les moyens d'embaucher un DAF (60 000-100 000€/an). Notre DAF Externalisé offre un pilotage financier professionnel à une fraction du coût, avec la réactivité d'un partenaire qui connaît votre entreprise.",
    shortDescription:
      "Pilotage financier de PME : reporting, trésorerie, optimisation fiscale, relation banque/investisseurs et business plan récurrent.",
    category: "Finance",
    priceFrom: 1490,
    priceUnit: "€/mois",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "Journée(s) sur site mensuelle(s)",
      "Reporting financier mensuel",
      "Tableau de bord trésorerie",
      "Suivi budget et prévisions",
      "Analyse des coûts et optimisation",
      "Optimisation de la fiscalité",
      "Préparation conseils d'administration",
      "Relation banque et investisseurs",
      "Cash management",
      "Accompagnement levée de fonds",
    ],
    deliverables: [
      "Reporting financier mensuel (PDF + dashboard)",
      "Prévisions de trésorerie 3 mois glissants",
      "Dashboard temps réel accessible 24/7",
      "Compte-rendu de chaque intervention",
    ],
    tiers: [
      {
        name: "Pilotage Essentiel",
        price: "1 490€ HT/mois",
        description: "Pour TPE 5-15 personnes",
        includes: [
          "1 journée/mois sur site",
          "Reporting financier mensuel",
          "Tableau de bord trésorerie",
          "Suivi budget",
          "Prévisions trésorerie 3 mois",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Essentiel",
        popular: false,
      },
      {
        name: "DAF Part-Time",
        price: "2 990€ HT/mois",
        description: "Pour PME 15-40 personnes",
        includes: [
          "2 jours/mois",
          "Tout Pilotage Essentiel",
          "Analyse des coûts",
          "Optimisation fiscale",
          "Relation banque/investisseurs",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Part-Time",
        popular: true,
      },
      {
        name: "DAF Externalisé",
        price: "4 990€ HT/mois",
        description: "Pour PME 30-80 personnes",
        includes: [
          "4 jours/mois",
          "Tout DAF Part-Time",
          "Business plan récurrent",
          "Modélisation financière",
          "Audit interne",
          "Accompagnement levée de fonds",
        ],
        duration: "12 mois min.",
        cta: "Démarrer Full DAF",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Pourquoi pas simplement un expert-comptable ?",
        answer:
          "L'expert-comptable gère la comptabilité (passage d'écritures, déclarations). Le DAF Externalisé prend une dimension stratégique : pilotage de la trésorerie, relation avec les banques, optimisation fiscale, préparation des décisions d'investissement. Ce sont deux métiers complémentaires.",
      },
      {
        question: "Comment fonctionne la relation avec la banque ?",
        answer:
          "Nous préparons les dossiers de financement, assistons aux rendez-vous bancaires si nécessaire, et assurons le suivi. Notre crédibilité de DAF facilite les négociations et les obtentions de lignes de crédit.",
      },
    ],
  },
  {
    slug: "seo-referencement",
    shortTitle: "SEO & Référencement",
    title: "SEO & Référencement Naturel",
    description:
      "Sans SEO, votre site perd 60 à 70% de son trafic potentiel. Nous optimisons votre visibilité sur Google avec une stratégie sur-mesure combinant SEO technique, contenu et netlinking pour des résultats durables.",
    shortDescription:
      "Visibilité sur Google : audit SEO, référencement local, stratégie de contenu, netlinking et suivi de positions.",
    category: "Marketing",
    priceFrom: 490,
    priceUnit: "€",
    icon: "Search",
    gradient: "from-green-500 to-emerald-600",
    features: [
      "Audit SEO technique complet",
      "Audit de contenu et backlinks",
      "Analyse de la concurrence",
      "Google Business Profile optimisé",
      "Stratégie de contenu (articles/mois)",
      "Netlinking (backlinks de qualité)",
      "Optimisation technique (Core Web Vitals)",
      "Schema markup et données structurées",
      "Suivi de positions (mots-clés)",
      "Consultation stratégique mensuelle",
    ],
    deliverables: [
      "Plan d'action SEO 90 jours (PDF)",
      "Articles de blog optimisés (4 à 12/mois)",
      "Rapport de suivi de positions mensuel",
      "Google Business Profile optimisé (SEO Local)",
    ],
    tiers: [
      {
        name: "SEO Audit",
        price: "490€ HT",
        description: "Diagnostic complet",
        includes: [
          "Audit technique + contenu + backlinks",
          "Analyse concurrence",
          "Plan d'action 90 jours (PDF)",
        ],
        duration: "Ponctuel (5 jours)",
        cta: "Commander mon audit",
        popular: false,
      },
      {
        name: "SEO Croissance",
        price: "1 290€ HT/mois",
        description: "Montée en puissance",
        includes: [
          "SEO Audit + SEO Local",
          "Stratégie contenu (8 articles/mois)",
          "Netlinking (5 backlinks/mois)",
          "Optimisation technique",
          "Suivi positions (50 mots-clés)",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Croissance",
        popular: true,
      },
      {
        name: "SEO Dominance",
        price: "2 290€ HT/mois",
        description: "Domination de votre marché",
        includes: [
          "Tout SEO Croissance",
          "Contenu intensif (12 articles/mois)",
          "Netlinking premium (10 BL/mois)",
          "Schema markup + Core Web Vitals",
          "Consultation 2h/mois",
        ],
        duration: "12 mois min.",
        cta: "Démarrer Dominance",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Quelles garanties SEO proposez-vous ?",
        answer:
          "SEO Local : Page 1 Google sur 5 requêtes locales en 6 mois. SEO Croissance : Top 10 sur 10 mots-clés ciblés en 12 mois. SEO Dominance : Top 5 sur 15 mots-clés + trafic organique x3 en 12 mois. Si les objectifs ne sont pas atteints, nous prolongeons gratuitement.",
      },
      {
        question: "Le SEO Local est-il pertinent pour mon activité ?",
        answer:
          "Si vous avez une activité locale (commerce, artisan, prestataire de services physique), le SEO Local est indispensable. Il vous positionne sur les recherches géolocalisées et optimise votre fiche Google Business Profile pour attirer les clients proches.",
      },
    ],
  },
  {
    slug: "creation-site-web",
    shortTitle: "Création Site Web",
    title: "Création & Refonte de Site Web",
    description:
      "Beaucoup de TPE n'ont pas de site web, ou ont un site obsolète qui dégrade leur image. C'est le premier investissement après la création. Nous créons des sites performants, optimisés SEO et adaptés à votre activité.",
    shortDescription:
      "Site web professionnel : landing page, site vitrine, site business avec blog et CMS. Design responsive et optimisé SEO.",
    category: "Tech",
    priceFrom: 890,
    priceUnit: "€",
    icon: "Globe",
    gradient: "from-sky-500 to-cyan-600",
    features: [
      "Design responsive mobile-first",
      "Optimisation SEO de base",
      "Google Analytics intégré",
      "Formulaire de contact",
      "Blog intégré (Site Business)",
      "Landing page de capture (Site Business)",
      "Chat widget (Site Business)",
      "CMS admin intuitif",
      "Formation utilisation (2h)",
      "Support technique 3 mois",
    ],
    deliverables: [
      "Site web mis en ligne et fonctionnel",
      "Formation utilisation du CMS (2h vidéo ou visio)",
      "3 mois de support technique inclus",
      "Guide de référencement de base",
    ],
    tiers: [
      {
        name: "Landing Page",
        price: "890€ HT",
        description: "Une page qui convertit",
        includes: [
          "1 page de vente optimisée",
          "Design responsive",
          "Formulaire de contact",
          "SEO de base",
          "Mise en ligne",
        ],
        duration: "10 jours",
        cta: "Commander ma LP",
        popular: false,
      },
      {
        name: "Site Vitrine",
        price: "1 890€ HT",
        description: "5 pages professionnelles",
        includes: [
          "5 pages (Accueil, Services, À propos, Contact, Blog)",
          "Design responsive",
          "SEO + Google Analytics",
          "Formulaire + 1 round de révision",
        ],
        duration: "21 jours",
        cta: "Commander mon site",
        popular: true,
      },
      {
        name: "Site Business",
        price: "3 490€ HT",
        description: "Site complet avec blog",
        includes: [
          "Site Vitrine + Blog intégré",
          "Landing page de capture",
          "Chat widget",
          "CMS admin",
          "Formation (2h) + 3 mois support",
        ],
        duration: "30 jours",
        cta: "Commander Site Business",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Quelle technologie utilisez-vous ?",
        answer:
          "Selon le besoin : WordPress + Elementor pour les sites vitrines (rapide, modifiable), Next.js + Tailwind pour les sites performants, Shopify pour l'e-commerce, Webflow pour le design pixel-perfect. Nous vous conseillons la meilleure stack pour votre projet.",
      },
      {
        question: "Puis-je modifier mon site moi-même après livraison ?",
        answer:
          "Absolument ! Tous nos sites incluent un CMS admin intuitif. La formule Site Business inclut une formation de 2h pour vous rendre autonome. Pour les modifications plus complexes, notre support est disponible pendant 3 mois.",
      },
    ],
  },
  {
    slug: "formation",
    shortTitle: "Formation & Compétences",
    title: "Formation & Montée en Compétences",
    description:
      "Le dirigeant doit tout apprendre seul. Les formations externes coûtent cher et sont génériques. Nos formations sont conçues spécifiquement pour les dirigeants de TPE/PME et couvrent les compétences clés du quotidien.",
    shortDescription:
      "Formations pratiques pour dirigeants de TPE/PME : masterclasses en ligne, bootcamps et formations sur-mesure.",
    category: "Formation",
    priceFrom: 49,
    priceUnit: "€/session",
    icon: "GraduationCap",
    gradient: "from-orange-500 to-amber-600",
    features: [
      "Masterclasses en ligne (1.5-2h)",
      "Replay illimité et support PDF",
      "Bootcamps 4 semaines (sessions live)",
      "Exercices pratiques et feedback",
      "Formation sur mesure (1 journée)",
      "Certification de completion",
      "Communauté Slack dédiée",
      "Bibliothèque de ressources",
      "Pass annuel pour accès illimité",
    ],
    deliverables: [
      "Certificat de completion",
      "Supports de formation (PDF + slides)",
      "Exercices pratiques corrigés",
      "Accès à la communauté Slack",
    ],
    tiers: [
      {
        name: "Masterclass en ligne",
        price: "49€ HT / session",
        description: "Formation ponctuelle",
        includes: [
          "1 session live (1.5-2h)",
          "Replay illimité",
          "Support PDF + Exercices",
        ],
        duration: "Ponctuel",
        cta: "S'inscrire",
        popular: false,
      },
      {
        name: "Bootcamp 4 semaines",
        price: "299€ HT",
        description: "Formation intensive",
        includes: [
          "4 sessions live (2h)",
          "Exercices hebdomadaires",
          "Feedback personnalisé",
          "Certification + Communauté Slack",
        ],
        duration: "4 semaines",
        cta: "Rejoindre le bootcamp",
        popular: true,
      },
      {
        name: "Pass Annuel",
        price: "490€ HT/an",
        description: "Accès illimité 1 an",
        includes: [
          "Accès à toutes les masterclasses",
          "Bootcamps à tarif réduit (-30%)",
          "Bibliothèque de ressources",
          "Communauté Slack VIP",
        ],
        duration: "1 an",
        cta: "Prendre mon Pass",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Quelles formations proposez-vous ?",
        answer:
          "LinkedIn pro, Google Ads, comptabilité TPE, prospection B2B, trésorerie, contenus qui convertissent, automatisation IA, recrutement, réseaux sociaux, négociation avancée. 10+ modules couvrant toutes les compétences clés du dirigeant.",
      },
      {
        question: "Les formations sont-elles adaptées aux débutants ?",
        answer:
          "Oui, nos formations sont conçues pour des dirigeants non-techniques. Chaque session part des fondamentaux et va progressivement vers des niveaux avancés. Les exercices pratiques permettent une mise en application immédiate.",
      },
    ],
  },
  {
    slug: "juridique-ongoing",
    shortTitle: "Juridique & Conformité",
    title: "Juridique & Conformité Ongoing",
    description:
      "Après la création, le dirigeant est confronté à de nombreuses obligations juridiques sans avoir les compétences ni le budget d'un avocat. Notre service juridique ongoing offre un accès abordable à l'expertise juridique au quotidien.",
    shortDescription:
      "Accompagnement juridique continu : audit, rédaction de contrats, consultation, veille réglementaire et conformité RGPD.",
    category: "Juridique",
    priceFrom: 149,
    priceUnit: "€",
    icon: "Scale",
    gradient: "from-slate-500 to-gray-700",
    features: [
      "Audit juridique de l'entreprise",
      "Rédaction de contrats types (CGV, NDA...)",
      "Consultation juridique régulière",
      "Veille réglementaire sectorielle",
      "Mise à jour des documents",
      "Support email juridique",
      "Accompagnement litige",
      "Révision contrats partenaires",
      "Audit annuel complet",
      "Conformité RGPD",
    ],
    deliverables: [
      "Rapport de conformité juridique",
      "Contrats types rédigés et personnalisés",
      "Plan de mise en conformité RGPD",
      "Bulletin de veille réglementaire mensuel",
    ],
    tiers: [
      {
        name: "Legal Check",
        price: "149€ HT",
        description: "Audit ponctuel",
        includes: [
          "Audit juridique complet",
          "Rapport de conformité",
          "Plan de mise en conformité",
        ],
        duration: "Ponctuel",
        cta: "Commander mon audit",
        popular: false,
      },
      {
        name: "Legal Care",
        price: "490€ HT/mois",
        description: "Suivi mensuel",
        includes: [
          "Legal Check initial",
          "3 documents/mois inclus",
          "Consultation 2h/mois",
          "Veille réglementaire",
          "Support email juridique",
        ],
        duration: "3 mois min.",
        cta: "Démarrer Legal Care",
        popular: true,
      },
      {
        name: "Legal Premium",
        price: "990€ HT/mois",
        description: "Protection complète",
        includes: [
          "Tout Legal Care",
          "Documents illimités",
          "Consultation 4h/mois",
          "Accompagnement litige",
          "Révision contrats partenaires",
          "Audit annuel complet",
        ],
        duration: "6 mois min.",
        cta: "Démarrer Premium",
        popular: false,
      },
    ],
    faq: [
      {
        question: "Êtes-vous avocats ?",
        answer:
          "Nous ne sommes pas un cabinet d'avocats mais un service de conseil juridique pour TPE/PME. Pour les litiges complexes ou les procédures contentieuses, nous coordonnons avec notre réseau d'avocats partenaires. C'est plus rapide et plus économique qu'un cabinet traditionnel.",
      },
      {
        question: "Quels types de contrats pouvez-vous rédiger ?",
        answer:
          "CGV, devis, bail commercial, NDA, contrat de prestation, cession de droits, contrat de travail, conditions générales d'utilisation, politiques de confidentialité... Virtuellement tout type de contrat dont une TPE/PME peut avoir besoin.",
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json({ services });
}
