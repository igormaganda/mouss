'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Loader2,
  MapPin,
  Package,
  Target,
  Users,
  DollarSign,
  Scale,
  Wallet,
  TrendingUp,
  FileText,
  Lightbulb,
  Check,
  CircleDot,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

type SectorKey =
  | 'restauration'
  | 'commerce'
  | 'b2b'
  | 'tech'
  | 'btp'
  | 'autre'
  | 'custom'

interface BpAnswers {
  sector: string
  projectName: string
  region: string
  offerType: string
  positioning: string
  clientType: string
  revenueModel: string
  legalStructure: string
  budget: number
  caGoal: number
  slogan: string
}

interface AiSuggestion {
  text: string
  step: number
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const TOTAL_STEPS = 10

const TOP_SECTORS = [
  { key: 'restauration' as SectorKey, emoji: '🍽️', label: 'Restauration & Alimentation' },
  { key: 'commerce' as SectorKey, emoji: '🛒', label: 'Commerce & Négoce' },
  { key: 'b2b' as SectorKey, emoji: '💼', label: 'Services aux entreprises (B2B)' },
  { key: 'tech' as SectorKey, emoji: '💻', label: 'Tech & Numérique' },
  { key: 'btp' as SectorKey, emoji: '🏗️', label: 'BTP & Construction' },
]

const ALL_SECTORS = [
  'Restauration & Alimentation', 'Commerce & Négoce', 'Services aux entreprises',
  'Tech & Numérique', 'BTP & Construction', 'Santé & Bien-être', 'Éducation & Formation',
  'Immobilier', 'Tourisme & Loisirs', 'Transport & Logistique', 'Mode & Textile',
  'Beauté & Cosmétique', 'Sport & Fitness', 'Artisanat', 'Agriculture & Agroalimentaire',
  'Événementiel', 'Communication & Marketing', 'Finance & Comptabilité', 'Juridique',
  'Ressources Humaines', 'Architecture & Design', 'Environnement & Développement durable',
  'Automobile', 'Photographie & Vidéo', 'Musique & Audio', 'Jardinage & Paysagisme',
  'Nettoyage & Entretien', 'Coaching & Développement personnel', 'E-commerce',
  'Fabrication & Industrie', 'Énergie renouvelable', 'Télécommunications',
  'Sécurité & Gardiennage', 'Plomberie & Chauffage', 'Électricité', 'Peinture & Décoration',
  'Fleuristerie', 'Boulangerie & Pâtisserie', 'Coiffure & Esthétique',
  'Animalerie & Soins animaux', 'Livraison & Coursiers',
]

const REGIONS = [
  { key: 'idf', label: 'Paris / Île-de-France', icon: MapPin },
  { key: 'sud', label: 'Grand Sud (Marseille, Lyon, Toulouse)', icon: MapPin },
  { key: 'ouest', label: 'Grand Ouest (Nantes, Bordeaux, Rennes)', icon: MapPin },
  { key: 'nord', label: 'Nord & Est (Lille, Strasbourg)', icon: MapPin },
  { key: 'international', label: 'France entière / International', icon: MapPin },
]

const OFFER_BY_SECTOR: Record<string, { emoji: string; label: string }[]> = {
  restauration: [
    { emoji: '🥡', label: 'Plats à emporter' },
    { emoji: '🪑', label: 'Service en salle' },
    { emoji: '👨‍🍳', label: 'Traiteur' },
    { emoji: '🚚', label: 'Catering' },
    { emoji: '🌮', label: 'Food truck' },
  ],
  commerce: [
    { emoji: '📦', label: 'Produits physiques' },
    { emoji: '🌐', label: 'En ligne' },
    { emoji: '🔄', label: 'Les deux' },
    { emoji: '🏪', label: 'Marketplace' },
  ],
  b2b: [
    { emoji: '📋', label: 'Conseil' },
    { emoji: '🎓', label: 'Formation' },
    { emoji: '⚙️', label: 'Tech' },
    { emoji: '👷', label: 'Intérim' },
    { emoji: '🔄', label: 'Les deux' },
  ],
  tech: [
    { emoji: '☁️', label: 'SaaS' },
    { emoji: '📱', label: 'Application mobile' },
    { emoji: '🛒', label: 'E-commerce' },
    { emoji: '🏪', label: 'Marketplace' },
    { emoji: '📡', label: 'IoT' },
  ],
  btp: [
    { emoji: '🔨', label: 'Rénovation' },
    { emoji: '🏗️', label: 'Construction neuve' },
    { emoji: '🎨', label: 'Aménagement' },
    { emoji: '⚡', label: 'Énergie' },
    { emoji: '🔄', label: 'Les deux' },
  ],
  default: [
    { emoji: '📦', label: 'Produit' },
    { emoji: '🔧', label: 'Service' },
    { emoji: '🔄', label: 'Les deux' },
    { emoji: '🏪', label: 'Marketplace' },
    { emoji: '💳', label: 'Abonnement' },
  ],
}

const POSITIONING_OPTIONS = [
  { key: 'premium', emoji: '✨', label: 'Premium / Haut de gamme' },
  { key: 'mid', emoji: '⚖️', label: 'Milieu de gamme' },
  { key: 'eco', emoji: '💰', label: 'Économique' },
  { key: 'lowcost', emoji: '🏷️', label: 'Low-cost' },
]

const CLIENT_OPTIONS = [
  { key: 'b2c', emoji: '👤', label: 'Particuliers (B2C)' },
  { key: 'b2b', emoji: '🏢', label: 'Entreprises (B2B)' },
  { key: 'both', emoji: '🔄', label: 'Les deux' },
]

const REVENUE_MODELS = [
  {
    key: 'direct',
    emoji: '💳',
    label: 'Vente directe (une fois)',
    tooltip: 'Le client paie une seule fois pour obtenir le produit ou service.',
  },
  {
    key: 'subscription',
    emoji: '🔄',
    label: 'Abonnement / Récurent',
    tooltip: 'Revenus mensuels réguliers via un abonnement ou un contrat.',
  },
  {
    key: 'freemium',
    emoji: '🎁',
    label: 'Freemium',
    tooltip: 'Version gratuite pour attirer les utilisateurs, options payantes premium.',
  },
  {
    key: 'commission',
    emoji: '🏪',
    label: 'Commission / Marketplace',
    tooltip: 'Vous prenez une commission sur chaque transaction entre vendeurs et acheteurs.',
  },
  {
    key: 'franchise',
    emoji: '📜',
    label: 'Franchise / Licence',
    tooltip: 'Vous vendez le droit d\'utiliser votre concept ou votre technologie.',
  },
]

const LEGAL_STRUCTURES = [
  {
    key: 'auto',
    emoji: '📋',
    label: 'Micro-entreprise',
    detail: 'Simple, charges réduites, CA max 188K€ (services)',
  },
  {
    key: 'sasu',
    emoji: '🛡️',
    label: 'SASU',
    detail: 'Protection du patrimoine, flexible',
  },
  {
    key: 'eurl',
    emoji: '🤝',
    label: 'SARL / EURL',
    detail: 'Avantages sociaux, 2 associés min',
  },
  {
    key: 'sas',
    emoji: '🏢',
    label: 'SAS',
    detail: 'Multi-associés, attractif investisseurs',
  },
]

const STEP_META = [
  { key: 'sector', title: 'Quel est votre projet ?', subtitle: 'Définissez votre secteur d\'activité principal', icon: CircleDot },
  { key: 'name', title: 'Donnez un nom à votre projet', subtitle: 'Un nom qui reflète votre vision', icon: Sparkles },
  { key: 'region', title: 'Où souhaitez-vous opérer ?', subtitle: 'La localisation influence votre marché', icon: MapPin },
  { key: 'offer', title: 'Que vendez-vous ?', subtitle: 'Décrivez votre offre principale', icon: Package },
  { key: 'positioning', title: 'Comment vous positionnez-vous ?', subtitle: 'Votre positionnement prix et qualité', icon: Target },
  { key: 'clients', title: 'Qui sont vos clients ?', subtitle: 'Identifiez votre cible principale', icon: Users },
  { key: 'revenue', title: 'Quel modèle de revenus ?', subtitle: 'Comment votre entreprise va gagner de l\'argent', icon: DollarSign },
  { key: 'legal', title: 'Quelle structure juridique ?', subtitle: 'Le cadre légal de votre activité', icon: Scale },
  { key: 'budget', title: 'Budget initial estimé', subtitle: 'Vos besoins de financement de départ', icon: Wallet },
  { key: 'goal', title: 'Objectif CA Année 1', subtitle: 'Votre ambition de chiffre d\'affaires', icon: TrendingUp },
]

const SLOGAN_SUGGESTIONS: Record<string, string[]> = {
  restauration: ['Goût authentique, instant partagé', 'L\'art de bien manger, simplement', 'Votre table, notre passion'],
  commerce: ['Le choix juste, le prix juste', 'Votre corner shopping idéal', 'Sélection locale, qualité garantie'],
  b2b: ['Votre croissance, notre métier', 'Performance durable, résultats concrets', 'L\'expertise qui fait la différence'],
  tech: ['L\'innovation à portée de main', 'Simple. Puissant. Scalable.', 'La tech au service de votre vision'],
  btp: ['Construire l\'avenir, durablement', 'Des fondations solides pour vos rêves', 'Rénover, bâtir, transformer'],
  default: ['Votre vision, notre mission', 'L\'excellence au quotidien', 'Simplifier votre quotidien'],
}

// ═══════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.06 } },
}

