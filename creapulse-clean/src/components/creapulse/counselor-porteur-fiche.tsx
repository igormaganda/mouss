'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type CounselorTab } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  CalendarPlus,
  FileText,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  Target,
  Compass,
  Heart,
  Eye,
  DollarSign,
  ThumbsUp,
  Loader2,
  Plus,
  Pin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  ListTodo,
  BarChart3,
  Sparkles,
  MapPin,
  Briefcase,
  Lock,
} from 'lucide-react'

// ====================== TYPES ======================
interface PorteurProfile {
  id: string
  name: string
  email: string
  phone: string
  sector: string
  role: string
  assignmentDate: string
  status: 'ACTIVE' | 'COMPLETED'
}

interface ModuleProgress {
  name: string
  status: 'not_started' | 'in_progress' | 'completed'
  score: number
  description?: string
}

interface RiasecData {
  profileType: string
  isDominant: boolean
  score: number
}

interface KiviatData {
  dimension: string
  value: number
}

interface GoNoGoEvaluation {
  decision: string
  criteria: Array<{ name: string; score: number; weight: number }>
  reason?: string
}

interface InterviewRecord {
  id: string
  type: string
  date: string
  duration: number
  status: string
  notes?: string
}

interface CounselorNote {
  id: string
  content: string
  isPrivate: boolean
  createdAt: string
}

interface FollowUpTask {
  id: string
  title: string
  dueDate: string
  completed: boolean
  overdue: boolean
}

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

// ====================== HELPERS ======================
const RIASEC_LABELS: Record<string, string> = {
  R: 'Réaliste', I: 'Investigateur', A: 'Artistique', S: 'Social', E: 'Entrepreneurial', C: 'Conventionnel',
}

const MODULE_STATUS_CONFIG = {
  not_started: { label: 'Non commencé', color: 'text-gray-400 bg-gray-50 dark:bg-gray-800', icon: Circle },
  in_progress: { label: 'En cours', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', icon: Clock },
  completed: { label: 'Terminé', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle2 },
}

const GONO_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  GO: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200' },
  NO_GO: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200' },
  PENDING_REVIEW: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200' },
}

