import {
  MessageCircle, Users, Lightbulb, Target, Wrench, Heart, PenTool, ClipboardList,
  Brain, Zap, Eye, Ear, Hand, Leaf, Shield, Crown, Star, Compass, Globe, Clock,
  DollarSign, TrendingUp, Award, BookOpen, GraduationCap, Palette, Music, Camera,
  Mic, Laptop, Database, Server, Smartphone, Cloud, Lock, Key, Rocket, Plane,
  Car, Bike, Ship, Train, Home, Building, Store, Coffee, UtensilsCrossed, Wine,
  Shirt, Gem, Package, Truck, Factory, Hammer, Wrench as Wrench2, Scissors,
  Baby, HeartHandshake, HandHeart, Speech, Presentation, BarChart3, PieChart,
  FileText, Briefcase, Calendar, CheckCircle, AlertCircle, HelpCircle, Info,
  ThumbsUp, ThumbsDown, ArrowRightLeft, Repeat, Shuffle, Filter, Search, Settings,
  Cog, Sliders, Gauge, Activity, Pulse, HeartPulse, Stethoscope, Pill, Syringe,
  Microscope, Beaker, FlaskConical, Atom, Dna, Gene, Cell, Bacteria, Virus,
  Leaf as Leaf2, TreeDeciduous, Flower2, Apple, Carrot, Wheat, Sun, Moon, CloudRain,
  Wind, Thermometer, Droplets, Waves, Mountain, Map, MapPin, Navigation, Compass as Compass2,
  Anchor, LifeBuoy, Binoculars, Telescope, Radio, Tv, Film, Clapperboard, Theater,
  Gamepad2, Joystick, Dice5, Puzzle, Chess, Trophy, Medal, Ribbon, Crown as Crown2,
  Flag, FlagTriangleRight, Goal, Crosshair, Target as Target2, Circle, Square,
  Diamond, Triangle, Hexagon, Octagon, Pentagon, Star as Star2, Sparkles, Flame,
  Fire, Snowflake, Cloud as Cloud2, CloudLightning, CloudSun, SunMedium, Sunrise, Sunset,
  Scale, Handshake,
  type LucideIcon
} from 'lucide-react';

// ==================== PÉPITES (Super Pouvoirs) ====================
export interface PepiteItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

