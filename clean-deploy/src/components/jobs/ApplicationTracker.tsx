"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  MoreVertical,
  GripVertical,
  Plus,
  Bell,
  FileText,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  MapPin,
} from "lucide-react";

// ===========================================
// Types
// ===========================================

export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  followUpDate?: string;
  reminder?: boolean;
  coverLetter?: string;
  url?: string;
  matchPercentage?: number;
}

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onNoteChange: (applicationId: string, notes: string) => void;
  onReminderToggle: (applicationId: string, enabled: boolean) => void;
  onDelete: (applicationId: string) => void;
  onAddApplication?: () => void;
  language?: "fr" | "ar";
}

// ===========================================
// Constants
// ===========================================

const STATUS_COLUMNS: {
  status: ApplicationStatus;
  label: string;
  labelAr: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    status: "saved",
    label: "Sauvegardées",
    labelAr: "محفوظة",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-600",
  },
  {
    status: "applied",
    label: "Candidatures",
    labelAr: "مقدم عليها",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
  },
  {
    status: "interviewing",
    label: "Entretiens",
    labelAr: "مقابلات",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-300 dark:border-amber-700",
  },
  {
    status: "offer",
    label: "Offres",
    labelAr: "عروض",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-300 dark:border-emerald-700",
  },
  {
    status: "rejected",
    label: "Refusées",
    labelAr: "مرفوضة",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    borderColor: "border-rose-300 dark:border-rose-700",
  },
];

// ===========================================
// Sortable Application Card Component
// ===========================================

interface SortableApplicationCardProps {
  application: JobApplication;
  onEditNotes: (id: string) => void;
  onToggleReminder: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  language: "fr" | "ar";
}

