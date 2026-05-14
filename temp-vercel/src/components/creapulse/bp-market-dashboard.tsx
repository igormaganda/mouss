'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  BarChart3,
  Target,
  Lightbulb,
  Shield,
  Swords,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ChevronRight,
  Globe,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/hooks/use-store'

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
}

// ====================== TYPES ======================
interface MarketSize {
  value: string
  growth: string
  trend: string
}

interface Competitor {
  name: string
  strengths: string[]
  weaknesses: string[]
  marketShare?: string
}

interface Trend {
  description: string
  impact: 'high' | 'medium' | 'low'
  timeframe?: string
}

interface KeyIndicator {
  name: string
  value: string
  source: string
}

interface SwotData {
  strengths?: string[]
  weaknesses?: string[]
  opportunities?: string[]
  threats?: string[]
}

interface MarketData {
  marketSize?: MarketSize
  topCompetitors?: Competitor[]
  keyTrends?: Trend[] | string[]
  opportunities?: string[]
  threats?: string[]
  keyIndicators?: KeyIndicator[]
  sectorTips?: string[]
  swot?: SwotData
  synthesis?: string
}

// ====================== ANIMATED COUNTER ======================
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>(0)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (prevValueRef.current === value) return
    prevValueRef.current = value

    const el = ref.current
    if (!el) return

    // Extract the leading numeric portion for animation
    const match = value.match(/^([0-9.,]+)/)
    const suffix = value.replace(/^[0-9.,]+/, '')
    if (!match) {
      el.textContent = value
      return
    }

    const numericStr = match[1]
    const numericVal = parseFloat(numericStr.replace(/,/g, '.'))
    if (isNaN(numericVal)) {
      el.textContent = value
      return
    }

    const duration = 1200
    const startTime = Date.now()

    function tick() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericVal * eased

      if (numericStr.includes(',')) {
        el.textContent = current.toFixed(1).replace('.', ',') + suffix
      } else {
        el.textContent = Math.round(current).toString() + suffix
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        el.textContent = value
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}

// ====================== LOADING SKELETON ======================
function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Widget 1: Market Size full width */}
      <Skeleton className="h-36 rounded-xl" />
      {/* Widget 2 + 3: 2+1 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      {/* Widget 4 + 5: 1+1 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
      {/* Widget 6: Key indicators */}
      <Skeleton className="h-40 rounded-xl" />
      {/* Widget 7: AI Tips */}
      <Skeleton className="h-28 rounded-xl" />
      {/* Widget 8: SWOT */}
      <Skeleton className="h-56 rounded-xl" />
    </div>
  )
}

// ====================== EMPTY STATE ======================
function EmptyState() {
  const setUserTab = useAppStore((s) => s.setUserTab)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-emerald-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        Aucune donnée de marché disponible
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        Commencez le questionnaire pour obtenir les données de votre marché. Notre IA analysera votre secteur et générera des insights personnalisés.
      </p>
      <Button
        onClick={() => setUserTab('bp-questionnaire')}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-6 h-11"
      >
        Commencer le questionnaire
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  )
}

