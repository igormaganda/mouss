'use client'

import React, { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DollarSign,
  MailOpen,
  MousePointerClick,
  UserPlus,
  Megaphone,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.', ',')}k`
  return n.toLocaleString('fr-FR')
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

// ─── Deterministic seeded random for stable demo data ─────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Mini Sparkline SVG ──────────────────────────────────────────────────────

function Sparkline({
  data,
  color = '#2563eb',
  width = 80,
  height = 28,
}: {
  data: number[]
  color?: string
  width?: number
  height?: number
}) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  const fillPoints = `0,${height} ${points} ${width},${height}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#spark-fill-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Chart Colors ────────────────────────────────────────────────────────────

const CHART_COLORS = ['#2563eb', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4']

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#94a3b8',
  PENDING: '#f59e0b',
  PAID: '#2563eb',
  SENT: '#10b981',
  REJECTED: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  PAID: 'Payé',
  SENT: 'Envoyé',
  REJECTED: 'Rejeté',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface WedgeSimple {
  id: string
  name: string
  sector: string
  subscriberCount: number
  avgOpenRate: number
  avgClickRate: number
}

interface NewsletterSimple {
  id: string
  subject: string
  status: string
  recipientCount: number
  openCount: number
  clickCount: number
  sentAt?: string
  wedgeId: string
  wedge?: { name: string }
}

interface AdSimple {
  id: string
  title: string
  status: string
  budget: number
  openCount: number
  clickCount: number
}

interface ContactSimple {
  id: string
  status: string
  createdAt: string
}

interface AdminAnalyticsProps {
  wedges: WedgeSimple[]
  newsletters: NewsletterSimple[]
  ads: AdSimple[]
  contacts: ContactSimple[]
}

interface ClientAd {
  id: string
  title: string
  description: string
  status: string
  budget: number
  openCount: number
  clickCount: number
  sector: string
  region: string
  createdAt: string
  wedge?: { name: string }
}

interface ClientAnalyticsProps {
  ads: ClientAd[]
  platformAvgOpenRate?: number
  platformAvgClickRate?: number
}

type DateRange = '7d' | '30d' | '90d' | '12m' | 'all'

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">
            {formatter ? formatter(entry.value) : entry.value.toLocaleString('fr-FR')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN ANALYTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function AdminAnalytics({
  wedges,
  newsletters,
  ads,
  contacts,
}: AdminAnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const rand = useMemo(() => seededRandom(42), [])

  // ── Compute KPIs ──────────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const totalRevenue = ads.reduce((sum, a) => sum + a.budget, 0)

    const sentNewsletters = newsletters.filter((n) => n.status === 'SENT')
    const avgOpenRate =
      sentNewsletters.length > 0
        ? sentNewsletters.reduce((sum, n) => {
            const rate = n.recipientCount > 0 ? n.openCount / n.recipientCount : 0
            return sum + rate
          }, 0) / sentNewsletters.length
        : 0

    const avgClickRate =
      sentNewsletters.length > 0
        ? sentNewsletters.reduce((sum, n) => {
            const rate = n.openCount > 0 ? n.clickCount / n.openCount : 0
            return sum + rate
          }, 0) / sentNewsletters.length
        : 0

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const newContactsMonth = contacts.filter(
      (c) => new Date(c.createdAt) >= monthStart
    ).length

    const activeAds = ads.filter(
      (a) => a.status === 'PAID' || a.status === 'SENT'
    ).length

    const totalClicks = sentNewsletters.reduce((s, n) => s + n.clickCount, 0)
    const totalRecipients = sentNewsletters.reduce((s, n) => s + n.recipientCount, 0)
    const conversionRate = totalRecipients > 0 ? totalClicks / totalRecipients : 0

    // Generate sparkline data (deterministic)
    const revSparkline = Array.from({ length: 7 }, () => {
      const base = totalRevenue / 7
      return Math.max(0, base + (rand() - 0.5) * base * 0.8)
    })
    const openSparkline = Array.from({ length: 7 }, () => {
      return Math.max(0, avgOpenRate + (rand() - 0.5) * 0.3)
    })
    const clickSparkline = Array.from({ length: 7 }, () => {
      return Math.max(0, avgClickRate + (rand() - 0.5) * 0.2)
    })
    const contactSparkline = Array.from({ length: 7 }, (_, i) => {
      return Math.max(0, newContactsMonth / 7 + (rand() - 0.5) * 5)
    })
    const adSparkline = Array.from({ length: 7 }, () => {
      return Math.max(0, activeAds + (rand() - 0.5) * 3)
    })
    const convSparkline = Array.from({ length: 7 }, () => {
      return Math.max(0, conversionRate + (rand() - 0.5) * 0.05)
    })

    return [
      {
        label: "Chiffre d'affaires",
        value: formatCurrency(totalRevenue),
        rawValue: totalRevenue,
        trend: 12.5,
        icon: DollarSign,
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        iconColor: 'text-amber-600 dark:text-amber-400',
        sparkline: revSparkline,
        sparkColor: '#f59e0b',
      },
      {
        label: 'Taux d\'ouverture moyen',
        value: formatPercent(avgOpenRate),
        rawValue: avgOpenRate,
        trend: 3.2,
        icon: MailOpen,
        iconBg: 'bg-blue-100 dark:bg-blue-900/40',
        iconColor: 'text-blue-600 dark:text-blue-400',
        sparkline: openSparkline,
        sparkColor: '#2563eb',
      },
      {
        label: 'Taux de clic moyen',
        value: formatPercent(avgClickRate),
        rawValue: avgClickRate,
        trend: -1.8,
        icon: MousePointerClick,
        iconBg: 'bg-purple-100 dark:bg-purple-900/40',
        iconColor: 'text-purple-600 dark:text-purple-400',
        sparkline: clickSparkline,
        sparkColor: '#8b5cf6',
      },
      {
        label: 'Nouveaux contacts ce mois',
        value: formatNumber(newContactsMonth),
        rawValue: newContactsMonth,
        trend: 8.7,
        icon: UserPlus,
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        sparkline: contactSparkline,
        sparkColor: '#10b981',
      },
      {
        label: 'Annonces actives',
        value: formatNumber(activeAds),
        rawValue: activeAds,
        trend: 15.3,
        icon: Megaphone,
        iconBg: 'bg-orange-100 dark:bg-orange-900/40',
        iconColor: 'text-orange-600 dark:text-orange-400',
        sparkline: adSparkline,
        sparkColor: '#f97316',
      },
      {
        label: 'Taux de conversion',
        value: formatPercent(conversionRate),
        rawValue: conversionRate,
        trend: -2.1,
        icon: Target,
        iconBg: 'bg-rose-100 dark:bg-rose-900/40',
        iconColor: 'text-rose-600 dark:text-rose-400',
        sparkline: convSparkline,
        sparkColor: '#ef4444',
      },
    ]
  }, [ads, newsletters, contacts, rand])

  // ── Revenue Over Time ─────────────────────────────────────────────────────

  const revenueData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30
    const totalBudget = ads.reduce((s, a) => s + a.budget, 0) || 5000
    const baseDaily = totalBudget / Math.max(days, 30)

    return Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const label = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      const value = Math.max(0, baseDaily * (0.6 + rand() * 0.8))
      return { name: label, revenus: Math.round(value) }
    })
  }, [dateRange, ads, rand])

  // ── Performance par Wedge ─────────────────────────────────────────────────

  const wedgePerformanceData = useMemo(() => {
    if (wedges.length === 0) {
      // Generate demo data
      return [
        { name: 'Tech & SaaS', tauxOuverture: 0.72, tauxClic: 0.14 },
        { name: 'Finance', tauxOuverture: 0.65, tauxClic: 0.11 },
        { name: 'Santé', tauxOuverture: 0.58, tauxClic: 0.09 },
        { name: 'Immobilier', tauxOuverture: 0.61, tauxClic: 0.12 },
        { name: 'Retail', tauxOuverture: 0.55, tauxClic: 0.08 },
      ]
    }
    return wedges.map((w) => ({
      name: w.name,
      tauxOuverture: w.avgOpenRate || 0.4 + rand() * 0.4,
      tauxClic: w.avgClickRate || 0.05 + rand() * 0.15,
    }))
  }, [wedges, rand])

  // ── Ad Status Distribution ────────────────────────────────────────────────

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      DRAFT: 0,
      PENDING: 0,
      PAID: 0,
      SENT: 0,
      REJECTED: 0,
    }
    ads.forEach((a) => {
      if (a.status in counts) counts[a.status]++
    })

    // If no real data, generate demo
    if (Object.values(counts).every((v) => v === 0)) {
      counts.DRAFT = 12
      counts.PENDING = 8
      counts.PAID = 25
      counts.SENT = 35
      counts.REJECTED = 5
    }

    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, value]) => ({
        name: STATUS_LABELS[status] || status,
        value,
        status,
      }))
  }, [ads])

  const totalAds = useMemo(() => statusData.reduce((s, d) => s + d.value, 0), [statusData])

  // ── Subscriber Evolution ──────────────────────────────────────────────────

  const subscriberData = useMemo(() => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
    ]

    if (wedges.length === 0) {
      const demoWedges = ['Tech & SaaS', 'Finance', 'Santé']
      return months.map((m, i) => {
        const base: Record<string, number> = {}
        demoWedges.forEach((w) => {
          base[w] = Math.round(500 + i * (80 + rand() * 60) + rand() * 30)
        })
        return { name: m, ...base }
      })
    }

    return months.map((m, i) => {
      const base: Record<string, number> = {}
      wedges.slice(0, 6).forEach((w) => {
        const start = w.subscriberCount * 0.4
        const growth = (w.subscriberCount - start) / 11
        base[w.name] = Math.max(0, Math.round(start + growth * i + (rand() - 0.5) * 20))
      })
      return { name: m, ...base }
    })
  }, [wedges, rand])

  // ── Top 5 Newsletters Table ───────────────────────────────────────────────

  const topNewsletters = useMemo(() => {
    const sent = newsletters.filter((n) => n.status === 'SENT' && n.recipientCount > 0)
    if (sent.length === 0) {
      return [
        { subject: 'Les tendances IA 2025', wedge: 'Tech & SaaS', recipients: 2400, opens: 1680, openRate: 0.70, clicks: 336, clickRate: 0.14, date: '15/01/2025' },
        { subject: 'Optimisation fiscale Q1', wedge: 'Finance', recipients: 1850, opens: 1202, openRate: 0.65, clicks: 204, clickRate: 0.11, date: '12/01/2025' },
        { subject: 'Nouveautés réglementaires', wedge: 'Santé', recipients: 2100, opens: 1218, openRate: 0.58, clicks: 190, clickRate: 0.09, date: '10/01/2025' },
        { subject: 'Guide investissement immobilier', wedge: 'Immobilier', recipients: 1600, opens: 976, openRate: 0.61, clicks: 176, clickRate: 0.11, date: '08/01/2025' },
        { subject: 'Promo partenaires exclusives', wedge: 'Retail', recipients: 3200, opens: 1760, openRate: 0.55, clicks: 256, clickRate: 0.10, date: '05/01/2025' },
      ]
    }

    return sent
      .map((n) => ({
        subject: n.subject,
        wedge: n.wedge?.name || '—',
        recipients: n.recipientCount,
        opens: n.openCount,
        openRate: n.openCount / n.recipientCount,
        clicks: n.clickCount,
        clickRate: n.openCount > 0 ? n.clickCount / n.openCount : 0,
        date: n.sentAt
          ? new Date(n.sentAt).toLocaleDateString('fr-FR')
          : '—',
      }))
      .sort((a, b) => b.clickRate - a.clickRate)
      .slice(0, 5)
  }, [newsletters])

  // ── Date Range Buttons ────────────────────────────────────────────────────

  const dateRangeOptions: { label: string; value: DateRange }[] = [
    { label: '7 jours', value: '7d' },
    { label: '30 jours', value: '30d' },
    { label: '90 jours', value: '90d' },
    { label: '12 mois', value: '12m' },
    { label: 'Tout', value: 'all' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const isPositive = kpi.trend >= 0
          return (
            <Card key={kpi.label} className="gap-3 py-4">
              <CardContent className="space-y-2 px-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${kpi.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                  </div>
                  <Sparkline data={kpi.sparkline} color={kpi.sparkColor} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="mt-0.5 text-lg font-bold tracking-tight">
                    {kpi.value}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-rose-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {(kpi.trend ?? 0).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">vs mois préc.</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {dateRangeOptions.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={dateRange === opt.value ? 'default' : 'outline'}
            onClick={() => setDateRange(opt.value)}
            className="h-7 text-xs"
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Chiffre d&apos;affaires dans le temps
            </CardTitle>
            <CardDescription>
              Revenus quotidiens sur la période sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    content={<CustomTooltip formatter={(v) => formatCurrency(v as number)} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenus"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#revGradient)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance par Wedge */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Performance par Wedge
            </CardTitle>
            <CardDescription>
              Taux d&apos;ouverture et de clic par wedge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wedgePerformanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={90}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={<CustomTooltip formatter={(v) => formatPercent(v as number)} />}
                  />
                  <Legend
                    verticalAlign="top"
                    height={28}
                    formatter={(value) =>
                      value === 'tauxOuverture' ? 'Taux ouv.' : 'Taux clic'
                    }
                  />
                  <Bar
                    dataKey="tauxOuverture"
                    fill="#2563eb"
                    radius={[0, 4, 4, 0]}
                    animationDuration={800}
                    barSize={10}
                  />
                  <Bar
                    dataKey="tauxClic"
                    fill="#f97316"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1000}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ad Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Répartition des statuts d&apos;annonces
            </CardTitle>
            <CardDescription>Distribution actuelle des annonces</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || CHART_COLORS[index % CHART_COLORS.length]}
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CustomTooltip formatter={(v) => `${v} annonces`} />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text overlay */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{totalAds}</span>
                <span className="text-xs text-muted-foreground">annonces</span>
              </div>
              {/* Legend */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                {statusData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[entry.status] || CHART_COLORS[i] }}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriber Evolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Évolution des abonnés
            </CardTitle>
            <CardDescription>
              Croissance mensuelle par wedge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={subscriberData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip formatter={(v) => formatNumber(v as number)} />
                    }
                  />
                  <Legend
                    verticalAlign="top"
                    height={28}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  {wedges.length > 0
                    ? wedges.slice(0, 6).map((w, i) => (
                        <Line
                          key={w.id}
                          type="monotone"
                          dataKey={w.name}
                          stroke={CHART_COLORS[i % CHART_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          animationDuration={1200}
                          animationBegin={i * 150}
                        />
                      ))
                    : ['Tech & SaaS', 'Finance', 'Santé'].map((name, i) => (
                        <Line
                          key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={CHART_COLORS[i % CHART_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          animationDuration={1200}
                          animationBegin={i * 150}
                        />
                      ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Newsletters Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Top 5 newsletters les plus performantes
          </CardTitle>
          <CardDescription>
            Classées par taux de clic
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="px-6 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Sujet</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Wedge</th>
                  <th className="px-3 py-2 font-medium text-right hidden sm:table-cell">Destinataires</th>
                  <th className="px-3 py-2 font-medium text-right hidden sm:table-cell">Ouvertures</th>
                  <th className="px-3 py-2 font-medium text-right">Taux ouv.</th>
                  <th className="px-3 py-2 font-medium text-right hidden sm:table-cell">Clics</th>
                  <th className="px-3 py-2 font-medium text-right">Taux clic.</th>
                  <th className="px-3 py-2 font-medium text-right hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {topNewsletters.map((nl, i) => (
                  <tr
                    key={i}
                    className={`border-b transition-colors hover:bg-muted/30 ${
                      i === 0
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                        : i % 2 === 0
                        ? ''
                        : 'bg-muted/20'
                    }`}
                  >
                    <td className="px-6 py-2.5">
                      {i === 0 ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          1
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 max-w-[200px] truncate font-medium">
                      {nl.subject}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">
                      {nl.wedge}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">
                      {formatNumber(nl.recipients)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">
                      {formatNumber(nl.opens)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatPercent(nl.openRate)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">
                      {formatNumber(nl.clicks)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-medium">
                      {formatPercent(nl.clickRate)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground hidden lg:table-cell">
                      {nl.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIENT ANALYTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ClientAnalytics({
  ads,
  platformAvgOpenRate = 0.62,
  platformAvgClickRate = 0.12,
}: ClientAnalyticsProps) {
  const rand = useMemo(() => seededRandom(99), [])

  // ── Computed Client Averages ──────────────────────────────────────────────

  const clientAvgOpenRate = useMemo(() => {
    if (ads.length === 0) return 0
    const withRecipients = ads.filter((a) => a.openCount > 0)
    if (withRecipients.length === 0) return 0
    const sum = withRecipients.reduce((s, a) => s + Math.min(a.openCount / Math.max(a.openCount, 1), 1), 0)
    return sum / withRecipients.length
  }, [ads])

  const clientAvgClickRate = useMemo(() => {
    if (ads.length === 0) return 0
    const withOpens = ads.filter((a) => a.openCount > 0)
    if (withOpens.length === 0) return 0
    return withOpens.reduce((s, a) => s + a.clickCount / a.openCount, 0) / withOpens.length
  }, [ads])

  // ── Performance Score ─────────────────────────────────────────────────────

  const performanceScore = useMemo(() => {
    if (ads.length === 0) return 0
    // Score from open rate, click rate, and budget efficiency
    const openScore = Math.min(clientAvgOpenRate / 0.8, 1) * 40 // 40 pts max
    const clickScore = Math.min(clientAvgClickRate / 0.2, 1) * 30 // 30 pts max
    const totalBudget = ads.reduce((s, a) => s + a.budget, 0)
    const totalClicks = ads.reduce((s, a) => s + a.clickCount, 0)
    const avgCpc = totalClicks > 0 ? totalBudget / totalClicks : 999
    const efficiencyScore = Math.max(0, 1 - avgCpc / 20) * 30 // 30 pts max
    return Math.round(openScore + clickScore + efficiencyScore)
  }, [ads, clientAvgOpenRate, clientAvgClickRate])

  const scoreColor = useMemo(() => {
    if (performanceScore <= 40) return { text: 'text-rose-600 dark:text-rose-400', stroke: '#ef4444', bg: 'bg-rose-100 dark:bg-rose-900/30' }
    if (performanceScore <= 70) return { text: 'text-amber-600 dark:text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-100 dark:bg-amber-900/30' }
    return { text: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
  }, [performanceScore])

  const circumference = 2 * Math.PI * 54
  const scoreOffset = circumference - (performanceScore / 100) * circumference

  // ── Per-Ad Performance Cards ──────────────────────────────────────────────

  const adPerformances = useMemo(() => {
    if (ads.length === 0) return []

    const totalAvgCtr = ads.reduce((s, a) => s + (a.openCount > 0 ? a.clickCount / a.openCount : 0), 0) / ads.length

    return ads.map((ad) => {
      const ctr = ad.openCount > 0 ? ad.clickCount / ad.openCount : 0
      const cpc = ad.clickCount > 0 ? ad.budget / ad.clickCount : 0
      const sparkData = Array.from({ length: 7 }, () => Math.max(0, ctr + (rand() - 0.5) * 0.1))
      return {
        id: ad.id,
        title: ad.title,
        status: ad.status,
        opens: ad.openCount,
        clicks: ad.clickCount,
        ctr,
        cpc,
        sparkData,
        ctrVsAvg: totalAvgCtr > 0 ? ctr / totalAvgCtr : 0,
      }
    })
  }, [ads, rand])

  const AD_STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    SENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    REJECTED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  }

  const AD_STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Brouillon',
    PENDING: 'En attente',
    PAID: 'Payé',
    SENT: 'Envoyé',
    REJECTED: 'Rejeté',
  }

  // ── Temporal Performance Chart Data ───────────────────────────────────────

  const temporalData = useMemo(() => {
    const last10 = ads.slice(-10)

    if (last10.length === 0) {
      return Array.from({ length: 6 }, (_, i) => ({
        name: `Annonce ${i + 1}`,
        ouvertures: Math.round(200 + rand() * 500),
        clics: Math.round(30 + rand() * 100),
      }))
    }

    return last10.map((ad, i) => ({
      name: ad.title.length > 20 ? ad.title.substring(0, 20) + '…' : ad.title,
      ouvertures: ad.openCount || Math.round(200 + rand() * 400),
      clics: ad.clickCount || Math.round(20 + rand() * 80),
    }))
  }, [ads, rand])

  // ── ROI per Sector Data ───────────────────────────────────────────────────

  const sectorData = useMemo(() => {
    const sectorMap: Record<string, { totalCost: number; totalClicks: number }> = {}

    ads.forEach((ad) => {
      if (!sectorMap[ad.sector]) {
        sectorMap[ad.sector] = { totalCost: 0, totalClicks: 0 }
      }
      sectorMap[ad.sector].totalCost += ad.budget
      sectorMap[ad.sector].totalClicks += ad.clickCount
    })

    if (Object.keys(sectorMap).length === 0) {
      return [
        { name: 'Tech', coutParClic: 4.2 },
        { name: 'Finance', coutParClic: 6.8 },
        { name: 'Santé', coutParClic: 5.1 },
        { name: 'Immobilier', coutParClic: 7.3 },
      ]
    }

    return Object.entries(sectorMap)
      .map(([sector, data]) => ({
        name: sector,
        coutParClic: data.totalClicks > 0 ? Math.round((data.totalCost / data.totalClicks) * 100) / 100 : 0,
      }))
      .sort((a, b) => a.coutParClic - b.coutParClic)
  }, [ads])

  return (
    <div className="space-y-6">
      {/* Performance Score Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <p className="text-sm font-medium text-muted-foreground">
              Score de performance global
            </p>
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreColor.stroke}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={scoreOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${scoreColor.text}`}>
                  {performanceScore}
                </span>
                <span className="text-[10px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className={`text-xs font-medium ${scoreColor.text}`}>
              {performanceScore <= 40
                ? 'Performance à améliorer'
                : performanceScore <= 70
                ? 'Performance correcte'
                : 'Excellente performance'}
            </p>
          </CardContent>
        </Card>

        {/* Quick Summary Cards */}
        <Card className="gap-3 py-4">
          <CardContent className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Total annonces</p>
              <Badge variant="secondary">{ads.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Annonces actives</p>
              <Badge variant="secondary">
                {ads.filter((a) => a.status === 'PAID' || a.status === 'SENT').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Ouvertures totales</p>
              <span className="text-sm font-semibold">
                {formatNumber(ads.reduce((s, a) => s + a.openCount, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Clics totaux</p>
              <span className="text-sm font-semibold">
                {formatNumber(ads.reduce((s, a) => s + a.clickCount, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Budget total</p>
              <span className="text-sm font-semibold">
                {formatCurrency(ads.reduce((s, a) => s + a.budget, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Mini */}
        <Card className="gap-3 py-4">
          <CardContent className="space-y-4 px-4">
            <p className="text-xs font-medium text-muted-foreground">
              vs Moyenne LLB
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux ouv. vous</span>
                <span className="font-semibold">{formatPercent(clientAvgOpenRate)}</span>
              </div>
              <Progress value={clientAvgOpenRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux ouv. plateforme</span>
                <span className="font-semibold text-muted-foreground">
                  {formatPercent(platformAvgOpenRate)}
                </span>
              </div>
              <Progress value={platformAvgOpenRate * 100} className="h-2 opacity-50" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux clic vous</span>
                <span className="font-semibold">{formatPercent(clientAvgClickRate)}</span>
              </div>
              <Progress value={clientAvgClickRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux clic plateforme</span>
                <span className="font-semibold text-muted-foreground">
                  {formatPercent(platformAvgClickRate)}
                </span>
              </div>
              <Progress value={platformAvgClickRate * 100} className="h-2 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Ad Performance Cards */}
      {adPerformances.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Performance par annonce</h3>
          <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
            {adPerformances.map((ad) => (
              <Card key={ad.id} className="gap-3 py-3 transition-shadow hover:shadow-md">
                <CardContent className="space-y-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{ad.title}</p>
                      <span
                        className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          AD_STATUS_COLORS[ad.status] || 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {AD_STATUS_LABELS[ad.status] || ad.status}
                      </span>
                    </div>
                    <Sparkline
                      data={ad.sparkData}
                      color={ad.ctr >= clientAvgClickRate ? '#10b981' : '#ef4444'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Ouvertures</p>
                      <p className="text-sm font-semibold tabular-nums">{formatNumber(ad.opens)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Clics</p>
                      <p className="text-sm font-semibold tabular-nums">{formatNumber(ad.clicks)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">CTR</p>
                      <p className="text-sm font-semibold tabular-nums">{formatPercent(ad.ctr)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Coût/clic</p>
                      <p className="text-sm font-semibold tabular-nums">
                        {ad.cpc > 0 ? formatCurrency(ad.cpc) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* CTR relative bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">CTR vs moyenne</span>
                      <span className="font-medium">
                        {ad.ctrVsAvg >= 1 ? '+' : ''}
                        {(((ad.ctrVsAvg ?? 1) - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(ad.ctrVsAvg * 100, 100)}%`,
                          backgroundColor:
                            ad.ctrVsAvg >= 1 ? '#10b981' : '#f59e0b',
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Charts 2x1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Temporal Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Performance temporelle
            </CardTitle>
            <CardDescription>Ouvertures et clics par annonce</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={temporalData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                  />
                  <Legend
                    verticalAlign="top"
                    height={28}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Bar
                    dataKey="ouvertures"
                    name="Ouvertures"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="clics"
                    name="Clics"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#f97316' }}
                    activeDot={{ r: 6 }}
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ROI per Sector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Coût par clic par secteur
            </CardTitle>
            <CardDescription>
              Optimisation du budget par secteur d&apos;activité
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v.toFixed(1)}€`}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={80}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={
                      <CustomTooltip formatter={(v) => `${(v as number).toFixed(2)} €`} />
                    }
                  />
                  <Bar
                    dataKey="coutParClic"
                    name="Coût/clic"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1000}
                    barSize={16}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell
                        key={`sector-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Banner */}
      <Card className="overflow-hidden border-l-4 border-l-blue-500">
        <CardContent className="py-5 px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-blue-500" />
                Vos performances vs moyenne LLB
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Comparaison de vos indicateurs avec la moyenne de la plateforme
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Open Rate Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Taux d&apos;ouverture</span>
                <span className="text-muted-foreground">
                  Moy. plateforme : {formatPercent(platformAvgOpenRate)}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-muted-foreground">Vous</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min((clientAvgOpenRate / Math.max(platformAvgOpenRate, 0.01)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-semibold tabular-nums">
                    {formatPercent(clientAvgOpenRate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-muted-foreground">Moy. LLB</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-muted-foreground/30 transition-all duration-1000"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-medium text-muted-foreground tabular-nums">
                    {formatPercent(platformAvgOpenRate)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {clientAvgOpenRate >= platformAvgOpenRate ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ↑ Vous êtes au-dessus de la moyenne
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    ↓ En dessous de la moyenne — optimisez vos objets d&apos;email
                  </span>
                )}
              </p>
            </div>

            {/* Click Rate Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Taux de clic</span>
                <span className="text-muted-foreground">
                  Moy. plateforme : {formatPercent(platformAvgClickRate)}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-muted-foreground">Vous</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-1000"
                      style={{
                        width: `${Math.min((clientAvgClickRate / Math.max(platformAvgClickRate, 0.01)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-semibold tabular-nums">
                    {formatPercent(clientAvgClickRate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-muted-foreground">Moy. LLB</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-muted-foreground/30 transition-all duration-1000"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-medium text-muted-foreground tabular-nums">
                    {formatPercent(platformAvgClickRate)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {clientAvgClickRate >= platformAvgClickRate ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ↑ Vous êtes au-dessus de la moyenne
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    ↓ En dessous de la moyenne — travaillez vos call-to-action
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
