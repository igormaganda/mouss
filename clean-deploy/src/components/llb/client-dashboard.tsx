'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppStore, type AppView, type Wedge, type Ad, type Subscription, type AppNotification } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  Eye,
  Trash2,
  ArrowLeft,
  Check,
  ChevronRight,
  TrendingUp,
  Mail,
  MousePointerClick,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Target,
  Zap,
  Building2,
  Clock,
  AlertCircle,
  UserCircle,
  Bell,
  Coins,
  CheckCircle,
  AlertTriangle,
  Package,
  Shield,
  Info,
  CalendarDays,
  Lock,
  EyeOff,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AdPreview } from '@/components/llb/ad-preview'
import { NewsletterPreview } from '@/components/llb/newsletter-preview'
import { CheckoutDialog, PaymentHistory, InvoiceViewer } from '@/components/llb/payment-flow'
import { ClientAnalytics } from '@/components/llb/enhanced-stats'
import { UpsellPanel } from '@/components/llb/upsell-panel'
import AdCreationForm from '@/components/llb/ad-creation-form'

// ============================================
// CONSTANTS
// ============================================

const NAV_ITEMS: { view: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
  { view: 'client/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
  { view: 'client/ads', label: 'Mes Annonces', icon: <Megaphone className="h-5 w-5" /> },
  { view: 'client/ads/new', label: "Créer une annonce", icon: <PlusCircle className="h-5 w-5" /> },
  { view: 'client/subscription', label: 'Mon Abonnement', icon: <CreditCard className="h-5 w-5" /> },
  { view: 'client/analytics', label: 'Statistiques', icon: <BarChart3 className="h-5 w-5" /> },
  { view: 'client/credits', label: 'Crédits', icon: <Coins className="h-5 w-5" /> },
  { view: 'client/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
  { view: 'client/profile', label: 'Mon Profil', icon: <UserCircle className="h-5 w-5" /> },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  PENDING_VALIDATION: { label: 'En attente', color: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  VALIDATED: { label: 'Validée', color: 'bg-blue-50 text-blue-700 border-blue-300' },
  PAID: { label: 'Payée', color: 'bg-green-50 text-green-700 border-green-300' },
  SCHEDULED: { label: 'Programmée', color: 'bg-purple-50 text-purple-700 border-purple-300' },
  SENT: { label: 'Envoyée', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  REJECTED: { label: 'Rejetée', color: 'bg-red-50 text-red-700 border-red-300' },
}

const SECTOR_OPTIONS = [
  'Immobilier',
  'Finance & Banque',
  'Santé & Pharma',
  'Tech & IT',
  'Industrie',
  'Commerce & Distribution',
  'BTP & Construction',
  'Énergie & Environnement',
  'Tourisme & Hôtellerie',
  'Formation & Éducation',
  'Juridique & Conseil',
  'Autre',
]

const PLANS = [
  {
    id: 'standard',
    name: 'Standard',
    price: 99,
    description: 'Idéal pour démarrer votre prospection B2B',
    features: ['1 wedge thématique', '5 newsletters / mois', 'Base de contacts filtrée', 'Support client par email'],
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    description: 'Pour accélérer votre croissance commerciale',
    features: [
      '3 wedges thématiques',
      '15 newsletters / mois',
      'Base de contacts dédiée',
      'Support prioritaire',
      'Consulting 1h / mois',
    ],
    highlight: true,
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    price: 499,
    description: 'Solution complète pour les grandes équipes',
    features: [
      'Wedges illimités',
      'Newsletters illimitées',
      'Base de contacts complète',
      'Account manager dédié',
      'Rapports sur mesure',
      'API intégrée',
    ],
    highlight: false,
  },
]

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function getStatusBadge(status: string) {
  const config = STATUS_CONFIG[status]
  if (!config) return <Badge variant="outline">{status}</Badge>
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ClientDashboard() {
  const store = useAppStore()
  const { currentView, navigate, user, wedges, ads, subscriptions, notifications, addAd, updateAd, deleteAd, showToast, setLoading, loading, logout, setWedges, setAds, setSubscriptions, setNotifications, markNotificationRead, updateUser } = store

  // Form state for ad creation
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    region: '',
    wedgeId: '',
    cta: '',
    destinationUrl: '',
    budget: 49,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)
  const [adDetailOpen, setAdDetailOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [upsellData, setUpsellData] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<'ad' | 'newsletter'>('ad')

  // Profile state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // ------------------------------------------
  // DATA LOADING
  // ------------------------------------------
  const loadData = useCallback(async () => {
    const token = localStorage.getItem('llb-token')
    if (!token) return
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

      const [adsRes, wedgesRes, subsRes, paymentsRes, upsellRes] = await Promise.all([
        fetch('/api/ads', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/wedges', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/subscriptions', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/payments', { headers }).then((r) => r.json()).catch(() => []),
        fetch('/api/upsell', { headers }).then((r) => r.json()).catch(() => ({})),
      ])

      if (Array.isArray(adsRes)) setAds(adsRes)
      else if (adsRes.data && Array.isArray(adsRes.data)) setAds(adsRes.data)

      if (Array.isArray(wedgesRes)) setWedges(wedgesRes)
      else if (wedgesRes.data && Array.isArray(wedgesRes.data)) setWedges(wedgesRes.data)

      if (Array.isArray(subsRes)) setSubscriptions(subsRes)
      else if (subsRes.data && Array.isArray(subsRes.data)) setSubscriptions(subsRes.data)

      if (Array.isArray(paymentsRes)) setPayments(paymentsRes)
      if (upsellRes && !upsellRes.error) setUpsellData(upsellRes)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [setLoading, setAds, setWedges, setSubscriptions])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset form step when navigating to new ad view
  useEffect(() => {
    if (currentView === 'client/ads/new') {
      setFormStep(1)
      setFormData({ title: '', description: '', sector: '', region: '', wedgeId: '', cta: '', destinationUrl: '', budget: 49 })
      setFormErrors({})
    }
  }, [currentView])

  // Generate notifications on load
  useEffect(() => {
    if (ads.length > 0) {
      generateNotifications()
    }
  }, [ads.length, generateNotifications])

  // Load profile data when navigating to profile view
  useEffect(() => {
    if (currentView === 'client/profile' && user && !profileLoaded) {
      const token = localStorage.getItem('llb-token')
      if (token) {
        fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((data) => {
            const profile = data.data || data
            if (profile && profile.email) {
              setProfileForm({
                firstName: profile.firstName || user.firstName || '',
                lastName: profile.lastName || user.lastName || '',
                company: profile.company || user.company || '',
                phone: profile.phone || user.phone || '',
                email: profile.email || user.email || '',
              })
              setProfileLoaded(true)
            } else {
              setProfileForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                company: user.company || '',
                phone: user.phone || '',
                email: user.email || '',
              })
              setProfileLoaded(true)
            }
          })
          .catch(() => {
            setProfileForm({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              company: user.company || '',
              phone: user.phone || '',
              email: user.email || '',
            })
            setProfileLoaded(true)
          })
      }
    }
  }, [currentView, user, profileLoaded])

  // ------------------------------------------
  // COMPUTED VALUES
  // ------------------------------------------
  const activeAds = useMemo(() => ads.filter((a) => ['PAID', 'SCHEDULED', 'SENT', 'VALIDATED'].includes(a.status)), [ads])
  const totalOpens = useMemo(() => ads.reduce((acc, a) => acc + (a.openCount || 0), 0), [ads])
  const totalClicks = useMemo(() => ads.reduce((acc, a) => acc + (a.clickCount || 0), 0), [ads])
  const recentAds = useMemo(() => [...ads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3), [ads])
  const activeSubscription = useMemo(() => subscriptions.find((s) => s.status === 'ACTIVE'), [subscriptions])

  const chartData = useMemo(
    () =>
      ads.slice(0, 10).map((ad) => ({
        name: ad.title.length > 20 ? ad.title.substring(0, 20) + '...' : ad.title,
        Ouvertures: ad.openCount || 0,
        Clics: ad.clickCount || 0,
      })),
    [ads]
  )

  const avgOpenRate = useMemo(() => {
    if (ads.length === 0) return 0
    const total = ads.reduce((acc, a) => acc + (a.openCount || 0), 0)
    return Math.round((total / ads.length) * 100) / 100
  }, [ads])

  // Unread notification count
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  // Generate mock notifications from ads data
  const generateNotifications = useCallback(() => {
    if (notifications.length > 0) return
    const mockNotifications: AppNotification[] = []
    ads.forEach((ad, idx) => {
      if (ad.status === 'VALIDATED') {
        mockNotifications.push({
          id: `notif-val-${ad.id}`,
          type: 'ad_approved',
          title: 'Annonce validée',
          message: `Votre annonce "${ad.title}" a été validée et est prête à être publiée.`,
          read: idx > 1,
          createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString(),
          link: 'client/ads',
        })
      }
      if (ad.status === 'SENT') {
        mockNotifications.push({
          id: `notif-sent-${ad.id}`,
          type: 'newsletter',
          title: 'Newsletter envoyée',
          message: `La newsletter contenant votre annonce "${ad.title}" a été envoyée avec succès.`,
          read: idx > 0,
          createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
          link: 'client/analytics',
        })
      }
      if (ad.status === 'REJECTED') {
        mockNotifications.push({
          id: `notif-rej-${ad.id}`,
          type: 'ad_rejected',
          title: 'Annonce rejetée',
          message: `Votre annonce "${ad.title}" a été rejetée. Veuillez la modifier.`,
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: 'client/ads',
        })
      }
      if (ad.status === 'PENDING_VALIDATION') {
        mockNotifications.push({
          id: `notif-pend-${ad.id}`,
          type: 'system',
          title: 'Annonce en cours de validation',
          message: `Votre annonce "${ad.title}" est en attente de validation par notre équipe.`,
          read: idx > 0,
          createdAt: new Date(Date.now() - (idx + 2) * 86400000).toISOString(),
          link: 'client/ads',
        })
      }
    })
    if (user?.credits !== undefined && user.credits > 0) {
      mockNotifications.push({
        id: 'notif-credits',
        type: 'credits',
        title: 'Solde de crédits',
        message: `Vous disposez de ${user.credits} crédit${user.credits > 1 ? 's' : ''} sur votre compte.`,
        read: true,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      })
    }
    if (activeSubscription) {
      mockNotifications.push({
        id: 'notif-sub',
        type: 'subscription',
        title: 'Abonnement actif',
        message: `Votre abonnement ${activeSubscription.plan.charAt(0).toUpperCase() + activeSubscription.plan.slice(1)} est actif.`,
        read: true,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      })
    }
    if (mockNotifications.length === 0) {
      mockNotifications.push({
        id: 'notif-welcome',
        type: 'system',
        title: 'Bienvenue sur La Lettre Business !',
        message: 'Découvrez notre plateforme de publicité newsletter B2B. Créez votre première annonce pour commencer.',
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: 'client/ads/new',
      })
    }
    setNotifications(mockNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [ads, user, activeSubscription, notifications.length, setNotifications])

  // ------------------------------------------
  // AD CREATION HANDLERS
  // ------------------------------------------
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Le titre est requis'
      if (!formData.description.trim()) errors.description = 'La description est requise'
      else if (formData.description.length < 20) errors.description = 'La description doit contenir au moins 20 caractères'
      if (!formData.sector) errors.sector = 'Le secteur est requis'
      if (!formData.region.trim()) errors.region = 'La région est requise'
    }
    if (step === 2) {
      if (!formData.wedgeId) errors.wedgeId = 'Veuillez sélectionner un wedge'
      if (!formData.cta.trim()) errors.cta = 'Le texte du CTA est requis'
      if (!formData.destinationUrl.trim()) errors.destinationUrl = "L'URL de destination est requise"
      else if (!/^https?:\/\/.+/.test(formData.destinationUrl)) errors.destinationUrl = "L'URL doit commencer par http:// ou https://"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmitAd = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

      const adRes = await fetch('/api/ads', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      }).then((r) => r.json())

      const newAd = adRes.data || adRes
      if (newAd && newAd.id) {
        addAd(newAd)

        try {
          await fetch('/api/payments', {
            method: 'POST',
            headers,
            body: JSON.stringify({ adId: newAd.id, amount: formData.budget }),
          }).then((r) => r.json())
        } catch {
          // Payment endpoint might not exist yet
        }

        showToast('Annonce créée avec succès !')
        navigate('client/ads')
      } else {
        showToast(adRes.error || "Erreur lors de la création de l'annonce", 'error')
      }
    } catch {
      showToast("Erreur lors de la création de l'annonce", 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAd = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      deleteAd(id)
      showToast('Annonce supprimée')
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setAdToDelete(null)
    }
  }

  const handleSubscribe = async (planId: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      }).then((r) => r.json())

      const newSub = res.data || res
      if (newSub && newSub.id) {
        setSubscriptions([newSub])
        showToast(`Abonnement ${planId.charAt(0).toUpperCase() + planId.slice(1)} activé !`)
      } else {
        showToast(res.error || "Erreur lors de l'abonnement", 'error')
      }
    } catch {
      showToast("Erreur lors de l'abonnement", 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('llb-token')
    logout()
  }

  // ------------------------------------------
  // SIDEBAR CONTENT (shared between desktop and mobile)
  // ------------------------------------------
  const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '??'

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <span className="text-2xl">📬</span>
        <span className="text-lg font-bold text-white tracking-tight">La Lettre Business</span>
      </div>
      <Separator className="bg-white/10" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.view
            const showBadge = item.view === 'client/notifications' && unreadCount > 0
            return (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
                {isActive && !showBadge && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* User info */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-amber-500/50">
            <AvatarFallback className="bg-amber-600 text-xs font-bold text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.company || 'Entreprise'}</p>
            {user?.credits !== undefined && user.credits > 0 && (
              <p className="text-xs text-amber-300 truncate flex items-center gap-1 mt-0.5">
                <CreditCard className="h-3 w-3" /> {user.credits} crédits
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-white/5">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  // ------------------------------------------
  // VIEW: DASHBOARD
  // ------------------------------------------
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Bonjour {user?.firstName} 👋
                </h1>
                <button
                  onClick={() => navigate('client/notifications')}
                  className="relative ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              <p className="text-amber-100 mt-1">
                Bienvenue sur votre espace {user?.company && `· ${user.company}`}
              </p>
              {user?.credits !== undefined && (
                <div className="mt-2">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Coins className="mr-1 h-3 w-3" />
                    Crédits : {user.credits}
                  </Badge>
                </div>
              )}
            </div>
            <Button
              onClick={() => navigate('client/ads/new')}
              className="bg-white text-amber-600 hover:bg-amber-50 font-semibold shadow-md"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une annonce
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Megaphone className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annonces actives</p>
                <p className="text-2xl font-bold">{activeAds.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ouvertures</p>
                <p className="text-2xl font-bold">{formatNumber(totalOpens)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <MousePointerClick className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total clics</p>
                <p className="text-2xl font-bold">{formatNumber(totalClicks)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ads */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Annonces récentes</CardTitle>
                  <CardDescription>Vos dernières annonces publiées</CardDescription>
                </div>
                {ads.length > 3 && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('client/ads')} className="text-amber-600">
                    Voir tout <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentAds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Megaphone className="h-10 w-10 mb-3 opacity-40" />
                  <p className="font-medium">Aucune annonce</p>
                  <p className="text-sm">Créez votre première annonce pour commencer</p>
                  <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => navigate('client/ads/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer une annonce
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAds.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => { setSelectedAd(ad); setAdDetailOpen(true) }}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{ad.title}</p>
                          {getStatusBadge(ad.status)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{ad.description}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4 shrink-0 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{ad.openCount}</span>
                        <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" />{ad.clickCount}</span>
                        <span>{formatDate(ad.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Subscription */}
        <div>
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mon abonnement</CardTitle>
              <CardDescription>Votre plan actuel</CardDescription>
            </CardHeader>
            <CardContent>
              {activeSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{activeSubscription.plan === 'standard' ? 'Standard' : activeSubscription.plan === 'premium' ? 'Premium' : 'Entreprise'}</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">Actif</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Newsletters</span>
                      <span className="font-medium">{activeSubscription.newslettersUsed} / {activeSubscription.newsletterQuota}</span>
                    </div>
                    <Progress
                      value={(activeSubscription.newslettersUsed / activeSubscription.newsletterQuota) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">Wedges</span>
                      <span className="font-medium">{activeSubscription.wedgeQuota === -1 ? 'Illimité' : `Utilisés`}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('client/subscription')}>
                    Gérer mon abonnement
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">Aucun abonnement actif</p>
                  <p className="text-xs text-muted-foreground mt-1">Souscrivez à un plan pour publier vos annonces</p>
                  <Button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => navigate('client/subscription')}>
                    Voir les plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upsell Panel */}
        {upsellData && upsellData.score > 0 && (
          <div className="lg:col-span-3">
            <UpsellPanel
              score={upsellData.score}
              level={upsellData.level}
              suggestions={upsellData.suggestions}
              stats={upsellData.stats}
              onAction={(type, data) => {
                if (type === 'upgrade_plan') navigate('client/subscription')
                else if (type === 'buy_more_ads') navigate('client/ads/new')
                else if (type === 'new_wedge') navigate('client/ads/new')
              }}
            />
          </div>
        )}
      </div>
    </div>
  )

  // ------------------------------------------
  // VIEW: ADS LIST
  // ------------------------------------------
  const AdsView = () => {
    const [filterTab, setFilterTab] = useState('Toutes')

    const filteredAds = useMemo(() => {
      if (filterTab === 'Toutes') return [...ads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const statusMap: Record<string, string> = {
        'En attente': 'PENDING_VALIDATION',
        'Payées': 'PAID',
        'Programmées': 'SCHEDULED',
        'Envoyées': 'SENT',
      }
      const status = statusMap[filterTab]
      if (!status) return ads
      return ads.filter((a) => a.status === status).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [ads, filterTab])

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mes Annonces</h1>
            <p className="text-muted-foreground">{ads.length} annonce{ads.length > 1 ? 's' : ''} au total</p>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => navigate('client/ads/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une annonce
          </Button>
        </div>

        <Tabs value={filterTab} onValueChange={setFilterTab}>
          <TabsList>
            <TabsTrigger value="Toutes">Toutes ({ads.length})</TabsTrigger>
            <TabsTrigger value="En attente">En attente ({ads.filter((a) => a.status === 'PENDING_VALIDATION').length})</TabsTrigger>
            <TabsTrigger value="Payées">Payées ({ads.filter((a) => a.status === 'PAID').length})</TabsTrigger>
            <TabsTrigger value="Programmées">Programmées ({ads.filter((a) => a.status === 'SCHEDULED').length})</TabsTrigger>
            <TabsTrigger value="Envoyées">Envoyées ({ads.filter((a) => a.status === 'SENT').length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredAds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Megaphone className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucune annonce trouvée</p>
              <p className="text-muted-foreground text-sm mt-1">
                {filterTab === 'Toutes' ? 'Créez votre première annonce pour commencer.' : `Aucune annonce avec le statut "${filterTab}".`}
              </p>
              {filterTab === 'Toutes' && (
                <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => navigate('client/ads/new')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer une annonce
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAds.map((ad) => (
              <Card key={ad.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-1">{ad.title}</CardTitle>
                    {getStatusBadge(ad.status)}
                  </div>
                  <CardDescription className="line-clamp-2">{ad.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">{ad.sector}</Badge>
                    <Badge variant="outline" className="text-xs">{ad.region}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {ad.openCount} ouvertures
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {ad.clickCount} clics
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(ad.createdAt)}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setSelectedAd(ad); setAdDetailOpen(true) }}
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => { setAdToDelete(ad.id); setDeleteDialogOpen(true) }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Supprimer l&apos;annonce
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => adToDelete && handleDeleteAd(adToDelete)}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ad Detail Dialog */}
        <Dialog open={adDetailOpen} onOpenChange={setAdDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedAd?.title}</DialogTitle>
            </DialogHeader>
            {selectedAd && (
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedAd.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Secteur</p>
                    <p className="font-medium">{selectedAd.sector}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Région</p>
                    <p className="font-medium">{selectedAd.region}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Statut</p>
                    <div className="mt-1">{getStatusBadge(selectedAd.status)}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">{selectedAd.budget}€</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ouvertures</p>
                    <p className="font-medium">{selectedAd.openCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clics</p>
                    <p className="font-medium">{selectedAd.clickCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTA</p>
                    <p className="font-medium">{selectedAd.cta}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Wedge</p>
                    <p className="font-medium">{selectedAd.wedge?.name || 'Non assigné'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Créée le</p>
                    <p className="font-medium">{formatDate(selectedAd.createdAt)}</p>
                  </div>
                  {selectedAd.destinationUrl && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">URL de destination</p>
                      <a href={selectedAd.destinationUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-600 hover:underline break-all">
                        {selectedAd.destinationUrl}
                      </a>
                    </div>
                  )}
                  {selectedAd.rejectionReason && (
                    <div className="col-span-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm font-medium text-red-700">Raison du rejet :</p>
                      <p className="text-sm text-red-600">{selectedAd.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ------------------------------------------
  // VIEW: NEW AD (Multi-step form)
  // ------------------------------------------
  const NewAdView = () => {
    const stepLabels = ['Offre', 'Ciblage', 'Confirmation']

    return (
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate('client/ads')} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux annonces
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Créer une annonce</h1>
          <p className="text-muted-foreground">Configurez votre annonce en 3 étapes</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => {
                  if (i < formStep) setFormStep(i + 1)
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all flex-1 ${
                  formStep === i + 1
                    ? 'bg-amber-500 text-white shadow-md'
                    : formStep > i + 1
                    ? 'bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  formStep > i + 1 ? 'bg-amber-500 text-white' : ''
                }`}>
                  {formStep > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < stepLabels.length - 1 && (
                <div className={`h-0.5 w-6 ${formStep > i + 1 ? 'bg-amber-400' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form + Live Preview Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="max-w-2xl">
        {/* Steps container start */}

        {/* Step 1: Offre */}
        {formStep === 1 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Votre offre
              </CardTitle>
              <CardDescription>Décrivez votre annonce et votre offre commerciale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ad-title">Titre de l&apos;annonce *</Label>
                <Input
                  id="ad-title"
                  placeholder="Ex: Expertise Comptable - Audit & Conseil"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className={formErrors.title ? 'border-red-400' : ''}
                />
                {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-description">Description *</Label>
                <Textarea
                  id="ad-description"
                  placeholder="Décrivez votre offre en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={formErrors.description ? 'border-red-400' : ''}
                />
                <div className="flex justify-between">
                  {formErrors.description ? (
                    <p className="text-xs text-red-500">{formErrors.description}</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {formData.description.length} / 500
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secteur *</Label>
                  <Select value={formData.sector} onValueChange={(val) => setFormData((prev) => ({ ...prev, sector: val }))}>
                    <SelectTrigger className={formErrors.sector ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTOR_OPTIONS.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.sector && <p className="text-xs text-red-500">{formErrors.sector}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-region">Région *</Label>
                  <Input
                    id="ad-region"
                    placeholder="Ex: Île-de-France"
                    value={formData.region}
                    onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                    className={formErrors.region ? 'border-red-400' : ''}
                  />
                  {formErrors.region && <p className="text-xs text-red-500">{formErrors.region}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-5 justify-end">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleNextStep}>
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Ciblage */}
        {formStep === 2 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Ciblage & Action
              </CardTitle>
              <CardDescription>Choisissez votre audience et configurez l&apos;appel à l&apos;action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Wedge (newsletter) *</Label>
                <Select value={formData.wedgeId} onValueChange={(val) => setFormData((prev) => ({ ...prev, wedgeId: val }))}>
                  <SelectTrigger className={formErrors.wedgeId ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Sélectionnez un wedge" />
                  </SelectTrigger>
                  <SelectContent>
                    {wedges.length === 0 ? (
                      <SelectItem value="__none" disabled>Aucun wedge disponible</SelectItem>
                    ) : (
                      wedges.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} ({w.subscriberCount} abonnés)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {formErrors.wedgeId && <p className="text-xs text-red-500">{formErrors.wedgeId}</p>}
                <p className="text-xs text-muted-foreground">
                  {wedges.length > 0
                    ? `${wedges.length} wedge${wedges.length > 1 ? 's' : ''} disponible${wedges.length > 1 ? 's' : ''}`
                    : 'Aucun wedge configuré. Veuillez souscrire à un abonnement.'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-cta">Texte du bouton (CTA) *</Label>
                <Input
                  id="ad-cta"
                  placeholder="Ex: Demander un devis"
                  value={formData.cta}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cta: e.target.value }))}
                  className={formErrors.cta ? 'border-red-400' : ''}
                />
                {formErrors.cta && <p className="text-xs text-red-500">{formErrors.cta}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-url">URL de destination *</Label>
                <Input
                  id="ad-url"
                  placeholder="https://www.example.com/offre"
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destinationUrl: e.target.value }))}
                  className={formErrors.destinationUrl ? 'border-red-400' : ''}
                />
                {formErrors.destinationUrl && <p className="text-xs text-red-500">{formErrors.destinationUrl}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-budget">Budget (€)</Label>
                <Input
                  id="ad-budget"
                  type="number"
                  min={1}
                  value={formData.budget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">Budget minimum : 49€</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-5 justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleNextStep}>
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {formStep === 3 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-amber-500" />
                Confirmez votre annonce
              </CardTitle>
              <CardDescription>Vérifiez les informations avant de publier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview Card */}
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{formData.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{formData.sector}</Badge>
                      <Badge variant="outline" className="text-xs">{formData.region}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{formData.budget}€</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Wedge</p>
                    <p className="font-medium">{wedges.find((w) => w.id === formData.wedgeId)?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Abonnés</p>
                    <p className="font-medium">{wedges.find((w) => w.id === formData.wedgeId)?.subscriberCount || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTA</p>
                    <p className="font-medium">{formData.cta}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <a href={formData.destinationUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-600 hover:underline text-xs truncate block">
                      {formData.destinationUrl}
                    </a>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Résumé
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Votre annonce sera soumise à validation par notre équipe</li>
                  <li>• Après validation, vous pourrez effectuer le paiement</li>
                  <li>• L&apos;annonce sera diffusée dans la prochaine newsletter du wedge sélectionné</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-5 justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                disabled={loading}
                onClick={handleSubmitAd}
              >
                {loading ? 'Création...' : `Confirmer et payer ${formData.budget}€`}
              </Button>
            </CardFooter>
          </Card>
        )}
          </div>
          {/* Live Preview Panel - visible on ALL steps */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Aperçu en direct</h3>
              </div>
              <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'ad' | 'newsletter')}>
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="ad" className="text-xs px-2.5 h-6">Annonce</TabsTrigger>
                  <TabsTrigger value="newsletter" className="text-xs px-2.5 h-6">Newsletter</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {previewMode === 'ad' ? (
              <AdPreview
                ad={{
                  title: formData.title,
                  description: formData.description,
                  sector: formData.sector,
                  region: formData.region,
                  cta: formData.cta,
                  destinationUrl: formData.destinationUrl,
                  company: user?.company,
                  budget: formData.budget,
                }}
                mode="inline"
                wedgeName={wedges.find((w) => w.id === formData.wedgeId)?.name}
              />
            ) : (
              <NewsletterPreview
                newsletter={{
                  subject: formData.title ? `Offre : ${formData.title}` : 'Newsletter La Lettre Business',
                  editorialContent: 'Retrouvez cette semaine les meilleures offres B2B sélectionnées par notre équipe, ainsi que l\'actualité de votre secteur.',
                  aiArticle1: formData.sector ? `Tendances ${formData.sector} : les dernières actualités et bonnes pratiques du marché.` : undefined,
                  questionOfMonth: 'Quelle est votre plus grande priorité commerciale pour ce trimestre ?',
                  ads: formData.title ? [{
                    title: formData.title,
                    description: formData.description,
                    sector: formData.sector,
                    region: formData.region,
                    cta: formData.cta,
                    company: user?.company || undefined,
                  }] : [],
                  recipientCount: wedges.find((w) => w.id === formData.wedgeId)?.subscriberCount || 1250,
                }}
                wedgeName={wedges.find((w) => w.id === formData.wedgeId)?.name}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
  // ------------------------------------------
  // VIEW: PROFILE
  // ------------------------------------------
  const ProfileView = () => {
    const handleSaveProfile = async () => {
      setProfileSaving(true)
      try {
        const token = localStorage.getItem('llb-token')
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            company: profileForm.company,
            phone: profileForm.phone,
          }),
        }).then((r) => r.json())
        if (res.error) {
          showToast(res.error, 'error')
        } else {
          updateUser({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            company: profileForm.company,
            phone: profileForm.phone,
          })
          showToast('Profil mis à jour avec succès !')
        }
      } catch {
        showToast('Erreur lors de la mise à jour du profil', 'error')
      } finally {
        setProfileSaving(false)
      }
    }

    const handleChangePassword = async () => {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        showToast('Veuillez remplir tous les champs', 'error')
        return
      }
      if (passwordForm.newPassword.length < 8) {
        showToast('Le nouveau mot de passe doit contenir au moins 8 caractères', 'error')
        return
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showToast('Les mots de passe ne correspondent pas', 'error')
        return
      }
      setPasswordSaving(true)
      try {
        const token = localStorage.getItem('llb-token')
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }).then((r) => r.json())
        if (res.error) {
          showToast(res.error, 'error')
        } else {
          showToast('Mot de passe modifié avec succès !')
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        }
      } catch {
        showToast('Erreur lors du changement de mot de passe', 'error')
      } finally {
        setPasswordSaving(false)
      }
    }

    const totalSpent = ads.reduce((acc, a) => acc + (a.budget || 0), 0)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Stats */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-amber-500/50">
                  <AvatarFallback className="bg-amber-600 text-lg font-bold text-white">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200 text-xs capitalize">{user?.role}</Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Membre depuis</p>
                    <p className="font-medium">{user?.createdAt ? formatDate(user.createdAt) : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Total annonces</p>
                    <p className="font-medium">{ads.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Total dépensé</p>
                    <p className="font-medium">{totalSpent}€</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Abonnement</p>
                    <p className="font-medium">{activeSubscription ? 'Actif' : 'Aucun'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Modifier mes informations</CardTitle>
              <CardDescription>Mettez à jour vos coordonnées professionnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-firstName">Prénom</Label>
                  <Input
                    id="profile-firstName"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-lastName">Nom</Label>
                  <Input
                    id="profile-lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-company">Entreprise</Label>
                  <Input
                    id="profile-company"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Téléphone</Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">L&apos;email ne peut pas être modifié. Contactez le support si nécessaire.</p>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={profileSaving}
                  onClick={handleSaveProfile}
                >
                  {profileSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Change */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <Button
                variant="outline"
                disabled={passwordSaving}
                onClick={handleChangePassword}
              >
                {passwordSaving ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ------------------------------------------
  // VIEW: NOTIFICATIONS
  // ------------------------------------------
  const NotificationsView = () => {
    const handleMarkAllRead = () => {
      notifications.forEach((n) => {
        if (!n.read) markNotificationRead(n.id)
      })
      showToast('Toutes les notifications marquées comme lues')
    }

    const handleNotificationClick = (notif: AppNotification) => {
      markNotificationRead(notif.id)
      if (notif.link) {
        navigate(notif.link as AppView)
      }
    }

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'ad_approved': return <CheckCircle className="h-5 w-5 text-emerald-500" />
        case 'ad_rejected': return <AlertCircle className="h-5 w-5 text-red-500" />
        case 'newsletter': return <Mail className="h-5 w-5 text-blue-500" />
        case 'credits': return <Coins className="h-5 w-5 text-amber-500" />
        case 'subscription': return <Shield className="h-5 w-5 text-purple-500" />
        default: return <Info className="h-5 w-5 text-gray-500" />
      }
    }

    const formatRelativeTime = (dateStr: string) => {
      const now = new Date()
      const date = new Date(dateStr)
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      if (diffMins < 1) return "À l'instant"
      if (diffMins < 60) return `Il y a ${diffMins} min`
      if (diffHours < 24) return `Il y a ${diffHours}h`
      if (diffDays < 7) return `Il y a ${diffDays}j`
      return formatDate(dateStr)
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount} non lue{unreadCount !== 1 ? 's' : ''} sur {notifications.length}</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead} className="text-amber-600 border-amber-200 hover:bg-amber-50">
              <EyeOff className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucune notification</p>
              <p className="text-muted-foreground text-sm mt-1">Vous n&apos;avez pas encore de notification.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-colors text-left ${
                  notif.read
                    ? 'bg-white hover:bg-muted/50 border-gray-100'
                    : 'bg-amber-50/50 hover:bg-amber-50 border-amber-100 cursor-pointer'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${notif.read ? 'text-foreground' : 'text-foreground'}`}>{notif.title}</p>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ------------------------------------------
  // VIEW: CREDITS
  // ------------------------------------------
  const CreditsView = () => {
    const CREDIT_PACKS = [
      { credits: 1, price: 49, discount: 0, label: '1 crédit', popular: false },
      { credits: 5, price: 199, discount: 19, label: '5 crédits', popular: false },
      { credits: 10, price: 349, discount: 29, label: '10 crédits', popular: true },
      { credits: 25, price: 749, discount: 39, label: '25 crédits', popular: false },
    ]

    const creditUsageByAd = useMemo(() => {
      return ads.map((ad) => ({
        id: ad.id,
        title: ad.title,
        status: ad.status,
        date: ad.createdAt,
        credits: 1,
      }))
    }, [ads])

    const totalCreditsUsed = creditUsageByAd.length

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Crédits</h1>
          <p className="text-muted-foreground">Achetez et gérez vos crédits publicitaires</p>
        </div>

        {/* Credits Balance Card */}
        <Card className="border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-amber-100 text-sm">Solde disponible</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{user?.credits || 0}</span>
                  <span className="text-amber-100 text-lg">crédit{(user?.credits || 0) !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-amber-200 text-sm mt-1">
                  {totalCreditsUsed} crédit{totalCreditsUsed !== 1 ? 's' : ''} utilisé{totalCreditsUsed !== 1 ? 's' : ''} au total
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-amber-100 text-xs">Valeur unitaire</p>
                  <p className="text-lg font-bold">49€</p>
                </div>
                <Separator orientation="vertical" className="h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-amber-100 text-xs">1 crédit =</p>
                  <p className="text-lg font-bold">1 annonce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Acheter des crédits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.credits} className={`shadow-sm transition-all ${pack.popular ? 'border-amber-400 ring-2 ring-amber-400/20 relative' : ''}`}>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white border-0 px-3">Populaire</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg">{pack.label}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{pack.price}€</span>
                    {pack.discount > 0 && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                          -{pack.discount}% de réduction
                        </Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pack.price / pack.credits}€ / crédit
                  </p>
                </CardHeader>
                <CardFooter>
                  <Button
                    className={`w-full ${pack.popular ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                    variant={pack.popular ? 'default' : 'outline'}
                    onClick={() => showToast('Fonctionnalité bientôt disponible', 'info')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Acheter
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* How Credits Work */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Comment fonctionnent les crédits ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 shrink-0">
                  <Coins className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">1 crédit = 1 annonce</p>
                  <p className="text-xs text-muted-foreground mt-1">Chaque publication d&apos;annonce dans une newsletter consomme 1 crédit de votre compte.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Réductions progressives</p>
                  <p className="text-xs text-muted-foreground mt-1">Achetez en pack pour bénéficier de réductions allant jusqu&apos;à -39% sur le prix unitaire.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Valide 12 mois</p>
                  <p className="text-xs text-muted-foreground mt-1">Vos crédits sont valables pendant 12 mois à compter de la date d&apos;achat.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Usage History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Historique d&apos;utilisation</CardTitle>
            <CardDescription>Vos crédits utilisés par annonce</CardDescription>
          </CardHeader>
          <CardContent>
            {creditUsageByAd.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Aucune utilisation de crédits</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {creditUsageByAd.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                        <Coins className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{usage.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(usage.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(usage.status)}
                      <span className="text-sm font-medium text-amber-600">-1 crédit</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ------------------------------------------
  // VIEW: SUBSCRIPTION
  // ------------------------------------------
  const SubscriptionView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon Abonnement</h1>
        <p className="text-muted-foreground">Gérez votre plan et votre facturation</p>
      </div>

      {/* Usage Stats */}
      {activeSubscription && (
        <Card className="border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-amber-100 text-sm">Plan actuel</p>
                <p className="text-2xl font-bold capitalize">
                  {activeSubscription.plan === 'standard' ? 'Standard' : activeSubscription.plan === 'premium' ? 'Premium' : 'Entreprise'}
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-amber-100 text-xs">Newsletters</p>
                  <p className="text-lg font-bold">{activeSubscription.newslettersUsed} / {activeSubscription.newsletterQuota === -1 ? '∞' : activeSubscription.newsletterQuota}</p>
                </div>
                <div>
                  <p className="text-amber-100 text-xs">Wedges</p>
                  <p className="text-lg font-bold">{activeSubscription.wedgeQuota === -1 ? 'Illimité' : activeSubscription.wedgeQuota}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isActive = activeSubscription?.plan === plan.id
          return (
            <Card
              key={plan.id}
              className={`relative shadow-sm transition-all ${plan.highlight ? 'border-amber-400 ring-2 ring-amber-400/20' : ''} ${isActive ? 'border-amber-500 bg-amber-50/30' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white border-0 px-3">Populaire</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground"> / mois</span>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <Separator className="mb-4" />
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-3">
                {isActive ? (
                  <Button variant="outline" className="w-full" disabled>
                    Plan actuel
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${plan.highlight ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-white hover:bg-gray-50 border'}`}
                    disabled={loading}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {activeSubscription ? 'Changer de plan' : "S'abonner"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Payment History & Invoices */}
      <PaymentHistory payments={payments} />
    </div>
  )

  // ------------------------------------------
  // VIEW: ANALYTICS (Enhanced)
  // ------------------------------------------
  const AnalyticsView = () => (
    <ClientAnalytics
      ads={ads}
      platformAvgOpenRate={35.2}
      platformAvgClickRate={7.8}
    />
  )


  // ------------------------------------------
  // RENDER CURRENT VIEW
  // ------------------------------------------
  const renderView = () => {
    switch (currentView) {
      case 'client/dashboard':
        return <DashboardView />
      case 'client/ads':
        return <AdsView />
      case 'client/ads/new':
        return <AdCreationForm />
      case 'client/subscription':
        return <SubscriptionView />
      case 'client/analytics':
        return <AnalyticsView />
      case 'client/profile':
        return <ProfileView />
      case 'client/notifications':
        return <NotificationsView />
      case 'client/credits':
        return <CreditsView />
      default:
        return <DashboardView />
    }
  }

  // ------------------------------------------
  // MAIN LAYOUT
  // ------------------------------------------
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col gradient-dark shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-white">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 gradient-dark border-none">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-bold text-amber-600">📬 La Lettre Business</span>
        </header>

        {/* Toast */}
        {store.toast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg border ${
                store.toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : store.toast.type === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {store.toast.message}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
              {renderView()}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}
