// ===========================================
// Pathfinder IA - Store Exports
// ===========================================

// Main Store
export {
  usePathfinderStore,
  // Selector Hooks
  useUser,
  useUserProgress,
  useUserStats,
  useActiveModule,
  useModuleProgress,
  usePepitesGame,
  useCareerMap,
  useJobs,
  useRecommendedJobs,
  useBadges,
  useActionPlan,
  useUI,
  useLanguage,
  useTheme,
  // Action Hooks
  useUserActions,
  useModuleActions,
  usePepitesActions,
  useCareerMapActions,
  useJobsActions,
  useBadgesActions,
  useActionPlanActions,
  useUIActions,
} from './pathfinder-store';

// Re-export types for convenience
export type {
  // Core Types
  Language,
  UserPersona,
  // Pepite Types
  PepiteCategory,
  PepiteLevel,
  Pepite,
  PepiteResponse,
  PepiteCard,
  PepiteGameProgress,
  // Career Path Types
  CareerPathType,
  NodeStatus,
  CareerNode,
  CareerPath,
  // Job Types
  JobSector,
  ExperienceLevel,
  JobRequirement,
  Job,
  // Badge Types
  BadgeRarity,
  BadgeCategory,
  Badge,
  UserBadge,
  // User Types
  UserProfile,
  UserProgress,
  UserStats,
  // Module Types
  ActiveModule,
  ModuleProgress,
  // UI State Types
  Theme,
  UIState,
  Notification,
  // Action Plan Types
  ActionType,
  ActionItem,
  ActionPlan,
  // Store Types
  PathfinderState,
  PathfinderActions,
} from '@/types';