export const PEPITES_DATA: PepiteItem[] = [
  // Communication & Relations
  { id: 'p1', name: 'Communication efficace', description: 'Capacité à transmettre clairement vos idées et à écouter activement les autres.', category: 'communication', icon: MessageCircle },
  { id: 'p2', name: 'Leadership inspirant', description: 'Capacité à motiver et guider une équipe vers un objectif commun.', category: 'leadership', icon: Users },
  { id: 'p3', name: 'Intelligence émotionnelle', description: 'Capacité à comprendre et gérer vos emotions et celles des autres.', category: 'interpersonal', icon: Heart },
  { id: 'p4', name: 'Négociation', description: 'Capacité à trouver des accords bénéfiques pour toutes les parties.', category: 'communication', icon: PenTool },
  { id: 'p5', name: 'Persuasion', description: 'Art de convaincre et d\'influencer les décisions.', category: 'communication', icon: Speech },
  { id: 'p6', name: 'Écoute active', description: 'Capacité à comprendre profondément les besoins des autres.', category: 'interpersonal', icon: Ear },
  { id: 'p7', name: 'Empathie', description: 'Capacité à se mettre à la place des autres et comprendre leurs sentiments.', category: 'interpersonal', icon: HandHeart },
  { id: 'p8', name: 'Médiation', description: 'Capacité à résoudre les conflits et trouver des compromis.', category: 'interpersonal', icon: HeartHandshake },
  { id: 'p9', name: 'Prise de parole en public', description: 'Aisance et impact lors de présentations devant un auditoire.', category: 'communication', icon: Presentation },
  { id: 'p10', name: 'Storytelling', description: 'Art de raconter des histoires captivantes et mémorables.', category: 'communication', icon: BookOpen },
  
  // Créativité & Innovation
  { id: 'p11', name: 'Pensée créative', description: 'Capacité à générer des idées novatrices et originales.', category: 'creativity', icon: Lightbulb },
  { id: 'p12', name: 'Vision artistique', description: 'Sensibilité esthétique et sens du beau.', category: 'creativity', icon: Palette },
  { id: 'p13', name: 'Innovation', description: 'Capacité à créer de nouvelles solutions et approches.', category: 'creativity', icon: Rocket },
  { id: 'p14', name: 'Design thinking', description: 'Approche centrée sur l\'humain pour résoudre des problèmes.', category: 'creativity', icon: Compass },
  { id: 'p15', name: 'Curiosité intellectuelle', description: 'Soif d\'apprendre et de découvrir de nouveaux domaines.', category: 'learning', icon: Eye },
  { id: 'p16', name: 'Pensée latérale', description: 'Capacité à voir les problèmes sous des angles différents.', category: 'creativity', icon: Shuffle },
  { id: 'p17', name: 'Imagination', description: 'Capacité à visualiser des concepts et possibilités.', category: 'creativity', icon: Sparkles },
  { id: 'p18', name: 'Sensibilité artistique', description: 'Appréciation et compréhension de l\'art et de la culture.', category: 'creativity', icon: Music },
  
  // Stratégie & Analyse
  { id: 'p19', name: 'Vision stratégique', description: 'Capacité à anticiper les tendances et planifier sur le long terme.', category: 'strategy', icon: Target },
  { id: 'p20', name: 'Analyse critique', description: 'Capacité à évaluer objectivement les informations et situations.', category: 'analytical', icon: Search },
  { id: 'p21', name: 'Résolution de problèmes', description: 'Capacité à identifier et résoudre des problèmes complexes.', category: 'analytical', icon: Puzzle },
  { id: 'p22', name: 'Prise de décision', description: 'Capacité à faire des choix éclairés et rapides.', category: 'strategy', icon: CheckCircle },
  { id: 'p23', name: 'Pensée analytique', description: 'Capacité à décomposer des problèmes en éléments gérables.', category: 'analytical', icon: BarChart3 },
  { id: 'p24', name: 'Vision globale', description: 'Capacité à voir l\'ensemble d\'une situation ou organisation.', category: 'strategy', icon: Globe },
  { id: 'p25', name: 'Planification', description: 'Capacité à organiser et structurer les actions dans le temps.', category: 'strategy', icon: Calendar },
  { id: 'p26', name: 'Anticipation', description: 'Capacité à prévoir les évolutions et opportunités futures.', category: 'strategy', icon: Compass2 },
  { id: 'p27', name: 'Esprit de synthèse', description: 'Capacité à résumer et condenser l\'information essentielle.', category: 'analytical', icon: Filter },
  
  // Technique & Expertise
  { id: 'p28', name: 'Maîtrise technique', description: 'Expertise approfondie dans un domaine spécifique.', category: 'technical', icon: Wrench },
  { id: 'p29', name: 'Aptitude numérique', description: 'Facilité avec les chiffres et les calculs.', category: 'analytical', icon: PieChart },
  { id: 'p30', name: 'Maîtrise des langues', description: 'Facilité à apprendre et utiliser plusieurs langues.', category: 'communication', icon: Globe },
  { id: 'p31', name: 'Aisance technologique', description: 'Facilité à comprendre et utiliser les nouvelles technologies.', category: 'technical', icon: Laptop },
  { id: 'p32', name: 'Programmation', description: 'Capacité à coder et développer des solutions logicielles.', category: 'technical', icon: Database },
  { id: 'p33', name: 'Analyse de données', description: 'Capacité à extraire des insights des données.', category: 'analytical', icon: Activity },
  { id: 'p34', name: 'Gestion de projet', description: 'Capacité à planifier, exécuter et livrer des projets.', category: 'management', icon: ClipboardList },
  { id: 'p35', name: 'Méthodologie', description: 'Approche structurée et organisée du travail.', category: 'management', icon: Sliders },
  
  // Gestion & Management
  { id: 'p36', name: 'Gestion d\'équipe', description: 'Capacité à diriger et développer une équipe.', category: 'management', icon: Users },
  { id: 'p37', name: 'Délégation', description: 'Capacité à confier efficacement des tâches.', category: 'management', icon: ArrowRightLeft },
  { id: 'p38', name: 'Gestion du temps', description: 'Capacité à optimiser son temps et ses priorités.', category: 'management', icon: Clock },
  { id: 'p39', name: 'Gestion du budget', description: 'Capacité à gérer efficacement les ressources financières.', category: 'management', icon: DollarSign },
  { id: 'p40', name: 'Gestion du changement', description: 'Capacité à accompagner les transformations.', category: 'management', icon: Repeat },
  { id: 'p41', name: 'Coordination', description: 'Capacité à orchestrer les activités de plusieurs parties.', category: 'management', icon: Settings },
  { id: 'p42', name: 'Organisation', description: 'Capacité à structurer son travail et son environnement.', category: 'management', icon: ClipboardList },
  
  // Résilience & Adaptabilité
  { id: 'p43', name: 'Résilience', description: 'Capacité à rebondir face aux difficultés.', category: 'personal', icon: Shield },
  { id: 'p44', name: 'Adaptabilité', description: 'Capacité à s\'ajuster rapidement aux changements.', category: 'personal', icon: Zap },
  { id: 'p45', name: 'Gestion du stress', description: 'Capacité à rester calme et efficace sous pression.', category: 'personal', icon: Activity },
  { id: 'p46', name: 'Persévérance', description: 'Détermination à poursuivre ses objectifs malgré les obstacles.', category: 'personal', icon: Target },
  { id: 'p47', name: 'Autonomie', description: 'Capacité à travailler de manière indépendante.', category: 'personal', icon: Compass },
  { id: 'p48', name: 'Flexibilité', description: 'Ouverture à changer d\'approche selon les circonstances.', category: 'personal', icon: Shuffle },
  { id: 'p49', name: 'Gestion de l\'échec', description: 'Capacité à tirer des leçons des erreurs.', category: 'personal', icon: HelpCircle },
  { id: 'p50', name: 'Équilibre vie pro/perso', description: 'Capacité à maintenir un équilibre sain.', category: 'personal', icon: Scale },
  
  // Valeurs & Engagement
  { id: 'p51', name: 'Intégrité', description: 'Adhésion à des principes éthiques forts.', category: 'values', icon: Shield },
  { id: 'p52', name: 'Engagement', description: 'Dévouement total à ses objectifs et responsabilités.', category: 'values', icon: Heart },
  { id: 'p53', name: 'Responsabilité', description: 'Prise en charge de ses actions et leurs conséquences.', category: 'values', icon: CheckCircle },
  { id: 'p54', name: 'Sens du service', description: 'Désir d\'aider et de servir les autres.', category: 'interpersonal', icon: HandHeart },
  { id: 'p55', name: 'Altruisme', description: 'Souci du bien-être d\'autrui.', category: 'values', icon: HeartHandshake },
  { id: 'p56', name: 'Stabilité sociale', description: 'Recherche de sécurité et de reconnaissance sociale.', category: 'values', icon: Building },
  { id: 'p57', name: 'Impact social', description: 'Désir de contribuer positivement à la société.', category: 'values', icon: Globe },
  { id: 'p58', name: 'Développement durable', description: 'Engagement pour l\'environnement et les générations futures.', category: 'values', icon: Leaf },
  
  // Apprentissage & Développement
  { id: 'p59', name: 'Soif de connaissances', description: 'Curiosité insatiable et passion pour l\'apprentissage.', category: 'learning', icon: BookOpen },
  { id: 'p60', name: 'Auto-formation', description: 'Capacité à apprendre de manière autonome.', category: 'learning', icon: GraduationCap },
  { id: 'p61', name: 'Enseignement', description: 'Capacité à transmettre ses connaissances.', category: 'interpersonal', icon: Presentation },
  { id: 'p62', name: 'Mentorat', description: 'Capacité à guider le développement des autres.', category: 'leadership', icon: Users },
  { id: 'p63', name: 'Veille informationnelle', description: 'Capacité à rester informé des évolutions.', category: 'learning', icon: Eye },
  { id: 'p64', name: 'Réflexion', description: 'Capacité à penser en profondeur.', category: 'analytical', icon: Brain },
];

