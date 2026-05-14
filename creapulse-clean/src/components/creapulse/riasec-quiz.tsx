'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Wrench,
  Search,
  Palette,
  HeartHandshake,
  Rocket,
  ClipboardCheck,
  Loader2,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'

// ====================== TYPES ======================
type QuizPhase = 'welcome' | 'quiz' | 'loading' | 'results'
type AnswerValue = 'yes' | 'no' | 'unsure'

interface Question {
  id: number
  text: string
  category: string
}

interface ProfileResult {
  type: string
  percent: number
  isDominant: boolean
}

// ====================== RIASEC PROFILES ======================
const RIASEC_PROFILES = [
  {
    key: 'R',
    label: 'Réaliste',
    icon: Wrench,
    color: 'bg-orange-500',
    colorLight: 'bg-orange-50',
    colorText: 'text-orange-700',
    colorBorder: 'border-orange-200',
    description: 'Vous êtes pragmatique et orienté vers l\'action concrète',
  },
  {
    key: 'I',
    label: 'Investigatif',
    icon: Search,
    color: 'bg-blue-500',
    colorLight: 'bg-blue-50',
    colorText: 'text-blue-700',
    colorBorder: 'border-blue-200',
    description: 'Vous êtes analytique et curieux de comprendre',
  },
  {
    key: 'A',
    label: 'Artiste',
    icon: Palette,
    color: 'bg-violet-500',
    colorLight: 'bg-violet-50',
    colorText: 'text-violet-700',
    colorBorder: 'border-violet-200',
    description: 'Vous êtes créatif et imaginatif',
  },
  {
    key: 'S',
    label: 'Social',
    icon: HeartHandshake,
    color: 'bg-emerald-500',
    colorLight: 'bg-emerald-50',
    colorText: 'text-emerald-700',
    colorBorder: 'border-emerald-200',
    description: 'Vous êtes empathique et orienté vers l\'accompagnement',
  },
  {
    key: 'E',
    label: 'Entreprenant',
    icon: Rocket,
    color: 'bg-rose-500',
    colorLight: 'bg-rose-50',
    colorText: 'text-rose-700',
    colorBorder: 'border-rose-200',
    description: 'Vous êtes leader et orienté vers les résultats',
  },
  {
    key: 'C',
    label: 'Conventionnel',
    icon: ClipboardCheck,
    color: 'bg-cyan-500',
    colorLight: 'bg-cyan-50',
    colorText: 'text-cyan-700',
    colorBorder: 'border-cyan-200',
    description: 'Vous êtes organisé et méthodique',
  },
]

function getProfile(key: string) {
  return RIASEC_PROFILES.find((p) => p.key === key) ?? RIASEC_PROFILES[0]
}

const TOTAL_QUESTIONS = 60

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

