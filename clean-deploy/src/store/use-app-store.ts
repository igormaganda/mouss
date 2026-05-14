import { create } from 'zustand'

// ============================================
// TYPES
// ============================================

export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'admin/dashboard'
  | 'admin/wedges'
  | 'admin/clients'
  | 'admin/newsletters'
  | 'admin/analytics'
  | 'admin/contacts'
  | 'admin/settings'
  | 'admin/validation'
  | 'admin/revenue'
  | 'client/dashboard'
  | 'client/ads'
  | 'client/ads/new'
  | 'client/subscription'
  | 'client/analytics'
  | 'client/profile'
  | 'client/notifications'
  | 'client/credits'
  | 'legal/mentions'
  | 'legal/cgv'
  | 'legal/privacy'
  | 'legal/cookies'
  | 'about'
  | 'blog'
  | 'blog/post'
  | 'careers'
  | 'contact'
  | 'case-studies'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  phone?: string
  role: 'ADMIN' | 'CLIENT'
  avatarUrl?: string
  credits?: number
  isActive?: boolean
  createdAt?: string
  adCount?: number
  totalSpent?: number
  totalOpens?: number
  totalClicks?: number
  activeSubscription?: {
    id: string
    plan: string
    status: string
    newsletterQuota: number
    newslettersUsed: number
    wedgeQuota: number
    currentPeriodEnd?: string
  } | null
}

export interface Wedge {
  id: string
  name: string
  sector: string
  region: string
  department?: string
  description?: string
  frequency: string
  sendTime: string
  sendDays: string
  maxAdsPerNewsletter: number
  template: string
  status: string
  subscriberCount: number
  totalSent: number
  avgOpenRate: number
  avgClickRate: number
  createdAt: string
  updatedAt: string
}

export interface Ad {
  id: string
  title: string
  description: string
  sector: string
  region: string
  budget: number
  cta: string
  destinationUrl: string
  logoUrl?: string
  images?: string
  status: string
  rejectionReason?: string
  scheduledDate?: string
  sentAt?: string
  openCount: number
  clickCount: number
  createdAt: string
  updatedAt: string
  clientId: string
  client?: User
  wedgeId: string
  wedge?: Wedge
}

export interface Newsletter {
  id: string
  subject: string
  editorialContent?: string
  aiArticle1?: string
  aiArticle2?: string
  questionOfMonth?: string
  status: string
  sentAt?: string
  scheduledAt?: string
  recipientCount: number
  openCount: number
  clickCount: number
  unsubscribeCount: number
  bounceCount: number
  spamComplaints: number
  createdAt: string
  updatedAt: string
  wedgeId: string
  wedge?: Wedge
}

export interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  sector: string
  postalCode: string
  department: string
  region: string
  jobTitle?: string
  companySize?: string
  status: string
  source?: string
  engagementScore: number
  createdAt: string
  updatedAt: string
}

export interface AppNotification {
  id: string
  type: 'ad_approved' | 'ad_rejected' | 'ad_sent' | 'newsletter' | 'credits' | 'subscription' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

export interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd?: string
  newsletterQuota: number
  newslettersUsed: number
  wedgeQuota: number
  createdAt: string
}

// ============================================
// APP STATE STORE
// ============================================

interface AppState {
  // Navigation
  currentView: AppView
  viewParams: Record<string, string>
  sidebarOpen: boolean

  // Auth
  user: User | null
  isAuthenticated: boolean

  // Data
  wedges: Wedge[]
  ads: Ad[]
  newsletters: Newsletter[]
  contacts: Contact[]
  subscriptions: Subscription[]

  // Loading states
  loading: boolean
  error: string | null

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null

  // Actions - Navigation
  navigate: (view: AppView, params?: Record<string, string>) => void
  goBack: () => void
  setSidebarOpen: (open: boolean) => void

  // Actions - Auth
  login: (user: User) => void
  logout: () => void

