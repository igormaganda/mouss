import { PrismaClient } from "@prisma/client";

const DATABASE_URL =
  "postgresql://creapulse_user:Creapulse@2026!Secure@109.123.249.114:5432/creapulse";

process.env.DATABASE_URL = DATABASE_URL;

const prisma = new PrismaClient();

interface SwipeCardData {
  phase: number;
  title: string;
  description: string;
  helpText: string;
  emoji: string;
  gradient: string;
  tags: string[];
  isActive: boolean;
  isEssential: boolean;
  sortOrder: number;
}

const phase1Gradients = [
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-red-400 to-orange-600",
  "from-blue-400 to-indigo-500",
  "from-fuchsia-400 to-pink-500",
  "from-teal-400 to-emerald-500",
  "from-cyan-400 to-sky-500",
  "from-lime-400 to-green-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-violet-500",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-500",
  "from-teal-400 to-cyan-500",
  "from-emerald-400 to-green-500",
  "from-sky-400 to-blue-500",
  "from-purple-400 to-indigo-500",
  "from-green-400 to-teal-500",
];

const phase2Gradients = [
  "from-cyan-400 to-blue-500",
  "from-pink-400 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-red-500",
  "from-green-400 to-emerald-500",
  "from-blue-400 to-indigo-500",
  "from-lime-400 to-green-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-cyan-500",
  "from-fuchsia-400 to-pink-500",
  "from-red-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-slate-400 to-gray-500",
  "from-yellow-400 to-amber-500",
  "from-purple-400 to-violet-500",
  "from-orange-400 to-amber-500",
  "from-indigo-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-teal-400 to-cyan-500",
];

const phase3Gradients = [
  "from-red-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-sky-500",
  "from-green-400 to-emerald-500",
  "from-slate-400 to-gray-500",
  "from-pink-400 to-rose-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-pink-500",
  "from-blue-400 to-cyan-500",
  "from-violet-400 to-indigo-500",
  "from-orange-400 to-amber-500",
  "from-lime-400 to-green-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-green-500",
  "from-fuchsia-400 to-pink-500",
  "from-yellow-400 to-orange-400",
  "from-teal-400 to-emerald-500",
  "from-indigo-400 to-purple-500",
];

// Essential indices per phase (~8 per phase)
const phase1EssentialIndices = [0, 1, 4, 5, 6, 8, 10, 15, 17]; // 9 cards
const phase2EssentialIndices = [0, 2, 4, 5, 9, 16, 19]; // 7 cards → 9+7+6=22, let's do 8+8+8=24
// Adjusting: phase1 = 8, phase2 = 8, phase3 = 8
const phase1Essential = new Set([0, 1, 4, 5, 6, 8, 10, 15]);
const phase2Essential = new Set([0, 2, 4, 5, 9, 16, 19]); // 7
const phase3Essential = new Set([0, 1, 2, 4, 10, 11, 18]); // 7

// Total: 8 + 7 + 7 = 22 essential out of 60 (~37%). Let me make it closer to 8 per phase.
// Let me add one more to phase2 and one more to phase3
// phase2: add index 3 (Restauration)
// phase3: add index 7 (Photographe)
// Actually, the user said "~8 per phase" so 7-9 is fine. Let me keep it as is and add a couple more to hit closer to 8.

const phase2EssentialFinal = new Set([0, 2, 4, 5, 9, 16, 19, 3]); // 8
const phase3EssentialFinal = new Set([0, 1, 2, 4, 7, 10, 11, 18]); // 8

