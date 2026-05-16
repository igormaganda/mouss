"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

// Force dynamic rendering for this page since it uses useSession()
export const dynamic = 'force-dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewsletterSettings from "@/components/newsletter-settings";
import {
  Home,
  Wrench,
  ClipboardCheck,
  FileText,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  ArrowRight,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Rocket,
  Menu,
  Sparkles,
  Shield,
  CreditCard,
  TrendingUp,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type TabId = "overview" | "tools" | "audits" | "invoices" | "notifications" | "account";

interface AuditResult {
  id: string;
  profile: string;
  phase: string;
  painPoint: string;
  score: number;
  summary: string | null;
  bankRec: string | null;
  comptaRec: string | null;
  insurRec: string | null;
  createdAt: string;
}

interface ToolItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  category: string;
  rating: number;
  website: string | null;
  affiliateUrl: string | null;
  pricing: string;
  userStatus: string | null;
  userRating: number | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  priority: string;
  read: boolean;
  readAt: string | null;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
}

interface Recommendation {
  tool: {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    category: string;
    rating: number;
    pricing: string;
    website: string | null;
    affiliateUrl: string | null;
  };
  score: number;
  reason: string;
  urgency: string;
}

interface OrderItem {
  id: string;
  packName: string;
  amount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const PROFILE_LABELS: Record<string, string> = {
  etudiant: "Étudiant",
  salarie: "Salarié",
  freelance: "Freelance",
  "tpe-pme": "TPE / PME",
  "auto-entrepreneur": "Auto-Entrepreneur",
  eurl: "EURL",
  sasu: "SASU",
  sarl: "SARL",
  startup: "Startup",
  artisan: "Artisan",
  commercial: "Commercial",
  liberal: "Profession Liberale",
};

const PHASE_LABELS: Record<string, string> = {
  reflexion: "Réflexion",
  creation: "Création",
  gestion: "Gestion",
  croissance: "Croissance",
};

const CATEGORY_LABELS: Record<string, string> = {
  bank: "Banque",
  compta: "Comptabilité",
  assurance: "Assurance",
  marketing: "Marketing",
  juridique: "Juridique",
  other: "Autres",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  bank: "from-amber-400 to-orange-500",
  compta: "from-violet-400 to-purple-500",
  assurance: "from-rose-400 to-pink-500",
  marketing: "from-cyan-400 to-teal-500",
  juridique: "from-emerald-400 to-green-500",
  other: "from-gray-400 to-slate-500",
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  suggested: { label: "Suggere", variant: "secondary", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  adopted: { label: "Adopte", variant: "default", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  dismissed: { label: "Rejete", variant: "destructive", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  rated: { label: "Note", variant: "outline", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

const URGENCY_CONFIG: Record<string, { label: string; className: string }> = {
  critique: { label: "Critique", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
  haute: { label: "Haute", className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" },
  normale: { label: "Normale", className: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800" },
  basse: { label: "Basse", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
};

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  urgent: AlertCircle,
  recommendation: Lightbulb,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  info: "text-sky-500 bg-sky-100 dark:bg-sky-900/30",
  success: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
  warning: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
  urgent: "text-red-500 bg-red-100 dark:bg-red-900/30",
  recommendation: "text-violet-500 bg-violet-100 dark:bg-violet-900/30",
};

const SIDEBAR_ITEMS: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: "overview", label: "Vue d'ensemble", icon: Home },
  { id: "tools", label: "Outils", icon: Wrench },
  { id: "audits", label: "Audits", icon: ClipboardCheck },
  { id: "invoices", label: "Factures", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Mon Compte", icon: User },
];

const ONBOARDING_PROFILES = ["Étudiant", "Salarié", "Freelance", "TPE / PME"];
const ONBOARDING_PHASES = ["Réflexion", "Création", "Gestion", "Croissance"];
const ONBOARDING_GOALS = ["Financement", "Comptabilité", "Juridique", "Marketing", "Recrutement", "Assurance"];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER: time ago
   ═══════════════════════════════════════════════════════════════════════════ */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "A l'instant";
  if (mins < 60) return `Il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

/* ═══════════════════════════════════════════════════════════════════════════
   SAFE NUMBER FORMATTING
   ═══════════════════════════════════════════════════════════════════════════ */

function safeToFixed(value: unknown, digits: number = 1): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  return num.toFixed(digits);
}

function safeRating(rating: unknown): number {
  return typeof rating === 'number' && !isNaN(rating) ? rating : 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const userName = session?.user?.name || "Entrepreneur";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* ── Queries ────────────────────────────────────────────────────────────── */

  const { data: onboardingData } = useQuery({
    queryKey: ["onboarding"],
    queryFn: () => fetch("/api/user/onboarding").then((r) => r.json()),
  });

  const onboardingDone = onboardingData?.onboardingDone ?? false;
  const onboardingStep = onboardingData?.onboardingStep ?? 0;

  useEffect(() => {
    if (onboardingStep < 4 && !onboardingDone) {
      setOnboardingOpen(true);
    }
  }, [onboardingStep, onboardingDone]);

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ["user-audit"],
    queryFn: () => fetch("/api/user/audit").then((r) => r.json()),
  });

  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ["user-tools"],
    queryFn: () => fetch("/api/user/tools").then((r) => r.json()),
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["user-progress"],
    queryFn: () => fetch("/api/user/progress").then((r) => r.json()),
  });

  const { data: notifsData, isLoading: notifsLoading } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => fetch("/api/user/notifications?limit=50").then((r) => r.json()),
  });

  const { data: recsData, isLoading: recsLoading } = useQuery({
    queryKey: ["user-recommendations"],
    queryFn: () => fetch("/api/user/recommendations").then((r) => r.json()),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => fetch("/api/user/orders").then((r) => r.json()),
  });

  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["user-account"],
    queryFn: () => fetch("/api/user/account").then((r) => r.json()),
  });

  /* ── Mutations ──────────────────────────────────────────────────────────── */

  const markReadMutation = useMutation({
    mutationFn: (ids: string[]) =>
      fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
  });

  const updateToolMutation = useMutation({
    mutationFn: (data: { toolId: string; status: string }) =>
      fetch("/api/user/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-tools"] });
      queryClient.invalidateQueries({ queryKey: ["user-recommendations"] });
      toast.success("Statut de l'outil mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  /* ── Derived data ───────────────────────────────────────────────────────── */

  const auditResult: AuditResult | null = auditData?.auditResult ?? null;
  const tools: ToolItem[] = toolsData?.tools ?? [];
  const progress = progressData ?? [];
  const notifications: Notification[] = notifsData?.notifications ?? [];
  const unreadCount: number = notifsData?.unreadCount ?? 0;
  const recommendations: Recommendation[] = recsData?.recommendations ?? [];
  const orders: OrderItem[] = ordersData?.orders ?? [];

  const completedTasks = progress.filter((p: { completed: boolean }) => p.completed).length;
  const totalTasks = progress.length;
  const adoptedTools = tools.filter((t) => t.userStatus === "adopted" || t.userStatus === "rated").length;

  /* ── Render helpers ─────────────────────────────────────────────────────── */

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 flex items-center gap-3">
        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
          <Rocket className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight truncate">Créa Entreprise</div>
          <div className="text-xs text-muted-foreground leading-tight"> </div>
        </div>
      </div>
      <Separator />
      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left ${
              activeTab === item.id
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.id === "notifications" && unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      <Separator />
      {/* User info */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-900/30 dark:text-emerald-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 mt-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </Button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: OVERVIEW
     ═══════════════════════════════════════════════════════════════════════════ */

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome + Onboarding CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Bienvenue, {userName.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {onboardingDone
                ? "Voici un apercu de votre parcours entrepreneurial."
                : "Complétez votre profil pour des recommandations personnalisées."}
            </p>
          </div>
          {!onboardingDone && (
            <Button
              onClick={() => setOnboardingOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Compléter votre profil
            </Button>
          )}
        </div>
      </motion.div>

      {/* Onboarding CTA card */}
      {!onboardingDone && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-teal-950/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Complétez votre profil entrepreneurial</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Répondez à 4 questions courtes pour recevoir des recommandations d&apos;outils adaptées à votre situation.
                </p>
              </div>
              <Button
                onClick={() => setOnboardingOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shrink-0"
              >
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Regulated Professions Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 dark:border-rose-800 dark:from-rose-950/30 dark:to-amber-950/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Votre métier est réglementé ?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Diplômes, autorisations, obligations spécifiques. Découvrez les démarches pour 25 métiers réglementés en France.
              </p>
            </div>
            <a href="/metiers-reglementes" target="_blank">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white gap-2 shrink-0">
                <Shield className="h-4 w-4" />
                Voir les métiers
              </Button>
            </a>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Score Audit",
            value: auditResult ? `${auditResult.score}/100` : "—",
            icon: ClipboardCheck,
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
            loading: auditLoading,
          },
          {
            label: "Outils Adoptes",
            value: adoptedTools,
            icon: Wrench,
            color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
            loading: toolsLoading,
          },
          {
            label: "Tâches Complétées",
            value: `${completedTasks}/${totalTasks}`,
            icon: CheckCircle,
            color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
            loading: progressLoading,
          },
          {
            label: "Notifications",
            value: unreadCount,
            icon: Bell,
            color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
            loading: notifsLoading,
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                {kpi.loading ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                      <kpi.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Recommandations pour vous
              </h2>
              <p className="text-sm text-muted-foreground">
                Outils selectionnes selon votre profil
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setActiveTab("tools")}>
              Voir tout <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, i) => {
              const tool = rec.tool;
              const gradient = CATEGORY_GRADIENTS[tool.category] || "from-gray-400 to-slate-500";
              const urgency = URGENCY_CONFIG[rec.urgency] || URGENCY_CONFIG.normale;
              return (
                <motion.div key={rec.tool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}>
                  <Card className="group hover:shadow-md transition-shadow h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white font-bold text-sm shrink-0`}>
                          {tool.name.charAt(0)}
                        </div>
                        <Badge variant="outline" className={urgency.className + " text-[10px] px-2"}>
                          {urgency.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-3">{tool.name}</CardTitle>
                      {tool.tagline && <CardDescription className="text-sm">{tool.tagline}</CardDescription>}
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => updateToolMutation.mutate({ toolId: tool.id, status: "adopted" })}
                      >
                        Adopter
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent notifications */}
      {notifications.filter((n) => !n.read).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Notifications recentes</h2>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setActiveTab("notifications")}>
              Voir tout <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((n) => !n.read)
                  .slice(0, 5)
                  .map((notif) => {
                    const IconComp = NOTIFICATION_ICONS[notif.type] || Info;
                    const colorClass = NOTIFICATION_COLORS[notif.type] || NOTIFICATION_COLORS.info;
                    return (
                      <button
                        key={notif.id}
                        className="w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                        onClick={() => {
                          markReadMutation.mutate([notif.id]);
                          if (notif.actionUrl) {
                            window.location.href = notif.actionUrl;
                          }
                        }}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${colorClass}`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{notif.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(notif.createdAt)}</span>
                      </button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="text-lg font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/audit">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Audit Gratuit</p>
                  <p className="text-xs text-muted-foreground">Découvrez votre score</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
          <button onClick={() => setActiveTab("tools")}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Mes Outils</p>
                  <p className="text-xs text-muted-foreground">{adoptedTools} outil(s) adopte(s)</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </button>
          <button onClick={() => setActiveTab("invoices")}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Mes Factures</p>
                  <p className="text-xs text-muted-foreground">Historique de commandes</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </button>
        </div>
      </motion.div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: TOOLS
     ═══════════════════════════════════════════════════════════════════════════ */

  const ToolsTab = () => {
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const categories = ["all", ...new Set(tools.map((t) => t.category))];
    const filteredTools = tools.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (statusFilter !== "all") {
        if (statusFilter === "suggested" && t.userStatus && t.userStatus !== "suggested") return false;
        if (statusFilter !== "suggested" && t.userStatus !== statusFilter) return false;
      }
      return true;
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Outils Recommandes</h1>
          <p className="text-muted-foreground mt-1">Découvrez et adoptez les outils adaptés à votre profil</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "bank", "compta", "assurance", "marketing", "juridique", "other"].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className={categoryFilter === cat ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {cat === "all" ? "Tous" : (CATEGORY_LABELS[cat] || cat)}
            </Button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "suggested", "adopted", "dismissed", "rated"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {s === "all" ? "Tous" : STATUS_CONFIG[s]?.label || s}
            </Button>
          ))}
        </div>

        {toolsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-9 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun outil ne correspond a vos filtres.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => {
                const gradient = CATEGORY_GRADIENTS[tool.category] || "from-gray-400 to-slate-500";
                const statusCfg = tool.userStatus ? STATUS_CONFIG[tool.userStatus] : null;
                return (
                  <motion.div key={tool.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white font-bold text-sm`}>
                              {tool.name.charAt(0)}
                            </div>
                            <Badge variant="secondary" className="text-[10px]">
                              {CATEGORY_LABELS[tool.category] || tool.category}
                            </Badge>
                          </div>
                          {statusCfg && (
                            <Badge variant="outline" className={statusCfg.className}>
                              {statusCfg.label}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base mt-2">{tool.name}</CardTitle>
                        {tool.tagline && <CardDescription className="text-sm">{tool.tagline}</CardDescription>}
                      </CardHeader>
                      <CardContent className="mt-auto pt-0 space-y-3">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= Math.round(tool.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{safeToFixed(tool.rating, 1)}</span>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2">
                          {(!tool.userStatus || tool.userStatus === "suggested") && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                onClick={() => updateToolMutation.mutate({ toolId: tool.id, status: "adopted" })}
                              >
                                Adopter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => updateToolMutation.mutate({ toolId: tool.id, status: "dismissed" })}
                              >
                                Rejeter
                              </Button>
                            </>
                          )}
                          {tool.userStatus === "adopted" && (
                            <Button size="sm" variant="outline" className="flex-1 text-xs" disabled>
                              <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                              Adopte
                            </Button>
                          )}
                          {tool.userStatus === "dismissed" && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                onClick={() => updateToolMutation.mutate({ toolId: tool.id, status: "adopted" })}
                              >
                                Reconsiderer
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs" disabled>
                                Rejete
                              </Button>
                            </>
                          )}
                          {tool.userStatus === "rated" && (
                            <Button size="sm" variant="outline" className="flex-1 text-xs" disabled>
                              <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                              Note
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: AUDITS
     ═══════════════════════════════════════════════════════════════════════════ */

  const AuditsTab = () => {
    if (auditLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card><CardContent className="p-8"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      );
    }

    if (!auditResult) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Mes Audits</h1>
            <p className="text-muted-foreground mt-1">Historique et resultats de vos audits</p>
          </div>
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun audit réalisé</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Passez votre audit gratuit pour obtenir un score personnalisable et des recommandations d&apos;outils adaptées.
              </p>
              <Link href="/audit">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Commencer l&apos;audit gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    const scoreColor =
      auditResult.score >= 80
        ? "text-emerald-500"
        : auditResult.score >= 50
          ? "text-amber-500"
          : "text-red-500";

    const scoreStroke =
      auditResult.score >= 80
        ? "stroke-emerald-500"
        : auditResult.score >= 50
          ? "stroke-amber-500"
          : "stroke-red-500";

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (auditResult.score / 100) * circumference;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Audits</h1>
          <p className="text-muted-foreground mt-1">Resultats et recommandations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score gauge */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h3 className="font-semibold mb-4">Score Global</h3>
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    strokeWidth="8" strokeLinecap="round"
                    className={scoreStroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{auditResult.score}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">sur 100</p>
              <Badge
                variant="outline"
                className={`mt-3 ${
                  auditResult.score >= 80
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : auditResult.score >= 50
                      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {auditResult.score >= 80 ? "Excellent" : auditResult.score >= 50 ? "Bon depart" : "A ameliorer"}
              </Badge>
            </CardContent>
          </Card>

          {/* Profile info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Votre Profil Entrepreneurial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Profil</p>
                  <p className="font-medium">{PROFILE_LABELS[auditResult.profile] || auditResult.profile}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Phase</p>
                  <p className="font-medium">{PHASE_LABELS[auditResult.phase] || auditResult.phase}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Point de douleur</p>
                  <p className="font-medium capitalize">{auditResult.painPoint}</p>
                </div>
              </div>

              {auditResult.summary && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">{auditResult.summary}</p>
                </>
              )}

              <Separator className="my-4" />

              <h4 className="font-medium text-sm mb-3">Recommandations</h4>
              <div className="space-y-2">
                {auditResult.bankRec && (
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 shrink-0 mt-0.5">
                      <CreditCard className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Banque</p>
                      <p className="text-sm font-medium">{auditResult.bankRec}</p>
                    </div>
                  </div>
                )}
                {auditResult.comptaRec && (
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 shrink-0 mt-0.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Comptabilité</p>
                      <p className="text-sm font-medium">{auditResult.comptaRec}</p>
                    </div>
                  </div>
                )}
                {auditResult.insurRec && (
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 shrink-0 mt-0.5">
                      <Shield className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Assurance</p>
                      <p className="text-sm font-medium">{auditResult.insurRec}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refaire l'audit */}
        <div className="flex justify-center">
          <Link href="/audit">
            <Button variant="outline" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Refaire l&apos;audit
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: INVOICES
     ═══════════════════════════════════════════════════════════════════════════ */

  const InvoicesTab = () => {
    const statusBadge = (status: string) => {
      const cfg: Record<string, { label: string; className: string }> = {
        paid: { label: "Paye", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
        pending: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
        failed: { label: "Echoue", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
        active: { label: "Actif", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      };
      const c = cfg[status] || cfg.pending;
      return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
    };

    if (ordersLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mes Factures</h1>
            <p className="text-muted-foreground mt-1">Historique de vos commandes et paiements</p>
          </div>
          <Link href="/tarifs">
            <Button variant="outline" className="gap-2">
              Voir les offres
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucune facture</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Vous n&apos;avez encore effectue aucune commande. Découvrez nos packs pour accompagner votre parcours entrepreneurial.
              </p>
              <Link href="/tarifs">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Sparkles className="h-4 w-4" />
                  Voir les offres
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Pack</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Montant</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Facture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4 font-medium">{order.packName}</td>
                        <td className="p-4">
                          {order.amount === 0 ? (
                            <span className="text-emerald-600 font-medium">Gratuit</span>
                          ) : (
                            <span className="font-medium">{order.amount / 100}€</span>
                          )}
                        </td>
                        <td className="p-4">{statusBadge(order.paymentStatus || order.status)}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="text-xs gap-1" disabled>
                            <FileText className="h-3.5 w-3.5" />
                            Telecharger
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: NOTIFICATIONS
     ═══════════════════════════════════════════════════════════════════════════ */

  const NotificationsTab = () => {
    const [notifFilter, setNotifFilter] = useState("all");
    const [showCount, setShowCount] = useState(10);

    const filteredNotifs = notifications.filter((n) => {
      if (notifFilter === "unread" && n.read) return false;
      if (notifFilter === "tools" && n.category !== "tools") return false;
      if (notifFilter === "audit" && n.category !== "audit") return false;
      if (notifFilter === "billing" && n.category !== "billing") return false;
      if (notifFilter === "system" && n.category !== "system") return false;
      return true;
    });

    const visibleNotifs = filteredNotifs.slice(0, showCount);
    const hasMore = showCount < filteredNotifs.length;

    const unreadIds = filteredNotifs.filter((n) => !n.read).map((n) => n.id);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount} notification{unreadCount !== 1 ? "s" : ""} non lue{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markReadMutation.mutate(unreadIds)}
            >
              <CheckCircle className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Tous" },
            { key: "unread", label: "Non lues" },
            { key: "tools", label: "Outils" },
            { key: "audit", label: "Audit" },
            { key: "billing", label: "Facturation" },
            { key: "system", label: "Système" },
          ].map((f) => (
            <Button
              key={f.key}
              variant={notifFilter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifFilter(f.key)}
              className={notifFilter === f.key ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {notifsLoading ? (
          <Card>
            <CardContent className="p-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : visibleNotifs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune notification ne correspond a votre filtre.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {visibleNotifs.map((notif) => {
                    const IconComp = NOTIFICATION_ICONS[notif.type] || Info;
                    const colorClass = NOTIFICATION_COLORS[notif.type] || NOTIFICATION_COLORS.info;
                    return (
                      <button
                        key={notif.id}
                        className={`w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${
                          !notif.read ? "bg-emerald-50/50 dark:bg-emerald-950/10" : ""
                        }`}
                        onClick={() => {
                          if (!notif.read) {
                            markReadMutation.mutate([notif.id]);
                          }
                          if (notif.actionUrl) {
                            window.location.href = notif.actionUrl;
                          }
                        }}
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${colorClass}`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            )}
                            <p className={`text-sm truncate ${!notif.read ? "font-semibold" : "font-medium"}`}>
                              {notif.title}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                          {notif.actionLabel && notif.actionUrl && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                              {notif.actionLabel} →
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-1">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {hasMore && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setShowCount((c) => c + 10)}>
                  Charger plus
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TAB: ACCOUNT
     ═══════════════════════════════════════════════════════════════════════════ */

  const AccountTab = () => {
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteText, setDeleteText] = useState("");

    const userData = accountData?.user;

    const updateNameMutation = useMutation({
      mutationFn: (name: string) =>
        fetch("/api/user/account", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).then((r) => r.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-account"] });
        setEditName(false);
        toast.success("Nom mis à jour");
      },
      onError: () => toast.error("Erreur lors de la mise à jour"),
    });

    const changePasswordMutation = useMutation({
      mutationFn: () =>
        fetch("/api/user/account", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "changePassword",
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }).then((r) => r.json()),
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Mot de passe modifié");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowPassword(false);
        } else {
          toast.error(data.error || "Erreur");
        }
      },
      onError: () => toast.error("Erreur lors du changement de mot de passe"),
    });

    const deleteAccountMutation = useMutation({
      mutationFn: () =>
        fetch("/api/user/account", { method: "DELETE" }).then((r) => r.json()),
      onSuccess: () => {
        toast.success("Compte supprimé");
        signOut({ callbackUrl: "/" });
      },
      onError: () => toast.error("Erreur lors de la suppression"),
    });

    const handleStartEditName = () => {
      setNewName(userData?.name || "");
      setEditName(true);
    };

    if (accountLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mon Compte</h1>
          <p className="text-muted-foreground mt-1">Gerez votre profil et vos parametres</p>
        </div>

        {/* Profile card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-bold dark:bg-emerald-900/30 dark:text-emerald-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {editName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="max-w-xs"
                      onKeyDown={(e) => e.key === "Enter" && updateNameMutation.mutate(newName)}
                    />
                    <Button size="sm" onClick={() => updateNameMutation.mutate(newName)} disabled={!newName.trim()}>
                      Sauvegarder
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditName(false)}>
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{userData?.name || userName}</h2>
                    <Button size="sm" variant="ghost" onClick={handleStartEditName} className="gap-1">
                      <Settings className="h-3.5 w-3.5" />
                      Modifier
                    </Button>
                  </div>
                )}
                <p className="text-muted-foreground">{session?.user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{userData?.role || "Utilisateur"}</Badge>
                  {userData?.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      Membre depuis {new Date(userData.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onboardingDone ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">Profil complet</p>
                      <p className="text-xs text-muted-foreground">Votre onboarding est terminé</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Profil incomplet</p>
                      <p className="text-xs text-muted-foreground">Etape {onboardingStep}/4</p>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setOnboardingOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                {onboardingDone ? "Refaire l'onboarding" : "Continuer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter subscription */}
        <NewsletterSettings />

        {/* Change password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changer le mot de passe</CardTitle>
            <CardDescription>Assurez-vous d&apos;utiliser un mot de passe fort et unique.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pw">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="current-pw"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="new-pw"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caracteres"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirm-pw"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez le nouveau mot de passe"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => changePasswordMutation.mutate()}
              disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
            >
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-base text-red-600 dark:text-red-400">Zone dangereuse</CardTitle>
            <CardDescription>
              Actions irréversibles. Supprimer votre compte supprime toutes vos données.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Supprimer mon compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Etes-vous absolument sur ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irreversible. Toutes vos données, y compris vos audits, outils adoptes,
                    notifications et progression, seront définitivement supprimées.
                    <br /><br />
                    Tapez <strong className="text-foreground">SUPPRIMER</strong> pour confirmer :
                  </AlertDialogDescription>
                  <Input
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    placeholder="SUPPRIMER"
                    className="mt-2"
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteText("")}>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccountMutation.mutate()}
                    disabled={deleteText !== "SUPPRIMER"}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     ONBOARDING WIZARD
     ═══════════════════════════════════════════════════════════════════════════ */

  const OnboardingWizard = () => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState("");
    const [company, setCompany] = useState("");
    const [sector, setSector] = useState("");
    const [phase, setPhase] = useState("");
    const [goals, setGoals] = useState<string[]>([]);

    const saveOnboardingMutation = useMutation({
      mutationFn: (data: { step: number; data: Record<string, unknown> }) =>
        fetch("/api/user/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["onboarding"] });
        if (variables.step >= 4) {
          setOnboardingOpen(false);
          toast.success("Profil complet ! Bienvenue dans votre parcours entrepreneurial.");
        } else {
          setStep(variables.step + 1);
        }
      },
      onError: () => toast.error("Erreur lors de la sauvegarde"),
    });

    const handleNext = () => {
      if (step === 1 && profile) {
        saveOnboardingMutation.mutate({
          step: 1,
          data: { profile: profile.toLowerCase().replace(/\s+/g, "-") },
        });
      } else if (step === 2 && company) {
        saveOnboardingMutation.mutate({ step: 2, data: { company, sector } });
      } else if (step === 3 && phase) {
        saveOnboardingMutation.mutate({ step: 3, data: { phase: phase.toLowerCase() } });
      } else if (step === 4) {
        saveOnboardingMutation.mutate({
          step: 4,
          data: { goals: goals.join(",") },
        });
      }
    };

    const canProceed =
      (step === 1 && profile) ||
      (step === 2 && company) ||
      (step === 3 && phase) ||
      step === 4;

    const toggleGoal = (goal: string) => {
      setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
    };

    const stepTitles = ["Votre profil", "Votre projet", "Votre phase", "Vos objectifs"];

    return (
      <Dialog open={onboardingOpen} onOpenChange={(open) => { if (!open) setOnboardingOpen(false); }}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-emerald-600"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Etape {step} sur 4</span>
              <span>·</span>
              <span className="font-medium text-foreground">{stepTitles[step - 1]}</span>
            </div>
            <DialogTitle className="text-xl">
              {step === 1 && "Quel est votre profil ?"}
              {step === 2 && "Parlez-nous de votre projet"}
              {step === 3 && "Dans quelle etes-vous ?"}
              {step === 4 && "Quels sont vos objectifs ?"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {step === 1 && "Cela nous aide à adapter nos recommandations."}
              {step === 2 && "Ces informations personnalisent votre expérience."}
              {step === 3 && "Nous adapterons nos outils a votre stade."}
              {step === 4 && "Selectionnez vos priorites (au moins une)."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {ONBOARDING_PROFILES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setProfile(p)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          profile === p
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-muted hover:border-emerald-300 dark:hover:border-emerald-800"
                        }`}
                      >
                        <span className="font-medium text-sm">{p}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Nom de l&apos;entreprise</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: Mon Entreprise SARL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector">Secteur d&apos;activité</Label>
                      <Input
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Ex: Technologie, Restauration..."
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {ONBOARDING_PHASES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPhase(p)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          phase === p
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-muted hover:border-emerald-300 dark:hover:border-emerald-800"
                        }`}
                      >
                        <span className="font-medium text-sm">{p}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {ONBOARDING_GOALS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                          goals.includes(goal)
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-muted hover:border-emerald-300 dark:hover:border-emerald-800"
                        }`}
                      >
                        <Checkbox
                          checked={goals.includes(goal)}
                          onCheckedChange={() => toggleGoal(goal)}
                          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <span className="font-medium text-sm">{goal}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/30">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Retour
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setOnboardingOpen(false)}>
                Plus tard
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed || saveOnboardingMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                {saveOnboardingMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : step === 4 ? (
                  <>
                    Terminer
                    <CheckCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 top-14 z-40 w-64 flex-col border-r bg-background">
          {renderSidebarContent()}
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation du tableau de bord</SheetTitle>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Mobile menu button */}
            <button
              className="lg:hidden flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
              Menu
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "tools" && <ToolsTab />}
                {activeTab === "audits" && <AuditsTab />}
                {activeTab === "invoices" && <InvoicesTab />}
                {activeTab === "notifications" && <NotificationsTab />}
                {activeTab === "account" && <AccountTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Onboarding Wizard */}
      <OnboardingWizard />
    </TooltipProvider>
  );
}
