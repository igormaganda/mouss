'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppStore, type AppView, type Wedge, type Ad, type Newsletter, type Contact } from '@/store/use-app-store'

// shadcn/ui
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

// Lucide icons
import {
  LayoutDashboard, Layers, Users, Mail, Contact, BarChart3,
  Plus, MoreHorizontal, Pencil, Trash2, Search, LogOut,
  Menu, TrendingUp, Eye, MousePointer, Send, Clock,
  FileText, DollarSign, UserPlus, ArrowUpRight, ArrowDownRight,
  Activity, ChevronRight, Filter, Download, ShieldCheck, Settings,
  Minus, CreditCard, XCircle, CheckCircle2, Globe, Building2,
  Coins, Ban, MailCheck, RefreshCw,
} from 'lucide-react'

// Recharts
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  Legend,
} from 'recharts'
import { NewsletterPreview } from '@/components/llb/newsletter-preview'
import { AdminAnalytics } from '@/components/llb/enhanced-stats'

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#e67e22', '#27ae60', '#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#f39c12', '#2ecc71']

const NAV_ITEMS: { view: AppView; label: string; icon: React.ElementType }[] = [
  { view: 'admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { view: 'admin/validation', label: 'Validation', icon: ShieldCheck },
  { view: 'admin/wedges', label: 'Wedges', icon: Layers },
  { view: 'admin/clients', label: 'Clients', icon: Users },
  { view: 'admin/newsletters', label: 'Newsletters', icon: Mail },
  { view: 'admin/contacts', label: 'Contacts', icon: Contact },
  { view: 'admin/revenue', label: 'Revenus', icon: DollarSign },
  { view: 'admin/analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'admin/settings', label: 'Paramètres', icon: Settings },
]

const WEDGE_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  ACTIVE: { label: 'Actif', variant: 'default' },
  INACTIVE: { label: 'Inactif', variant: 'secondary' },
  DRAFT: { label: 'Brouillon', variant: 'outline' },
}

const NEWSLETTER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
  GENERATED: { label: 'Générée', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  SCHEDULED: { label: 'Planifiée', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  SENT: { label: 'Envoyée', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  FAILED: { label: 'Échouée', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

const AD_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING_VALIDATION: { label: 'En attente de validation', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  VALIDATED: { label: 'Validée', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  APPROVED: { label: 'Approuvée', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  PAID: { label: 'Payée', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  REJECTED: { label: 'Rejetée', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  SENT: { label: 'Envoyée', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
}

const CONTACT_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  ACTIVE: { label: 'Actif', variant: 'default' },
  UNSUBSCRIBED: { label: 'Désabonné', variant: 'destructive' },
  BOUNCED: { label: 'Rejeté', variant: 'secondary' },
  PENDING: { label: 'En attente', variant: 'outline' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ─── Loading Skeleton Components ─────────────────────────────────────────────

function KpiCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </Card>
  )
}

function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <TableCell key={c}><Skeleton className="h-4 w-16" /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Sidebar Content (shared between desktop & mobile) ───────────────────────

function SidebarNav({ onNavigate, pendingValidationCount = 0 }: { onNavigate?: () => void; pendingValidationCount?: number }) {
  const { currentView, navigate, user, logout } = useAppStore()

  const handleNav = (view: AppView) => {
    navigate(view)
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-lg">
          📬
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">LLB Admin</h1>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">La Lettre Business</p>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Nav Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
            const isActive = currentView === view
            return (
              <button
                key={view}
                onClick={() => handleNav(view)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {view === 'admin/validation' && pendingValidationCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {pendingValidationCount}
                  </span>
                )}
                {isActive && view !== 'admin/validation' && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* User Info */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-white/20">
            <AvatarFallback className="bg-white/15 text-xs text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
            onClick={() => { localStorage.removeItem('llb-token'); logout() }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── View 1: Dashboard ───────────────────────────────────────────────────────

function DashboardView() {
  const { wedges, ads, newsletters, contacts, navigate } = useAppStore()
  const loading = useAppStore((s) => s.loading)

  const kpis = useMemo(() => [
    {
      label: 'Wedges actifs',
      value: wedges.filter((w) => w.status === 'ACTIVE').length,
      total: wedges.length,
      icon: Layers,
      trend: '+12%',
      trendUp: true,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Contacts B2B',
      value: contacts.length,
      total: contacts.filter((c) => c.status === 'ACTIVE').length,
      icon: Users,
      trend: '+8%',
      trendUp: true,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Annonces',
      value: ads.length,
      total: ads.filter((a) => a.status === 'APPROVED' || a.status === 'PAID').length,
      icon: FileText,
      trend: '+23%',
      trendUp: true,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'CA Mensuel',
      value: ads.filter((a) => a.status === 'PAID').reduce((sum, a) => sum + a.budget, 0),
      total: null,
      icon: DollarSign,
      trend: '+15%',
      trendUp: true,
      color: 'bg-purple-100 text-purple-600',
      isCurrency: true,
    },
  ], [wedges, ads, contacts])

  const recentActivity = useMemo(() => {
    const items: { type: string; label: string; date: string; icon: React.ElementType }[] = []
    ads.slice(-3).reverse().forEach((ad) => {
      items.push({ type: 'ad', label: `Annonce "${ad.title}" — ${AD_STATUS_MAP[ad.status]?.label ?? ad.status}`, date: ad.updatedAt, icon: FileText })
    })
    newsletters.slice(-3).reverse().forEach((nl) => {
      items.push({ type: 'newsletter', label: `Newsletter "${nl.subject}" — ${NEWSLETTER_STATUS_MAP[nl.status]?.label ?? nl.status}`, date: nl.updatedAt, icon: Mail })
    })
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)
  }, [ads, newsletters])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={5} cols={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground text-sm">
            Vue d&apos;ensemble de votre plateforme La Lettre Business
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('admin/newsletters')}>
            <Mail className="mr-2 h-4 w-4" />
            Voir les Newsletters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold">
                    {kpi.isCurrency ? formatCurrency(kpi.value) : formatNumber(kpi.value)}
                  </p>
                  {kpi.total !== null && !kpi.isCurrency && (
                    <p className="text-xs text-muted-foreground">sur {kpi.total} au total</p>
                  )}
                  <div className="flex items-center gap-1 text-xs">
                    {kpi.trendUp ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={kpi.trendUp ? 'text-green-600' : 'text-red-600'}>{kpi.trend}</span>
                    <span className="text-muted-foreground">vs mois dernier</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Activité récente</CardTitle>
              <Badge variant="secondary" className="text-xs">{recentActivity.length} éléments</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Aucune activité récente</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(item.date)}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {item.type === 'ad' ? 'Annonce' : 'Newsletter'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2" onClick={() => navigate('admin/wedges')}>
              <Plus className="h-4 w-4" />
              Créer un Wedge
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('admin/newsletters')}>
              <Send className="h-4 w-4" />
              Envoyer une Newsletter
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('admin/contacts')}>
              <UserPlus className="h-4 w-4" />
              Ajouter des Contacts
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('admin/analytics')}>
              <BarChart3 className="h-4 w-4" />
              Voir les Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── View 2: Wedges ──────────────────────────────────────────────────────────

function WedgesView() {
  const { wedges, addWedge, updateWedge, deleteWedge, showToast, setLoading } = useAppStore()
  const loading = useAppStore((s) => s.loading)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWedge, setEditingWedge] = useState<Wedge | null>(null)
  const [form, setForm] = useState({
    name: '', sector: '', region: '', department: '', description: '',
    frequency: 'HEBDO', sendTime: '08:00', sendDays: 'Lundi',
    maxAdsPerNewsletter: 5,
  })

  const resetForm = useCallback(() => {
    setForm({ name: '', sector: '', region: '', department: '', description: '', frequency: 'HEBDO', sendTime: '08:00', sendDays: 'Lundi', maxAdsPerNewsletter: 5 })
    setEditingWedge(null)
  }, [])

  const openCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (wedge: Wedge) => {
    setEditingWedge(wedge)
    setForm({
      name: wedge.name, sector: wedge.sector, region: wedge.region,
      department: wedge.department ?? '', description: wedge.description ?? '',
      frequency: wedge.frequency, sendTime: wedge.sendTime, sendDays: wedge.sendDays,
      maxAdsPerNewsletter: wedge.maxAdsPerNewsletter,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.sector || !form.region) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      if (editingWedge) {
        const res = await fetch('/api/wedges', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: editingWedge.id, ...form }),
        })
        if (res.ok) {
          updateWedge(editingWedge.id, form)
          showToast('Wedge mis à jour avec succès')
        }
      } else {
        const res = await fetch('/api/wedges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const data = await res.json()
          addWedge(data as Wedge)
          showToast('Wedge créé avec succès')
        }
      }
      setDialogOpen(false)
      resetForm()
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce wedge ?')) return
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/wedges', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        deleteWedge(id)
        showToast('Wedge supprimé')
      }
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <TableSkeleton rows={5} cols={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Wedges</h2>
          <p className="text-muted-foreground text-sm">{wedges.length} wedge(s) configuré(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un Wedge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWedge ? 'Modifier le Wedge' : 'Nouveau Wedge'}</DialogTitle>
              <DialogDescription>
                {editingWedge ? 'Modifiez les informations du wedge.' : 'Configurez un nouveau wedge de newsletter.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wname">Nom *</Label>
                  <Input id="wname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Tech Bretagne" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wsector">Secteur *</Label>
                  <Input id="wsector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Ex: Technologie" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wregion">Région *</Label>
                  <Input id="wregion" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Ex: Bretagne" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wdept">Département</Label>
                  <Input id="wdept" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Ex: Ille-et-Vilaine" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wdesc">Description</Label>
                <Textarea id="wdesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du wedge..." rows={3} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Fréquence</Label>
                  <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QUOTIDIEN">Quotidienne</SelectItem>
                      <SelectItem value="HEBDO">Hebdomadaire</SelectItem>
                      <SelectItem value="BIHEBDO">Bi-hebdomadaire</SelectItem>
                      <SelectItem value="MENSUEL">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wtime">Heure d&apos;envoi</Label>
                  <Input id="wtime" type="time" value={form.sendTime} onChange={(e) => setForm({ ...form, sendTime: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Jour d&apos;envoi</Label>
                  <Select value={form.sendDays} onValueChange={(v) => setForm({ ...form, sendDays: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lundi">Lundi</SelectItem>
                      <SelectItem value="Mardi">Mardi</SelectItem>
                      <SelectItem value="Mercredi">Mercredi</SelectItem>
                      <SelectItem value="Jeudi">Jeudi</SelectItem>
                      <SelectItem value="Vendredi">Vendredi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wmaxads">Max annonces par newsletter</Label>
                <Input id="wmaxads" type="number" min={1} max={20} value={form.maxAdsPerNewsletter} onChange={(e) => setForm({ ...form, maxAdsPerNewsletter: parseInt(e.target.value) || 5 })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Annuler</Button>
              <Button onClick={handleSave} disabled={loading}>
                {editingWedge ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Secteur</TableHead>
                  <TableHead className="hidden lg:table-cell">Région</TableHead>
                  <TableHead className="text-right">Abonnés</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Envoyées</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Taux ouv.</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wedges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun wedge configuré. Créez votre premier wedge !
                    </TableCell>
                  </TableRow>
                ) : (
                  wedges.map((wedge) => {
                    const statusInfo = WEDGE_STATUS_MAP[wedge.status] ?? { label: wedge.status, variant: 'outline' as const }
                    return (
                      <TableRow key={wedge.id} className="group">
                        <TableCell className="font-medium">{wedge.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{wedge.sector}</TableCell>
                        <TableCell className="hidden lg:table-cell">{wedge.region}</TableCell>
                        <TableCell className="text-right">{formatNumber(wedge.subscriberCount)}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{wedge.totalSent}</TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
                          {wedge.avgOpenRate > 0 ? `${((wedge.avgOpenRate ?? 0) * 100).toFixed(1)}%` : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(wedge)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(wedge.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── View 3: Clients (User Management) ──────────────────────────────────────

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  role: string
  credits: number
  isActive: boolean
  subscription?: { id: string; plan: string; status: string; currentPeriodEnd?: string } | null
  adCount: number
  totalSpent: number
  lastActivity?: string
  createdAt?: string
}

function ClientsView() {
  const { showToast } = useAppStore()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [creditsAmount, setCreditsAmount] = useState('')
  const [creditsAction, setCreditsAction] = useState<'add' | 'remove'>('add')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(Array.isArray(data) ? data : data.users ?? [])
      }
    } catch {
      showToast('Erreur lors du chargement des utilisateurs', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.company ?? '').toLowerCase().includes(q)
    )
  }, [users, search])

  const kpis = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    revenue: users.reduce((s, u) => s + (u.totalSpent ?? 0), 0),
    credits: users.reduce((s, u) => s + (u.credits ?? 0), 0),
  }), [users])

  const handleCredits = async () => {
    if (!selectedUser || !creditsAmount || parseInt(creditsAmount) <= 0) {
      showToast('Veuillez entrer un montant valide', 'error')
      return
    }
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser.id, credits: parseInt(creditsAmount), action: creditsAction }),
      })
      if (res.ok) {
        showToast(`${creditsAction === 'add' ? 'Crédits ajoutés' : 'Crédits retirés'} avec succès`)
        setCreditsDialogOpen(false)
        setCreditsAmount('')
        fetchUsers()
      } else {
        const err = await res.json().catch(() => ({ error: 'Erreur' }))
        showToast(err.error || 'Erreur lors de l&apos;opération', 'error')
      }
    } catch {
      showToast('Erreur réseau', 'error')
    }
  }

  const handleToggleActive = async (user: AdminUser) => {
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, isActive: !user.isActive }),
      })
      if (res.ok) {
        showToast(`Utilisateur ${!user.isActive ? 'activé' : 'désactivé'}`)
        fetchUsers()
      }
    } catch {
      showToast('Erreur réseau', 'error')
    }
  }

  const openCreditsDialog = (user: AdminUser, action: 'add' | 'remove') => {
    setSelectedUser(user)
    setCreditsAction(action)
    setCreditsAmount('')
    setCreditsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={5} cols={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des clients</h2>
          <p className="text-muted-foreground text-sm">{users.length} utilisateur(s) inscrit(s)</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total clients</p>
                <p className="text-2xl font-bold">{kpis.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Clients actifs</p>
                <p className="text-2xl font-bold">{kpis.active}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenu total</p>
                <p className="text-2xl font-bold">{formatCurrency(kpis.revenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Crédits distribués</p>
                <p className="text-2xl font-bold">{formatNumber(kpis.credits)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Coins className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Entreprise</TableHead>
                  <TableHead className="text-center">Crédits</TableHead>
                  <TableHead className="hidden sm:table-cell">Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">Abonnement</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Annonces</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Dépenses</TableHead>
                  <TableHead className="hidden xl:table-cell">Dernière activité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className={!user.isActive ? 'opacity-60' : ''}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.company || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {user.credits ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role === 'ADMIN' ? 'Admin' : 'Client'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.subscription && user.subscription.status === 'ACTIVE' ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                            {user.subscription.plan}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">{user.adCount ?? 0}</TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        {formatCurrency(user.totalSpent ?? 0)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm">
                        {formatDate(user.lastActivity ?? user.createdAt ?? '')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600 hover:text-green-700"
                            onClick={() => openCreditsDialog(user, 'add')} title="Ajouter des crédits">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-red-600 hover:text-red-700"
                            onClick={() => openCreditsDialog(user, 'remove')} title="Retirer des crédits">
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2"
                            onClick={() => handleToggleActive(user)}
                            title={user.isActive ? 'Désactiver' : 'Activer'}>
                            <Ban className={`h-3.5 w-3.5 ${user.isActive ? 'text-orange-500' : 'text-green-500'}`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Credits Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {creditsAction === 'add' ? 'Ajouter des crédits' : 'Retirer des crédits'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.firstName} {selectedUser?.lastName} — Solde actuel : <strong>{selectedUser?.credits ?? 0} crédits</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="credits-amount">Montant</Label>
              <Input
                id="credits-amount"
                type="number"
                min={1}
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Entrez un montant..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                className={`flex-1 ${creditsAction === 'add' ? '' : 'opacity-50'}`}
                variant={creditsAction === 'add' ? 'default' : 'outline'}
                onClick={() => setCreditsAction('add')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
              <Button
                className={`flex-1 ${creditsAction === 'remove' ? '' : 'opacity-50'}`}
                variant={creditsAction === 'remove' ? 'destructive' : 'outline'}
                onClick={() => setCreditsAction('remove')}
              >
                <Minus className="mr-2 h-4 w-4" />
                Retirer
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditsDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleCredits}
              disabled={!creditsAmount || parseInt(creditsAmount) <= 0}
              variant={creditsAction === 'add' ? 'default' : 'destructive'}
            >
              {creditsAction === 'add' ? 'Ajouter' : 'Retirer'} {creditsAmount || '0'} crédits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── View 4: Newsletters ─────────────────────────────────────────────────────

function NewslettersView() {
  const { newsletters, wedges, ads, addNewsletter, updateNewsletter, showToast, setLoading } = useAppStore()
  const loading = useAppStore((s) => s.loading)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [previewNl, setPreviewNl] = useState<Newsletter | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [form, setForm] = useState({
    wedgeId: '', subject: '', editorialContent: '', aiArticle1: '', aiArticle2: '',
    questionOfMonth: '', adIds: [] as string[], scheduledAt: '',
  })

  const resetForm = useCallback(() => {
    setForm({ wedgeId: '', subject: '', editorialContent: '', aiArticle1: '', aiArticle2: '', questionOfMonth: '', adIds: [], scheduledAt: '' })
  }, [])

  const selectableAds = useMemo(
    () => ads.filter((a) => a.status === 'PENDING' || a.status === 'PAID' || a.status === 'APPROVED'),
    [ads]
  )

  const handleCreate = async () => {
    if (!form.wedgeId || !form.subject) {
      showToast('Veuillez sélectionner un wedge et un sujet', 'error')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        addNewsletter(data)
        showToast('Newsletter créée avec succès')
        setDialogOpen(false)
        resetForm()
      } else {
        const err = await res.json().catch(() => ({ error: 'Erreur' }))
        showToast(err.error || 'Erreur lors de la création', 'error')
      }
    } catch {
      showToast('Erreur lors de la création', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSimulate = async (nl: Newsletter) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const openCount = Math.floor(nl.recipientCount * (Math.random() * 0.3 + 0.2))
      const clickCount = Math.floor(nl.recipientCount * (Math.random() * 0.1 + 0.05))
      const res = await fetch('/api/newsletters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: nl.id,
          status: 'SENT',
          sentAt: new Date().toISOString(),
          openCount,
          clickCount,
        }),
      })
      if (res.ok) {
        updateNewsletter(nl.id, { status: 'SENT', sentAt: new Date().toISOString(), openCount, clickCount })
        showToast('Envoi simulé avec succès !')
      }
    } catch {
      showToast('Erreur lors de la simulation', 'error')
    } finally {
      setLoading(false)
    }
  }

  const toggleAd = (adId: string) => {
    setForm((prev) => ({
      ...prev,
      adIds: prev.adIds.includes(adId) ? prev.adIds.filter((id) => id !== adId) : [...prev.adIds, adId],
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-44" />
        </div>
        <TableSkeleton rows={5} cols={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Newsletters</h2>
          <p className="text-muted-foreground text-sm">{newsletters.length} newsletter(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Créer une Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Newsletter</DialogTitle>
              <DialogDescription>Composez et planifiez l&apos;envoi d&apos;une newsletter.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Wedge *</Label>
                  <Select value={form.wedgeId} onValueChange={(v) => setForm({ ...form, wedgeId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {wedges.filter((w) => w.status === 'ACTIVE').map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nlsubject">Sujet *</Label>
                  <Input id="nlsubject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Sujet de la newsletter" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nleditorial">Contenu éditorial</Label>
                <Textarea id="nleditorial" value={form.editorialContent} onChange={(e) => setForm({ ...form, editorialContent: e.target.value })} placeholder="Votre contenu éditorial..." rows={4} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nlai1">Article IA 1</Label>
                  <Textarea id="nlai1" value={form.aiArticle1} onChange={(e) => setForm({ ...form, aiArticle1: e.target.value })} placeholder="Titre ou résumé de l'article IA..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nlai2">Article IA 2</Label>
                  <Textarea id="nlai2" value={form.aiArticle2} onChange={(e) => setForm({ ...form, aiArticle2: e.target.value })} placeholder="Titre ou résumé de l'article IA..." rows={2} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nlquestion">Question du mois</Label>
                <Input id="nlquestion" value={form.questionOfMonth} onChange={(e) => setForm({ ...form, questionOfMonth: e.target.value })} placeholder="Question du mois..." />
              </div>
              <div className="space-y-2">
                <Label>Annonces à inclure</Label>
                {selectableAds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune annonce disponible (statut: en attente, approuvée ou payée)</p>
                ) : (
                  <div className="max-h-32 overflow-y-auto space-y-2 rounded-md border p-3">
                    {selectableAds.map((ad) => (
                      <label key={ad.id} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={form.adIds.includes(ad.id)}
                          onCheckedChange={() => toggleAd(ad.id)}
                        />
                        <span className="flex-1 truncate">{ad.title}</span>
                        <Badge className={AD_STATUS_MAP[ad.status]?.className ?? ''}>{AD_STATUS_MAP[ad.status]?.label ?? ad.status}</Badge>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nlschedule">Date d&apos;envoi planifiée</Label>
                <Input id="nlschedule" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Annuler</Button>
              <Button onClick={handleCreate} disabled={loading}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sujet</TableHead>
                  <TableHead className="hidden md:table-cell">Wedge</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden sm:table-cell">Date envoi</TableHead>
                  <TableHead className="text-right">Destinataires</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Ouvertures</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Clics</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucune newsletter. Créez-en une !
                    </TableCell>
                  </TableRow>
                ) : (
                  newsletters.map((nl) => {
                    const statusInfo = NEWSLETTER_STATUS_MAP[nl.status] ?? { label: nl.status, className: 'bg-gray-100 text-gray-700' }
                    return (
                      <TableRow key={nl.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{nl.subject}</TableCell>
                        <TableCell className="hidden md:table-cell">{nl.wedge?.name ?? '—'}</TableCell>
                        <TableCell>
                          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{formatDate(nl.sentAt ?? nl.scheduledAt ?? nl.createdAt)}</TableCell>
                        <TableCell className="text-right">{formatNumber(nl.recipientCount)}</TableCell>
                        <TableCell className="text-right hidden lg:table-cell">{formatNumber(nl.openCount)}</TableCell>
                        <TableCell className="text-right hidden lg:table-cell">{formatNumber(nl.clickCount)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {nl.status !== 'SENT' && (
                                <DropdownMenuItem onClick={() => handleSimulate(nl)}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Simuler l&apos;envoi
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => { setPreviewNl(nl); setPreviewOpen(true) }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Aperçu newsletter
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Newsletter Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {previewNl && (
            <NewsletterPreview
              newsletter={{
                subject: previewNl.subject,
                editorialContent: previewNl.editorialContent || undefined,
                aiArticle1: previewNl.aiArticle1 || undefined,
                aiArticle2: previewNl.aiArticle2 || undefined,
                questionOfMonth: previewNl.questionOfMonth || undefined,
                ads: ads
                  .filter((a) => a.wedgeId === previewNl.wedgeId && ['PAID', 'SCHEDULED', 'SENT', 'VALIDATED'].includes(a.status))
                  .map((a) => ({
                    title: a.title,
                    description: a.description,
                    sector: a.sector,
                    region: a.region,
                    cta: a.cta,
                  })),
                recipientCount: previewNl.recipientCount,
                sentAt: previewNl.sentAt || undefined,
                scheduledAt: previewNl.scheduledAt || undefined,
              }}
              wedgeName={previewNl.wedge?.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── View 5: Contacts ────────────────────────────────────────────────────────

function ContactsView() {
  const { contacts, wedges, showToast, setLoading, setContacts } = useAppStore()
  const loading = useAppStore((s) => s.loading)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [wedgeFilter, setWedgeFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', company: '', sector: '',
    postalCode: '', department: '', region: '', source: 'MANUAL',
  })

  const resetForm = useCallback(() => {
    setForm({ email: '', firstName: '', lastName: '', company: '', sector: '', postalCode: '', department: '', region: '', source: 'MANUAL' })
  }, [])

  const filteredContacts = useMemo(() => {
    let result = contacts
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.email.toLowerCase().includes(q) ||
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }
    return result
  }, [contacts, search, statusFilter])

  const stats = useMemo(() => ({
    total: contacts.length,
    active: contacts.filter((c) => c.status === 'ACTIVE').length,
    unsubscribed: contacts.filter((c) => c.status === 'UNSUBSCRIBED').length,
    bounced: contacts.filter((c) => c.status === 'BOUNCED').length,
  }), [contacts])

  const reloadContacts = useCallback(async () => {
    const token = localStorage.getItem('llb-token')
    try {
      const res = await fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data?.contacts)) {
          setContacts(data.contacts)
        } else if (Array.isArray(data)) {
          setContacts(data)
        }
      }
    } catch {
      // silent
    }
  }, [setContacts])

  const handleAdd = async () => {
    if (!form.email || !form.firstName || !form.lastName || !form.company || !form.sector || !form.postalCode || !form.department || !form.region) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Contact ajouté avec succès')
        setDialogOpen(false)
        resetForm()
        reloadContacts()
      } else {
        showToast(data.error || 'Erreur lors de l\'ajout', 'error')
      }
    } catch {
      showToast('Erreur lors de l\'ajout', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={5} cols={7} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground text-sm">{contacts.length} contact(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouveau contact</DialogTitle>
              <DialogDescription>Ajoutez un contact à votre base B2B.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cfirstname">Prénom *</Label>
                  <Input id="cfirstname" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clastname">Nom *</Label>
                  <Input id="clastname" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cemail">Email *</Label>
                <Input id="cemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccompany">Entreprise *</Label>
                <Input id="ccompany" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="csector">Secteur *</Label>
                  <Input id="csector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cdept">Département *</Label>
                  <Input id="cdept" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cregion">Région *</Label>
                  <Input id="cregion" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpostal">Code postal *</Label>
                  <Input id="cpostal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="Ex: 33000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL">Manuel</SelectItem>
                    <SelectItem value="IMPORT">Import CSV</SelectItem>
                    <SelectItem value="WEB">Formulaire web</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Annuler</Button>
              <Button onClick={handleAdd}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Désabonnés</p>
          <p className="text-2xl font-bold text-red-500">{stats.unsubscribed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Rejetés</p>
          <p className="text-2xl font-bold text-gray-500">{stats.bounced}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="UNSUBSCRIBED">Désabonné</SelectItem>
            <SelectItem value="BOUNCED">Rejeté</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
          </SelectContent>
        </Select>
        {wedges.length > 0 && (
          <Select value={wedgeFilter} onValueChange={setWedgeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Wedge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les wedges</SelectItem>
              {wedges.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Nom</TableHead>
                  <TableHead className="hidden lg:table-cell">Entreprise</TableHead>
                  <TableHead className="hidden xl:table-cell">Secteur</TableHead>
                  <TableHead className="hidden xl:table-cell">Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Score</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun contact trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => {
                    const statusInfo = CONTACT_STATUS_MAP[contact.status] ?? { label: contact.status, variant: 'outline' as const }
                    return (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{contact.firstName} {contact.lastName}</TableCell>
                        <TableCell className="hidden lg:table-cell">{contact.company}</TableCell>
                        <TableCell className="hidden xl:table-cell">{contact.sector}</TableCell>
                        <TableCell className="hidden xl:table-cell">{contact.department}</TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  contact.engagementScore >= 70 ? 'bg-green-500' :
                                  contact.engagementScore >= 40 ? 'bg-yellow-500' : 'bg-red-400'
                                }`}
                                style={{ width: `${Math.min(contact.engagementScore, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{contact.engagementScore}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="text-[10px]">{contact.source ?? '—'}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── View 6: Analytics (Enhanced) ───────────────────────────────────────────

function AnalyticsView() {
  const { wedges, newsletters, ads, contacts } = useAppStore()

  return (
    <AdminAnalytics
      wedges={wedges}
      newsletters={newsletters}
      ads={ads}
      contacts={contacts}
    />
  )
}

// ─── View 7: Validation (Ad Approval) ────────────────────────────────────────

function ValidationView() {
  const { showToast, setAds } = useAppStore()
  const [pendingAds, setPendingAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectingAd, setRejectingAd] = useState<Ad | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchPendingAds = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/ads?status=PENDING_VALIDATION', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPendingAds(Array.isArray(data) ? data : data.ads ?? [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPendingAds() }, [fetchPendingAds])

  const handleApprove = async (ad: Ad) => {
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: ad.id, status: 'VALIDATED' }),
      })
      if (res.ok) {
        setAds((prev) => prev.map((a) => a.id === ad.id ? { ...a, status: 'VALIDATED' } : a))
        setPendingAds((prev) => prev.filter((a) => a.id !== ad.id))
        showToast('Annonce validée avec succès')
      }
    } catch {
      showToast('Erreur lors de la validation', 'error')
    }
  }

  const handleReject = async () => {
    if (!rejectingAd || !rejectReason.trim()) {
      showToast('Veuillez entrer une raison de rejet', 'error')
      return
    }
    try {
      const token = localStorage.getItem('llb-token')
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: rejectingAd.id, status: 'REJECTED', rejectionReason: rejectReason }),
      })
      if (res.ok) {
        setAds((prev) => prev.map((a) => a.id === rejectingAd.id ? { ...a, status: 'REJECTED', rejectionReason } : a))
        setPendingAds((prev) => prev.filter((a) => a.id !== rejectingAd.id))
        showToast('Annonce rejetée')
        setRejectDialogOpen(false)
        setRejectReason('')
        setRejectingAd(null)
      }
    } catch {
      showToast('Erreur lors du rejet', 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={3} cols={6} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Validation des annonces</h2>
          <p className="text-muted-foreground text-sm">
            {pendingAds.length} annonce(s) en attente de validation
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPendingAds}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {pendingAds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Tout est en ordre !</h3>
            <p className="text-sm text-muted-foreground">Aucune annonce en attente de validation</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pendingAds.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-base truncate">{ad.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {ad.client?.firstName} {ad.client?.lastName} — {ad.client?.company ?? ad.client?.email}
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shrink-0">
                    En attente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-medium">Secteur :</span> {ad.sector || '—'}</div>
                  <div><span className="font-medium">Région :</span> {ad.region || '—'}</div>
                  <div><span className="font-medium">Wedge :</span> {ad.wedge?.name ?? '—'}</div>
                  <div><span className="font-medium">Budget :</span> {formatCurrency(ad.budget)}</div>
                </div>
                {ad.cta && (
                  <div className="text-xs">
                    <span className="font-medium">CTA :</span> {ad.cta}
                  </div>
                )}
                {ad.destinationUrl && (
                  <div className="text-xs truncate">
                    <span className="font-medium">URL :</span>{' '}
                    <a href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                      {ad.destinationUrl}
                    </a>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Créée le {formatDate(ad.createdAt)}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 gap-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(ad)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Valider
                </Button>
                <Button size="sm" variant="destructive" className="flex-1"
                  onClick={() => { setRejectingAd(ad); setRejectReason(''); setRejectDialogOpen(true) }}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter l&apos;annonce</DialogTitle>
            <DialogDescription>
              {rejectingAd?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Raison du rejet *</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez pourquoi cette annonce est rejetée..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setRejectingAd(null) }}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── View 8: Revenue ─────────────────────────────────────────────────────────

function RevenueView() {
  const { ads, showToast } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState<{
    stats: Record<string, number>
    pendingAds: number
    recentPayments: Array<{ id: string; date: string; client: string; amount: number; description: string; status: string }>
    monthlyRevenue: Array<{ month: string; revenue: number }>
  } | null>(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('llb-token')
        const res = await fetch('/api/admin', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setAdminData(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const totalRevenue = adminData?.stats?.totalRevenue ?? ads.filter((a) => a.status === 'PAID').reduce((s, a) => s + a.budget, 0)
  const monthlyRevenue = adminData?.stats?.monthlyRevenue ?? ads.filter((a) => a.status === 'PAID').reduce((s, a) => s + a.budget, 0)
  const adsRevenue = adminData?.stats?.adsRevenue ?? totalRevenue
  const pendingPayments = adminData?.stats?.pendingPayments ?? 0
  const chartData = adminData?.monthlyRevenue ?? []

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Revenus</h2>
          <p className="text-muted-foreground text-sm">Suivi financier de la plateforme</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => showToast('Export CSV en cours de développement', 'info')}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenu total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenu mensuel</p>
                <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenu annonces</p>
                <p className="text-2xl font-bold">{formatCurrency(adsRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Paiements en attente</p>
                <p className="text-2xl font-bold">{formatCurrency(pendingPayments)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Recent Payments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Revenus mensuels</CardTitle>
            <CardDescription>6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}€`} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenu']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="revenue" fill="#e67e22" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <p className="text-sm">Aucune donnée disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Paiements récents</CardTitle>
          </CardHeader>
          <CardContent>
            {adminData?.recentPayments && adminData.recentPayments.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-3">
                {adminData.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{payment.description || payment.client}</p>
                      <p className="text-xs text-muted-foreground">{payment.client} — {formatDate(payment.date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                      <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-[10px]">
                        {payment.status === 'COMPLETED' ? 'Terminé' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Aucun paiement récent</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── View 9: Settings ────────────────────────────────────────────────────────

function SettingsView() {
  const { showToast } = useAppStore()
  const [settings, setSettings] = useState({
    platformName: 'La Lettre Business',
    platformDescription: 'Plateforme B2B de diffusion d\'annonces publicitaires par newsletters professionnelles',
    defaultCredits: 100,
    defaultAdPrice: 49,
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'noreply@lalettrebusiness.fr',
    supportEmail: 'support@lalettrebusiness.fr',
    autoApproveAds: false,
  })

  const handleSave = () => {
    showToast('Paramètres sauvegardés (simulation)', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground text-sm">Configuration de la plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Plateforme</CardTitle>
            <CardDescription>Informations générales de la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nom de la plateforme</Label>
              <Input
                id="platform-name"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-desc">Description</Label>
              <Textarea
                id="platform-desc"
                value={settings.platformDescription}
                onChange={(e) => setSettings({ ...settings, platformDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email de support</Label>
              <div className="relative">
                <MailCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="support-email"
                  type="email"
                  className="pl-9"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tarification &amp; Crédits</CardTitle>
            <CardDescription>Configuration des prix et crédits par défaut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-credits">Crédits par défaut (nouvel utilisateur)</Label>
              <Input
                id="default-credits"
                type="number"
                min={0}
                value={settings.defaultCredits}
                onChange={(e) => setSettings({ ...settings, defaultCredits: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-price">Prix par défaut d&apos;une annonce</Label>
              <div className="relative">
                <Input
                  id="default-price"
                  type="number"
                  min={0}
                  step={1}
                  value={settings.defaultAdPrice}
                  onChange={(e) => setSettings({ ...settings, defaultAdPrice: parseInt(e.target.value) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€ HT</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approve" className="text-sm font-medium">Auto-approbation des annonces</Label>
                <p className="text-xs text-muted-foreground">Les nouvelles annonces sont validées automatiquement</p>
              </div>
              <Switch
                id="auto-approve"
                checked={settings.autoApproveAds}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApproveAds: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* SMTP Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Configuration SMTP</CardTitle>
                <CardDescription>Paramètres d&apos;envoi d&apos;emails (affichage uniquement)</CardDescription>
              </div>
              <Badge variant="secondary">Lecture seule</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Hôte SMTP</Label>
                <Input
                  id="smtp-host"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Utilisateur SMTP</Label>
                <Input
                  id="smtp-user"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Pencil className="mr-2 h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  )
}

// ─── Main AdminDashboard Component ───────────────────────────────────────────

export default function AdminDashboard() {
  const { currentView, wedges, ads, newsletters, contacts, setWedges, setAds, setNewsletters, setContacts, showToast } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  // Load data on mount
  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('llb-token')

    const loadWedges = async () => {
      try {
        const res = await fetch('/api/wedges', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setWedges(Array.isArray(data) ? data : [])
        }
      } catch {
        // silently fail
      }
    }

    const loadAds = async () => {
      try {
        const res = await fetch('/api/ads', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setAds(Array.isArray(data) ? data : [])
        }
      } catch {
        // silently fail
      }
    }

    const loadNewsletters = async () => {
      try {
        const res = await fetch('/api/newsletters', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setNewsletters(Array.isArray(data) ? data : [])
        }
      } catch {
        // silently fail
      }
    }

    const loadContacts = async () => {
      try {
        const res = await fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data?.contacts)) {
            setContacts(data.contacts)
          } else if (Array.isArray(data)) {
            setContacts(data)
          }
        }
      } catch {
        // silently fail
      }
    }

    const loadPendingCount = async () => {
      try {
        const res = await fetch('/api/ads?status=PENDING_VALIDATION', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const arr = Array.isArray(data) ? data : data.ads ?? []
          setPendingCount(arr.length)
        }
      } catch {
        // silently fail
      }
    }

    Promise.all([loadWedges(), loadAds(), loadNewsletters(), loadContacts(), loadPendingCount()])
  }, [setWedges, setAds, setNewsletters, setContacts])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'admin/dashboard':
        return <DashboardView />
      case 'admin/validation':
        return <ValidationView />
      case 'admin/wedges':
        return <WedgesView />
      case 'admin/clients':
        return <ClientsView />
      case 'admin/newsletters':
        return <NewslettersView />
      case 'admin/contacts':
        return <ContactsView />
      case 'admin/revenue':
        return <RevenueView />
      case 'admin/analytics':
        return <AnalyticsView />
      case 'admin/settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="gradient-dark hidden w-64 shrink-0 lg:block">
        <SidebarNav pendingValidationCount={pendingCount} />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden bg-background shadow-md border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 gradient-dark">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setMobileOpen(false)} pendingValidationCount={pendingCount} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile top bar spacer */}
          <div className="h-10 lg:hidden" />
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
