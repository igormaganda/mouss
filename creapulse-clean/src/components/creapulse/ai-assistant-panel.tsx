'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Bot, Send, Loader2, Trash2, Clock } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

const QUICK_QUESTIONS = [
  'Comment créer mon business plan ?',
  'Quelles aides sont disponibles ?',
  'Comment trouver mon premier client ?',
  'Quel statut juridique choisir ?',
]

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function AIAssistantPanel() {
  const userId = useAppStore((s) => s.userId)
  const userTab = useAppStore((s) => s.userTab)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchHistory = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/ai-assistant?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((m: Record<string, unknown>) => ({
              id: m.id as string,
              role: m.role as 'user' | 'assistant',
              content: m.content as string,
              createdAt: (m.createdAt as string) || new Date().toISOString(),
            }))
          )
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiThinking])

  const getContext = (): string => {
    if (!userTab || userTab === 'profil') return 'Accueil — début de parcours'
    const phaseMap: Record<string, string> = {
      bilan: 'Phase de bilan personnel et professionnel',
      riasec: 'Test RIASEC — orientation',
      pepite: 'Pépite — idée de projet',
      juridique: 'Choix du statut juridique',
      marche: 'Analyse de marché',
      financier: 'Prévisions financières',
      strategie: 'Stratégie commerciale',
      financement: 'Recherche de financement',
      'changement-echelle': 'Changement d\'échelle',
      agenda: 'Planification et agenda',
      messages: 'Messagerie avec conseiller',
      'ia-assistant': 'Assistant IA',
      'tableau-de-bord': 'Tableau de bord',
    }
    return phaseMap[userTab] || 'Parcours entrepreneurial'
  }

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim()
    if (!messageContent || !userId || isAiThinking) return

    setInput('')
    setIsAiThinking(true)

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: messageContent,
          context: getContext(),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        // Replace temp with real data — fetch full history
        setMessages((prev) => {
          // Remove the optimistic temp message
          const filtered = prev.filter((m) => !m.id.startsWith('temp-'))
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
              content: data.reply || 'Je n\'ai pas pu générer une réponse.',
              createdAt: new Date().toISOString(),
            },
          ]
        })
      } else {
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.id.startsWith('temp-'))
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
      }
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.id.startsWith('temp-'))
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
            content: 'Erreur de connexion. Veuillez vérifier votre réseau.',
            createdAt: new Date().toISOString(),
          },
        ]
      })
    } finally {
      setIsAiThinking(false)
      inputRef.current?.focus()
    }
  }

  const deleteHistory = async () => {
    if (!userId || isDeleting) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/ai-assistant?userId=${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMessages([])
      }
    } catch {
      // silent
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const hasMessages = messages.length > 0

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-amber-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                    Assistant IA CréaPulse
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Votre coach entrepreneurial intelligent
                  </p>
                </div>
              </div>
              {hasMessages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteHistory}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 h-8 px-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="sr-only sm:not-sr-only sm:ml-1.5 text-xs">
                    Effacer
                  </span>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Chat Area */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm flex flex-col" style={{ height: '480px' }}>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement...
                  </div>
                </div>
              ) : !hasMessages && !isAiThinking ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-amber-100 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Bienvenue sur CréaPulse ! 🎉
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Je suis votre assistant IA spécialisé dans la création
                    d&apos;entreprise. Posez-moi vos questions ou choisissez une
                    suggestion ci-dessous pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => {
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
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] ${
                              isUser ? 'order-2' : 'order-1'
                            }`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                isUser
                                  ? 'bg-emerald-500 text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md'
                              }`}
                            >
                              {!isUser && (
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Bot className="w-3.5 h-3.5 text-violet-500" />
                                  <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                                    Assistant IA
                                  </span>
                                </div>
                              )}
                              <span className="whitespace-pre-wrap">{msg.content}</span>
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 dark:text-gray-500 ${
                                isUser ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <Clock className="w-2.5 h-2.5" />
                              {formatTimestamp(msg.createdAt)}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}

                    {/* AI thinking indicator */}
                    {isAiThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[75%] sm:max-w-[65%]">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Bot className="w-3.5 h-3.5 text-violet-500" />
                              <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                                Assistant IA
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

            {/* Quick Questions */}
            {!isLoading && (
              <div className="px-4 pt-1 pb-1">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={isAiThinking}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-violet-200 text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-3">
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
                  placeholder="Posez votre question..."
                  disabled={isAiThinking}
                  className="flex-1 h-10 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
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
                  className="h-10 w-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shrink-0"
                >
                  {isAiThinking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
