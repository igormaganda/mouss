'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Handshake,
  Cog,
  Package,
  Heart,
  Sparkles,
  Users,
  Radio,
  TrendingDown,
  TrendingUp,
  Loader2,
  Save,
  X,
  Pencil,
  RotateCcw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

interface CanvasBlock {
  id: string
  key: string
  title: string
  icon: LucideIcon
  tooltip: string
  borderColor: string
  borderBg: string
  colSpan: string
}

interface BpAnswers {
  sector?: string
  projectName?: string
  region?: string
  offerType?: string
  positioning?: string
  clientType?: string
  revenueModel?: string
  legalStructure?: string
  budget?: number
  caGoal?: number
  slogan?: string
  canvas?: Record<string, string>
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const CANVAS_BLOCKS: CanvasBlock[] = [
  {
    id: 'partenaires',
    key: 'partenaires_cles',
    title: 'Partenaires clés',
    icon: Handshake,
    tooltip: 'Qui sont vos fournisseurs, partenaires stratégiques et alliances clés ?',
    borderColor: 'border-l-emerald-500',
    borderBg: 'bg-emerald-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'activites',
    key: 'activites_cles',
    title: 'Activités clés',
    icon: Cog,
    tooltip: 'Quelles sont les actions essentielles pour que votre modèle fonctionne ?',
    borderColor: 'border-l-teal-500',
    borderBg: 'bg-teal-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'ressources',
    key: 'ressources_cles',
    title: 'Ressources clés',
    icon: Package,
    tooltip: 'Quelles ressources sont indispensables : humaines, matérielles, financières, intellectuelles ?',
    borderColor: 'border-l-cyan-500',
    borderBg: 'bg-cyan-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'relations',
    key: 'relations_clients',
    title: 'Relations clients',
    icon: Heart,
    tooltip: 'Quel type de relation entretenez-vous avec vos clients ?',
    borderColor: 'border-l-emerald-600',
    borderBg: 'bg-emerald-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'proposition',
    key: 'proposition_valeur',
    title: 'Proposition de valeur',
    icon: Sparkles,
    tooltip: 'Quelle est votre promesse unique ? Pourquoi les clients vous choisissent plutôt que la concurrence ?',
    borderColor: 'border-l-teal-600',
    borderBg: 'bg-teal-50',
    colSpan: 'md:col-span-4',
  },
  {
    id: 'segments',
    key: 'segments_clients',
    title: 'Segments clients',
    icon: Users,
    tooltip: 'Qui sont vos différents groupes de clients cibles ?',
    borderColor: 'border-l-cyan-600',
    borderBg: 'bg-cyan-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'canaux',
    key: 'canaux',
    title: 'Canaux',
    icon: Radio,
    tooltip: 'Par quels canaux atteignez-vous vos clients ? Vente directe, en ligne, distribution...',
    borderColor: 'border-l-emerald-500',
    borderBg: 'bg-emerald-50',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'couts',
    key: 'structure_couts',
    title: 'Structure des coûts',
    icon: TrendingDown,
    tooltip: 'Quels sont vos coûts fixes et variables les plus importants ?',
    borderColor: 'border-l-teal-500',
    borderBg: 'bg-teal-50',
    colSpan: 'md:col-span-3',
  },
  {
    id: 'revenus',
    key: 'sources_revenus',
    title: 'Sources de revenus',
    icon: TrendingUp,
    tooltip: 'Comment générez-vous de la richesse ? Ventes, abonnements, commissions...',
    borderColor: 'border-l-cyan-500',
    borderBg: 'bg-cyan-50',
    colSpan: 'md:col-span-3',
  },
]

const GRID_ROWS = [
  // Row 1: 4 blocks
  ['partenaires', 'activites', 'ressources', 'relations'],
  // Row 2: 2 blocks
  ['proposition', 'segments'],
  // Row 3: 3 blocks
  ['canaux', 'couts', 'revenus'],
]

// ═══════════════════════════════════════════════════════════════════════
// PRE-FILL LOGIC
// ═══════════════════════════════════════════════════════════════════════

function generatePreFill(answers: BpAnswers): Record<string, string> {
  const { sector, offerType, budget, positioning, clientType, revenueModel, region } = answers

  const partenairesMap: Record<string, string> = {
    'restauration': 'Fournisseurs de produits frais locaux, grossistes alimentaires, caviste partenaire, livreur de plateforme (UberEats/Deliveroo), expert-comptable spécialisé restauration.',
    'commerce': 'Grossistes et distributeurs, prestataires logistique, solution e-commerce (Shopify/Prestashop), banque pour le fond de rouler, community manager freelance.',
    'b2b': 'Réseau de partenaires B2B, sous-traitants spécialisés, éditeurs de logiciels métier, salons professionnels et événements, cabinet de conseil en stratégie.',
    'tech': 'Hébergeurs cloud (AWS/GCP/Azure), éditeurs d\'API et services tiers, développeurs freelance, experts en cybersécurité, partenaires d\'intégration.',
    'btp': 'Fournisseurs de matériaux, artisans sous-traitants (plomberie, électricité), loueurs de matériel, assurances professionnelles, bureaux d\'études techniques.',
  }

  const partenaires = partenairesMap[getSectorKey(sector || '')]
    || `Fournisseurs du secteur ${sector || ''}, prestataires de services, partenaires financiers, réseau professionnel local, conseiller en création d'entreprise.`

  const activitesMap: Record<string, string> = {
    default: `Conception et développement de ${offerType || 'votre offre'}, gestion de la relation client, marketing et communication digitale, suivi et analyse des performances, veille concurrentielle et innovation.`,
  }

  const ressources = budget && budget > 0
    ? `Capital de départ estimé à ${formatCurrency(budget)}. Compétences clés du dirigeant, locaux ${budget > 20000 ? 'professionnels' : 'à domicile ou coworking'}, outils numériques (CRM, comptabilité en ligne). ${budget > 50000 ? 'Possibilité d\'embauche d\'un premier collaborateur.' : 'Auto-entrepreneur au démarrage, externalisation ponctuelle.'}`
    : 'Compétences du dirigeant, matériel professionnel de base, outils numériques et logiciels métier, réseau professionnel, local adapté à l\'activité.'

  const propValeur = positioning && offerType
    ? `Offre ${positioning.toLowerCase()} de ${offerType.toLowerCase()}, avec un focus sur la qualité et la satisfaction client. Différenciation par un service personnalisé et une expertise pointue du secteur ${sector || ''}. Promesse : ${offerType} qui répond aux besoins spécifiques de votre marché cible.`
    : `Une offre unique de ${offerType || 'votre produit/service'} dans le secteur ${sector || ''}, positionnée de manière compétitive sur votre marché. La promesse est de délivrer un rapport qualité-prix exceptionnel.`

  const segmentsMap: Record<string, string> = {
    'Particuliers (B2C)': 'Jeunes actifs (25-40 ans), sensibles au rapport qualité-prix et à l\'expérience client. Familles avec revenus moyens à élevés. Pros en quête d\'authenticité et de proximité. Clientèle locale (rayon de 10-30km) et en ligne.',
    'Entreprises (B2B)': 'PME et ETI locales (5-50 salariés), dirigeants de 35-55 ans en quête d\'efficacité. Startups en croissance cherchant des partenaires fiables. Grandes comptes pour des missions spécifiques.',
    'Les deux': 'Segment B2C : particuliers sensibles à la qualité et au service. Segment B2B : PME et associations locales. Segment intermédiaire : auto-entrepreneurs et professions libérales.',
  }

  const canaux = `Vente directe${region ? ` en ${region}` : ''}. Présence en ligne via site web et réseaux sociaux (Instagram, LinkedIn). Réseau de bouche-à-oreille et recommandations. ${sector === 'Restauration & Alimentation' || sector?.toLowerCase().includes('restauration') ? 'Plateformes de livraison (UberEats, Deliveroo).' : ''} Partenariats locaux et événements.`

  const relationsMap: Record<string, string> = {
    'Vente directe (une fois)': 'Vente avec accompagnement personnalisé. Suivi post-achat et service client réactif. Programme de fidélité et offres de rappel. Collecte des avis et amélioration continue.',
    'Abonnement / Récurent': 'Relation de long terme avec engagement. Onboarding personnalisé au démarrage. Support dédié et suivi régulier. Communications régulières et contenus exclusifs.',
    default: 'Relation client personnalisée avec un point de contact unique. Support réactif via chat, email et téléphone. Programme de fidélité et parrainage. Enquêtes de satisfaction régulières.',
  }

  const couts = budget && budget > 0
    ? `Coûts fixes estimés : ${formatCurrency(budget * 0.4)} (loyer, assurances, abonnements). Coûts variables : ${formatCurrency(budget * 0.35)} (matières premières, logistique). Charges sociales et fiscales : ~${formatCurrency(budget * 0.15)}. Marge de sécurité : ${formatCurrency(budget * 0.1)}.`
    : 'Coûts à estimer en détail dans votre prévisionnel financier. Prévoir : loyer/charges, salaires, achats de marchandises, marketing, assurances, charges sociales.'

  const revenusMap: Record<string, string> = {
    'Vente directe (une fois)': `Revenus principaux par la vente unitaire de ${offerType || 'votre offre'}. Marge cible de 30-60% selon le positionnement. Upsell et ventes complémentaires.`,
    'Abonnement / Récurent': `Revenus récurrents par abonnement mensuel. Objectif : ${answers.caGoal ? formatCurrency(answers.caGoal / 12) : 'montant mensuel'} par mois en année 1. Taux de rétention cible > 80%.`,
    'Freemium': `Revenus par conversion free → premium (taux cible 3-8%). Monétisation des options avancées. Upsell et services premium personnalisés.`,
    'Commission / Marketplace': `Commission de 5-15% par transaction. Volume cible : 50+ transactions/mois en année 1. Revenus complémentaires : mise en avant, publicité.`,
    'Franchise / Licence': `Revenus par droits de franchise (droit d'entrée 10-30K€). Redevances ongoing (3-8% du CA franchisé). Formation et accompagnement facturés.`,
  }

  return {
    partenaires_cles: partenaires,
    activites_cles: activitesMap.default || activitesMap['default'],
    ressources_cles: ressources,
    proposition_valeur: propValeur,
    segments_clients: segmentsMap[clientType || ''] || segmentsMap['Particuliers (B2C)'],
    canaux: canaux,
    relations_clients: relationsMap[revenueModel || ''] || relationsMap['default'],
    structure_couts: couts,
    sources_revenus: revenusMap[revenueModel || ''] || `Revenus par ${revenueModel || 'vente'} de ${offerType || 'votre offre'}. CA cible année 1 : ${answers.caGoal ? formatCurrency(answers.caGoal) : 'à définir'}.`,
  }
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

function getSectorKey(label: string): string {
  const keyMap: Record<string, string> = {
    'restauration': 'restauration',
    'alimentation': 'restauration',
    'commerce': 'commerce',
    'négoce': 'commerce',
    'b2b': 'b2b',
    'entreprises': 'b2b',
    'tech': 'tech',
    'numérique': 'tech',
    'btp': 'btp',
    'construction': 'btp',
  }
  const lower = label.toLowerCase()
  for (const [keyword, key] of Object.entries(keyMap)) {
    if (lower.includes(keyword)) return key
  }
  return 'default'
}

// ═══════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════

const blockVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function BpCanvas() {
  const userId = useAppStore((s) => s.userId)
  const setUserTab = useAppStore((s) => s.setUserTab)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [planId, setPlanId] = useState<string>('')
  const [answers, setAnswers] = useState<BpAnswers>({})
  const [canvasData, setCanvasData] = useState<Record<string, string>>({})
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ── Load questionnaire data on mount ─────────────────────────────
  useEffect(() => {
    async function load() {
      if (!userId) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const plan = data.plan
          if (plan) {
            setPlanId(plan.id)
            const rawAnswers = (plan.answers as Record<string, any>) || {}
            setAnswers(rawAnswers)

            // If canvas data exists in answers, use it; otherwise pre-fill
            if (rawAnswers.canvas && Object.keys(rawAnswers.canvas).length > 0) {
              setCanvasData(rawAnswers.canvas)
            } else {
              const preFill = generatePreFill(rawAnswers)
              setCanvasData(preFill)
            }
          }
        }
      } catch (err) {
        console.error('Canvas load error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [userId])

  // ── Save canvas data ─────────────────────────────────────────────
  const saveCanvas = useCallback(
    async (newCanvasData: Record<string, string>) => {
      if (!userId || !planId) return
      setIsSaving(true)
      try {
        const res = await fetch('/api/bp-questionnaire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            step: 10,
            answers: { canvas: newCanvasData },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.plan?.id) setPlanId(data.plan.id)
        }
      } catch (err) {
        console.error('Canvas save error:', err)
      } finally {
        setIsSaving(false)
      }
    },
    [userId, planId]
  )

  // ── Debounced save ───────────────────────────────────────────────
  const debouncedSave = useCallback(
    (newCanvasData: Record<string, string>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        saveCanvas(newCanvasData)
      }, 600)
    },
    [saveCanvas]
  )

  // ── Handle save for a block ──────────────────────────────────────
  const handleSave = useCallback(
    (blockKey: string) => {
      if (!editValue.trim()) {
        setEditingBlock(null)
        return
      }
      const updated = { ...canvasData, [blockKey]: editValue.trim() }
      setCanvasData(updated)
      setEditingBlock(null)
      debouncedSave(updated)
    },
    [canvasData, editValue, debouncedSave]
  )

  // ── Handle cancel editing ────────────────────────────────────────
  const handleCancel = useCallback(() => {
    setEditingBlock(null)
    setEditValue('')
  }, [])

  // ── Start editing ────────────────────────────────────────────────
  const handleStartEdit = useCallback(
    (blockKey: string) => {
      setEditingBlock(blockKey)
      setEditValue(canvasData[blockKey] || '')
    },
    [canvasData]
  )

  // ── Regenerate pre-fill ──────────────────────────────────────────
  const handleRegenerate = useCallback(() => {
    const preFill = generatePreFill(answers)
    setCanvasData(preFill)
    debouncedSave(preFill)
  }, [answers, debouncedSave])

  // ── Loading state ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement du Business Model Canvas...</p>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-500">Connectez-vous pour accéder au Business Model Canvas.</p>
        <Button onClick={() => useAppStore.getState().setView('auth')} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
          Se connecter
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Model Canvas</h2>
            <p className="text-sm text-gray-500 mt-1">
              Modélisez votre business en 9 blocs. Cliquez sur un bloc pour le modifier.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600 flex items-center gap-1"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Sauvegarde...
              </motion.span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="rounded-xl text-gray-600 hover:text-emerald-700"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Régénérer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserTab('bp-overview')}
              className="rounded-xl text-gray-600"
            >
              ← Vue d'ensemble
            </Button>
          </div>
        </div>

        {/* ── Canvas Grid ─────────────────────────────────────────── */}
        <div className="space-y-3">
          {GRID_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-2 md:grid-cols-8 gap-3">
              {row.map((blockId) => {
                const block = CANVAS_BLOCKS.find((b) => b.id === blockId)
                if (!block) return null
                const blockIndex = CANVAS_BLOCKS.findIndex((b) => b.id === blockId)
                const Icon = block.icon
                const content = canvasData[block.key] || ''
                const isEditing = editingBlock === block.key

                return (
                  <motion.div
                    key={block.id}
                    custom={blockIndex}
                    variants={blockVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className={`${block.colSpan}`}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative h-full min-h-[140px] bg-white rounded-xl border border-gray-100 border-l-4 ${block.borderColor} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden`}
                          onClick={() => !isEditing && handleStartEdit(block.key)}
                          onMouseEnter={() => setShowTooltip(block.key)}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          {/* Block header */}
                          <div className={`flex items-center gap-2 px-3 py-2.5 ${block.borderBg} border-b border-gray-100`}>
                            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center">
                              <Icon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="text-xs font-semibold text-gray-800 leading-tight">
                              {block.title}
                            </h3>
                          </div>

                          {/* Block content */}
                          <div className="px-3 py-3">
                            <AnimatePresence mode="wait">
                              {isEditing ? (
                                <motion.div
                                  key="edit"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="min-h-[80px] text-xs leading-relaxed rounded-lg border-gray-200 focus:border-emerald-400 resize-none"
                                    autoFocus
                                    placeholder="Décrivez..."
                                  />
                                  <div className="flex items-center gap-1.5">
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSave(block.key)
                                      }}
                                      className="h-7 px-3 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Sauver
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancel()
                                      }}
                                      className="h-7 px-2 text-xs rounded-lg text-gray-500"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="view"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  {content ? (
                                    <p className="text-[11px] leading-relaxed text-gray-600 line-clamp-5">
                                      {content}
                                    </p>
                                  ) : (
                                    <p className="text-[11px] text-gray-400 italic">
                                      Cliquez pour remplir...
                                    </p>
                                  )}
                                  <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="w-3 h-3 text-gray-400" />
                                    <span className="text-[10px] text-gray-400">Modifier</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Edit indicator dot */}
                          {content && !isEditing && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" title="Contenu rempli" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {block.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

        {/* ── Legend / Footer info ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Rempli
            </span>
            <span className="flex items-center gap-1.5">
              <Pencil className="w-3 h-3" />
              Cliquez pour modifier
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Les données sont automatiquement sauvegardées. Basé sur vos réponses au questionnaire.
          </p>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
