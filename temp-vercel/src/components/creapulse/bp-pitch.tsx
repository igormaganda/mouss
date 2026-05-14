'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  FileText,
  Loader2,
  Rocket,
  AlertCircle,
  Copy,
  Check,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  MapPin,
  Megaphone,
  CreditCard,
  Shield,
  Mail,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'
import { useAppStore } from '@/hooks/use-store'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────
interface PlanData {
  id: string
  projectName: string
  sector: string
  slogan: string | null
  status: string
  answers: Record<string, any>
  marketData: Record<string, any>
  sections: SectionData[]
}

interface SectionData {
  id: string
  sectionType: string
  title: string
  content: Record<string, any>
  status: string
}

interface Slide {
  id: number
  title: string
  icon: React.ReactNode
  render: (plan: PlanData) => React.ReactNode
}

// ── Helper: format currency ──────────────────────────────────────────
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// ── Component ────────────────────────────────────────────────────────
export default function BpPitch() {
  const userId = useAppStore((s) => s.userId)
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Fetch BusinessPlan with sections ──────────────────────────────
  useEffect(() => {
    async function loadPlan() {
      if (!userId) { setIsLoading(false); return }
      try {
        const res = await fetch(`/api/bp-questionnaire?userId=${userId}`)
        if (!res.ok) throw new Error('Erreur de chargement')
        const data = await res.json()

        if (!data.plan) { setIsLoading(false); return }

        // Fetch completed plan with sections (any status that has generated sections)
        const completedRes = await fetch(
          `/api/bp-questionnaire?userId=${userId}&includeSections=true`
        ).catch(() => null)

        let sections: SectionData[] = []
        if (completedRes?.ok) {
          const completedData = await completedRes.json()
          sections = completedData.sections || []
        }

        // Also fetch directly if sections are empty
        if (sections.length === 0 && data.plan.status === 'COMPLETED') {
          const secRes = await fetch(
            `/api/bp-questionnaire?userId=${userId}&sections=true`
          ).catch(() => null)
          if (secRes?.ok) {
            const secData = await secRes.json()
            sections = secData.sections || []
          }
        }

        setPlan({
          id: data.plan.id,
          projectName: data.plan.projectName || 'Mon Projet',
          sector: data.plan.sector || 'Non défini',
          slogan: data.plan.slogan || '',
          status: data.plan.status,
          answers: (data.plan.answers as Record<string, any>) || {},
          marketData: (data.plan.marketData as Record<string, any>) || {},
          sections,
        })
      } catch (err) {
        console.error('Load plan error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPlan()
  }, [userId])

  // ── Slide definitions ─────────────────────────────────────────────
  const slides: Slide[] = [
    {
      id: 1,
      title: 'Couverture',
      icon: <Rocket className="w-5 h-5" />,
      render: (p) => (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {p.projectName}
          </h1>
          {p.slogan && (
            <p className="text-lg text-emerald-600 font-medium mb-4">{p.slogan}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
              <Target className="w-3.5 h-3.5" />
              {p.sector}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Business Plan — {formatDate(new Date())}
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Le Problème',
      icon: <AlertCircle className="w-5 h-5" />,
      render: (p) => {
        const strategieSection = p.sections.find((s) => s.sectionType === 'strategie')
        const presentationSection = p.sections.find((s) => s.sectionType === 'presentation')
        const text = presentationSection?.content?.text || strategieSection?.content?.text || ''
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Le Problème</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {text ? (
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{text}</p>
              ) : (
                <div className="space-y-3">
                  {['Douleur identifiée sur le marché', 'Solutions actuelles insatisfaisantes', 'Manque d\'accessibilité ou de qualité'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      id: 3,
      title: 'La Solution',
      icon: <Lightbulb className="w-5 h-5" />,
      render: (p) => {
        const section = p.sections.find((s) => s.sectionType === 'presentation')
        const highlights = section?.content?.highlights || []
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">La Solution</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {highlights.length > 0 ? (
                <div className="space-y-3">
                  {highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-700">{h}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">La proposition de valeur sera disponible une fois le plan généré.</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      id: 4,
      title: 'Valeur Ajoutée',
      icon: <Shield className="w-5 h-5" />,
      render: (p) => {
        const section = p.sections.find((s) => s.sectionType === 'strategie')
        const keyPoints = section?.content?.keyPoints || []
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Valeur Ajoutée</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {keyPoints.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {keyPoints.map((kp: string, i: number) => (
                    <div key={i} className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                        <Star className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{kp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Les avantages concurrentiels seront détaillés après la génération complète.</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      id: 5,
      title: 'Taille du Marché',
      icon: <BarChart3 className="w-5 h-5" />,
      render: (p) => {
        const md = p.marketData?.marketSize || {}
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Taille du Marché</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-xs space-y-4">
                {/* Funnel visualization */}
                <div className="space-y-0">
                  <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl flex items-center justify-between px-5">
                    <div>
                      <p className="text-white/80 text-xs font-medium">TAM</p>
                      <p className="text-white font-bold">{md.value || '500 M€'}</p>
                    </div>
                    <p className="text-white/60 text-xs">Marché total</p>
                  </div>
                  <div className="h-16 bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-between px-6 mx-4">
                    <div>
                      <p className="text-white/80 text-xs font-medium">SAM</p>
                      <p className="text-white font-bold">{md.value ? `${Math.round(parseInt(md.value) * 0.4)} M€` : '200 M€'}</p>
                    </div>
                    <p className="text-white/60 text-xs">Marché accessible</p>
                  </div>
                  <div className="h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-b-2xl flex items-center justify-between px-8 mx-8">
                    <div>
                      <p className="text-white/80 text-xs font-medium">SOM</p>
                      <p className="text-white font-bold">{md.value ? `${Math.round(parseInt(md.value) * 0.08)} M€` : '40 M€'}</p>
                    </div>
                    <p className="text-white/60 text-xs">Part visée</p>
                  </div>
                </div>
                {md.growth && (
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Croissance : {md.growth}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 6,
      title: 'Business Model',
      icon: <PieChart className="w-5 h-5" />,
      render: (p) => {
        const revenueModel = p.answers?.revenueModel || 'Abonnements'
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Business Model</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-3">
                {[
                  { label: 'Revenus principaux', value: revenueModel, pct: 60, color: 'from-emerald-500 to-emerald-600' },
                  { label: 'Services complémentaires', value: 'Consulting / Prestations', pct: 25, color: 'from-teal-500 to-teal-600' },
                  { label: 'Autres revenus', value: 'Partenariats / Affiliation', pct: 15, color: 'from-cyan-500 to-cyan-600' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-xs text-gray-500">{item.pct}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 7,
      title: 'Concurrence',
      icon: <Target className="w-5 h-5" />,
      render: (p) => {
        const competitors = p.marketData?.topCompetitors || []
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Concurrence</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {/* 2x2 Matrix placeholder */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-medium mb-1">Leader du marché</p>
                  <p className="text-xs text-gray-500">{competitors[0]?.name || 'Concurrent A'}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Votre position</p>
                  <p className="text-xs text-emerald-700">{p.projectName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-medium mb-1">Innovateur</p>
                  <p className="text-xs text-gray-500">{competitors[1]?.name || 'Concurrent B'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-medium mb-1">Low-cost</p>
                  <p className="text-xs text-gray-500">{competitors[2]?.name || 'Concurrent C'}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center">↑ Innovation / Prix →</div>
            </div>
          </div>
        )
      },
    },
    {
      id: 8,
      title: 'Go-to-Market',
      icon: <Megaphone className="w-5 h-5" />,
      render: (p) => {
        const section = p.sections.find((s) => s.sectionType === 'strategy_marketing')
        const keyPoints = section?.content?.keyPoints || []
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Stratégie Go-to-Market</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {keyPoints.length > 0 ? (
                <div className="space-y-3">
                  {keyPoints.map((kp: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">{kp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {['Lancement sur les réseaux sociaux', 'Partenariats locaux et B2B', 'SEO et contenu éducatif', 'Événements et salons professionnels'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      id: 9,
      title: 'Prévisionnel',
      icon: <BarChart3 className="w-5 h-5" />,
      render: (p) => {
        const section = p.sections.find((s) => s.sectionType === 'previsionnel')
        const projections = section?.content?.yearlyProjections || [
          { year: 1, revenue: 80000, expenses: 120000, netResult: -40000, margin: -50 },
          { year: 2, revenue: 200000, expenses: 180000, netResult: 20000, margin: 10 },
          { year: 3, revenue: 450000, expenses: 320000, netResult: 130000, margin: 29 },
        ]
        const maxVal = Math.max(...projections.map((pr: any) => Math.max(pr.revenue, pr.expenses)))

        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Prévisionnel Financier</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                {projections.map((pr: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium">Année {pr.year}</span>
                      <span className={pr.netResult >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                        {formatCurrency(pr.netResult)}
                      </span>
                    </div>
                    <div className="flex gap-1 h-6 items-end">
                      <div className="flex-1 bg-gray-100 rounded-t relative overflow-hidden h-6 flex items-center px-2">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-t"
                          style={{ width: `${(pr.expenses / maxVal) * 100}%` }}
                        />
                        <span className="relative text-[10px] text-white font-medium z-10">
                          {formatCurrency(pr.expenses)}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-t relative overflow-hidden h-6 flex items-center px-2">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t"
                          style={{ width: `${(pr.revenue / maxVal) * 100}%` }}
                        />
                        <span className="relative text-[10px] text-white font-medium z-10">
                          {formatCurrency(pr.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 text-[10px] text-gray-400">
                      <span className="flex-1 text-center">Charges</span>
                      <span className="flex-1 text-center">Revenus</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 10,
      title: 'Équipe',
      icon: <Users className="w-5 h-5" />,
      render: (p) => {
        const userName = useAppStore.getState().userName
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">L'Équipe</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userName || 'Porteur de projet'}</p>
                    <p className="text-sm text-emerald-600 font-medium">Fondateur / Gérant</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.sector}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Profil entrepreneurial validé via le Bilan CréaPulse
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 11,
      title: 'Demande',
      icon: <CreditCard className="w-5 h-5" />,
      render: (p) => {
        const budget = p.answers?.budget || 50000
        const budgetNum = typeof budget === 'number' ? budget : parseInt(budget) || 50000
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Besoin de Financement</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <p className="text-emerald-100 text-sm font-medium mb-1">Montant recherché</p>
                  <p className="text-4xl font-bold text-white">{formatCurrency(budgetNum)}</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Développement produit', pct: 40 },
                    { label: 'Marketing & Lancement', pct: 25 },
                    { label: 'Frais de structure', pct: 20 },
                    { label: 'Trésorerie de sécurité', pct: 15 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-40 flex-shrink-0">{item.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-10 text-right">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 12,
      title: 'Contact',
      icon: <Mail className="w-5 h-5" />,
      render: (p) => {
        const userName = useAppStore.getState().userName
        const userEmail = useAppStore.getState().userEmail
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prochaines Étapes</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Merci pour votre intérêt. Voici les prochaines étapes pour concrétiser votre projet.
            </p>
            <div className="space-y-3 w-full max-w-xs mb-6">
              {[
                'Compléter les démarches juridiques',
                'Obtenir un rendez-vous conseiller',
                'Soumettre le dossier de financement',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 text-left">{step}</p>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">{userName || 'Porteur de projet'}</p>
              <p>{userEmail || ''}</p>
            </div>
          </div>
        )
      },
    },
  ]

  // ── Navigation ─────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (dir: 'prev' | 'next') => {
      setCurrentSlide((prev) => {
        if (dir === 'prev') return Math.max(0, prev - 1)
        return Math.min(slides.length - 1, prev + 1)
      })
    },
    [slides.length]
  )

  // ── Fullscreen toggle ──────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  // ── Export PDF ─────────────────────────────────────────────────────
  const handleExportPDF = useCallback(() => {
    setIsExporting(true)
    setTimeout(() => {
      window.print()
      setIsExporting(false)
    }, 500)
  }, [])

  // ── Share link ─────────────────────────────────────────────────────
  const handleShareLink = useCallback(async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Lien copié dans le presse-papier !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }, [])

  // ── Keyboard navigation ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide('next')
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide('prev')
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goToSlide, isFullscreen, toggleFullscreen])

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement du Pitch Deck...</p>
      </div>
    )
  }

  // ── No completed plan ──────────────────────────────────────────────
  if (!plan || plan.status !== 'COMPLETED') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pitch Deck indisponible</h3>
          <p className="text-gray-500 text-sm mb-6">
            Votre Pitch Deck sera généré automatiquement une fois votre Business Plan complété.
            Complétez d&apos;abord votre questionnaire pour le créer.
          </p>
          <Button
            onClick={() => useAppStore.getState().setUserTab('bp-questionnaire')}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Complétez d&apos;abord votre Business Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    )
  }

  // ── Main Pitch Deck view ───────────────────────────────────────────
  const activeSlide = slides[currentSlide]

  return (
    <div className="flex flex-col items-center gap-4" ref={containerRef}>
      {/* ── Top toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{plan.projectName}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-400">{plan.sector}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="rounded-lg text-xs"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5" />
            )}
            Exporter en PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            className="rounded-lg text-xs"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            {copied ? 'Copié !' : 'Partager le lien'}
          </Button>
        </div>
      </div>

      {/* ── Slide counter ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-emerald-600">{currentSlide + 1}</span>
        <span className="text-sm text-gray-300">/</span>
        <span className="text-sm text-gray-400">{slides.length}</span>
      </div>

      {/* ── Slide container ──────────────────────────────────────────── */}
      <div className="relative w-full max-w-4xl">
        {/* Left arrow */}
        <button
          onClick={() => goToSlide('prev')}
          disabled={currentSlide === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
            style={{ aspectRatio: '16/9', minHeight: 400 }}
          >
            {/* Slide header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                  {activeSlide.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-700">{activeSlide.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-medium">{plan.projectName}</span>
                <button
                  onClick={toggleFullscreen}
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {/* Slide content */}
            <div className="px-6 py-4 h-[calc(100%-52px)]">
              {activeSlide.render(plan)}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right arrow */}
        <button
          onClick={() => goToSlide('next')}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* ── Navigation dots ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? 'w-6 h-2 bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
            }`}
            title={slide.title}
          />
        ))}
      </div>

      {/* ── Slide labels ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
              idx === currentSlide
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {slide.title}
          </button>
        ))}
      </div>

      {/* ── Print-specific styles ────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .bp-pitch-printable, .bp-pitch-printable * { visibility: visible; }
          .bp-pitch-printable { position: absolute; left: 0; top: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ── Small icon helper used in slide 4 ────────────────────────────────
function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
