// ===========================================
// Pathfinder IA - TypeScript Types
// ===========================================

// Language Support
export type Language = 'fr' | 'ar';

// User Persona Types
export type UserPersona = 'explorer' | 'launcher' | 'pivot' | 'ambitious';

// Persona descriptions (for reference)
export const PERSONA_DESCRIPTIONS: Record<UserPersona, Record<Language, string>> = {
  explorer: {
    fr: 'Vous explorez différentes options de carrière et cherchez à découvrir vos talents cachés',
    ar: 'تستكشف خيارات مهنية مختلفة وتبحث عن اكتشاف مواهبك المخفية',
  },
  launcher: {
    fr: 'Vous êtes prêt à lancer votre carrière et cherchez les meilleures opportunités',
    ar: 'أنت مستعد لإطلاق مسيرتك المهنية وتبحث عن أفضل الفرص',
  },
  pivot: {
    fr: 'Vous envisagez une réorientation professionnelle et cherchez de nouvelles voies',
    ar: 'تفكر في إعادة توجيه مهني وتبحث عن مسارات جديدة',
  },
  ambitious: {
    fr: 'Vous visez des postes de leadership et cherchez à accélérer votre progression',
    ar: 'تطمح إلى مناصب قيادية وتبحث عن تسريع تقدمك المهني',
  },
};

// ===========================================
// Pepite (Soft Skill) Types
// ===========================================

export type PepiteCategory = 
  | 'communication'
  | 'leadership'
  | 'creativity'
  | 'problem-solving'
  | 'teamwork'
  | 'adaptability'
  | 'organization'
  | 'emotional-intelligence';

export type PepiteLevel = 1 | 2 | 3 | 4 | 5;

export interface Pepite {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: PepiteCategory;
  icon: string;
  color: string;
}

export interface PepiteResponse {
  pepiteId: string;
  selected: boolean;
  timestamp: number;
}

export interface PepiteCard {
  id: string;
  pepite: Pepite;
  position: number;
  flipped: boolean;
  revealed: boolean;
}

export interface PepiteGameProgress {
  totalCards: number;
  revealedCards: number;
  selectedPepites: string[];
  currentPhase: 'intro' | 'selection' | 'result' | 'completed';
}

// ===========================================
// Career Path Types
// ===========================================

export type CareerPathType = 
  | 'tech'
  | 'creative'
  | 'business'
  | 'healthcare'
  | 'education'
  | 'trades'
  | 'public-service'
  | 'entrepreneurship';

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface CareerNode {
  id: string;
  pathId: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  type: 'milestone' | 'skill' | 'certification' | 'experience' | 'job';
  status: NodeStatus;
  position: { x: number; y: number };
  dependencies: string[];
  estimatedDuration: string;
  requiredPepites: string[];
  linkedJobs: string[];
}

export interface CareerPath {
  id: string;
  type: CareerPathType;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  color: string;
  nodes: CareerNode[];
  totalNodes: number;
  completedNodes: number;
  recommended: boolean;
}

// ===========================================
// Job Types
// ===========================================

export type JobSector = 
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'retail'
  | 'manufacturing'
  | 'services'
  | 'government'
  | 'non-profit';

export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'executive';

export interface JobRequirement {
  pepiteId: string;
  importance: 'preferred' | 'required' | 'critical';
}

export interface Job {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  sector: JobSector;
  experienceLevel: ExperienceLevel;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  location: Record<Language, string>;
  remote: boolean;
  requirements: JobRequirement[];
  linkedNodes: string[];
  matchScore?: number;
}

// ===========================================
// Badge Types
// ===========================================

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type BadgeCategory = 
  | 'discovery'
  | 'achievement'
  | 'milestone'
  | 'skill'
  | 'special';

export interface Badge {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  earnedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface UserBadge extends Badge {
  earned: boolean;
  earnedAt: number | null;
  progress: number;
  maxProgress: number;
}

// ===========================================
// User Types
// ===========================================

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  persona: UserPersona | null;
  language: Language;
  createdAt: number;
  lastActiveAt: number;
}

export interface UserProgress {
  pepites: {
    discovered: string[];
    selected: string[];
    gameCompleted: boolean;
  };
  careerMap: {
    activePath: string | null;
    completedNodes: string[];
    inProgressNodes: string[];
  };
  badges: string[];
  overallProgress: number;
}

