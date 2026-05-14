// ═══════════════════════════════════════════════════════════════
// AUDIT ENGINE — Moteur de recommandations enrichi
// Objectif 1 : Lead collection
// Objectif 2 : Recommandations avec liens affiliés cliquables
// Objectif 3 : Identification métiers réglementés
// ═══════════════════════════════════════════════════════════════

export interface AuditFormData {
  profile: string;
  sector: string;
  phase: string;
  painPoints: string[];
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  projectName?: string;
  password?: string;
  consent: boolean;
}

export interface ToolRecommendation {
  slug: string;
  name: string;
  category: "bank" | "compta" | "assurance" | "juridique" | "marketing";
  tagline: string;
  pricing: string;
  affiliateUrl: string;
  website: string;
  commission: number;
  rating: number;
  pros: string[];
  cons: string[];
  whyRecommended: string;
}

export interface RegulatedWarning {
  profession: string;
  authority: string;
  diploma: string;
  requirements: string[];
  additionalCosts: string[];
  recommendedTools: ToolRecommendation[];
}

export interface AuditResult {
  score: number;
  scoreLabel: string;
  scoreColor: string;
  summary: string;
  isRegulated: boolean;
  regulatedProfession: string | null;
  regulatedWarning: RegulatedWarning | null;
  recommendations: {
    prioritaires: ToolRecommendation[];
    essentielles: ToolRecommendation[];
    optionnelles: ToolRecommendation[];
  };
  nextSteps: string[];
  estimatedSavings: string;
  regulatoryAlerts: string[];
}

// ─── SECTEURS D'ACTIVITÉ ───────────────────────────────────────

export const SECTORS = [
  { value: "restauration", label: "Restauration / Food", icon: "🍽️", regulated: true, professionKey: "restaurateur" },
  { value: "btp", label: "BTP / Construction", icon: "🏗️", regulated: true, professionKey: "btp-artisan" },
  { value: "sante", label: "Santé / Médical", icon: "🏥", regulated: true, professionKey: "medecin" },
  { value: "beaute", label: "Beauté / Coiffure / Esthétique", icon: "✂️", regulated: true, professionKey: "coiffeur" },
  { value: "transport", label: "Transport / Taxi / VTC", icon: "🚗", regulated: true, professionKey: "taxi-vtc" },
  { value: "immobilier", label: "Immobilier", icon: "🏠", regulated: true, professionKey: "agent-immobilier" },
  { value: "juridique", label: "Juridique / Conseil", icon: "⚖️", regulated: true, professionKey: "avocat" },
  { value: "finance", label: "Finance / Comptabilité", icon: "🧮", regulated: true, professionKey: "expert-comptable" },
  { value: "sport", label: "Sport / Coaching", icon: "💪", regulated: true, professionKey: "coach-sportif" },
  { value: "education", label: "Éducation / Formation", icon: "📚", regulated: false },
  { value: "commerce", label: "Commerce / E-commerce", icon: "🛒", regulated: false },
  { value: "tech", label: "Tech / Digital / Freelance", icon: "💻", regulated: false },
  { value: "marketing", label: "Marketing / Communication", icon: "📢", regulated: false },
  { value: "artisanat", label: "Artisanat / Création", icon: "🎨", regulated: false },
  { value: "services", label: "Services / Conseil", icon: "🤝", regulated: false },
  { value: "autre", label: "Autre secteur", icon: "🔍", regulated: false },
];

// ─── AVERTISSEMENTS MÉTIERS RÉGLEMENTÉS ───────────────────────

