'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  TrendingUp,
  Landmark,
  Newspaper,
  CalendarDays,
  ChevronDown,
  Filter,
  Loader2,
  Radar,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { useAppStore } from '@/hooks/use-store'

// ── Types ────────────────────────────────────────────────────────────
type RadarItemType = 'aide' | 'tendance' | 'actualite' | 'opportunite'

interface RadarItem {
  id: string
  title: string
  description: string
  date: string
  type: RadarItemType
  source: string
}

type FilterTab = 'tout' | 'aides' | 'tendances' | 'actualites' | 'opportunites'

// ── Mock data per sector ─────────────────────────────────────────────
function getRadarData(sector: string): Record<string, RadarItem[]> {
  const sectorLabel = sector || 'votre secteur'

  return {
    aides: [
      {
        id: 'a1',
        title: "Bpifrance — Prêt d'amorçage",
        description: `Financement jusqu'à 50 000€ pour les créateurs d'entreprise en ${sectorLabel}. Taux préférentiel et différé de remboursement de 12 mois.`,
        date: '2026-04-15',
        type: 'aide',
        source: 'Bpifrance',
      },
      {
        id: 'a2',
        title: 'ACRE — Aide à la Création d\'Entreprise',
        description: 'Exonération partielle de charges sociales pendant la première année d\'activité. Éligible sous conditions de revenus.',
        date: '2026-03-20',
        type: 'aide',
        source: 'URSSAF',
      },
      {
        id: 'a3',
        title: 'Subvention Régionale Innovation',
        description: `Aide de 5 000€ à 20 000€ pour les projets innovants en ${sectorLabel}. Dossier de candidature ouvert jusqu'au 30 juin.`,
        date: '2026-05-01',
        type: 'aide',
        source: 'Région Île-de-France',
      },
      {
        id: 'a4',
        title: 'ARE / ARCE — Indemnités Chômage',
        description: 'Maintien partiel des allocations chômage lors de la création d\'entreprise. 45% du solde en capital ou 100% en mensuel.',
        date: '2026-02-10',
        type: 'aide',
        source: 'France Travail',
      },
    ],
    tendances: [
      {
        id: 't1',
        title: `Croissance du marché du ${sectorLabel}`,
        description: `Le marché du ${sectorLabel} affiche une croissance annuelle de +8,2% sur les 3 dernières années, tiré par la digitalisation et les nouveaux usages post-Covid.`,
        date: '2026-05-01',
        type: 'tendance',
        source: 'Étude Xerfi',
      },
      {
        id: 't2',
        title: 'Transition écologique : nouvelle norme européenne',
        description: 'La nouvelle directive européenne impose des critères de durabilité impactant directement les entreprises du secteur dès 2027.',
        date: '2026-04-20',
        type: 'tendance',
        source: 'Commission Européenne',
      },
      {
        id: 't3',
        title: 'L\'IA transforme les modèles économiques',
        description: `75% des entreprises du ${sectorLabel} intègrent des solutions d'intelligence artificielle dans leurs processus d'ici 2028.`,
        date: '2026-04-10',
        type: 'tendance',
        source: 'McKinsey France',
      },
    ],
    actualites: [
      {
        id: 'n1',
        title: `Nouvel entrant : Startup Y lève 5M€ dans le ${sectorLabel}`,
        description: 'La startup Y, spécialisée dans les solutions SaaS pour le secteur, vient de clôturer un tour de table de 5 millions d\'euros mené par Elaia Partners.',
        date: '2026-05-08',
        type: 'actualite',
        source: 'Maddyness',
      },
      {
        id: 'n2',
        title: 'Rachat du leader historique par un groupe international',
        description: `Le leader du ${sectorLabel} en France vient d'être racheté par un groupe américain, signalant une consolidation du marché.`,
        date: '2026-04-25',
        type: 'actualite',
        source: 'Les Échos',
      },
      {
        id: 'n3',
        title: 'Plan gouvernemental pour soutenir la création d\'entreprise',
        description: 'Le gouvernement annonce un plan de 200M€ pour faciliter la création d\'entreprise et réduire les délais administratifs de 30%.',
        date: '2026-04-15',
        type: 'actualite',
        source: 'Bercy',
      },
    ],
    opportunites: [
      {
        id: 'o1',
        title: `Salon Professionnel ${sectorLabel} — Paris`,
        description: `Le plus grand salon du ${sectorLabel} se tiendra du 15 au 17 juin 2026 à Paris Expo. 500 exposants et 15 000 visiteurs attendus.`,
        date: '2026-06-15',
        type: 'opportunite',
        source: 'Paris Expo',
      },
      {
        id: 'o2',
        title: 'Programme d\'Accélération — Incubateur Régional',
        description: `Candidatures ouvertes pour le programme d'accélération de 6 mois dédié aux startups du ${sectorLabel}. 15 places disponibles.`,
        date: '2026-07-01',
        type: 'opportunite',
        source: 'Incubateur Régional',
      },
      {
        id: 'o3',
        title: 'Appel à Projets — Innovation Numérique',
        description: `L'ANR lance un appel à projets doté de 2M€ pour les innovations numériques applicables au ${sectorLabel}. Date limite : 30 août.`,
        date: '2026-08-30',
        type: 'opportunite',
        source: 'ANR',
      },
    ],
  }
}

