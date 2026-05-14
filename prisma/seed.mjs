import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ─── TOOL DATA ────────────────────────────────────────────────────

const tools = [
  // ── BANKS ──
  {
    name: "Qonto",
    slug: "qonto",
    tagline: "La néobanque pour les entreprises",
    description:
      "Qonto est une banque en ligne spécialement conçue pour les TPE, PME, freelances et associations. Elle offre un compte pro avec IBAN français, carte visa, outils de gestion de trésorerie et facturation intégrée. Interface intuitive et ouverture en quelques minutes.",
    category: "bank",
    pricing: "freemium",
    rating: 4.6,
    pros: "Ouverture rapide en ligne\nCarte Visa incluse\nExcellent outil de gestion de trésorerie",
    cons: "Frais bancaires parfois élevés\nPas de crédit professionnel",
    features: "Compte pro avec IBAN français\nCarte Visa physique et virtuelle\nFacturation et notes de frais intégrées\nGestion multi-utilisateurs",
    affiliateUrl: "https://example.com/aff/qonto",
    website: "https://www.qonto.com",
    commission: 25,
    order: 1,
  },
  {
    name: "Shine",
    slug: "shine",
    tagline: "Le compte pro pour les indépendants",
    description:
      "Shine, filiale de Société Générale, propose un compte professionnel 100% mobile pour les auto-entrepreneurs, freelances et TPE. Application mobile fluide, virements instantanés et catégories de dépenses automatiques.",
    category: "bank",
    pricing: "freemium",
    rating: 4.3,
    pros: "Application mobile excellente\nZéro frais sur les virements SEPA\nFiliale d'un grand groupe bancaire",
    cons: "Fonctionnalités limitées pour les PME\nPas de découvert autorisé",
    features: "Compte pro mobile\nCarte Mastercard\nCatégorisation automatique des dépenses\nExport comptable",
    affiliateUrl: "https://example.com/aff/shine",
    website: "https://www.shine.fr",
    commission: 20,
    order: 2,
  },
  {
    name: "Pennylane",
    slug: "pennylane-bank",
    tagline: "Banque et comptabilité unifiées",
    description:
      "Pennylane fusionne banque pro et logiciel de comptabilité en une seule plateforme. Idéal pour les dirigeants de TPE/PME qui veulent une vision claire de leur trésorerie et automatiser leur compta au quotidien.",
    category: "bank",
    pricing: "payant",
    rating: 4.5,
    pros: "Banque et compta en une seule plateforme\nSynchronisation en temps réel\nCollaboration avec l'expert-comptable",
    cons: "Tarifs plus élevés que la moyenne\nAdapté principalement aux TPE/PME",
    features: "Compte bancaire pro\nLogiciel de comptabilité intégré\nSynchronisation bancaire en temps réel\nCollaboration expert-comptable",
    affiliateUrl: "https://example.com/aff/pennylane-bank",
    website: "https://www.pennylane.com",
    commission: 30,
    order: 3,
  },
  {
    name: "Indy",
    slug: "indy",
    tagline: "L'expert-comptable automatisé",
    description:
      "Indy automatise la comptabilité des indépendants et TPE. Connexion bancaire, catégorisation intelligente des opérations, déclarations fiscales automatiques et tableau de bord de trésorerie en temps réel.",
    category: "bank",
    pricing: "freemium",
    rating: 4.4,
    pros: "Automatisation poussée de la compta\nInterface très intuitive\nExcellent rapport qualité/prix",
    cons: "Uniquement pour auto-entrepreneurs et micro-entreprises\nFonctionnalités bancaires limitées",
    features: "Comptabilité automatisée\nConnexion bancaire\nDéclarations fiscales auto\nTableau de bord trésorerie",
    affiliateUrl: "https://example.com/aff/indy",
    website: "https://www.indy.fr",
    commission: 20,
    order: 4,
  },
  {
    name: "N26 Business",
    slug: "n26-business",
    tagline: "La banque mobile internationale",
    description:
      "N26 Business offre un compte pro avec IBAN allemand, parfait pour les entrepreneurs internationaux ou les digital nomads. Application mobile moderne, retraits gratuits dans le monde entier et sous-comptes illimités.",
    category: "bank",
    pricing: "freemium",
    rating: 4.2,
    pros: "Idéal pour les entrepreneurs internationaux\nRetraits gratuits à l'étranger\nSous-comptes illimités (Spaces)",
    cons: "IBAN allemand (pas français)\nService client parfois lent\nLimité en fonctionnalités pro avancées",
    features: "Compte pro avec IBAN\nCarte Mastercard\nSous-comptes Spaces\nRetraits gratuits worldwide",
    affiliateUrl: "https://example.com/aff/n26-business",
    website: "https://n26.com/fr/business",
    commission: 15,
    order: 5,
  },
  {
    name: "Blank",
    slug: "blank",
    tagline: "Le compte pro nouvelle génération",
    description:
      "Blank propose un compte professionnel avec CB gratuite, Mastercard, virements instantanés et une interface soignée. Pensé pour les freelances et petites équipes qui veulent de la simplicité.",
    category: "bank",
    pricing: "freemium",
    rating: 4.1,
    pros: "CB offerte sans conditions\nInterface épurée et moderne\nVirements instantanés",
    cons: "Fonctionnalités encore limitées\nNouveau sur le marché\nPas de crédit disponible",
    features: "Compte pro\nCarte Mastercard gratuite\nVirements instantanés\nGestion d'équipe",
    affiliateUrl: "https://example.com/aff/blank",
    website: "https://www.blank.co",
    commission: 15,
    order: 6,
  },
  {
    name: "Banque Populaire",
    slug: "banque-populaire",
    tagline: "L'établissement bancaire de proximité",
    description:
      "La Banque Populaire offre une gamme complète de services bancaires pour professionnels : compte pro, financement, assurance, épargne. Avec un réseau d'agences physiques pour un accompagnement personnalisé.",
    category: "bank",
    pricing: "payant",
    rating: 3.8,
    pros: "Réseau d'agences physiques\nGamme complète de services\nAccompagnement personnalisé",
    cons: "Frais bancaires élevés\nProcessus d'ouverture plus long\nInterface digitale en retrait",
    features: "Compte pro classique\nCrédit professionnel\nÉpargne et placements\nConseiller dédié en agence",
    affiliateUrl: "https://example.com/aff/banque-populaire",
    website: "https://www.banquepopulaire.fr",
    commission: 35,
    order: 7,
  },
  {
    name: "Hello bank!",
    slug: "hello-bank",
    tagline: "La banque en ligne de BNP Paribas",
    description:
      "Hello bank! est la néobanque de BNP Paribas proposant des offres pro pour les entrepreneurs et TPE. Avantages du groupe BNP avec la fluidité d'une app mobile.",
    category: "bank",
    pricing: "freemium",
    rating: 3.9,
    pros: "Adossé à BNP Paribas\nOffre adaptée aux TPE\nApplication mobile performante",
    cons: "Offre pro moins complète\nFrais parfois opaques\nService client en ligne uniquement",
    features: "Compte pro en ligne\nApplication mobile\nCB Visa\nVirements et prélèvements",
    affiliateUrl: "https://example.com/aff/hello-bank",
    website: "https://www.hello-bank.fr",
    commission: 20,
    order: 8,
  },

  // ── COMPTA ──
  {
    name: "Freebe",
    slug: "freebe",
    tagline: "La compta gratuite pour auto-entrepreneurs",
    description:
      "Freebe automatise la comptabilité et la facturation des auto-entrepreneurs gratuitement. Connexion bancaire, factures en un clic, URSSAF calculé automatiquement et export pour l'expert-comptable.",
    category: "compta",
    pricing: "gratuit",
    rating: 4.5,
    pros: "100% gratuit pour les auto-entrepreneurs\nFacturation simple et rapide\nCalcul automatique de l'URSSAF",
    cons: "Uniquement pour auto-entrepreneurs\nFonctionnalités avancées limitées\nPas de gestion de TVA",
    features: "Facturation en ligne\nConnexion bancaire\nCalcul URSSAF automatique\nExport comptable",
    affiliateUrl: "https://example.com/aff/freebe",
    website: "https://www.freebe.fr",
    commission: 15,
    order: 1,
  },
  {
    name: "Tiime",
    slug: "tiime",
    tagline: "La compta collaborative",
    description:
      "Tiime est une solution de comptabilité collaborative qui connecte dirigeants, experts-comptables et équipes. Facturation, notes de frais, documents et trésorerie au même endroit.",
    category: "compta",
    pricing: "payant",
    rating: 4.3,
    pros: "Collaboration comptable fluide\nNotes de frais intégrées\nIntégration avec de nombreux outils",
    cons: "Tarifs élevés pour les solos\nNécessite un expert-comptable partenaire\nCourbe d'apprentissage",
    features: "Facturation et relances\nNotes de frais\nGestion documentaire\nTableau de bord trésorerie",
    affiliateUrl: "https://example.com/aff/tiime",
    website: "https://www.tiime.fr",
    commission: 25,
    order: 2,
  },
  {
    name: "Abby",
    slug: "abby",
    tagline: "Votre assistant comptable intelligent",
    description:
      "Abby automatise les tâches comptables grâce à l'intelligence artificielle. OCR pour les factures, catégorisation automatique, pré-remplissage des déclarations et assistance IA pour les questions comptables.",
    category: "compta",
    pricing: "freemium",
    rating: 4.2,
    pros: "IA puissante pour l'automatisation\nInterface moderne\nBon rapport qualité/prix",
    cons: "Encore en développement\nCertaines fonctionnalités basiques manquantes\nBase de connaissances limitée",
    features: "OCR intelligent\nCatégorisation auto IA\nPré-remplissage déclarations\nChat IA comptable",
    affiliateUrl: "https://example.com/aff/abby",
    website: "https://www.abby.fr",
    commission: 20,
    order: 3,
  },
  {
    name: "Dougs",
    slug: "dougs",
    tagline: "L'expert-comptable en ligne",
    description:
      "Dougs est un cabinet d'expertise comptable en ligne avec un outil digital propriétaire. Un expert-comptable dédié, une application intuitive et des prix fixes et transparents. Pour les freelances et TPE jusqu'à 5M€ de CA.",
    category: "compta",
    pricing: "payant",
    rating: 4.4,
    pros: "Expert-comptable dédié\nPrix fixes transparents\nOutil digital performant",
    cons: "Prix plus élevé qu'un logiciel seul\nPas adapté aux grandes structures\nEngagement annuel",
    features: "Expert-comptable dédié\nApplication de compta\nFacturation et trésorerie\nBilan et comptes annuels",
    affiliateUrl: "https://example.com/aff/dougs",
    commission: 30,
    order: 4,
  },
  {
    name: "Shinova",
    slug: "shinova",
    tagline: "La compta en mode lean",
    description:
      "Shinova propose une approche minimaliste de la comptabilité en ligne. Interface épurée, prix simple, et accompagnement personnalisé par des experts-comptables partenaires.",
    category: "compta",
    pricing: "payant",
    rating: 4.0,
    pros: "Interface simple et épurée\nPrix abordables\nAccompagnement personnalisé",
    cons: "Moins de fonctionnalités que la concurrence\nMarché plus restreint\nIntégrations limitées",
    features: "Facturation simplifiée\nSuivi de trésorerie\nDéclarations fiscales\nAccès expert-comptable",
    affiliateUrl: "https://example.com/aff/shinova",
    website: "https://www.shinova.fr",
    commission: 20,
    order: 5,
  },

  // ── ASSURANCE ──
  {
    name: "Hiscox",
    slug: "hiscox",
    tagline: "L'assurance pro pour les créateurs d'entreprise",
    description:
      "Hiscox est un assureur spécialisé dans les risques professionnels. RC Pro, décennale, cyber-assurance et protection juridique pour les freelances, TPE et professions libérales. Devis en ligne en 5 minutes.",
    category: "assurance",
    pricing: "payant",
    rating: 4.5,
    pros: "Spécialiste de l'assurance pro\nDevis rapide en ligne\nCouverture sur mesure",
    cons: "Tarifs parfois élevés\nPas de mutuelle santé\nInterface de gestion limitée",
    features: "RC Pro professionnelle\nAssurance décennale\nCyber-assurance\nProtection juridique",
    affiliateUrl: "https://example.com/aff/hiscox",
    website: "https://www.hiscox.fr",
    commission: 30,
    order: 1,
  },
  {
    name: "Simplit",
    slug: "simplit",
    tagline: "L'assurance simple et transparente",
    description:
      "Simplit propose des assurances professionnelles simples à comprendre et à souscrire. RC Pro, mutuelle TNS et prévoyance avec des prix compétitifs et un processus 100% en ligne.",
    category: "assurance",
    pricing: "payant",
    rating: 4.1,
    pros: "Prix compétitifs\nProcessus 100% en ligne\nTransparence tarifaire",
    cons: "Offre moins complète\nPas de décennale\nService client en ligne",
    features: "RC Pro\nMutuelle TNS\nPrévoyance\nGestion en ligne des contrats",
    affiliateUrl: "https://example.com/aff/simplit",
    website: "https://www.simplit.fr",
    commission: 20,
    order: 2,
  },
  {
    name: "Alan",
    slug: "alan",
    tagline: "La mutuelle santé pour les entreprises",
    description:
      "Alan réinvente la mutuelle d'entreprise avec une expérience 100% digitale. Offres pour TNS et entreprises, interface claire, sans surprise et avec un engagement de remboursement sous 48h.",
    category: "assurance",
    pricing: "payant",
    rating: 4.6,
    pros: "Interface 100% digitale\nRemboursement rapide (48h)\nTransparence totale",
    cons: "Spécialisé mutuelle santé uniquement\nOffres limitées pour les TNS solo\nPas d'assurance pro",
    features: "Mutuelle TNS\nMutuelle d'entreprise\nRemboursement rapide\nGestion 100% en ligne",
    affiliateUrl: "https://example.com/aff/alan",
    website: "https://www.alan.com",
    commission: 25,
    order: 3,
  },
  {
    name: "Abeille Assurances",
    slug: "abeille-assurances",
    tagline: "L'assurance pro de confiance",
    description:
      "Abeille Assurances propose une gamme complète d'assurances professionnelles via un réseau de courtiers. RC Pro, multirisque, flotte automobile et garanties décennales pour tous les secteurs.",
    category: "assurance",
    pricing: "payant",
    rating: 3.8,
    pros: "Large gamme de produits\nCourtier dédié\nAdapté à tous les secteurs",
    cons: "Processus moins digital\nPas de devis instantané\nInterface en ligne basique",
    features: "RC Pro\nMultirisque pro\nAssurance flotte\nGarantie décennale",
    affiliateUrl: "https://example.com/aff/abeille-assurances",
    website: "https://www.abeille-assurances.fr",
    commission: 25,
    order: 4,
  },
  {
    name: "Square Habitat",
    slug: "square-habitat",
    tagline: "L'assurance pour votre local pro",
    description:
      "Square Habitat assure les locaux professionnels, les murs commerciaux et les flottes automobiles. Spécialisé dans l'immobilier pro avec des garanties adaptées aux commerçants et artisans.",
    category: "assurance",
    pricing: "payant",
    rating: 3.7,
    pros: "Spécialiste immobilier pro\nGaranties solides\nProximité locale",
    cons: "Gamme limitée à l'immobilier\nPas de RC Pro\nService client variable",
    features: "Assurance local pro\nAssurance murs commerciaux\nFlotte automobile\nResponsabilité civile exploitation",
    affiliateUrl: "https://example.com/aff/square-habitat",
    website: "https://www.square-habitat.fr",
    commission: 20,
    order: 5,
  },

  // ── LEGAL ──
  {
    name: "Legalstart",
    slug: "legalstart",
    tagline: "Créez votre entreprise en ligne",
    description:
      "Legalstart est la plateforme leader de création d'entreprise en ligne. SASU, SARL, EURL, micro-entreprise : tous les statuts sont disponibles avec un accompagnement juridique complet et des tarifs transparents.",
    category: "legal",
    pricing: "payant",
    rating: 4.5,
    pros: "Plateforme leader du marché\nAccompagnement juridique complet\nPrix transparents dès le départ",
    cons: "Services payants uniquement\nPas de conseils personnalisés avancés\nCertains add-ons onéreux",
    features: "Création d'entreprise en ligne\nStatuts juridiques tous types\nMarque et propriété intellectuelle\nSuivi juridique continu",
    affiliateUrl: "https://example.com/aff/legalstart",
    website: "https://www.legalstart.fr",
    commission: 30,
    order: 1,
  },
  {
    name: "Captain Contrat",
    slug: "captain-contrat",
    tagline: "Vos contrats juridiques en toute simplicité",
    description:
      "Captain Contrat génère des contrats juridiques sur mesure en quelques minutes. Modèles rédigés par des avocats, personnalisables et conformes au droit français. Idéal pour les freelances et TPE.",
    category: "legal",
    pricing: "freemium",
    rating: 4.3,
    pros: "Contrats rédigés par des avocats\nPersonnalisation facile\nPrix abordables",
    cons: "Pas de création d'entreprise\nPas de suivi juridique\nLimité aux documents standards",
    features: "Générateur de contrats\nModèles avocats\nCGV et mentions légales\nContrats de travail",
    affiliateUrl: "https://example.com/aff/captain-contrat",
    website: "https://www.captaincontrat.com",
    commission: 20,
    order: 2,
  },
  {
    name: "LegalPlace",
    slug: "legalplace",
    tagline: "Le guichet unique juridique en ligne",
    description:
      "LegalPlace propose un accompagnement juridique complet en ligne : création d'entreprise, formalités, marques, propriété intellectuelle et contrats. Un interlocuteur unique pour tous vos besoins juridiques.",
    category: "legal",
    pricing: "payant",
    rating: 4.1,
    pros: "Guichet unique juridique\nAccompagnement complet\nEquipe d'avocats disponible",
    cons: "Prix parfois élevés\nDélais variables\nInterface moins moderne",
    features: "Création d'entreprise\nDépôt de marque\nContrats sur mesure\nFormalités juridiques",
    affiliateUrl: "https://example.com/aff/legalplace",
    website: "https://www.legalplace.fr",
    commission: 25,
    order: 3,
  },

  // ── MARKETING ──
  {
    name: "Brevo",
    slug: "brevo",
    tagline: "L'outil marketing tout-en-un",
    description:
      "Brevo (ex-Sendinblue) est une plateforme marketing complète : email marketing, SMS, chat, CRM et automatisation. Idéale pour les PME qui veulent centraliser leur communication et automatiser leurs campagnes.",
    category: "marketing",
    pricing: "freemium",
    rating: 4.4,
    pros: "Outil tout-en-un très complet\nOffre gratuite généreuse\nAutomatisation puissante",
    cons: "Interface complexe au début\nTarifs augmentent vite\nSupport client parfois lent",
    features: "Email marketing\nSMS marketing\nChat en direct\nAutomatisation et CRM",
    affiliateUrl: "https://example.com/aff/brevo",
    website: "https://www.brevo.com",
    commission: 25,
    order: 1,
  },
  {
    name: "HubSpot",
    slug: "hubspot",
    tagline: "La plateforme de croissance inbound",
    description:
      "HubSpot est la plateforme inbound marketing de référence. Marketing, vente, service client et CRM intégrés. Formations gratuites, communauté active et outils puissants pour la croissance.",
    category: "marketing",
    pricing: "freemium",
    rating: 4.7,
    pros: "Plateforme la plus complète\nCRM gratuit généreux\nExcellente formation (HubSpot Academy)",
    cons: "Très cher en version payante\nComplexe à configurer\nOverkill pour les solos",
    features: "Marketing automation\nCRM intégré\nLanding pages\nAnalytics avancés",
    affiliateUrl: "https://example.com/aff/hubspot",
    website: "https://www.hubspot.fr",
    commission: 35,
    order: 2,
  },
  {
    name: "Mailchimp",
    slug: "mailchimp",
    tagline: "Le roi de l'email marketing",
    description:
      "Mailchimp est l'outil d'email marketing le plus populaire au monde. Création de campagnes, templates, segmentation, A/B testing et analytics. Interface intuitive pour les débutants.",
    category: "marketing",
    pricing: "freemium",
    rating: 4.3,
    pros: "Leader du marché\nInterface intuitive\nNombreuses intégrations",
    cons: "Offre gratuite limitée (500 contacts)\nTarifs augmentent vite\nMoins de fonctionnalités CRM",
    features: "Email marketing\nTemplates de campagnes\nSegmentation audience\nA/B testing",
    affiliateUrl: "https://example.com/aff/mailchimp",
    website: "https://mailchimp.com",
    commission: 20,
    order: 3,
  },
  {
    name: "Sendinblue",
    slug: "sendinblue",
    tagline: "Email, SMS et marketing automation",
    description:
      "Sendinblue (aujourd'hui Brevo) propose l'email marketing, le SMS, le marketing automation et la gestion de contacts. Avec une API puissante et des tarifs basés sur les emails envoyés.",
    category: "marketing",
    pricing: "freemium",
    rating: 4.2,
    pros: "Tarifs basés sur les envois\nSMS inclus\nBonne API",
    cons: "Marque en transition vers Brevo\nDesign d'emails limité\nFonctionnalités CRM basiques",
    features: "Email et SMS\nMarketing automation\nGestion de contacts\nTransactional emails",
    affiliateUrl: "https://example.com/aff/sendinblue",
    website: "https://www.sendinblue.com",
    commission: 20,
    order: 4,
  },

  // ── CRM ──
  {
    name: "Pipedrive",
    slug: "pipedrive",
    tagline: "Le CRM simple et efficace",
    description:
      "Pipedrive est un CRM axé sur la gestion du pipeline commercial. Interface visuelle intuitive, automatisation des ventes et reporting puissant. Parfait pour les équipes de vente de 1 à 50 personnes.",
    category: "crm",
    pricing: "payant",
    rating: 4.5,
    pros: "CRM le plus intuitif\nPipeline visuel excellent\nAutomatisation efficace",
    cons: "Pas de marketing automation\nPrix élevé pour les petites équipes\nPas de service client intégré",
    features: "Pipeline commercial visuel\nAutomatisation des ventes\nReporting avancé\nIntégrations nombreuses",
    affiliateUrl: "https://example.com/aff/pipedrive",
    website: "https://www.pipedrive.com",
    commission: 30,
    order: 1,
  },
  {
    name: "Freshsales",
    slug: "freshsales",
    tagline: "Le CRM avec IA intégrée",
    description:
      "Freshsales de Freshworks est un CRM moderne avec intelligence artificielle intégrée pour le scoring de leads, les prédictions de conversion et l'automatisation des tâches. Téléphonie intégrée.",
    category: "crm",
    pricing: "freemium",
    rating: 4.3,
    pros: "IA intégrée pour le scoring\nTéléphonie incluse\nInterface moderne",
    cons: "Fonctionnalités avancées en version payante\nCustomisation limitée\nSupport parfois lent",
    features: "CRM avec IA\nTéléphonie intégrée\nScoring de leads\nAutomatisation",
    affiliateUrl: "https://example.com/aff/freshsales",
    website: "https://www.freshworks.com/fr/crm",
    commission: 25,
    order: 2,
  },
];