const REGULATED_PROFESSIONS: Record<string, RegulatedWarning> = {
  restaurateur: {
    profession: "Restaurateur",
    authority: "DDPP (Direction Départementale de la Protection des Populations)",
    diploma: "CAP Cuisine ou équivalent (pas obligatoire pour tous les formats)",
    requirements: [
      "Formation HACCP obligatoire (hygiène alimentaire)",
      "Permis d'exploitation délivré par la mairie",
      "Déclaration préalable d'activité auprès de la DDPP",
      "Assurance responsabilité civile professionnelle obligatoire",
      "Respect des normes ERP (Établissement Recevant du Public)",
    ],
    additionalCosts: [
      "Formation HACCP : 150-500€",
      "Assurance RC Pro : 800-2 500€/an",
      "Contrôle sanitaire initial : ~200€",
    ],
    recommendedTools: [
      {
        slug: "toofood", name: "Toofood", category: "compta", tagline: "Le logiciel de gestion pour la restauration",
        pricing: "À partir de 29€/mois", affiliateUrl: "https://www.toofood.com/?ref=crea-entreprise",
        website: "https://www.toofood.com", commission: 30, rating: 4.5,
        pros: ["Spécialisé restauration", "Gestion des stocks intégrée", "Facturation simplifiée"],
        cons: ["Fonctionnalités limitées en version basique"], whyRecommended: "Spécialement conçu pour votre secteur, Toofood vous aide à gérer vos stocks, vos coûts et votre facturation.",
      },
    ],
  },
  "btp-artisan": {
    profession: "Artisan BTP",
    authority: "Chambre des Métiers et de l'Artisanat (CMA) / Chambre de Commerce",
    diploma: "CAP/BEP dans le métier concerné + qualification professionnelle",
    requirements: [
      "Inscription au Répertoire des Métiers (RM)",
      "Qualification professionnelle attestée (diplôme ou 3 ans d'expérience)",
      "Assurance décennale obligatoire",
      "Carte BTP obligatoire pour accéder aux chantiers",
      "Respect de la réglementation du code du travail du BTP",
    ],
    additionalCosts: [
      "Assurance décennale : 2 000-8 000€/an selon activité",
      "Carte BTP : ~100€/an",
      "Materiaux de protection : 200-500€",
    ],
    recommendedTools: [
      {
        slug: "tolteck", name: "Tolteck", category: "compta", tagline: "Gestion de chantier pour artisans",
        pricing: "À partir de 35€/mois", affiliateUrl: "https://www.tolteck.com/?ref=crea-entreprise",
        website: "https://www.tolteck.com", commission: 25, rating: 4.3,
        pros: ["Spécialisé artisans BTP", "Devis et factures pro", "Gestion de chantier"],
        cons: ["Peu adapté aux multi-activités"], whyRecommended: "Solution complète pour gérer vos devis, factures et chantiers depuis votre smartphone.",
      },
    ],
  },
  medecin: {
    profession: "Médecin",
    authority: "Ordre des Médecins / ARS (Agence Régionale de Santé)",
    diploma: "Doctorat en Médecine (8-11 ans d'études)",
    requirements: [
      "Inscription obligatoire au Conseil National de l'Ordre des Médecins",
      "Autorisation d'exercer délivrée par l'ARS",
      "Conventionnement avec l'Assurance Maladie (optionnel mais recommandé)",
      "Assurance responsabilité civile professionnelle médicale obligatoire",
      "Conformité HDS (Hôpital de Secours) pour stockage des médicaments",
    ],
    additionalCosts: [
      "Assurance RC Pro médicale : 1 500-5 000€/an",
      "Ordre des Médecins (inscription) : ~200€",
      "Logiciel de gestion cabinet médical : 50-300€/mois",
    ],
    recommendedTools: [
      {
        slug: "doctolib-pro", name: "Doctolib Pro", category: "marketing", tagline: "Prise de rendez-vous en ligne pour professionnels de santé",
        pricing: "À partir de 89€/mois", affiliateUrl: "https://www.doctolib.fr/pro/?ref=crea-entreprise",
        website: "https://www.doctolib.fr/pro", commission: 40, rating: 4.7,
        pros: ["Large visibilité", "Gestion des rendez-vous", "Téléconsultation intégrée"],
        cons: ["Commission sur certains actes"], whyRecommended: "Plateforme incontournable pour développer votre patientèle et gérer vos consultations.",
      },
    ],
  },
  coiffeur: {
    profession: "Coiffeur",
    authority: "Chambre des Métiers et de l'Artisanat",
    diploma: "CAP Coiffure (ou BAC Pro Métiers de la Coiffure)",
    requirements: [
      "Qualification professionnelle obligatoire (CAP minimum)",
      "Inscription au Répertoire des Métiers",
      "Déclaration auprès de la DDCCRF",
      "Assurance responsabilité civile professionnelle",
      "Respect des normes d'hygiène et de sécurité",
    ],
    additionalCosts: [
      "Assurance RC Pro : 300-800€/an",
      "Formation continue : 200-500€/an",
      "Materiel professionnel : 1 000-5 000€",
    ],
    recommendedTools: [
      {
        slug: "planity", name: "Planity", category: "marketing", tagline: "Prise de rendez-vous pour salons de coiffure",
        pricing: "À partir de 39€/mois", affiliateUrl: "https://www.planity.com/?ref=crea-entreprise",
        website: "https://www.planity.com", commission: 20, rating: 4.6,
        pros: ["Simple d'utilisation", "Bonne visibilité", "Application client"],
        cons: ["Concurrence entre salons"], whyRecommended: "Permet de gérer facilement vos rendez-vous et d'attirer de nouveaux clients dans votre zone.",
      },
    ],
  },
  "taxi-vtc": {
    profession: "Taxi / VTC",
    authority: "Préfecture / DREAL",
    diploma: "Pas de diplôme obligatoire",
    requirements: [
      "Licence de taxi délivrée par la Préfecture (taxi)",
      "Carte professionnelle de conducteur de taxi",
      "Carte VTC délivrée par le Préfecture (VTC)",
      "Immatriculation VTC + visite technique annuelle",
      "Assurance responsabilité civile professionnelle",
      "Formation obligatoire de 20h (VTC)",
    ],
    additionalCosts: [
      "Assurance RC Pro : 600-1 500€/an",
      "Licence taxi (location) : 100-150€/semaine",
      "Formation VTC 20h : 300-500€",
    ],
    recommendedTools: [
      {
        slug: "heetch", name: "Heetch", category: "marketing", tagline: "Application de mise en relation pour VTC",
        pricing: "Commission sur courses", affiliateUrl: "https://www.heetch.com/?ref=crea-entreprise",
        website: "https://www.heetch.com", commission: 15, rating: 4.2,
        pros: ["Commission favorable", "Communauté active", "Flexibilité"],
        cons: ["Marché restreint vs Uber"], whyRecommended: "Commission plus favorable qu'Uber, idéale pour démarrer votre activité VTC.",
      },
    ],
  },
  "agent-immobilier": {
    profession: "Agent immobilier",
    authority: "CNI (Carte Nationale d'Identité de Transaction Immobilière) / Préfecture",
    diploma: "BAC+3 en droit ou immobilier recommandé (pas obligatoire si 10 ans d'expérience)",
    requirements: [
      "Carte T (Transaction) ou Carte G (Gestion) obligatoire",
      "Attestation de compétence professionnelle (ACPR) ou diplôme équivalent",
      "Assurance responsabilité civile professionnelle obligatoire",
      "Inscription à la préfecture",
      "Compte CARPA (fonds de garantie) obligatoire",
    ],
    additionalCosts: [
      "Assurance RC Pro : 500-2 000€/an",
      "Carte professionnelle : ~150€",
      "Formation continue : 300-700€/an",
    ],
    recommendedTools: [
      {
        slug: "properstar", name: "Properstar", category: "marketing", tagline: "Plateforme immobilière internationale",
        pricing: "Sur devis", affiliateUrl: "https://www.properstar.com/?ref=crea-entreprise",
        website: "https://www.properstar.com", commission: 10, rating: 4.0,
        pros: ["Visibilité internationale", "Outils de gestion avancés"],
        cons: ["Marché international surtout"], whyRecommended: "Augmentez votre visibilité sur le marché immobilier international pour attirer de nouveaux clients.",
      },
    ],
  },
  avocat: {
    profession: "Avocat",
    authority: "Barreau / Conseil National des Barreaux",
    diploma: "Master 1 en Droit + Certificat d'Aptitude à la Profession d'Avocat (CAPA)",
    requirements: [
      "Serment d'office obligatoire",
      "Inscription au barreau de votre tribunal de grande instance",
      "Assurance responsabilité civile professionnelle obligatoire",
      "Contribution à la Caisse Nationale des Barreaux Français",
    ],
    additionalCosts: [
      "Assurance RC Pro : 1 000-3 000€/an",
      "Cotisation CNBF : ~500€/an",
      "Cotisation Ordre : ~300€/an",
    ],
    recommendedTools: [
      {
        slug: "juritools", name: "Juritools", category: "juridique", tagline: "Outils de gestion pour cabinets d'avocats",
        pricing: "À partir de 49€/mois", affiliateUrl: "https://www.juritools.com/?ref=crea-entreprise",
        website: "https://www.juritools.com", commission: 20, rating: 4.1,
        pros: ["Gestion des dossiers", "Comptabilité intégrée", "Agenda intelligent"],
        cons: ["Interface un peu complexe"], whyRecommended: "Solution complète pour gérer votre cabinet, vos dossiers et votre comptabilité.",
      },
    ],
  },
  "expert-comptable": {
    profession: "Expert-comptable",
    authority: "Ordre des Experts-Comptables (OEC)",
    diploma: "DEC (Diplôme d'Expertise Comptable) — Bac+8 minimum",
    requirements: [
      "Inscription obligatoire au Tableau de l'Ordre",
      "Stage professionnel de 3 ans obligatoire",
      "Assurance responsabilité civile professionnelle obligatoire",
      "Formation continue de 40h/an obligatoire",
      "Respect du code de déontologie de l'OEC",
    ],
    additionalCosts: [
      "Assurance RC Pro : 2 000-5 000€/an",
      "Cotisation Ordre : ~1 000€/an",
      "Formation continue : 500-1 500€/an",
    ],
    recommendedTools: [
      {
        slug: "sage-compta", name: "Sage Comptabilité", category: "compta", tagline: "Le logiciel de référence des experts-comptables",
        pricing: "À partir de 59€/mois", affiliateUrl: "https://www.sage.com/fr-fr/?ref=crea-entreprise",
        website: "https://www.sage.com/fr-fr", commission: 25, rating: 4.4,
        pros: ["Référence du marché", "Complet et fiable", "Support professionnel"],
        cons: ["Prix élevé", "Courbe d'apprentissage"], whyRecommended: "Le logiciel le plus utilisé par la profession, indispensable pour travailler avec vos clients.",
      },
    ],
  },
  "coach-sportif": {
    profession: "Coach sportif / Préparateur physique",
    authority: "Ministère des Sports / Préfecture",
    diploma: "BPJEPS, DEUST STAPS ou licence STAPS (diplôme obligatoire)",
    requirements: [
      "Diplôme d'État obligatoire (BPJEPS minimum)",
      "Déclaration d'activité auprès de la DDPP",
      "Assurance responsabilité civile professionnelle",
      "Certification de secourisme (PSC1 recommandé)",
      "Respect des normes de sécurité des installations",
    ],
    additionalCosts: [
      "Assurance RC Pro : 200-600€/an",
      "Matériel professionnel : 300-2 000€",
      "Formation continue : 200-500€/an",
    ],
    recommendedTools: [
      {
        slug: "heego", name: "Heego", category: "marketing", tagline: "Logiciel de gestion pour coachs sportifs",
        pricing: "À partir de 19€/mois", affiliateUrl: "https://www.heego.fr/?ref=crea-entreprise",
        website: "https://www.heego.fr", commission: 20, rating: 4.3,
        pros: ["Spécialisé coaching", "Gestion des programmes", "Suivi clients"],
        cons: ["Fonctionnalités limitées version gratuite"], whyRecommended: "Gérez vos clients, programmes sportifs et paiements depuis une seule plateforme.",
      },
    ],
  },
};