const INTERVIEW_TYPE_BADGE: Record<string, { label: string; color: string }> = {
  PREMIER: { label: 'Premier contact', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  SUIVI: { label: 'Suivi', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  BP_REVIEW: { label: 'Revue BP', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  GO_NO_GO: { label: 'Go/No-Go', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
}

// ====================== COMPONENT ======================
export default function CounselorPorteurFiche({ porteurId: propPorteurId }: { porteurId?: string }) {
  const userId = useAppStore((s) => s.userId)
  const setCounselorTab = useAppStore((s) => s.setCounselorTab)

  const [activeTab, setActiveTab] = useState('profil')
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<PorteurProfile | null>(null)
  const [modules, setModules] = useState<ModuleProgress[]>([])
  const [riasecData, setRiasecData] = useState<RiasecData[]>([])
  const [kiviatData, setKiviatData] = useState<KiviatData[]>([])
  const [goNoGo, setGoNoGo] = useState<GoNoGoEvaluation | null>(null)
  const [interviews, setInterviews] = useState<InterviewRecord[]>([])
  const [notes, setNotes] = useState<CounselorNote[]>([])
  const [tasks, setTasks] = useState<FollowUpTask[]>([])
  const [bpStatus, setBpStatus] = useState<string>('N/A')

  // Notes form
  const [noteContent, setNoteContent] = useState('')
  const [notePrivate, setNotePrivate] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Tasks form
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  // Calendar view
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  // Resolve porteur ID
  const porteurId = propPorteurId || profile?.id || ''

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { setIsLoading(false); return }
      setIsLoading(true)
      try {
        const [portfolioRes, progressRes, riasecRes, kiviatRes, goNoGoRes, bpRes, interviewsRes] =
          await Promise.allSettled([
            fetch(`/api/counselor/portfolio?counselorId=${userId}`).then((r) => r.json()),
            propPorteurId ? fetch(`/api/dashboard/user-progress?userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve(null),
            propPorteurId ? fetch(`/api/modules/riasec?userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve([]),
            propPorteurId ? fetch(`/api/modules/kiviat?userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve([]),
            propPorteurId ? fetch(`/api/go-nogo?userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve(null),
            propPorteurId ? fetch(`/api/bp-questionnaire?userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve(null),
            propPorteurId ? fetch(`/api/counselor/interviews?counselorId=${userId}&userId=${propPorteurId}`).then((r) => r.json()) : Promise.resolve([]),
          ])

        // Parse portfolio for porteur
        if (portfolioRes.status === 'fulfilled' && portfolioRes.value) {
          const porteurs = Array.isArray(portfolioRes.value) ? portfolioRes.value : portfolioRes.value.porteurs || []
          const found = propPorteurId ? porteurs.find((p: { id: string }) => p.id === propPorteurId) : porteurs[0]
          if (found) {
            setProfile({
              id: found.id || found.userId || '',
              name: found.name || found.userName || 'Porteur',
              email: found.email || '',
              phone: found.phone || '',
              sector: found.sector || 'Non défini',
              role: found.role || 'Porteur de projet',
              assignmentDate: found.assignmentDate || found.createdAt || '',
              status: found.status || 'ACTIVE',
            })
          }
        }

        // Parse module progress
        if (progressRes.status === 'fulfilled' && progressRes.value?.modules) {
          setModules(progressRes.value.modules)
        }

        // Parse RIASEC
        if (riasecRes.status === 'fulfilled' && Array.isArray(riasecRes.value)) {
          setRiasecData(riasecRes.value)
        }

        // Parse Kiviat
        if (kiviatRes.status === 'fulfilled' && Array.isArray(kiviatRes.value)) {
          setKiviatData(kiviatRes.value)
        }

        // Parse Go/No-Go
        if (goNoGoRes.status === 'fulfilled' && goNoGoRes.value?.evaluation) {
          setGoNoGo(goNoGoRes.value.evaluation)
        }

        // Parse BP
        if (bpRes.status === 'fulfilled' && bpRes.value?.status) {
          setBpStatus(bpRes.value.status)
        }

        // Parse interviews
        if (interviewsRes.status === 'fulfilled' && Array.isArray(interviewsRes.value)) {
          setInterviews(interviewsRes.value)
        }
      } catch {
        // silent fallback
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [userId, propPorteurId])

  const handleBack = useCallback(() => {
    setCounselorTab('portefeuille')
  }, [setCounselorTab])

  const handleAddNote = useCallback(async () => {
    if (!noteContent.trim() || !userId) return
    setIsAddingNote(true)
    try {
      const newNote: CounselorNote = {
        id: `note-${Date.now()}`,
        content: noteContent.trim(),
        isPrivate: notePrivate,
        createdAt: new Date().toISOString(),
      }
      setNotes((prev) => [newNote, ...prev])
      setNoteContent('')
    } finally {
      setIsAddingNote(false)
    }
  }, [noteContent, notePrivate, userId])

  const handleAddTask = useCallback(async () => {
    if (!taskTitle.trim()) return
    setIsAddingTask(true)
    try {
      const isOverdue = taskDueDate && new Date(taskDueDate) < new Date()
      const newTask: FollowUpTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        dueDate: taskDueDate,
        completed: false,
        overdue: !!isOverdue,
      }
      setTasks((prev) => [newTask, ...prev])
      setTaskTitle('')
      setTaskDueDate('')
    } finally {
      setIsAddingTask(false)
    }
  }, [taskTitle, taskDueDate])

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }, [])

  // Calendar helpers
  const calendarDays = (() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1
    const days: Array<{ day: number; isToday: boolean; hasTask: boolean; taskCompleted: boolean }> = []
    const today = new Date()
    for (let i = 0; i < adjustedFirst; i++) days.push({ day: 0, isToday: false, hasTask: false, taskCompleted: false })
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const taskOnDay = tasks.find((t) => t.dueDate === dateStr)
      days.push({
        day: d,
        isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
        hasTask: !!taskOnDay,
        taskCompleted: taskOnDay?.completed || false,
      })
    }
    return days
  })()

  // RIASEC dominant
  const dominantRiasec = riasecData.find((r) => r.isDominant)
  const riasecScore = dominantRiasec?.score || (riasecData.length > 0 ? Math.round(riasecData.reduce((s, r) => s + r.score, 0) / riasecData.length) : 0)
  const dominantLabel = dominantRiasec ? (RIASEC_LABELS[dominantRiasec.profileType] || dominantRiasec.profileType) : 'N/A'
  const gngConfig = GONO_CONFIG[goNoGo?.decision || 'PENDING_REVIEW'] || GONO_CONFIG.PENDING_REVIEW

  // ====================== RENDER ======================
  if (isLoading) {
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="text-sm">Chargement de la fiche porteur...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
      {/* Back Button */}
      <motion.div variants={fadeIn}>
        <Button variant="ghost" onClick={handleBack} className="gap-2 text-gray-600 hover:text-emerald-600 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Retour au portefeuille
        </Button>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shrink-0">
                {profile?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'PP'}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profile?.name || 'Porteur de projet'}</h2>
                  {profile?.status && (
                    <Badge className={`${profile.status === 'ACTIVE' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'} border-0 text-xs`}>
                      {profile.status === 'ACTIVE' ? 'Actif' : 'Terminé'}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
                  {profile?.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
                  )}
                  {profile?.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile?.sector && (
                    <Badge className="bg-white/15 text-white border border-white/20 text-xs gap-1">
                      <Building2 className="w-3 h-3" />{profile.sector}
                    </Badge>
                  )}
                  {profile?.role && (
                    <Badge className="bg-white/15 text-white border border-white/20 text-xs gap-1">
                      <Briefcase className="w-3 h-3" />{profile.role}
                    </Badge>
                  )}
                  {profile?.assignmentDate && (
                    <Badge className="bg-white/10 text-white/70 border border-white/10 text-xs gap-1">
                      <Calendar className="w-3 h-3" />Assigné le {new Date(profile.assignmentDate).toLocaleDateString('fr-FR')}
                    </Badge>
                  )}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm" variant="outline" className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 text-xs bg-transparent">
                  <Send className="w-3.5 h-3.5" />Envoyer un message
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 text-xs bg-transparent">
                  <CalendarPlus className="w-3.5 h-3.5" />Planifier entretien
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl gap-2 border-white/30 text-white hover:bg-white/10 text-xs bg-transparent">
                  <FileText className="w-3.5 h-3.5" />Voir le BP
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeIn}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 rounded-xl h-auto flex-wrap gap-1">
            {[
              { value: 'profil', icon: User, label: 'Profil' },
              { value: 'diagnostic', icon: Target, label: 'Diagnostic' },
              { value: 'bp', icon: FileText, label: 'Business Plan' },
              { value: 'entretiens', icon: MessageSquare, label: 'Entretiens' },
              { value: 'notes', icon: StickyNote, label: 'Notes' },
              { value: 'suivi', icon: ListTodo, label: 'Suivi' },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2">
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ========== TAB PROFIL ========== */}
          <TabsContent value="profil">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-500" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'Nom', value: profile?.name || '—' },
                      { label: 'Email', value: profile?.email || '—' },
                      { label: 'Téléphone', value: profile?.phone || '—' },
                      { label: 'Secteur', value: profile?.sector || '—' },
                      { label: 'Rôle', value: profile?.role || '—' },
                      { label: 'Date d\'assignation', value: profile?.assignmentDate ? new Date(profile.assignmentDate).toLocaleDateString('fr-FR') : '—' },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* RIASEC Profile */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-violet-500" />
                    Profil RIASEC
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                      <p className="text-xs text-gray-500">Type dominant</p>
                      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{dominantLabel}</p>
                      <p className="text-sm text-violet-500 mt-1">Score : {riasecScore}%</p>
                    </div>
                    <div className="flex-1">
                      {riasecData.slice(0, 6).map((r) => (
                        <div key={r.profileType} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-gray-500 w-24">{RIASEC_LABELS[r.profileType] || r.profileType}</span>
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${r.isDominant ? 'bg-violet-500' : 'bg-violet-300 dark:bg-violet-700'}`}
                              style={{ width: `${r.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{r.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kiviat Scores */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Scores Kiviat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kiviatData.length > 0 ? (
                    <div className="space-y-3">
                      {kiviatData.map((k) => (
                        <div key={k.dimension} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{k.dimension}</span>
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{k.value}/100</span>
                          </div>
                          <Progress value={k.value} className="h-2 [&>div]:bg-emerald-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Données Kiviat non disponibles</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ========== TAB DIAGNOSTIC ========== */}
          <TabsContent value="diagnostic">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              {/* Module Completion Grid */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Avancement des modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {modules.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {modules.map((m) => {
                        const config = MODULE_STATUS_CONFIG[m.status as keyof typeof MODULE_STATUS_CONFIG] || MODULE_STATUS_CONFIG.not_started
                        const StatusIcon = config.icon
                        return (
                          <div key={m.name} className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 ${config.color}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold">{m.name}</span>
                              <StatusIcon className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={m.score} className={`h-1.5 flex-1 ${m.status === 'completed' ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-400'}`} />
                              <span className="text-xs font-mono">{m.score}%</span>
                            </div>
                            <p className="text-[10px] mt-1 opacity-70">{config.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Aucun module complété</p>
                  )}
                </CardContent>
              </Card>

              {/* Go/No-Go */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-amber-500" />
                    Évaluation Go / No-Go
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {goNoGo ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border ${gngConfig.border} ${gngConfig.bg}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className={`w-5 h-5 ${gngConfig.color}`} />
                            <span className={`text-lg font-bold ${gngConfig.color}`}>{goNoGo.decision === 'GO' ? 'GO — Projet viable' : goNoGo.decision === 'NO_GO' ? 'NO GO — À retravailler' : 'En attente de décision'}</span>
                          </div>
                        </div>
                        {goNoGo.criteria && goNoGo.criteria.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {goNoGo.criteria.map((c, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{c.name}</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={c.score} className={`h-1.5 w-24 ${c.score >= 60 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-400'}`} />
                                  <span className="text-xs font-mono w-8 text-right">{c.score}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {goNoGo.reason && (
                          <p className="text-sm text-gray-500 mt-3 italic">&laquo; {goNoGo.reason} &raquo;</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Évaluation non encore réalisée</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ========== TAB BUSINESS PLAN ========== */}
          <TabsContent value="bp">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Business Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <p className="text-xs text-gray-400">Statut</p>
                      <Badge variant="secondary" className="mt-1 text-xs">{bpStatus}</Badge>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <p className="text-xs text-gray-400">Secteur</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{profile?.sector || '—'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <p className="text-xs text-gray-400">Modules complétés</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {modules.filter((m) => m.status === 'completed').length} / {modules.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={modules.length > 0 ? (modules.filter((m) => m.status === 'completed').length / modules.length) * 100 : 0} className="flex-1 h-2 [&>div]:bg-emerald-500" />
                    <span className="text-xs text-gray-400">
                      {modules.length > 0 ? Math.round((modules.filter((m) => m.status === 'completed').length / modules.length) * 100) : 0}% complété
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Section Completion Grid */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-500" />
                    Sections du Business Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {modules.map((m) => (
                      <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        {m.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : m.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{m.name}</p>
                          <p className="text-[10px] text-gray-400">{m.score}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ========== TAB ENTRETIENS ========== */}
          <TabsContent value="entretiens">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  Historique des entretiens
                </h3>
                <Button size="sm" className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  <Plus className="w-3.5 h-3.5" />Nouvel entretien
                </Button>
              </div>
              {interviews.length > 0 ? (
                <div className="space-y-3">
                  {interviews.map((interview) => {
                    const typeBadge = INTERVIEW_TYPE_BADGE[interview.type] || { label: interview.type, color: 'bg-gray-100 text-gray-600' }
                    return (
                      <Card key={interview.id} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{new Date(interview.date).toLocaleDateString('fr-FR')}</span>
                                  <Badge className={`text-[10px] px-2 ${typeBadge.color}`}>{typeBadge.label}</Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{interview.duration} min</span>
                                  <Badge variant="outline" className="text-[10px]">{interview.status}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          {interview.notes && (
                            <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
                              {interview.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Aucun entretien enregistré</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* ========== TAB NOTES ========== */}
          <TabsContent value="notes">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-emerald-500" />
                    Notes du conseiller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add note form */}
                  <div className="space-y-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Ajouter une note..."
                      className="min-h-[80px] rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notePrivate}
                          onChange={(e) => setNotePrivate(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Lock className="w-3.5 h-3.5" />
                        Note privée
                      </label>
                      <Button size="sm" onClick={handleAddNote} disabled={!noteContent.trim() || isAddingNote} className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        {isAddingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Notes list */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="p-4 rounded-xl border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                {note.isPrivate && (
                                  <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-600">Privée</Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)} className="h-7 w-7 text-gray-300 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {notes.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">Aucune note ajoutée</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ========== TAB SUIVI ========== */}
          <TabsContent value="suivi">
            <motion.div variants={fadeIn} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Tasks */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-emerald-500" />
                      Tâches de suivi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add task */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Nouvelle tâche..."
                        className="flex-1 h-9 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                      />
                      <Input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-auto h-9 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                      />
                      <Button size="sm" onClick={handleAddTask} disabled={!taskTitle.trim() || isAddingTask} className="rounded-xl gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0">
                        {isAddingTask ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      </Button>
                    </div>

                    {/* Tasks list */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            task.completed
                              ? 'border-gray-100 opacity-60'
                              : task.overdue
                                ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                                : 'border-gray-100 dark:border-gray-800'
                          }`}
                        >
                          <button onClick={() => toggleTask(task.id)} className="shrink-0">
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className={`w-4 h-4 ${task.overdue ? 'text-red-400' : 'text-gray-300'}`} />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {task.title}
                            </p>
                            {task.dueDate && (
                              <p className={`text-[10px] mt-0.5 ${task.overdue && !task.completed ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                {task.overdue && !task.completed ? '⚠️ En retard — ' : ''}{new Date(task.dueDate).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-7 w-7 text-gray-300 hover:text-red-500 shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">Aucune tâche de suivi</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Calendar View */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      Calendrier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="h-8 w-8">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {calendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="h-8 w-8">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
                        <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                      ))}
                    </div>
                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((d, i) => (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${
                            d.day === 0
                              ? ''
                              : d.isToday
                                ? 'bg-emerald-500 text-white font-bold'
                                : d.hasTask
                                  ? d.taskCompleted
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {d.day > 0 ? d.day : ''}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
