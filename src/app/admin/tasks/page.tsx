"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PhaseBadge } from "@/components/admin/stat-badge";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

interface Task {
  id: string;
  phase: string;
  title: string;
  description: string | null;
  order: number;
  active: boolean;
}

const phases = [
  { value: "reflexion", label: "Réflexion", color: "bg-violet-500" },
  { value: "creation", label: "Création", color: "bg-amber-500" },
  { value: "gestion", label: "Gestion", color: "bg-sky-500" },
  { value: "croissance", label: "Croissance", color: "bg-emerald-500" },
];

function SortableTaskItem({
  task,
  onEdit,
  onDelete,
  onToggle,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50 ${
        !task.active ? "opacity-50" : ""
      }`}
    >
      <button
        className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">#{task.order + 1}</span>
          <p className={`text-sm font-medium ${!task.active ? "line-through" : ""}`}>
            {task.title}
          </p>
        </div>
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Switch
          checked={task.active}
          onCheckedChange={(checked) => onToggle(task.id, checked)}
          className="scale-75"
        />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-600 hover:text-red-700"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [activePhase, setActivePhase] = useState("reflexion");
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: "", description: "", phase: "reflexion" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: () => fetcher("/api/admin/tasks"),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const isEdit = !!data.id;
      const { id, ...payload } = data;
      const res = await fetch("/api/admin/tasks", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? { id, ...payload }
            : { ...payload, order: tasks?.filter((t: Task) => t.phase === activePhase).length || 0 }
        ),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success(editingTask ? "Tâche mise à jour" : "Tâche créée");
      setShowDialog(false);
      setEditingTask(null);
      setForm({ title: "", description: "", phase: activePhase });
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Tâche supprimée");
      setDeleteId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (reorderedTasks: Task[]) => {
      const updates = reorderedTasks.map((task, index) => ({
        id: task.id,
        order: index,
      }));
      const res = await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates[0]), // Update one by one in practice
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const phaseTasks = tasks?.filter((t: Task) => t.phase === activePhase) || [];
    const oldIndex = phaseTasks.findIndex((t: Task) => t.id === active.id);
    const newIndex = phaseTasks.findIndex((t: Task) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(phaseTasks, oldIndex, newIndex);
      reordered.forEach((task, index) => {
        if (task.order !== index) {
          fetch("/api/admin/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: task.id, order: index }),
          });
        }
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    }
  };

  const handleOpenNew = () => {
    setEditingTask(null);
    setForm({ title: "", description: "", phase: activePhase });
    setShowDialog(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || "", phase: task.phase });
    setShowDialog(true);
  };

  const handleSave = () => {
    saveMutation.mutate(
      editingTask ? { ...form, id: editingTask.id } : form
    );
  };

  const phaseTasks = tasks?.filter((t: Task) => t.phase === activePhase) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tâches</h1>
          <p className="text-muted-foreground mt-1">
            Organiser les étapes du parcours entrepreneur
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une tâche
        </Button>
      </div>

      {/* Phase Tabs */}
      <div className="flex flex-wrap gap-2">
        {phases.map((phase) => (
          <Button
            key={phase.value}
            variant={activePhase === phase.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePhase(phase.value)}
            className="gap-2"
          >
            <span className={`h-2 w-2 rounded-full ${phase.color}`} />
            {phase.label}
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {tasks?.filter((t: Task) => t.phase === phase.value).length || 0}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Sortable Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : phaseTasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={phaseTasks.map((t: Task) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {phaseTasks.map((task: Task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={setDeleteId}
                  onToggle={(id, active) => toggleMutation.mutate({ id, active })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Aucune tâche dans cette phase</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une tâche
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Mettre à jour la tâche" : "Créer une étape du parcours"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Titre de la tâche"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Description de la tâche"
              />
            </div>
            <div className="space-y-2">
              <Label>Phase</Label>
              <div className="flex flex-wrap gap-2">
                {phases.map((phase) => (
                  <Button
                    key={phase.value}
                    type="button"
                    variant={form.phase === phase.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm({ ...form, phase: phase.value })}
                  >
                    {phase.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