// ==================== MÉTIERS ====================
export interface MetierItem {
  id: string;
  name: string;
  description: string;
  sector: string;
  icon: LucideIcon;
}

export const METIERS_DATA: MetierItem[] = [
  // Marketing & Communication
  { id: 'm1', name: 'Directeur Marketing', description: 'Définit la stratégie marketing et pilote les actions de promotion.', sector: 'marketing', icon: TrendingUp },
  { id: 'm2', name: 'Chef de Publicité', description: 'Conçoit et supervise les campagnes publicitaires.', sector: 'marketing', icon: Presentation },
  { id: 'm3', name: 'Directeur de la Communication', description: 'Gère l\'image et la communication de l\'entreprise.', sector: 'marketing', icon: MessageCircle },
  { id: 'm4', name: 'Community Manager', description: 'Anime les communautés sur les réseaux sociaux.', sector: 'marketing', icon: Users },
  { id: 'm5', name: 'Responsable Marketing Digital', description: 'Pilote les stratégies marketing numériques.', sector: 'marketing', icon: Globe },
  { id: 'm6', name: 'Brand Manager', description: 'Développe et protège l\'image de marque.', sector: 'marketing', icon: Star },
  { id: 'm7', name: 'Chargé de Communication Événementielle', description: 'Organise des événements pour promouvoir la marque.', sector: 'marketing', icon: Calendar },
  { id: 'm8', name: 'Content Manager', description: 'Crée et gère le contenu éditorial.', sector: 'marketing', icon: FileText },
  { id: 'm9', name: 'CRM Manager', description: 'Gère la relation client et les bases de données.', sector: 'marketing', icon: Users },
  { id: 'm10', name: 'UX/UI Designer', description: 'Conçoit des interfaces utilisateur intuitives.', sector: 'design', icon: Palette },
  
  // Tech & Digital
  { id: 'm11', name: 'Développeur Full Stack', description: 'Développe des applications web front-end et back-end.', sector: 'tech', icon: Laptop },
  { id: 'm12', name: 'Data Scientist', description: 'Analyse les données pour extraire des insights.', sector: 'tech', icon: Database },
  { id: 'm13', name: 'Product Manager', description: 'Pilote le développement de produits digitaux.', sector: 'tech', icon: Briefcase },
  { id: 'm14', name: 'Tech Lead', description: 'Dirige l\'équipe technique et les choix technologiques.', sector: 'tech', icon: Cog },
  { id: 'm15', name: 'Ingénieur DevOps', description: 'Automatise les déploiements et l\'infrastructure.', sector: 'tech', icon: Server },
  { id: 'm16', name: 'Architecte Logiciel', description: 'Conçoit l\'architecture des systèmes informatiques.', sector: 'tech', icon: Building },
  { id: 'm17', name: 'Data Engineer', description: 'Construit les pipelines de données.', sector: 'tech', icon: Database },
  { id: 'm18', name: 'Cybersecurity Analyst', description: 'Protège les systèmes contre les cyberattaques.', sector: 'tech', icon: Lock },
  { id: 'm19', name: 'AI Engineer', description: 'Développe des solutions d\'intelligence artificielle.', sector: 'tech', icon: Brain },
  { id: 'm20', name: 'Cloud Architect', description: 'Conçoit les infrastructures cloud.', sector: 'tech', icon: Cloud },
  
  // Finance & Banque
  { id: 'm21', name: 'Banquier d\'Affaires', description: 'Conseille les entreprises sur les opérations financières majeures.', sector: 'finance', icon: DollarSign },
  { id: 'm22', name: 'Analyste Financier', description: 'Analyse les performances financières des entreprises.', sector: 'finance', icon: BarChart3 },
  { id: 'm23', name: 'Contrôleur de Gestion', description: 'Pilote les performances et les budgets.', sector: 'finance', icon: PieChart },
  { id: 'm24', name: 'Trésorier', description: 'Gère la trésorerie et les flux financiers.', sector: 'finance', icon: DollarSign },
  { id: 'm25', name: 'Auditeur Financier', description: 'Vérifie la conformité des comptes.', sector: 'finance', icon: Search },
  { id: 'm26', name: 'Gestionnaire de Portefeuille', description: 'Gère les investissements des clients.', sector: 'finance', icon: TrendingUp },
  { id: 'm27', name: 'Risk Manager', description: 'Identifie et gère les risques financiers.', sector: 'finance', icon: Shield },
  { id: 'm28', name: 'Chief Financial Officer (CFO)', description: 'Dirige la fonction finance de l\'entreprise.', sector: 'finance', icon: Briefcase },
  
  // Art & Culture
  { id: 'm29', name: 'Galeriste', description: 'Dirige une galerie d\'art et promeut les artistes.', sector: 'art', icon: Palette },
  { id: 'm30', name: 'Conservateur de Musée', description: 'Gère les collections et les expositions.', sector: 'art', icon: Building },
  { id: 'm31', name: 'Directeur Artistique', description: 'Définit la vision créative des projets.', sector: 'art', icon: Crown },
  { id: 'm32', name: 'Graphiste', description: 'Crée des visuels et des identités graphiques.', sector: 'art', icon: PenTool },
  { id: 'm33', name: 'Illustrateur', description: 'Réalise des illustrations pour différents supports.', sector: 'art', icon: Scissors },
  { id: 'm34', name: 'Photographe', description: 'Capture des images pour divers usages.', sector: 'art', icon: Camera },
  { id: 'm35', name: 'Architecte Intérieur', description: 'Conçoit des espaces intérieurs fonctionnels et esthétiques.', sector: 'art', icon: Home },
  { id: 'm36', name: 'Designer Produit', description: 'Conçoit des produits innovants et ergonomiques.', sector: 'art', icon: Package },
  
  // Diplomatie & Relations Internationales
  { id: 'm37', name: 'Attaché Culturel', description: 'Promeut la culture de son pays à l\'étranger.', sector: 'diplomatie', icon: Globe },
  { id: 'm38', name: 'Conseiller Culturel', description: 'Conseille sur les politiques culturelles.', sector: 'diplomatie', icon: MessageCircle },
  { id: 'm39', name: 'Diplomate', description: 'Représente son pays dans les relations internationales.', sector: 'diplomatie', icon: Award },
  { id: 'm40', name: 'Chargé de Mission International', description: 'Coordonne les projets internationaux.', sector: 'diplomatie', icon: Plane },
  { id: 'm41', name: 'Responsable Export', description: 'Développe les ventes à l\'international.', sector: 'commerce', icon: Globe },
  { id: 'm42', name: 'Trade Marketing Manager', description: 'Développe les stratégies commerciales.', sector: 'commerce', icon: TrendingUp },
  
  // Luxe & Mode
  { id: 'm43', name: 'Directeur Marketing Luxe', description: 'Définit la stratégie marketing pour marques de luxe.', sector: 'luxe', icon: Gem },
  { id: 'm44', name: 'Buyer Mode', description: 'Sélectionne les collections pour les boutiques.', sector: 'luxe', icon: Shirt },
  { id: 'm45', name: 'Styliste', description: 'Crée des collections de vêtements.', sector: 'luxe', icon: Scissors },
  { id: 'm46', name: 'Joaillier', description: 'Crée des bijoux et des pièces précieuses.', sector: 'luxe', icon: Gem },
  { id: 'm47', name: 'Parfumeur', description: 'Compose des fragrances.', sector: 'luxe', icon: Sparkles },
  { id: 'm48', name: 'Responsable Boutique Luxe', description: 'Dirige une boutique de marques prestigieuses.', sector: 'luxe', icon: Store },
  
  // Entrepreneuriat
  { id: 'm49', name: 'Entrepreneur', description: 'Crée et développe son entreprise.', sector: 'entrepreneuriat', icon: Rocket },
  { id: 'm50', name: 'CEO / Directeur Général', description: 'Dirige l\'ensemble des opérations de l\'entreprise.', sector: 'management', icon: Crown },
  { id: 'm51', name: 'Co-fondateur', description: 'Lance et développe une startup avec un partenaire.', sector: 'entrepreneuriat', icon: Users },
  { id: 'm52', name: 'Business Developer', description: 'Identifie et développe de nouvelles opportunités.', sector: 'entrepreneuriat', icon: TrendingUp },
  { id: 'm53', name: 'Consultant Stratégie', description: 'Conseille les entreprises sur leur stratégie.', sector: 'conseil', icon: Target },
  { id: 'm54', name: 'Investisseur', description: 'Finance et accompagne des entreprises.', sector: 'finance', icon: DollarSign },
  
  // Ressources Humaines
  { id: 'm55', name: 'DRH / Directeur RH', description: 'Pilote la politique ressources humaines.', sector: 'rh', icon: Users },
  { id: 'm56', name: 'Recruteur', description: 'Identifie et sélectionne les talents.', sector: 'rh', icon: Search },
  { id: 'm57', name: 'Responsable Formation', description: 'Développe les compétences des collaborateurs.', sector: 'rh', icon: GraduationCap },
  { id: 'm58', name: 'Coach Professionnel', description: 'Accompagne le développement personnel et professionnel.', sector: 'rh', icon: Target },
  { id: 'm59', name: 'Responsable RSE', description: 'Pilote la responsabilité sociétale de l\'entreprise.', sector: 'rh', icon: Leaf },
  
  // Santé & Bien-être
  { id: 'm60', name: 'Médecin', description: 'Diagnostique et traite les maladies.', sector: 'sante', icon: Stethoscope },
  { id: 'm61', name: 'Pharmacien', description: 'Prépare et dispense les médicaments.', sector: 'sante', icon: Pill },
  { id: 'm62', name: 'Psychologue', description: 'Accompagne la santé mentale des patients.', sector: 'sante', icon: Heart },
  { id: 'm63', name: 'Infirmier(ère)', description: 'Soigne et accompagne les patients.', sector: 'sante', icon: HeartPulse },
  { id: 'm64', name: 'Nutritionniste', description: 'Conseille sur l\'alimentation et la santé.', sector: 'sante', icon: Apple },
  
  // Éducation & Recherche
  { id: 'm65', name: 'Professeur Universitaire', description: 'Enseigne et mène des recherches.', sector: 'education', icon: GraduationCap },
  { id: 'm66', name: 'Chercheur', description: 'Mène des travaux de recherche.', sector: 'education', icon: Microscope },
  { id: 'm67', name: 'Formateur', description: 'Transmet des compétences professionnelles.', sector: 'education', icon: Presentation },
  { id: 'm68', name: 'Conseiller Pédagogique', description: 'Accompagne les parcours d\'apprentissage.', sector: 'education', icon: Compass },
  
  // Juridique
  { id: 'm69', name: 'Avocat d\'Affaires', description: 'Conseille les entreprises en droit des affaires.', sector: 'juridique', icon: Scale },
  { id: 'm70', name: 'Juriste d\'Entreprise', description: 'Gère les questions juridiques internes.', sector: 'juridique', icon: FileText },
  { id: 'm71', name: 'Notaire', description: 'Authentifie les actes juridiques.', sector: 'juridique', icon: Key },
  { id: 'm72', name: 'Commissaire-priseur', description: 'Organise les ventes aux enchères.', sector: 'juridique', icon: Award },
  
  // Média & Journalisme
  { id: 'm73', name: 'Journaliste', description: 'Informe et analyse l\'actualité.', sector: 'media', icon: Mic },
  { id: 'm74', name: 'Rédacteur en Chef', description: 'Dirige la rédaction d\'un média.', sector: 'media', icon: PenTool },
  { id: 'm75', name: 'Producteur', description: 'Supervise la production de contenus.', sector: 'media', icon: Clapperboard },
  { id: 'm76', name: 'Réalisateur', description: 'Dirige la création audiovisuelle.', sector: 'media', icon: Film },
  
  // Immobilier
  { id: 'm77', name: 'Agent Immobilier', description: 'Facilite les transactions immobilières.', sector: 'immobilier', icon: Home },
  { id: 'm78', name: 'Promoteur Immobilier', description: 'Développe des projets immobiliers.', sector: 'immobilier', icon: Building },
  { id: 'm79', name: 'Gestionnaire de Biens', description: 'Administre des patrimoines immobiliers.', sector: 'immobilier', icon: Key },
  { id: 'm80', name: 'Architecte', description: 'Conçoit des bâtiments et espaces.', sector: 'immobilier', icon: Building },
];