// ─── OUTILS RECOMMANDÉS (avec liens affiliés) ─────────────────

const TOOL_CATALOG: ToolRecommendation[] = [
  // ── Banques ──
  { slug: "qonto", name: "Qonto", category: "bank", tagline: "La néobanque pour entreprises", pricing: "À partir de 9€/mois", affiliateUrl: "https://qonto.com/fr/?ref=crea-entreprise", website: "https://qonto.com/fr", commission: 80, rating: 4.6, pros: ["Pro CB illimités", "virements SEPA gratuits", "Interface moderne"], cons: ["Pas d'agence physique"], whyRecommended: "Idéal pour votre profil, Qonto offre des cartes pro illimitées et une comptabilité simplifiée." },
  { slug: "shine", name: "Shine (GoCardless)", category: "bank", tagline: "Le compte pro pour freelances et TPE", pricing: "Gratuit puis 7,90€/mois", affiliateUrl: "https://www.shine.fr/?ref=crea-entreprise", website: "https://www.shine.fr", commission: 40, rating: 4.3, pros: ["Gratuit au début", "Cashback 1%", "Application mobile"], cons: ["Services premium payants"], whyRecommended: "Parfait pour démarrer sans frais, Shine offre un compte pro avec cashback sur vos dépenses." },
  { slug: "blank", name: "Blank", category: "bank", tagline: "La banque nouvelle génération", pricing: "À partir de 0€/mois", affiliateUrl: "https://www.blank.app/?ref=crea-entreprise", website: "https://www.blank.app", commission: 50, rating: 4.4, pros: ["Offre gratuite généreuse", "Analytics avancés", "Maestro/CB"], cons: ["Nouveau sur le marché"], whyRecommended: "Blank offre l'offre gratuite la plus complète du marché avec des outils analytics intégrés." },
  { slug: "boursorama", name: "Boursorama Banque Pro", category: "bank", tagline: "La banque en ligne pas chère", pricing: "Gratuit sous conditions", affiliateUrl: "https://www.boursorama-banque.com/?ref=crea-entreprise", website: "https://www.boursorama-banque.com", commission: 60, rating: 4.2, pros: ["Souvent gratuit", "Groupe Société Générale", "Fiable"], cons: ["Support parfois lent"], whyRecommended: "Rattachée à Société Générale, Boursorama offre une banque pro fiable et souvent gratuite." },

  // ── Comptabilité ──
  { slug: "indy", name: "Indy", category: "compta", tagline: "La compta automatique pour indépendants", pricing: "À partir de 0€/mois", affiliateUrl: "https://www.indy.fr/?ref=crea-entreprise", website: "https://www.indy.fr", commission: 35, rating: 4.7, pros: ["Gratuit pour les auto-entrepreneurs", "Automatique", "Certifié par l'État"], cons: ["Pas pour SARL/EURL"], whyRecommended: "Certifié par l'État, Indy automatise votre compta en connectant votre compte bancaire." },
  { slug: "abby", name: "Abby", category: "compta", tagline: "Comptabilité automatique et intelligente", pricing: "À partir de 15€/mois", affiliateUrl: "https://www.abby.fr/?ref=crea-entreprise", website: "https://www.abby.fr", commission: 30, rating: 4.5, pros: ["IA pour categoriser les dépenses", "Rapports pro", "Mobile-first"], cons: ["Limité aux micro-entreprises"], whyRecommended: "L'IA d'Abby categorise automatiquement vos dépenses, gain de temps considérable." },
  { slug: "penelope", name: "Pennylane", category: "compta", tagline: "Le logiciel de compta pour les PME", pricing: "À partir de 49€/mois", affiliateUrl: "https://www.pennylane.com/?ref=crea-entreprise", website: "https://www.pennylane.com", commission: 50, rating: 4.6, pros: ["Complet pour PME", "Facturation intégrée", "Expert-comptable connecté"], cons: ["Prix plus élevé"], whyRecommended: "Pennylane connecte votre compta avec votre expert-comptable et votre facturation." },

  // ── Assurance ──
  { slug: "alan", name: "Alan", category: "assurance", tagline: "L'assurance santé et prévoyance pour entreprises", pricing: "Sur devis", affiliateUrl: "https://www.alan.com/?ref=crea-entreprise", website: "https://www.alan.com", commission: 70, rating: 4.8, pros: ["Interface moderne", "Couverture complète", "Souscription 100% en ligne"], cons: ["Pas d'assurance RC Pro"], whyRecommended: "Alan simplifie l'assurance santé de vos équipes avec une souscription rapide et une interface intuitive." },
  { slug: "hiscox", name: "Hiscox", category: "assurance", tagline: "L'assurance RC Pro pour professionnels", pricing: "À partir de 15€/mois", affiliateUrl: "https://www.hiscox.fr/?ref=crea-entreprise", website: "https://www.hiscox.fr", commission: 55, rating: 4.4, pros: ["Spécialiste RC Pro", "Devis en 10 min", "Couverture sur mesure"], cons: ["Pas pour tous les métiers"], whyRecommended: "Leader de la RC Pro en ligne, Hiscox vous protège avec des garanties adaptées à votre métier." },
  { slug: "luko", name: "Luko", category: "assurance", tagline: "Assurance pro simple et transparente", pricing: "À partir de 20€/mois", affiliateUrl: "https://www.luko.fr/?ref=crea-entreprise", website: "https://www.luko.fr", commission: 40, rating: 4.5, pros: ["Transparence totale", "Processus digital", "Sinistres rapides"], cons: ["Offre pro limitée"], whyRecommended: "Luko réinvente l'assurance pro avec un processus 100% digital et des prix compétitifs." },
  { slug: "simply-business", name: "Simply Business", category: "assurance", tagline: "Comparateur d'assurance pro", pricing: "Sur devis", affiliateUrl: "https://www.simplybusiness.fr/?ref=crea-entreprise", website: "https://www.simplybusiness.fr", commission: 45, rating: 4.2, pros: ["Comparez les offres", "Large choix", "Assistance dédiée"], cons: ["Intermédiaire, pas assureur"], whyRecommended: "Comparez les meilleures offres d'assurance pro en un seul endroit." },

  // ── Juridique ──
  { slug: "legalstart", name: "LegalStart", category: "juridique", tagline: "Créez votre entreprise en ligne", pricing: "À partir de 49€ HT", affiliateUrl: "https://www.legalstart.fr/?ref=crea-entreprise", website: "https://www.legalstart.fr", commission: 60, rating: 4.5, pros: ["Création rapide", "Formulaires juridiques", "Support dédié"], cons: ["Frais supplémentaires pour certains actes"], whyRecommended: "Créez votre entreprise en quelques jours avec un accompagnement juridique complet." },
  { slug: "captain-contrat", name: "Captain Contrat", category: "juridique", tagline: "Modèles de contrats juridiques", pricing: "À partir de 7,90€/contrat", affiliateUrl: "https://www.captaincontrat.com/?ref=crea-entreprise", website: "https://www.captaincontrat.com", commission: 25, rating: 4.3, pros: ["Contrats sur mesure", "Rédigés par des avocats", "Prix accessible"], cons: ["Pas d'accompagnement personnalisé"], whyRecommended: "Rédigez vos contrats pro (CGV, NDA, bail...) avec des modèles validés par des avocats." },

  // ── Marketing ──
  { slug: "mailchimp", name: "Mailchimp", category: "marketing", tagline: "Email marketing et newsletters", pricing: "Gratuit jusqu'à 500 contacts", affiliateUrl: "https://mailchimp.com/?ref=crea-entreprise", website: "https://mailchimp.com", commission: 35, rating: 4.4, pros: ["Plan gratuit généreux", "Automatisation puissante", "Templates pro"], cons: ["Interface complexe"], whyRecommended: "Le leader de l'email marketing, parfait pour fidéliser vos premiers clients." },
  { slug: "canva-pro", name: "Canva Pro", category: "marketing", tagline: "Design professionnel sans compétence graphique", pricing: "11,99€/mois", affiliateUrl: "https://www.canva.com/fr_fr/?ref=crea-entreprise", website: "https://www.canva.com/fr_fr", commission: 20, rating: 4.8, pros: ["Très facile", "Templates variés", "Logo et branding"], cons: ["Export limité en gratuit"], whyRecommended: "Créez votre logo, vos supports visuels et vos publications réseaux sociaux en quelques clics." },
];

