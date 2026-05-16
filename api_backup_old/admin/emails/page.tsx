"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Send,
  Eye,
  MousePointerClick,
  Mail,
  FileText,
  Clock,
  BarChart3,
  Copy,
  Search,
  Filter,
  Download,
  Bell,
  LayoutGrid,
  FileCode,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  MailCheck,
  MailX,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────────

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  segment: string;
  status: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EmailLog {
  id: string;
  campaignId: string | null;
  templateId: string | null;
  to: string;
  subject: string;
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  error: string | null;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────────

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

// ─── Config ───────────────────────────────────────────────────────────────────────

const segmentOptions = [
  { value: "all", label: "Tous les leads" },
  { value: "etudiant", label: "Étudiants" },
  { value: "salarie", label: "Salariés" },
  { value: "freelance", label: "Freelances" },
  { value: "tpe-pme", label: "TPE/PME" },
];

const segmentLabels: Record<string, string> = {
  all: "Tous",
  etudiant: "Étudiant",
  salarie: "Salarié",
  freelance: "Freelance",
  "tpe-pme": "TPE/PME",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Brouillon",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0",
  },
  scheduled: {
    label: "Planifié",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0",
  },
  sent: {
    label: "Envoyé",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
  },
};

const logStatusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending: {
    label: "En attente",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0",
    icon: Clock,
  },
  sent: {
    label: "Envoyé",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
    icon: MailCheck,
  },
  failed: {
    label: "Échoué",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0",
    icon: MailX,
  },
};

const categoryConfig: Record<
  string,
  { label: string; className: string }
