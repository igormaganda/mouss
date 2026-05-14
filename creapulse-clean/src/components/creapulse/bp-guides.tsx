'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Lightbulb,
  Shield,
  Banknote,
  AlertTriangle,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/hooks/use-store'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────
type GuideStatus = 'ready' | 'generating' | 'generated'

interface GuideCategory {
  id: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  titleTemplate: string
  description: string
  status: GuideStatus
  content: string | null
}

// ── Placeholder guide content ────────────────────────────────────────
function getPlaceholderContent(title: string, sector: string): string {
  return `# ${title}

## Introduction

Ce guide a été généré spécifiquement pour le secteur **${sector}** afin de vous fournir des recommandations personnalisées et actionnables.

## Points Clés

### 1. Comprendre le marché
Le secteur ${sector} connaît une transformation significative. Les entrepreneurs qui réussissent sont ceux qui anticipent les tendances et s'adaptent rapidement aux évolutions du marché.

### 2. Stratégies recommandées
- **Différenciation** : Positionnez-vous sur une niche spécifique du marché
- **Digitalisation** : Investissez dans les outils numériques dès le départ
- **Réseau** : Construisez des partenariats stratégiques avec les acteurs clés
- **Qualité** : Priorisez la qualité sur la quantité dans vos premiers mois

### 3. Erreurs à éviter
- Sous-estimer le besoin en trésorerie
- Négliger l'étude de marché préalable
- Se lancer seul sans réseau de conseil
- Ignorer les obligations réglementaires

## Conclusion

Ces recommandations sont un point de départ. Nous vous conseillons de les adapter à votre situation spécifique et de consulter un conseiller pour affiner votre stratégie.

---
*Guide généré par CréaPulse IA — ${new Date().toLocaleDateString('fr-FR')}*`
}