// ====================== HELPER FUNCTIONS ======================
function getImpactBadge(impact: string) {
  switch (impact) {
    case 'high':
      return { label: 'Fort', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    case 'medium':
      return { label: 'Moyen', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
    default:
      return { label: 'Faible', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
  }
}

function getTimeframeLabel(trend: Trend): string {
  if (trend.timeframe) return trend.timeframe
  if (trend.impact === 'high') return 'Moyen terme'
  if (trend.impact === 'medium') return 'Moyen terme'
  return 'Long terme'
}

function getTrendIcon(impact: string) {
  switch (impact) {
    case 'high':
      return <Zap className="w-4 h-4 text-red-500" />
    case 'medium':
      return <TrendingUp className="w-4 h-4 text-amber-500" />
    default:
      return <Lightbulb className="w-4 h-4 text-emerald-500" />
  }
}

function getTrendDirectionIcon(trend: string) {
  if (trend === 'croissant') return <ArrowUpRight className="w-5 h-5 text-emerald-400" />
  if (trend === 'décroissant') return <ArrowDownRight className="w-5 h-5 text-red-400" />
  return <Minus className="w-5 h-5 text-amber-400" />
}

// ====================== MAIN COMPONENT ======================
export default function BpMarketDashboard() {
  const userId = useAppStore((s) => s.userId)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [detailedAnalysis, setDetailedAnalysis] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Merge both data sources (detailed analysis takes precedence)
  const data: MarketData = {
    ...marketData,
    ...(detailedAnalysis || {}),
  }

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch BusinessPlan for marketData
      const [bpRes, marketRes] = await Promise.allSettled([
        fetch(`/api/bp-questionnaire?userId=${userId}`),
        fetch(`/api/bp-market-auto?userId=${userId}`),
      ])

      if (bpRes.status === 'fulfilled' && bpRes.value.ok) {
        const bpJson = await bpRes.value.json()
        const plan = bpJson.plan
        if (plan?.marketData && Object.keys(plan.marketData).length > 0) {
          setMarketData(plan.marketData as MarketData)
        }
      }

      // bp-market-auto might be POST-only; try GET gracefully
      if (marketRes.status === 'fulfilled' && marketRes.value.ok) {
        try {
          const marketJson = await marketRes.value.json()
          if (marketJson.marketData) {
            setDetailedAnalysis(marketJson.marketData as MarketData)
          }
        } catch {
          // GET may not be implemented — ignore
        }
      }
    } catch {
      setError('Erreur lors du chargement des données de marché.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Derive data with defaults
  const marketSize = data.marketSize || { value: 'N/A', growth: 'N/A', trend: 'stable' }
  const competitors = data.topCompetitors || []
  const rawTrends = data.keyTrends || []
  const trends: Trend[] = rawTrends.map((t) =>
    typeof t === 'string'
      ? { description: t, impact: 'medium' as const }
      : t
  )
  const opportunities = data.opportunities || []
  const threats = data.threats || []
  const keyIndicators = data.keyIndicators || []
  const sectorTips = data.sectorTips || []
  const swot = data.swot || {}

  const hasData =
    marketSize.value !== 'N/A' ||
    competitors.length > 0 ||
    trends.length > 0 ||
    opportunities.length > 0

  // ====================== RENDER ======================
  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!hasData && !error) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400 flex-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  className="shrink-0 rounded-lg border-red-200 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
        {/* ==================== WIDGET 1: Taille du Marché ==================== */}
        <motion.div variants={fadeIn}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/70 mb-0.5">
                      Taille du Marché
                    </p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={marketSize.value} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2">
                    {getTrendDirectionIcon(marketSize.trend)}
                    <span className="text-sm font-semibold">{marketSize.growth}</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 text-xs capitalize">
                    {marketSize.trend}
                  </Badge>
                </div>
              </div>
              {data.synthesis && (
                <p className="text-sm text-white/80 mt-3 leading-relaxed">{data.synthesis}</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* ==================== WIDGET 2 + 3: Concurrents + Tendances ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Widget 2: Top 5 Concurrents */}
          {competitors.length > 0 && (
            <motion.div variants={fadeIn} className="lg:col-span-2">
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-base">Top {Math.min(competitors.length, 5)} Concurrents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <TableHead className="text-xs font-semibold">Concurrent</TableHead>
                          <TableHead className="text-xs font-semibold">Forces</TableHead>
                          <TableHead className="text-xs font-semibold hidden md:table-cell">Faiblesses</TableHead>
                          <TableHead className="text-xs font-semibold w-28">Position</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {competitors.slice(0, 5).map((comp, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                                  {i + 1}
                                </span>
                                {comp.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(comp.strengths || []).slice(0, 2).map((s, si) => (
                                  <Badge
                                    key={si}
                                    variant="secondary"
                                    className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0"
                                  >
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {(comp.weaknesses || []).slice(0, 2).map((w, wi) => (
                                  <Badge
                                    key={wi}
                                    variant="secondary"
                                    className="text-[10px] bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-0"
                                  >
                                    {w}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - i * 18}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                  />
                                </div>
                                {comp.marketShare && (
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {comp.marketShare}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Widget 3: Tendances Clés */}
          {trends.length > 0 && (
            <motion.div variants={fadeIn}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <CardTitle className="text-base">Tendances Clés</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {trends.slice(0, 5).map((trend, i) => {
                      const impactBadge = getImpactBadge(trend.impact)
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                        >
                          <div className="mt-0.5 shrink-0">
                            {getTrendIcon(trend.impact)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 leading-snug">
                              {trend.description}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge className={`text-[9px] px-1.5 py-0 ${impactBadge.className} border-0`}>
                                {impactBadge.label}
                              </Badge>
                              <span className="text-[9px] text-gray-400">
                                {getTimeframeLabel(trend)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* ==================== WIDGET 4 + 5: Opportunités + Menaces ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Widget 4: Opportunités */}
          {opportunities.length > 0 && (
            <motion.div variants={fadeIn}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    <CardTitle className="text-base">Opportunités</CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                      {opportunities.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {opportunities.map((opp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{opp}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Widget 5: Menaces */}
          {threats.length > 0 && (
            <motion.div variants={fadeIn}>
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-base">Menaces</CardTitle>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-[10px]">
                      {threats.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {threats.map((threat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{threat}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* ==================== WIDGET 6: Indicateurs Clés ==================== */}
        {keyIndicators.length > 0 && (
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-500" />
                  <CardTitle className="text-base">Indicateurs Clés</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <TableHead className="text-xs font-semibold">Indicateur</TableHead>
                        <TableHead className="text-xs font-semibold">Valeur</TableHead>
                        <TableHead className="text-xs font-semibold">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keyIndicators.map((indicator, i) => (
                        <TableRow
                          key={i}
                          className={i % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50/50 dark:bg-gray-900/30'}
                        >
                          <TableCell className="text-sm font-medium">{indicator.name}</TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {indicator.value}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-gray-400">{indicator.source}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ==================== WIDGET 7: Conseil IA ==================== */}
        {sectorTips.length > 0 && (
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Conseil IA</h3>
                </div>
                <ul className="space-y-2">
                  {sectorTips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2.5 text-sm text-white/90"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-300 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ==================== WIDGET 8: SWOT Simplifié ==================== */}
        {swot && (
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-500" />
                  <CardTitle className="text-base">SWOT Simplifié</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Forces */}
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Forces</span>
                    </div>
                    <ul className="space-y-1.5">
                      {(swot.strengths || []).map((item, i) => (
                        <li key={i} className="text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {(!swot.strengths || swot.strengths.length === 0) && (
                        <li className="text-xs text-gray-400 italic">Aucune force identifiée</li>
                      )}
                    </ul>
                  </div>

                  {/* Faiblesses */}
                  <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Faiblesses</span>
                    </div>
                    <ul className="space-y-1.5">
                      {(swot.weaknesses || []).map((item, i) => (
                        <li key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {(!swot.weaknesses || swot.weaknesses.length === 0) && (
                        <li className="text-xs text-gray-400 italic">Aucune faiblesse identifiée</li>
                      )}
                    </ul>
                  </div>

                  {/* Opportunités */}
                  <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/20">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Opportunités</span>
                    </div>
                    <ul className="space-y-1.5">
                      {(swot.opportunities || []).map((item, i) => (
                        <li key={i} className="text-xs text-teal-600 dark:text-teal-400 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {(!swot.opportunities || swot.opportunities.length === 0) && (
                        <li className="text-xs text-gray-400 italic">Aucune opportunité identifiée</li>
                      )}
                    </ul>
                  </div>

                  {/* Menaces */}
                  <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm font-semibold text-red-700 dark:text-red-400">Menaces</span>
                    </div>
                    <ul className="space-y-1.5">
                      {(swot.threats || []).map((item, i) => (
                        <li key={i} className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {(!swot.threats || swot.threats.length === 0) && (
                        <li className="text-xs text-gray-400 italic">Aucune menace identifiée</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
