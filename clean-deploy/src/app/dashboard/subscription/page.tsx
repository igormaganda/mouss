"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CreditCard,
  Calendar,
  Download,
  AlertTriangle,
  Play,
  Pause,
  X,
  Check,
  Receipt,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Crown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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

// ─── TYPES ────────────────────────────────────────────────────────

interface PackInfo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  period: string;
  features: string;
  highlighted: boolean;
}

interface SubscriptionData {
  id: string;
  status: string;
  paymentMethod: string;
  pack: PackInfo;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  lastBillingDate: string;
  cancelAtPeriodEnd: boolean;
  last4?: string;
  brand?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  currency: string;
}

interface BillingSummary {
  totalThisMonth: number;
  totalAllTime: number;
  nextPayment: string;
  nextPaymentAmount: number;
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// ─── STATUS CONFIG ───────────────────────────────────────────────

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
  active: {
    label: "Actif",
    variant: "default",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100",
  },
  paused: {
    label: "En pause",
    variant: "secondary",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100",
  },
  cancelled: {
    label: "Annulé",
    variant: "destructive",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100",
  },
  trialing: {
    label: "Essai",
    variant: "outline",
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100",
  },
  past_due: {
    label: "En retard",
    variant: "destructive",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100",
  },
  expired: {
    label: "Expiré",
    variant: "secondary",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 hover:bg-gray-100",
  },
};

