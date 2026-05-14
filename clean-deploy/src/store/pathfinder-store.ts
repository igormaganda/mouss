// ===========================================
// Pathfinder IA - Zustand Store
// ===========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  PathfinderState,
  PathfinderActions,
  UserProfile,
  UserProgress,
  UserStats,
  ActiveModule,
  ModuleProgress,
  PepiteCard,
  PepiteResponse,
  PepiteGameProgress,
  Pepite,
  CareerPath,
  NodeStatus,
  Job,
  UserBadge,
  ActionPlan,
  ActionItem,
  Theme,
  Language,
  Notification,
  UserPersona,
} from '@/types';

// ===========================================
// Default State Values
// ===========================================

const defaultUserProgress: UserProgress = {
  pepites: {
    discovered: [],
    selected: [],
    gameCompleted: false,
  },
  careerMap: {
    activePath: null,
    completedNodes: [],
    inProgressNodes: [],
  },
  badges: [],
  overallProgress: 0,
};

const defaultUserStats: UserStats = {
  totalPepitesDiscovered: 0,
  totalNodesCompleted: 0,
  totalBadgesEarned: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const defaultModuleProgress: ModuleProgress = {
  discovery: {
    started: false,
    completed: false,
    currentStep: 0,
    totalSteps: 5,
  },
  'career-map': {
    started: false,
    completed: false,
    currentStep: 0,
    totalSteps: 4,
  },
  action: {
    started: false,
    completed: false,
    currentStep: 0,
    totalSteps: 3,
  },
};

const defaultPepiteGameProgress: PepiteGameProgress = {
  totalCards: 0,
  revealedCards: 0,
  selectedPepites: [],
  currentPhase: 'intro',
};

const defaultUIState = {
  language: 'fr' as Language,
  theme: 'system' as Theme,
  sidebarOpen: true,
  notifications: [],
};

// ===========================================
// Initial State
// ===========================================

const initialState: PathfinderState = {
  // User State
  user: null,
  userProgress: defaultUserProgress,
  userStats: defaultUserStats,
  
  // Module State
  activeModule: 'discovery',
  moduleProgress: defaultModuleProgress,
  
  // Pepites Game State
  pepites: {
    cards: [],
    responses: [],
    gameProgress: defaultPepiteGameProgress,
  },
  
  // Career Map State
  careerMap: {
    paths: [],
    selectedPath: null,
    selectedNode: null,
    hoveredNode: null,
  },
  
  // Jobs State
  jobs: [],
  recommendedJobs: [],
  
  // Badges State
  badges: [],
  
  // Action Plan State
  actionPlan: null,
  
  // UI State
  ui: defaultUIState,
  
  // Loading States
  isLoading: false,
  error: null,
};

// ===========================================
// Store Creation with Persistence
// ===========================================

export const usePathfinderStore = create<PathfinderState & PathfinderActions>()(
  persist(
    (set, get) => ({
      // -------------------------------------------
      // Initial State
      // -------------------------------------------
      ...initialState,

      // -------------------------------------------
      // User Actions
      // -------------------------------------------
      setUser: (user: UserProfile | null) => {
        set({ user });
      },

      updateUserProfile: (updates: Partial<UserProfile>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
              lastActiveAt: Date.now(),
            },
          });
        }
      },

      setPersona: (persona: UserPersona) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              persona,
              lastActiveAt: Date.now(),
            },
          });
        }
      },

      setLanguage: (language: Language) => {
        const { user, ui } = get();
        set({
          ui: { ...ui, language },
          user: user ? { ...user, language, lastActiveAt: Date.now() } : null,
        });
      },

      // -------------------------------------------
      // Module Actions
      // -------------------------------------------
      setActiveModule: (module: ActiveModule) => {
        set({ activeModule: module });
      },

      updateModuleProgress: (module: ActiveModule, updates: Partial<ModuleProgress[ActiveModule]>) => {
        const { moduleProgress } = get();
        set({
          moduleProgress: {
            ...moduleProgress,
            [module]: {
              ...moduleProgress[module],
              ...updates,
            },
          },
        });
      },

      // -------------------------------------------
      // Pepites Actions
      // -------------------------------------------
      initializePepiteCards: (pepites: Pepite[]) => {
        const cards: PepiteCard[] = pepites.map((pepite, index) => ({
          id: `card-${index}`,
          pepite,
          position: index,
          flipped: false,
          revealed: false,
        }));

        set({
          pepites: {
            cards,
            responses: [],
            gameProgress: {
              totalCards: cards.length,
              revealedCards: 0,
              selectedPepites: [],
              currentPhase: 'selection',
            },
          },
        });
      },

      revealCard: (cardId: string) => {
        const { pepites, userProgress } = get();
        const card = pepites.cards.find((c) => c.id === cardId);
        
        if (card && !card.revealed) {
          const updatedCards = pepites.cards.map((c) =>
            c.id === cardId ? { ...c, revealed: true, flipped: true } : c
          );

          const newDiscovered = [...new Set([...userProgress.pepites.discovered, card.pepite.id])];

          set({
            pepites: {
              ...pepites,
              cards: updatedCards,
              gameProgress: {
                ...pepites.gameProgress,
                revealedCards: pepites.gameProgress.revealedCards + 1,
              },
            },
            userProgress: {
              ...userProgress,
              pepites: {
                ...userProgress.pepites,
                discovered: newDiscovered,
              },
            },
            userStats: {
              ...get().userStats,
              totalPepitesDiscovered: newDiscovered.length,
            },
          });
        }
      },

      selectPepite: (pepiteId: string, selected: boolean) => {
        const { pepites, userProgress } = get();
        
        const newResponses: PepiteResponse[] = [
          ...pepites.responses.filter((r) => r.pepiteId !== pepiteId),
          {
            pepiteId,
            selected,
            timestamp: Date.now(),
          },
        ];

        const newSelectedPepites = selected
          ? [...new Set([...pepites.gameProgress.selectedPepites, pepiteId])]
          : pepites.gameProgress.selectedPepites.filter((id) => id !== pepiteId);

        const newUserSelected = selected
          ? [...new Set([...userProgress.pepites.selected, pepiteId])]
          : userProgress.pepites.selected.filter((id) => id !== pepiteId);

        set({
          pepites: {
            ...pepites,
            responses: newResponses,
            gameProgress: {
              ...pepites.gameProgress,
              selectedPepites: newSelectedPepites,
            },
          },
          userProgress: {
            ...userProgress,
            pepites: {
              ...userProgress.pepites,
              selected: newUserSelected,
            },
          },
        });
      },

      setGamePhase: (phase: PepiteGameProgress['currentPhase']) => {
        const { pepites, userProgress } = get();
        
        const updates: Partial<PathfinderState> = {
          pepites: {
            ...pepites,
            gameProgress: {
              ...pepites.gameProgress,
              currentPhase: phase,
            },
          },
        };

        if (phase === 'completed') {
          updates.userProgress = {
            ...userProgress,
            pepites: {
              ...userProgress.pepites,
              gameCompleted: true,
            },
          };
          updates.moduleProgress = {
            ...get().moduleProgress,
            discovery: {
              ...get().moduleProgress.discovery,
              completed: true,
            },
          };
        }

        set(updates);
      },

      resetPepiteGame: () => {
        const { pepites } = get();
        set({
          pepites: {
            cards: pepites.cards.map((card) => ({
              ...card,
              flipped: false,
              revealed: false,
            })),
            responses: [],
            gameProgress: {
              ...defaultPepiteGameProgress,
              totalCards: pepites.cards.length,
            },
          },
        });
      },

      // -------------------------------------------
      // Career Map Actions
      // -------------------------------------------
      setCareerPaths: (paths: CareerPath[]) => {
        set({
          careerMap: {
            ...get().careerMap,
            paths,
          },
        });
      },

      selectPath: (pathId: string | null) => {
        const { careerMap, userProgress, moduleProgress } = get();
        
        const updates: Partial<PathfinderState> = {
          careerMap: {
            ...careerMap,
            selectedPath: pathId,
            selectedNode: null,
          },
        };

        if (pathId && !moduleProgress['career-map'].started) {
          updates.moduleProgress = {
            ...moduleProgress,
            'career-map': {
              ...moduleProgress['career-map'],
              started: true,
            },
          };
        }

        if (pathId) {
          updates.userProgress = {
            ...userProgress,
            careerMap: {
              ...userProgress.careerMap,
              activePath: pathId,
            },
          };
        }

        set(updates);
      },

      selectNode: (nodeId: string | null) => {
        const { careerMap } = get();
        set({
          careerMap: {
            ...careerMap,
            selectedNode: nodeId,
          },
        });
      },

      hoverNode: (nodeId: string | null) => {
        const { careerMap } = get();
        set({
          careerMap: {
            ...careerMap,
            hoveredNode: nodeId,
          },
        });
      },

      updateNodeStatus: (nodeId: string, status: NodeStatus) => {
        const { careerMap, userProgress, userStats } = get();
        
        const updatedPaths = careerMap.paths.map((path) => ({
          ...path,
          nodes: path.nodes.map((node) =>
            node.id === nodeId ? { ...node, status } : node
          ),
        }));

        let newCompletedNodes = userProgress.careerMap.completedNodes;
        let newInProgressNodes = userProgress.careerMap.inProgressNodes;

        if (status === 'completed') {
          newCompletedNodes = [...new Set([...newCompletedNodes, nodeId])];
          newInProgressNodes = newInProgressNodes.filter((id) => id !== nodeId);
        } else if (status === 'in-progress') {
          newInProgressNodes = [...new Set([...newInProgressNodes, nodeId])];
        } else {
          newCompletedNodes = newCompletedNodes.filter((id) => id !== nodeId);
          newInProgressNodes = newInProgressNodes.filter((id) => id !== nodeId);
        }

        set({
          careerMap: {
            ...careerMap,
            paths: updatedPaths,
          },
          userProgress: {
            ...userProgress,
            careerMap: {
              ...userProgress.careerMap,
              completedNodes: newCompletedNodes,
              inProgressNodes: newInProgressNodes,
            },
          },
          userStats: {
            ...userStats,
            totalNodesCompleted: newCompletedNodes.length,
          },
        });
      },

      // -------------------------------------------
      // Jobs Actions
      // -------------------------------------------
      setJobs: (jobs: Job[]) => {
        set({ jobs });
      },

      setRecommendedJobs: (jobs: Job[]) => {
        set({ recommendedJobs: jobs });
      },

      // -------------------------------------------
      // Badges Actions
      // -------------------------------------------
      setBadges: (badges: UserBadge[]) => {
        set({ badges });
      },

      earnBadge: (badgeId: string) => {
        const { badges, userProgress, userStats } = get();
        
        const updatedBadges = badges.map((badge) =>
          badge.id === badgeId
            ? { ...badge, earned: true, earnedAt: Date.now(), progress: badge.maxProgress }
            : badge
        );

        const newEarnedBadges = [...new Set([...userProgress.badges, badgeId])];

        set({
          badges: updatedBadges,
          userProgress: {
            ...userProgress,
            badges: newEarnedBadges,
          },
          userStats: {
            ...userStats,
            totalBadgesEarned: newEarnedBadges.length,
          },
        });
      },

      updateBadgeProgress: (badgeId: string, progress: number) => {
        const { badges } = get();
        
        const updatedBadges = badges.map((badge) =>
          badge.id === badgeId ? { ...badge, progress } : badge
        );

        set({ badges: updatedBadges });
      },

      // -------------------------------------------
      // Action Plan Actions
      // -------------------------------------------
      setActionPlan: (plan: ActionPlan | null) => {
        set({ actionPlan: plan });
      },

      addActionItem: (item: ActionItem) => {
        const { actionPlan } = get();
        
        if (actionPlan) {
          set({
            actionPlan: {
              ...actionPlan,
              items: [...actionPlan.items, item],
              updatedAt: Date.now(),
            },
          });
        }
      },

      updateActionItem: (itemId: string, updates: Partial<ActionItem>) => {
        const { actionPlan } = get();
        
        if (actionPlan) {
          set({
            actionPlan: {
              ...actionPlan,
              items: actionPlan.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
              updatedAt: Date.now(),
            },
          });
        }
      },

      removeActionItem: (itemId: string) => {
        const { actionPlan } = get();
        
        if (actionPlan) {
          set({
            actionPlan: {
              ...actionPlan,
              items: actionPlan.items.filter((item) => item.id !== itemId),
              updatedAt: Date.now(),
            },
          });
        }
      },

      completeActionItem: (itemId: string) => {
        const { actionPlan } = get();
        
        if (actionPlan) {
          set({
            actionPlan: {
              ...actionPlan,
              items: actionPlan.items.map((item) =>
                item.id === itemId ? { ...item, completed: true } : item
              ),
              updatedAt: Date.now(),
            },
          });
        }
      },

      // -------------------------------------------
      // UI Actions
      // -------------------------------------------
      setTheme: (theme: Theme) => {
        const { ui } = get();
        set({ ui: { ...ui, theme } });
      },

      toggleSidebar: () => {
        const { ui } = get();
        set({ ui: { ...ui, sidebarOpen: !ui.sidebarOpen } });
      },

      addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const { ui } = get();
        const newNotification: Notification = {
          ...notification,
          id: `notification-${Date.now()}`,
          timestamp: Date.now(),
          read: false,
        };
        set({
          ui: {
            ...ui,
            notifications: [newNotification, ...ui.notifications].slice(0, 50), // Keep last 50 notifications
          },
        });
      },

      markNotificationRead: (notificationId: string) => {
        const { ui } = get();
        set({
          ui: {
            ...ui,
            notifications: ui.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          },
        });
      },

      clearNotifications: () => {
        const { ui } = get();
        set({ ui: { ...ui, notifications: [] } });
      },

      // -------------------------------------------
      // Loading & Error Actions
      // -------------------------------------------
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // -------------------------------------------
      // Utility Actions
      // -------------------------------------------
      reset: () => {
        set(initialState);
      },

      hydrate: (state: Partial<PathfinderState>) => {
        set({ ...initialState, ...state });
      },
    }),
    {
      name: 'pathfinder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        userProgress: state.userProgress,
        userStats: state.userStats,
        moduleProgress: state.moduleProgress,
        pepites: {
          responses: state.pepites.responses,
          gameProgress: state.pepites.gameProgress,
        },
        careerMap: {
          selectedPath: state.careerMap.selectedPath,
        },
        badges: state.badges,
        actionPlan: state.actionPlan,
        ui: state.ui,
      }),
    }
  )
);

