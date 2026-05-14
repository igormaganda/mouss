'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/hooks/use-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Loader2,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────
interface AgendaEvent {
  id: string
  userId: string
  title: string
  description: string | null
  type: EventType
  status: EventStatus
  date: string
  endDate: string | null
  location: string | null
  createdAt: string
}

type EventType = 'milestone' | 'rendezvous' | 'deadline' | 'formation'
type EventStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled'

// ── Constants ────────────────────────────────────────────────────
const EVENT_TYPES: { value: EventType; label: string; color: string; bg: string }[] = [
  { value: 'milestone', label: 'Jalon', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { value: 'rendezvous', label: 'Rendez-vous', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { value: 'deadline', label: 'Échéance', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  { value: 'formation', label: 'Formation', color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
]

const EVENT_STATUSES: { value: EventStatus; label: string; color: string; bg: string; icon: typeof CheckCircle2 }[] = [
  { value: 'planned', label: 'Planifié', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: Clock },
  { value: 'in-progress', label: 'En cours', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  { value: 'completed', label: 'Terminé', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle2 },
  { value: 'cancelled', label: 'Annulé', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
]

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'milestone' as EventType,
  status: 'planned' as EventStatus,
  date: '',
  endDate: '',
  location: '',
}

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// ── Component ────────────────────────────────────────────────────
export default function AgendaPanel() {
  const userId = useAppStore((s) => s.userId)
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/agenda?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.events)) {
          setEvents(data.events)
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // ── Helpers ────────────────────────────────────────────────────
  const getTypeMeta = (t: EventType) =>
    EVENT_TYPES.find((et) => et.value === t) || EVENT_TYPES[0]

  const getStatusMeta = (s: EventStatus) =>
    EVENT_STATUSES.find((es) => es.value === s) || EVENT_STATUSES[0]

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date()

  // Group events by date (sorted chronologically)
  const groupedEvents = events
    .filter((e) => typeFilter === 'all' || e.type === typeFilter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<Record<string, AgendaEvent[]>>((acc, event) => {
      const key = formatDate(event.date)
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    }, {})

  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => {
      // Use the actual events to sort dates properly
      const aEvent = groupedEvents[a][0]
      const bEvent = groupedEvents[b][0]
      return new Date(aEvent.date).getTime() - new Date(bEvent.date).getTime()
    }
  )

  // ── CRUD Handlers ──────────────────────────────────────────────
  const openCreate = () => {
    setEditingEvent(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (event: AgendaEvent) => {
    setEditingEvent(event)
    setForm({
      title: event.title,
      description: event.description || '',
      type: event.type,
      status: event.status,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      location: event.location || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.date || !userId || isSaving) return
    setIsSaving(true)

    try {
      if (editingEvent) {
        // Update
        const res = await fetch('/api/agenda', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingEvent.id,
            title: form.title.trim(),
            description: form.description.trim() || null,
            type: form.type,
            status: form.status,
            date: new Date(form.date).toISOString(),
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
            location: form.location.trim() || null,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.event) {
            setEvents((prev) =>
              prev.map((e) => (e.id === editingEvent.id ? data.event : e))
            )
          }
        }
      } else {
        // Create
        const res = await fetch('/api/agenda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            title: form.title.trim(),
            description: form.description.trim() || null,
            type: form.type,
            status: form.status,
            date: new Date(form.date).toISOString(),
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
            location: form.location.trim() || null,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.event) {
            setEvents((prev) => [...prev, data.event])
          }
        }
      }
      setDialogOpen(false)
      setForm(EMPTY_FORM)
      setEditingEvent(null)
    } catch {
      // silent
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isDeleting) return
    setIsDeleting(id)
    try {
      const res = await fetch(`/api/agenda?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
      }
    } catch {
      // silent
    } finally {
      setIsDeleting(null)
    }
  }

  // ── Stats ──────────────────────────────────────────────────────
  const totalEvents = events.length
  const upcomingEvents = events.filter((e) => isUpcoming(e.date)).length
  const completedEvents = events.filter((e) => e.status === 'completed').length

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-4"
    >
      {/* Header + Stats */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                    Agenda & Planification
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gérez vos jalons, rendez-vous et échéances
                  </p>
                </div>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openCreate}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouvel événement</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEvent
                        ? 'Modifiez les détails de votre événement.'
                        : 'Planifiez un nouveau jalon, rendez-vous ou échéance.'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Titre *
                      </Label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Ex: Rendez-vous avec la CCI"
                        className="h-9 rounded-xl text-sm"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </Label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Détails supplémentaires..."
                        rows={3}
                        className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>

                    {/* Type + Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Type
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {EVENT_TYPES.map((t) => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                form.type === t.value
                                  ? `${t.bg} ${t.color} border-current`
                                  : 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Statut
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {EVENT_STATUSES.map((s) => {
                            const Icon = s.icon
                            return (
                              <button
                                key={s.value}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, status: s.value }))}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                                  form.status === s.value
                                    ? `${s.bg} ${s.color} border-current`
                                    : 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                {s.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Date + End Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Date de début *
                        </Label>
                        <Input
                          type="datetime-local"
                          value={form.date}
                          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                          className="h-9 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Date de fin
                        </Label>
                        <Input
                          type="datetime-local"
                          value={form.endDate}
                          onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                          className="h-9 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Lieu
                      </Label>
                      <Input
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="Ex: France Travail, 12 rue de la Paix, Paris"
                        className="h-9 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="rounded-xl"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={!form.title.trim() || !form.date || isSaving}
                      className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      {editingEvent ? 'Enregistrer' : 'Créer'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {totalEvents} événement{totalEvents !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {upcomingEvents} à venir
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {completedEvents} terminé{completedEvents !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            Tout
          </button>
          {EVENT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(typeFilter === t.value ? 'all' : t.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t.value
                  ? `${t.bg} ${t.color} border border-current`
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Events Timeline */}
      <motion.div variants={fadeIn} className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Aucun événement planifié.
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
              Créez votre premier événement pour organiser votre parcours !
            </p>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Aucun événement de ce type.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sortedDates.map((dateLabel) => (
              <div key={dateLabel} className="space-y-2">
                {/* Date Header */}
                <div className="flex items-center gap-2 sticky top-0 bg-background z-10 py-1">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {dateLabel}
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Events under this date */}
                {groupedEvents[dateLabel].map((event) => {
                  const typeMeta = getTypeMeta(event.type)
                  const statusMeta = getStatusMeta(event.status)
                  const StatusIcon = statusMeta.icon

                  return (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="group relative p-4 rounded-xl border bg-white dark:bg-gray-900 border-gray-100 hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700 transition-all"
                    >
                      {/* Top Row: Type badge + Status badge + Actions */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-2 py-0 ${typeMeta.bg} ${typeMeta.color}`}
                          >
                            {typeMeta.label}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-2 py-0 inline-flex items-center gap-1 ${statusMeta.bg} ${statusMeta.color}`}
                          >
                            <StatusIcon className="w-2.5 h-2.5" />
                            {statusMeta.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(event)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={isDeleting === event.id}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === event.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-sm font-medium mb-1 ${
                          event.status === 'completed'
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : event.status === 'cancelled'
                              ? 'line-through text-gray-300 dark:text-gray-600'
                              : 'text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {event.title}
                      </h4>

                      {/* Description */}
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Meta: Time + Location */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(event.date)}
                          {event.endDate && (
                            <> — {formatTime(event.endDate)}</>
                          )}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )
}