  // Actions - Data
  setWedges: (wedges: Wedge[]) => void
  addWedge: (wedge: Wedge) => void
  updateWedge: (id: string, data: Partial<Wedge>) => void
  deleteWedge: (id: string) => void

  setAds: (ads: Ad[]) => void
  addAd: (ad: Ad) => void
  updateAd: (id: string, data: Partial<Ad>) => void
  deleteAd: (id: string) => void

  setNewsletters: (newsletters: Newsletter[]) => void
  addNewsletter: (newsletter: Newsletter) => void
  updateNewsletter: (id: string, data: Partial<Newsletter>) => void

  setContacts: (contacts: Contact[]) => void
  setSubscriptions: (subs: Subscription[]) => void

  // Actions - Auth extended
  updateUser: (data: Partial<User>) => void

  // Actions - Notifications
  notifications: AppNotification[]
  setNotifications: (notifications: AppNotification[]) => void
  addNotification: (notification: AppNotification) => void
  markNotificationRead: (id: string) => void
  unreadCount: number

  // Actions - UI
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

const navHistory: AppView[] = []

export const useAppStore = create<AppState>()(
    (set, get) => ({
      // Navigation
      currentView: 'landing',
      viewParams: {},
      sidebarOpen: false,

      // Auth
      user: null,
      isAuthenticated: false,

      // Data
      wedges: [],
      ads: [],
      newsletters: [],
      contacts: [],
      subscriptions: [],

      // Loading
      loading: false,
      error: null,

      // Toast
      toast: null,

      // Navigation actions
      navigate: (view, params = {}) => {
        const state = get()
        if (state.currentView !== view) {
          navHistory.push(state.currentView)
        }
        set({ currentView: view, viewParams: params, error: null })
      },

      goBack: () => {
        const prev = navHistory.pop()
        if (prev) {
          set({ currentView: prev, viewParams: {}, error: null })
        }
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Auth actions
      login: (user) => {
        set({ user, isAuthenticated: true })
        if (user.role === 'ADMIN') {
          set({ currentView: 'admin/dashboard' })
        } else {
          set({ currentView: 'client/dashboard' })
        }
      },

      logout: () => {
        navHistory.length = 0
        set({
          user: null,
          isAuthenticated: false,
          currentView: 'landing',
          wedges: [],
          ads: [],
          newsletters: [],
          contacts: [],
          subscriptions: [],
        })
      },

      // Data actions
      setWedges: (wedges) => set({ wedges }),
      addWedge: (wedge) => set((s) => ({ wedges: [...s.wedges, wedge] })),
      updateWedge: (id, data) =>
        set((s) => ({
          wedges: s.wedges.map((w) => (w.id === id ? { ...w, ...data } : w)),
        })),
      deleteWedge: (id) =>
        set((s) => ({ wedges: s.wedges.filter((w) => w.id !== id) })),

      setAds: (ads) => set({ ads }),
      addAd: (ad) => set((s) => ({ ads: [...s.ads, ad] })),
      updateAd: (id, data) =>
        set((s) => ({
          ads: s.ads.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAd: (id) =>
        set((s) => ({ ads: s.ads.filter((a) => a.id !== id) })),

      setNewsletters: (newsletters) => set({ newsletters }),
      addNewsletter: (newsletter) =>
        set((s) => ({ newsletters: [...s.newsletters, newsletter] })),
      updateNewsletter: (id, data) =>
        set((s) => ({
          newsletters: s.newsletters.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        })),

      setContacts: (contacts) => set({ contacts }),
      setSubscriptions: (subs) => set({ subscriptions: subs }),

      // Auth extended actions
      updateUser: (data) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...data } : null,
        })),

      // Notifications
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((s) => ({ notifications: [notification, ...s.notifications] })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      unreadCount: 0,

      // UI actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } })
        setTimeout(() => {
          set((s) => (s.toast?.message === message ? { toast: null } : {}))
        }, 4000)
      },
      clearToast: () => set({ toast: null }),
    })
)