const chipEnter = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER
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
  const match = TOP_SECTORS.find(
    (s) => s.label.toLowerCase() === label.toLowerCase() || label.toLowerCase().includes(s.key)
  )
  return match?.key ?? 'default'
}

// ═══════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

// ─── Step 1: Sector Selection ─────────────────────────────────────────
function Step1Sector({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const filteredSectors = searchQuery.length > 0
    ? ALL_SECTORS.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  useEffect(() => {
    const timer = setTimeout(() => {
      if (answers.sector) {
        const sectorKey = getSectorKey(answers.sector)
        onAiSuggestion(
          `D'après votre profil et vos compétences, le secteur "${answers.sector}" pourrait vous convenir. ` +
          `Ce secteur représente une belle opportunité de croissance en 2025.`
        )
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [answers.sector])

  const handleSelect = (label: string) => {
    onChange('sector', label)
    setShowSearch(false)
    setShowCustom(false)
    // Trigger market data auto-population
    fetch('/api/bp-market-auto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sector: label }),
    }).catch(() => { /* silent */ })
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-4">
      {/* Top 5 sector cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TOP_SECTORS.map((sector) => (
          <motion.button
            key={sector.key}
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(sector.label)}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
              answers.sector === sector.label
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {answers.sector === sector.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-2xl block mb-2">{sector.emoji}</span>
            <span className="text-sm font-medium text-gray-800 leading-snug">{sector.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Search sector */}
      <motion.div variants={fadeInUp}>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          Rechercher un autre secteur...
        </button>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tapez votre secteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                  autoFocus
                />
                {filteredSectors.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                    {filteredSectors.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          handleSelect(s)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                      >
                        <CircleDot className="w-3 h-3 text-emerald-400" />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pas sûr */}
      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('sector', 'Pas sûr')
          onAiSuggestion('Nous analyserons votre profil pour vous suggérer le secteur le plus adapté.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr de mon secteur — laisser l\'IA choisir
      </motion.button>

      {/* Autre / Custom */}
      <motion.div variants={fadeInUp}>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Autre — saisie libre
        </button>
        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Input
                placeholder="Décrivez votre projet..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="mt-2 rounded-xl border-gray-200"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (customValue.trim()) {
                    onChange('sector', customValue.trim())
                    setShowCustom(false)
                  }
                }}
                className="mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirmer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Step 2: Project Name ─────────────────────────────────────────────
function Step2Name({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  const [slogans, setSlogans] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      const sectorKey = getSectorKey(answers.sector)
      setSlogans(SLOGAN_SUGGESTIONS[sectorKey] || SLOGAN_SUGGESTIONS.default)
      onAiSuggestion('Choisissez un nom mémorable et facile à prononcer. Il doit refléter votre activité.')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeInUp}>
        <Input
          placeholder="Ex: Le Petit Bistrot, TechFlow, GreenBuild..."
          value={answers.projectName}
          onChange={(e) => onChange('projectName', e.target.value)}
          className="h-14 text-lg rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-100"
          autoFocus
        />
      </motion.div>

      {slogans.length > 0 && (
        <motion.div variants={fadeInUp}>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Suggestions de slogans IA
          </p>
          <div className="flex flex-wrap gap-2">
            {slogans.map((slogan, i) => (
              <motion.button
                key={slogan}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange('slogan', slogan)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  answers.slogan === slogan
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {slogan}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Step 3: Region ───────────────────────────────────────────────────
function Step3Region({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onAiSuggestion(
        'La localisation impacte votre marché, vos coûts et votre réseau. ' +
        'Paris/Ile-de-France offre un marché large mais des coûts élevés. ' +
        'Les régions offrent souvent un meilleur rapport coût/opportunité.'
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      {REGIONS.map((region) => (
        <motion.button
          key={region.key}
          variants={fadeInUp}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange('region', region.label)}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
            answers.region === region.label
              ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
              : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            answers.region === region.label ? 'bg-emerald-500' : 'bg-gray-100'
          }`}>
            <region.icon className={`w-5 h-5 ${answers.region === region.label ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <span className="text-sm font-medium text-gray-800">{region.label}</span>
          {answers.region === region.label && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
              <Check className="w-5 h-5 text-emerald-500" />
            </motion.div>
          )}
        </motion.button>
      ))}

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('region', 'Pas sûr')
          onAiSuggestion('Nous recommanderons la meilleure zone en fonction de votre secteur.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr de ma zone
      </motion.button>

      <motion.div variants={fadeInUp}>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Autre ville ou région...
        </button>
        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Input
                placeholder="Ex: Lyon, Bordeaux, Nice..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="mt-2 rounded-xl border-gray-200"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (customValue.trim()) {
                    onChange('region', customValue.trim())
                    setShowCustom(false)
                  }
                }}
                className="mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirmer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Step 4: Offer Type ───────────────────────────────────────────────
function Step4Offer({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  const sectorKey = getSectorKey(answers.sector)
  const offers = OFFER_BY_SECTOR[sectorKey] || OFFER_BY_SECTOR.default

  useEffect(() => {
    const timer = setTimeout(() => {
      onAiSuggestion(
        `Pour le secteur "${answers.sector || 'votre domaine'}", ` +
        `les offres les plus demandées en 2025 sont : ${offers.slice(0, 2).map((o) => o.label).join(' et ')}.`
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {offers.map((offer) => (
          <motion.button
            key={offer.label}
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange('offerType', offer.label)}
            className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
              answers.offerType === offer.label
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {answers.offerType === offer.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-2xl block mb-2">{offer.emoji}</span>
            <span className="text-sm font-medium text-gray-800 leading-snug">{offer.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('offerType', 'Pas sûr')
          onAiSuggestion('Nous vous suggérerons l\'offre la plus adaptée à votre secteur.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr
      </motion.button>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('offerType', 'Personnalisé')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
      >
        <FileText className="w-4 h-4" />
        Personnalisé
      </motion.button>
    </motion.div>
  )
}

// ─── Step 5: Positioning ──────────────────────────────────────────────
function Step5Positioning({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const regionHint = answers.region?.includes('Paris')
        ? ' En Île-de-France, un positionnement milieu-haut de gamme est souvent pertinent.'
        : ''
      onAiSuggestion(
        `Pour le secteur "${answers.sector || 'votre domaine'}"${regionHint} ` +
        `Analysez votre concurrence locale pour définir votre positionnement optimal.`
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {POSITIONING_OPTIONS.map((opt) => (
          <motion.button
            key={opt.key}
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange('positioning', opt.label)}
            className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
              answers.positioning === opt.label
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {answers.positioning === opt.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-3xl block mb-2">{opt.emoji}</span>
            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('positioning', 'Pas sûr')
          onAiSuggestion('L\'IA analysera votre marché pour recommander le meilleur positionnement.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr
      </motion.button>
    </motion.div>
  )
}

// ─── Step 6: Clients ──────────────────────────────────────────────────
function Step6Clients({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const isB2C = answers.clientType === 'Particuliers (B2C)'
      const isB2B = answers.clientType === 'Entreprises (B2B)'
      if (isB2C) {
        onAiSuggestion(
          'Votre client type : Homme/Femme, 25-45 ans, urbain, revenus moyens+. ' +
          'Il recherche qualité, proximité et authenticité. Il est très actif sur les réseaux sociaux.'
        )
      } else if (isB2B) {
        onAiSuggestion(
          'Votre client type : PME de 5-50 employés, dirigeant de 35-55 ans. ' +
          'Il cherche un partenaire fiable, réactif et avec un bon rapport qualité-prix.'
        )
      } else {
        onAiSuggestion(
          'Cibler les deux segments augmente votre marché mais complexifie votre stratégie marketing. ' +
          'Votre client type : 25-55 ans, actif, sensible à l\'innovation et au service client.'
        )
      }
    }, 1200)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.clientType])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CLIENT_OPTIONS.map((opt) => (
          <motion.button
            key={opt.key}
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange('clientType', opt.label)}
            className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
              answers.clientType === opt.label
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {answers.clientType === opt.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-3xl block mb-2">{opt.emoji}</span>
            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('clientType', 'Pas sûr')
          onAiSuggestion('L\'IA définira votre persona client idéal en fonction de votre offre.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr
      </motion.button>
    </motion.div>
  )
}

// ─── Step 7: Revenue Model ────────────────────────────────────────────
function Step7Revenue({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const sectorKey = getSectorKey(answers.sector)
      const suggestions: Record<string, string> = {
        restauration: 'La vente directe reste le modèle le plus courant en restauration. Un abonnement formule midi peut créer de la récurrence.',
        tech: 'Le SaaS et le Freemium sont les modèles les plus scalables en tech. Pensez à la conversion free → premium.',
        commerce: 'Le modèle hybride physique/en ligne avec abonnement fidélité offre une excellente récurrence.',
        b2b: 'Le conseil se facture souvent en JC (jour-consommateur). La formation récurrente assure des revenus prévisibles.',
        btp: 'La vente directe de projets reste prédominant. Le contrat de maintenance assure une base récurrente.',
      }
      onAiSuggestion(
        suggestions[sectorKey] ||
        'Le choix du modèle de revenus dépend de votre type d\'offre et de votre cible. ' +
        'Un modèle récurrent (abonnement) offre plus de prévisibilité.'
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REVENUE_MODELS.map((model) => (
            <Tooltip key={model.key}>
              <TooltipTrigger asChild>
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChange('revenueModel', model.label)}
                  className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    answers.revenueModel === model.label
                      ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                      : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
                  }`}
                >
                  {answers.revenueModel === model.label && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  <span className="text-xl block mb-1">{model.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">{model.label}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs text-xs">
                {model.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('revenueModel', 'Pas sûr')
          onAiSuggestion('L\'IA recommandera le modèle le plus adapté à votre secteur et votre offre.')
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr
      </motion.button>
    </motion.div>
  )
}

// ─── Step 8: Legal Structure ──────────────────────────────────────────
function Step8Legal({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: string) => void
  onAiSuggestion: (text: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (answers.budget > 50000 || answers.caGoal > 100000) {
        onAiSuggestion(
          'Avec un budget élevé ou des objectifs ambitieux, la SASU ou la SAS offrent ' +
          'une meilleure protection du patrimoine et sont plus attractives pour les investisseurs.'
        )
      } else {
        onAiSuggestion(
          'La Micro-entreprise est idéale pour tester votre idée à moindre coût. ' +
          'Vous pourrez toujours évoluer vers une SASU/SARL quand votre activité se développera.'
        )
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LEGAL_STRUCTURES.map((struct) => (
          <motion.button
            key={struct.key}
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange('legalStructure', struct.label)}
            className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
              answers.legalStructure === struct.label
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {answers.legalStructure === struct.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <span className="text-xl block mb-1">{struct.emoji}</span>
            <span className="text-sm font-semibold text-gray-800">{struct.label}</span>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">{struct.detail}</p>
          </motion.button>
        ))}
      </div>

      <motion.button
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        onClick={() => {
          onChange('legalStructure', 'Pas sûr')
          onAiSuggestion(
            'Pour commencer, la Micro-entreprise est la plus simple et la moins coûteuse. ' +
            'Elle est idéale pour tester votre marché avec un CA max de 188K€/an (services).'
          )
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors mt-2"
      >
        <Lightbulb className="w-4 h-4" />
        Pas sûr — laisser l\'IA recommander
      </motion.button>
    </motion.div>
  )
}

// ─── Step 9: Budget Slider ────────────────────────────────────────────
function Step9Budget({
  answers,
  onChange,
  onAiSuggestion,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: number) => void
  onAiSuggestion: (text: string) => void
}) {
  const milestones = [5000, 10000, 25000, 50000, 100000, 150000]
  const [showBreakdown, setShowBreakdown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const sectorKey = getSectorKey(answers.sector)
      const avgBudgets: Record<string, number> = {
        restauration: 60000,
        commerce: 35000,
        b2b: 10000,
        tech: 25000,
        btp: 80000,
      }
      const avg = avgBudgets[sectorKey] || 30000
      onAiSuggestion(`Pour votre secteur, le budget moyen est de ${formatCurrency(avg)}.`)

      // Calculate breakdown
      const total = answers.budget || avg
      const breakdowns: Record<string, { local: number; material: number; stock: number; marketing: number }> = {
        restauration: { local: Math.round(total * 0.45), material: Math.round(total * 0.3), stock: Math.round(total * 0.15), marketing: Math.round(total * 0.1) },
        commerce: { local: Math.round(total * 0.35), material: Math.round(total * 0.15), stock: Math.round(total * 0.35), marketing: Math.round(total * 0.15) },
        b2b: { local: Math.round(total * 0.15), material: Math.round(total * 0.25), stock: 0, marketing: Math.round(total * 0.6) },
        tech: { local: Math.round(total * 0.15), material: Math.round(total * 0.1), stock: 0, marketing: Math.round(total * 0.75) },
        btp: { local: Math.round(total * 0.1), material: Math.round(total * 0.55), stock: Math.round(total * 0.25), marketing: Math.round(total * 0.1) },
      }
      const b = breakdowns[sectorKey] || { local: Math.round(total * 0.3), material: Math.round(total * 0.2), stock: Math.round(total * 0.2), marketing: Math.round(total * 0.3) }
      setShowBreakdown(true)
    }, 1200)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.budget])

  const breakdown = (() => {
    const sectorKey = getSectorKey(answers.sector)
    const total = answers.budget || 30000
    const breakdowns: Record<string, { local: number; material: number; stock: number; marketing: number }> = {
      restauration: { local: Math.round(total * 0.45), material: Math.round(total * 0.3), stock: Math.round(total * 0.15), marketing: Math.round(total * 0.1) },
      commerce: { local: Math.round(total * 0.35), material: Math.round(total * 0.15), stock: Math.round(total * 0.35), marketing: Math.round(total * 0.15) },
      b2b: { local: Math.round(total * 0.15), material: Math.round(total * 0.25), stock: 0, marketing: Math.round(total * 0.6) },
      tech: { local: Math.round(total * 0.15), material: Math.round(total * 0.1), stock: 0, marketing: Math.round(total * 0.75) },
      btp: { local: Math.round(total * 0.1), material: Math.round(total * 0.55), stock: Math.round(total * 0.25), marketing: Math.round(total * 0.1) },
    }
    return breakdowns[sectorKey] || { local: Math.round(total * 0.3), material: Math.round(total * 0.2), stock: Math.round(total * 0.2), marketing: Math.round(total * 0.3) }
  })()

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-6">
      {/* Current value display */}
      <motion.div variants={fadeInUp} className="text-center">
        <p className="text-4xl font-bold text-emerald-600 tabular-nums">
          {formatCurrency(answers.budget)}
        </p>
        <p className="text-sm text-gray-400 mt-1">Budget initial estimé</p>
      </motion.div>

      {/* Slider */}
      <motion.div variants={fadeInUp} className="px-2">
        <Slider
          value={[answers.budget]}
          onValueChange={([val]) => onChange('budget', val)}
          min={0}
          max={200000}
          step={1000}
          className="w-full"
        />
        {/* Milestone markers */}
        <div className="flex justify-between mt-2 px-0.5">
          {milestones.map((m) => (
            <span
              key={m}
              className="text-[10px] text-gray-400 tabular-nums"
            >
              {m >= 1000 ? `${m / 1000}K` : m}€
            </span>
          ))}
        </div>
      </motion.div>

      {/* Quick select buttons */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 justify-center">
        {[10000, 25000, 50000, 100000].map((val) => (
          <button
            key={val}
            onClick={() => onChange('budget', val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              answers.budget === val
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {formatCurrency(val)}
          </button>
        ))}
      </motion.div>

      {/* Breakdown */}
      <AnimatePresence>
        {showBreakdown && answers.budget > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100"
          >
            <p className="text-xs text-gray-500 mb-3 font-medium">Répartition suggérée</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Local', value: breakdown.local },
                { label: 'Matériel', value: breakdown.material },
                { label: 'Stock', value: breakdown.stock },
                { label: 'Marketing', value: breakdown.marketing },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-white rounded-lg p-2 px-3">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-semibold text-emerald-700">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Step 10: CA Goal ─────────────────────────────────────────────────
function Step10Goal({
  answers,
  onChange,
  onAiSuggestion,
  onComplete,
}: {
  answers: BpAnswers
  onChange: (field: keyof BpAnswers, value: number) => void
  onAiSuggestion: (text: string) => void
  onComplete: () => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const realismCheck = (() => {
    if (answers.caGoal === 0) return { text: '', level: 'neutral' as const }
    const ratio = answers.budget > 0 ? answers.caGoal / answers.budget : answers.caGoal / 30000
    if (ratio > 10) return { text: 'Objectif très ambitieux — attention au cash-flow', level: 'warning' as const }
    if (ratio > 4) return { text: 'Objectif ambitieux mais réaliste', level: 'good' as const }
    return { text: 'Objectif prudent', level: 'cautious' as const }
  })()

  const breakEvenMonthly = answers.caGoal > 0 ? Math.round(answers.caGoal / 12) : 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (answers.caGoal > 0) {
        onAiSuggestion('')
      }
    }, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.caGoal])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 500))
    onComplete()
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-6">
      {/* Current value */}
      <motion.div variants={fadeInUp} className="text-center">
        <p className="text-4xl font-bold text-emerald-600 tabular-nums">
          {formatCurrency(answers.caGoal)}
        </p>
        <p className="text-sm text-gray-400 mt-1">Objectif CA Année 1</p>
      </motion.div>

      {/* Slider */}
      <motion.div variants={fadeInUp} className="px-2">
        <Slider
          value={[answers.caGoal]}
          onValueChange={([val]) => onChange('caGoal', val)}
          min={0}
          max={500000}
          step={5000}
          className="w-full"
        />
        <div className="flex justify-between mt-2 px-0.5">
          {[0, 100000, 200000, 300000, 400000, 500000].map((m) => (
            <span key={m} className="text-[10px] text-gray-400 tabular-nums">
              {m === 0 ? '0' : `${m / 1000}K`}€
            </span>
          ))}
        </div>
      </motion.div>

      {/* Quick select */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 justify-center">
        {[50000, 100000, 200000, 350000, 500000].map((val) => (
          <button
            key={val}
            onClick={() => onChange('caGoal', val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              answers.caGoal === val
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {formatCurrency(val)}
          </button>
        ))}
      </motion.div>

      {/* AI realism check */}
      {answers.caGoal > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 border text-center ${
            realismCheck.level === 'warning'
              ? 'bg-amber-50 border-amber-200'
              : realismCheck.level === 'good'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-gray-50 border-gray-200'
          }`}
        >
          <p className={`text-sm font-medium ${
            realismCheck.level === 'warning'
              ? 'text-amber-700'
              : realismCheck.level === 'good'
                ? 'text-emerald-700'
                : 'text-gray-600'
          }`}>
            {realismCheck.text}
          </p>
          {breakEvenMonthly > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Seuil de rentabilité estimé : <strong>{formatCurrency(breakEvenMonthly)}/mois</strong>
            </p>
          )}
        </motion.div>
      )}

      {/* Generate CTA */}
      <motion.div variants={fadeInUp} className="pt-2">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-bold shadow-lg shadow-emerald-200 transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mr-2"
              >
                ✨
              </motion.span>
              Générer mon Business Plan
            </>
          )}
        </Button>
        <p className="text-[11px] text-gray-400 text-center mt-3">
          Vous pourrez modifier toutes vos réponses ultérieurement
        </p>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function BpQuestionnaire() {
  const userId = useAppStore((s) => s.userId)
  const setUserTab = useAppStore((s) => s.setUserTab)

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)

  const [answers, setAnswers] = useState<BpAnswers>({
    sector: '',
    projectName: '',
    region: '',
    offerType: '',
    positioning: '',
    clientType: '',
    revenueModel: '',
    legalStructure: '',
    budget: 30000,
    caGoal: 100000,
    slogan: '',
  })

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentMeta = STEP_META[currentStep]
  const progressPercent = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)

  // ── Load existing answers on mount ────────────────────────────────
  useEffect(() => {
    async function loadAnswers() {
      if (!userId) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.answers) {
            setAnswers((prev) => ({ ...prev, ...data.answers }))
          }
        }
      } catch (err) {
        console.error('Failed to load BP questionnaire:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnswers()
  }, [userId])

  // ── Save answers on step change ───────────────────────────────────
  const saveAnswers = useCallback(
    (currentAnswers: BpAnswers) => {
      if (!userId) return
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        fetch('/api/bp-questionnaire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            currentStep: currentStep + 1,
            answers: currentAnswers,
          }),
        }).catch(() => { /* silent */ })
      }, 300)
    },
    [userId, currentStep]
  )

  // ── Handle field change ───────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof BpAnswers, value: string | number) => {
      setAnswers((prev) => {
        const updated = { ...prev, [field]: value }
        saveAnswers(updated)
        return updated
      })
    },
    [saveAnswers]
  )

  // ── AI Suggestion handler ─────────────────────────────────────────
  const handleAiSuggestion = useCallback((text: string) => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    setShowAiSuggestion(false)
    setAiSuggestion('')
    if (!text) return
    aiTimeoutRef.current = setTimeout(() => {
      setAiSuggestion(text)
      setShowAiSuggestion(true)
    }, 1000)
  }, [])

  // ── Navigation ────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
      setShowAiSuggestion(false)
    }
  }, [currentStep])

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
      setShowAiSuggestion(false)
    }
  }, [currentStep])

  const handleComplete = useCallback(() => {
    saveAnswers(answers)
    setUserTab('bp-overview')
  }, [answers, saveAnswers, setUserTab])

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key === 'Enter') {
          e.preventDefault()
          goNext()
        }
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  // ── Can proceed check ─────────────────────────────────────────────
  const canProceed = (() => {
    switch (currentStep) {
      case 0: return answers.sector.length > 0
      case 1: return answers.projectName.trim().length > 0
      case 2: return answers.region.length > 0
      case 3: return answers.offerType.length > 0
      case 4: return answers.positioning.length > 0
      case 5: return answers.clientType.length > 0
      case 6: return answers.revenueModel.length > 0
      case 7: return answers.legalStructure.length > 0
      case 8: return true // Budget can be 0
      case 9: return true // CA goal can be 0
      default: return true
    }
  })()

  // ── Render step content ───────────────────────────────────────────
  const renderStep = () => {
    const stepProps = { answers, onChange: handleChange, onAiSuggestion: handleAiSuggestion }

    switch (currentStep) {
      case 0: return <Step1Sector {...stepProps} />
      case 1: return <Step2Name {...stepProps} />
      case 2: return <Step3Region {...stepProps} />
      case 3: return <Step4Offer {...stepProps} />
      case 4: return <Step5Positioning {...stepProps} />
      case 5: return <Step6Clients {...stepProps} />
      case 6: return <Step7Revenue {...stepProps} />
      case 7: return <Step8Legal {...stepProps} />
      case 8: return <Step9Budget {...stepProps} />
      case 9: return <Step10Goal {...stepProps} onComplete={handleComplete} />
      default: return null
    }
  }

  // ── Loading state ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement de votre progression...</p>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Progress bar (top) ──────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5">
              {currentStep + 1} / {TOTAL_STEPS}
            </Badge>
            <span className="text-xs text-gray-400 font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 hidden sm:block">
            Raccourcis : Entrée = Suivant, Échap = Précédent
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* ── Question header ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`header-${currentStep}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
              <currentMeta.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {currentMeta.title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Step content with slide animation ───────────────────────── */}
      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${currentStep}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation buttons ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="rounded-xl px-5 h-10 border-gray-200 hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Précédent
        </Button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'bg-emerald-500 w-6'
                  : i < currentStep
                    ? 'bg-emerald-300'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            onClick={goNext}
            disabled={!canProceed}
            className="rounded-xl px-5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className="w-[92px]" /> // Spacer for alignment
        )}
      </div>

      {/* ── AI suggestion overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {showAiSuggestion && aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 max-w-xs z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-4 relative">
              {/* Sparkle decoration */}
              <div className="absolute -top-3 -right-1">
                <motion.span
                  animate={{ rotate: [0, 20, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  ✨
                </motion.span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {aiSuggestion}
                </p>
              </div>
              <button
                onClick={() => setShowAiSuggestion(false)}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-[10px] text-gray-500">×</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
