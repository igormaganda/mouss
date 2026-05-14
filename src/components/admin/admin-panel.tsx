"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Shield,
  FileText,
  BarChart3,
  Sparkles,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Loader2,
  X,
  Check,
  RefreshCw,
  CreditCard,
  Receipt,
  UserPlus,
  AlertTriangle,
  Clock,
  Pause,
  Play,
  Ban,
  ChevronDown,
  MoreVertical,
  CircleDollarSign,
  Activity,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// ─── Types ──────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  published: boolean;
  category: string | null;
  tags: string | null;
  authorId: string;
  author: { name: string | null; email: string };
  createdAt: string;
  updatedAt: string;
}

interface Lead {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profile: string | null;
  status: string;
  source: string | null;
  createdAt: string;
}

interface Stats {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  estimatedRevenue: number;
  recentLeads: Lead[];
  topTools: { name: string; clicks: number }[];
}

interface GenerateCategories {
  categories: string[];
  topics: Record<string, string[]>;
}

interface RevenueData {
  mrr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  newThisMonth: number;
  pendingInvoices: number;
  completedOrdersCount: number;
  revenueByMonth: Record<string, number>;
}

interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  total: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
}

interface SubscriptionData {
  id: string;
  user: string;
  pack: string;
  packPrice: number;
  status: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  trialEnd: string | null;
  createdAt: string;
  invoices: SubscriptionInvoice[];
}

interface OrderData {
  id: string;
  orderNumber: string;
  client: string;
  pack: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  paymentMethod: string;
  provider: string;
  createdAt: string;
  completedAt: string | null;
}

// ─── Fetcher ────────────────────────────────────────────────────

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(err.error || "Erreur serveur");
  }
  return res.json();
}

// ─── Empty Form ─────────────────────────────────────────────────

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  coverImage: "",
  published: false,
  authorId: "",
};

// ─── Admin Panel Component ─────────────────────────────────────