// ─── MATRICE DE RECOMMANDATION ────────────────────────────────

const PROFILE_SECTOR_MAP: Record<string, Record<string, { bank: string[]; compta: string[]; assurance: string[]; juridique: string[]; marketing: string[] }>> = {
  etudiant: {
    _default: { bank: ["shine", "blank"], compta: ["indy", "abby"], assurance: ["alan"], juridique: ["legalstart", "captain-contrat"], marketing: ["canva-pro", "mailchimp"] },
    tech: { bank: ["shine", "blank"], compta: ["indy"], assurance: ["alan"], juridique: ["captain-contrat"], marketing: ["canva-pro", "mailchimp"] },
    commerce: { bank: ["shine", "qonto"], compta: ["abby"], assurance: ["luko"], juridique: ["legalstart"], marketing: ["canva-pro", "mailchimp"] },
  },
  salarie: {
    _default: { bank: ["boursorama", "qonto"], compta: ["abby", "penelope"], assurance: ["alan", "hiscox"], juridique: ["legalstart", "captain-contrat"], marketing: ["mailchimp"] },
    finance: { bank: ["qonto"], compta: ["penelope"], assurance: ["hiscox"], juridique: ["captain-contrat"], marketing: ["mailchimp"] },
  },
  freelance: {
    _default: { bank: ["qonto", "shine", "blank"], compta: ["indy", "abby", "penelope"], assurance: ["alan", "hiscox", "luko"], juridique: ["legalstart", "captain-contrat"], marketing: ["canva-pro", "mailchimp"] },
    tech: { bank: ["qonto", "blank"], compta: ["indy", "abby"], assurance: ["alan", "hiscox"], juridique: ["captain-contrat"], marketing: ["canva-pro"] },
    services: { bank: ["qonto", "shine"], compta: ["indy", "penelope"], assurance: ["hiscox", "simply-business"], juridique: ["captain-contrat", "legalstart"], marketing: ["mailchimp"] },
  },
  "tpe-pme": {
    _default: { bank: ["qonto", "blank"], compta: ["penelope", "abby"], assurance: ["hiscox", "alan", "simply-business"], juridique: ["legalstart", "captain-contrat"], marketing: ["mailchimp", "canva-pro"] },
    restauration: { bank: ["qonto"], compta: ["penelope"], assurance: ["hiscox", "simply-business"], juridique: ["legalstart"], marketing: ["canva-pro"] },
    btp: { bank: ["qonto"], compta: ["penelope", "abby"], assurance: ["hiscox", "simply-business"], juridique: ["legalstart"], marketing: ["canva-pro"] },
  },
};