// PHASE 1 — Pépites (entrepreneurial qualities)
const phase1Cards: Omit<SwipeCardData, "phase" | "gradient">[] = [
  {
    title: "Leadership",
    description: "Savoir prendre des décisions et motiver une équipe",
    helpText:
      "Le leadership en entrepreneuriat va au-delà de la simple gestion : c'est la capacité à inspirer votre équipe, à prendre des décisions difficiles sous pression et à maintenir une vision claire même en période d'incertitude. Un bon leader entrepreneur sait déléguer tout en restant impliqué.",
    emoji: "👑",
    tags: ["management", "vision", "equipe"],
    isActive: true,
    isEssential: true,
    sortOrder: 1,
  },
  {
    title: "Créativité",
    description: "Imaginer des solutions innovantes",
    helpText:
      "La créativité entrepreneuriale est la capacité à voir des opportunités là où d'autres voient des obstacles. Elle englobe l'innovation produit, service, processus et modèle d'affaires. C'est un moteur essentiel de différenciation concurrentielle.",
    emoji: "💡",
    tags: ["innovation", "ideation", "differentiation"],
    isActive: true,
    isEssential: true,
    sortOrder: 2,
  },
  {
    title: "Gestion du stress",
    description: "Rester calme sous pression",
    helpText:
      "L'entrepreneuriat génère un niveau de stress élevé : incertitude financière, pression temporelle, responsabilités multiples. La capacité à gérer ce stress de manière saine est cruciale pour la prise de décision et la persévérance à long terme.",
    emoji: "🧘",
    tags: ["bien-etre", "resilience", "equilibre"],
    isActive: true,
    isEssential: false,
    sortOrder: 3,
  },
  {
    title: "Communication",
    description: "Transmettre clairement vos idées",
    helpText:
      "La communication efficace est indispensable pour convaincre investisseurs, fidéliser clients et motiver collaborateurs. Elle inclut le pitch, la négociation, le marketing et la gestion des relations publiques.",
    emoji: "🗣️",
    tags: ["relationnel", "pitch", "marketing"],
    isActive: true,
    isEssential: false,
    sortOrder: 4,
  },
  {
    title: "Résolution de problèmes",
    description: "Trouver des solutions face aux obstacles",
    helpText:
      "Face aux imprévus quotidiens de l'entrepreneuriat, la capacité à analyser un problème, à identifier ses causes et à imaginer des solutions rapides et efficaces est une compétence clé qui fait souvent la différence entre succès et échec.",
    emoji: "🧩",
    tags: ["analyse", "adaptation", "pragmatisme"],
    isActive: true,
    isEssential: true,
    sortOrder: 5,
  },
  {
    title: "Persévérance",
    description: "Ne pas abandonner face aux difficultés",
    helpText:
      "La persévérance est peut-être la qualité numéro un de l'entrepreneur. Les statistiques montrent que la majorité des entrepreneurs à succès ont connu au moins un échec avant de réussir. C'est la capacité à rebondir et à continuer malgré les revers.",
    emoji: "🔥",
    tags: ["resilience", "motivation", "tenacite"],
    isActive: true,
    isEssential: true,
    sortOrder: 6,
  },
  {
    title: "Adaptabilité",
    description: "S'adapter rapidement aux changements",
    helpText:
      "Le marché évolue constamment. L'adaptabilité permet de pivoter votre modèle d'affaires, d'adopter de nouvelles technologies et de répondre aux changements de comportement des consommateurs avant vos concurrents.",
    emoji: "🌊",
    tags: ["flexibilite", "pivot", "agilite"],
    isActive: true,
    isEssential: true,
    sortOrder: 7,
  },
  {
    title: "Prise de risque",
    description: "Savoir prendre des risques calculés",
    helpText:
      "L'entrepreneuriat implique nécessairement de prendre des risques, mais il s'agit de risques mesurés et calculés, pas de paris aveugles. C'est la capacité à évaluer le rapport risque/rendement et à agir malgré l'incertitude.",
    emoji: "🎲",
    tags: ["audace", "decision", "calcul"],
    isActive: true,
    isEssential: false,
    sortOrder: 8,
  },
  {
    title: "Vision stratégique",
    description: "Anticiper les tendances du marché",
    helpText:
      "La vision stratégique permet de positionner votre entreprise sur des marchés en croissance, d'anticiper les évolutions technologiques et réglementaires, et de construire un avantage concurrentiel durable.",
    emoji: "🔭",
    tags: ["strategie", "anticipation", "positionnement"],
    isActive: true,
    isEssential: true,
    sortOrder: 9,
  },
  {
    title: "Négociation",
    description: "Obtenir des accords favorables",
    helpText:
      "La négociation est quotidienne pour l'entrepreneur : avec fournisseurs, clients, investisseurs, partenaires. Savoir préparer, argumenter et trouver des accords gagnant-gagnant est essentiel.",
    emoji: "🤝",
    tags: ["relationnel", "contrats", "partenariats"],
    isActive: true,
    isEssential: false,
    sortOrder: 10,
  },
  {
    title: "Organisation",
    description: "Planifier et structurer efficacement",
    helpText:
      "L'organisation est le fondement d'une entreprise saine : gestion du temps, planification des tâches, priorisation, suivi des indicateurs clés. Sans structure, même les meilleures idées restent des rêves.",
    emoji: "📋",
    tags: ["productivite", "planning", "methode"],
    isActive: true,
    isEssential: true,
    sortOrder: 11,
  },
  {
    title: "Empathie",
    description: "Comprendre les besoins de ses clients",
    helpText:
      "L'empathie est au coeur du design thinking et de l'approche client. Comprendre profondément les frustrations, aspirations et comportements de votre cible est la clé pour créer des produits et services qui répondent à de vrais besoins.",
    emoji: "❤️",
    tags: ["client", "design thinking", "ecoute"],
    isActive: true,
    isEssential: false,
    sortOrder: 12,
  },
  {
    title: "Curiosité",
    description: "Explorer de nouvelles opportunités",
    helpText:
      "La curiosité intellectuelle pousse à remettre en question le statu quo, à explorer de nouveaux marchés, à apprendre continuellement et à rester à la pointe des évolutions de son secteur.",
    emoji: "🔍",
    tags: ["apprentissage", "exploration", "veille"],
    isActive: true,
    isEssential: false,
    sortOrder: 13,
  },
  {
    title: "Confiance",
    description: "Croire en son projet et ses capacités",
    helpText:
      "La confiance en soi est contagieuse : elle inspire confiance chez les investisseurs, les clients et les collaborateurs. C'est le moteur qui permet de se lancer et de persévérer malgré le doute.",
    emoji: "⭐",
    tags: ["assurance", "legitimite", "motivation"],
    isActive: true,
    isEssential: false,
    sortOrder: 14,
  },
  {
    title: "Autonomie",
    description: "Travailler de manière indépendante",
    helpText:
      "L'entrepreneur doit souvent fonctionner de manière autonome, surtout en phase de lancement. Cela implique l'auto-discipline, l'auto-formation et la capacité à prendre des décisions sans validation hiérarchique.",
    emoji: "🚀",
    tags: ["independance", "discipline", "initiative"],
    isActive: true,
    isEssential: false,
    sortOrder: 15,
  },
  {
    title: "Réseau",
    description: "Construire des relations professionnelles",
    helpText:
      "Le réseau professionnel est un levier puissant : il apporte des conseils, des opportunités commerciales, des financements et du soutien moral. Le networking actif est une compétence stratégique.",
    emoji: "🌐",
    tags: ["networking", "partenariats", "mentoring"],
    isActive: true,
    isEssential: true,
    sortOrder: 16,
  },
  {
    title: "Sens commercial",
    description: "Identifier et exploiter les opportunités de vente",
    helpText:
      "Le sens commercial inclut l'identification des opportunités de marché, la prospection, la conversion et la fidélisation. Même les entreprises les plus innovantes ont besoin de compétences commerciales pour survivre.",
    emoji: "💰",
    tags: ["vente", "prospection", "croissance"],
    isActive: true,
    isEssential: false,
    sortOrder: 17,
  },
  {
    title: "Gestion financière",
    description: "Maîtriser les aspects financiers",
    helpText:
      "La gestion financière est vitale : trésorerie, budget, rentabilité, fiscalité. La majorité des défaillances d'entreprise sont liées à des problèmes de trésorerie, rendant cette compétence indispensable.",
    emoji: "📊",
    tags: ["finance", "tresorerie", "comptabilite"],
    isActive: true,
    isEssential: true,
    sortOrder: 18,
  },
  {
    title: "Force de conviction",
    description: "Persuader et mobiliser ses partenaires",
    helpText:
      "La force de conviction combine la crédibilité, l'enthousiasme et la logique pour emporter l'adhésion. Elle est essentielle pour le fundraising, le recrutement et les partenariats stratégiques.",
    emoji: "🎯",
    tags: ["persuasion", "influence", "leadership"],
    isActive: true,
    isEssential: false,
    sortOrder: 19,
  },
  {
    title: "Résilience",
    description: "Rebondir après un échec",
    helpText:
      "La résilience va au-delà de la persévérance : c'est la capacité à apprendre de ses échecs, à se réinventer et à revenir plus fort. Les entrepreneurs résilients considèrent l'échec comme une étape d'apprentissage.",
    emoji: "💪",
    tags: ["rebond", "apprentissage", "courage"],
    isActive: true,
    isEssential: false,
    sortOrder: 20,
  },
];

