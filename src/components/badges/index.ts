// Badge Components
export {
  BadgeDisplay,
  BadgeDetail,
  RARITY_CONFIG,
  CATEGORY_CONFIG,
  type BadgeData,
  type BadgeRarity,
  type BadgeCategory,
} from "./BadgeDisplay";

export {
  BadgeGrid,
  BadgeGridGrouped,
} from "./BadgeGrid";

export {
  BadgeNotification,
  BadgeNotificationManager,
  InlineCelebration,
} from "./BadgeNotification";

export {
  BadgeProgress,
  MiniBadgeProgress,
} from "./BadgeProgress";

export {
  CertificateGenerator,
  CertificatePreviewCard,
  CertificateTemplate,
  ShareCertificateModal,
} from "./CertificateGenerator";

// Badge definitions for the application
export const BADGE_DEFINITIONS = [
  {
    id: "explorateur",
    name: "Explorateur",
    description: "Completez le jeu des pepites et decouvrez vos talents cachés",
    icon: "trophy",
    emoji: "🗺️",
    category: "exploration" as const,
    rarity: "common" as const,
    points: 100,
    criteria: "Complete the pepites game",
  },
  {
    id: "navigateur",
    name: "Navigateur",
    description: "Consultez la carte des carrieres et explorez les possibilites",
    icon: "star",
    emoji: "🧭",
    category: "exploration" as const,
    rarity: "common" as const,
    points: 50,
    criteria: "View career map",
  },
  {
    id: "lanceur",
    name: "Lanceur",
    description: "Envoyez votre premiere candidature et lancez votre carrière",
    icon: "award",
    emoji: "🚀",
    category: "achievement" as const,
    rarity: "rare" as const,
    points: 150,
    criteria: "First job application",
  },
  {
    id: "strateg",
    name: "Stratege",
    description: "Analysez vos ecarts de competences et planifiez votre evolution",
    icon: "trophy",
    emoji: "♟️",
    category: "completion" as const,
    rarity: "epic" as const,
    points: 200,
    criteria: "Complete skill gap analysis",
  },
  {
    id: "ambitieux",
    name: "Ambitieux",
    description: "Definissez votre objectif de carrière et visez le succes",
    icon: "star",
    emoji: "🎯",
    category: "exploration" as const,
    rarity: "common" as const,
    points: 100,
    criteria: "Set career target",
  },
  {
    id: "raconteur",
    name: "Raconteur",
    description: "Creez votre identite professionnelle unique",
    icon: "award",
    emoji: "✨",
    category: "achievement" as const,
    rarity: "rare" as const,
    points: 150,
    criteria: "Generate career identity",
  },
  {
    id: "visionnaire",
    name: "Visionnaire",
    description: "Explorez vos aspirations avec le jeu de la loterie",
    icon: "star",
    emoji: "🔮",
    category: "exploration" as const,
    rarity: "common" as const,
    points: 100,
    criteria: "Complete lottery aspirations",
  },
  {
    id: "entretien-pro",
    name: "Entretien Pro",
    description: "Preparez-vous efficacement pour vos entretiens",
    icon: "award",
    emoji: "💼",
    category: "completion" as const,
    rarity: "common" as const,
    points: 100,
    criteria: "Prepare for interview",
  },
  {
    id: "candidat-or",
    name: "Candidat Or",
    description: "Generez une lettre de motivation personnalisée",
    icon: "trophy",
    emoji: "📝",
    category: "achievement" as const,
    rarity: "rare" as const,
    points: 100,
    criteria: "Generate cover letter",
  },
  {
    id: "maitre-cv",
    name: "Maitre du CV",
    description: "Importez et analysez votre CV pour l'optimiser",
    icon: "crown",
    emoji: "📄",
    category: "completion" as const,
    rarity: "epic" as const,
    points: 200,
    criteria: "Import and analyze CV",
  },
] as const;

// Helper function to get badge by ID
export function getBadgeById(id: string) {
  return BADGE_DEFINITIONS.find((badge) => badge.id === id);
}

// Helper function to calculate total points from earned badges
export function calculateTotalPoints(earnedBadgeIds: string[]) {
  return earnedBadgeIds.reduce((total, id) => {
    const badge = getBadgeById(id);
    return total + (badge?.points || 0);
  }, 0);
}

// Helper function to get badges by category
export function getBadgesByCategory(category: "exploration" | "completion" | "achievement") {
  return BADGE_DEFINITIONS.filter((badge) => badge.category === category);
}

// Helper function to get badges by rarity
export function getBadgesByRarity(rarity: "common" | "rare" | "epic" | "legendary") {
  return BADGE_DEFINITIONS.filter((badge) => badge.rarity === rarity);
}