// ─── CALCUL DU SCORE ──────────────────────────────────────────

function calculateScore(phase: string, painPoints: string[], isRegulated: boolean): { score: number; label: string; color: string } {
  let base: number;
  switch (phase) {
    case "reflexion": base = 25; break;
    case "creation": base = 45; break;
    case "gestion": base = 65; break;
    case "croissance": base = 85; break;
    default: base = 40;
  }

  // Bonus par nombre de problématiques identifiées (plus c'est précis, plus on peut aider)
  base += Math.min(painPoints.length * 5, 15);

  // Pénalité pour secteur réglementé (plus de complexité = besoin d'accompagnement)
  if (isRegulated) base -= 5;

  // Léger aléatoire
  base += Math.floor(Math.random() * 11) - 5;

  const score = Math.min(100, Math.max(10, base));

  let label: string;
  let color: string;
  if (score >= 75) { label = "Excellente maturité — Prêt à agir"; color = "emerald"; }
  else if (score >= 55) { label = "Bonne base — Quelques ajustements nécessaires"; color = "amber"; }
  else if (score >= 35) { label = "En progression — Besoin d'accompagnement ciblé"; color = "orange"; }
  else { label = "Début de parcours — Accompagnement recommandé"; color = "rose"; }

  return { score, label, color };
}