// ─── TASK DATA ────────────────────────────────────────────────────

const tasks = [
  // Phase: Reflexion
  {
    phase: "reflexion",
    title: "Définir mon idée de business",
    description:
      "Identifiez votre projet entrepreneurial : problème résolu, client cible, proposition de valeur unique. Utilisez le canvas business model pour structurer votre réflexion.",
    order: 1,
  },
  {
    phase: "reflexion",
    title: "Étudier mon marché cible",
    description:
      "Analysez votre marché : taille, tendances, concurrents, clients potentiels. Réalisez une étude de marché qualitative et quantitative.",
    order: 2,
  },
  {
    phase: "reflexion",
    title: "Calculer mon budget prévisionnel",
    description:
      "Estimez vos besoins financiers : investissement initial, charges fixes, charges variables, point mort. Préparez un plan de financement réaliste.",
    order: 3,
  },
  {
    phase: "reflexion",
    title: "Valider ma demande",
    description:
      "Vérifiez la viabilité de votre projet : tests auprès de clients potentiels, pré-ventes, sondages. Validez la demande avant d'investir.",
    order: 4,
  },
  {
    phase: "reflexion",
    title: "Choisir mon statut juridique",
    description:
      "Comparez les statuts juridiques : auto-entrepreneur, EURL, SARL, SASU. Sélectionnez celui qui correspond le mieux à votre activité et votre situation personnelle.",
    order: 5,
  },

  // Phase: Creation
  {
    phase: "creation",
    title: "Immatriculer mon entreprise",
    description:
      "Procédez à la création officielle de votre entreprise : rédaction des statuts, dépôt du capital, publication d'annonce légale, immatriculation sur le Guichet Unique.",
    order: 1,
  },
  {
    phase: "creation",
    title: "Ouvrir un compte bancaire pro",
    description:
      "Choisissez une banque professionnelle adaptée à vos besoins et ouvrez votre compte dédié. Comparez les néobanques et banques traditionnelles.",
    order: 2,
  },
  {
    phase: "creation",
    title: "Souscrire une assurance RC Pro",
    description:
      "Protégez votre activité avec une Responsabilité Civile Professionnelle adaptée à votre métier. Comparez les offres et souscrivez en ligne.",
    order: 3,
  },
  {
    phase: "creation",
    title: "Choisir mon logiciel de compta",
    description:
      "Sélectionnez un outil de comptabilité adapté à votre statut : logiciel en ligne, expert-comptable digital ou solution complète de gestion.",
    order: 4,
  },
  {
    phase: "creation",
    title: "Créer mon identité visuelle",
    description:
      "Développez votre brand : logo, charte graphique, site web, réseaux sociaux. Soyez cohérent et professionnel dès le premier contact.",
    order: 5,
  },

  // Phase: Gestion
  {
    phase: "gestion",
    title: "Configurer ma facturation",
    description:
      "Mettez en place votre processus de facturation : modèle, conditions de paiement, relances automatiques. Assurez-vous d'être conforme aux obligations légales.",
    order: 1,
  },
  {
    phase: "gestion",
    title: "Mettre en place ma compta auto",
    description:
      "Automatisez votre comptabilité : connexion bancaire, catégorisation des flux, rapprochements. Gagnez du temps et évitez les erreurs.",
    order: 2,
  },
  {
    phase: "gestion",
    title: "Suivre mes charges et revenus",
    description:
      "Créez un tableau de bord financier : suivi mensuel du CA, des charges, de la trésorerie et de la rentabilité. Anticipez les variations de cash-flow.",
    order: 3,
  },
  {
    phase: "gestion",
    title: "Préparer ma première déclaration",
    description:
      "Préparez vos premières déclarations fiscales : TVA, IS ou IR, CFE. Respectez les échéances et optimisez votre fiscalité.",
    order: 4,
  },
  {
    phase: "gestion",
    title: "Optimiser ma trésorerie",
    description:
      "Mettez en place des bonnes pratiques de gestion de trésorerie : relances de factures, négociation des délais de paiement, mise en réserve.",
    order: 5,
  },

  // Phase: Croissance
  {
    phase: "croissance",
    title: "Mettre en place un CRM",
    description:
      "Adoptez un CRM pour gérer vos prospects et clients : pipeline commercial, suivi des interactions, automatisation du suivi. Boostez votre taux de conversion.",
    order: 1,
  },
  {
    phase: "croissance",
    title: "Lancer ma première campagne marketing",
    description:
      "Créez et envoyez votre première campagne d'email marketing. Segmentez votre audience, rédigez un contenu engageant et analysez les résultats.",
    order: 2,
  },
  {
    phase: "croissance",
    title: "Recruter mon premier collaborateur",
    description:
      "Préparez le recrutement : fiche de poste, processus de sélection, contrat de travail. Accueillez et intégrez votre premier collaborateur efficacement.",
    order: 3,
  },
  {
    phase: "croissance",
    title: "Diversifier mes revenus",
    description:
      "Explorez de nouvelles sources de revenus : produits complémentaires, services premium, partenariats, formations. Ne dépendez pas d'un seul client.",
    order: 4,
  },
  {
    phase: "croissance",
    title: "Passer à l'accompagnement pro",
    description:
      "Engagez des professionnels pour structurer votre croissance : comptable, avocat, coach business, consultant. Investissez dans l'expertise.",
    order: 5,
  },
];

