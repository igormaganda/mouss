'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type CounselorTab } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  Trash2,
  Clock,
  X,
  User,
  Building2,
  FileText,
  BarChart3,
  Target,
  Compass,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  ChevronRight,
} from 'lucide-react'

// ====================== TYPES ======================
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  isLoading?: boolean
}

interface PorteurContext {
  id: string
  name: string
  sector: string
  bpStatus: string
  score: number
}

type ContextKey = CounselorTab

// ====================== CONSTANTS ======================
const QUICK_PROMPTS = [
  { label: 'Résumé du profil', icon: User, prompt: 'Résumé du profil' },
  { label: 'Questions suggérées', icon: MessageSquare, prompt: 'Questions suggérées' },
  { label: 'Points de vigilance', icon: AlertTriangle, prompt: 'Points de vigilance' },
  { label: 'Recommandations', icon: Lightbulb, prompt: 'Recommandations' },
  { label: 'Générer un compte-rendu', icon: ClipboardList, prompt: 'Générer un compte-rendu' },
]

const CONTEXT_PROMPTS: Record<ContextKey, string> = {
  portefeuille: 'Aide-moi avec mon portefeuille de porteurs.',
  'fiche-porteur': 'Voici le profil complet du porteur que je consulte.',
  messagerie: 'Aide-moi à rédiger un message au porteur.',
  entretien: "Je suis en entretien avec un porteur. Aide-moi en temps réel.",
  'ai-copilote': 'Aide-moi dans mon rôle de conseiller.',
  notes: 'Aide-moi à structurer mes notes sur ce porteur.',
  'chat-marche': "Aide-moi avec l'analyse de marché.",
  'go-nogo': "Aide-moi avec l'évaluation Go/No-Go du porteur.",
  livrables: 'Aide-moi à générer les livrables.',
  collaboration: 'Aide-moi avec la collaboration entre conseillers.',
  synthese: 'Aide-moi avec la synthèse du diagnostic.',
}