// ─── GÉNÉRATION DES RECOMMANDATIONS ───────────────────────────

function generateToolRecommendations(
  profile: string,
  sector: string,
  painPoints: string[],
  regulatedWarning: RegulatedWarning | null
): AuditResult["recommendations"] {
  const profileMap = PROFILE_SECTOR_MAP[profile] || PROFILE_SECTOR_MAP.etudiant;
  const sectorMap = profileMap[sector] || profileMap._default;

  const toolMap = new Map<string, ToolRecommendation>();
  TOOL_CATALOG.forEach((t) => toolMap.set(t.slug, t));

  const prioritaires: ToolRecommendation[] = [];
  const essentielles: ToolRecommendation[] = [];
  const optionnelles: ToolRecommendation[] = [];

  // Ajouter les outils du secteur réglementé en priorité
  if (regulatedWarning) {
    regulatedWarning.recommendedTools.forEach((t) => {
      if (!toolMap.has(t.slug)) {
        toolMap.set(t.slug, t);
        prioritaires.push(t);
      }
    });
  }

  // Ajouter les outils par catégorie selon les problématiques
  if (painPoints.includes("frais-bancaires") || painPoints.includes("administratif")) {
    sectorMap.bank.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) prioritaires.push(tool);
    });
  } else {
    sectorMap.bank.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) essentielles.push(tool);
    });
  }

  if (painPoints.includes("compta") || painPoints.includes("administratif")) {
    sectorMap.compta.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) prioritaires.push(tool);
    });
  } else {
    sectorMap.compta.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) essentielles.push(tool);
    });
  }

  if (painPoints.includes("juridique") || painPoints.includes("risques")) {
    sectorMap.juridique.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) prioritaires.push(tool);
    });
  } else {
    sectorMap.juridique.forEach((slug) => {
      const tool = toolMap.get(slug);
      if (tool) essentielles.push(tool);
    });
  }

  sectorMap.assurance.forEach((slug) => {
    const tool = toolMap.get(slug);
    if (tool) essentielles.push(tool);
  });

  sectorMap.marketing.forEach((slug) => {
    const tool = toolMap.get(slug);
    if (tool) optionnelles.push(tool);
  });

  // Dédupliquer
  const seen = new Set<string>();
  const dedup = (arr: ToolRecommendation[]) => arr.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });

  return {
    prioritaires: dedup(prioritaires),
    essentielles: dedup(essentielles),
    optionnelles: dedup(optionnelles),
  };
}