export function AdminPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("articles");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [generateCategory, setGenerateCategory] = useState("");
  const [generateTopic, setGenerateTopic] = useState("");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  // ─── Billing State ──────────────────────────────────────────
  const [billingSubTab, setBillingSubTab] = useState("overview");
  const [subFilter, setSubFilter] = useState<"all" | "active" | "paused" | "cancelled">("all");
  const [statusConfirm, setStatusConfirm] = useState<{ id: string; status: string; label: string } | null>(null);

  // ─── Queries ────────────────────────────────────────────────

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetcher<{ posts: Post[] }>("/api/admin/posts"),
  });

  const posts = postsData?.posts || [];

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetcher<Stats>("/api/admin/stats"),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["generate-categories"],
    queryFn: () => fetcher<GenerateCategories>("/api/admin/generate-article"),
  });

  // ─── Billing Queries ────────────────────────────────────────

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: () => fetcher<RevenueData>("/api/admin/revenue"),
  });

  // Raw API data
  interface RawSubscription {
    id: string;
    userId: string | null;
    leadId: string | null;
    packId: string;
    pack: { id: string; name: string; price: number; slug: string };
    status: string;
    paymentMethod: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    cancelledAt: string | null;
    trialEnd: string | null;
    createdAt: string;
    user: { id: string; email: string; name: string | null } | null;
    lead: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
    invoices: Array<{
      id: string;
      invoiceNumber: string;
      amount: number;
      total: number;
      status: string;
      dueDate: string;
      paidAt: string | null;
    }>;
  }

  interface RawOrder {
    id: string;
    orderNumber: string;
    userId: string | null;
    leadId: string | null;
    packId: string;
    amount: number;
    tax: number;
    total: number;
    currency: string;
    status: string;
    paymentMethod: string;
    provider: string;
    completedAt: string | null;
    createdAt: string;
    pack: { id: string; name: string; price: number; slug: string };
    user: { id: string; email: string; name: string | null } | null;
    subscription: { id: string; status: string } | null;
  }

  const { data: subscriptionsRaw, isLoading: subsLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => fetcher<{ subscriptions: RawSubscription[] }>("/api/admin/subscriptions"),
  });

  // Map raw data to display format
  const subscriptions: SubscriptionData[] = (subscriptionsRaw?.subscriptions || []).map((s) => {
    const displayName = s.user?.name || s.user?.email
      || (s.lead ? `${s.lead.firstName || ""} ${s.lead.lastName || ""}`.trim() || s.lead.email : null)
      || "Inconnu";
    return {
      id: s.id,
      user: displayName,
      pack: s.pack.name,
      packPrice: s.pack.price,
      status: s.status,
      paymentMethod: s.paymentMethod,
      startDate: s.currentPeriodStart,
      endDate: s.currentPeriodEnd,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      cancelledAt: s.cancelledAt,
      trialEnd: s.trialEnd,
      createdAt: s.createdAt,
      invoices: (s.invoices || []).map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        total: inv.total,
        status: inv.status,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
      })),
    };
  });

  const { data: ordersRaw, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetcher<{ orders: RawOrder[]; total: number }>("/api/admin/orders"),
  });

  const orders: OrderData[] = (ordersRaw?.orders || []).map((o) => {
    const clientName = o.user?.name || o.user?.email || "Inconnu";
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      client: clientName,
      pack: o.pack.name,
      amount: o.amount,
      tax: o.tax,
      total: o.total,
      currency: o.currency,
      status: o.status,
      paymentMethod: o.paymentMethod,
      provider: o.provider,
      createdAt: o.createdAt,
      completedAt: o.completedAt,
    };
  });

  // Extract all invoices from all subscriptions
  const allInvoices = subscriptions.flatMap((s) => s.invoices);


  // ─── Mutations ──────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Post> }) => {
      return fetcher<{ post: Post }>(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast.success("Article mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetcher(`/api/admin/posts/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast.success("Article supprimé");
      setDeleteId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { category: string; topic: string }) => {
      return fetcher<{ article: { title: string; savedToDb: boolean } }>(
        "/api/admin/generate-article",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, saveToDb: true }),
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      if (data.article.savedToDb) {
        toast.success(`Article généré : ${data.article.title}`);
      } else {
        toast.success("Article généré (non sauvegardé)");
      }
      setShowGenerateDialog(false);
      setGenerateCategory("");
      setGenerateTopic("");
    },
    onError: () => toast.error("Erreur lors de la génération"),
  });

  // ─── Handlers ───────────────────────────────────────────────

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      tags: post.tags || "",
      coverImage: post.coverImage || "",
      published: post.published,
      authorId: post.authorId,
    });
    setShowEditDialog(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setForm({ ...form, title, slug: editingPost ? form.slug : slug });
  };

  const handleSave = () => {
    if (!editingPost) return;
    updateMutation.mutate({
      id: editingPost.id,
      data: {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        category: form.category || null,
        tags: form.tags || null,
        coverImage: form.coverImage || null,
        published: form.published,
      },
    });
    setShowEditDialog(false);
  };

  const handleTogglePublish = (post: Post) => {
    updateMutation.mutate({
      id: post.id,
      data: { published: !post.published },
    });
  };

  const handleGenerate = () => {
    if (!generateCategory) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    generateMutation.mutate({
      category: generateCategory,
      topic: generateTopic || undefined,
    });
  };

  // ─── Subscription Mutation ──────────────────────────────────

  const updateSubMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return fetcher("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-revenue"] });
      toast.success("Abonnement mis à jour");
      setStatusConfirm(null);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  // ─── Billing Helpers ────────────────────────────────────────

  const activeSubsCount = subscriptions.filter((s) => s.status === "active").length;
  const pausedSubsCount = subscriptions.filter((s) => s.status === "paused").length;
  const cancelledSubsCount = subscriptions.filter((s) => s.status === "cancelled").length;

  const filteredSubscriptions = subscriptions.filter((s) => {
    if (subFilter === "active") return s.status === "active";
    if (subFilter === "paused") return s.status === "paused";
    if (subFilter === "cancelled") return s.status === "cancelled";
    return true;
  });

  const getSubStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      active: { label: "Actif", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      paused: { label: "En pause", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      cancelled: { label: "Annulé", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      expired: { label: "Expiré", className: "bg-muted text-muted-foreground" },
      past_due: { label: "Impayé", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
      trialing: { label: "Essai", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    };
    const item = map[status] || map.expired;
    return <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${item.className}`}>{item.label}</Badge>;
  };

  const getOrderStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      completed: { label: "Terminé", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      pending: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      failed: { label: "Échoué", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      refunded: { label: "Remboursé", className: "bg-muted text-muted-foreground" },
      cancelled: { label: "Annulé", className: "bg-muted text-muted-foreground" },
    };
    const item = map[status] || map.pending;
    return <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${item.className}`}>{item.label}</Badge>;
  };

  const getInvoiceStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      paid: { label: "Payée", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
      pending: { label: "En attente", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
      overdue: { label: "En retard", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      failed: { label: "Échouée", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      void: { label: "Annulée", className: "bg-muted text-muted-foreground" },
    };
    const item = map[status] || map.pending;
    return <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${item.className}`}>{item.label}</Badge>;
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === "published") return p.published;
    if (filter === "draft") return !p.published;
    return true;
  });

  const availableTopics = generateCategory
    ? (categoriesData?.topics?.[generateCategory] || [])
    : [];

  // ─── Render ─────────────────────────────────────────────────

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[95vw] sm:w-[85vw] md:w-[700px] lg:w-[900px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-lg">Panneau d&apos;administration</SheetTitle>
              <SheetDescription className="text-sm">
                Gérer le contenu et les statistiques
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="w-full">
              <TabsTrigger value="articles" className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Articles
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {posts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex-1 gap-2">
                <CreditCard className="h-4 w-4" />
                Abonnements
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeSubsCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── Articles Tab ────────────────────────────────── */}
          <TabsContent value="articles" className="flex flex-col flex-1 min-h-0 mt-0">
            <div className="flex items-center justify-between px-6 py-3 border-b shrink-0">
              <div className="flex gap-1.5">
                {([
                  { value: "all" as const, label: "Tous" },
                  { value: "published" as const, label: "Publiés" },
                  { value: "draft" as const, label: "Brouillons" },
                ]).map((tab) => (
                  <Button
                    key={tab.value}
                    variant={filter === tab.value ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFilter(tab.value)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setShowGenerateDialog(true)}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Générer avec l&apos;IA
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-6 py-4">
                {postsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Aucun article trouvé
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      className="space-y-2"
                      initial={false}
                      layout
                    >
                      {filteredPosts.map((post) => (
                        <motion.div
                          key={post.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="group flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                        >
                          {/* Publish Toggle */}
                          <div className="pt-1 shrink-0">
                            <Switch
                              checked={post.published}
                              onCheckedChange={() => handleTogglePublish(post)}
                              disabled={updateMutation.isPending}
                              className="data-[state=checked]:bg-emerald-600"
                            />
                          </div>

                          {/* Post Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="text-sm font-medium leading-tight truncate">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  {post.category && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                      {post.category}
                                    </Badge>
                                  )}
                                  <span className="text-[11px] text-muted-foreground">
                                    {format(new Date(post.createdAt), "d MMM yyyy", { locale: fr })}
                                  </span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <Badge
                                variant="secondary"
                                className={`shrink-0 text-[10px] h-5 px-1.5 ${
                                  post.published
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {post.published ? (
                                  <><Eye className="mr-0.5 h-2.5 w-2.5" />Publié</>
                                ) : (
                                  <><EyeOff className="mr-0.5 h-2.5 w-2.5" />Brouillon</>
                                )}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(post)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => setDeleteId(post.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ─── Stats Tab ───────────────────────────────────── */}
          <TabsContent value="stats" className="flex flex-col flex-1 min-h-0 mt-0">
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-6">
                {statsLoading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                      ))}
                    </div>
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-48 rounded-lg" />
                  </div>
                ) : (
                  <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        className="rounded-lg border p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-[11px] font-medium">Leads</span>
                        </div>
                        <p className="text-xl font-bold">
                          {statsData?.totalLeads?.toLocaleString("fr-FR") ?? "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {statsData?.convertedLeads ?? 0} convertis
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-lg border p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-[11px] font-medium">Taux conv.</span>
                        </div>
                        <p className="text-xl font-bold">
                          {statsData?.conversionRate ?? 0}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Leads convertis
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-lg border p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-[11px] font-medium">Revenus</span>
                        </div>
                        <p className="text-xl font-bold">
                          {statsData?.estimatedRevenue
                            ? `${(statsData.estimatedRevenue ?? 0).toFixed(0)}€`
                            : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Revenus estimés
                        </p>
                      </motion.div>
                    </div>

                    {/* Recent Leads */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="rounded-lg border"
                    >
                      <div className="px-4 py-3 border-b flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Leads récents</h3>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                          {statsData?.recentLeads?.length ?? 0}
                        </Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Email</TableHead>
                            <TableHead className="text-xs hidden sm:table-cell">Profil</TableHead>
                            <TableHead className="text-xs">Statut</TableHead>
                            <TableHead className="text-xs hidden sm:table-cell">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statsData?.recentLeads?.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="text-xs font-medium truncate max-w-[140px]">
                                {lead.email}
                              </TableCell>
                              <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">
                                {lead.profile || "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] h-5 px-1.5 ${
                                    lead.status === "converted"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : lead.status === "contacted"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {lead.status === "converted"
                                    ? "Converti"
                                    : lead.status === "contacted"
                                    ? "Contacté"
                                    : lead.status === "new"
                                    ? "Nouveau"
                                    : lead.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                                {format(new Date(lead.createdAt), "d MMM", { locale: fr })}
                              </TableCell>
                            </TableRow>
                          ))}
                          {!statsData?.recentLeads?.length && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6 text-xs text-muted-foreground">
                                Aucun lead
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>

                    {/* Top Tools */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-lg border"
                    >
                      <div className="px-4 py-3 border-b flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Outils populaires</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {statsData?.topTools?.map((tool, idx) => {
                          const maxClicks = Math.max(...(statsData?.topTools?.map((t) => t.clicks) || [1]), 1);
                          const pct = Math.round((tool.clicks / maxClicks) * 100);
                          return (
                            <div key={tool.name} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium flex items-center gap-2">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                    {idx + 1}
                                  </span>
                                  {tool.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {tool.clicks} clics
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        {!statsData?.topTools?.length && (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            Aucun outil
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          {/* ─── Billing / Abonnements Tab ───────────────────── */}
          <TabsContent value="billing" className="flex flex-col flex-1 min-h-0 mt-0">
            {/* Sub-tabs navigation */}
            <div className="px-6 py-3 border-b shrink-0">
              <div className="flex gap-1.5">
                {([
                  { value: "overview" as const, label: "Vue d'ensemble", icon: CircleDollarSign },
                  { value: "subscriptions" as const, label: "Abonnements", icon: Users },
                  { value: "orders" as const, label: "Commandes", icon: Receipt },
                  { value: "invoices" as const, label: "Factures", icon: CreditCard },
                ]).map((tab) => (
                  <Button
                    key={tab.value}
                    variant={billingSubTab === tab.value ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => setBillingSubTab(tab.value)}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-6">

                {/* ═══ OVERVIEW SUB-TAB ═══ */}
                {billingSubTab === "overview" && (
                  revenueLoading ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                      </div>
                      <Skeleton className="h-40 rounded-lg" />
                    </div>
                  ) : (
                    <>
                      {/* KPI Cards - 2x3 grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0 }}
                          className="rounded-lg border p-3 space-y-1 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                        >
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-[11px] font-medium">MRR</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.mrr?.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }) ?? "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Revenu mensuel récurrent
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 }}
                          className="rounded-lg border p-3 space-y-1"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-[11px] font-medium">Revenu total</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.totalRevenue?.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }) ?? "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {revenueData?.completedOrdersCount ?? 0} commandes
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="rounded-lg border p-3 space-y-1"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-[11px] font-medium">Abonnements actifs</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.activeSubscriptions?.toLocaleString("fr-FR") ?? "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            sur {subscriptions.length} total
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className={`rounded-lg border p-3 space-y-1 ${
                            (revenueData?.churnRate ?? 0) > 5
                              ? "border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20"
                              : ""
                          }`}
                        >
                          <div className={`flex items-center gap-2 ${
                            (revenueData?.churnRate ?? 0) > 5
                              ? "text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }`}>
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-[11px] font-medium">Taux de churn</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.churnRate ?? 0}%
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {(revenueData?.churnRate ?? 0) > 5 ? "⚠️ Au-dessus de 5%" : "Ce mois"}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-lg border p-3 space-y-1"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <UserPlus className="h-4 w-4" />
                            <span className="text-[11px] font-medium">Nouveaux ce mois</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.newThisMonth?.toLocaleString("fr-FR") ?? "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Nouveaux abonnements
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="rounded-lg border p-3 space-y-1"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-[11px] font-medium">Factures en attente</span>
                          </div>
                          <p className="text-xl font-bold">
                            {revenueData?.pendingInvoices?.toLocaleString("fr-FR") ?? "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            À traiter
                          </p>
                        </motion.div>
                      </div>

                      {/* Revenue Chart Placeholder */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-lg border"
                      >
                        <Card className="border-0 shadow-none">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                                <Activity className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <h3 className="text-sm font-semibold mb-1">Graphique des revenus</h3>
                              <p className="text-xs text-muted-foreground">
                                Bientôt disponible — Visualisation mensuelle des revenus et tendances
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </>
                  )
                )}

                {/* ═══ SUBSCRIPTIONS SUB-TAB ═══ */}
                {billingSubTab === "subscriptions" && (
                  subsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-64 rounded-lg" />
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={subFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {/* Filter buttons with count badges */}
                        <div className="flex gap-1.5 flex-wrap">
                          <Button
                            variant={subFilter === "all" ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => setSubFilter("all")}
                          >
                            <Filter className="h-3 w-3" />
                            Tous
                            <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{subscriptions.length}</Badge>
                          </Button>
                          <Button
                            variant={subFilter === "active" ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => setSubFilter("active")}
                          >
                            <Play className="h-3 w-3" />
                            Actifs
                            <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{activeSubsCount}</Badge>
                          </Button>
                          <Button
                            variant={subFilter === "paused" ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => setSubFilter("paused")}
                          >
                            <Pause className="h-3 w-3" />
                            En pause
                            <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{pausedSubsCount}</Badge>
                          </Button>
                          <Button
                            variant={subFilter === "cancelled" ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => setSubFilter("cancelled")}
                          >
                            <Ban className="h-3 w-3" />
                            Annulés
                            <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{cancelledSubsCount}</Badge>
                          </Button>
                        </div>

                        {/* Subscriptions table */}
                        <div className="rounded-lg border">
                          <div className="px-4 py-3 border-b flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold">Abonnements</h3>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                              {filteredSubscriptions.length}
                            </Badge>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Utilisateur</TableHead>
                                <TableHead className="text-xs hidden md:table-cell">Pack</TableHead>
                                <TableHead className="text-xs">Statut</TableHead>
                                <TableHead className="text-xs hidden lg:table-cell">Méthode</TableHead>
                                <TableHead className="text-xs hidden xl:table-cell">Début</TableHead>
                                <TableHead className="text-xs hidden xl:table-cell">Fin</TableHead>
                                <TableHead className="text-xs text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredSubscriptions.map((sub) => (
                                <TableRow key={sub.id}>
                                  <TableCell className="text-xs font-medium truncate max-w-[120px]">
                                    {sub.user}
                                  </TableCell>
                                  <TableCell className="text-xs hidden md:table-cell">
                                    <div className="flex items-center gap-1.5">
                                      <span>{sub.pack}</span>
                                      <span className="text-muted-foreground">({sub.packPrice}€)</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getSubStatusBadge(sub.status)}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground hidden lg:table-cell capitalize">
                                    {sub.paymentMethod}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                                    {format(new Date(sub.startDate), "d MMM yyyy", { locale: fr })}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                                    {format(new Date(sub.endDate), "d MMM yyyy", { locale: fr })}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <MoreVertical className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {(sub.status === "paused" || sub.status === "cancelled" || sub.status === "expired") && (
                                          <DropdownMenuItem
                                            onClick={() => setStatusConfirm({ id: sub.id, status: "active", label: "Activer" })}
                                            className="text-emerald-600 dark:text-emerald-400"
                                          >
                                            <Play className="mr-2 h-3.5 w-3.5" />
                                            Activer
                                          </DropdownMenuItem>
                                        )}
                                        {sub.status === "active" && (
                                          <DropdownMenuItem
                                            onClick={() => setStatusConfirm({ id: sub.id, status: "paused", label: "Mettre en pause" })}
                                            className="text-amber-600 dark:text-amber-400"
                                          >
                                            <Pause className="mr-2 h-3.5 w-3.5" />
                                            Mettre en pause
                                          </DropdownMenuItem>
                                        )}
                                        {(sub.status === "active" || sub.status === "paused") && (
                                          <DropdownMenuItem
                                            onClick={() => setStatusConfirm({ id: sub.id, status: "cancelled", label: "Annuler" })}
                                            className="text-red-600 dark:text-red-400"
                                          >
                                            <Ban className="mr-2 h-3.5 w-3.5" />
                                            Annuler
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {filteredSubscriptions.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-6 text-xs text-muted-foreground">
                                    Aucun abonnement trouvé
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )
                )}

                {/* ═══ ORDERS SUB-TAB ═══ */}
                {billingSubTab === "orders" && (
                  ordersLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg border"
                    >
                      <div className="px-4 py-3 border-b flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Commandes</h3>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                          {orders.length}
                        </Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">N°</TableHead>
                            <TableHead className="text-xs hidden md:table-cell">Client</TableHead>
                            <TableHead className="text-xs">Pack</TableHead>
                            <TableHead className="text-xs">Montant</TableHead>
                            <TableHead className="text-xs hidden lg:table-cell">Méthode</TableHead>
                            <TableHead className="text-xs">Statut</TableHead>
                            <TableHead className="text-xs hidden xl:table-cell">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="text-xs font-mono font-medium">
                                {order.orderNumber}
                              </TableCell>
                              <TableCell className="text-xs truncate max-w-[120px] hidden md:table-cell">
                                {order.client}
                              </TableCell>
                              <TableCell className="text-xs">{order.pack}</TableCell>
                              <TableCell className="text-xs font-medium">
                                {order.total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground hidden lg:table-cell capitalize">
                                {order.paymentMethod}
                              </TableCell>
                              <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                              <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                                {format(new Date(order.createdAt), "d MMM yyyy", { locale: fr })}
                              </TableCell>
                            </TableRow>
                          ))}
                          {orders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-xs text-muted-foreground">
                                Aucune commande
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )
                )}

                {/* ═══ INVOICES SUB-TAB ═══ */}
                {billingSubTab === "invoices" && (
                  subsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg border"
                    >
                      <div className="px-4 py-3 border-b flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">Factures</h3>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                          {allInvoices.length}
                        </Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">N° Facture</TableHead>
                            <TableHead className="text-xs hidden md:table-cell">Client</TableHead>
                            <TableHead className="text-xs">Montant</TableHead>
                            <TableHead className="text-xs">Statut</TableHead>
                            <TableHead className="text-xs hidden lg:table-cell">Échéance</TableHead>
                            <TableHead className="text-xs hidden xl:table-cell">Payée le</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allInvoices.map((invoice) => {
                            // Find the subscription user for this invoice
                            const sub = subscriptions.find((s) =>
                              s.invoices.some((inv) => inv.id === invoice.id)
                            );
                            return (
                              <TableRow key={invoice.id}>
                                <TableCell className="text-xs font-mono font-medium">
                                  {invoice.invoiceNumber}
                                </TableCell>
                                <TableCell className="text-xs truncate max-w-[120px] hidden md:table-cell">
                                  {sub?.user || "—"}
                                </TableCell>
                                <TableCell className="text-xs font-medium">
                                  {invoice.total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                </TableCell>
                                <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                                  {format(new Date(invoice.dueDate), "d MMM yyyy", { locale: fr })}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                                  {invoice.paidAt
                                    ? format(new Date(invoice.paidAt), "d MMM yyyy", { locale: fr })
                                    : "—"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {allInvoices.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                                Aucune facture
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )
                )}

              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>

      {/* ─── Edit Dialog ─────────────────────────────────────── */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Modifier l&apos;article
            </DialogTitle>
            <DialogDescription>
              Mettre à jour le contenu de l&apos;article
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Le titre de l'article"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="ex: Création d'entreprise"
              />
            </div>
            <div className="space-y-2">
              <Label>Extrait</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="Un court résumé de l'article"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu (Markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                placeholder="Le contenu de l'article en Markdown"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Image de couverture (URL)</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={form.published}
                onCheckedChange={(checked) => setForm({ ...form, published: checked })}
              />
              <Label>Publié</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Generate Dialog ─────────────────────────────────── */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Générer un article avec l&apos;IA
            </DialogTitle>
            <DialogDescription>
              L&apos;intelligence artificielle créera un article complet, optimisé SEO, sauvegardé en brouillon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                value={generateCategory}
                onValueChange={(val) => {
                  setGenerateCategory(val);
                  setGenerateTopic("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.categories?.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sujet (optionnel)</Label>
              <Select
                value={generateTopic}
                onValueChange={setGenerateTopic}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sujet aléatoire ou choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-muted-foreground">
              💡 Laissez le sujet vide pour une génération aléatoire dans la catégorie choisie.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="gap-2"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer l&apos;article
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              Supprimer cet article ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;article sera définitivement supprimé de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Subscription Status Change Confirmation ─────────── */}
      <AlertDialog open={!!statusConfirm} onOpenChange={() => setStatusConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {statusConfirm?.label === "Annuler" ? "Annuler cet abonnement ?" : `Confirmer le changement de statut ?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusConfirm?.label === "Annuler"
                ? "L'abonnement sera immédiatement annulé. Le client ne sera plus facturé."
                : statusConfirm?.label === "Activer"
                  ? "L'abonnement sera réactivé et le client sera facturé à la prochaine échéance."
                  : "L'abonnement sera mis en pause. Le client ne sera pas facturé pendant la pause."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={
                statusConfirm?.label === "Annuler"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : statusConfirm?.label === "Activer"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : ""
              }
              onClick={() => {
                if (statusConfirm) {
                  updateSubMutation.mutate({ id: statusConfirm.id, status: statusConfirm.status });
                }
              }}
              disabled={updateSubMutation.isPending}
            >
              {updateSubMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                statusConfirm?.label || "Confirmer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