// ====================== ANIMATION ======================
const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// ====================== COMPONENT ======================
export default function CounselorAICopilot() {
  const userId = useAppStore((s) => s.userId)
  const counselorTab = useAppStore((s) => s.counselorTab)

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [porteurContext, setPorteurContext] = useState<PorteurContext | null>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Current context based on counselor tab
  const currentContext = counselorTab as ContextKey
  const contextPrompt = CONTEXT_PROMPTS[currentContext] || 'Aide-moi en tant que conseiller CréaPulse.'

  // Fetch porteur context when tab changes to a porteur-specific tab
  useEffect(() => {
    const fetchContext = async () => {
      if (!userId || (currentContext !== 'fiche-porteur' && currentContext !== 'entretien' && currentContext !== 'go-nogo')) {
        return
      }
      setIsLoadingContext(true)
      try {
        const res = await fetch(`/api/counselor/portfolio?counselorId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const porteurs = Array.isArray(data) ? data : data.porteurs || []
          if (porteurs.length > 0) {
            const first = porteurs[0]
            setPorteurContext({
              id: first.id || first.userId || '',
              name: first.name || first.userName || 'Porteur',
              sector: first.sector || 'Non défini',
              bpStatus: first.bpStatus || 'En cours',
              score: first.score || 0,
            })
          }
        }
      } catch {
        // silent
      } finally {
        setIsLoadingContext(false)
      }
    }
    fetchContext()
  }, [userId, currentContext])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiThinking])

  const buildSystemContext = useCallback((): string => {
    let context = `Tu es l'assistant IA Co-Pilote de CréaPulse, un conseiller en création d'entreprise. Contexte : ${contextPrompt}`

    if (porteurContext) {
      context += `\n\nPorteur actuel : ${porteurContext.name} (${porteurContext.sector}). BP : ${porteurContext.bpStatus}. Score global : ${porteurContext.score}/100.`
    }

    if (currentContext === 'entretien') {
      context += "\n\nL'utilisateur est actuellement en entretien avec ce porteur. Propose des questions pertinentes, des observations et des recommandations en temps réel."
    } else if (currentContext === 'go-nogo') {
      context += "\n\nL'utilisateur prépare l'évaluation Go/No-Go. Aide-le à évaluer la viabilité du projet et à identifier les points de vigilance."
    } else if (currentContext === 'fiche-porteur') {
      context += '\n\nL\'utilisateur consulte la fiche détaillée du porteur. Donne un profil synthétique et des recommandations personnalisées.'
    }

    return context
  }, [contextPrompt, porteurContext, currentContext])

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input.trim()
    if (!messageContent || !userId || isAiThinking) return

    setInput('')
    setIsAiThinking(true)

    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    // Add loading indicator
    const loadingMsg: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMsg])

    try {
      const res = await fetch('/api/counselor/ai-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counselorId: userId,
          userId: porteurContext?.id,
          context: currentContext,
          message: messageContent,
          systemContext: buildSystemContext(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const reply = data.content || data.reply || data.suggestions?.join('\n') || 'Je n\'ai pas pu générer une réponse.'
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.isLoading && !m.id.startsWith('temp-'))
          return [
            ...filtered,
            {
              id: `user-${Date.now()}`,
              role: 'user' as const,
              content: messageContent,
              createdAt: new Date().toISOString(),
            },
            {
              id: `ai-${Date.now()}`,
              role: 'assistant' as const,
              content: reply,
              createdAt: new Date().toISOString(),
            },
          ]
        })
      } else {
        // Fallback to generic AI chat endpoint
        const fallbackRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: buildSystemContext() },
              { role: 'user', content: messageContent },
            ],
            context: { userName: 'Conseiller CréaPulse', userRole: 'COUNSELOR' },
          }),
        })
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json()
          setMessages((prev) => {
            const filtered = prev.filter((m) => !m.isLoading && !m.id.startsWith('temp-'))
            return [
              ...filtered,
              {
                id: `user-${Date.now()}`,
                role: 'user' as const,
                content: messageContent,
                createdAt: new Date().toISOString(),
              },
              {
                id: `ai-${Date.now()}`,
                role: 'assistant' as const,
                content: fallbackData.content || 'Réponse non disponible.',
                createdAt: new Date().toISOString(),
              },
            ]
          })
        } else {
          throw new Error('Both endpoints failed')
        }
      }
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isLoading && !m.id.startsWith('temp-'))
        return [
          ...filtered,
          {
            id: `user-${Date.now()}`,
            role: 'user' as const,
            content: messageContent,
            createdAt: new Date().toISOString(),
          },
          {
            id: `ai-err-${Date.now()}`,
            role: 'assistant' as const,
            content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
            createdAt: new Date().toISOString(),
          },
        ]
      })
    } finally {
      setIsAiThinking(false)
      inputRef.current?.focus()
    }
  }, [input, userId, isAiThinking, porteurContext, currentContext, buildSystemContext])

  const deleteHistory = useCallback(() => {
    if (isDeleting) return
    setIsDeleting(true)
    setMessages([])
    setTimeout(() => setIsDeleting(false), 500)
  }, [isDeleting])

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Context badge info
  const contextLabel = useMemo(() => {
    const labels: Record<string, string> = {
      portefeuille: 'Portfolio',
      'fiche-porteur': 'Fiche porteur',
      messagerie: 'Messagerie',
      entretien: 'Entretien',
      'ai-copilote': 'Co-Pilote',
      notes: 'Notes',
      'chat-marche': 'Marché',
      'go-nogo': 'Go/No-Go',
      livrables: 'Livrables',
      collaboration: 'Collaboration',
      synthese: 'Synthèse',
    }
    return labels[currentContext] || 'Général'
  }, [currentContext])

  // Streaming simulation for display
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    setDisplayedMessages(messages)
  }, [messages])

  // ====================== RENDER ======================
  return (
    <>
      {/* Fixed Toggle Button */}
      <motion.div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
      >
        <button
          onClick={toggleOpen}
          className={`w-12 h-12 rounded-l-xl flex items-center justify-center shadow-lg transition-all ${
            isOpen
              ? 'bg-white dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-gray-500" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </button>
      </motion.div>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[350px] max-w-[90vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-40 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">IA Co-Pilote</h3>
                    <p className="text-[10px] text-gray-400">Assistant contextuel</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {contextLabel}
                  </Badge>
                  {displayedMessages.length > 0 && (
                    <button
                      onClick={deleteHistory}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Porteur Context Card */}
              {porteurContext && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{porteurContext.name}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Building2 className="w-2.5 h-2.5" />
                        {porteurContext.sector}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <div className="flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-gray-500">BP : </span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{porteurContext.bpStatus}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-2.5 h-2.5 text-gray-400" />
                      <span className="text-gray-500">Score : </span>
                      <span className={`font-semibold ${porteurContext.score >= 60 ? 'text-emerald-600' : porteurContext.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {porteurContext.score}/100
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {isLoadingContext && !porteurContext && (
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Chargement du contexte...
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => sendMessage(qp.prompt)}
                    disabled={isAiThinking}
                    className="text-[10px] px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <qp.icon className="w-2.5 h-2.5" />
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {displayedMessages.length === 0 && !isAiThinking && (
                  <div className="flex flex-col items-center text-center py-8 px-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
                      <Bot className="w-7 h-7 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Co-Pilote IA
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
                      {porteurContext
                        ? `Je suis au courant du profil de ${porteurContext.name}. Comment puis-je vous aider ?`
                        : 'Posez une question ou utilisez un raccourci ci-dessus pour commencer.'}
                    </p>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {displayedMessages.map((msg) => {
                    const isUser = msg.role === 'user'
                    return (
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                              isUser
                                ? 'bg-emerald-500 text-white rounded-br-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
                            }`}
                          >
                            {!isUser && (
                              <div className="flex items-center gap-1.5 mb-1">
                                <Bot className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Co-Pilote
                                </span>
                              </div>
                            )}
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-0.5 text-[9px] text-gray-400 ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimestamp(msg.createdAt)}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* AI thinking */}
                  {isAiThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%]">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-3.5 py-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Bot className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                              Co-Pilote
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`${contextLabel} — Posez une question...`}
                  disabled={isAiThinking}
                  className="flex-1 h-9 rounded-xl border-gray-200 dark:border-gray-700 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isAiThinking}
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                >
                  {isAiThinking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