function SortableApplicationCard({
  application,
  onEditNotes,
  onToggleReminder,
  onDelete,
  language,
}: SortableApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-MA" : "fr-MA", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const isFollowUpDue =
    application.followUpDate &&
    new Date(application.followUpDate) <= new Date() &&
    application.status !== "offer" &&
    application.status !== "rejected";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group relative touch-none",
        isDragging && "z-50"
      )}
    >
      <Card
        className={cn(
          "border-2 transition-all duration-200 hover:shadow-lg",
          isDragging && "shadow-xl ring-2 ring-purple-500 ring-offset-2",
          application.status === "offer"
            ? "border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900"
            : application.status === "rejected"
            ? "border-rose-200 dark:border-rose-800 opacity-75"
            : "border-gray-200 dark:border-gray-700"
        )}
      >
        <CardContent className="p-3 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
              >
                <GripVertical className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate">{application.jobTitle}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{application.company}</span>
                </div>
              </div>
            </div>

            {/* Match Badge */}
            {application.matchPercentage !== undefined && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs flex-shrink-0",
                  application.matchPercentage >= 70
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : application.matchPercentage >= 50
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                <Star className="w-3 h-3 mr-1" />
                {application.matchPercentage}%
              </Badge>
            )}
          </div>

          {/* Location & Date */}
          <div className="flex items-center justify-between text-xs text-gray-500 pl-6">
            {application.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{application.location}</span>
              </div>
            )}
            {application.appliedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(application.appliedAt)}</span>
              </div>
            )}
          </div>

          {/* Follow-up Reminder */}
          {(isFollowUpDue || application.reminder) && (
            <div
              className={cn(
                "flex items-center gap-2 text-xs p-2 rounded-lg",
                isFollowUpDue
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
            >
              <Bell className="w-3 h-3" />
              <span>
                {isFollowUpDue
                  ? language === "ar"
                    ? "موعد المتابعة!"
                    : "Suivi à faire!"
                  : language === "ar"
                  ? "تذكير مفعل"
                  : "Rappel activé"}
              </span>
            </div>
          )}

          {/* Notes Preview */}
          {application.notes && (
            <p className="text-xs text-gray-500 line-clamp-2 pl-6">
              {application.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 pl-6">
            <div className="flex items-center gap-1">
              {application.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => window.open(application.url, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
              {application.coverLetter && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEditNotes(application.id)}
                >
                  <FileText className="w-3 h-3" />
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEditNotes(application.id)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  {language === "ar" ? "تعديل الملاحظات" : "Modifier les notes"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleReminder(application.id, !application.reminder)}>
                  <Bell className="w-4 h-4 mr-2" />
                  {application.reminder
                    ? language === "ar"
                      ? "إلغاء التذكير"
                      : "Désactiver le rappel"
                    : language === "ar"
                    ? "تفعيل التذكير"
                    : "Activer le rappel"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-600"
                  onClick={() => onDelete(application.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === "ar" ? "حذف" : "Supprimer"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===========================================
// Kanban Column Component
// ===========================================

interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  applications: JobApplication[];
  onEditNotes: (id: string) => void;
  onToggleReminder: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  language: "fr" | "ar";
}

function KanbanColumn({
  status,
  label,
  color,
  bgColor,
  borderColor,
  applications,
  onEditNotes,
  onToggleReminder,
  onDelete,
  language,
}: KanbanColumnProps) {
  const applicationIds = applications.map((a) => a.id);

  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[320px]">
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-t-xl border-2 border-b-0",
          bgColor,
          borderColor
        )}
      >
        <div className="flex items-center gap-2">
          {status === "saved" && <Star className={cn("w-4 h-4", color)} />}
          {status === "applied" && <Briefcase className={cn("w-4 h-4", color)} />}
          {status === "interviewing" && <MessageSquare className={cn("w-4 h-4", color)} />}
          {status === "offer" && <CheckCircle2 className={cn("w-4 h-4", color)} />}
          {status === "rejected" && <XCircle className={cn("w-4 h-4", color)} />}
          <h3 className={cn("font-semibold text-sm", color)}>{label}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {applications.length}
        </Badge>
      </div>

      {/* Column Content */}
      <div
        className={cn(
          "flex-1 border-2 border-t-0 rounded-b-xl p-2",
          borderColor,
          "bg-gray-50/50 dark:bg-gray-900/50"
        )}
      >
        <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px]">
          <SortableContext
            items={applicationIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 pr-2">
              <AnimatePresence mode="popLayout">
                {applications.map((application) => (
                  <SortableApplicationCard
                    key={application.id}
                    application={application}
                    onEditNotes={onEditNotes}
                    onToggleReminder={onToggleReminder}
                    onDelete={onDelete}
                    language={language}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}

// ===========================================
// Notes Editor Dialog
// ===========================================

interface NotesEditorProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (applicationId: string, notes: string, followUpDate?: string) => void;
  language: "fr" | "ar";
}

function NotesEditor({
  application,
  isOpen,
  onClose,
  onSave,
  language,
}: NotesEditorProps) {
  const [notes, setNotes] = React.useState("");
  const [followUpDate, setFollowUpDate] = React.useState("");

  React.useEffect(() => {
    if (application) {
      setNotes(application.notes || "");
      setFollowUpDate(
        application.followUpDate
          ? new Date(application.followUpDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [application]);

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-purple-500" />
            {language === "ar" ? "تعديل الملاحظات" : "Modifier les notes"}
          </DialogTitle>
          <DialogDescription>
            {application.jobTitle} - {application.company}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === "ar" ? "ملاحظات" : "Notes"}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === "ar"
                  ? "أضف ملاحظاتك هنا..."
                  : "Ajoutez vos notes ici..."
              }
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === "ar" ? "تاريخ المتابعة" : "Date de suivi"}
            </label>
            <Input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {language === "ar" ? "إلغاء" : "Annuler"}
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-purple-600"
              onClick={() => {
                onSave(application.id, notes, followUpDate || undefined);
                onClose();
              }}
            >
              {language === "ar" ? "حفظ" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===========================================
// Main ApplicationTracker Component
// ===========================================

export function ApplicationTracker({
  applications,
  onStatusChange,
  onNoteChange,
  onReminderToggle,
  onDelete,
  onAddApplication,
  language = "fr",
}: ApplicationTrackerProps) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [editingApplication, setEditingApplication] =
    React.useState<JobApplication | null>(null);
  const [isNotesEditorOpen, setIsNotesEditorOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const applicationsByStatus = React.useMemo(() => {
    const result: Record<ApplicationStatus, JobApplication[]> = {
      saved: [],
      applied: [],
      interviewing: [],
      offer: [],
      rejected: [],
    };

    applications.forEach((app) => {
      result[app.status].push(app);
    });

    return result;
  }, [applications]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeApplication = applications.find((a) => a.id === active.id);
    if (!activeApplication) return;

    // Find the status of the over element (column)
    let newStatus: ApplicationStatus | null = null;

    // Check if dropped on another card
    const overApplication = applications.find((a) => a.id === over.id);
    if (overApplication) {
      newStatus = overApplication.status;
    } else {
      // Check if dropped on a column
      const columnStatus = STATUS_COLUMNS.find((col) => col.status === over.id);
      if (columnStatus) {
        newStatus = columnStatus.status;
      }
    }

    if (newStatus && newStatus !== activeApplication.status) {
      onStatusChange(activeApplication.id, newStatus);
    }
  };

  const activeApplication = activeId
    ? applications.find((a) => a.id === activeId)
    : null;

  const handleEditNotes = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (app) {
      setEditingApplication(app);
      setIsNotesEditorOpen(true);
    }
  };

  const handleSaveNotes = (
    applicationId: string,
    notes: string,
    followUpDate?: string
  ) => {
    onNoteChange(applicationId, notes);
    // You might want to add a separate handler for followUpDate
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "تتبع الطلبات" : "Suivi des candidatures"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {applications.length}{" "}
              {language === "ar" ? "طلب" : "candidatures"}
            </p>
          </div>

          {onAddApplication && (
            <Button
              className="bg-gradient-to-r from-purple-500 to-purple-600"
              onClick={onAddApplication}
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === "ar" ? "إضافة" : "Ajouter"}
            </Button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          {STATUS_COLUMNS.map((col) => {
            const count = applicationsByStatus[col.status].length;
            return (
              <div
                key={col.status}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                  col.bgColor
                )}
              >
                {col.status === "saved" && (
                  <Star className={cn("w-4 h-4", col.color)} />
                )}
                {col.status === "applied" && (
                  <Briefcase className={cn("w-4 h-4", col.color)} />
                )}
                {col.status === "interviewing" && (
                  <MessageSquare className={cn("w-4 h-4", col.color)} />
                )}
                {col.status === "offer" && (
                  <CheckCircle2 className={cn("w-4 h-4", col.color)} />
                )}
                {col.status === "rejected" && (
                  <XCircle className={cn("w-4 h-4", col.color)} />
                )}
                <span className={col.color}>
                  {language === "ar" ? col.labelAr : col.label}: {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={language === "ar" ? col.labelAr : col.label}
              color={col.color}
              bgColor={col.bgColor}
              borderColor={col.borderColor}
              applications={applicationsByStatus[col.status]}
              onEditNotes={handleEditNotes}
              onToggleReminder={onReminderToggle}
              onDelete={onDelete}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeApplication && (
          <Card className="w-[280px] shadow-xl border-2 border-purple-400">
            <CardContent className="p-3 space-y-2">
              <h4 className="font-medium text-sm">{activeApplication.jobTitle}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Building2 className="w-3 h-3" />
                <span>{activeApplication.company}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </DragOverlay>

      {/* Notes Editor Dialog */}
      <NotesEditor
        application={editingApplication}
        isOpen={isNotesEditorOpen}
        onClose={() => {
          setIsNotesEditorOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveNotes}
        language={language}
      />
    </DndContext>
  );
}

export default ApplicationTracker;
