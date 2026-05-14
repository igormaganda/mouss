// ==================== VECTEURS PROJECTEURS ====================
// Système d'aspirations profondes qui projettent vers des métiers

import {
  Sparkles, Heart, DollarSign, Globe, Users, Lightbulb, Shield, Zap,
  Palette, Leaf, Award, Target, Compass, Crown, Rocket, Brain,
  Wrench, MessageCircle, GraduationCap, Building, Star, Briefcase,
  type LucideIcon
} from 'lucide-react';

// Types
export interface ProjectorVector {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  keywords: string[];
  relatedJobs: string[];
}

export interface AspirationKeyword {
  id: string;
  word: string;
  vectorId: string;
  weight: number; // Importance de ce mot-clé pour le vecteur
}

export interface UserVectorScore {
  vectorId: string;
  score: number; // 0-100
  keywords: string[]; // Mots-clés sélectionnés
}

export interface FinalObjective {
  sentence: string;
  vectors: UserVectorScore[];
  jobMatches: JobMatch[];
}

export interface JobMatch {
  jobId: string;
  title: string;
  matchScore: number;
  matchedVectors: string[];
}

// 8 Vecteurs Projecteurs principaux
export const PROJECTOR_VECTORS: ProjectorVector[] = [
  {
    id: 'innovation',
    name: 'Innovation',
    description: 'Créer, inventer, transformer les choses',
    icon: Lightbulb,
    color: '#F59E0B',
    gradient: 'from-amber-400 to-orange-500',
    keywords: ['créativité', 'invention', 'disruption', 'nouveau', 'pionnier', 'breakthrough', 'R&D', 'prototype'],
    relatedJobs: ['Chercheur', 'Designer Produit', 'Entrepreneur', 'Architecte', 'Directeur Innovation']
  },
  {
    id: 'sante',
    name: 'Santé & Bien-être',
    description: 'Aider les autres à vivre mieux',
    icon: Heart,
    color: '#EC4899',
    gradient: 'from-pink-400 to-rose-500',
    keywords: ['soins', 'guérison', 'bien-être', 'thérapie', 'prévention', 'patient', 'médical', 'psychoologie'],
    relatedJobs: ['Médecin', 'Psychologue', 'Coach', 'Infirmier', 'Nutritionniste', 'Pharmacien']
  },
  {
    id: 'finance',
    name: 'Finance & Réussite',
    description: 'Construire la richesse et le succès matériel',
    icon: DollarSign,
    color: '#10B981',
    gradient: 'from-emerald-400 to-teal-500',
    keywords: ['argent', 'investissement', 'rentabilité', 'business', 'profit', 'croissance', 'fortune', 'patrimoine'],
    relatedJobs: ['Banquier d\'Affaires', 'Investisseur', 'Entrepreneur', 'Trader', 'Chief Financial Officer']
  },
  {
    id: 'social',
    name: 'Impact Social',
    description: 'Changer la société et aider les autres',
    icon: Users,
    color: '#8B5CF6',
    gradient: 'from-violet-400 to-purple-500',
    keywords: ['solidarité', 'justice', 'égalité', 'humanitaire', 'engagement', 'communauté', 'association', 'bénévolat'],
    relatedJobs: ['Travailleur Social', 'Responsable RSE', 'Politicien', 'Directeur ONG', 'Avocat']
  },
  {
    id: 'international',
    name: 'International',
    description: 'Voyager et travailler à l\'échelle mondiale',
    icon: Globe,
    color: '#06B6D4',
    gradient: 'from-cyan-400 to-blue-500',
    keywords: ['voyage', 'monde', 'cultures', 'langues', 'export', 'global', 'diplomatie', 'ambassade'],
    relatedJobs: ['Diplomate', 'Responsable Export', 'Consultant International', 'Journaliste', 'Attaché Culturel']
  },
  {
    id: 'art',
    name: 'Art & Création',
    description: 'Exprimer sa créativité par l\'art',
    icon: Palette,
    color: '#F43F5E',
    gradient: 'from-rose-400 to-pink-500',
    keywords: ['beauté', 'esthétique', 'design', 'musique', 'image', 'style', 'création', 'expression'],
    relatedJobs: ['Artiste', 'Designer', 'Réalisateur', 'Architecte', 'Directeur Artistique', 'Galeriste']
  },
  {
    id: 'leadership',
    name: 'Leadership & Pouvoir',
    description: 'Diriger, influencer et transformer',
    icon: Crown,
    color: '#A855F7',
    gradient: 'from-purple-400 to-violet-500',
    keywords: ['direction', 'management', 'stratégie', 'influence', 'décision', 'pouvoir', 'vision', 'ambition'],
    relatedJobs: ['CEO', 'Directeur Général', 'Politicien', 'Entrepreneur', 'Directeur Marketing']
  },
  {
    id: 'environnement',
    name: 'Environnement',
    description: 'Protéger la planète et agir pour le futur',
    icon: Leaf,
    color: '#22C55E',
    gradient: 'from-green-400 to-emerald-500',
    keywords: ['écologie', 'durable', 'climat', 'nature', 'vert', 'planète', 'RSE', 'énergie'],
    relatedJobs: ['Ingénieur Environnement', 'Responsable Développement Durable', 'Consultant RSE', 'Chercheur Climat']
  },
];

