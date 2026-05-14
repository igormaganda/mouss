'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Send,
  Plus,
  Search,
  MessageCircle,
  Clock,
  Pin,
  Paperclip,
  Check,
  CheckCheck,
  Radio,
  Users,
  ChevronLeft,
  Loader2,
  X,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────
interface Participant {
  id: string
  name: string
  avatar?: string
}

interface ConversationSummary {
  id: string
  type: 'INDIVIDUAL' | 'GROUP' | 'ANNOUNCEMENT'
  participants: Participant[]
  lastMessage: {
    content: string
    senderId: string
    senderName: string
    createdAt: string
  } | null
  unreadCount: number
  updatedAt: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: 'TEXT' | 'SYSTEM'
  isRead: boolean
  isPinned: boolean
  createdAt: string
}

interface Porteur {
  id: string
  name: string
  avatar?: string
}

// ── Constants ──────────────────────────────────────────────────────────
const POLL_INTERVAL = 5000

const QUICK_TEMPLATES = [
  { label: 'Rappel de RDV', content: 'Bonjour, je vous rappelle notre prochain rendez-vous prévu le ' },
  { label: 'BP à compléter', content: 'Bonjour, n\'oubliez pas de compléter votre Business Plan en ligne. N\'hésitez pas si vous avez des questions.' },
  { label: 'Félicitations !', content: 'Félicitations pour cette avancée ! Continuez sur cette lancée, le travail fourni est remarquable.' },
  { label: 'Suite à notre échange', content: 'Suite à notre échange d\'aujourd\'hui, voici les points à retenir et les prochaines étapes à suivre.' },
]

const TYPE_LABELS: Record<string, string> = {
  INDIVIDUAL: 'Individuel',
  GROUP: 'Groupe',
  ANNOUNCEMENT: 'Annonce',
}

const TYPE_COLORS: Record<string, string> = {
  INDIVIDUAL: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  GROUP: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ANNOUNCEMENT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

// ── Animation variants ─────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.04 } },
}

// ── Helpers ────────────────────────────────────────────────────────────
function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'À l\'instant'
  if (diffMin < 60) return `${diffMin} min`
  if (diffHour < 24) return `${diffHour} h`
  if (diffDay < 7) return `${diffDay} j`

  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatTimestamp(iso: string): string {
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max) + '...'
}