// ── Filter tab config ────────────────────────────────────────────────
const FILTER_TABS: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: 'tout', label: 'Tout', icon: <Filter className="w-3.5 h-3.5" /> },
  { key: 'aides', label: 'Aides & Subventions', icon: <Landmark className="w-3.5 h-3.5" /> },
  { key: 'tendances', label: 'Tendances', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { key: 'actualites', label: 'Actualités', icon: <Newspaper className="w-3.5 h-3.5" /> },
  { key: 'opportunites', label: 'Opportunités', icon: <CalendarDays className="w-3.5 h-3.5" /> },
]

// ── Type badge config ────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  RadarItemType,
  { label: string; borderColor: string; bgColor: string; textColor: string }
> = {
  aide: {
    label: 'Aide',
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  tendance: {
    label: 'Tendance',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  actualite: {
    label: 'Actualité',
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  opportunite: {
    label: 'Opportunité',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
}

// ── Component ────────────────────────────────────────────────────────
export default function BpRadar() {
  const userId = useAppStore((s) => s.userId)
  const [sector, setSector] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('tout')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)
  const [allItems, setAllItems] = useState<RadarItem[]>([])

  // ── Fetch sector from BusinessPlan ─────────────────────────────────
  useEffect(() => {
    async function loadSector() {
      if (!userId) { setIsLoading(false); return }
      try {
        const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const planSector = data.plan?.sector || ''
          setSector(planSector)

          // Build items from radar data
          const radarData = getRadarData(planSector)
          const items: RadarItem[] = [
            ...radarData.aides,
            ...radarData.tendances,
            ...radarData.actualites,
            ...radarData.opportunites,
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          setAllItems(items)
        }
      } catch (err) {
        console.error('Load sector error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSector()
  }, [userId])

  // ── Filter items ───────────────────────────────────────────────────
  const filteredItems = allItems.filter((item) => {
    // Tab filter
    if (activeTab === 'aides' && item.type !== 'aide') return false
    if (activeTab === 'tendances' && item.type !== 'tendance') return false
    if (activeTab === 'actualites' && item.type !== 'actualite') return false
    if (activeTab === 'opportunites' && item.type !== 'opportunite') return false

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      )
    }
    return true
  })

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasMore = visibleItems.length < filteredItems.length

  // ── Format date ────────────────────────────────────────────────────
  function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement du radar de veille...</p>
      </div>
    )
  }

  // ── Empty state (no sector) ────────────────────────────────────────
  if (!sector) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-6">
            <Radar className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Radar de Veille</h3>
          <p className="text-gray-500 text-sm mb-6">
            Le radar de veille s&apos;active automatiquement une fois votre secteur défini dans le Business Plan.
            Il vous permet de suivre les aides, tendances et opportunités de votre marché.
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
    <div className="flex flex-col items-center gap-5 max-w-3xl mx-auto">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Radar de Veille</h2>
            <p className="text-xs text-gray-500">
              Intelligence de marché pour <span className="text-emerald-600 font-medium">{sector}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────── */}
      <div className="w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher dans la veille..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setVisibleCount(8)
          }}
          className="pl-10 rounded-xl border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
        />
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────── */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.key === 'tout'
              ? allItems.length
              : allItems.filter((i) => i.type === tab.key.slice(0, -1 === -1 ? undefined : -1)).length
          // Adjust count logic
          const typeMap: Record<string, RadarItemType> = {
            aides: 'aide',
            tendances: 'tendance',
            actualites: 'actualite',
            opportunites: 'opportunite',
          }
          const actualCount =
            tab.key === 'tout'
              ? allItems.length
              : allItems.filter((i) => i.type === typeMap[tab.key]).length

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setVisibleCount(8)
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {actualCount}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Feed cards ───────────────────────────────────────────────── */}
      <div className="w-full space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleItems.length > 0 ? (
            visibleItems.map((item, idx) => {
              const config = TYPE_CONFIG[item.type]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  className={`bg-white rounded-xl border border-gray-100 border-l-4 ${config.borderColor} shadow-sm hover:shadow-md transition-shadow p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bgColor} ${config.textColor}`}
                        >
                          {config.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-gray-400 font-medium">
                          Source : {item.source}
                        </span>
                      </div>
                    </div>
                    <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Search className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Aucun résultat trouvé</p>
              <p className="text-xs text-gray-400 mt-1">
                Essayez un autre filtre ou terme de recherche
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Load more ────────────────────────────────────────────────── */}
      {hasMore && (
        <Button
          variant="outline"
          onClick={() => setVisibleCount((prev) => prev + 6)}
          className="rounded-xl text-sm"
        >
          <ChevronDown className="w-4 h-4 mr-1.5" />
          Charger plus ({filteredItems.length - visibleCount} restants)
        </Button>
      )}

      {/* ── Footer info ──────────────────────────────────────────────── */}
      <p className="text-[10px] text-gray-400 text-center">
        Données de veille actualisées — Les informations présentées sont indicatives et proviennent de sources publiques.
      </p>
    </div>
  )
}