> = {
  welcome: {
    label: "Bienvenue",
    className:
      "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  },
  recommendation: {
    label: "Recommandation",
    className:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  },
  audit: {
    label: "Audit",
    className:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  },
  billing: {
    label: "Facturation",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  newsletter: {
    label: "Newsletter",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  transactional: {
    label: "Transactionnel",
    className:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  },
};

const notificationTypes = [
  { value: "info", label: "Info" },
  { value: "success", label: "Succès" },
  { value: "warning", label: "Alerte" },
  { value: "error", label: "Erreur" },
];

const notificationPriorities = [
  { value: "low", label: "Basse" },
  { value: "normal", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

const emptyCampaignForm = {
  name: "",
  subject: "",
  body: "",
  segment: "all",
  scheduledAt: "",
  templateId: "",
};

const emptyTemplateForm = {
  name: "",
  subject: "",
  body: "",
  category: "newsletter",
  variables: "",
  active: true,
};

const emptyQuickSendForm = {
  to: "",
  subject: "",
  body: "",
  templateId: "",
};

const emptyNotificationForm = {
  segment: "",
  title: "",
  message: "",
  type: "info",
  category: "general",
  priority: "normal",
  actionUrl: "",
};

// ─── Animation Variants ───────────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Main Component ───────────────────────────────────────────────────────────────

export default function EmailsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [logPage, setLogPage] = useState(1);

  // Dialogs
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showQuickSendDialog, setShowQuickSendDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState({ subject: "", body: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"campaign" | "template">("campaign");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Forms
  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);
  const [templateForm, setTemplateForm] = useState(emptyTemplateForm);
  const [quickSendForm, setQuickSendForm] = useState(emptyQuickSendForm);
  const [notificationForm, setNotificationForm] = useState(emptyNotificationForm);

  // ─── Queries ────────────────────────────────────────────────────────────────────

  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ["admin-emails-campaigns"],
    queryFn: () => fetcher("/api/admin/campaigns"),
  });

  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ["admin-email-templates", templateCategoryFilter, templateSearch],
    queryFn: () =>
      fetcher(
        `/api/admin/email-templates?limit=50&category=${templateCategoryFilter}&search=${templateSearch}`
      ),
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-email-logs", logStatusFilter, logSearch, logPage],
    queryFn: () =>
      fetcher(
        `/api/admin/email-logs?limit=15&page=${logPage}&status=${logStatusFilter}&search=${logSearch}`
      ),
  });

  const { data: emailStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-email-stats"],
    queryFn: async () => {
      const [templatesRes, campaignsRes] = await Promise.all([
        fetcher("/api/admin/email-templates?limit=1"),
        fetcher("/api/admin/campaigns"),
      ]);
      const totalTemplates = templatesRes.pagination?.total ?? templatesRes.templates?.length ?? 0;
      const campaigns = campaignsRes.campaigns ?? [];
      const sentCampaigns = campaigns.filter((c: EmailCampaign) => c.status === "sent");
      const totalSent = campaigns.reduce((sum: number, c: EmailCampaign) => sum + c.sentCount, 0);
      const avgOpenRate =
        sentCampaigns.length > 0
          ? sentCampaigns.reduce((sum: number, c: EmailCampaign) => {
              const rate = c.sentCount > 0 ? (c.openCount / c.sentCount) * 100 : 0;
              return sum + rate;
            }, 0) / sentCampaigns.length
          : 0;
      return {
        totalTemplates,
        sentCampaigns: sentCampaigns.length,
        totalSent,
        avgOpenRate: Math.round(avgOpenRate),
      };
    },
  });

  // ─── Mutations ──────────────────────────────────────────────────────────────────

  const createCampaignMutation = useMutation({
    mutationFn: async (data: typeof emptyCampaignForm) => {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          subject: data.subject,
          body: data.body,
          segment: data.segment,
          status: data.scheduledAt ? "scheduled" : "draft",
          scheduledAt: data.scheduledAt
            ? new Date(data.scheduledAt).toISOString()
            : null,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Campagne créée avec succès");
      closeCampaignDialog();
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof emptyCampaignForm> }) => {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          subject: data.subject,
          body: data.body,
          segment: data.segment,
          scheduledAt: data.scheduledAt
            ? new Date(data.scheduledAt).toISOString()
            : null,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Campagne mise à jour");
      closeCampaignDialog();
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Campagne supprimée");
      setDeleteId(null);
      setSelectedCampaigns((prev) => prev.filter((id) => id !== deleteId));
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const res = await fetch("/api/admin/email-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, sendNow: true }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-logs"] });
      toast.success(`Campagne envoyée à ${data.sentCount} lead(s)`);
    },
    onError: () => toast.error("Erreur lors de l'envoi"),
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: typeof emptyTemplateForm) => {
      const res = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Template créé avec succès");
      closeTemplateDialog();
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof emptyTemplateForm> }) => {
      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Template mis à jour");
      closeTemplateDialog();
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-email-stats"] });
      toast.success("Template supprimé");
      setDeleteId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: async (template: EmailTemplate) => {
      const res = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...template,
          name: `${template.name} (copie)`,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-email-templates"] });
      toast.success("Template dupliqué");
    },
    onError: () => toast.error("Erreur lors de la duplication"),
  });

  const duplicateCampaignMutation = useMutation({
    mutationFn: async (campaign: EmailCampaign) => {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${campaign.name} (copie)`,
          subject: campaign.subject,
          body: campaign.body,
          segment: campaign.segment,
          status: "draft",
          scheduledAt: null,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails-campaigns"] });
      toast.success("Campagne dupliquée");
    },
    onError: () => toast.error("Erreur lors de la duplication"),
  });

  const quickSendMutation = useMutation({
    mutationFn: async (data: typeof emptyQuickSendForm) => {
      const res = await fetch("/api/admin/email-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.to,
          subject: data.subject,
          body: data.body,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-email-logs"] });
      toast.success("Email envoyé avec succès");
      setShowQuickSendDialog(false);
      setQuickSendForm(emptyQuickSendForm);
    },
    onError: () => toast.error("Erreur lors de l'envoi"),
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data: typeof emptyNotificationForm) => {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(
        `Notification envoyée à ${data.count} utilisateur(s)`
      );
      setShowNotificationDialog(false);
      setNotificationForm(emptyNotificationForm);
    },
    onError: () => toast.error("Erreur lors de l'envoi"),
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────────

  const closeCampaignDialog = useCallback(() => {
    setShowCampaignDialog(false);
    setEditingCampaign(null);
    setCampaignForm(emptyCampaignForm);
  }, []);

  const closeTemplateDialog = useCallback(() => {
    setShowTemplateDialog(false);
    setEditingTemplate(null);
    setTemplateForm(emptyTemplateForm);
  }, []);

  const openEditCampaign = useCallback((campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      subject: campaign.subject,
      body: campaign.body,
      segment: campaign.segment,
      scheduledAt: campaign.scheduledAt
        ? format(new Date(campaign.scheduledAt), "yyyy-MM-dd'T'HH:mm")
        : "",
      templateId: "",
    });
    setShowCampaignDialog(true);
  }, []);

  const openEditTemplate = useCallback((template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category,
      variables: template.variables || "",
      active: template.active,
    });
    setShowTemplateDialog(true);
  }, []);

  const handlePreviewTemplate = useCallback((template: EmailTemplate) => {
    setPreviewContent({ subject: template.subject, body: template.body });
    setShowPreviewDialog(true);
  }, []);

  const handleSelectTemplateForCampaign = useCallback(
    (templateId: string) => {
      const templates = templatesData?.templates ?? [];
      const template = templates.find((t: EmailTemplate) => t.id === templateId);
      if (template) {
        setCampaignForm((prev) => ({
          ...prev,
          subject: template.subject,
          body: template.body,
          templateId,
        }));
      }
    },
    [templatesData]
  );

  const handleSelectTemplateForQuickSend = useCallback(
    (templateId: string) => {
      const templates = templatesData?.templates ?? [];
      const template = templates.find((t: EmailTemplate) => t.id === templateId);
      if (template) {
        setQuickSendForm((prev) => ({
          ...prev,
          subject: template.subject,
          body: template.body,
          templateId,
        }));
      }
    },
    [templatesData]
  );

  const handleExportLogs = useCallback(() => {
    const url = `/api/admin/email-logs?export=csv&status=${logStatusFilter}&search=${logSearch}`;
    window.open(url, "_blank");
  }, [logStatusFilter, logSearch]);

  const handleBulkDelete = useCallback(() => {
    if (selectedCampaigns.length === 0) return;
    selectedCampaigns.forEach((id) => deleteCampaignMutation.mutate(id));
    setSelectedCampaigns([]);
  }, [selectedCampaigns, deleteCampaignMutation]);

  const toggleCampaignSelection = useCallback((id: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleAllCampaigns = useCallback(
    (filteredCampaigns: EmailCampaign[]) => {
      if (selectedCampaigns.length === filteredCampaigns.length) {
        setSelectedCampaigns([]);
      } else {
        setSelectedCampaigns(filteredCampaigns.map((c) => c.id));
      }
    },
    [selectedCampaigns]
  );

  // ─── Derived data ───────────────────────────────────────────────────────────────

  const campaigns = campaignsData?.campaigns ?? [];
  const templates = templatesData?.templates ?? [];
  const logs = logsData?.logs ?? [];
  const logPagination = logsData?.pagination;

  const filteredCampaigns = campaigns.filter((c: EmailCampaign) => {
    const matchStatus = campaignStatusFilter === "all" || c.status === campaignStatusFilter;
    const matchSearch =
      campaignSearch === "" ||
      c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(campaignSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const recentCampaigns = filteredCampaigns.slice(0, 10);

  const stats = emailStats ?? {
    totalTemplates: 0,
    sentCampaigns: 0,
    totalSent: 0,
    avgOpenRate: 0,
  };

  // ─── Render ─────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div {...fadeInUp}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Emails & Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer vos templates, campagnes et logs d&apos;emails
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTemplateDialog(true)}
            >
              <FileCode className="mr-2 h-4 w-4" />
              Nouveau template
            </Button>
            <Button onClick={() => { closeCampaignDialog(); setShowCampaignDialog(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle campagne
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQuickSendDialog(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Envoi rapide
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowNotificationDialog(true)}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notification
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))
        ) : (
          <>
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total templates
                  </CardTitle>
                  <FileCode className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTemplates}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Campagnes envoyées
                  </CardTitle>
                  <Send className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.sentCampaigns}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Emails envoyés
                  </CardTitle>
                  <Mail className="h-4 w-4 text-rose-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSent}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taux d&apos;ouverture
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-violet-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgOpenRate}%</div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Recent Campaigns Overview */}
      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Campagnes récentes</CardTitle>
                <CardDescription>10 dernières campagnes</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("campaigns")}>
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {campaignsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden sm:table-cell">Sujet</TableHead>
                      <TableHead className="hidden md:table-cell">Segment</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden lg:table-cell text-center">
                        Stats
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCampaigns.map((campaign: EmailCampaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm max-w-[200px] truncate">
                          {campaign.subject}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {segmentLabels[campaign.segment] || campaign.segment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              statusConfig[campaign.status]?.className || ""
                            }
                          >
                            {statusConfig[campaign.status]?.label || campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1" title="Envoyés">
                              <Send className="h-3 w-3" /> {campaign.sentCount}
                            </span>
                            <span className="flex items-center gap-1" title="Ouverts">
                              <Eye className="h-3 w-3" /> {campaign.openCount}
                            </span>
                            <span className="flex items-center gap-1" title="Clics">
                              <MousePointerClick className="h-3 w-3" /> {campaign.clickCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {format(new Date(campaign.createdAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentCampaigns.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Aucune campagne créée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Tabs */}
      <motion.div {...fadeInUp}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="campaigns" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Campagnes
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-1.5">
              <ScrollText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* ─── Campaigns Tab ─────────────────────────────────────────── */}
          <TabsContent value="campaigns" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une campagne..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={campaignStatusFilter}
                  onValueChange={setCampaignStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedCampaigns.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={deleteCampaignMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer ({selectedCampaigns.length})
                </Button>
              )}
            </div>

            {/* Campaigns Table */}
            <div className="rounded-lg border">
              {campaignsLoading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            filteredCampaigns.length > 0 &&
                            selectedCampaigns.length === filteredCampaigns.length
                          }
                          onCheckedChange={() =>
                            toggleAllCampaigns(filteredCampaigns)
                          }
                        />
                      </TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Sujet
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Segment
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden lg:table-cell text-center">
                        Stats
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign: EmailCampaign) => (
                      <TableRow
                        key={campaign.id}
                        className={
                          selectedCampaigns.includes(campaign.id)
                            ? "bg-muted/50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedCampaigns.includes(campaign.id)}
                            onCheckedChange={() =>
                              toggleCampaignSelection(campaign.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm max-w-[200px] truncate">
                          {campaign.subject}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {segmentLabels[campaign.segment] || campaign.segment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              statusConfig[campaign.status]?.className || ""
                            }
                          >
                            {statusConfig[campaign.status]?.label || campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1" title="Envoyés">
                              <Send className="h-3 w-3" /> {campaign.sentCount}
                            </span>
                            <span className="flex items-center gap-1" title="Ouverts">
                              <Eye className="h-3 w-3" /> {campaign.openCount}
                            </span>
                            <span className="flex items-center gap-1" title="Clics">
                              <MousePointerClick className="h-3 w-3" /> {campaign.clickCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {format(new Date(campaign.createdAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openEditCampaign(campaign)}
                              >
                                <FileText className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              {(campaign.status === "draft" ||
                                campaign.status === "scheduled") && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    sendCampaignMutation.mutate(campaign.id)
                                  }
                                  disabled={sendCampaignMutation.isPending}
                                >
                                  <Zap className="mr-2 h-4 w-4" /> Envoyer
                                  maintenant
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  duplicateCampaignMutation.mutate(campaign)
                                }
                                disabled={duplicateCampaignMutation.isPending}
                              >
                                <Copy className="mr-2 h-4 w-4" /> Dupliquer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeleteId(campaign.id);
                                  setDeleteType("campaign");
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCampaigns.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Mail className="h-10 w-10 text-muted-foreground/40" />
                            <p>Aucune campagne trouvée</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCampaignDialog(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Créer une campagne
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ─── Templates Tab ─────────────────────────────────────────── */}
          <TabsContent value="templates" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un template..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={templateCategoryFilter}
                  onValueChange={setTemplateCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="welcome">Bienvenue</SelectItem>
                    <SelectItem value="recommendation">Recommandation</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="billing">Facturation</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="transactional">Transactionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { closeTemplateDialog(); setShowTemplateDialog(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un template
              </Button>
            </div>

            {/* Templates Table */}
            <div className="rounded-lg border">
              {templatesLoading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Catégorie
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Variables
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Créé le
                      </TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template: EmailTemplate) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">
                          {template.subject}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className={
                              categoryConfig[template.category]?.className || ""
                            }
                          >
                            {categoryConfig[template.category]?.label ||
                              template.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {template.variables ? (
                            <div className="flex flex-wrap gap-1">
                              {template.variables
                                .split(",")
                                .map((v: string) => v.trim())
                                .filter(Boolean)
                                .map((v: string) => (
                                  <Badge
                                    key={v}
                                    variant="outline"
                                    className="text-xs font-mono"
                                  >
                                    {`{{${v}}}`}
                                  </Badge>
                                ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              template.active
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-0"
                            }
                          >
                            {template.active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {format(new Date(template.createdAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> Prévisualiser
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditTemplate(template)}
                              >
                                <FileText className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  duplicateTemplateMutation.mutate(template)
                                }
                                disabled={
                                  duplicateTemplateMutation.isPending
                                }
                              >
                                <Copy className="mr-2 h-4 w-4" /> Dupliquer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeleteId(template.id);
                                  setDeleteType("template");
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {templates.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <FileCode className="h-10 w-10 text-muted-foreground/40" />
                            <p>Aucun template trouvé</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowTemplateDialog(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Créer un template
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ─── Logs Tab ──────────────────────────────────────────────── */}
          <TabsContent value="logs" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par email..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={logStatusFilter}
                  onValueChange={(v) => {
                    setLogStatusFilter(v);
                    setLogPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="failed">Échoué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleExportLogs}>
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </div>

            {/* Logs Table */}
            <div className="rounded-lg border">
              {logsLoading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destinataire</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Sujet
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Envoyé le
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Ouvert le
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Cliqué le
                      </TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Erreur
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: EmailLog) => {
                      const logStatus = logStatusConfig[log.status];
                      const StatusIcon = logStatus?.icon || AlertCircle;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-sm">
                            {log.to}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm max-w-[200px] truncate">
                            {log.subject}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${logStatus?.className || ""} gap-1`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {logStatus?.label || log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {log.sentAt
                              ? format(
                                  new Date(log.sentAt),
                                  "d MMM yyyy HH:mm",
                                  { locale: fr }
                                )
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {log.openedAt
                              ? format(
                                  new Date(log.openedAt),
                                  "d MMM yyyy HH:mm",
                                  { locale: fr }
                                )
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {log.clickedAt
                              ? format(
                                  new Date(log.clickedAt),
                                  "d MMM yyyy HH:mm",
                                  { locale: fr }
                                )
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm max-w-[200px] truncate text-red-600">
                            {log.error || "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <ScrollText className="h-10 w-10 text-muted-foreground/40" />
                            <p>Aucun log d&apos;email trouvé</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination */}
            {logPagination && logPagination.pages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {logPagination.page} sur {logPagination.pages} —{" "}
                  {logPagination.total} log(s)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={logPage <= 1}
                    onClick={() => setLogPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{logPage}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={logPage >= logPagination.pages}
                    onClick={() => setLogPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ─── Campaign Create/Edit Dialog ──────────────────────────────────── */}
      <AnimatePresence>
        {showCampaignDialog && (
          <Dialog open={showCampaignDialog} onOpenChange={closeCampaignDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? "Modifier la campagne" : "Nouvelle campagne"}
                </DialogTitle>
                <DialogDescription>
                  {editingCampaign
                    ? "Modifier les détails de la campagne"
                    : "Créer une campagne d'email marketing"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Charger depuis un template (optionnel)</Label>
                  <Select
                    value={campaignForm.templateId}
                    onValueChange={handleSelectTemplateForCampaign}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter((t: EmailTemplate) => t.active)
                        .map((t: EmailTemplate) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} ({categoryConfig[t.category]?.label})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Nom de la campagne *</Label>
                  <Input
                    value={campaignForm.name}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, name: e.target.value })
                    }
                    placeholder="ex: Lancement SASU Guide"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sujet de l&apos;email *</Label>
                  <Input
                    value={campaignForm.subject}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="L'objet de votre email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenu de l&apos;email *</Label>
                  <Textarea
                    value={campaignForm.body}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, body: e.target.value })
                    }
                    rows={10}
                    placeholder="Le contenu de votre email (HTML ou texte)"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Segment cible</Label>
                    <Select
                      value={campaignForm.segment}
                      onValueChange={(v) =>
                        setCampaignForm({ ...campaignForm, segment: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {segmentOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Planifier l&apos;envoi (optionnel)</Label>
                    <Input
                      type="datetime-local"
                      value={campaignForm.scheduledAt}
                      onChange={(e) =>
                        setCampaignForm({
                          ...campaignForm,
                          scheduledAt: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeCampaignDialog}>
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (editingCampaign) {
                      updateCampaignMutation.mutate({
                        id: editingCampaign.id,
                        data: campaignForm,
                      });
                    } else {
                      createCampaignMutation.mutate(campaignForm);
                    }
                  }}
                  disabled={
                    createCampaignMutation.isPending ||
                    updateCampaignMutation.isPending
                  }
                >
                  {createCampaignMutation.isPending ||
                  updateCampaignMutation.isPending
                    ? "Enregistrement..."
                    : editingCampaign
                      ? "Mettre à jour"
                      : "Créer la campagne"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ─── Template Create/Edit Dialog ──────────────────────────────────── */}
      <AnimatePresence>
        {showTemplateDialog && (
          <Dialog open={showTemplateDialog} onOpenChange={closeTemplateDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Modifier le template" : "Nouveau template"}
                </DialogTitle>
                <DialogDescription>
                  {editingTemplate
                    ? "Modifier les détails du template"
                    : "Créer un template d'email réutilisable"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nom du template *</Label>
                    <Input
                      value={templateForm.name}
                      onChange={(e) =>
                        setTemplateForm({ ...templateForm, name: e.target.value })
                      }
                      placeholder="ex: Bienvenue nouvel utilisateur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select
                      value={templateForm.category}
                      onValueChange={(v) =>
                        setTemplateForm({ ...templateForm, category: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Bienvenue</SelectItem>
                        <SelectItem value="recommendation">
                          Recommandation
                        </SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="billing">Facturation</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="transactional">
                          Transactionnel
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sujet de l&apos;email *</Label>
                  <Input
                    value={templateForm.subject}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Sujet de l'email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenu de l&apos;email *</Label>
                  <Textarea
                    value={templateForm.body}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, body: e.target.value })
                    }
                    rows={10}
                    placeholder="Contenu (utilisez {{variable}} pour les variables dynamiques)"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Variables{" "}
                    <span className="text-muted-foreground font-normal">
                      (séparées par des virgules)
                    </span>
                  </Label>
                  <Input
                    value={templateForm.variables}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        variables: e.target.value,
                      })
                    }
                    placeholder="ex: prenom, nom, entreprise"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={templateForm.active}
                    onCheckedChange={(v) =>
                      setTemplateForm({ ...templateForm, active: v })
                    }
                  />
                  <Label>Template actif</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeTemplateDialog}>
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (editingTemplate) {
                      updateTemplateMutation.mutate({
                        id: editingTemplate.id,
                        data: templateForm,
                      });
                    } else {
                      createTemplateMutation.mutate(templateForm);
                    }
                  }}
                  disabled={
                    createTemplateMutation.isPending ||
                    updateTemplateMutation.isPending
                  }
                >
                  {createTemplateMutation.isPending ||
                  updateTemplateMutation.isPending
                    ? "Enregistrement..."
                    : editingTemplate
                      ? "Mettre à jour"
                      : "Créer le template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ─── Quick Send Dialog ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuickSendDialog && (
          <Dialog
            open={showQuickSendDialog}
            onOpenChange={setShowQuickSendDialog}
          >
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Envoi rapide d&apos;email</DialogTitle>
                <DialogDescription>
                  Envoyer un email unique à une adresse spécifique
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Template (optionnel)</Label>
                  <Select
                    value={quickSendForm.templateId}
                    onValueChange={handleSelectTemplateForQuickSend}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter((t: EmailTemplate) => t.active)
                        .map((t: EmailTemplate) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Destinataire *</Label>
                  <Input
                    type="email"
                    value={quickSendForm.to}
                    onChange={(e) =>
                      setQuickSendForm({ ...quickSendForm, to: e.target.value })
                    }
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sujet *</Label>
                  <Input
                    value={quickSendForm.subject}
                    onChange={(e) =>
                      setQuickSendForm({
                        ...quickSendForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Sujet de l'email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenu *</Label>
                  <Textarea
                    value={quickSendForm.body}
                    onChange={(e) =>
                      setQuickSendForm({ ...quickSendForm, body: e.target.value })
                    }
                    rows={8}
                    placeholder="Contenu de l'email"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowQuickSendDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => quickSendMutation.mutate(quickSendForm)}
                  disabled={quickSendMutation.isPending}
                >
                  {quickSendMutation.isPending ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ─── Notification Dialog ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showNotificationDialog && (
          <Dialog
            open={showNotificationDialog}
            onOpenChange={setShowNotificationDialog}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Envoyer une notification</DialogTitle>
                <DialogDescription>
                  Diffuser une notification à un segment d&apos;utilisateurs
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Segment cible *</Label>
                  <Select
                    value={notificationForm.segment}
                    onValueChange={(v) =>
                      setNotificationForm({ ...notificationForm, segment: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un segment..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      <SelectItem value="etudiant">Étudiants</SelectItem>
                      <SelectItem value="salarie">Salariés</SelectItem>
                      <SelectItem value="freelance">Freelances</SelectItem>
                      <SelectItem value="tpe-pme">TPE/PME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="Titre de la notification"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        message: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Contenu du message"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={notificationForm.type}
                      onValueChange={(v) =>
                        setNotificationForm({ ...notificationForm, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <Select
                      value={notificationForm.priority}
                      onValueChange={(v) =>
                        setNotificationForm({
                          ...notificationForm,
                          priority: v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationPriorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Input
                      value={notificationForm.category}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          category: e.target.value,
                        })
                      }
                      placeholder="general"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>
                    URL d&apos;action{" "}
                    <span className="text-muted-foreground font-normal">
                      (optionnel)
                    </span>
                  </Label>
                  <Input
                    value={notificationForm.actionUrl}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        actionUrl: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNotificationDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() =>
                    sendNotificationMutation.mutate(notificationForm)
                  }
                  disabled={sendNotificationMutation.isPending}
                >
                  {sendNotificationMutation.isPending ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Bell className="mr-2 h-4 w-4" />
                      Envoyer notification
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ─── Preview Dialog ───────────────────────────────────────────────── */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prévisualisation du template</DialogTitle>
            <DialogDescription>
              Aperçu du rendu de l&apos;email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-xs uppercase">
                Sujet
              </Label>
              <p className="text-sm font-medium mt-1">
                {previewContent.subject}
              </p>
            </div>
            <Separator />
            <div>
              <Label className="text-muted-foreground text-xs uppercase">
                Contenu
              </Label>
              <div
                className="mt-2 p-4 rounded-lg border bg-muted/30 text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto custom-scrollbar"
                dangerouslySetInnerHTML={{
                  __html: previewContent.body,
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreviewDialog(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ───────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer ce{deleteType === "template" ? " template" : "tte campagne"}{" "}
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le{deleteType === "template" ? " template" : "tte campagne"}{" "}
              sera définitivement supprimé{deleteType === "template" ? "" : "e"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (deleteId) {
                  if (deleteType === "template") {
                    deleteTemplateMutation.mutate(deleteId);
                  } else {
                    deleteCampaignMutation.mutate(deleteId);
                  }
                }
              }}
              disabled={
                deleteTemplateMutation.isPending ||
                deleteCampaignMutation.isPending
              }
            >
              {deleteTemplateMutation.isPending ||
              deleteCampaignMutation.isPending
                ? "Suppression..."
                : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
