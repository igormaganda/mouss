'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Snowflake,
  Sun,
  Sparkles,
  Megaphone,
  CreditCard,
  MapPin,
  ArrowUpRight,
  BarChart3,
  Mail,
  MousePointerClick,
  Euro,
  Zap,
  Crown,
  ShieldCheck,
  Target,
  ChevronRight,
  ThumbsUp,
  Award,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface Suggestion {
  type: string
  message: string
  plan?: string
  discount?: number
  currentAds?: number
  suggestedAds?: number
  wedgeId?: string
}

interface Stats {
  totalAdsPurchased: number
  avgOpenRate: number
  avgClickRate: number
  totalSpent: number
  bestPerformingSector: string
}

export interface UpsellPanelProps {
  score?: number
  level?: 'COLD' | 'WARM' | 'HOT'
  suggestions?: Suggestion[]
  stats?: Stats
  onAction?: (type: string, data?: unknown) => void
}

// ============================================
// HELPERS
// ============================================

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getLevelConfig(level?: string) {
  switch (level) {
    case 'HOT':
      return {
        label: 'Chaud',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        badgeBg: 'bg-red-500',
        badgeText: 'text-white',
        progressColor: 'bg-gradient-to-r from-orange-500 to-red-500',
        icon: Flame,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        glowClass: 'shadow-red-200/50',
        description: 'Client très engagé, prêt pour la montée en gamme',
      }
    case 'WARM':
      return {
        label: 'Tiède',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        badgeBg: 'bg-orange-500',
        badgeText: 'text-white',
        progressColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        icon: Sun,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        glowClass: 'shadow-orange-200/50',
        description: 'Client actif, des opportunités de vente additionnelle',
      }
    case 'COLD':
    default:
      return {
        label: 'Froid',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badgeBg: 'bg-blue-500',
        badgeText: 'text-white',
        progressColor: 'bg-gradient-to-r from-blue-400 to-blue-500',
        icon: Snowflake,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        glowClass: 'shadow-blue-200/50',
        description: 'Nouveau client, besoin de nurturing',
      }
  }
}

function getSuggestionConfig(type: string) {
  switch (type) {
    case 'upgrade_plan':
      return {
        icon: Crown,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        ctaLabel: 'Changer de plan',
        accentBorder: 'border-l-purple-400',
      }
    case 'buy_more_ads':
      return {
        icon: Megaphone,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        ctaLabel: 'Ajouter des annonces',
        accentBorder: 'border-l-amber-400',
      }
    case 'new_wedge':
      return {
        icon: MapPin,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        ctaLabel: 'Découvrir',
        accentBorder: 'border-l-emerald-400',
      }
    case 'subscribe':
      return {
        icon: ShieldCheck,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        ctaLabel: "S'abonner",
        accentBorder: 'border-l-blue-400',
      }
    default:
      return {
        icon: Sparkles,
        iconBg: 'bg-slate-50',
        iconColor: 'text-slate-600',
        ctaLabel: 'En savoir plus',
        accentBorder: 'border-l-slate-400',
      }
  }
}

// ============================================
// SCORE GAUGE
// ============================================

function ScoreGauge({ score, level }: { score: number; level?: string }) {
  const config = getLevelConfig(level)
  const LevelIcon = config.icon
  const normalizedScore = Math.min(100, Math.max(0, score))

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular gauge visualization */}
      <div className="relative">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - normalizedScore / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {level === 'HOT' && (
                <>
                  <stop offset="0%" stopColor="rgb(249, 115, 22)" />
                  <stop offset="100%" stopColor="rgb(239, 68, 68)" />
                </>
              )}
              {level === 'WARM' && (
                <>
                  <stop offset="0%" stopColor="rgb(250, 204, 21)" />
                  <stop offset="100%" stopColor="rgb(249, 115, 22)" />
                </>
              )}
              {(!level || level === 'COLD') && (
                <>
                  <stop offset="0%" stopColor="rgb(96, 165, 250)" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'oklch(0.63 0.17 250)' }}>
            {normalizedScore}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
        </div>
      </div>

      {/* Level badge */}
      <div className="flex items-center gap-2">
        <Badge className={`${config.badgeBg} ${config.badgeText} px-3 py-1 text-sm font-semibold`}>
          <LevelIcon className="h-3.5 w-3.5 mr-1" />
          {config.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        {config.description}
      </p>
    </div>
  )
}

// ============================================
// SUGGESTION CARD
// ============================================

function SuggestionCard({
  suggestion,
  onAction,
}: {
  suggestion: Suggestion
  onAction?: (type: string, data?: unknown) => void
}) {
  const config = getSuggestionConfig(suggestion.type)
  const SuggestionIcon = config.icon

  return (
    <div className={`rounded-lg border-l-4 ${config.accentBorder} border bg-white p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
          <SuggestionIcon className={`h-4.5 w-4.5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 leading-snug">
            {suggestion.message}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {suggestion.discount && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                -{suggestion.discount}% de réduction
              </Badge>
            )}
            {suggestion.currentAds && suggestion.suggestedAds && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                {suggestion.currentAds} → {suggestion.suggestedAds} annonces
              </Badge>
            )}
            {suggestion.plan && (
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                Plan {suggestion.plan.charAt(0) + suggestion.plan.slice(1).toLowerCase()}
              </Badge>
            )}
          </div>
          {onAction && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 px-3 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 -ml-2"
              onClick={() => onAction(suggestion.type, suggestion)}
            >
              {config.ctaLabel}
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function UpsellPanel({
  score = 0,
  level = 'COLD',
  suggestions = [],
  stats,
  onAction,
}: UpsellPanelProps) {
  const config = getLevelConfig(level)

  const safeStats: Stats = {
    totalAdsPurchased: stats?.totalAdsPurchased ?? 0,
    avgOpenRate: stats?.avgOpenRate ?? 0,
    avgClickRate: stats?.avgClickRate ?? 0,
    totalSpent: stats?.totalSpent ?? 0,
    bestPerformingSector: stats?.bestPerformingSector ?? '-',
  }

  return (
    <div className="space-y-6">
      {/* Score Section */}
      <Card className={`shadow-sm ${config.glowClass}`}>
        <CardContent className="p-6">
          <ScoreGauge score={score} level={level} />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              Vos performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border">
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Annonces achetées</span>
                </div>
                <p className="text-lg font-bold">{safeStats.totalAdsPurchased}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border">
                <div className="flex items-center gap-2 mb-1">
                  <Euro className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Total dépensé</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(safeStats.totalSpent)}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Taux d&apos;ouverture</span>
                </div>
                <p className="text-lg font-bold">{safeStats.avgOpenRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">Taux de clic</span>
                </div>
                <p className="text-lg font-bold">{safeStats.avgClickRate}%</p>
              </div>
            </div>
            {safeStats.bestPerformingSector && safeStats.bestPerformingSector !== '-' && (
              <div className="mt-3 p-3 rounded-lg border bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-xs text-muted-foreground">Meilleur secteur :</span>
                  <span className="text-xs font-semibold text-amber-700">{safeStats.bestPerformingSector}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Recommandations
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Suggestions personnalisées pour votre compte
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {suggestions.length} offre{suggestions.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={`${suggestion.type}-${index}`}
                  suggestion={suggestion}
                  onAction={onAction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {suggestions.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Aucune recommandation disponible
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
              Explorez nos wedges et créez des annonces pour débloquer des suggestions personnalisées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