const invoiceStatusConfig: Record<string, { label: string; className: string }> = {
  paid: {
    label: "Payée",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  pending: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  overdue: {
    label: "En retard",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  failed: {
    label: "Échouée",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  void: {
    label: "Annulée",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

const paymentMethodLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  card: {
    label: "Carte bancaire",
    icon: <CreditCard className="h-4 w-4" />,
  },
  paypal: {
    label: "PayPal",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.654h6.57c2.175 0 3.713.578 4.576 1.719.396.522.601 1.098.601 1.73 0 .27-.028.558-.086.86a5.18 5.18 0 0 1-.176.68l-.002.009-.004.015c-.88 3.39-3.225 5.08-7.067 5.08H7.98a.956.956 0 0 0-.943.8l-1.01 6.368-.29 1.834a.5.5 0 0 0 .49.58h.849z" />
      </svg>
    ),
  },
  wallet: {
    label: "Apple Pay / Google Pay",
    icon: <CreditCard className="h-4 w-4" />,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  } catch {
    return dateStr;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────

export default function SubscriptionDashboardPage() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const { data: subData, isLoading: subLoading, refetch: refetchSub } = useQuery<{
    subscription: SubscriptionData;
  }>({
    queryKey: ["subscription"],
    queryFn: () => fetcher("/api/billing/subscription?userId=demo"),
  });

  const { data: invoiceData, isLoading: invLoading } = useQuery<{
    invoices: Invoice[];
    summary: BillingSummary;
  }>({
    queryKey: ["invoices"],
    queryFn: () => fetcher("/api/billing/invoices?userId=demo"),
  });

  const subscription = subData?.subscription;
  const invoices = invoiceData?.invoices || [];
  const summary = invoiceData?.summary;
  const features: string[] = subscription?.pack
    ? JSON.parse(subscription.pack.features)
    : [];
  const statusCfg = subscription ? statusConfig[subscription.status] || statusConfig.active : statusConfig.active;
  const paymentInfo = subscription
    ? paymentMethodLabels[subscription.paymentMethod] || paymentMethodLabels.card
    : paymentMethodLabels.card;

  // ── Handlers ──

  const handlePauseResume = async () => {
    if (!subscription) return;
    const action = subscription.status === "paused" ? "resume" : "pause";
    try {
      setIsPausing(true);
      const res = await fetch("/api/billing/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subscription.id, action }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.subscription.message);
        refetchSub();
      } else {
        toast.error("Erreur lors de la modification");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsPausing(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    try {
      setIsCancelling(true);
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.subscription.message);
        setCancelOpen(false);
        refetchSub();
      } else {
        toast.error("Erreur lors de l'annulation");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.info(
      `Téléchargement de ${invoice.invoiceNumber}... (simulé)`
    );
  };

  // ── Loading State ──

  if (subLoading || invLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  // ── No Subscription ──

  if (!subscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mon abonnement</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre formule et vos factures
          </p>
        </div>

        <Card className="border-dashed rounded-2xl">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4">
              <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Aucun abonnement actif</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vous n&apos;avez pas encore souscrit à une formule. Découvrez nos
              offres et choisissez celle qui correspond à vos besoins.
            </p>
            <Link href="/#packs">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Découvrir les formules
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Main Render ──

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Page Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold">Mon abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre formule et vos factures
        </p>
      </motion.div>

      {/* ── Current Plan Card ── */}
      <motion.div variants={item}>
        <Card className="rounded-2xl overflow-hidden border shadow-sm">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Left side */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {subscription.pack.name}
                  </h2>
                  <Badge className={statusCfg.className}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                        subscription.status === "active"
                          ? "bg-emerald-500"
                          : subscription.status === "paused"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    {statusCfg.label}
                  </Badge>
                  {subscription.pack.highlighted && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {subscription.pack.tagline}
                </p>

                {/* Features preview */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {features.slice(0, 4).map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-1"
                    >
                      <Check className="h-3 w-3 text-emerald-500" />
                      {f}
                    </span>
                  ))}
                  {features.length > 4 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{features.length - 4} autres
                    </span>
                  )}
                </div>
              </div>

              {/* Right side: Price */}
              <div className="text-right sm:min-w-[140px]">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-3xl font-extrabold">
                    {subscription.pack.price}€
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{subscription.pack.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  TTC
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Next Billing */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Prochain paiement
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
              </div>

              {/* Last Billing */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Dernier paiement
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(subscription.lastBillingDate)}
                  </p>
                </div>
              </div>

              {/* Period End */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <RefreshCw className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Fin de période
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  {paymentInfo.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Méthode de paiement
                  </p>
                  <p className="text-sm font-semibold">
                    {paymentInfo.label}
                    {subscription.last4 && ` ••${subscription.last4}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Cancel at period end notice */}
            {subscription.cancelAtPeriodEnd && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Votre abonnement sera annulé à la fin de la période en cours (
                  {formatDate(subscription.currentPeriodEnd)}). Vous conservez
                  l&apos;accès jusqu&apos;à cette date.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold mb-3">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Change Plan */}
          <Link href="/#packs">
            <Button
              variant="outline"
              className="w-full h-auto py-4 justify-start gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">Changer de formule</div>
                <div className="text-xs text-muted-foreground">
                  Passer à une formule supérieure ou inférieure
                </div>
              </div>
            </Button>
          </Link>

          {/* Pause / Resume */}
          <Button
            variant="outline"
            className="w-full h-auto py-4 justify-start gap-3"
            onClick={handlePauseResume}
            disabled={isPausing || subscription.status === "cancelled"}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              {subscription.status === "paused" ? (
                <Play className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Pause className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">
                {isPausing
                  ? "Chargement..."
                  : subscription.status === "paused"
                  ? "Reprendre"
                  : "Mettre en pause"}
              </div>
              <div className="text-xs text-muted-foreground">
                {subscription.status === "paused"
                  ? "Réactiver votre abonnement"
                  : "Suspendre temporairement"}
              </div>
            </div>
          </Button>

          {/* Cancel */}
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                disabled={subscription.status === "cancelled"}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <X className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">
                    Annuler l&apos;abonnement
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Annulation à la fin de la période
                  </div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Confirmer l&apos;annulation
                </DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir annuler votre abonnement{" "}
                  <strong>{subscription.pack.name}</strong> ? Vous conservez
                  l&apos;accès jusqu&apos;au{" "}
                  <strong>
                    {formatDate(subscription.currentPeriodEnd)}
                  </strong>
                  .
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(false)}
                  disabled={isCancelling}
                >
                  Non, garder
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Oui, annuler
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Download Invoice */}
          <Button
            variant="outline"
            className="w-full h-auto py-4 justify-start gap-3"
            onClick={() =>
              toast.info("Téléchargement de la dernière facture... (simulé)")
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Télécharger la facture</div>
              <div className="text-xs text-muted-foreground">
                Dernière facture en PDF
              </div>
            </div>
          </Button>
        </div>
      </motion.div>

      {/* ── Billing Overview ── */}
      {summary && (
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold mb-3">Résumé de facturation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Payé ce mois
                    </p>
                    <p className="text-xl font-bold">
                      {(summary?.totalThisMonth ?? 0).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Receipt className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total depuis le début
                    </p>
                    <p className="text-xl font-bold">
                      {(summary?.totalAllTime ?? 0).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Prochain paiement
                    </p>
                    <p className="text-xl font-bold">
                      {(summary?.nextPaymentAmount ?? 0).toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(summary?.nextPayment)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* ── Payment History ── */}
      <motion.div variants={item}>
        <Card className="rounded-2xl overflow-hidden border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Historique des paiements
                </CardTitle>
                <CardDescription className="mt-1">
                  Vos dernières factures et reçus
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {invoices.length} facture{invoices.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const invStatus =
                      invoiceStatusConfig[invoice.status] ||
                      invoiceStatusConfig.pending;
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="text-sm">
                          {formatDate(invoice.dueDate)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {(invoice.total ?? 0).toFixed(2)}€
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${invStatus.className}`}
                          >
                            {invStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Télécharger
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y max-h-96 overflow-y-auto">
              {invoices.map((invoice) => {
                const invStatus =
                  invoiceStatusConfig[invoice.status] ||
                  invoiceStatusConfig.pending;
                return (
                  <div key={invoice.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium">
                        {invoice.invoiceNumber}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${invStatus.className}`}
                      >
                        {invStatus.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(invoice.dueDate)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">
                          {(invoice.total ?? 0).toFixed(2)}€
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