// ─── LEAD DATA ────────────────────────────────────────────────────

const leads = [
  {
    email: "marie.dupont@gmail.com",
    firstName: "Marie",
    lastName: "Dupont",
    phone: "+33612345678",
    profile: "salarie",
    phase: "reflexion",
    painPoint: "Je ne sais pas quel statut juridique choisir",
    projectName: "Consulting en développement durable",
    status: "new",
    source: "audit-form",
  },
  {
    email: "lucas.martin@yahoo.fr",
    firstName: "Lucas",
    lastName: "Martin",
    phone: "+33698765432",
    profile: "etudiant",
    phase: "reflexion",
    painPoint: "Je manque de fonds pour démarrer",
    projectName: "Application de livraison éco-responsable",
    status: "new",
    source: "audit-form",
  },
  {
    email: "sophie.bernard@hotmail.com",
    firstName: "Sophie",
    lastName: "Bernard",
    phone: "+33611223344",
    profile: "freelance",
    phase: "creation",
    painPoint: "La compta me fait perdre trop de temps",
    projectName: "Graphiste freelance",
    status: "contacted",
    source: "audit-form",
  },
  {
    email: "thomas.moreau@outlook.com",
    firstName: "Thomas",
    lastName: "Moreau",
    phone: "+33655667788",
    profile: "tpe-pme",
    phase: "gestion",
    painPoint: "J'ai besoin d'un meilleur suivi de ma trésorerie",
    projectName: "Boulangerie artisanale Le Fournil",
    status: "converted",
    source: "referral",
  },
  {
    email: "emma.leclerc@gmail.com",
    firstName: "Emma",
    lastName: "Leclerc",
    phone: null,
    profile: "salarie",
    phase: "reflexion",
    painPoint: "Je ne sais pas si mon idée est viable",
    projectName: "Coaching sportif en ligne",
    status: "new",
    source: "organic",
  },
  {
    email: "alexandre.petit@gmail.com",
    firstName: "Alexandre",
    lastName: "Petit",
    phone: "+33633445566",
    profile: "freelance",
    phase: "croissance",
    painPoint: "J'ai du mal à trouver de nouveaux clients",
    projectName: "Développeur web freelance",
    status: "contacted",
    source: "audit-form",
  },
  {
    email: "camille.robert@yahoo.fr",
    firstName: "Camille",
    lastName: "Robert",
    phone: "+33677889900",
    profile: "etudiant",
    phase: "creation",
    painPoint: "Je ne sais pas comment créer ma société",
    projectName: "E-commerce de produits locaux",
    status: "new",
    source: "audit-form",
  },
  {
    email: "nicolas.simon@gmail.com",
    firstName: "Nicolas",
    lastName: "Simon",
    phone: "+33699887766",
    profile: "tpe-pme",
    phase: "gestion",
    painPoint: "Mes charges sont trop élevées",
    projectName: "Auto-école Simon",
    status: "contacted",
    source: "referral",
  },
  {
    email: "julie.fournier@hotmail.com",
    firstName: "Julie",
    lastName: "Fournier",
    phone: null,
    profile: "salarie",
    phase: "reflexion",
    painPoint: "J'ai peur de quitter mon CDI",
    projectName: "Conseil en image et personal branding",
    status: "new",
    source: "organic",
  },
  {
    email: "pierre.garnier@gmail.com",
    firstName: "Pierre",
    lastName: "Garnier",
    phone: "+33644332211",
    profile: "freelance",
    phase: "croissance",
    painPoint: "Je voudrais recruter mais je ne sais pas comment",
    projectName: "Agence de communication digitale",
    status: "converted",
    source: "audit-form",
  },
];

