"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Gift,
  Users,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface ReferralItem {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  refereeId: string | null;
  refereeName: string;
  refereeEmail: string;
  refereeEmail_raw?: string;
  code: string;
  status: string;
  referrerReward: boolean;
  refereeReward: boolean;
  orderId: string | null;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface ReferralProgram {
  id: string;
  active: boolean;
  rewardType: string;
  rewardValue: number;
  refereeRewardType: string;
  refereeRewardValue: number;
  minOrderAmount: number;
  maxUsesPerUser: number;
}

interface AdminStats {
  totalReferralsThisMonth: number;
  totalRewardsGiven: number;
  conversionRate: number;
  totalReferralsAll: number;
  completedReferrals: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  completed: {
    label: "Complete",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  rewarded: {
    label: "Recompense",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  expired: {
    label: "Expiré",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

const REWARD_TYPE_LABELS: Record<string, string> = {
  credit: "Credit (EUR)",
  discount: "Remise (%)",
  free_month: "Mois gratuit",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdminReferralsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Form state for program settings (defaults, will be synced when dialog opens)
  const [formRewardType, setFormRewardType] = useState("credit");
  const [formRewardValue, setFormRewardValue] = useState("10");
  const [formRefereeRewardType, setFormRefereeRewardType] = useState("credit");
  const [formRefereeRewardValue, setFormRefereeRewardValue] = useState("10");
  const [formMinOrderAmount, setFormMinOrderAmount] = useState("0");
  const [formMaxUsesPerUser, setFormMaxUsesPerUser] = useState("50");
  const [formActive, setFormActive] = useState(true);

  /* ── Queries ──────────────────────────────────────────────────────────── */

  const {
    data: referralsData,
    isLoading: referralsLoading,
  } = useQuery({
    queryKey: ["admin-referrals", statusFilter],
    queryFn: () =>
      fetch(
        `/api/admin/referrals?status=${statusFilter === "all" ? "" : statusFilter}&limit=50`
      ).then((r) => r.json()),
  });

  const { data: programData, isLoading: programLoading } = useQuery({
    queryKey: ["referral-program"],
    queryFn: () => fetch("/api/referral/program").then((r) => r.json()),
  });

  const referrals: ReferralItem[] = referralsData?.referrals ?? [];
  const stats: AdminStats = referralsData?.stats ?? {
    totalReferralsThisMonth: 0,
    totalRewardsGiven: 0,
    conversionRate: 0,
    totalReferralsAll: 0,
    completedReferrals: 0,
  };
  const program: ReferralProgram | null = programData?.program ?? null;

  const syncFormFromProgram = (p: ReferralProgram) => {
    setFormRewardType(p.rewardType);
    setFormRewardValue(String(p.rewardValue));
    setFormRefereeRewardType(p.refereeRewardType);
    setFormRefereeRewardValue(String(p.refereeRewardValue));
    setFormMinOrderAmount(String(p.minOrderAmount));
    setFormMaxUsesPerUser(String(p.maxUsesPerUser));
    setFormActive(p.active);
  };

  const openSettings = () => {
    if (program) syncFormFromProgram(program);
    setSettingsOpen(true);
  };

  /* ── Mutations ────────────────────────────────────────────────────────── */

  const updateProgramMutation = useMutation({
    mutationFn: (data: {
      rewardType: string;
      rewardValue: number;
      refereeRewardType: string;
      refereeRewardValue: number;
      minOrderAmount: number;
      maxUsesPerUser: number;
      active: boolean;
    }) =>
      fetch("/api/referral/program", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-program"] });
      toast.success("Parametres du programme mis a jour");
      setSettingsOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de la mise a jour");
    },
  });

  const handleSaveSettings = () => {
    updateProgramMutation.mutate({
      rewardType: formRewardType,
      rewardValue: parseInt(formRewardValue) || 0,
      refereeRewardType: formRefereeRewardType,
      refereeRewardValue: parseInt(formRefereeRewardValue) || 0,
      minOrderAmount: parseInt(formMinOrderAmount) || 0,
      maxUsesPerUser: parseInt(formMaxUsesPerUser) || 50,
      active: formActive,
    });
  };

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Gift className="h-7 w-7 text-emerald-600" />
              Parrainage
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerez le programme de parrainage et suivez les performances
            </p>
          </div>
          <Button
            onClick={openSettings}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Parametres
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total parrainages",
            value: stats.totalReferralsAll,
            icon: Users,
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
          },
          {
            label: "Parrainages ce mois",
            value: stats.totalReferralsThisMonth,
            icon: TrendingUp,
            color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
          },
          {
            label: "Recompenses distribuees",
            value: `${stats.totalRewardsGiven}€`,
            icon: Award,
            color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
          },
          {
            label: "Taux de conversion",
            value: `${stats.conversionRate}%`,
            icon: CheckCircle,
            color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
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
                {referralsLoading ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}
                    >
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

      {/* Program Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Configuration du programme</CardTitle>
                <CardDescription>
                  Parametres actuels du programme de parrainage
                </CardDescription>
              </div>
              <Badge
                variant={program?.active ? "default" : "secondary"}
                className={program?.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
              >
                {program?.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {programLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-56" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Recompense parrain</p>
                  <p className="font-medium">
                    {program?.rewardValue ?? 0}€ ({REWARD_TYPE_LABELS[program?.rewardType ?? "credit"]})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Recompense filleul</p>
                  <p className="font-medium">
                    {program?.refereeRewardValue ?? 0}€ ({REWARD_TYPE_LABELS[program?.refereeRewardType ?? "credit"]})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Montant minimum commande</p>
                  <p className="font-medium">{program?.minOrderAmount ?? 0}€</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max utilisations / utilisateur</p>
                  <p className="font-medium">{program?.maxUsesPerUser ?? 50}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Referrals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Liste des parrainages</CardTitle>
                <CardDescription>
                  {referrals.length} parrainage(s) trouve(s)
                </CardDescription>
              </div>
              {/* Status filter */}
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "completed", "rewarded", "expired"].map((s) => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(s)}
                    className={statusFilter === s ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                  >
                    {s === "all"
                      ? "Tous"
                      : STATUS_BADGES[s]?.label || s}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {referralsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun parrainage trouve</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parrain</TableHead>
                      <TableHead>Filleul</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Recompense</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((ref) => {
                      const statusBadge = STATUS_BADGES[ref.status] || STATUS_BADGES.pending;
                      return (
                        <TableRow key={ref.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{ref.referrerName}</p>
                              <p className="text-xs text-muted-foreground">{ref.referrerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{ref.refereeName}</p>
                              <p className="text-xs text-muted-foreground">{ref.refereeEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {ref.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusBadge.className}
                            >
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {ref.amount > 0 ? `${ref.amount}€` : "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(ref.createdAt)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Parametres du programme</DialogTitle>
            <DialogDescription>
              Configurez les regles de parrainage et les recompenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="active-switch">Programme actif</Label>
              <Switch
                id="active-switch"
                checked={formActive}
                onCheckedChange={setFormActive}
              />
            </div>

            <Separator />

            {/* Referrer reward */}
            <div className="space-y-3">
              <Label className="font-medium">Recompense parrain</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select value={formRewardType} onValueChange={setFormRewardType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (EUR)</SelectItem>
                      <SelectItem value="discount">Remise (%)</SelectItem>
                      <SelectItem value="free_month">Mois gratuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Valeur</Label>
                  <Input
                    type="number"
                    value={formRewardValue}
                    onChange={(e) => setFormRewardValue(e.target.value)}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Referee reward */}
            <div className="space-y-3">
              <Label className="font-medium">Recompense filleul</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select value={formRefereeRewardType} onValueChange={setFormRefereeRewardType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (EUR)</SelectItem>
                      <SelectItem value="discount">Remise (%)</SelectItem>
                      <SelectItem value="free_month">Mois gratuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Valeur</Label>
                  <Input
                    type="number"
                    value={formRefereeRewardValue}
                    onChange={(e) => setFormRefereeRewardValue(e.target.value)}
                    min={0}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Limits */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Montant min. commande (EUR)</Label>
                <Input
                  type="number"
                  value={formMinOrderAmount}
                  onChange={(e) => setFormMinOrderAmount(e.target.value)}
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Max utilisations / utilisateur</Label>
                <Input
                  type="number"
                  value={formMaxUsesPerUser}
                  onChange={(e) => setFormMaxUsesPerUser(e.target.value)}
                  min={1}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={updateProgramMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