// ===========================================
// Selector Hooks
// ===========================================

export const useUser = () => usePathfinderStore((state) => state.user);
export const useUserProgress = () => usePathfinderStore((state) => state.userProgress);
export const useUserStats = () => usePathfinderStore((state) => state.userStats);
export const useActiveModule = () => usePathfinderStore((state) => state.activeModule);
export const useModuleProgress = () => usePathfinderStore((state) => state.moduleProgress);
export const usePepitesGame = () => usePathfinderStore((state) => state.pepites);
export const useCareerMap = () => usePathfinderStore((state) => state.careerMap);
export const useJobs = () => usePathfinderStore((state) => state.jobs);
export const useRecommendedJobs = () => usePathfinderStore((state) => state.recommendedJobs);
export const useBadges = () => usePathfinderStore((state) => state.badges);
export const useActionPlan = () => usePathfinderStore((state) => state.actionPlan);
export const useUI = () => usePathfinderStore((state) => state.ui);
export const useLanguage = () => usePathfinderStore((state) => state.ui.language);
export const useTheme = () => usePathfinderStore((state) => state.ui.theme);

// ===========================================
// Action Hooks
// ===========================================

export const useUserActions = () =>
  usePathfinderStore((state) => ({
    setUser: state.setUser,
    updateUserProfile: state.updateUserProfile,
    setPersona: state.setPersona,
    setLanguage: state.setLanguage,
  }));

