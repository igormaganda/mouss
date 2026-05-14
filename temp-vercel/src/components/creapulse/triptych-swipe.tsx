'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Trophy,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Undo2,
  Minus,
  X,
} from 'lucide-react'
import { useAppStore } from '@/hooks/use-store'

// ── Types ────────────────────────────────────────────────────────────
interface SwipeCard {
  id: string
  phase: number
  title: string
  description: string
  helpText: string
  emoji: string
  gradient: string
  tags: string[]
  isEssential: boolean
}

type SwipeDecision = 'yes' | 'no' | 'maybe'
type SwipeResult = Record<string, SwipeDecision>

interface SwipeHistoryEntry {
  cardId: string
  card: SwipeCard
  decision: SwipeDecision
  timestamp: number
}

interface PhaseState {
  cards: SwipeCard[]
  currentIndex: number
  results: SwipeResult
  completed: boolean
  history: SwipeHistoryEntry[]
}

interface PhaseMeta {
  key: string
  number: number
  title: string
  subtitle: string
  emoji: string
  accentFrom: string
  accentTo: string
}

interface SwipeSettings {
  swipe_mode: string
  swipe_phase_1_count: string
  swipe_phase_2_count: string
  swipe_phase_3_count: string
  swipe_allow_undo: string
  swipe_allow_maybe: string
}

const PHASE_META: PhaseMeta[] = [
  {
    key: 'pepites',
    number: 1,
    title: 'Pépites',
    subtitle: 'Vos qualités entrepreneuriales',
    emoji: '💎',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-500',
  },
  {
    key: 'appetences',
    number: 2,
    title: 'Appétences',
    subtitle: 'Vos centres d\'intérêt professionnels',
    emoji: '🎯',
    accentFrom: 'from-teal-500',
    accentTo: 'to-cyan-500',
  },
  {
    key: 'metiers',
    number: 3,
    title: 'Métiers',
    subtitle: 'Vos secteurs et professions cibles',
    emoji: '🚀',
    accentFrom: 'from-cyan-500',
    accentTo: 'to-emerald-500',
  },
]