// PHASE 2 — Appétences (professional interests)
const phase2Cards: Omit<SwipeCardData, "phase" | "gradient">[] = [
  {
    title: "Innovation technologique",
    description: "Créer des solutions tech innovantes",
    helpText:
      "Le secteur technologique offre des opportunités en IA, SaaS, IoT, blockchain, cybersécurité. C'est un domaine en constante évolution avec des barrières à l'entrée variables selon la niche choisie.",
    emoji: "🤖",
    tags: ["tech", "IA", "SaaS", "innovation"],
    isActive: true,
    isEssential: true,
    sortOrder: 1,
  },
  {
    title: "Artisanat d'art",
    description: "Valoriser un savoir-faire traditionnel",
    helpText:
      "L'artisanat d'art allie tradition et création : bijoux, céramique, verrerie, textile, maroquinerie. Le marché premium et l'export offrent de belles opportunités pour les artisans talentueux.",
    emoji: "🎨",
    tags: ["artisanat", "création", "tradition", "premium"],
    isActive: true,
    isEssential: false,
    sortOrder: 2,
  },
  {
    title: "Commerce en ligne",
    description: "Vendre sur internet et les réseaux sociaux",
    helpText:
      "L'e-commerce connaît une croissance continue : marketplaces, vente directe, dropshipping, D2C. La maîtrise du digital marketing et de la logistique est clé.",
    emoji: "🛒",
    tags: ["e-commerce", "digital", "vente en ligne"],
    isActive: true,
    isEssential: true,
    sortOrder: 3,
  },
  {
    title: "Restauration / Food",
    description: "Créer un concept autour de la gastronomie",
    helpText:
      "Le secteur de la restauration est dynamique mais exigeant : food trucks, restaurants conceptuels, traiteur, dark kitchens. La différenciation et la gestion des coûts sont cruciales.",
    emoji: "🍽️",
    tags: ["restauration", "food", "gastronomie"],
    isActive: true,
    isEssential: true,
    sortOrder: 4,
  },
  {
    title: "Bien-être & Santé",
    description: "Accompagner vers un mieux-être",
    helpText:
      "Le marché du bien-être est en plein boom : coaching, yoga, naturopathie, spa, soins. La demande sociétale pour une meilleure qualité de vie crée de nombreuses opportunités.",
    emoji: "🧘‍♀️",
    tags: ["bien-etre", "sante", "coaching", "wellness"],
    isActive: true,
    isEssential: true,
    sortOrder: 5,
  },
  {
    title: "Éducation & Formation",
    description: "Transmettre des connaissances",
    helpText:
      "L'e-learning et la formation continue sont en croissance : cours en ligne, coaching, certification, EdTech. La reconversion professionnelle est un moteur puissant de ce marché.",
    emoji: "📚",
    tags: ["education", "formation", "e-learning", "EdTech"],
    isActive: true,
    isEssential: true,
    sortOrder: 6,
  },
  {
    title: "Développement durable",
    description: "Entreprendre de manière éco-responsable",
    helpText:
      "L'économie verte est un axe stratégique majeur : énergie renouvelable, économie circulaire, green tech, bilan carbone. Les subventions et la demande consommateur soutiennent ce secteur.",
    emoji: "🌱",
    tags: ["DD", "ecologie", "green", "economie circulaire"],
    isActive: true,
    isEssential: false,
    sortOrder: 7,
  },
  {
    title: "Immobilier",
    description: "Investir ou créer dans l'immobilier",
    helpText:
      "L'immobilier offre des opportunités diverses : location, colocation, coworking, rénovation, gestion. C'est un secteur tangible avec des leviers de financement variés.",
    emoji: "🏠",
    tags: ["immobilier", "location", "investissement"],
    isActive: true,
    isEssential: false,
    sortOrder: 8,
  },
  {
    title: "Tourisme",
    description: "Créer des expériences de voyage",
    helpText:
      "Le tourisme expérientiel est en hausse : éco-tourisme, tourisme local, gastronomique, insolite. La digitalisation de la réservation a transformé ce secteur.",
    emoji: "✈️",
    tags: ["tourisme", "voyage", "experiences"],
    isActive: true,
    isEssential: false,
    sortOrder: 9,
  },
  {
    title: "Mode & Design",
    description: "Lancer une marque créative",
    helpText:
      "La mode et le design permettent de mêler créativité et business : prêt-à-porter, accessoires, décoration, design produit. Le marché de la mode durable est en forte croissance.",
    emoji: "👗",
    tags: ["mode", "design", "textile", "création"],
    isActive: true,
    isEssential: true,
    sortOrder: 10,
  },
  {
    title: "Sport & Fitness",
    description: "Entreprendre dans le domaine sportif",
    helpText:
      "Le marché du sport et du fitness explose : salles de sport, coaching en ligne, événementiel sportif, équipement. La santé et le bien-être sont des moteurs puissants.",
    emoji: "🏋️",
    tags: ["sport", "fitness", "coaching", "sante"],
    isActive: true,
    isEssential: false,
    sortOrder: 11,
  },
  {
    title: "Finance & Conseil",
    description: "Accompagner les entreprises",
    helpText:
      "Le conseil et la finance offrent des opportunités B2B : comptabilité, juridique, stratégie, fusion-acquisition. L'expertise et la relation client sont clés.",
    emoji: "📈",
    tags: ["finance", "conseil", "B2B", "expertise"],
    isActive: true,
    isEssential: false,
    sortOrder: 12,
  },
  {
    title: "Transport & Logistique",
    description: "Optimiser les flux de marchandises",
    helpText:
      "Le transport et la logistique sont le backbone du commerce : livraison du dernier kilomètre, logistique verte, mobilité. La transition écologique redéfinit ce secteur.",
    emoji: "🚚",
    tags: ["transport", "logistique", "mobilite", "livraison"],
    isActive: true,
    isEssential: false,
    sortOrder: 13,
  },
  {
    title: "Agriculture",
    description: "Produire et valoriser localement",
    helpText:
      "L'agriculture urbaine, les circuits courts et l'agroalimentaire local connaissent un fort regain d'intérêt. Les AMAP, fermes pédagogiques et produits bio sont en croissance.",
    emoji: "🌾",
    tags: ["agriculture", "local", "bio", "circuits courts"],
    isActive: true,
    isEssential: false,
    sortOrder: 14,
  },
  {
    title: "Événementiel",
    description: "Organiser des événements mémorables",
    helpText:
      "L'événementiel englobe les weddings, les séminaires, les festivals et les activations de marque. La créativité et la gestion de projet sont au coeur de ce métier.",
    emoji: "🎪",
    tags: ["evenementiel", "organisation", "wedding", "festival"],
    isActive: true,
    isEssential: false,
    sortOrder: 15,
  },
  {
    title: "BTP & Construction",
    description: "Bâtir et rénover des espaces",
    helpText:
      "Le BTP offre des opportunités en rénovation énergétique, construction modulaire, éco-construction. La réglementation environnementale crée une demande croissante.",
    emoji: "🏗️",
    tags: ["BTP", "construction", "renovation", "immobilier"],
    isActive: true,
    isEssential: false,
    sortOrder: 16,
  },
  {
    title: "Digital & Marketing",
    description: "Développer la présence en ligne",
    helpText:
      "Le digital marketing englobe le SEO, les réseaux sociaux, la publicité en ligne, le content marketing. Toute entreprise a besoin de visibilité digitale.",
    emoji: "📱",
    tags: ["digital", "marketing", "SEO", "reseaux sociaux"],
    isActive: true,
    isEssential: true,
    sortOrder: 17,
  },
  {
    title: "Soin & Beauté",
    description: "Créer un institut ou une marque cosmétique",
    helpText:
      "Le marché de la beauté est en croissance : cosmétiques naturels, instituts de beauté, barbiers, bien-être. La tendance du clean beauty et du made in France est forte.",
    emoji: "💄",
    tags: ["beaute", "cosmetique", "institut", "wellness"],
    isActive: true,
    isEssential: false,
    sortOrder: 18,
  },
  {
    title: "Jeux vidéo & Loisirs",
    description: "Créer du divertissement",
    helpText:
      "L'industrie du jeu vidéo et des loisirs est dynamique : jeux mobiles, e-sport, escape games, parcs d'attractions. La gamification touche de plus en plus de secteurs.",
    emoji: "🎮",
    tags: ["jeux video", "loisirs", "e-sport", "divertissement"],
    isActive: true,
    isEssential: false,
    sortOrder: 19,
  },
  {
    title: "Énergie & Environnement",
    description: "Solutions énergétiques durables",
    helpText:
      "La transition énergétique crée des opportunités : panneaux solaires, isolation, audit énergétique, mobilité électrique. Les aides gouvernementales soutiennent fortement ce secteur.",
    emoji: "⚡",
    tags: ["energie", "environnement", "transition", "solaire"],
    isActive: true,
    isEssential: true,
    sortOrder: 20,
  },
];