// ====================== WELCOME SCREEN ======================
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Test RIASEC
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Découvrez votre profil de personnalité professionnelle grâce au modèle Holland RIASEC.
                Ce test identifie vos intérêts dominants parmi 6 profils.
              </p>
            </div>

            {/* Profile types grid */}
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {RIASEC_PROFILES.map((profile) => (
                <motion.div
                  key={profile.key}
                  variants={fadeIn}
                  whileHover={{ y: -2 }}
                  className={`p-3 rounded-xl border ${profile.colorBorder} ${profile.colorLight} transition-all`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-lg ${profile.color} flex items-center justify-center`}>
                      <profile.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${profile.colorText}`}>
                        {profile.key} — {profile.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug mt-1">
                    {profile.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Info note */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 text-center">
                <strong className="text-gray-700">{TOTAL_QUESTIONS} questions</strong> · Durée estimée : 10-15 minutes · Répondez spontanément
              </p>
            </div>

            {/* Start button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={onStart}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
              >
                Démarrer le test
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// ====================== QUIZ SCREEN ======================
function QuizScreen({
  questions,
  answers,
  onAnswer,
}: {
  questions: Question[]
  answers: Map<number, AnswerValue>
  onAnswer: (questionId: number, value: AnswerValue) => void
}) {
  const answeredCount = answers.size
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100)

  // Determine the current question to show
  const currentQuestionId = answeredCount + 1
  const currentQuestion = questions.find((q) => q.id === currentQuestionId)

  const answerButtons: { value: AnswerValue; label: string; className: string }[] = [
    {
      value: 'yes',
      label: 'Oui',
      className:
        'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300',
    },
    {
      value: 'unsure',
      label: 'Pas sûr',
      className:
        'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300',
    },
    {
      value: 'no',
      label: 'Non',
      className:
        'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300',
    },
  ]

  if (!currentQuestion) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-2xl mx-auto"
    >
      {/* Progress section */}
      <motion.div variants={fadeIn} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Question {answeredCount + 1} / {TOTAL_QUESTIONS}
          </span>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
            {progressPercent}%
          </Badge>
        </div>
        <Progress value={progressPercent} className="h-2.5" />
      </motion.div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {/* Question number badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="rounded-lg text-xs font-mono bg-gray-50 text-gray-500 px-2.5 py-1"
                >
                  #{String(currentQuestion.id).padStart(2, '0')}
                </Badge>
                {currentQuestion.category && (
                  <Badge variant="secondary" className="text-[10px] text-gray-500">
                    {currentQuestion.category}
                  </Badge>
                )}
              </div>

              {/* Question text */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
                {currentQuestion.text}
              </h3>

              {/* Answer buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {answerButtons.map((btn) => (
                  <Button
                    key={btn.value}
                    variant="outline"
                    size="lg"
                    onClick={() => onAnswer(currentQuestion.id, btn.value)}
                    className={`flex-1 h-12 rounded-xl border text-sm font-semibold transition-all ${btn.className}`}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ====================== LOADING SCREEN ======================
function LoadingScreen() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={fadeInScale}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 sm:p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Analyse en cours...
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Nous calculons vos résultats basés sur vos {TOTAL_QUESTIONS} réponses. Cela ne prendra que quelques instants.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              <span className="text-xs text-gray-400">Calcul des profils RIASEC</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// ====================== RESULTS SCREEN ======================
function ResultsScreen({
  profiles,
  onReset,
}: {
  profiles: ProfileResult[]
  onReset: () => void
}) {
  const dominantProfiles = profiles.filter((p) => p.isDominant)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-2xl mx-auto"
    >
      {/* Dominant profile highlight */}
      {dominantProfiles.length > 0 && (
        <motion.div variants={fadeIn} className="mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {dominantProfiles.map((dp) => {
                    const profile = getProfile(dp.type)
                    return (
                      <motion.div
                        key={dp.type}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className={`w-12 h-12 rounded-xl ${profile.color} flex items-center justify-center`}
                      >
                        <profile.icon className="w-6 h-6 text-white" />
                      </motion.div>
                    )
                  })}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Votre profil dominant
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {dominantProfiles.map((dp, i) => {
                    const profile = getProfile(dp.type)
                    return (
                      <span key={dp.type} className="flex items-center gap-1">
                        {i > 0 && <span className="text-gray-300 text-sm">·</span>}
                        <Badge className={`${profile.colorLight} ${profile.colorText} text-sm font-semibold px-3 py-1 rounded-lg`}>
                          {dp.type} — {profile.label}
                        </Badge>
                      </span>
                    )
                  })}
                </div>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {dominantProfiles.map((dp) => getProfile(dp.type).description).join(' ')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All profiles breakdown */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-gray-700">Répartition des profils</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profiles.map((profile, i) => {
              const p = getProfile(profile.type)
              return (
                <motion.div
                  key={profile.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`p-4 rounded-xl border transition-all ${
                    profile.isDominant
                      ? `${p.colorBorder} ${p.colorLight} shadow-sm`
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center`}>
                        <p.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${profile.isDominant ? p.colorText : 'text-gray-700'}`}>
                          {profile.type} — {p.label}
                        </p>
                        {profile.isDominant && (
                          <p className="text-[10px] text-gray-500 mt-0.5">{p.description}</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${profile.isDominant ? p.colorText : 'text-gray-500'}`}>
                      {profile.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profile.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                      className={`h-full rounded-full ${p.color}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reset button */}
      <motion.div variants={fadeIn} className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refaire le test
        </Button>
      </motion.div>
    </motion.div>
  )
}

// ====================== MAIN COMPONENT ======================
export default function RiasecQuiz() {
  const userId = useAppStore((s) => s.userId)

  const [phase, setPhase] = useState<QuizPhase>('welcome')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Map<number, AnswerValue>>(new Map())
  const [results, setResults] = useState<ProfileResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch questions when starting the quiz
  const startQuiz = useCallback(async () => {
    setPhase('loading')
    setError(null)

    try {
      const params = new URLSearchParams()
      if (userId) params.set('userId', userId)
      const res = await fetch(`/api/riasec-quiz?${params.toString()}`)
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json()
      const qs = data.questions ?? data ?? []
      if (Array.isArray(qs) && qs.length > 0) {
        setQuestions(qs)
        setAnswers(new Map())
        setPhase('quiz')
      } else {
        throw new Error('Aucune question disponible')
      }
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des questions')
      setPhase('welcome')
    }
  }, [userId])

  // Handle answering a question
  const handleAnswer = useCallback(
    (questionId: number, value: AnswerValue) => {
      const updated = new Map(answers)
      updated.set(questionId, value)
      setAnswers(updated)

      // Check if all questions answered
      if (updated.size >= TOTAL_QUESTIONS) {
        submitQuiz(updated)
      }
    },
    [answers]
  )

  // Submit quiz for analysis
  const submitQuiz = useCallback(
    async (finalAnswers: Map<number, AnswerValue>) => {
      setPhase('loading')
      setError(null)

      try {
        const answerArray = Array.from(finalAnswers.entries()).map(([questionId, value]) => ({
          questionId,
          answer: value,
        }))

        const res = await fetch('/api/riasec-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            answers: answerArray,
          }),
        })

        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        const data = await res.json()
        const profiles = data.profiles ?? data.results ?? data ?? []
        if (Array.isArray(profiles) && profiles.length > 0) {
          setResults(profiles)
          setPhase('results')
        } else {
          throw new Error('Résultats invalides')
        }
      } catch (e: any) {
        setError(e.message || 'Erreur lors de l\'analyse')
        setPhase('welcome')
      }
    },
    [userId]
  )

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setPhase('welcome')
    setAnswers(new Map())
    setResults([])
    setError(null)
  }, [])

  return (
    <div className="space-y-4">
      {error && phase === 'welcome' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-xs text-red-600">{error}</span>
          </div>
        </motion.div>
      )}

      {phase === 'welcome' && <WelcomeScreen onStart={startQuiz} />}
      {phase === 'quiz' && (
        <QuizScreen
          questions={questions}
          answers={answers}
          onAnswer={handleAnswer}
        />
      )}
      {phase === 'loading' && <LoadingScreen />}
      {phase === 'results' && (
        <ResultsScreen profiles={results} onReset={resetQuiz} />
      )}
    </div>
  )
}