export interface UserStats {
  totalPepitesDiscovered: number;
  totalNodesCompleted: number;
  totalBadgesEarned: number;
  streakDays: number;
  lastActiveDate: string;
}

// ===========================================
// Module Types
// ===========================================

export type ActiveModule = 'discovery' | 'career-map' | 'action';

export interface ModuleProgress {
  discovery: {
    started: boolean;
    completed: boolean;
    currentStep: number;
    totalSteps: number;
  };
  'career-map': {
    started: boolean;
    completed: boolean;
    currentStep: number;
    totalSteps: number;
  };
  action: {
    started: boolean;
    completed: boolean;
    currentStep: number;
    totalSteps: number;
  };
}

// ===========================================
// UI State Types
// ===========================================

export type Theme = 'light' | 'dark' | 'system';

export interface UIState {
  language: Language;
  theme: Theme;
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: Record<Language, string>;
  message: Record<Language, string>;
  timestamp: number;
  read: boolean;
}

// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: Record<Language, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===========================================
// Action Plan Types
// ===========================================

export type ActionType = 'course' | 'certification' | 'experience' | 'networking' | 'application';

export interface ActionItem {
  id: string;
  type: ActionType;
  title: Record<Language, string>;
  description: Record<Language, string>;
  dueDate?: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  linkedNodeId?: string;
  linkedJobId?: string;
}

export interface ActionPlan {
  id: string;
  userId: string;
  items: ActionItem[];
  createdAt: number;
  updatedAt: number;
}

// ===========================================
// Store State Types
// ===========================================

export interface PathfinderState {
  // User State
  user: UserProfile | null;
  userProgress: UserProgress;
  userStats: UserStats;
  
  // Module State
  activeModule: ActiveModule;
  moduleProgress: ModuleProgress;
  
  // Pepites Game State
  pepites: {
    cards: PepiteCard[];
    responses: PepiteResponse[];
    gameProgress: PepiteGameProgress;
  };
  
  // Career Map State
  careerMap: {
    paths: CareerPath[];
    selectedPath: string | null;
    selectedNode: string | null;
    hoveredNode: string | null;
  };
  
  // Jobs State
  jobs: Job[];
  recommendedJobs: Job[];
  
  // Badges State
  badges: UserBadge[];
  
  // Action Plan State
  actionPlan: ActionPlan | null;
  
  // UI State
  ui: UIState;
  
  // Loading States
  isLoading: boolean;
  error: string | null;
}

export interface PathfinderActions {
  // User Actions
  setUser: (user: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setPersona: (persona: UserPersona) => void;
  setLanguage: (language: Language) => void;
  
  // Module Actions
  setActiveModule: (module: ActiveModule) => void;
  updateModuleProgress: (module: ActiveModule, updates: Partial<ModuleProgress[ActiveModule]>) => void;
  
  // Pepites Actions
  initializePepiteCards: (pepites: Pepite[]) => void;
  revealCard: (cardId: string) => void;
  selectPepite: (pepiteId: string, selected: boolean) => void;
  setGamePhase: (phase: PepiteGameProgress['currentPhase']) => void;
  resetPepiteGame: () => void;
  
  // Career Map Actions
  setCareerPaths: (paths: CareerPath[]) => void;
  selectPath: (pathId: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  
  // Jobs Actions
  setJobs: (jobs: Job[]) => void;
  setRecommendedJobs: (jobs: Job[]) => void;
  
  // Badges Actions
  setBadges: (badges: UserBadge[]) => void;
  earnBadge: (badgeId: string) => void;
  updateBadgeProgress: (badgeId: string, progress: number) => void;
  
  // Action Plan Actions
  setActionPlan: (plan: ActionPlan | null) => void;
  addActionItem: (item: ActionItem) => void;
  updateActionItem: (itemId: string, updates: Partial<ActionItem>) => void;
  removeActionItem: (itemId: string) => void;
  completeActionItem: (itemId: string) => void;
  
  // UI Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Loading & Error Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility Actions
  reset: () => void;
  hydrate: (state: Partial<PathfinderState>) => void;
}
