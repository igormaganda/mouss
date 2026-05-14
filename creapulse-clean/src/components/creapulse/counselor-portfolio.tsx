'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Users,
  Clock,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  CalendarPlus,
  FileText,
  Loader2,
  Inbox,
  TrendingUp,
  Award,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────
interface PorteurData {
  id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  assignmentStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  assignedAt: string
  lastActivity?: string
  // Business Plan
  bpStatus?: 'QUESTIONNAIRE' | 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'ARCHIVED'
  bpSector?: string
  bpProjectName?: string
  bpProgress?: number
  // Go/No-Go
  goNoGoDecision?: 'GO' | 'NO_GO' | 'PENDING'
  goNoGoScore?: number
  // RIASEC
  riasecDominant?: string
  // Interviews
  interviewCount: number
  // Kiviat (mini radar)
  kiviatDimensions?: { dimension: string; value: number; maxValue: number }[]
  // Pepites (top 3 kept from triptych)
  topPepites?: string[]
  // Counselor note
  lastCounselorNote?: string
  lastCounselorNoteAt?: string
  // Module progress
  modulesCompleted: number
  modulesTotal: number
}

type StatusFilter = 'all' | 'active' | 'completed'

// ── Animation variants ───────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ── Helpers ──────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-500'
    case 'COMPLETED':
      return 'bg-gray-400'
    case 'CANCELLED':
      return 'bg-red-400'
    default:
      return 'bg-gray-300'
  }
}

function getStatusDot(status: string): string {
  if (status === 'ACTIVE') return 'bg-emerald-500'
  return 'bg-gray-300'
}

