'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  FileText,
  Eye,
  RefreshCw,
  Download,
  Share2,
  MessageSquare,
  Loader2,
  Sparkles,
  LayoutDashboard,
  Presentation,
  BarChart3,
  Target,
  Megaphone,
  Settings2,
  DollarSign,
  Landmark,
  ShieldAlert,
  Flag,
  ChevronRight,
  Rocket,
  Calendar,
  Hash,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

interface SectionMeta {
  type: string
  title: string
  icon: LucideIcon
}

interface PlanSection {
  id: string
  sectionType: string
  title: string
  content: Record<string, any>
  status: string
  aiGenerated: boolean
  version: number
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const SECTION_DEFS: SectionMeta[] = [
  { type: 'resume_executif', title: 'Résumé Exécutif', icon: LayoutDashboard },
  { type: 'presentation', title: 'Présentation du Projet', icon: Presentation },
  { type: 'etude_marche', title: 'Étude de Marché', icon: BarChart3 },
  { type: 'strategie', title: 'Stratégie Générale', icon: Target },
  { type: 'strategy_marketing', title: 'Stratégie Marketing', icon: Megaphone },
  { type: 'strategy_operationnelle', title: 'Stratégie Opérationnelle', icon: Settings2 },
  { type: 'previsionnel', title: 'Prévisionnel Financier', icon: DollarSign },
  { type: 'plan_financement', title: 'Plan de Financement', icon: Landmark },
  { type: 'risques', title: 'Analyse des Risques', icon: ShieldAlert },
  { type: 'conclusion', title: 'Conclusion & Feuille de Route', icon: Flag },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }> = {
  COMPLETED: { label: 'Terminé', variant: 'default', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  DRAFT: { label: 'Brouillon', variant: 'outline', className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50' },
  GENERATING: { label: 'Génération...', variant: 'secondary', className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' },
  NEEDS_REVIEW: { label: 'À vérifier', variant: 'destructive', className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50' },
}

const PLAN_STATUS_MAP: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  QUESTIONNAIRE: { label: 'Questionnaire', color: 'bg-blue-100 text-blue-700', icon: FileText },
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: FileText },
  GENERATING: { label: 'Génération en cours', color: 'bg-amber-100 text-amber-700', icon: Loader2 },
  COMPLETED: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700', icon: Sparkles },
  ARCHIVED: { label: 'Archivé', color: 'bg-gray-100 text-gray-500', icon: FileText },
}

// ═══════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

function estimateWordCount(sections: PlanSection[]): number {
  let total = 0
  for (const s of sections) {
    const text = s.content?.text || ''
    total += text.split(/\s+/).filter(Boolean).length
  }
  return total
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function BpOverview() {
  const userId = useAppStore((s) => s.userId)
  const setUserTab = useAppStore((s) => s.setUserTab)

  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [planId, setPlanId] = useState<string>('')
  const [planStatus, setPlanStatus] = useState<string>('')
  const [projectName, setProjectName] = useState('')
  const [sector, setSector] = useState('')
  const [slogan, setSlogan] = useState('')
  const [completedSteps, setCompletedSteps] = useState(0)
  const [totalSteps] = useState(10)
  const [updatedAt, setUpdatedAt] = useState('')
  const [sections, setSections] = useState<PlanSection[]>([])
  const [noPlan, setNoPlan] = useState(false)

  // ── Load plan + sections on mount ────────────────────────────────
  const loadPlan = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      setNoPlan(true)
      return
    }
    try {
      const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        const plan = data.plan
        if (plan) {
          setPlanId(plan.id)
          setPlanStatus(plan.status)
          setProjectName(plan.projectName || 'Mon projet')
          setSector(plan.sector || '')
          setSlogan((plan.slogan as string) || '')
          setCompletedSteps(plan.completedSteps || 0)
          setUpdatedAt(plan.updatedAt || '')
          setNoPlan(false)
        } else {
          setNoPlan(true)
        }
      }
    } catch (err) {
      console.error('Load plan error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const loadSections = useCallback(async () => {
    if (!userId) return
    try {
      // Try fetching sections from any plan
      const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        const plan = data.plan
        if (plan?.sections && Array.isArray(plan.sections)) {
          setSections(plan.sections as PlanSection[])
        }
      }
    } catch (err) {
      console.error('Load sections error:', err)
    }
  }, [userId])

  useEffect(() => {
    loadPlan()
    loadSections()
  }, [loadPlan, loadSections])

  // ── Generate business plan ──────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!userId || !planId || isGenerating) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/bp-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planId }),
      })
      if (res.ok) {
        // Reload data
        await loadPlan()
        await loadSections()
      }
    } catch (err) {
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [userId, planId, isGenerating, loadPlan, loadSections])

  // ── Stats ───────────────────────────────────────────────────────
  const completedSections = sections.filter((s) => s.status === 'COMPLETED').length
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  const wordCount = estimateWordCount(sections)

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement de votre Business Plan...</p>
      </div>
    )
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (noPlan || !userId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200"
        >
          <Rocket className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          Créez votre Business Plan en 10 minutes
        </h2>
        <p className="text-gray-500 max-w-md text-center mb-8 leading-relaxed">
          Répondez à notre questionnaire intelligent et laissez l'IA rédiger
          un business plan professionnel pour votre projet entrepreneurial.
        </p>
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={() => setUserTab('bp-questionnaire')}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-base shadow-lg shadow-emerald-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Commencer
          </Button>
        </div>
        <div className="flex items-center gap-6 mt-8 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            10 sections
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Généré par IA
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Modèle professionnel
          </span>
        </div>
      </motion.div>
    )
  }

  // ── Compute section map for quick lookup ────────────────────────
  const sectionMap = new Map(sections.map((s) => [s.sectionType, s]))

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div variants={heroVariants}>
          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {projectName}
                    </h1>
                    {sector && (
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20 rounded-full text-xs">
                        {sector}
                      </Badge>
                    )}
                  </div>
                  {slogan && (
                    <p className="text-white/80 text-sm italic mb-4">« {slogan} »</p>
                  )}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const cfg = PLAN_STATUS_MAP[planStatus] || PLAN_STATUS_MAP.DRAFT
                      const StatusIcon = cfg.icon
                      return (
                        <Badge className={`${cfg.color} rounded-full text-xs border-0 font-medium`}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${planStatus === 'GENERATING' ? 'animate-spin' : ''}`} />
                          {cfg.label}
                        </Badge>
                      )
                    })()}
                    <span className="text-white/60 text-xs">
                      {completedSteps}/{totalSteps} étapes terminées
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {planStatus === 'QUESTIONNAIRE' && (
                    <Button
                      onClick={() => setUserTab('bp-questionnaire')}
                      variant="secondary"
                      className="rounded-xl bg-white text-emerald-700 hover:bg-white/90 shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      Modifier le questionnaire
                    </Button>
                  )}
                  {(planStatus === 'QUESTIONNAIRE' || planStatus === 'DRAFT') && (
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || completedSteps < totalSteps}
                      className="rounded-xl bg-white text-emerald-700 hover:bg-white/90 shadow-md"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-1.5" />
                          Générer le BP
                        </>
                      )}
                    </Button>
                  )}
                  {planStatus === 'GENERATING' && (
                    <Button disabled className="rounded-xl bg-white/30 text-white cursor-wait">
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Génération en cours...
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Progression globale</span>
                  <span className="font-semibold text-white">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MAIN LAYOUT: Sections + Stats */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Section Grid (3 cols) ──────────────────────────── */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Sections du Business Plan
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {SECTION_DEFS.map((sectionDef, idx) => {
                const Icon = sectionDef.icon
                const section = sectionMap.get(sectionDef.type)
                const status = section?.status || 'DRAFT'
                const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT
                const contentText = section?.content?.text || ''
                const preview = contentText.slice(0, 100).trim() + (contentText.length > 100 ? '...' : '')

                return (
                  <motion.div key={sectionDef.type} variants={itemVariants}>
                    <Card className="h-full hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden group">
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4.5 h-4.5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                {sectionDef.title}
                              </h3>
                            <Badge
                              variant={statusCfg.variant}
                              className={`mt-1 text-[10px] px-2 py-0 h-5 rounded-full border ${statusCfg.className}`}
                            >
                              {status === 'GENERATING' && <Loader2 className="w-2.5 h-2.5 mr-0.5 animate-spin" />}
                              {statusCfg.label}
                            </Badge>
                            {section?.aiGenerated && status === 'COMPLETED' && (
                              <Sparkles className="w-3 h-3 text-amber-400 inline-block ml-1" title="Généré par IA" />
                            )}
                          </div>
                        </div>
                        </div>

                        {/* Preview */}
                        <p className="text-xs text-gray-500 leading-relaxed mb-3 min-h-[40px]">
                          {preview || 'Cette section n\'a pas encore été rédigée.'}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!section || status === 'GENERATING'}
                                className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Voir
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              {section ? 'Afficher le contenu' : 'Pas encore généré'}
                            </TooltipContent>
                          </Tooltip>
                          {section?.aiGenerated && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={status === 'GENERATING' || isGenerating}
                                  className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                                  Régénérer
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">
                                Régénérer cette section avec l'IA
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* ── Stats Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Statistiques
            </h2>
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-100 overflow-hidden">
                <CardContent className="p-5 space-y-5">
                  {/* Progress circle-ish */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="url(#progressGrad)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#14b8a6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">{progressPercent}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {completedSections} / {totalSteps} sections terminées
                    </p>
                  </div>

                  {/* Stat items */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" />
                        Mots estimés
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {wordCount > 0 ? `${wordCount.toLocaleString('fr-FR')}` : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Dernière modif.
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {updatedAt ? formatDate(updatedAt) : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Statut
                      </span>
                      {(() => {
                        const cfg = PLAN_STATUS_MAP[planStatus] || PLAN_STATUS_MAP.DRAFT
                        return (
                          <Badge className={`${cfg.color} rounded-full text-[10px] px-2 py-0 h-5 border-0`}>
                            {cfg.label}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div variants={itemVariants} className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Navigation rapide</h3>
              <div className="space-y-1">
                {[
                  { label: 'Business Model Canvas', tab: 'bp-canvas' as const },
                  { label: 'Analyse de Marché', tab: 'bp-market' as const },
                  { label: 'Prévisionnel Financier', tab: 'bp-financials' as const },
                  { label: 'Pitch Deck', tab: 'bp-pitch' as const },
                ].map((nav) => (
                  <Button
                    key={nav.tab}
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserTab(nav.tab)}
                    className="w-full justify-between text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg px-3 h-9"
                  >
                    {nav.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* QUICK ACTIONS BAR */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-100 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Actions rapides</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Exportez et partagez votre business plan
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completedSections === 0}
                        className="rounded-xl text-xs h-8"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Exporter en PDF
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {completedSections > 0 ? 'Télécharger au format PDF' : 'Générez d\'abord le BP'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completedSections === 0}
                        className="rounded-xl text-xs h-8"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Exporter en DOCX
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {completedSections > 0 ? 'Télécharger au format Word' : 'Générez d\'abord le BP'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completedSections === 0}
                        className="rounded-xl text-xs h-8"
                      >
                        <Share2 className="w-3.5 h-3.5 mr-1.5" />
                        Partager
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Partager avec votre conseiller
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={completedSections === 0}
                        className="rounded-xl text-xs h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Demander un avis
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Envoyer à votre conseiller pour review
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
