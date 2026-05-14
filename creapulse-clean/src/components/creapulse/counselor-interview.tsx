'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  Timer,
  Sparkles,
  Loader2,
  Plus,
  Pin,
  Check,
  X,
  Send,
  Bot,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Tag,
  Star,
  XCircle,
  RotateCcw,
} from 'lucide-react'

// ====================== TYPES ======================
type InterviewType = 'PREMIER' | 'SUIVI' | 'BP_REVIEW' | 'GO_NO_GO'
type InterviewStatus = 'PLANNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED'
type NoteCategory = 'Observation' | 'Question' | 'Point clé' | 'Action' | 'Force' | 'Inquiétude' | 'Décision'

interface InterviewNote {
  id: string
  category: NoteCategory
  phase: string
  content: string
  isPinned: boolean
  isActionItem: boolean
  isDone: boolean
  createdAt: string
}

interface PhaseChecklist {
  key: string
  title: string
  items: string[]
}

// ====================== CONSTANTS ======================
const INTERVIEW_TYPE_CONFIG: Record<InterviewType, { label: string; color: string; bg: string }> = {
  PREMIER: { label: 'Premier contact', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  SUIVI: { label: 'Suivi', color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' },
  BP_REVIEW: { label: 'Revue BP', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  GO_NO_GO: { label: 'Go/No-Go', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' },
}

const STATUS_CONFIG: Record<InterviewStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }> = {
  PLANNED: { label: 'Planifié', variant: 'outline', className: 'text-gray-500 border-gray-300' },
  IN_PROGRESS: { label: 'En cours', variant: 'default', className: 'bg-emerald-500 text-white' },
  PAUSED: { label: 'En pause', variant: 'secondary', className: 'bg-amber-100 text-amber-700' },
  COMPLETED: { label: 'Terminé', variant: 'default', className: 'bg-violet-500 text-white' },
}

const PHASES: PhaseChecklist[] = [
  {
    key: 'accueil',
    title: 'Accueil',
    items: [
      'Accueil et mise en confiance du porteur',
      'Présentation du déroulé de l\'entretien',
      'Recueil du parcours personnel et professionnel',
      'Vérification des prérequis administratifs',
      'Premières impressions et questions ouvertes',
    ],
  },
  {
    key: 'diagnostic',
    title: 'Diagnostic',
    items: [
      'Présentation et analyse du projet entrepreneurial',
      'Identification des compétences clés (Kiviat)',
      'Discussion sur le profil RIASEC',
      'Analyse des forces et axes d\'amélioration',
      'Évaluation des motivations entrepreneuriales',
    ],
  },
  {
    key: 'synthese',
    title: 'Synthèse',
    items: [
      'Synthèse des résultats de l\'entretien',
      'Points de vigilance identifiés',
      'Co-construction du plan d\'actions',
      'Identification des prochaines étapes',
      'Planification du prochain entretien',
    ],
  },
]

const NOTE_CATEGORIES: NoteCategory[] = ['Observation', 'Question', 'Point clé', 'Action', 'Force', 'Inquiétude', 'Décision']

const CATEGORY_COLORS: Record<NoteCategory, { bg: string; text: string; icon: string }> = {
  'Observation': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: '👁️' },
  'Question': { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', icon: '❓' },
  'Point clé': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: '🔑' },
  'Action': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: '⚡' },
  'Force': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: '💪' },
  'Inquiétude': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: '⚠️' },
  'Décision': { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', icon: '✅' },
}

// ====================== HELPERS ======================
function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function getTimerColor(remaining: number, total: number): string {
  const ratio = remaining / total
  if (ratio > 0.5) return 'text-emerald-500'
  if (ratio > 0.25) return 'text-amber-500'
  return 'text-red-500'
}

function getTimerStroke(remaining: number, total: number): string {
  const ratio = remaining / total
  if (ratio > 0.5) return '#10b981'
  if (ratio > 0.25) return '#f59e0b'
  return '#ef4444'
}

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