// Mots-clés pour la loterie (pool de mots qui apparaissent aléatoirement)
export const LOTTERY_KEYWORDS: AspirationKeyword[] = [
  // Innovation
  { id: 'kw-1', word: 'Créativité', vectorId: 'innovation', weight: 10 },
  { id: 'kw-2', word: 'Invention', vectorId: 'innovation', weight: 9 },
  { id: 'kw-3', word: 'Disruption', vectorId: 'innovation', weight: 8 },
  { id: 'kw-4', word: 'Prototype', vectorId: 'innovation', weight: 7 },
  { id: 'kw-5', word: 'R&D', vectorId: 'innovation', weight: 8 },
  
  // Santé
  { id: 'kw-6', word: 'Soins', vectorId: 'sante', weight: 10 },
  { id: 'kw-7', word: 'Guérison', vectorId: 'sante', weight: 9 },
  { id: 'kw-8', word: 'Bien-être', vectorId: 'sante', weight: 8 },
  { id: 'kw-9', word: 'Thérapie', vectorId: 'sante', weight: 7 },
  { id: 'kw-10', word: 'Prévention', vectorId: 'sante', weight: 7 },
  
  // Finance
  { id: 'kw-11', word: 'Argent', vectorId: 'finance', weight: 10 },
  { id: 'kw-12', word: 'Investissement', vectorId: 'finance', weight: 9 },
  { id: 'kw-13', word: 'Profit', vectorId: 'finance', weight: 8 },
  { id: 'kw-14', word: 'Business', vectorId: 'finance', weight: 9 },
  { id: 'kw-15', word: 'Croissance', vectorId: 'finance', weight: 8 },
  
  // Social
  { id: 'kw-16', word: 'Solidarité', vectorId: 'social', weight: 10 },
  { id: 'kw-17', word: 'Justice', vectorId: 'social', weight: 9 },
  { id: 'kw-18', word: 'Égalité', vectorId: 'social', weight: 8 },
  { id: 'kw-19', word: 'Humanitaire', vectorId: 'social', weight: 9 },
  { id: 'kw-20', word: 'Engagement', vectorId: 'social', weight: 8 },
  
  // International
  { id: 'kw-21', word: 'Voyage', vectorId: 'international', weight: 10 },
  { id: 'kw-22', word: 'Monde', vectorId: 'international', weight: 9 },
  { id: 'kw-23', word: 'Cultures', vectorId: 'international', weight: 8 },
  { id: 'kw-24', word: 'Langues', vectorId: 'international', weight: 8 },
  { id: 'kw-25', word: 'Diplomatie', vectorId: 'international', weight: 9 },
  
  // Art
  { id: 'kw-26', word: 'Beauté', vectorId: 'art', weight: 10 },
  { id: 'kw-27', word: 'Esthétique', vectorId: 'art', weight: 9 },
  { id: 'kw-28', word: 'Design', vectorId: 'art', weight: 8 },
  { id: 'kw-29', word: 'Musique', vectorId: 'art', weight: 8 },
  { id: 'kw-30', word: 'Expression', vectorId: 'art', weight: 9 },
  
  // Leadership
  { id: 'kw-31', word: 'Direction', vectorId: 'leadership', weight: 10 },
  { id: 'kw-32', word: 'Stratégie', vectorId: 'leadership', weight: 9 },
  { id: 'kw-33', word: 'Influence', vectorId: 'leadership', weight: 8 },
  { id: 'kw-34', word: 'Décision', vectorId: 'leadership', weight: 9 },
  { id: 'kw-35', word: 'Vision', vectorId: 'leadership', weight: 8 },
  
  // Environnement
  { id: 'kw-36', word: 'Écologie', vectorId: 'environnement', weight: 10 },
  { id: 'kw-37', word: 'Durable', vectorId: 'environnement', weight: 9 },
  { id: 'kw-38', word: 'Climat', vectorId: 'environnement', weight: 9 },
  { id: 'kw-39', word: 'Nature', vectorId: 'environnement', weight: 8 },
  { id: 'kw-40', word: 'Planète', vectorId: 'environnement', weight: 8 },
  
  // Mots neutres (peuvent aller vers plusieurs vecteurs)
  { id: 'kw-41', word: 'Liberté', vectorId: 'leadership', weight: 5 },
  { id: 'kw-42', word: 'Passion', vectorId: 'art', weight: 5 },
  { id: 'kw-43', word: 'Succès', vectorId: 'finance', weight: 5 },
  { id: 'kw-44', word: 'Aventure', vectorId: 'international', weight: 5 },
  { id: 'kw-45', word: 'Sens', vectorId: 'social', weight: 5 },
  { id: 'kw-46', word: 'Équilibre', vectorId: 'sante', weight: 5 },
  { id: 'kw-47', word: 'Transformation', vectorId: 'innovation', weight: 5 },
  { id: 'kw-48', word: 'Futur', vectorId: 'environnement', weight: 5 },
];

