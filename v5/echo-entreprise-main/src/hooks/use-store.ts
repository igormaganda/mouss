import { create } from 'zustand'

export type AppView = 'landing' | 'auth' | 'dashboard'
export type UserRole = 'user' | 'counselor' | 'admin'
export type UserTab =
  | 'profil'
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

  // Auth
  isLoggedIn: boolean
  userName: string
  userEmail: string
  userId: string | null

  // Accessibility
  accessibility: AccessibilitySettings

  // Actions
  setView: (view: AppView) => void
  setRole: (role: UserRole) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void

  setUserTab: (tab: UserTab) => void
  setCounselorTab: (tab: CounselorTab) => void
  setAdminTab: (tab: AdminTab) => void

  login: (name: string, email: string, id?: string) => void
  logout: () => void

  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentView: 'landing',
  currentRole: 'user',
  sidebarOpen: true,
  mobileNavOpen: false,

  // Tab states
  userTab: 'profil',
  counselorTab: 'entretien',
  adminTab: 'vue-ensemble',

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

  // Actions
  setView: (view) => set({ currentView: view }),
  setRole: (role) => set({ currentRole: role }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  setUserTab: (tab) => set({ userTab: tab }),
  setCounselorTab: (tab) => set({ counselorTab: tab }),
  setAdminTab: (tab) => set({ adminTab: tab }),

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
  }),

  updateAccessibility: (settings) =>
    set((s) => ({ accessibility: { ...s.accessibility, ...settings } })),
}))
