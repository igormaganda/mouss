'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Save,
  Loader2,
  Sparkles,
  Wallet,
  Receipt,
  PiggyBank,
  BarChart3,
  Building2,
  Megaphone,
  Package,
  ShieldCheck,
  CircleDot,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ====================== TYPES ======================
interface RevenueInputs {
  monthlyCA: number
  clients: number
  avgBasket: number
}

interface ExpenseInputs {
  loyers: number
  salaires: number
  chargesSociales: number
  marketing: number
  fournitures: number
  assurances: number
  autres: number
}

interface ProjectionYear {
  year: number
  revenue: number
  expenses: number
  netResult: number
  margin: number
  cumulativeCashFlow: number
}

interface BPContext {
  sector?: string
  projectName?: string
  budget?: number
  caGoal?: number
}

const DEFAULT_REVENUE: RevenueInputs = {
  monthlyCA: 5000,
  clients: 20,
  avgBasket: 250,
}

const DEFAULT_EXPENSES: ExpenseInputs = {
  loyers: 800,
  salaires: 2500,
  chargesSociales: 600,
  marketing: 300,
  fournitures: 150,
  assurances: 120,
  autres: 200,
}

const EXPENSE_LABELS: {
  key: keyof ExpenseInputs
  label: string
  icon: typeof Receipt
  color: string
}[] = [
  { key: 'loyers', label: 'Loyers', icon: Building2, color: 'text-blue-500' },
  { key: 'salaires', label: 'Salaires charges incluses', icon: Wallet, color: 'text-emerald-500' },
  { key: 'chargesSociales', label: 'Charges sociales & fiscales', icon: Receipt, color: 'text-amber-500' },
  { key: 'marketing', label: 'Marketing & Communication', icon: Megaphone, color: 'text-purple-500' },
  { key: 'fournitures', label: 'Fournitures & Marchandises', icon: Package, color: 'text-orange-500' },
  { key: 'assurances', label: 'Assurances', icon: ShieldCheck, color: 'text-cyan-500' },
  { key: 'autres', label: 'Autres charges', icon: CircleDot, color: 'text-gray-500' },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

// ====================== BREAK-EVEN SVG CHART ======================
function BreakEvenChart({
  fixedCosts,
  monthlyRevenue,
  breakEvenMonths,
}: {
  fixedCosts: number
  monthlyRevenue: number
  breakEvenMonths: number
}) {
  const months = Math.max(breakEvenMonths, 6, Math.ceil(breakEvenMonths * 1.4))
  const maxVal = Math.max(fixedCosts, monthlyRevenue * months) * 1.1
  const svgW = 500
  const svgH = 220
  const pad = { top: 20, right: 20, bottom: 36, left: 56 }
  const chartW = svgW - pad.left - pad.right
  const chartH = svgH - pad.top - pad.bottom

  const toX = (m: number) => pad.left + (m / months) * chartW
  const toY = (v: number) => pad.top + chartH - (v / maxVal) * chartH

  const revenuePath = `M${toX(0)},${toY(0)} L${toX(months)},${toY(monthlyRevenue * months)}`
  const costPath = `M${toX(0)},${toY(fixedCosts)} L${toX(months)},${toY(fixedCosts)}`

  const breakEvenX = monthlyRevenue > 0 ? fixedCosts / monthlyRevenue : 0
  const showBreakEven = breakEvenMonths > 0 && breakEvenMonths <= months

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" aria-label="Graphique du point mort">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = pad.top + chartH * (1 - frac)
        return (
          <line
            key={`grid-${frac}`}
            x1={pad.left}
            y1={y}
            x2={svgW - pad.right}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            strokeDasharray="4 4"
          />
        )
      })}

      {/* Y-axis labels */}
      {[0, maxVal * 0.5, maxVal].map((v, i) => (
        <text
          key={`ylabel-${i}`}
          x={pad.left - 6}
          y={toY(v) + 4}
          textAnchor="end"
          className="fill-gray-400 text-[9px]"
          fontSize={9}
        >
          {formatCurrency(v)}
        </text>
      ))}

      {/* X-axis labels */}
      {[0, Math.round(months / 2), months].map((m, i) => (
        <text
          key={`xlabel-${i}`}
          x={toX(m)}
          y={svgH - 8}
          textAnchor="middle"
          className="fill-gray-400 text-[9px]"
          fontSize={9}
        >
          {`M${m}`}
        </text>
      ))}

      {/* Fixed costs line */}
      <line
        x1={toX(0)}
        y1={toY(fixedCosts)}
        x2={toX(months)}
        y2={toY(fixedCosts)}
        stroke="#f59e0b"
        strokeWidth={2.5}
        strokeDasharray="6 3"
      />

      {/* Revenue line */}
      <line
        x1={toX(0)}
        y1={toY(0)}
        x2={toX(months)}
        y2={toY(monthlyRevenue * months)}
        stroke="#10b981"
        strokeWidth={2.5}
      />

      {/* Shaded profit area */}
      {showBreakEven && (
        <polygon
          points={`${toX(breakEvenX)},${toY(fixedCosts)} ${toX(months)},${toY(monthlyRevenue * months)} ${toX(months)},${toY(fixedCosts)} ${toX(months)},${toY(fixedCosts)}`}
          fill="#10b981"
          fillOpacity={0.08}
        />
      )}

      {/* Break-even point */}
      {showBreakEven && (
        <>
          <circle
            cx={toX(breakEvenX)}
            cy={toY(fixedCosts)}
            r={5}
            fill="#10b981"
            stroke="white"
            strokeWidth={2}
          />
          <text
            x={toX(breakEvenX)}
            y={toY(fixedCosts) - 10}
            textAnchor="middle"
            className="fill-emerald-600 font-bold"
            fontSize={10}
          >
            Point mort: M{breakEvenX}
          </text>
        </>
      )}

      {/* Legend */}
      <line x1={pad.left + 10} y1={svgH - 20} x2={pad.left + 30} y2={svgH - 20} stroke="#10b981" strokeWidth={2.5} />
      <text x={pad.left + 34} y={svgH - 17} className="fill-gray-500" fontSize={9}>
        Revenus cumulés
      </text>
      <line x1={pad.left + 140} y1={svgH - 20} x2={pad.left + 160} y2={svgH - 20} stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 3" />
      <text x={pad.left + 164} y={svgH - 17} className="fill-gray-500" fontSize={9}>
        Charges fixes
      </text>
    </svg>
  )
}