// Métiers avec leurs vecteurs associés et scores
export interface JobWithVectors {
  id: string;
  title: string;
  description: string;
  sector: string;
  icon: LucideIcon;
  vectorScores: Record<string, number>; // Score par vecteur (0-100)
  salaryMin: number;
  salaryMax: number;
  growthRate: number;
  requirements: string[];
}

// Exemples de métiers avec leurs vecteurs
export const JOBS_WITH_VECTORS: JobWithVectors[] = [
  {
    id: 'job-1',
    title: 'Directeur Marketing Luxe',
    description: 'Définit la stratégie marketing pour marques de prestige à dimension internationale',
    sector: 'marketing',
    icon: Star,
    vectorScores: { leadership: 80, finance: 70, international: 85, art: 75, innovation: 60 },
    salaryMin: 90000,
    salaryMax: 150000,
    growthRate: 15,
    requirements: ['Marketing', 'Luxury Brand Management', 'Stratégie', 'International']
  },
  {
    id: 'job-2',
    title: 'Entrepreneur Tech',
    description: 'Crée et développe une startup technologique innovante',
    sector: 'entrepreneuriat',
    icon: Rocket,
    vectorScores: { innovation: 95, leadership: 85, finance: 75, social: 30, international: 60 },
    salaryMin: 0,
    salaryMax: 500000,
    growthRate: 25,
    requirements: ['Vision', 'Gestion de Projet', 'Tech', 'Business Model']
  },
  {
    id: 'job-3',
    title: 'Médecin',
    description: 'Diagnostique et traite les patients avec un impact direct sur leur santé',
    sector: 'sante',
    icon: Heart,
    vectorScores: { sante: 100, social: 70, leadership: 50, finance: 60, innovation: 40 },
    salaryMin: 60000,
    salaryMax: 200000,
    growthRate: 8,
    requirements: ['Médecine', 'Empathie', 'Rigueur', 'Formation Continue']
  },
  {
    id: 'job-4',
    title: 'Diplomate',
    description: 'Représente son pays et négocie des accords internationaux',
    sector: 'diplomatie',
    icon: Globe,
    vectorScores: { international: 100, leadership: 80, social: 75, finance: 40, innovation: 30 },
    salaryMin: 45000,
    salaryMax: 120000,
    growthRate: 5,
    requirements: ['Relations Internationales', 'Langues', 'Négociation', 'Culture Générale']
  },
  {
    id: 'job-5',
    title: 'Designer Produit',
    description: 'Conçoit des produits innovants et ergonomiques',
    sector: 'design',
    icon: Palette,
    vectorScores: { art: 90, innovation: 85, leadership: 40, sante: 30, environnement: 50 },
    salaryMin: 40000,
    salaryMax: 80000,
    growthRate: 12,
    requirements: ['Design', 'UX/UI', 'Prototypage', 'Créativité']
  },
  {
    id: 'job-6',
    title: 'Responsable RSE',
    description: 'Pilote la responsabilité sociétale et environnementale de l\'entreprise',
    sector: 'conseil',
    icon: Leaf,
    vectorScores: { environnement: 95, social: 90, leadership: 60, innovation: 50, finance: 30 },
    salaryMin: 50000,
    salaryMax: 90000,
    growthRate: 20,
    requirements: ['Développement Durable', 'Communication', 'Stratégie', 'Reporting']
  },
  {
    id: 'job-7',
    title: 'Investisseur / VC',
    description: 'Finance et accompagne des entreprises à fort potentiel',
    sector: 'finance',
    icon: DollarSign,
    vectorScores: { finance: 100, leadership: 80, innovation: 70, international: 60, social: 20 },
    salaryMin: 80000,
    salaryMax: 500000,
    growthRate: 18,
    requirements: ['Finance', 'Analyse', 'Réseau', 'Vision Business']
  },
  {
    id: 'job-8',
    title: 'Directeur Artistique',
    description: 'Définit la vision créative de projets artistiques ou publicitaires',
    sector: 'art',
    icon: Crown,
    vectorScores: { art: 95, leadership: 85, innovation: 80, finance: 40, international: 50 },
    salaryMin: 50000,
    salaryMax: 120000,
    growthRate: 10,
    requirements: ['Direction Artistique', 'Créativité', 'Management', 'Vision']
  },
  {
    id: 'job-9',
    title: 'Chercheur en IA',
    description: 'Développe des algorithmes d\'intelligence artificielle révolutionnaires',
    sector: 'tech',
    icon: Brain,
    vectorScores: { innovation: 100, leadership: 40, finance: 50, social: 30, international: 70 },
    salaryMin: 60000,
    salaryMax: 200000,
    growthRate: 30,
    requirements: ['Machine Learning', 'Python', 'Mathématiques', 'Recherche']
  },
  {
    id: 'job-10',
    title: 'Galeriste',
    description: 'Dirige une galerie d\'art et promeut des artistes émergents',
    sector: 'art',
    icon: Palette,
    vectorScores: { art: 90, leadership: 60, finance: 60, international: 70, social: 50 },
    salaryMin: 30000,
    salaryMax: 150000,
    growthRate: 5,
    requirements: ['Histoire de l\'Art', 'Réseau', 'Business', 'Passion']
  },
];