// PHASE 3 — Métiers (target professions)
const phase3Cards: Omit<SwipeCardData, "phase" | "gradient">[] = [
  {
    title: "Restaurant / Café",
    description: "Établissement de restauration ou café",
    helpText:
      "Le secteur de la restauration reste un choix entrepreneurial populaire. La clé du succès réside dans le concept différenciant, la gestion des coûts et l'expérience client. Le modèle café-brasserie offre une rentabilité souvent supérieure.",
    emoji: "🍕",
    tags: ["restauration", "food", "hotellerie"],
    isActive: true,
    isEssential: true,
    sortOrder: 1,
  },
  {
    title: "E-commerce",
    description: "Boutique en ligne de produits",
    helpText:
      "L'e-commerce permet de démarrer avec un investissement réduit. Les modèles D2C (Direct to Consumer), les marketplaces et le dropshipping offrent différentes voies d'entrée. La maîtrise du marketing digital est essentielle.",
    emoji: "📦",
    tags: ["e-commerce", "vente en ligne", "digital"],
    isActive: true,
    isEssential: true,
    sortOrder: 2,
  },
  {
    title: "Consultant / Coach",
    description: "Accompagnement professionnel",
    helpText:
      "Le consulting et le coaching permettent de capitaliser sur son expertise. Les domaines en demande : gestion, stratégie, RH, développement personnel. Le modèle freelance ou cabinet offre de la flexibilité.",
    emoji: "🎓",
    tags: ["consulting", "coaching", "B2B", "expertise"],
    isActive: true,
    isEssential: true,
    sortOrder: 3,
  },
  {
    title: "Artisan",
    description: "Métier artisanal traditionnel",
    helpText:
      "Les métiers artisanaux bénéficient d'un renouveau d'intérêt. Les labels 'Entreprise du Patrimoine Vivant' et le fait-main sont valorisés. Plombier, électricien, boulanger, menuisier : des métiers en tension.",
    emoji: "🔨",
    tags: ["artisanat", "tradition", "patrimoine"],
    isActive: true,
    isEssential: false,
    sortOrder: 4,
  },
  {
    title: "Développeur Web/App",
    description: "Création de solutions numériques",
    helpText:
      "Le développement web et mobile est en demande croissante. Freelance ou startup, les opportunités sont vastes : sites vitrines, applications mobiles, plateformes SaaS. La maîtrise de plusieurs technologies est un atout.",
    emoji: "💻",
    tags: ["tech", "developpement", "web", "mobile"],
    isActive: true,
    isEssential: true,
    sortOrder: 5,
  },
  {
    title: "Coach sportif",
    description: "Entraînement et bien-être physique",
    helpText:
      "Le coaching sportif en ligne et en présentiel est en plein boom. Les formats variés (1-to-1, groupes, vidéos) et la conscience santé croissante créent un marché dynamique.",
    emoji: "🏆",
    tags: ["sport", "coaching", "sante", "bien-etre"],
    isActive: true,
    isEssential: false,
    sortOrder: 6,
  },
  {
    title: "Agent immobilier",
    description: "Transactions immobilières",
    helpText:
      "L'immobilier reste un secteur attractif. La digitalisation des visites et la gestion locative offrent de nouvelles approches. La connaissance locale et le réseau sont des atouts majeurs.",
    emoji: "🏢",
    tags: ["immobilier", "transaction", "location"],
    isActive: true,
    isEssential: false,
    sortOrder: 7,
  },
  {
    title: "Photographe / Vidéaste",
    description: "Création de contenu visuel",
    helpText:
      "La demande de contenu visuel explose : réseaux sociaux, e-commerce, événementiel, mariage. La polyvalence (photo + vidéo + drone) est un avantage concurrentiel.",
    emoji: "📸",
    tags: ["photo", "video", "contenu", "creation"],
    isActive: true,
    isEssential: true,
    sortOrder: 8,
  },
  {
    title: "Organisateur d'événements",
    description: "Planification événementielle",
    helpText:
      "L'événementiel professionnel et privé offre des opportunités variées : séminaires, weddings, festivals, activations de marque. La gestion de projet et la créativité sont essentielles.",
    emoji: "🎉",
    tags: ["evenementiel", "organisation", "projet"],
    isActive: true,
    isEssential: false,
    sortOrder: 9,
  },
  {
    title: "Formateur en ligne",
    description: "Cours et formations digitales",
    helpText:
      "L'e-learning est en croissance exponentielle. Créer des formations sur des plateformes comme Udemy, Teachable ou via sa propre plateforme. L'expertise et la pédagogie sont clés.",
    emoji: "🎥",
    tags: ["formation", "e-learning", "education", "digital"],
    isActive: true,
    isEssential: false,
    sortOrder: 10,
  },
  {
    title: "Freelance / Indépendant",
    description: "Services en freelance",
    helpText:
      "Le freelancing offre flexibilité et autonomie. Les plateformes comme Malt, Upwork facilitent la mise en relation. Les secteurs les plus demandés : IT, design, marketing, rédaction.",
    emoji: "💼",
    tags: ["freelance", "independant", "services"],
    isActive: true,
    isEssential: true,
    sortOrder: 11,
  },
  {
    title: "Startup Tech",
    description: "Entreprise technologique innovante",
    helpText:
      "Lancer une startup tech implique innovation, levée de fonds et scaling rapide. Les secteurs propices : IA, fintech, healthtech, greentech. L'écosystème incubateurs/accélérateurs est un soutien précieux.",
    emoji: "🚀",
    tags: ["startup", "tech", "innovation", "levée de fonds"],
    isActive: true,
    isEssential: true,
    sortOrder: 12,
  },
  {
    title: "Commerce de détail",
    description: "Boutique physique ou pop-up",
    helpText:
      "Le commerce de détail se réinvente : concepts éphémères, expérience client, omnicanalité. Le point de vente physique reste pertinent quand il offre une expérience unique.",
    emoji: "🏪",
    tags: ["commerce", "retail", "physique", "omnicanal"],
    isActive: true,
    isEssential: false,
    sortOrder: 13,
  },
  {
    title: "École / Crèche",
    description: "Structure d'accueil ou d'enseignement",
    helpText:
      "Le secteur de la petite enfance et de l'éducation privée est porteur : crèches, écoles Montessori, activités périscolaires. Les besoins en structures d'accueil sont importants.",
    emoji: "🏫",
    tags: ["education", "petite enfance", "enseignement"],
    isActive: true,
    isEssential: false,
    sortOrder: 14,
  },
  {
    title: "Transport de personnes",
    description: "VTC, taxi, déménagement",
    helpText:
      "Le transport de personnes offre plusieurs modèles : VTC, taxi, transport médical, déménagement. La réglementation et la concurrence des plateformes sont des facteurs clés.",
    emoji: "🚗",
    tags: ["transport", "VTC", "mobilite", "services"],
    isActive: true,
    isEssential: false,
    sortOrder: 15,
  },
  {
    title: "Bio / Agriculture urbaine",
    description: "Production locale et circuits courts",
    helpText:
      "L'agriculture urbaine et le bio répondent à une demande croissante de local et de durable. Fermes urbaines, potagers partagés, AMAP : des modèles qui séduisent les consommateurs.",
    emoji: "🥬",
    tags: ["agriculture", "bio", "local", "urban"],
    isActive: true,
    isEssential: false,
    sortOrder: 16,
  },
  {
    title: "Salon de coiffure / Beauté",
    description: "Institut de beauté ou salon",
    helpText:
      "Les salons de coiffure et instituts de beauté restent un choix entrepreneurial solide. La personnalisation, les produits naturels et l'expérience client différencient les acteurs.",
    emoji: "✂️",
    tags: ["beaute", "coiffure", "institut", "services"],
    isActive: true,
    isEssential: false,
    sortOrder: 17,
  },
  {
    title: "Boulangerie / Pâtisserie",
    description: "Artisan boulanger ou pâtissier",
    helpText:
      "La boulangerie-pâtisserie artisanale bénéficie d'un engouement pour le fait-maison. Les concepts premium et la diversification (snacking, traiteur) renforcent la rentabilité.",
    emoji: "🥐",
    tags: ["boulangerie", "patisserie", "artisanat", "food"],
    isActive: true,
    isEssential: false,
    sortOrder: 18,
  },
  {
    title: "Agence de communication",
    description: "Stratégie et création de contenu",
    helpText:
      "Les agences de communication accompagnent les entreprises dans leur stratégie digitale et print. Les métiers : social media, branding, PR, création de contenu. Le marché est dynamique.",
    emoji: "📣",
    tags: ["communication", "marketing", "digital", "agence"],
    isActive: true,
    isEssential: true,
    sortOrder: 19,
  },
  {
    title: "Artiste / Créateur",
    description: "Activité artistique professionnelle",
    helpText:
      "L'artiste entrepreneurial monétise sa création : galeries, e-commerce, commandes, mécénat. Les plateformes en ligne et les réseaux sociaux ouvrent de nouvelles voies de commercialisation.",
    emoji: "🎭",
    tags: ["art", "creation", "culture", "e-commerce"],
    isActive: true,
    isEssential: false,
    sortOrder: 20,
  },
];