// ── Component ────────────────────────────────────────────────────────
export default function TriptychSwipe() {
  const userId = useAppStore((s) => s.userId)

  const [activePhase, setActivePhase] = useState(0)
  const [phaseStates, setPhaseStates] = useState<PhaseState[]>([
    { cards: [], currentIndex: 0, results: {}, completed: false, history: [] },
    { cards: [], currentIndex: 0, results: {}, completed: false, history: [] },
    { cards: [], currentIndex: 0, results: {}, completed: false, history: [] },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [phaseTransitioning, setPhaseTransitioning] = useState(false)
  const [bilanData, setBilanData] = useState<{
    bilan: string
    kiviat: { dimension: string; value: number; maxValue: number }[]
    phaseSummaries: any[]
    totalYes: number
    totalAnswered: number
  } | null>(null)

  const [settings, setSettings] = useState<SwipeSettings>({
    swipe_mode: 'fixed_global',
    swipe_phase_1_count: '20',
    swipe_phase_2_count: '20',
    swipe_phase_3_count: '20',
    swipe_allow_undo: 'true',
    swipe_allow_maybe: 'true',
  })

  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const maybeOpacity = useTransform(y, [-80, 0], [1, 0])

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentPhaseMeta = PHASE_META[activePhase]
  const currentPhaseState = phaseStates[activePhase]
  const currentCard = currentPhaseState.cards[currentPhaseState.currentIndex]

  const totalCardsInSession = phaseStates.reduce((s, ps) => s + ps.cards.length, 0)
  const totalAnswered = phaseStates.reduce(
    (sum, ps) => sum + Object.keys(ps.results).length,
    0
  )

  // ── Load settings + cards on mount ────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        // Load settings
        const settingsRes = await fetch('/api/swipe-settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          if (data.settings) setSettings({ ...settings, ...data.settings })
        }

        // Load saved progress
        if (userId) {
          const progressRes = await fetch(`/api/swipe-phase?userId=${userId}`)
          if (progressRes.ok) {
            const data = await progressRes.json()
            if (data.phases && Array.isArray(data.phases) && data.phases.length > 0) {
              const restored = [...phaseStates]
              for (const savedPhase of data.phases) {
                const idx = savedPhase.phase - 1
                if (idx >= 0 && idx < 3) {
                  restored[idx] = {
                    ...restored[idx],
                    currentIndex: savedPhase.currentCard ?? 0,
                    results: (savedPhase.results as SwipeResult) ?? {},
                    completed: savedPhase.completed ?? false,
                  }
                }
              }
              setPhaseStates(restored)
              const firstIncomplete = restored.findIndex((p) => !p.completed)
              if (firstIncomplete >= 0) {
                setActivePhase(firstIncomplete)
              } else {
                setShowSummary(true)
              }
            }
          }
        }

        // Load cards for all 3 phases
        const cardsPromises = [1, 2, 3].map(async (phaseNum) => {
          const url = userId
            ? `/api/swipe-cards?phase=${phaseNum}&userId=${userId}`
            : `/api/swipe-cards?phase=${phaseNum}`
          const res = await fetch(url)
          if (!res.ok) return []
          const data = await res.json()
          return data.cards || []
        })

        const cardsResults = await Promise.all(cardsPromises)

        setPhaseStates((prev) => {
          const updated = [...prev]
          for (let i = 0; i < 3; i++) {
            updated[i] = {
              ...updated[i],
              cards: cardsResults[i],
            }
          }
          return updated
        })
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // ── Save progress helper ───────────────────────────────────────────
  const saveProgress = useCallback(
    (phaseIdx: number, state: PhaseState) => {
      if (!userId) return
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        fetch('/api/swipe-phase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            phase: phaseIdx + 1,
            currentCard: state.currentIndex,
            results: state.results,
            completed: state.completed,
          }),
        }).catch(() => { /* silent */ })
      }, 200)
    },
    [userId]
  )

  // ── Generate bilan when all phases complete ────────────────────────
  const generateBilan = useCallback(async () => {
    if (!userId || isGenerating) return
    setIsGenerating(true)
    try {
      const phaseResults = phaseStates.map((ps, i) => ({
        phase: i + 1,
        phaseKey: PHASE_META[i].key,
        results: ps.results,
      }))

      const res = await fetch('/api/triptych-bilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phaseResults }),
      })

      if (res.ok) {
        const data = await res.json()
        setBilanData(data)
      }
    } catch (err) {
      console.error('Bilan generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [userId, phaseStates, isGenerating])

  // ── Swipe handler ──────────────────────────────────────────────────
  const handleSwipe = useCallback(
    (decision: SwipeDecision) => {
      if (!currentCard || phaseTransitioning) return

      // Map decision to direction for animation
      if (decision === 'yes') setExitDirection('right')
      else if (decision === 'no') setExitDirection('left')
      else setExitDirection('up')

      const newResults = { ...currentPhaseState.results, [currentCard.id]: decision }
      const nextIndex = currentPhaseState.currentIndex + 1
      const isPhaseComplete = nextIndex >= currentPhaseState.cards.length

      const historyEntry: SwipeHistoryEntry = {
        cardId: currentCard.id,
        card: currentCard,
        decision,
        timestamp: Date.now(),
      }

      const newState: PhaseState = {
        ...currentPhaseState,
        currentIndex: isPhaseComplete ? currentPhaseState.cards.length - 1 : nextIndex,
        results: newResults,
        completed: isPhaseComplete,
        history: [...currentPhaseState.history, historyEntry],
      }

      setPhaseStates((prev) => {
        const updated = [...prev]
        updated[activePhase] = newState
        return updated
      })

      saveProgress(activePhase, newState)

      setTimeout(() => {
        setExitDirection(null)
        x.set(0)
        y.set(0)

        if (isPhaseComplete) {
          if (activePhase < 2) {
            setPhaseTransitioning(true)
            setTimeout(() => {
              setActivePhase((prev) => prev + 1)
              setPhaseTransitioning(false)
            }, 600)
          } else {
            setShowSummary(true)
            generateBilan()
          }
        }
      }, 300)
    },
    [
      currentCard,
      currentPhaseState,
      activePhase,
      phaseTransitioning,
      x,
      y,
      saveProgress,
      generateBilan,
    ]
  )

  // ── Undo last swipe ───────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (currentPhaseState.history.length === 0 || phaseTransitioning) return

    const history = [...currentPhaseState.history]
    const lastEntry = history.pop()!

    const newResults = { ...currentPhaseState.results }
    delete newResults[lastEntry.cardId]

    const newState: PhaseState = {
      ...currentPhaseState,
      currentIndex: currentPhaseState.cards.findIndex((c) => c.id === lastEntry.cardId),
      results: newResults,
      history,
      completed: false,
    }

    setPhaseStates((prev) => {
      const updated = [...prev]
      updated[activePhase] = newState
      return updated
    })

    saveProgress(activePhase, newState)
    setShowSummary(false)
  }, [currentPhaseState, activePhase, phaseTransitioning, saveProgress])

  // ── Drag end handler ───────────────────────────────────────────────
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const xThresh = 100
    const yThresh = 80

    if (info.offset.x > xThresh && Math.abs(info.offset.y) < yThresh) {
      handleSwipe('yes')
    } else if (info.offset.x < -xThresh && Math.abs(info.offset.y) < yThresh) {
      handleSwipe('no')
    } else if (info.offset.y < -yThresh && Math.abs(info.offset.x) < xThresh && settings.swipe_allow_maybe !== 'false') {
      handleSwipe('maybe')
    }
  }

  // ── Reset all phases ───────────────────────────────────────────────
  const resetAll = async () => {
    if (userId) {
      await fetch(`/api/swipe-phase?userId=${userId}`, { method: 'DELETE' }).catch(() => {})
    }
    setPhaseStates((prev) =>
      prev.map((ps) => ({ ...ps, currentIndex: 0, results: {}, completed: false, history: [] }))
    )
    setActivePhase(0)
    setShowSummary(false)
    setBilanData(null)
    setExitDirection(null)
    x.set(0)
    y.set(0)
  }

  // ── Get count for a phase ──────────────────────────────────────────
  const getPhaseDecisionCount = (phaseIdx: number, decision: SwipeDecision | 'all') =>
    decision === 'all'
      ? Object.values(phaseStates[phaseIdx].results).length
      : Object.values(phaseStates[phaseIdx].results).filter((v) => v === decision).length

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Chargement de votre progression...</p>
      </div>
    )
  }

  // ── Summary screen ─────────────────────────────────────────────────
  if (showSummary) {
    return (
      <div className="flex flex-col items-center py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Triptyque termine !</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Felicitations ! Vous avez explore vos qualites, vos appetences et vos metiers ideaux.
          </p>
        </motion.div>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-emerald-600 mb-6 bg-emerald-50 px-4 py-2 rounded-full"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Generation de votre bilan IA en cours...
          </motion.div>
        )}

        {/* Phase summaries */}
        <div className="w-full space-y-4 mb-6">
          {PHASE_META.map((phase, pIdx) => {
            const yesCount = getPhaseDecisionCount(pIdx, 'yes')
            const noCount = getPhaseDecisionCount(pIdx, 'no')
            const maybeCount = getPhaseDecisionCount(pIdx, 'maybe')
            const keptCards = phaseStates[pIdx].cards.filter(
              (c) => phaseStates[pIdx].results[c.id] === 'yes'
            )
            const maybeCards = phaseStates[pIdx].cards.filter(
              (c) => phaseStates[pIdx].results[c.id] === 'maybe'
            )

            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pIdx * 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${phase.accentFrom} ${phase.accentTo} px-5 py-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{phase.emoji}</span>
                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          Phase {phase.number} — {phase.title}
                        </h4>
                        <p className="text-white/80 text-xs">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {yesCount}
                      </span>
                      <span className="flex items-center gap-1 opacity-70">
                        <Minus className="w-3.5 h-3.5" />
                        {maybeCount}
                      </span>
                      <span className="flex items-center gap-1 opacity-80">
                        <XCircle className="w-3.5 h-3.5" />
                        {noCount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {keptCards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {keptCards.map((card) => (
                        <span
                          key={card.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100"
                        >
                          <span>{card.emoji}</span>
                          {card.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {maybeCards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {maybeCards.map((card) => (
                        <span
                          key={card.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100"
                        >
                          <span>{card.emoji}</span>
                          {card.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {keptCards.length === 0 && maybeCards.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">Aucune carte selectionnee</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Overall stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 w-full text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">Resume global</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600 mb-1">
            {phaseStates.reduce((s, p) => s + Object.values(p.results).filter((v) => v === 'yes').length, 0)}
            <span className="text-base font-normal text-gray-500"> / {totalCardsInSession} cartes gardees</span>
          </p>
          <p className="text-xs text-gray-500">
            {totalAnswered} cartes traitees au total
          </p>
        </motion.div>

        {/* AI Bilan */}
        {bilanData?.bilan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/80" />
                <h4 className="text-white font-semibold text-sm">Bilan Entrepreneurial IA</h4>
              </div>
            </div>
            <div className="p-5">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {bilanData.bilan}
              </div>
            </div>
          </motion.div>
        )}

        <Button onClick={resetAll} variant="outline" className="rounded-full px-6">
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer le triptyque
        </Button>
      </div>
    )
  }

  // ── Info modal ─────────────────────────────────────────────────────
  const InfoModal = () => {
    if (!showInfo || !currentCard) return null
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={() => setShowInfo(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
        >
          <div className={`bg-gradient-to-br ${currentCard.gradient} p-6 text-center`}>
            <span className="text-5xl mb-3 block">{currentCard.emoji}</span>
            <h3 className="text-xl font-bold text-white">{currentCard.title}</h3>
            {currentCard.isEssential && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                <Sparkles className="w-3 h-3" /> Carte essentielle
              </span>
            )}
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-3">{currentCard.description}</p>
            {currentCard.helpText ? (
              <div className="bg-emerald-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{currentCard.helpText}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic mb-3">Aucune information supplementaire disponible.</p>
            )}
            {currentCard.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {currentCard.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="px-5 pb-5">
            <Button
              onClick={() => setShowInfo(false)}
              className="w-full rounded-xl"
            >
              Compris
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // ── Main swipe interface ───────────────────────────────────────────
  const phaseProgress =
    currentPhaseState.cards.length > 0
      ? (Object.keys(currentPhaseState.results).length / currentPhaseState.cards.length) * 100
      : 0
  const overallProgress =
    totalCardsInSession > 0 ? (totalAnswered / totalCardsInSession) * 100 : 0

  const canUndo =
    settings.swipe_allow_undo !== 'false' && currentPhaseState.history.length > 0

  const allowMaybe = settings.swipe_allow_maybe !== 'false'

  return (
    <div className="flex flex-col items-center">
      {/* ── Phase indicator pills ────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        {PHASE_META.map((phase, idx) => (
          <button
            key={phase.key}
            onClick={() => {
              if (phaseStates[idx].completed || idx < activePhase) {
                setPhaseTransitioning(true)
                setTimeout(() => {
                  setActivePhase(idx)
                  setPhaseTransitioning(false)
                }, 300)
              }
            }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
              ${idx === activePhase
                ? `bg-gradient-to-r ${phase.accentFrom} ${phase.accentTo} text-white shadow-md`
                : phaseStates[idx].completed
                  ? 'bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-400 cursor-default'
              }
            `}
          >
            <span>{phaseStates[idx].completed ? '✅' : phase.emoji}</span>
            <span className="hidden sm:inline">{phase.title}</span>
            <span className="sm:hidden">P{phase.number}</span>
          </button>
        ))}
      </div>

      {/* ── Current phase title ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!phaseTransitioning && (
          <motion.div
            key={currentPhaseMeta.key}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-5"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{currentPhaseMeta.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Phase {currentPhaseMeta.number} — {currentPhaseMeta.title}
                </h3>
                <p className="text-xs text-gray-500">{currentPhaseMeta.subtitle}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress bars ───────────────────────────────────────────── */}
      <div className="w-full max-w-sm space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progression globale</span>
          <span className="font-medium text-gray-600">{totalAnswered} / {totalCardsInSession}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{currentPhaseMeta.title}</span>
          <span className="font-medium text-gray-600">
            {Object.keys(currentPhaseState.results).length} / {currentPhaseState.cards.length}
          </span>
        </div>
        <Progress value={phaseProgress} className="h-2" />
      </div>

      {/* ── Card stack ──────────────────────────────────────────────── */}
      <div className="relative w-full max-w-sm h-[360px]">
        <AnimatePresence mode="popLayout">
          {currentCard && !phaseTransitioning && (
            <motion.div
              key={`${currentPhaseMeta.key}-${currentCard.id}`}
              drag={allowMaybe ? true : 'x'}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              style={{ x, y, rotate, touchAction: 'none' }}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{
                scale: exitDirection ? (exitDirection === 'right' ? 1.1 : 0.9) : 1,
                opacity: exitDirection ? 0 : 1,
                x: exitDirection
                  ? exitDirection === 'right'
                    ? 300
                    : exitDirection === 'up'
                      ? 0
                      : -300
                  : 0,
                y: exitDirection === 'up' ? -300 : 0,
                rotate: exitDirection
                  ? exitDirection === 'right'
                    ? 20
                    : exitDirection === 'up'
                      ? 0
                      : -20
                  : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              className="swipe-card absolute inset-0 rounded-2xl shadow-lg border border-white/50 overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div
                className={`h-full bg-gradient-to-br ${currentCard.gradient} p-6 flex flex-col justify-between relative`}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white" />
                </div>

                {/* Info button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfo(true)
                  }}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                </button>

                {/* Like overlay */}
                <motion.div
                  style={{ opacity: likeOpacity }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-bold text-lg rotate-3 border-2 border-emerald-600 shadow-lg z-10"
                >
                  GARDER ✓
                </motion.div>

                {/* Nope overlay */}
                <motion.div
                  style={{ opacity: nopeOpacity }}
                  className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-lg -rotate-12 border-2 border-red-600 shadow-lg z-10"
                >
                  PASSER ✗
                </motion.div>

                {/* Maybe overlay */}
                {allowMaybe && (
                  <motion.div
                    style={{ opacity: maybeOpacity }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1.5 rounded-lg font-bold text-lg border-2 border-amber-600 shadow-lg z-10"
                  >
                    INDECIS ~
                  </motion.div>
                )}

                {/* Card content */}
                <div className="flex-1 flex flex-col items-center justify-center text-white relative z-0 pt-8">
                  <span className="text-6xl mb-4 drop-shadow-lg">{currentCard.emoji}</span>
                  <h3 className="text-xl font-bold mb-2 drop-shadow-sm">
                    {currentCard.title}
                  </h3>
                  <p className="text-white/90 text-sm text-center leading-relaxed max-w-xs drop-shadow-sm">
                    {currentCard.description}
                  </p>
                  {currentCard.isEssential && (
                    <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white/90 text-[10px] rounded-full">
                      <Sparkles className="w-3 h-3" /> Essentielle
                    </span>
                  )}
                </div>

                {/* Hint */}
                <p className="text-center text-white/60 text-xs relative z-0">
                  Glissez → garder · ← passer{allowMaybe ? ' · ↑ indécis' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase transition overlay */}
        <AnimatePresence>
          {phaseTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Sparkles className="w-10 h-10 mb-3 text-white/80" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-semibold text-lg"
              >
                Phase suivante...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-white/80 text-sm mt-1"
              >
                {activePhase < 2
                  ? `${PHASE_META[activePhase + 1].emoji} ${PHASE_META[activePhase + 1].title}`
                  : 'Synthese en preparation...'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action buttons ──────────────────────────────────────────── */}
      {!phaseTransitioning && currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mt-6"
        >
          {/* Undo button */}
          {canUndo && (
            <Button
              onClick={handleUndo}
              variant="outline"
              size="lg"
              className="rounded-full w-11 h-11 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all active:scale-95"
              title="Annuler le dernier choix"
            >
              <Undo2 className="w-4 h-4 text-gray-500" />
            </Button>
          )}

          {/* Pass button */}
          <Button
            onClick={() => handleSwipe('no')}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all active:scale-95"
          >
            <ThumbsDown className="w-5 h-5 text-red-500" />
          </Button>

          {/* Maybe button */}
          {allowMaybe && (
            <Button
              onClick={() => handleSwipe('maybe')}
              variant="outline"
              size="lg"
              className="rounded-full w-11 h-11 p-0 border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-sm transition-all active:scale-95"
              title="Je ne sais pas"
            >
              <Minus className="w-4 h-4 text-amber-500" />
            </Button>
          )}

          {/* Keep button */}
          <Button
            onClick={() => handleSwipe('yes')}
            size="lg"
            className="rounded-full w-14 h-14 p-0 bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
          >
            <ThumbsUp className="w-5 h-5 text-white" />
          </Button>

          {/* Info button (mobile) */}
          <Button
            onClick={() => setShowInfo(true)}
            variant="outline"
            size="lg"
            className="rounded-full w-11 h-11 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all active:scale-95"
            title="Informations sur cette carte"
          >
            <HelpCircle className="w-4 h-4 text-gray-500" />
          </Button>
        </motion.div>
      )}

      {/* ── Phase navigation ────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mt-6">
        <span className="text-xs text-gray-400">
          {Object.keys(currentPhaseState.results).length} carte{Object.keys(currentPhaseState.results).length !== 1 ? 's' : ''} traitee{Object.keys(currentPhaseState.results).length !== 1 ? 's' : ''}
        </span>
        {activePhase < 2 && phaseStates[activePhase].completed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPhaseTransitioning(true)
              setTimeout(() => {
                setActivePhase((prev) => prev + 1)
                setPhaseTransitioning(false)
              }, 400)
            }}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs rounded-full px-3"
          >
            Phase suivante
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>

      {/* ── Completed phase badges ───────────────────────────────────── */}
      {activePhase < 2 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
          {PHASE_META.map((phase, idx) => {
            if (idx === activePhase) return null
            const yesCount = getPhaseDecisionCount(idx, 'yes')
            if (!phaseStates[idx].completed) return null
            return (
              <span
                key={phase.key}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-medium"
              >
                {phase.emoji} {phase.title} : {yesCount}✓
              </span>
            )
          })}
        </div>
      )}

      {/* Info modal */}
      <AnimatePresence>
        {showInfo && <InfoModal />}
      </AnimatePresence>
    </div>
  )
}