// Fonction pour calculer le score de compatibilité entre un utilisateur et un métier
export function calculateJobCompatibility(
  userVectorScores: UserVectorScore[],
  job: JobWithVectors
): number {
  let totalScore = 0;
  let totalWeight = 0;

  userVectorScores.forEach(userVector => {
    const jobVectorScore = job.vectorScores[userVector.vectorId] || 0;
    const weight = userVector.score;
    totalScore += (userVector.score * jobVectorScore) / 100;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

// Fonction pour obtenir les meilleurs métiers correspondants
export function getTopJobMatches(
  userVectorScores: UserVectorScore[],
  limit: number = 5
): JobMatch[] {
  const matches = JOBS_WITH_VECTORS.map(job => ({
    jobId: job.id,
    title: job.title,
    matchScore: calculateJobCompatibility(userVectorScores, job),
    matchedVectors: Object.keys(job.vectorScores).filter(
      v => job.vectorScores[v] > 50
    ),
  }));

  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

// Fonction pour générer une phrase d'objectif final
export function generateFinalObjective(
  userVectorScores: UserVectorScore[],
  selectedKeywords: string[]
): string {
  const topVectors = userVectorScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topVectorNames = topVectors.map(v => {
    const vector = PROJECTOR_VECTORS.find(pv => pv.id === v.vectorId);
    return vector?.name.toLowerCase() || '';
  });

  // Templates de phrases basés sur les vecteurs dominants
  const templates = [
    `Contribuer à l'${topVectorNames[0]} tout en développant ${topVectorNames[1] || 'des compétences clés'}`,
    `Allier ${topVectorNames[0]} et ${topVectorNames[1] || 'passion'} dans un environnement ${topVectorNames[2] || 'stimulant'}`,
    `Créer de la valeur par l'${topVectorNames[0]} avec un impact ${topVectorNames[1] || 'positif'}`,
    `Exercer un leadership dans le domaine ${topVectorNames[0]} avec une dimension ${topVectorNames[1] || 'internationale'}`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