// ====================== COMPONENT ======================
export default function CounselorInterview({
  interviewType = 'PREMIER',
  porteurId,
  porteurName,
}: {
  interviewType?: InterviewType
  porteurId?: string
  porteurName?: string
}) {
  const userId = useAppStore((s) => s.userId)
  const setCounselorTab = useAppStore((s) => s.setCounselorTab)

  // Timer state
  const [status, setStatus] = useState<InterviewStatus>('PLANNED')
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [defaultDuration, setDefaultDuration] = useState(60)
  const [totalRemaining, setTotalRemaining] = useState(60 * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Phase state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [checklistState, setChecklistState] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {}
    PHASES.forEach((phase) => {
      initial[phase.key] = phase.items.map(() => false)
    })
    return initial
  })

  // Notes state
  const [notes, setNotes] = useState<InterviewNote[]>([])
  const [noteContent, setNoteContent] = useState('')
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('Observation')
  const [notePhase, setNotePhase] = useState(PHASES[0].key)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [filterCategory, setFilterCategory] = useState<NoteCategory | 'ALL'>('ALL')
  const [filterPhase, setFilterPhase] = useState<string>('ALL')

  // AI panel state
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingAi, setIsLoadingAi] = useState(false)

  // Circular timer
  const circumference = 2 * Math.PI * 54
  const totalDurationSeconds = defaultDuration * 60
  const timerProgress = totalDurationSeconds > 0 ? ((totalDurationSeconds - totalRemaining) / totalDurationSeconds) * 100 : 0
  const phaseStrokeDashoffset = circumference - (timerProgress / 100) * circumference
  const currentPhase = PHASES[currentPhaseIndex]
  const typeConfig = INTERVIEW_TYPE_CONFIG[interviewType]
  const statusConfig = STATUS_CONFIG[status]
  const checkedCount = checklistState[currentPhase.key]?.filter(Boolean).length || 0

  // Timer logic
  useEffect(() => {
    if (status === 'IN_PROGRESS') {
      intervalRef.current = setInterval(() => {
        setTotalElapsed((prev) => prev + 1)
        setTotalRemaining((prev) => {
          if (prev <= 1) {
            setStatus('COMPLETED')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status])

  // Auto-set note phase when phase tab changes
  useEffect(() => {
    setNotePhase(currentPhase.key)
  }, [currentPhase.key])

  const handleStart = useCallback(() => setStatus('IN_PROGRESS'), [])
  const handlePause = useCallback(() => setStatus('PAUSED'), [])
  const handleResume = useCallback(() => setStatus('IN_PROGRESS'), [])
  const handleCancel = useCallback(() => setStatus('PLANNED'), [])

  const handleComplete = useCallback(async () => {
    setStatus('COMPLETED')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleReset = useCallback(() => {
    setStatus('PLANNED')
    setTotalElapsed(0)
    setTotalRemaining(defaultDuration * 60)
    setChecklistState(() => {
      const initial: Record<string, boolean[]> = {}
      PHASES.forEach((phase) => {
        initial[phase.key] = phase.items.map(() => false)
      })
      return initial
    })
  }, [defaultDuration])

  const toggleChecklistItem = (phaseKey: string, itemIndex: number) => {
    setChecklistState((prev) => ({
      ...prev,
      [phaseKey]: prev[phaseKey].map((checked, i) => (i === itemIndex ? !checked : checked)),
    }))
  }

  const addNote = useCallback(() => {
    if (!noteContent.trim()) return
    setIsAddingNote(true)
    const newNote: InterviewNote = {
      id: `note-${Date.now()}`,
      category: noteCategory,
      phase: notePhase,
      content: noteContent.trim(),
      isPinned: false,
      isActionItem: noteCategory === 'Action',
      isDone: false,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setNoteContent('')
    setIsAddingNote(false)
  }, [noteContent, noteCategory, notePhase])

  const togglePin = useCallback((noteId: string) => {
    setNotes((prev) => prev.map((n) => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
  }, [])

  const toggleActionItem = useCallback((noteId: string) => {
    setNotes((prev) => prev.map((n) => n.id === noteId ? { ...n, isActionItem: !n.isActionItem } : n))
  }, [])

  const toggleDone = useCallback((noteId: string) => {
    setNotes((prev) => prev.map((n) => n.id === noteId ? { ...n, isDone: !n.isDone } : n))
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }, [])

  const fetchAiSuggestions = useCallback(async () => {
    setIsLoadingAi(true)
    setAiPanelOpen(true)
    try {
      const res = await fetch('/api/counselor/ai-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counselorId: userId,
          userId: porteurId,
          context: 'entretien',
          interviewType,
          phase: currentPhase.key,
          notes: notes.filter((n) => !n.isDone).map((n) => n.content),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [data.content || 'Aucune suggestion disponible.'])
      } else {
        setAiSuggestions(['Suggestions non disponibles pour le moment.'])
      }
    } catch {
      setAiSuggestions(['Erreur de connexion. Veuillez réessayer.'])
    } finally {
      setIsLoadingAi(false)
    }
  }, [userId, porteurId, interviewType, currentPhase.key, notes])

  const handleBack = useCallback(() => {
    setCounselorTab('fiche-porteur')
  }, [setCounselorTab])

  // Filter notes
  const filteredNotes = useMemo(() => {
    let filtered = [...notes]
    if (filterCategory !== 'ALL') filtered = filtered.filter((n) => n.category === filterCategory)
    if (filterPhase !== 'ALL') filtered = filtered.filter((n) => n.phase === filterPhase)
    // Pinned first
    filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    return filtered
  }, [notes, filterCategory, filterPhase])

  // ====================== RENDER ======================
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Back + Type */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Entretien</h3>
                    <Badge className={`text-xs px-2.5 py-0.5 border ${typeConfig.bg} ${typeConfig.color}`}>
                      {typeConfig.label}
                    </Badge>
                    <Badge variant={statusConfig.variant} className={`text-xs px-2.5 py-0.5 ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  {porteurName && (
                    <p className="text-xs text-gray-500 mt-0.5">Porteur : {porteurName}</p>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-4 sm:ml-auto">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke={getTimerStroke(totalRemaining, totalDurationSeconds)}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={phaseStrokeDashoffset}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-lg font-bold ${getTimerColor(totalRemaining, totalDurationSeconds)}`}>
                      {formatTime(totalRemaining)}
                    </span>
                    <span className="text-[10px] text-gray-400">restant</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-1.5">
                  {status === 'PLANNED' && (
                    <Button size="sm" onClick={handleStart} className="rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                      <Play className="w-3.5 h-3.5" />Démarrer
                    </Button>
                  )}
                  {status === 'IN_PROGRESS' && (
                    <>
                      <Button size="sm" onClick={handlePause} variant="outline" className="rounded-xl gap-1.5 border-amber-300 text-amber-700 text-xs">
                        <Pause className="w-3.5 h-3.5" />Pause
                      </Button>
                      <Button size="sm" onClick={handleComplete} variant="outline" className="rounded-xl gap-1.5 border-violet-300 text-violet-700 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />Terminer
                      </Button>
                    </>
                  )}
                  {status === 'PAUSED' && (
                    <>
                      <Button size="sm" onClick={handleResume} className="rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        <Play className="w-3.5 h-3.5" />Reprendre
                      </Button>
                      <Button size="sm" onClick={handleReset} variant="outline" className="rounded-xl gap-1.5 text-xs">
                        <RotateCcw className="w-3.5 h-3.5" />Réinitialiser
                      </Button>
                    </>
                  )}
                  {status === 'COMPLETED' && (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">Entretien terminé</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Durée : {formatTime(totalElapsed)}</p>
                      <Button size="sm" onClick={handleReset} variant="outline" className="rounded-xl gap-1.5 text-xs">
                        <RotateCcw className="w-3.5 h-3.5" />Nouvel entretien
                      </Button>
                    </>
                  )}
                  {status !== 'COMPLETED' && status !== 'PLANNED' && (
                    <Button size="sm" onClick={handleCancel} variant="ghost" className="rounded-xl gap-1.5 text-gray-400 text-[10px]">
                      <XCircle className="w-3 h-3" />Annuler
                    </Button>
                  )}
                </div>

                {/* Elapsed time */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">Écoulé</p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">{formatTime(totalElapsed)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main content: Phase tabs + Notes + AI sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Phase Checklist & Notes */}
        <motion.div variants={fadeIn} className="lg:col-span-8 space-y-4">
          {/* Phase Tabs */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-4">
                {PHASES.map((phase, i) => (
                  <button
                    key={phase.key}
                    onClick={() => setCurrentPhaseIndex(i)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                      i === currentPhaseIndex
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {phase.title}
                    <span className="block text-[10px] mt-0.5 opacity-60">
                      {checklistState[phase.key]?.filter(Boolean).length || 0}/{phase.items.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Phase {currentPhaseIndex + 1} : {currentPhase.title}</span>
                  <span>{checkedCount}/{currentPhase.items.length}</span>
                </div>
                <Progress
                  value={currentPhase.items.length > 0 ? (checkedCount / currentPhase.items.length) * 100 : 0}
                  className="h-1.5 [&>div]:bg-emerald-500"
                />
              </div>

              {/* Checklist */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {currentPhase.items.map((item, i) => {
                    const isChecked = checklistState[currentPhase.key]?.[i] || false
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => toggleChecklistItem(currentPhase.key, i)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-transparent'
                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className={`text-sm ${isChecked ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                          {item}
                        </span>
                      </motion.button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  Notes d&apos;entretien
                  <Badge variant="secondary" className="text-[10px]">{notes.length}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as NoteCategory | 'ALL')}
                    className="text-[10px] border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                  >
                    <option value="ALL">Toutes catégories</option>
                    {NOTE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="text-[10px] border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                  >
                    <option value="ALL">Toutes phases</option>
                    {PHASES.map((p) => (
                      <option key={p.key} value={p.key}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note form */}
              <div className="space-y-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-wrap gap-2">
                  {NOTE_CATEGORIES.map((cat) => {
                    const colors = CATEGORY_COLORS[cat]
                    return (
                      <button
                        key={cat}
                        onClick={() => setNoteCategory(cat)}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                          noteCategory === cat
                            ? `${colors.bg} ${colors.text} border-current`
                            : 'border-gray-200 dark:border-gray-700 text-gray-400'
                        }`}
                      >
                        {colors.icon} {cat}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Tag className="w-3 h-3" />
                  Phase : <span className="font-medium text-gray-600 dark:text-gray-300">{PHASES.find((p) => p.key === notePhase)?.title}</span>
                </div>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Ajouter une note d'entretien..."
                  className="min-h-[60px] rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote()
                  }}
                />
                <div className="flex items-center justify-end">
                  <Button size="sm" onClick={addNote} disabled={!noteContent.trim() || isAddingNote} className="rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    {isAddingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Notes list */}
              <ScrollArea className="max-h-80">
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredNotes.map((note) => {
                      const catColors = CATEGORY_COLORS[note.category]
                      return (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className={`p-3 rounded-xl border transition-all ${catColors.bg} border-transparent`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">{catColors.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <Badge variant="secondary" className={`text-[10px] ${catColors.text}`}>{note.category}</Badge>
                                <span className="text-[10px] text-gray-400">{PHASES.find((p) => p.key === note.phase)?.title}</span>
                                {note.isPinned && <Pin className="w-3 h-3 text-amber-500" />}
                                {note.isActionItem && (
                                  <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-600">Action</Badge>
                                )}
                              </div>
                              <p className={`text-sm ${note.isDone ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {note.content}
                              </p>
                              <div className="flex items-center gap-1 mt-1.5">
                                <button onClick={() => togglePin(note.id)} className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-amber-500">
                                  <Pin className="w-3 h-3" />
                                </button>
                                <button onClick={() => toggleActionItem(note.id)} className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-amber-500" title="Marquer comme action">
                                  <Star className="w-3 h-3" />
                                </button>
                                <button onClick={() => toggleDone(note.id)} className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-emerald-500" title="Marquer comme fait">
                                  <Check className="w-3 h-3" />
                                </button>
                                <button onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-red-500 ml-auto">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  {filteredNotes.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune note</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Sidebar */}
        <motion.div variants={fadeIn} className="lg:col-span-4 space-y-4">
          {/* AI Toggle Button */}
          <Button
            variant="outline"
            onClick={() => aiPanelOpen ? setAiPanelOpen(false) : fetchAiSuggestions()}
            className={`w-full rounded-xl gap-2 text-xs ${
              aiPanelOpen
                ? 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400'
                : 'border-violet-200 text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400'
            }`}
          >
            {isLoadingAi ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {aiPanelOpen ? 'Masquer les suggestions IA' : 'Suggestions IA'}
            {aiPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>

          {/* AI Suggestions Panel */}
          <AnimatePresence>
            {aiPanelOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      Suggestions contextuelles
                    </CardTitle>
                    <p className="text-[10px] text-gray-400">Basées sur le profil de {porteurName || 'ce porteur'} et la phase actuelle</p>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAi ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="flex items-center gap-2 text-sm text-violet-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyse en cours...
                        </div>
                      </div>
                    ) : aiSuggestions.length > 0 ? (
                      <div className="space-y-3">
                        {aiSuggestions.map((suggestion, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800"
                          >
                            <div className="flex items-start gap-2">
                              <Bot className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{suggestion}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">Cliquez sur &laquo; Suggestions IA &raquo; pour générer</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interview Summary Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Timer className="w-4 h-4 text-emerald-500" />
                Résumé de l&apos;entretien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PHASES.map((phase) => {
                const phaseChecked = checklistState[phase.key]?.filter(Boolean).length || 0
                const phaseTotal = phase.items.length
                const pct = phaseTotal > 0 ? Math.round((phaseChecked / phaseTotal) * 100) : 0
                return (
                  <div key={phase.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{phase.title}</span>
                      <span className="text-xs text-gray-400">{phaseChecked}/{phaseTotal}</span>
                    </div>
                    <Progress value={pct} className={`h-1 ${pct === 100 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-400'}`} />
                  </div>
                )
              })}

              <Separator className="my-3" />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Notes prises</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Actions identifiées</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{notes.filter((n) => n.isActionItem).length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Points épinglés</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{notes.filter((n) => n.isPinned).length}</span>
                </div>
              </div>

              {/* Complete Interview Button */}
              {status !== 'COMPLETED' && (
                <>
                  <Separator className="my-3" />
                  <Button
                    onClick={handleComplete}
                    disabled={status === 'PLANNED'}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Terminer l&apos;entretien
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