// ─── POST DATA ────────────────────────────────────────────────────

const posts = [
  {
    title: "Comment choisir sa néobanque professionnelle en 2024",
    slug: "comment-choisir-neobanque-pro",
    excerpt:
      "Découvrez notre comparatif complet des néobanques professionnelles : Qonto, Shine, Pennylane, N26 Business... Lequel est fait pour vous ?",
    content: `## Pourquoi choisir une néobanque pro ?

En 2024, les néobanques professionnelles ont révolutionné la gestion financière des entrepreneurs et TPE/PME. Plus rapides, plus flexibles et souvent moins chères que les banques traditionnelles, elles offrent des fonctionnalités pensées pour les créateurs d'entreprise.

## Les critères de sélection

### 1. Les frais bancaires
Comparez les frais mensuels, les coûts des virements et les commissions sur les paiements par carte. Certaines néobanques offrent une offre gratuite limitée.

### 2. Les fonctionnalités
- Compte avec IBAN français ou européen
- Carte physique et virtuelle
- Outils de facturation intégrés
- Gestion multi-utilisateurs
- API et intégrations

### 3. Le support client
Vérifiez la disponibilité du support : chat en direct, email, téléphone. Un bon support peut faire toute la différence en cas de problème.

## Notre top 3

1. **Qonto** - Le meilleur rapport qualité/prix pour les TPE
2. **Pennylane** - Idéal si vous cherchez banque + compta
3. **Shine** - Parfait pour les auto-entrepreneurs

## Conclusion

Le choix de votre néobanque dépend de vos besoins spécifiques. Prenez le temps de comparer et n'hésitez pas à tester l'offre gratuite de chaque établissement.`,
    category: "banque",
    tags: "néobanque, qonto, shine, pennylane, comparatif",
    published: true,
  },
  {
    title: "SASU ou EURL : quel statut choisir pour lancer votre activité ?",
    slug: "sasu-ou-eurl-quel-statut-choisir",
    excerpt:
      "SASU ou EURL ? Découvrez les avantages et inconvénients de chaque statut juridique pour faire le meilleur choix pour votre projet entrepreneurial.",
    content: `## SASU ou EURL : le dilemme de tout créateur d'entreprise

Le choix entre SASU (Société par Actions Simplifiée à Actionnaire Unique) et EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est l'une des décisions les plus importantes lors de la création de votre entreprise.

## La SASU

### Avantages
- Souplesse statutaire : liberté dans la rédaction des statuts
- Rémunération du dirigeant assimilée salarié (chômage possible)
- Pas de cotisations sociales minimales
- Possibilité d'apports en industrie

### Inconvénients
- Charges sociales plus élevées (environ 82% du brut)
- Pas de déduction des charges sociales au résultat
- Formalités de dissolution plus complexes

## L'EURL

### Avantages
- Charges sociales plus faibles que la SASU
- Déduction des charges sociales au résultat
- Régime fiscal avantageux en début d'activité
- Procédure de transformation simplifiée

### Inconvénients
- Pas d'éligibilité au chômage pour le gérant
- Cotisations sociales minimales même sans revenus
- Moins de souplesse dans les statuts

## Notre recommandation

Choisissez la **SASU** si :
- Vous souhaitez cotiser pour le chômage
- Vous prévoyez des revenus élevés dès le début
- Vous envisagez des associés futurs

Choisissez l'**EURL** si :
- Vous lancez une activité avec peu de revenus au début
- Vous voulez minimiser vos charges sociales
- La souplesse statutaire n'est pas prioritaire`,
    category: "creation",
    tags: "sasu, eurl, statut juridique, création, entreprise",
    published: true,
  },
  {
    title: "Les 5 erreurs comptables qui coûtent cher aux auto-entrepreneurs",
    slug: "5-erreurs-comptables-auto-entrepreneurs",
    excerpt:
      "Découvrez les erreurs comptables les plus fréquentes chez les auto-entrepreneurs et comment les éviter pour optimiser votre fiscalité.",
    content: `## Les 5 erreurs comptables à éviter

### 1. Ne pas séparer le compte personnel et professionnel
Même en auto-entreprise, il est crucial d'avoir un compte dédié. Cela facilite la comptabilité et vous protège en cas de contrôle fiscal.

### 2. Oublier de déclarer le chiffre d'affaires à temps
Les retards de déclaration entraînent des pénalités de 10% par mois de retard. Mettez en place des rappels.

### 3. Ne pas anticiper les charges URSSAF
Prévoyez une réserve pour vos cotisations sociales. En moyenne, comptez 21 à 22% de votre CA.

### 4. Méconnaître les avantages fiscaux
L'abattement forfaitaire pour frais professionnels peut être plus intéressant que le régime réel. Calculez les deux options.

### 5. Ne pas conserver les justificatifs
Gardez tous vos justificatifs pendant 10 ans. Utilisez un outil de gestion des notes de frais pour ne rien perdre.

## Conclusion

La comptabilité n'a pas besoin d'être compliquée. Avec les bons outils et de bonnes habitudes, vous pouvez éviter ces erreurs et vous concentrer sur votre activité.`,
    category: "comptabilite",
    tags: "comptabilité, auto-entrepreneur, urssaf, fiscalité, erreurs",
    published: false,
  },
];