async function main() {
  console.log("🌱 Seeding SwipeCards into PostgreSQL...\n");

  // Build the final card data with gradients
  const allCards: SwipeCardData[] = [];

  phase1Cards.forEach((card, i) => {
    allCards.push({ ...card, phase: 1, gradient: phase1Gradients[i] });
  });

  phase2Cards.forEach((card, i) => {
    allCards.push({ ...card, phase: 2, gradient: phase2Gradients[i] });
  });

  phase3Cards.forEach((card, i) => {
    allCards.push({ ...card, phase: 3, gradient: phase3Gradients[i] });
  });

  console.log(`📊 Total cards to insert: ${allCards.length}`);
  console.log(`  Phase 1 (Pépites):      ${phase1Cards.length} cards`);
  console.log(
    `  Phase 2 (Appétences):   ${phase2Cards.length} cards`
  );
  console.log(`  Phase 3 (Métiers):      ${phase3Cards.length} cards`);
  console.log();

  // Check if any cards already exist
  const existingCount = await prisma.swipeCard.count();
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing SwipeCards.`);
    console.log("🗑️  Deleting all existing SwipeCards before seeding...\n");
    await prisma.swipeCard.deleteMany({});
  }

  // Insert all cards using createMany
  const result = await prisma.swipeCard.createMany({
    data: allCards.map((card) => ({
      phase: card.phase,
      title: card.title,
      description: card.description,
      helpText: card.helpText,
      emoji: card.emoji,
      gradient: card.gradient,
      tags: card.tags,
      isActive: card.isActive,
      isEssential: card.isEssential,
      sortOrder: card.sortOrder,
    })),
    skipDuplicates: false,
  });

  console.log(`✅ Successfully inserted ${result.count} SwipeCards!\n`);

  // Verify counts per phase
  const phase1Count = await prisma.swipeCard.count({
    where: { phase: 1 },
  });
  const phase2Count = await prisma.swipeCard.count({
    where: { phase: 2 },
  });
  const phase3Count = await prisma.swipeCard.count({
    where: { phase: 3 },
  });
  const essentialCount = await prisma.swipeCard.count({
    where: { isEssential: true },
  });
  const activeCount = await prisma.swipeCard.count({
    where: { isActive: true },
  });

  console.log("📊 Verification:");
  console.log(`  Phase 1 (Pépines):      ${phase1Count} cards`);
  console.log(`  Phase 2 (Appétences):   ${phase2Count} cards`);
  console.log(`  Phase 3 (Métiers):      ${phase3Count} cards`);
  console.log(`  Essential cards:        ${essentialCount}`);
  console.log(`  Active cards:           ${activeCount}`);
  console.log(`  Total:                  ${phase1Count + phase2Count + phase3Count}`);

  // Show essential cards per phase
  console.log("\n🏷️  Essential cards by phase:");
  for (let p = 1; p <= 3; p++) {
    const essentials = await prisma.swipeCard.findMany({
      where: { phase: p, isEssential: true },
      select: { title: true, emoji: true },
      orderBy: { sortOrder: "asc" },
    });
    const phaseName = p === 1 ? "Pépites" : p === 2 ? "Appétences" : "Métiers";
    console.log(`  Phase ${p} (${phaseName}): ${essentials.length} essential`);
    essentials.forEach((e) => {
      console.log(`    ${e.emoji} ${e.title}`);
    });
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
