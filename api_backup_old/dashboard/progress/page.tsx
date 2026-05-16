"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Circle, Lightbulb } from "lucide-react";

interface Task {
  id: string;
  phase: string;
  title: string;
  description: string | null;
  order: number;
  active: boolean;
}

interface UserProgress {
  id: string;
  taskId: string;
  completed: boolean;
  completedAt: string | null;
  task: Task;
}

const PHASES = [
  {
    key: "reflexion",
    label: "Réflexion",
    number: 1,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    description: "Définir votre projet, étudier le marché, valider votre idée",
  },
  {
    key: "creation",
    label: "Création",
    number: 2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    description: "Choisir votre statut, ouvrir les comptes, lancer l'activité",
  },
  {
    key: "gestion",
    label: "Gestion",
    number: 3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Gérer votre quotidien, comptabilite, relation client",
  },
  {
    key: "croissance",
    label: "Croissance",
    number: 4,
    color: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    borderColor: "border-violet-200 dark:border-violet-800",
    description: "Développer votre activite, recruter, scaler",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, progressRes] = await Promise.all([
        fetch("/api/admin/tasks"),
        fetch("/api/user/progress"),
      ]);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.filter((t: Task) => t.active));
      }
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (err) {
      console.error("Progress data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (taskId: string, currentCompleted: boolean) => {
    setToggling(taskId);
    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: !currentCompleted }),
      });

      if (res.ok) {
        setProgress((prev) => {
          const exists = prev.find((p) => p.taskId === taskId);
          if (exists) {
            return prev.map((p) =>
              p.taskId === taskId
                ? {
                    ...p,
                    completed: !currentCompleted,
                    completedAt: !currentCompleted ? new Date().toISOString() : null,
                  }
                : p
            );
          }
          return [
            ...prev,
            {
              id: `new-${taskId}`,
              taskId,
              completed: !currentCompleted,
              completedAt: !currentCompleted ? new Date().toISOString() : null,
              task: tasks.find((t) => t.id === taskId)!,
            },
          ];
        });
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-24 bg-muted rounded-lg" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Compute phase stats
  const phaseStats = PHASES.map((phase) => {
    const phaseTasks = tasks.filter((t) => t.phase === phase.key);
    const phaseProgress = progress.filter(
      (p) => p.task.phase === phase.key && p.completed
    );
    const total = phaseTasks.length;
    const completed = phaseProgress.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { ...phase, total, completed, percentage };
  });

  const totalCompleted = progress.filter((p) => p.completed).length;
  const totalTasks = tasks.length;
  const overallPercentage =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Find current phase (first non-100% phase)
  const currentPhaseKey =
    phaseStats.find((p) => p.total > 0 && p.percentage < 100)?.key || null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold">Ma Progression</h1>
        <p className="text-muted-foreground mt-1">
          Suivez vos étapes dans le parcours de création d&apos;entreprise
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Progression globale</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {overallPercentage}%
                  </span>
                </div>
                <Progress value={overallPercentage} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {totalCompleted} tâche{totalCompleted > 1 ? "s" : ""} terminée
                  {totalCompleted > 1 ? "s" : ""} sur {totalTasks}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {totalCompleted}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase Sections */}
      {phaseStats
        .filter((phase) => phase.total > 0)
        .map((phase) => {
          const isCurrent = phase.key === currentPhaseKey;
          const phaseTasks = tasks.filter((t) => t.phase === phase.key);

          return (
            <motion.div
              key={phase.key}
              variants={item}
              className={`rounded-xl border-2 p-4 sm:p-6 transition-all ${
                isCurrent
                  ? `${phase.bgColor} ${phase.borderColor} shadow-sm`
                  : "border-transparent"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      phase.percentage === 100
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : `${phase.bgColor} ${phase.color}`
                    }`}
                  >
                    {phase.percentage === 100 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{phase.number}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{phase.label}</h3>
                      {isCurrent && (
                        <Badge className="bg-emerald-600 text-white text-xs">
                          En cours
                        </Badge>
                      )}
                      {phase.percentage === 100 && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 text-xs dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                          Terminee
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:min-w-[140px]">
                  <span className="text-sm font-medium">{phase.percentage}%</span>
                  <Progress value={phase.percentage} className="h-2 flex-1" />
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {phaseTasks.map((task) => {
                  const taskProgress = progress.find(
                    (p) => p.taskId === task.id
                  );
                  const isCompleted = taskProgress?.completed || false;
                  const isToggling = toggling === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                        isCompleted ? "opacity-70" : ""
                      }`}
                    >
                      <button
                        className="mt-0.5 flex-shrink-0"
                        onClick={() => handleToggle(task.id, isCompleted)}
                        disabled={isToggling}
                      >
                        {isToggling ? (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-emerald-600 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isCompleted ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {taskProgress?.completedAt && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(taskProgress.completedAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

      {/* Empty state */}
      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucune tâche disponible</h2>
            <p className="text-muted-foreground">
              Les tâches seront disponibles une fois que l&apos;administrateur les aura configurées.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
