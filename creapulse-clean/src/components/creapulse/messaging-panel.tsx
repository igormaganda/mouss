'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageCircle, Clock } from 'lucide-react'

const COUNSELOR_ID = 'demo-counselor-1'
const COUNSELOR_NAME = 'Sophie Martin'
const POLL_INTERVAL = 5000

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
}

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function MessagingPanel() {
  const userId = useAppStore((s) => s.userId)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(
        `/api/messages?senderId=${userId}&receiverId=${COUNSELOR_ID}`
      )
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Initial load + polling
  useEffect(() => {
    if (!userId) return
    setIsLoading(true)
    fetchMessages()
    intervalRef.current = setInterval(fetchMessages, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [userId, fetchMessages])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || isSending) return
    setIsSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId: COUNSELOR_ID,
          content,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          setMessages((prev) => [...prev, data.message])
        }
      }
    } catch {
      // silent
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso)
    const today = new Date()
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    const time = d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (isToday) return time
    return (
      d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) +
      ' · ' +
      time
    )
  }

  const isSent = (msg: Message) => msg.senderId === userId

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
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                    {COUNSELOR_NAME}
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Conseillère CréaPulse
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                En ligne
              </Badge>
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
                    <Clock className="w-4 h-4 animate-pulse" />
                    Chargement des messages...
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Aucun message pour le moment.
                  </p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                    Envoyez le premier message à votre conseiller(ère) !
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => {
                      const sent = isSent(msg)
                      return (
                        <motion.div
                          key={msg.id}
                          layout
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${sent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] ${
                              sent ? 'order-2' : 'order-1'
                            }`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                sent
                                  ? 'bg-emerald-500 text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md'
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 dark:text-gray-500 ${
                                sent ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <Clock className="w-2.5 h-2.5" />
                              {formatTimestamp(msg.createdAt)}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  disabled={isSending}
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
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
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