// ─── RÉSUMÉ PERSONNALISÉ ──────────────────────────────────────

const PROFILE_LABELS: Record<string, string> = {
  etudiant: "Étudiant Entrepreneur",
  salarie: "Salarié en Transition",
  freelance: "Freelance / Auto-entrepreneur",
  "tpe-pme": "TPE / PME",
};

const PHASE_LABELS: Record<string, string> = {
  reflexion: "Réflexion",
  creation: "Création",
  gestion: "Gestion",
  croissance: "Croissance",
};

const PAIN_LABELS: Record<string, string> = {
  administratif: "lourdeur administrative",
  "frais-bancaires": "frais bancaires",
  compta: "comptabilité",
  juridique: "risques juridiques",
  risques: "couverture assurance",
  visibilite: "visibilité / marketing",
  financement: "financement",
  autre: "organisation générale",
};

function generateSummary(
  profile: string,
  sector: string,
  phase: string,
  painPoints: string[],
  isRegulated: boolean
): string {
  const profileLabel = PROFILE_LABELS[profile] || profile;
  const phaseLabel = PHASE_LABELS[phase] || phase;
  const sectorObj = SECTORS.find((s) => s.value === sector);
  const sectorLabel = sectorObj?.label || sector;

  let summary = `En tant que ${profileLabel} dans le secteur ${sectorLabel}, vous êtes en phase de ${phaseLabel}.`;

  if (painPoints.length > 0) {
    const painLabels = painPoints.map((p) => PAIN_LABELS[p] || p);
    summary += ` Vos principales difficultés concernent ${painLabels.slice(0, 3).join(", ")}`;
    if (painPoints.length > 3) summary += ` et ${painPoints.length - 3} autres sujets`;
    summary += ".";
  }

  if (isRegulated) {
    summary += " Votre secteur étant réglementé, des obligations spécifiques s'appliquent à votre activité (diplôme, assurance, autorisation).";
  }

  summary += " Nous avons sélectionné les outils les plus adaptés à votre situation pour optimiser votre lancement et réduire vos coûts.";

  return summary;
}