// ==================== APPÉTENCES (Objectifs/aspirations) ====================
export interface AppetenceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

export const APPETENCES_DATA: AppetenceItem[] = [
  // Leadership & Influence
  { id: 'a1', name: 'Diriger une équipe internationale', description: 'Manager des équipes multiculturelles à travers le monde.', category: 'leadership', icon: Globe },
  { id: 'a2', name: 'Occuper des fonctions stratégiques', description: 'Prendre des décisions majeures pour l\'entreprise.', category: 'leadership', icon: Target },
  { id: 'a3', name: 'Devenir un leader d\'opinion', description: 'Influencer son secteur par son expertise et sa vision.', category: 'influence', icon: Mic },
  { id: 'a4', name: 'Transformer une organisation', description: 'Piloter des changements majeurs et structurants.', category: 'leadership', icon: Repeat },
  { id: 'a5', name: 'Former la prochaine génération', description: 'Transmettre son savoir et accompagner les talents.', category: 'leadership', icon: GraduationCap },
  
  // Entrepreneuriat
  { id: 'a6', name: 'Créer son entreprise', description: 'Lancer son propre projet entrepreneurial.', category: 'entrepreneuriat', icon: Rocket },
  { id: 'a7', name: 'Créer une galerie d\'art innovante', description: 'Ouvrir un espace créatif adapté aux nouvelles technologies.', category: 'creation', icon: Palette },
  { id: 'a8', name: 'Développer une startup tech', description: 'Construire une entreprise technologique à fort impact.', category: 'entrepreneuriat', icon: Laptop },
  { id: 'a9', name: 'Investir dans des projets innovants', description: 'Financer et accompagner des entrepreneurs.', category: 'investissement', icon: DollarSign },
  { id: 'a10', name: 'Franchir le cap de l\'indépendance', description: 'Travailler en freelance ou consultant indépendant.', category: 'autonomie', icon: Compass },
  
  // Impact & Sens
  { id: 'a11', name: 'Avoir un impact social positif', description: 'Contribuer à des causes qui comptent.', category: 'impact', icon: Heart },
  { id: 'a12', name: 'Travailler pour le développement durable', description: 'Agir pour l\'environnement et les générations futures.', category: 'impact', icon: Leaf },
  { id: 'a13', name: 'S\'engager dans l\'humanitaire', description: 'Aider les populations en difficulté.', category: 'impact', icon: HandHeart },
  { id: 'a14', name: 'Lutter contre les inégalités', description: 'Contribuer à une société plus juste.', category: 'impact', icon: Scale },
  { id: 'a15', name: 'Transformer son secteur', description: 'Innovations et changements disruptifs.', category: 'impact', icon: Zap },
  
  // Excellence & Reconnaissance
  { id: 'a16', name: 'Devenir expert reconnu', description: 'Être la référence dans son domaine.', category: 'excellence', icon: Award },
  { id: 'a17', name: 'Obtenir une reconnaissance internationale', description: 'Être reconnu au-delà des frontières.', category: 'excellence', icon: Globe },
  { id: 'a18', name: 'Publier un livre', description: 'Partager son expertise à travers l\'écriture.', category: 'creation', icon: BookOpen },
  { id: 'a19', name: 'Intégrer un comité de direction', description: 'Participer aux décisions stratégiques.', category: 'leadership', icon: Crown },
  { id: 'a20', name: 'Recevoir des distinctions', description: 'Être récompensé pour son travail.', category: 'excellence', icon: Trophy },
  
  // International
  { id: 'a21', name: 'Travailler à l\'international', description: 'Exercer son métier dans plusieurs pays.', category: 'international', icon: Plane },
  { id: 'a22', name: 'Vivre à l\'étranger', description: 'S\'installer dans un autre pays.', category: 'international', icon: Home },
  { id: 'a23', name: 'Maîtriser plusieurs langues', description: 'Communiquer couramment en plusieurs langues.', category: 'international', icon: MessageCircle },
  { id: 'a24', name: 'Représenter son pays à l\'étranger', description: 'Servir de pont entre les cultures.', category: 'international', icon: Globe },
  { id: 'a25', name: 'Travailler dans le luxe international', description: 'Exercer dans l\'industrie du luxe mondiale.', category: 'luxe', icon: Gem },
  
  // Créativité & Expression
  { id: 'a26', name: 'Exprimer sa créativité', description: 'Donner vie à ses idées créatives.', category: 'creation', icon: Palette },
  { id: 'a27', name: 'Créer des œuvres artistiques', description: 'Produire des pièces uniques et personnelles.', category: 'creation', icon: Sparkles },
  { id: 'a28', name: 'Développer des produits innovants', description: 'Concevoir des solutions nouvelles.', category: 'innovation', icon: Lightbulb },
  { id: 'a29', name: 'Designer des expériences uniques', description: 'Créer des moments mémorables.', category: 'creation', icon: Star },
  { id: 'a30', name: 'Écrire et publier', description: 'Partager ses idées par l\'écriture.', category: 'creation', icon: PenTool },
  
  // Équilibre & Bien-être
  { id: 'a31', name: 'Trouver l\'équilibre vie pro/perso', description: 'Harmoniser travail et vie personnelle.', category: 'equilibre', icon: Scale },
  { id: 'a32', name: 'Travailler en liberté', description: 'Avoir la flexibilité dans l\'organisation.', category: 'autonomie', icon: Compass },
  { id: 'a33', name: 'Développer sa passion', description: 'Vivre de ce qui nous passionne.', category: 'equilibre', icon: Heart },
  { id: 'a34', name: 'Préserver sa santé', description: 'Maintenir un mode de vie sain.', category: 'equilibre', icon: HeartPulse },
  { id: 'a35', name: 'Prendre du temps pour soi', description: 'S\'accorder des moments de ressourcement.', category: 'equilibre', icon: Sun },
  
  // Fortune & Réussite
  { id: 'a36', name: 'Atteindre l\'indépendance financière', description: 'Ne plus dépendre d\'un salaire.', category: 'finance', icon: DollarSign },
  { id: 'a37', name: 'Construire un patrimoine', description: 'Accumuler et gérer des actifs.', category: 'finance', icon: Building },
  { id: 'a38', name: 'Gagner en responsabilité', description: 'Évoluer vers des postes à fort impact.', category: 'leadership', icon: TrendingUp },
  { id: 'a39', name: 'Négocier un package attractif', description: 'Obtenir une rémunération à la hauteur.', category: 'finance', icon: Briefcase },
  { id: 'a40', name: 'Créer de la valeur', description: 'Générer des résultats significatifs.', category: 'impact', icon: Target },
  
  // Apprentissage & Croissance
  { id: 'a41', name: 'Apprendre en continu', description: 'Ne jamais cesser de se former.', category: 'apprentissage', icon: BookOpen },
  { id: 'a42', name: 'Explorer de nouveaux domaines', description: 'Élargir ses horizons professionnels.', category: 'apprentissage', icon: Compass },
  { id: 'a43', name: 'Développer de nouvelles compétences', description: 'Acquérir des expertises variées.', category: 'apprentissage', icon: GraduationCap },
  { id: 'a44', name: 'Suivre des formations prestigieuses', description: 'Intégrer les meilleures écoles/programmes.', category: 'excellence', icon: Award },
  { id: 'a45', name: 'Obtenir un doctorat', description: 'Approfondir la recherche académique.', category: 'apprentissage', icon: Microscope },
  
  // Réseau & Relations
  { id: 'a46', name: 'Construire un réseau solide', description: 'Développer des relations professionnelles durables.', category: 'relations', icon: Users },
  { id: 'a47', name: 'Collaborer avec des experts', description: 'Travailler avec les meilleurs de son secteur.', category: 'relations', icon: Handshake },
  { id: 'a48', name: 'Mentorer des talents', description: 'Accompagner le développement des autres.', category: 'leadership', icon: Users },
  { id: 'a49', name: 'Participer à des conseils d\'administration', description: 'Apporter son expertise stratégique.', category: 'leadership', icon: Building },
  { id: 'a50', name: 'Rejoindre des cercles d\'influence', description: 'Intégrer des réseaux d\'élite.', category: 'influence', icon: Crown },
];

// Helper function to get random subset
export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get stage data
export function getStageData(stage: 'pepites' | 'metiers' | 'appetences', count: number = 20) {
  switch (stage) {
    case 'pepites':
      return getRandomItems(PEPITES_DATA, count);
    case 'metiers':
      return getRandomItems(METIERS_DATA, count);
    case 'appetences':
      return getRandomItems(APPETENCES_DATA, count);
    default:
      return [];
  }
}