// ====================== MAIN COMPONENT ======================
export default function BPFinancials() {
  const token = useAppStore((s) => s.token)
  const userId = useAppStore((s) => s.userId)

  const [revenue, setRevenue] = useState<RevenueInputs>(DEFAULT_REVENUE)
  const [expenses, setExpenses] = useState<ExpenseInputs>(DEFAULT_EXPENSES)
  const [growthRate, setGrowthRate] = useState(10)
  const [inflationRate, setInflationRate] = useState(2)
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [bpContext, setBpContext] = useState<BPContext>({})

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load existing data on mount ─────────────────────────────
  useEffect(() => {
    if (!userId) return
    async function loadData() {
      try {
        const [finRes, bpRes] = await Promise.all([
          fetch(`/api/financial?userId=${userId}`),
          fetch(`/api/bp-questionnaire?userId=${userId}`),
        ])

        if (finRes.ok) {
          const data = await finRes.json()
          if (data.revenue) setRevenue(data.revenue)
          if (data.expenses) setExpenses(data.expenses)
          if (data.growthRate != null) setGrowthRate(data.growthRate)
          if (data.inflationRate != null) setInflationRate(data.inflationRate)
        }

        if (bpRes.ok) {
          const data = await bpRes.json()
          const answers = data.answers || data.plan?.answers || {}
          setBpContext({
            sector: answers.sector || answers.secteur,
            projectName: answers.projectName || answers.nom_projet,
            budget: answers.budget ? Number(answers.budget) : undefined,
            caGoal: answers.caGoal ? Number(answers.caGoal) : undefined,
          })
        }
      } catch {
        // Use defaults
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [userId])

  // ── Calculated values ───────────────────────────────────────
  const totalMonthlyExpenses = Object.values(expenses).reduce((s, v) => s + v, 0)
  const monthlyResult = revenue.monthlyCA - totalMonthlyExpenses
  const annualResult = monthlyResult * 12
  const marginPercentage =
    revenue.monthlyCA > 0 ? Math.round((monthlyResult / revenue.monthlyCA) * 100) : 0
  const crossCheckCA = revenue.clients * revenue.avgBasket
  const hasCrossCheckDiscrepancy =
    revenue.clients > 0 &&
    revenue.avgBasket > 0 &&
    Math.abs(crossCheckCA - revenue.monthlyCA) > 1
  const breakEvenMonths =
    monthlyResult > 0
      ? 0
      : totalMonthlyExpenses > 0
        ? Math.ceil(Math.abs(monthlyResult) / (revenue.monthlyCA > 0 ? revenue.monthlyCA : 1))
        : 0

  // ── 3-Year projection ───────────────────────────────────────
  const projection: ProjectionYear[] = useMemo(() => {
    const result: ProjectionYear[] = []
    let cumulative = 0
    for (let y = 1; y <= 3; y++) {
      const yearRevenue = revenue.monthlyCA * 12 * Math.pow(1 + growthRate / 100, y - 1)
      const yearExpenses = totalMonthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, y - 1)
      const net = yearRevenue - yearExpenses
      const margin = yearRevenue > 0 ? Math.round((net / yearRevenue) * 100) : 0
      cumulative += net
      result.push({
        year: y,
        revenue: Math.round(yearRevenue),
        expenses: Math.round(yearExpenses),
        netResult: Math.round(net),
        margin,
        cumulativeCashFlow: Math.round(cumulative),
      })
    }
    return result
  }, [revenue.monthlyCA, totalMonthlyExpenses, growthRate, inflationRate])

  // ── Update helpers ──────────────────────────────────────────
  const updateRevenue = useCallback((key: keyof RevenueInputs, value: number) => {
    setRevenue((prev) => ({ ...prev, [key]: Math.max(0, value) }))
  }, [])

  const updateExpenses = useCallback((key: keyof ExpenseInputs, value: number) => {
    setExpenses((prev) => ({ ...prev, [key]: Math.max(0, value) }))
  }, [])

  // ── Auto-save with debounce ─────────────────────────────────
  const autoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      if (!userId) return
      setIsSaving(true)
      try {
        await fetch('/api/financial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            userId,
            revenue,
            expenses,
            growthRate,
            inflationRate,
            projection,
          }),
        })
        setSavedMsg('Sauvegardé')
        setTimeout(() => setSavedMsg(''), 2000)
      } catch {
        // silent
      } finally {
        setIsSaving(false)
      }
    }, 1200)
  }, [userId, token, revenue, expenses, growthRate, inflationRate, projection])

  // Trigger auto-save on data change
  useEffect(() => {
    if (!isLoading) autoSave()
  }, [revenue, expenses, growthRate, inflationRate, isLoading, autoSave])

  // ── AI Analysis ─────────────────────────────────────────────
  const handleAIAnalysis = async () => {
    setIsLoadingAI(true)
    setAiAnalysis('')
    try {
      const sectorNote = bpContext.sector ? ` dans le secteur ${bpContext.sector}` : ''
      const summary = `Prévisionnel financier pour "${bpContext.projectName || 'Projet'}"${sectorNote}:\n` +
        `- CA mensuel déclaré: ${formatCurrency(revenue.monthlyCA)}\n` +
        `- Clients: ${revenue.clients}, Panier moyen: ${formatCurrency(revenue.avgBasket)}\n` +
        `- CA calculé (clients × panier): ${formatCurrency(crossCheckCA)}\n` +
        `- Total charges mensuelles: ${formatCurrency(totalMonthlyExpenses)}\n` +
        `  Loyers: ${formatCurrency(expenses.loyers)}, Salaires: ${formatCurrency(expenses.salaires)}, Charges sociales: ${formatCurrency(expenses.chargesSociales)}\n` +
        `  Marketing: ${formatCurrency(expenses.marketing)}, Fournitures: ${formatCurrency(expenses.fournitures)}, Assurances: ${formatCurrency(expenses.assurances)}, Autres: ${formatCurrency(expenses.autres)}\n` +
        `- Résultat mensuel: ${formatCurrency(monthlyResult)}, Marge nette: ${marginPercentage}%\n` +
        `- Résultat annuel: ${formatCurrency(annualResult)}\n` +
        `- Point mort: ${breakEvenMonths === 0 ? 'Déjà atteint' : `${breakEvenMonths} mois`}\n` +
        `- Projection 3 ans (croissance ${growthRate}%, inflation ${inflationRate}%):\n` +
        projection.map((p) => `  Année ${p.year}: CA ${formatCurrency(p.revenue)}, Charges ${formatCurrency(p.expenses)}, Résultat ${formatCurrency(p.netResult)}, Marge ${p.margin}%`).join('\n') +
        (bpContext.budget ? `\n- Budget initial prévu: ${formatCurrency(bpContext.budget)}` : '') +
        (bpContext.caGoal ? `\n- Objectif CA: ${formatCurrency(bpContext.caGoal)}` : '')

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Tu es un expert financier en création d'entreprise. Analyse ce prévisionnel financier et donne en français des recommandations structurées:\n\n1. Points forts et points de vigilance\n2. Optimisations des charges possibles\n3. Analyse de la rentabilité\n4. Conseils pour améliorer la trésorerie\n5. Risques identifiés\n\nSois concis et actionnable.\n\n${summary}`,
            },
          ],
          context: { userName: 'Porteur de projet', userRole: 'USER' },
        }),
      })
      const data = await res.json()
      if (res.ok) setAiAnalysis(data.content)
      else setAiAnalysis("Erreur lors de l'analyse IA. Réessayez.")
    } catch {
      setAiAnalysis('Erreur de connexion au serveur IA.')
    } finally {
      setIsLoadingAI(false)
    }
  }

  // ── Manual save ─────────────────────────────────────────────
  const handleSave = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setIsSaving(true)
    try {
      await fetch('/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, revenue, expenses, growthRate, inflationRate, projection }),
      })
      setSavedMsg('Prévisionnel sauvegardé !')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch {
      // silent
    } finally {
      setIsSaving(false)
    }
  }

  // ── Loading state ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement du prévisionnel...</p>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6 max-w-5xl mx-auto">

      {/* ── Section 1: Revenue Inputs ─────────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Revenus estimés (mensuel)</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Saisissez votre chiffre d&apos;affaires prévisionnel</p>
                </div>
              </div>
              {bpContext.sector && (
                <Badge variant="secondary" className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                  {bpContext.sector}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { key: 'monthlyCA' as const, label: 'CA mensuel estimé', prefix: '€', suffix: '/mois' },
                { key: 'clients' as const, label: 'Nombre de clients', prefix: '', suffix: 'clients' },
                { key: 'avgBasket' as const, label: 'Panier moyen', prefix: '€', suffix: '/client' },
              ]).map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">{field.label}</Label>
                  <div className="relative">
                    {field.prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{field.prefix}</span>
                    )}
                    <Input
                      type="number"
                      min={0}
                      value={revenue[field.key]}
                      onChange={(e) => updateRevenue(field.key, parseFloat(e.target.value) || 0)}
                      className={`${field.prefix ? 'pl-7' : ''} rounded-xl h-10`}
                    />
                    {field.suffix && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{field.suffix}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-check validation */}
            {revenue.clients > 0 && revenue.avgBasket > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                  hasCrossCheckDiscrepancy
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {hasCrossCheckDiscrepancy ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>
                  {revenue.clients} clients × {formatCurrency(revenue.avgBasket)} = {formatCurrency(crossCheckCA)}
                  {hasCrossCheckDiscrepancy && (
                    <span className="ml-1 font-medium"> — Écart de {formatCurrency(Math.abs(crossCheckCA - revenue.monthlyCA))} avec le CA déclaré</span>
                  )}
                  {!hasCrossCheckDiscrepancy && (
                    <span className="ml-1 font-medium"> — Cohérent ✓</span>
                  )}
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 2: Expense Categories ─────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Charges mensuelles</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">7 catégories de dépenses récurrentes</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold">
                Total : {formatCurrency(totalMonthlyExpenses)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {EXPENSE_LABELS.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                  <field.icon className={`w-4 h-4 ${field.color}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 min-w-0">{field.label}</span>
                <div className="relative w-28 sm:w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                  <Input
                    type="number"
                    min={0}
                    value={expenses[field.key]}
                    onChange={(e) => updateExpenses(field.key, parseFloat(e.target.value) || 0)}
                    className="pl-7 pr-2 rounded-xl h-9 text-right text-sm"
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">/mois</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 3: Monthly Summary ────────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card
          className={`border-0 shadow-sm bg-gradient-to-br ${
            monthlyResult >= 0
              ? 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
              : 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
          }`}
        >
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CA mensuel</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(revenue.monthlyCA)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total charges</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalMonthlyExpenses)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Résultat mensuel</p>
                <div className="flex items-center justify-center gap-1">
                  {monthlyResult >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <p className={`text-lg font-bold ${monthlyResult >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {monthlyResult >= 0 ? '+' : ''}{formatCurrency(monthlyResult)}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Marge nette</p>
                <p className={`text-lg font-bold ${marginPercentage >= 20 ? 'text-emerald-600 dark:text-emerald-400' : marginPercentage >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                  {marginPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 4: 3-Year Projection ──────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Projection sur 3 ans</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Ajustez les taux de croissance et d&apos;inflation</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Croissance annuelle (A2, A3)</Label>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{growthRate}%</span>
                </div>
                <Slider
                  value={[growthRate]}
                  onValueChange={(v) => setGrowthRate(v[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Inflation annuelle (charges)</Label>
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{inflationRate}%</span>
                </div>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(v) => setInflationRate(v[0])}
                  min={0}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>0%</span>
                  <span>7.5%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>

            {/* Projection table */}
            <div className="overflow-x-auto -mx-4 px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Année</TableHead>
                    <TableHead className="text-xs text-right">CA annuel</TableHead>
                    <TableHead className="text-xs text-right">Charges</TableHead>
                    <TableHead className="text-xs text-right">Résultat</TableHead>
                    <TableHead className="text-xs text-right">Marge</TableHead>
                    <TableHead className="text-xs text-right">Cash-flow cumulé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projection.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium text-sm">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 text-xs font-bold text-violet-600 dark:text-violet-400">
                          A{row.year}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-red-500 dark:text-red-400">
                        {formatCurrency(row.expenses)}
                      </TableCell>
                      <TableCell className={`text-right text-sm font-bold ${row.netResult >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {row.netResult >= 0 ? '+' : ''}{formatCurrency(row.netResult)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium ${
                            row.margin >= 20
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : row.margin >= 0
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {row.margin}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right text-sm font-medium ${row.cumulativeCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(row.cumulativeCashFlow)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 5: AI Analysis ────────────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base">Analyse IA</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Recommandations intelligentes sur votre prévisionnel</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={handleAIAnalysis}
              disabled={isLoadingAI}
              className="w-full rounded-xl border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 h-11"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse IA en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyser le prévisionnel avec l&apos;IA
                </>
              )}
            </Button>

            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">Recommandations IA</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Section 6: Break-even Chart ───────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Point mort (Seuil de rentabilité)</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">Visualisation de l&apos;intersection revenus / charges</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs font-medium ${
                  breakEvenMonths === 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}
              >
                {breakEvenMonths === 0 ? 'Déjà rentable ✓' : `Point mort : M${breakEvenMonths}`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
              <BreakEvenChart
                fixedCosts={totalMonthlyExpenses}
                monthlyRevenue={revenue.monthlyCA}
                breakEvenMonths={breakEvenMonths}
              />
            </div>

            {/* Break-even KPIs */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Résultat annuel</p>
                <p className={`text-lg font-bold ${annualResult >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(annualResult)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Point mort</p>
                <p className={`text-lg font-bold ${breakEvenMonths === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {breakEvenMonths === 0 ? 'Atteint' : `${breakEvenMonths} mois`}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Cash-flow cumulé (3 ans)</p>
                <p className={`text-lg font-bold ${projection[2].cumulativeCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(projection[2].cumulativeCashFlow)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Save footer ───────────────────────────────────────── */}
      <motion.div variants={fadeIn} className="flex items-center justify-between pb-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="outline"
          className="rounded-xl border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Sauvegarder le prévisionnel
        </Button>
        {savedMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {savedMsg}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
