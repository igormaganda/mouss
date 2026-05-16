import { create } from 'zustand'

export type AppView = 'landing' | 'auth' | 'dashboard'
export type UserRole = 'user' | 'counselor' | 'admin'
export type EtapeNumber = 1 | 2 | 3 | 4 | 5
export type UserTab =
  | 'profil'
  | 'parcours-creteur'
  | 'bilan'
  | 'riasec'
  | 'motivations'
  | 'juridique'
  | 'competences'
  | 'marche'
  | 'financier'
  | 'strategie'
  | 'financement'
  | 'changement-echelle'
  | 'tableau-de-bord'
  | 'outils'
  | 'annuaire'
  | 'inscription'
  | 'forum'
  | 'mentorat'
  | 'actualites'
  | 'evenements'
  | 'recherche-emploi'
  | 'parcours'
  | 'notifications'
  | 'bilan-coherence'
  | 'export-bp'
  | 'rapport-diagnostic'
export type CounselorTab =
  | 'entretien'
  | 'ai-copilote'
  | 'notes'
  | 'chat-marche'
  | 'go-nogo'
  | 'livrables'
  | 'collaboration'
  | 'synthese'
export type AdminTab =
  | 'vue-ensemble'
  | 'gestion-modulaire'
  | 'monitoring'
  | 'handicap'
  | 'partenariats'
  | 'indicateurs'

interface AccessibilitySettings {
  textSize: number
  highContrast: boolean
  readingLine: boolean
  readingMask: boolean
  dyslexicFont: boolean
  pauseAnimations: boolean
}

interface AppState {
  // Navigation
  currentView: AppView
  currentRole: UserRole
  sidebarOpen: boolean
  mobileNavOpen: boolean

  // Tab states
  userTab: UserTab
  counselorTab: CounselorTab
  adminTab: AdminTab

  // Étape (step) tracking for user journey
  currentEtape: EtapeNumber

  // Auth
  isLoggedIn: boolean
  userName: string
  userEmail: string
  userId: string | null

  // Accessibility
  accessibility: AccessibilitySettings

  // Module completion tracking
  completedModules: Record<string, boolean>

  // Actions
  setView: (view: AppView) => void
  setRole: (role: UserRole) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void

  setUserTab: (tab: UserTab) => void
  setCounselorTab: (tab: CounselorTab) => void
  setAdminTab: (tab: AdminTab) => void

  setEtape: (etape: EtapeNumber) => void

  login: (name: string, email: string, id?: string) => void
  logout: () => void

  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void

  // Gatekeeper actions
  completeModule: (moduleName: string) => void
  getLockedTabs: () => string[]
  isTabAccessible: (tab: string) => boolean
  getProgressPercent: () => number
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: 'landing',
  currentRole: 'user',
  sidebarOpen: true,
  mobileNavOpen: false,

  // Tab states
  userTab: 'profil',
  counselorTab: 'entretien',
  adminTab: 'vue-ensemble',

  // Étape tracking
  currentEtape: 1,

  // Auth
  isLoggedIn: false,
  userName: '',
  userEmail: '',
  userId: null,

  // Accessibility
  accessibility: {
    textSize: 100,
    highContrast: false,
    readingLine: false,
    readingMask: false,
    dyslexicFont: false,
    pauseAnimations: false,
  },

  // Module completion tracking
  completedModules: {
    profil: false,       // Step 0: Profile validated via PUT /api/profile
    parcours: false,     // Step 1: Parcours Créateur completed
    bilan: false,        // Step 2: Bilan Découverte done
    riasec: false,       // Step 3: RIASEC completed
    pepites: false,      // Step 4: Pépites (swipe game) completed
    motivation: false,   // Step 5: Motivations completed
  } as Record<string, boolean>,

  // Actions
  setView: (view) => set({ currentView: view }),
  setRole: (role) => set({ currentRole: role }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  setUserTab: (tab) => set({ userTab: tab }),
  setCounselorTab: (tab) => set({ counselorTab: tab }),
  setAdminTab: (tab) => set({ adminTab: tab }),

  setEtape: (etape) => set({ currentEtape: etape }),

  login: (name, email, id) => set({
    isLoggedIn: true,
    userName: name,
    userEmail: email,
    userId: id || null,
    currentView: 'dashboard',
  }),
  logout: () => set({
    isLoggedIn: false,
    currentView: 'landing',
    currentRole: 'user',
    userTab: 'profil',
    userId: null,
    currentEtape: 1,
  }),

  updateAccessibility: (settings) =>
    set((s) => ({ accessibility: { ...s.accessibility, ...settings } })),

  // Gatekeeper actions
  completeModule: (moduleName) =>
    set((s) => ({
      completedModules: { ...s.completedModules, [moduleName]: true },
    })),

  getLockedTabs: () => {
    const state = get()
    const locked: string[] = []
    if (!state.completedModules.profil) {
      locked.push(
        'parcours-creteur', 'bilan', 'riasec', 'motivations', 'competences',
        'marche', 'financier', 'strategie', 'financement', 'changement-echelle',
        'juridique', 'outils', 'rapport-diagnostic', 'export-bp',
      )
    }
    if (!state.completedModules.profil || !state.completedModules.parcours) {
      if (!locked.includes('rapport-diagnostic')) {
        locked.push('rapport-diagnostic')
      }
    }
    return locked
  },

  isTabAccessible: (tab: string) => {
    return !get().getLockedTabs().includes(tab)
  },

  getProgressPercent: () => {
    const modules = Object.keys(get().completedModules)
    const completed = modules.filter((m) => get().completedModules[m]).length
    return Math.round((completed / modules.length) * 100)
  },
}))