// ── Component ────────────────────────────────────────────────────────
export default function BpGuides() {
  const userId = useAppStore((s) => s.userId)
  const [sector, setSector] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [guides, setGuides] = useState<GuideCategory[]>([])

  // ── Guide definitions ──────────────────────────────────────────────
  const buildGuideCategories = useCallback(
    (sec: string): GuideCategory[] => [
      {
        id: 'marketing',
        icon: <Lightbulb className="w-5 h-5" />,
        gradientFrom: 'from-amber-400',
        gradientTo: 'to-orange-500',
        titleTemplate: `100 Idées Marketing pour ${sec}`,
        description: `Stratégies créatives et canaux d'acquisition adaptés au secteur ${sec} pour attirer vos premiers clients.`,
        status: 'ready',
        content: null,
      },
      {
        id: 'licences',
        icon: <Shield className="w-5 h-5" />,
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-indigo-500',
        titleTemplate: `Licences & Autorisations pour ${sec}`,
        description: `Guide complet des démarches administratives, licences et autorisations requises pour exercer dans le ${sec}.`,
        status: 'ready',
        content: null,
      },
      {
        id: 'bpifrance',
        icon: <Banknote className="w-5 h-5" />,
        gradientFrom: 'from-emerald-400',
        gradientTo: 'to-teal-500',
        titleTemplate: 'Comment obtenir un prêt Bpifrance',
        description: 'Étape par étape pour décrocher un prêt d\'amorçage ou un prêt de création d\'entreprise auprès de Bpifrance.',
        status: 'ready',
        content: null,
      },
      {
        id: 'erreurs',
        icon: <AlertTriangle className="w-5 h-5" />,
        gradientFrom: 'from-red-400',
        gradientTo: 'to-rose-500',
        titleTemplate: `Les erreurs courantes dans le ${sec}`,
        description: `Les pièges les plus fréquents des entrepreneurs du ${sec} et comment les éviter dès le lancement.`,
        status: 'ready',
        content: null,
      },
      {
        id: 'pricing',
        icon: <Calculator className="w-5 h-5" />,
        gradientFrom: 'from-violet-400',
        gradientTo: 'to-purple-500',
        titleTemplate: `Guide de pricing pour le ${sec}`,
        description: `Méthodologies de tarification, benchmark concurrentiel et stratégies de prix pour maximiser votre rentabilité.`,
        status: 'ready',
        content: null,
      },
      {
        id: 'lancement',
        icon: <Calendar className="w-5 h-5" />,
        gradientFrom: 'from-cyan-400',
        gradientTo: 'to-sky-500',
        titleTemplate: 'Plan de lancement en 90 jours',
        description: 'Roadmap détaillée semaine par semaine pour préparer et exécuter le lancement de votre activité.',
        status: 'ready',
        content: null,
      },
    ],
    []
  )

  // ── Fetch sector ───────────────────────────────────────────────────
  useEffect(() => {
    async function loadSector() {
      if (!userId) { setIsLoading(false); return }
      try {
        const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const planSector = data.plan?.sector || ''
          setSector(planSector)
          setGuides(buildGuideCategories(planSector))
        }
      } catch (err) {
        console.error('Load sector error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSector()
  }, [userId, buildGuideCategories])

  // ── Generate guide (simulated) ─────────────────────────────────────
  const handleGenerate = useCallback(
    (guideId: string) => {
      const guide = guides.find((g) => g.id === guideId)
      if (!guide || guide.status === 'generating') return

      // Set to generating
      setGuides((prev) =>
        prev.map((g) => (g.id === guideId ? { ...g, status: 'generating' as GuideStatus } : g))
      )

      // Simulate generation delay (1.5 - 3 seconds)
      const delay = 1500 + Math.random() * 1500

      setTimeout(() => {
        const content = getPlaceholderContent(guide.titleTemplate, sector)
        setGuides((prev) =>
          prev.map((g) =>
            g.id === guideId
              ? { ...g, status: 'generated' as GuideStatus, content }
              : g
          )
        )
        toast.success(`Guide "${guide.titleTemplate}" généré avec succès !`)
      }, delay)
    },
    [guides, sector]
  )

  // ── Toggle expand ──────────────────────────────────────────────────
  const toggleExpand = useCallback((guideId: string) => {
    setExpandedGuide((prev) => (prev === guideId ? null : guideId))
  }, [])

  // ── Status badge ───────────────────────────────────────────────────
  function StatusBadge({ status }: { status: GuideStatus }) {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
            <Clock className="w-3 h-3" />
            Prêt à générer
          </span>
        )
      case 'generating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            En cours...
          </span>
        )
      case 'generated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Généré
          </span>
        )
    }
  }

  // ── Simple markdown renderer ───────────────────────────────────────
  function SimpleMarkdown({ text }: { text: string }) {
    const lines = text.split('\n')
    return (
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        {lines.map((line, i) => {
          // Headings
          if (line.startsWith('### '))
            return (
              <h4 key={i} className="font-semibold text-gray-900 mt-3 text-sm">
                {line.replace('### ', '')}
              </h4>
            )
          if (line.startsWith('## '))
            return (
              <h3 key={i} className="font-bold text-gray-900 mt-4 text-base">
                {line.replace('## ', '')}
              </h3>
            )
          if (line.startsWith('# '))
            return (
              <h2 key={i} className="font-bold text-lg text-gray-900 mb-2">
                {line.replace('# ', '')}
              </h2>
            )

          // Horizontal rule
          if (line.startsWith('---'))
            return <hr key={i} className="border-gray-200 my-3" />

          // List items
          if (line.startsWith('- '))
            return (
              <li key={i} className="ml-4 list-disc text-gray-600">
                <MarkdownInline>{line.replace('- ', '')}</MarkdownInline>
              </li>
            )

          // Numbered items
          const numberedMatch = line.match(/^(\d+)\.\s/)
          if (numberedMatch)
            return (
              <li key={i} className="ml-4 list-decimal text-gray-600">
                <MarkdownInline>{line.replace(/^\d+\.\s/, '')}</MarkdownInline>
              </li>
            )

          // Empty line
          if (line.trim() === '') return <div key={i} className="h-2" />

          // Italic (conclusion line)
          if (line.startsWith('*') && line.endsWith('*'))
            return (
              <p key={i} className="text-xs text-gray-400 italic mt-2">
                {line.replace(/^\*|\*$/g, '')}
              </p>
            )

          // Regular paragraph
          return (
            <p key={i} className="text-gray-600">
              <MarkdownInline>{line}</MarkdownInline>
            </p>
          )
        })}
      </div>
    )
  }

  // ── Inline markdown (bold, italic) ─────────────────────────────────
  function MarkdownInline({ children }: { children: string }) {
    const parts = children.split(/(\*\*.*?\*\*|\*.*?\*)/g)
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return (
              <strong key={i} className="font-semibold text-gray-800">
                {part.slice(2, -2)}
              </strong>
            )
          if (part.startsWith('*') && part.endsWith('*'))
            return <em key={i}>{part.slice(1, -1)}</em>
          return <span key={i}>{part}</span>
        })}
      </>
    )
  }

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement des guides...</p>
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (!sector) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Guides IA</h3>
          <p className="text-gray-500 text-sm mb-6">
            Les guides personnalisés sont générés en fonction de votre secteur d&apos;activité.
            Complétez d&apos;abord votre Business Plan pour y accéder.
          </p>
          <Button
            onClick={() => useAppStore.getState().setUserTab('bp-questionnaire')}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Définir mon secteur d&apos;activité
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Guides IA</h2>
            <p className="text-xs text-gray-500">
              Guides personnalisés pour le secteur{' '}
              <span className="text-emerald-600 font-medium">{sector}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Guide cards grid ─────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {guides.map((guide, idx) => {
            const isExpanded = expandedGuide === guide.id
            const isGenerating = guide.status === 'generating'

            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                  isExpanded ? 'md:col-span-2' : ''
                }`}
              >
                {/* Card header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.gradientFrom} ${guide.gradientTo} flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <span className="text-white">{guide.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={guide.status} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">
                        {guide.titleTemplate}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {guide.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    {guide.status !== 'generated' && (
                      <Button
                        size="sm"
                        onClick={() => handleGenerate(guide.id)}
                        disabled={isGenerating}
                        className={`rounded-lg text-xs ${
                          isGenerating
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 mr-1.5" />
                            Générer
                          </>
                        )}
                      </Button>
                    )}

                    {guide.status === 'generated' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpand(guide.id)}
                          className="rounded-lg text-xs"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5 mr-1" />
                              Réduire
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5 mr-1" />
                              Lire le guide
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerate(guide.id)}
                          className="rounded-lg text-xs text-gray-400 hover:text-emerald-600"
                        >
                          Régénérer
                        </Button>
                      </>
                    )}

                    {guide.status === 'ready' && !isGenerating && (
                      <span className="text-[10px] text-gray-400 ml-auto">
                        <FileText className="w-3 h-3 inline mr-1" />
                        ~2 min de lecture
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && guide.content && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 max-h-96 overflow-y-auto">
                        <SimpleMarkdown text={guide.content} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generating progress overlay */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5 pb-4"
                    >
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="relative">
                          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                          <Sparkles className="w-3 h-3 text-amber-400 absolute -top-0.5 -right-0.5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-700">
                            L&apos;IA rédige votre guide...
                          </p>
                          <p className="text-[10px] text-amber-600/80">
                            Cela prend généralement 10 à 30 secondes
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ── Footer info ──────────────────────────────────────────────── */}
      <div className="w-full text-center py-2">
        <p className="text-[10px] text-gray-400">
          <Sparkles className="w-3 h-3 inline mr-1 text-emerald-400" />
          Les guides sont générés par IA et personnalisés pour votre secteur. Ils constituent un point de départ à compléter avec un conseiller professionnel.
        </p>
      </div>
    </div>
  )
}