export const useModuleActions = () =>
  usePathfinderStore((state) => ({
    setActiveModule: state.setActiveModule,
    updateModuleProgress: state.updateModuleProgress,
  }));

export const usePepitesActions = () =>
  usePathfinderStore((state) => ({
    initializePepiteCards: state.initializePepiteCards,
    revealCard: state.revealCard,
    selectPepite: state.selectPepite,
    setGamePhase: state.setGamePhase,
    resetPepiteGame: state.resetPepiteGame,
  }));

export const useCareerMapActions = () =>
  usePathfinderStore((state) => ({
    setCareerPaths: state.setCareerPaths,
    selectPath: state.selectPath,
    selectNode: state.selectNode,
    hoverNode: state.hoverNode,
    updateNodeStatus: state.updateNodeStatus,
  }));

export const useJobsActions = () =>
  usePathfinderStore((state) => ({
    setJobs: state.setJobs,
    setRecommendedJobs: state.setRecommendedJobs,
  }));

export const useBadgesActions = () =>
  usePathfinderStore((state) => ({
    setBadges: state.setBadges,
    earnBadge: state.earnBadge,
    updateBadgeProgress: state.updateBadgeProgress,
  }));

export const useActionPlanActions = () =>
  usePathfinderStore((state) => ({
    setActionPlan: state.setActionPlan,
    addActionItem: state.addActionItem,
    updateActionItem: state.updateActionItem,
    removeActionItem: state.removeActionItem,
    completeActionItem: state.completeActionItem,
  }));

export const useUIActions = () =>
  usePathfinderStore((state) => ({
    setTheme: state.setTheme,
    toggleSidebar: state.toggleSidebar,
    addNotification: state.addNotification,
    markNotificationRead: state.markNotificationRead,
    clearNotifications: state.clearNotifications,
  }));