// ─── NEXT STEPS ────────────────────────────────────────────────

function generateNextSteps(phase: string, isRegulated: boolean, painPoints: string[]): string[] {
  const steps: string[] = [];

  if (phase === "reflexion") {
    steps.push("Validez votre idée de business avec une étude de marché");
    steps.push("Choisissez votre statut juridique (auto-entreprise, SARL, SAS...)");
  } else if (phase === "creation") {
    steps.push("Ouvrez votre compte bancaire professionnel");
    steps.push("Souscrivez à une assurance adaptée à votre activité");
    steps.push("Mettez en place votre solution comptable");
  } else if (phase === "gestion") {
    steps.push("Optimisez votre facturation et votre trésorerie");
    steps.push("Automatisez votre comptabilité");
    steps.push("Développez votre visibilité en ligne");
  } else if (phase === "croissance") {
    steps.push("Évaluez le passage à un statut supérieur (EURL → SASU...)");
    steps.push("Recrutez votre premier collaborateur");
    steps.push("Diversifiez vos canaux d'acquisition");
  }

  if (isRegulated) {
    steps.unshift("Vérifiez vos obligations réglementaires et obtenez les autorisations nécessaires");
  }

  if (painPoints.includes("frais-bancaires")) {
    steps.push("Comparez les offres bancaires pro pour réduire vos frais");
  }

  return steps.slice(0, 5);
}

// ─── ESTIMATION D'ÉCONOMIES ───────────────────────────────────

function estimateSavings(recommendations: AuditResult["recommendations"], isRegulated: boolean): string {
  let monthlySaving = 0;

  // Banque: passer d'une banque classique (30€/mois) à une néobanque (9€/mois) = 21€/mois
  monthlySaving += 21;

  // Compta: automatisée vs expert-comptable classique (200€/mois) = 150€/mois
  if (recommendations.essentielles.some((t) => t.category === "compta")) {
    monthlySaving += 150;
  }

  // Assurance: comparaison et optimisation = 50€/mois
  monthlySaving += 50;

  if (isRegulated) {
    monthlySaving += 30; // Économies sur les outils spécialisés
  }

  return `${Math.round(monthlySaving * 12)}€ à ${Math.round(monthlySaving * 18)}€/an`;
}

// ─── REGULATORY ALERTS ────────────────────────────────────────

function generateRegulatoryAlerts(isRegulated: boolean, profession: string | null): string[] {
  if (!isRegulated || !profession) return [];

  const warning = REGULATED_PROFESSIONS[profession];
  if (!warning) return [];

  return [
    `Votre métier (${warning.profession}) est réglementé : vérifiez vos obligations avant de vous lancer.`,
    `Autorité compétente : ${warning.authority}`,
    `Diplôme/certification : ${warning.diploma}`,
    `Assurance RC Pro obligatoire — prévoir un budget dans votre business plan.`,
  ];
}

// ─── FONCTION PRINCIPALE ──────────────────────────────────────

export function generateAuditResult(formData: AuditFormData): AuditResult {
  const sectorObj = SECTORS.find((s) => s.value === formData.sector);
  const isRegulated = sectorObj?.regulated || false;
  const regulatedProfession = sectorObj?.professionKey || null;

  const regulatedWarning = isRegulated && regulatedProfession
    ? (REGULATED_PROFESSIONS[regulatedProfession] || null)
    : null;

  const { score, label, color } = calculateScore(formData.phase, formData.painPoints, isRegulated);
  const recommendations = generateToolRecommendations(formData.profile, formData.sector, formData.painPoints, regulatedWarning);
  const summary = generateSummary(formData.profile, formData.sector, formData.phase, formData.painPoints, isRegulated);
  const nextSteps = generateNextSteps(formData.phase, isRegulated, formData.painPoints);
  const estimatedSavings = estimateSavings(recommendations, isRegulated);
  const regulatoryAlerts = generateRegulatoryAlerts(isRegulated, regulatedProfession);

  return {
    score,
    scoreLabel: label,
    scoreColor: color,
    summary,
    isRegulated,
    regulatedProfession,
    regulatedWarning,
    recommendations,
    nextSteps,
    estimatedSavings,
    regulatoryAlerts,
  };
}