function getBPStatusBadge(status: string | undefined) {
  switch (status) {
    case 'QUESTIONNAIRE':
      return { label: 'Questionnaire', className: 'bg-gray-100 text-gray-600 border-gray-200' }
    case 'DRAFT':
      return { label: 'Brouillon', className: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'GENERATING':
      return { label: 'Génération', className: 'bg-violet-50 text-violet-700 border-violet-200' }
    case 'COMPLETED':
      return { label: 'Complété', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'ARCHIVED':
      return { label: 'Archivé', className: 'bg-gray-100 text-gray-500 border-gray-200' }
    default:
      return null
  }
}

function getGoNoGoBadge(decision: string | undefined) {
  switch (decision) {
    case 'GO':
      return { label: 'GO', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' }
    case 'NO_GO':
      return { label: 'NO-GO', className: 'bg-red-100 text-red-700 border-red-300' }
    default:
      return null
  }
}

function getRiasecColor(profile: string | undefined): string {
  if (!profile) return 'bg-gray-100 text-gray-500'
  const colors: Record<string, string> = {
    R: 'bg-red-100 text-red-700 border-red-200',
    I: 'bg-amber-100 text-amber-700 border-amber-200',
    A: 'bg-pink-100 text-pink-700 border-pink-200',
    S: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    E: 'bg-violet-100 text-violet-700 border-violet-200',
    C: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  }
  return colors[profile[0]] || 'bg-gray-100 text-gray-500'
}

function getRiasecLabel(profile: string | undefined): string {
  if (!profile) return ''
  const labels: Record<string, string> = {
    R: 'Réaliste',
    I: 'Investigateur',
    A: 'Artiste',
    S: 'Social',
    E: 'Entreprenant',
    C: 'Conventionnel',
  }
  return labels[profile[0]] || profile
}

function relativeTime(dateStr: string | undefined): string {
  if (!dateStr) return 'Jamais'
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)

  if (mins < 1) return "A l'instant"
  if (mins < 60) return `il y a ${mins}min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 7) return `il y a ${days}j`
  if (weeks < 4) return `il y a ${weeks}sem`
  return `il y a ${Math.floor(days / 30)}m`
}

// ── Mini Kiviat Radar SVG ────────────────────────────────────────────
function MiniKiviatRadar({
  dimensions,
}: {
  dimensions: { dimension: string; value: number; maxValue: number }[]
}) {
  const size = 120
  const center = size / 2
  const maxRadius = 45
  const defaultDims = dimensions.length > 0
    ? dimensions
    : [
        { dimension: 'Motivation', value: 0, maxValue: 100 },
        { dimension: 'Compétences', value: 0, maxValue: 100 },
        { dimension: 'Marché', value: 0, maxValue: 100 },
        { dimension: 'Finances', value: 0, maxValue: 100 },
        { dimension: 'Projet', value: 0, maxValue: 100 },
      ]

  const angleStep = (2 * Math.PI) / defaultDims.length
  const points = defaultDims.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2
    const r = d.maxValue > 0 ? (d.value / d.maxValue) * maxRadius : 0
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })

  const gridLevels = [0.33, 0.66, 1.0]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid lines */}
      {gridLevels.map((level, li) => {
        const gridPoints = defaultDims.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          const r = maxRadius * level
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
        }).join(' ')
        return (
          <polygon
            key={li}
            points={gridPoints}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        )
      })}
      {/* Axes */}
      {defaultDims.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        )
      })}
      {/* Data polygon */}
      {points.length > 0 && (
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="rgba(16, 185, 129, 0.15)"
          stroke="#10b981"
          strokeWidth="1.5"
        />
      )}
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10b981" />
      ))}
      {/* Dimension labels */}
      {defaultDims.map((d, i) => {
        const angle = angleStep * i - Math.PI / 2
        const labelR = maxRadius + 12
        const x = center + labelR * Math.cos(angle)
        const y = center + labelR * Math.sin(angle)
        const anchor =
          Math.abs(Math.cos(angle)) < 0.1
            ? 'middle'
            : Math.cos(angle) > 0
              ? 'start'
              : 'end'
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="central"
            className="fill-gray-400"
            fontSize="7"
          >
            {d.dimension.slice(0, 5)}
          </text>
        )
      })}
    </svg>
  )
}

// ── Main Component ───────────────────────────────────────────────────
export default function CounselorPortfolio() {
  const userId = useAppStore((s) => s.userId)
  const setCounselorTab = useAppStore((s) => s.setCounselorTab)

  const [porteurs, setPorteurs] = useState<PorteurData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedPorteurId, setSelectedPorteurId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch portfolio on mount ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    async function fetchPortfolio() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/counselor/portfolio?counselorId=${userId}`)
        if (!res.ok) {
          throw new Error('Erreur lors du chargement du portefeuille')
        }
        const data = await res.json()
        setPorteurs(data.porteurs || [])
      } catch (err) {
        console.error('Portfolio fetch error:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPortfolio()
  }, [userId])

  // ── Filtered & searched porteurs ──────────────────────────────────
  const filteredPorteurs = useMemo(() => {
    let result = [...porteurs]

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((p) => p.assignmentStatus === 'ACTIVE')
    } else if (statusFilter === 'completed') {
      result = result.filter((p) => p.assignmentStatus === 'COMPLETED')
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.bpProjectName && p.bpProjectName.toLowerCase().includes(q)) ||
          (p.bpSector && p.bpSector.toLowerCase().includes(q))
      )
    }

    return result
  }, [porteurs, searchTerm, statusFilter])

  // ── KPI calculations ──────────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = porteurs.length
    const actifs = porteurs.filter((p) => p.assignmentStatus === 'ACTIVE').length
    const completes = porteurs.filter((p) => p.assignmentStatus === 'COMPLETED').length
    const avgScore =
      porteurs.length > 0
        ? porteurs
            .filter((p) => p.goNoGoScore != null && p.goNoGoScore > 0)
            .reduce((sum, p) => sum + (p.goNoGoScore || 0), 0) /
          Math.max(
            porteurs.filter((p) => p.goNoGoScore != null && p.goNoGoScore > 0).length,
            1
          )
        : 0

    return { total, actifs, completes, avgScore: Math.round(avgScore) }
  }, [porteurs])

  // ── Actions ───────────────────────────────────────────────────────
  const handleVoirFiche = useCallback(
    (porteurId: string) => {
      setSelectedPorteurId(porteurId)
      setCounselorTab('fiche-porteur')
    },
    [setCounselorTab]
  )

  const handleMessage = useCallback(
    (porteurId: string) => {
      setSelectedPorteurId(porteurId)
      setCounselorTab('messagerie')
    },
    [setCounselorTab]
  )

  const handleEntretien = useCallback(
    (porteurId: string) => {
      setSelectedPorteurId(porteurId)
      setCounselorTab('entretien')
    },
    [setCounselorTab]
  )

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  // ── Loading state ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement du portefeuille...</p>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-full mt-2">
          Réessayer
        </Button>
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (porteurs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Aucun porteur assigné
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Vous n&apos;avez pas encore de porteurs assignés à votre portefeuille.
          Les nouveaux porteurs vous seront automatiquement attribués par
          l&apos;administrateur.
        </p>
      </motion.div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* ── Header Section ────────────────────────────────────────── */}
      <motion.div variants={fadeIn}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Mon Portefeuille
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold text-xs">
                  {kpis.total}
                </Badge>
              </h2>
              <p className="text-xs text-gray-500">
                {kpis.actifs} actif{kpis.actifs !== 1 ? 's' : ''} ·{' '}
                {kpis.complets} terminé{kpis.complets !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email..."
              className="pl-10 h-9 rounded-xl border-gray-200 text-sm"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5">
          {([
            { key: 'all', label: 'Tous', count: kpis.total },
            { key: 'active', label: 'Actifs', count: kpis.actifs },
            { key: 'completed', label: 'Terminés', count: kpis.complets },
          ] as { key: StatusFilter; label: string; count: number }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${
                  statusFilter === tab.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  statusFilter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total porteurs',
            value: kpis.total,
            icon: Users,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
          },
          {
            label: 'En cours',
            value: kpis.actifs,
            icon: Clock,
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
          },
          {
            label: 'Complétés',
            value: kpis.complets,
            icon: CheckCircle2,
            color: 'from-cyan-500 to-blue-500',
            bg: 'bg-cyan-50',
          },
          {
            label: 'Score moyen Go/No-Go',
            value: kpis.avgScore,
            icon: Star,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-50',
            suffix: '/100',
          },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={fadeIn}>
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}
                  >
                    <kpi.icon
                      className={`w-5 h-5 bg-gradient-to-r ${kpi.color} bg-clip-text`}
                      style={{
                        color:
                          kpi.label === 'Total porteurs'
                            ? '#10b981'
                            : kpi.label === 'En cours'
                              ? '#f59e0b'
                              : kpi.label === 'Complétés'
                                ? '#06b6d4'
                                : '#8b5cf6',
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{kpi.label}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {kpi.value}
                      {kpi.suffix && (
                        <span className="text-xs font-normal text-gray-400 ml-0.5">
                          {kpi.suffix}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filtered count ────────────────────────────────────────── */}
      {searchTerm.trim() && (
        <motion.p variants={fadeIn} className="text-xs text-gray-400 px-1">
          {filteredPorteurs.length} résultat{filteredPorteurs.length !== 1 ? 's' : ''}{' '}
          pour &laquo;{searchTerm}&raquo;
        </motion.p>
      )}

      {/* ── Porteur Card Grid ─────────────────────────────────────── */}
      {filteredPorteurs.length === 0 ? (
        <motion.div
          variants={fadeIn}
          className="flex flex-col items-center py-16 gap-3"
        >
          <Search className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-500">Aucun porteur trouvé</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
            }}
            className="text-emerald-600 text-xs rounded-full"
          >
            Réinitialiser les filtres
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredPorteurs.map((porteur) => {
            const isExpanded = expandedId === porteur.id
            const bpBadge = getBPStatusBadge(porteur.bpStatus)
            const gngBadge = getGoNoGoBadge(porteur.goNoGoDecision)
            const moduleProgress =
              porteur.modulesTotal > 0
                ? Math.round((porteur.modulesCompleted / porteur.modulesTotal) * 100)
                : 0

            return (
              <motion.div key={porteur.id} variants={cardVariants} layout>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Main card row */}
                    <div className="p-4">
                      <div className="flex gap-3">
                        {/* Left: Avatar */}
                        <div className="shrink-0 relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                            {porteur.avatarUrl ? (
                              <img
                                src={porteur.avatarUrl}
                                alt={porteur.name}
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              getInitials(porteur.name)
                            )}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusDot(porteur.assignmentStatus)}`}
                          />
                        </div>

                        {/* Center: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">
                                {porteur.name}
                              </h3>
                              <p className="text-xs text-gray-400 truncate">
                                {porteur.email}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleExpand(porteur.id)}
                              className="shrink-0 w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                              aria-label={
                                isExpanded ? 'Réduire' : 'Développer'
                              }
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                              )}
                            </button>
                          </div>

                          {/* Badges row */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {porteur.bpSector && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0 h-5 font-medium border-gray-200 text-gray-600"
                              >
                                {porteur.bpSector}
                              </Badge>
                            )}
                            {bpBadge && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-2 py-0 h-5 font-medium ${bpBadge.className}`}
                              >
                                {bpBadge.label}
                              </Badge>
                            )}
                            {gngBadge && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-2 py-0 h-5 font-medium ${gngBadge.className}`}
                              >
                                <Award className="w-2.5 h-2.5 mr-0.5" />
                                {gngBadge.label}
                                {porteur.goNoGoScore != null && (
                                  <span className="ml-0.5 opacity-70">
                                    {porteur.goNoGoScore}
                                  </span>
                                )}
                              </Badge>
                            )}
                            {porteur.riasecDominant && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-2 py-0 h-5 font-medium ${getRiasecColor(porteur.riasecDominant)}`}
                              >
                                {getRiasecLabel(porteur.riasecDominant)}
                              </Badge>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2.5 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-400">
                                Progression modules
                              </span>
                              <span className="font-medium text-gray-600">
                                {moduleProgress}%
                              </span>
                            </div>
                            <Progress
                              value={moduleProgress}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Meta & actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {relativeTime(porteur.lastActivity)}
                          </span>
                          {porteur.interviewCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 px-1.5 bg-gray-100 text-gray-500"
                            >
                              {porteur.interviewCount} entretien
                              {porteur.interviewCount !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoirFiche(porteur.id)}
                            className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span className="hidden sm:inline">Fiche</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMessage(porteur.id)}
                            className="h-7 px-2 text-[11px] text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="hidden sm:inline">Message</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEntretien(porteur.id)}
                            className="h-7 px-2 text-[11px] text-violet-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg gap-1"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            <span className="hidden sm:inline">Entretien</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* ── Expanded Quick Details ────────────────────── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 bg-gray-50/70 border-t border-gray-100 space-y-3">
                            {/* Kiviat + top pepites + score */}
                            <div className="flex items-start gap-4">
                              <MiniKiviatRadar
                                dimensions={
                                  porteur.kiviatDimensions || []
                                }
                              />
                              <div className="flex-1 space-y-2">
                                {/* Top 3 Pepites */}
                                {porteur.topPepites &&
                                  porteur.topPepites.length > 0 && (
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-medium mb-1">
                                        Top pépites
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {porteur.topPepites.map(
                                          (pepite, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="text-[10px] px-2 py-0 h-5 bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                                            >
                                              💎 {pepite}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Go/No-Go score */}
                                {porteur.goNoGoScore != null &&
                                  porteur.goNoGoScore > 0 && (
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="text-xs text-gray-600">
                                        Score Go/No-Go :{' '}
                                        <span className="font-semibold">
                                          {porteur.goNoGoScore}/100
                                        </span>
                                      </span>
                                    </div>
                                  )}

                                {/* Last counselor note */}
                                {porteur.lastCounselorNote && (
                                  <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                                    <p className="text-[10px] text-gray-400 mb-0.5">
                                      Dernière note{' '}
                                      {porteur.lastCounselorNoteAt &&
                                        `· ${relativeTime(porteur.lastCounselorNoteAt)}`}
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {porteur.lastCounselorNote}
                                    </p>
                                  </div>
                                )}

                                {!porteur.lastCounselorNote &&
                                  (!porteur.topPepites ||
                                    porteur.topPepites.length === 0) && (
                                    <p className="text-xs text-gray-400 italic">
                                      Aucune donnée détaillée disponible
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Quick actions */}
                            <div className="flex items-center gap-2 pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEntretien(porteur.id)
                                }
                                className="flex-1 h-8 text-xs rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              >
                                <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                                Créer entretien
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleMessage(porteur.id)
                                }
                                className="flex-1 h-8 text-xs rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                              >
                                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                Envoyer message
                              </Button>
                              {porteur.bpStatus === 'COMPLETED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleVoirFiche(porteur.id)
                                  }
                                  className="flex-1 h-8 text-xs rounded-lg border-violet-200 text-violet-700 hover:bg-violet-50"
                                >
                                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                                  Voir BP
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