// ─── CAMPAIGN DATA ────────────────────────────────────────────────

const campaigns = [
  {
    name: "Lancement : Guide création d'entreprise 2024",
    subject: "Créez votre entreprise en 7 jours — Le guide complet est là !",
    body: `Bonjour {{firstName}},

Vous rêvez de lancer votre entreprise mais vous ne savez pas par où commencer ?

Nous avons préparé un guide complet qui vous accompagne étape par étape dans la création de votre entreprise :

1. Définir votre idée de business
2. Choisir le bon statut juridique
3. Ouvrir votre compte bancaire pro
4. Souscrire vos assurances
5. Configurer votre comptabilité

Ce guide est 100% gratuit et réservé à nos abonnés.

Bonne lecture et bon courage dans votre aventure entrepreneuriale !

L'équipe 100 Jours Pour Entreprendre`,
    segment: "all",
    status: "draft",
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
  },
  {
    name: "Offre spéciale néobanques pro",
    subject: "Offres exclusives : jusqu'à 3 mois gratuits sur les néobanques pro",
    body: `Bonjour {{firstName}},

Cherchez-vous la meilleure néobanque pour votre entreprise ?

Nous avons négocié des offres exclusives pour notre communauté :

🏦 **Qonto** — 3 mois offerts sur l'offre Essential
🏦 **Shine** — 2 mois offerts + CB gratuite
🏦 **Pennylane** — Essai gratuit 30 jours

Ces offres sont limitées. Ne les manquez pas !

Pour en profiter, cliquez sur le lien ci-dessous et choisissez la banque qui vous correspond le mieux.

À très vite,
L'équipe 100 Jours Pour Entreprendre`,
    segment: "all",
    status: "sent",
    sentCount: 847,
    openCount: 312,
    clickCount: 89,
    scheduledAt: new Date("2024-01-15T10:00:00.000Z"),
    sentAt: new Date("2024-01-15T10:02:00.000Z"),
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.affiliateClick.deleteMany();
  await db.auditResult.deleteMany();
  await db.userProgress.deleteMany();
  await db.emailCampaign.deleteMany();
  await db.task.deleteMany();
  await db.post.deleteMany();
  await db.tool.deleteMany();
  await db.lead.deleteMany();
  await db.user.deleteMany();

  // 1. Seed Tools
  console.log(`\n📦 Seeding ${tools.length} tools...`);
  for (const tool of tools) {
    await db.tool.create({ data: tool });
  }
  console.log("✅ Tools seeded successfully");

  // 2. Seed Tasks
  console.log(`\n📋 Seeding ${tasks.length} tasks...`);
  for (const task of tasks) {
    await db.task.create({ data: task });
  }
  console.log("✅ Tasks seeded successfully");

  // 3. Seed Leads
  console.log(`\n👤 Seeding ${leads.length} leads...`);
  for (const lead of leads) {
    await db.lead.create({ data: lead });
  }
  console.log("✅ Leads seeded successfully");

  // 4. Seed User (for posts)
  console.log("\n🔑 Seeding admin user...");
  const adminUser = await db.user.create({
    data: {
      email: "admin@100jours.fr",
      name: "Admin 100 Jours",
      role: "admin",
    },
  });
  console.log("✅ Admin user seeded");

  // 5. Seed Posts
  console.log(`\n📝 Seeding ${posts.length} posts...`);
  for (const post of posts) {
    await db.post.create({
      data: {
        ...post,
        authorId: adminUser.id,
      },
    });
  }
  console.log("✅ Posts seeded successfully");

  // 6. Seed Campaigns
  console.log(`\n📧 Seeding ${campaigns.length} campaigns...`);
  for (const campaign of campaigns) {
    await db.emailCampaign.create({ data: campaign });
  }
  console.log("✅ Campaigns seeded successfully");

  // 7. Seed some affiliate clicks for realism
  console.log("\n🖱️ Seeding sample affiliate clicks...");
  const sampleTools = await db.tool.findMany({ take: 5 });
  const sampleLeads = await db.lead.findMany({ take: 3 });

  for (let i = 0; i < 15; i++) {
    await db.affiliateClick.create({
      data: {
        toolId: sampleTools[i % sampleTools.length].id,
        leadId: i < 9 ? sampleLeads[i % sampleLeads.length].id : null,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        referer: i % 3 === 0 ? "https://google.com" : null,
        converted: i < 4,
        revenue: i < 4 ? 25 : 0,
      },
    });
  }
  console.log("✅ Affiliate clicks seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("────────────────────────────────────────");
  console.log(`  Tools:     ${tools.length}`);
  console.log(`  Tasks:     ${tasks.length}`);
  console.log(`  Leads:     ${leads.length}`);
  console.log(`  Posts:     ${posts.length}`);
  console.log(`  Campaigns: ${campaigns.length}`);
  console.log(`  Clicks:    15 (sample)`);
  console.log("────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