// ── Component ──────────────────────────────────────────────────────────
export default function CounselorMessaging() {
  const userId = useAppStore((s) => s.userId)

  // State
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showNewConvDialog, setShowNewConvDialog] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // New conversation form state
  const [porteurs, setPorteurs] = useState<Porteur[]>([])
  const [selectedPorteurs, setSelectedPorteurs] = useState<string[]>([])
  const [newConvType, setNewConvType] = useState<'INDIVIDUAL' | 'ANNOUNCEMENT'>('INDIVIDUAL')
  const [newConvMessage, setNewConvMessage] = useState('')
  const [isCreatingConv, setIsCreatingConv] = useState(false)
  const [broadcastAll, setBroadcastAll] = useState(false)

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch conversations ──────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(
        `/api/counselor/messaging?counselorId=${userId}`
      )
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.conversations)) {
          setConversations(data.conversations)
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoadingConversations(false)
    }
  }, [userId])

  // ── Fetch messages for a conversation ────────────────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
    setIsLoadingMessages(true)
    try {
      const res = await fetch(`/api/counselor/conversations/${convId}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  // ── Fetch porteurs for new conversation ──────────────────────────────
  const fetchPorteurs = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/counselor/messaging/porteurs?counselorId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.porteurs)) {
          setPorteurs(data.porteurs)
        }
      }
    } catch {
      // silent
    }
  }, [userId])

  // ── Polling ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    setIsLoadingConversations(true)
    fetchConversations()
    pollRef.current = setInterval(fetchConversations, POLL_INTERVAL)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [userId, fetchConversations])

  // ── Auto-scroll to bottom ────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Load messages when conversation selected ─────────────────────────
  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
      setMobileSheetOpen(false)
    } else {
      setMessages([])
    }
  }, [selectedConversationId, fetchMessages])

  // ── Auto-resize textarea ─────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [messageText])

  // ── Derived state ────────────────────────────────────────────────────
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return c.participants.some((p) => p.name.toLowerCase().includes(q))
  })

  const announcements = filteredConversations.filter(
    (c) => c.type === 'ANNOUNCEMENT'
  )
  const directConversations = filteredConversations.filter(
    (c) => c.type !== 'ANNOUNCEMENT'
  )

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  // ── Send message ─────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId || !userId || isSending) return
    setIsSending(true)
    const content = messageText.trim()
    setMessageText('')

    // Optimistic UI update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: userId,
      senderName: 'Vous',
      content,
      type: 'TEXT',
      isRead: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const res = await fetch(`/api/counselor/conversations/${selectedConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          content,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.message) {
          // Replace optimistic message with real one
          setMessages((prev) =>
            prev.map((m) =>
              m.id === optimisticMessage.id ? data.message : m
            )
          )
        }
        // Refresh conversation list to update last message
        fetchConversations()
      } else {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
    } finally {
      setIsSending(false)
      textareaRef.current?.focus()
    }
  }

  // ── Create new conversation ──────────────────────────────────────────
  const createConversation = async () => {
    if (!userId || isCreatingConv) return
    if (!broadcastAll && selectedPorteurs.length === 0) return
    if (!newConvMessage.trim()) return

    setIsCreatingConv(true)
    try {
      const res = await fetch('/api/counselor/messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counselorId: userId,
          type: broadcastAll ? 'ANNOUNCEMENT' : newConvType,
          participantIds: broadcastAll ? porteurs.map((p) => p.id) : selectedPorteurs,
          firstMessage: newConvMessage.trim(),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.conversation) {
          // Reset form
          setSelectedPorteurs([])
          setNewConvMessage('')
          setBroadcastAll(false)
          setNewConvType('INDIVIDUAL')
          setShowNewConvDialog(false)

          // Select new conversation and refresh list
          setSelectedConversationId(data.conversation.id)
          fetchConversations()
        }
      }
    } catch {
      // silent
    } finally {
      setIsCreatingConv(false)
    }
  }

  // ── Apply template ───────────────────────────────────────────────────
  const applyTemplate = (template: { label: string; content: string }) => {
    setMessageText(template.content)
    textareaRef.current?.focus()
    setShowTemplates(false)
  }

  // ── Toggle porteur selection ─────────────────────────────────────────
  const togglePorteur = (porteurId: string) => {
    setSelectedPorteurs((prev) =>
      prev.includes(porteurId)
        ? prev.filter((id) => id !== porteurId)
        : [...prev, porteurId]
    )
  }

  // ── Handle textarea keydown ──────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Conversation list item ───────────────────────────────────────────
  const ConversationItem = ({
    conv,
  }: {
    conv: ConversationSummary
  }) => {
    const isActive = conv.id === selectedConversationId
    const displayName =
      conv.type === 'ANNOUNCEMENT'
        ? '📢 Annonce générale'
        : conv.participants.map((p) => p.name).join(', ')
    const avatarSrc =
      conv.type !== 'ANNOUNCEMENT' && conv.participants.length === 1
        ? conv.participants[0].avatar
        : undefined
    const avatarFallback =
      conv.type === 'ANNOUNCEMENT'
        ? '📢'
        : conv.participants.length === 1
          ? getInitials(conv.participants[0].name)
          : getInitials(displayName)

    return (
      <button
        onClick={() => setSelectedConversationId(conv.id)}
        className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
          isActive
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
            : 'border border-transparent'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10">
              {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            {conv.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                {conv.lastMessage ? formatRelativeTime(conv.lastMessage.createdAt) : ''}
              </span>
            </div>
            {conv.lastMessage && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {conv.lastMessage.senderName !== 'Vous'
                  ? `${conv.lastMessage.senderName}: `
                  : ''}
                {truncate(conv.lastMessage.content, 40)}
              </p>
            )}
            {conv.type !== 'INDIVIDUAL' && (
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${TYPE_COLORS[conv.type]}`}
                >
                  {conv.type === 'ANNOUNCEMENT' ? (
                    <Radio className="w-2.5 h-2.5" />
                  ) : (
                    <Users className="w-2.5 h-2.5" />
                  )}
                  {TYPE_LABELS[conv.type]}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    )
  }

  // ── Message bubble ───────────────────────────────────────────────────
  const MessageBubble = ({ msg }: { msg: Message }) => {
    const isSent = msg.senderId === userId
    const isSystem = msg.type === 'SYSTEM'

    if (isSystem) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-1"
        >
          <span className="text-[11px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
            {msg.content}
          </span>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[75%] sm:max-w-[65%] ${isSent ? 'order-2' : 'order-1'}`}>
          {msg.isPinned && (
            <div className="flex items-center gap-1 mb-1 text-[10px] text-amber-600 dark:text-amber-400">
              <Pin className="w-3 h-3" />
              <span className="font-medium">Épinglé</span>
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isSent
                ? 'bg-emerald-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md'
            } ${msg.isPinned ? 'ring-2 ring-amber-200 dark:ring-amber-700' : ''}`}
          >
            {msg.content}
          </div>
          <div
            className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 dark:text-gray-500 ${
              isSent ? 'justify-end' : 'justify-start'
            }`}
          >
            <Clock className="w-2.5 h-2.5" />
            <span>{formatTimestamp(msg.createdAt)}</span>
            {isSent && (
              <span className="ml-1">
                {msg.isRead ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-gray-400" />
                )}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Sidebar content (shared between desktop & mobile sheet) ──────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Search + New button */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="pl-9 h-9 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
          />
        </div>
        <Button
          onClick={() => {
            fetchPorteurs()
            setShowNewConvDialog(true)
          }}
          className="w-full h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau message
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-2">
        {isLoadingConversations ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageCircle className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Aucune conversation.
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              Cliquez sur &quot;Nouveau message&quot; pour commencer.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 pb-4">
            {/* Announcements section */}
            {announcements.length > 0 && (
              <div className="pt-1">
                <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Annonces
                </p>
                {announcements.map((conv) => (
                  <ConversationItem key={conv.id} conv={conv} />
                ))}
              </div>
            )}

            {/* Direct conversations */}
            {directConversations.length > 0 && (
              <div className="pt-1">
                <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Conversations
                </p>
                {directConversations.map((conv) => (
                  <ConversationItem key={conv.id} conv={conv} />
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  // ── Main render ──────────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="h-full flex flex-col"
    >
      {/* ── Desktop layout ────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-1 h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        {/* Left sidebar */}
        <motion.div
          variants={fadeIn}
          className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0"
        >
          {/* Sidebar header */}
          <div className="p-4 pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              Messagerie
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 &&
                ` · ${conversations.reduce((sum, c) => sum + c.unreadCount, 0)} non lu${conversations.reduce((sum, c) => sum + c.unreadCount, 0) !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <SidebarContent />
        </motion.div>

        {/* Main chat panel */}
        <motion.div variants={fadeIn} className="flex-1 flex flex-col min-w-0">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedConversation.participants.length === 1 && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={selectedConversation.participants[0].avatar}
                        alt={selectedConversation.participants[0].name}
                      />
                      <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        {getInitials(selectedConversation.participants[0].name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {selectedConversation.type === 'ANNOUNCEMENT'
                        ? '📢 Annonce générale'
                        : selectedConversation.participants.map((p) => p.name).join(', ')}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] mt-0.5 ${TYPE_COLORS[selectedConversation.type]}`}
                    >
                      {selectedConversation.type === 'ANNOUNCEMENT' && (
                        <Radio className="w-3 h-3 mr-1" />
                      )}
                      {selectedConversation.type === 'GROUP' && (
                        <Users className="w-3 h-3 mr-1" />
                      )}
                      {TYPE_LABELS[selectedConversation.type]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Messages list */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Chargement des messages...
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MessageCircle className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-3" />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Aucun message pour le moment.
                      </p>
                      <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                        Envoyez le premier message !
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                      ))}
                    </AnimatePresence>
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="border-t border-gray-100 dark:border-gray-800 p-3 shrink-0">
                <div className="flex items-end gap-2">
                  {/* Attachment button (UI only) */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
                    title="Joindre un fichier"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="sr-only">Joindre un fichier</span>
                  </Button>

                  {/* Textarea */}
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Écrire un message..."
                      disabled={isSending}
                      className="min-h-[36px] max-h-[120px] resize-none rounded-xl border-gray-200 dark:border-gray-700 text-sm pr-20 py-2"
                      rows={1}
                    />

                    {/* Quick templates */}
                    <DropdownMenu open={showTemplates} onOpenChange={setShowTemplates}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 bottom-1.5 h-6 text-[11px] text-gray-400 hover:text-emerald-600 px-2"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Modèles
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {QUICK_TEMPLATES.map((tmpl) => (
                          <DropdownMenuItem
                            key={tmpl.label}
                            onClick={() => applyTemplate(tmpl)}
                            className="text-sm cursor-pointer"
                          >
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {tmpl.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Send button */}
                  <Button
                    type="button"
                    onClick={sendMessage}
                    disabled={!messageText.trim() || isSending}
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="sr-only">Envoyer</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state - no conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Messagerie
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                  Sélectionnez une conversation pour commencer à discuter.
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Mobile layout ─────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Mobile chat header with back button */}
            <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 shrink-0 bg-white dark:bg-gray-900">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setSelectedConversationId(null)}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Retour</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {selectedConversation.type === 'ANNOUNCEMENT'
                    ? '📢 Annonce'
                    : selectedConversation.participants.map((p) => p.name).join(', ')}
                </h3>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${TYPE_COLORS[selectedConversation.type]}`}
                >
                  {TYPE_LABELS[selectedConversation.type]}
                </Badge>
              </div>
            </div>

            {/* Mobile messages */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <MessageCircle className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-2" />
                    <p className="text-sm text-gray-400">Aucun message.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}
                  </AnimatePresence>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Mobile input */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-2 shrink-0 bg-white dark:bg-gray-900">
              <div className="flex items-end gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-gray-400 shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  disabled={isSending}
                  className="min-h-[32px] max-h-[100px] resize-none rounded-xl border-gray-200 dark:border-gray-700 text-sm py-1.5"
                  rows={1}
                />
                <Button
                  type="button"
                  onClick={sendMessage}
                  disabled={!messageText.trim() || isSending}
                  size="icon"
                  className="h-8 w-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Mobile conversation list */
          <Card className="flex-1 flex flex-col rounded-2xl border-gray-200 dark:border-gray-800 overflow-hidden">
            <Card className="border-0 shadow-none rounded-none">
              <CardContent className="p-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      Messagerie
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      fetchPorteurs()
                      setShowNewConvDialog(true)
                    }}
                    className="h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs gap-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nouveau
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-9 h-8 rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
            <ScrollArea className="flex-1">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center px-4">
                  <MessageCircle className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400">Aucune conversation.</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Cliquez sur &quot;Nouveau&quot; pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5 p-2 pb-4">
                  {announcements.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Annonces
                      </p>
                      {announcements.map((conv) => (
                        <ConversationItem key={conv.id} conv={conv} />
                      ))}
                    </div>
                  )}
                  {directConversations.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Conversations
                      </p>
                      {directConversations.map((conv) => (
                        <ConversationItem key={conv.id} conv={conv} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* ── New Conversation Dialog ───────────────────────────────────── */}
      <Dialog open={showNewConvDialog} onOpenChange={setShowNewConvDialog}>
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Nouveau message
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {/* Broadcast toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <Checkbox
                id="broadcast-all"
                checked={broadcastAll}
                onCheckedChange={(checked) => {
                  setBroadcastAll(!!checked)
                  if (checked) setSelectedPorteurs([])
                }}
                className="border-amber-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label
                htmlFor="broadcast-all"
                className="text-sm font-medium text-amber-800 dark:text-amber-300 cursor-pointer"
              >
                Tous mes porteurs (annonce)
              </Label>
            </div>

            {/* Type selection */}
            <div>
              <Label className="text-xs font-medium text-gray-500 mb-2 block">
                Type de conversation
              </Label>
              <div className="flex gap-2">
                {(['INDIVIDUAL', 'ANNOUNCEMENT'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setNewConvType(type)
                      if (type === 'ANNOUNCEMENT') setBroadcastAll(true)
                    }}
                    disabled={broadcastAll}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all border ${
                      newConvType === type
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                    } ${broadcastAll && type === 'INDIVIDUAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {type === 'INDIVIDUAL' ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Individuel
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        Annonce
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Porteur selection (when not broadcast) */}
            {!broadcastAll && (
              <div>
                <Label className="text-xs font-medium text-gray-500 mb-2 block">
                  Sélectionner un ou plusieurs porteurs
                </Label>
                <ScrollArea className="max-h-48 rounded-xl border border-gray-200 dark:border-gray-700">
                  {porteurs.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400">
                      Chargement des porteurs...
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {porteurs.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selectedPorteurs.includes(p.id)}
                            onCheckedChange={() => togglePorteur(p.id)}
                          />
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={p.avatar} alt={p.name} />
                            <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-700">
                              {getInitials(p.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {p.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {selectedPorteurs.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    {selectedPorteurs.length} porteur{selectedPorteurs.length !== 1 ? 's' : ''} sélectionné{selectedPorteurs.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* First message */}
            <div>
              <Label className="text-xs font-medium text-gray-500 mb-2 block">
                Premier message
              </Label>
              <Textarea
                value={newConvMessage}
                onChange={(e) => setNewConvMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="min-h-[80px] resize-none rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={() => setShowNewConvDialog(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={createConversation}
              disabled={
                isCreatingConv ||
                !newConvMessage.trim() ||
                (!broadcastAll && selectedPorteurs.length === 0)
              }
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              {isCreatingConv ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Créer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
