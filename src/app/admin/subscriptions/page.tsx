"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Actif", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled: { label: "Annulé", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  expired: { label: "Expiré", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
};

function SubscriptionStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">{status}</Badge>;
  return (
    <Badge variant="secondary" className={`border-0 font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}

interface SubscriptionItem {
  id: string;
  userId: string | null;
  email: string;
  packId: string;
  packName: string;
  stripeSubId: string | null;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    return `/api/admin/subscriptions?${params.toString()}`;
  }, [page, statusFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscriptions", page, statusFilter],
    queryFn: () => fetch(buildQuery()).then((r) => r.json()),
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Count summaries
  const activeCount = data?.total && statusFilter === "all"
    ? "—"
    : statusFilter === "active"
      ? data?.total || 0
      : "—";
  const cancelledCount = statusFilter === "cancelled" ? data?.total || 0 : "—";
  const expiredCount = statusFilter === "expired" ? data?.total || 0 : "—";

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Abonnements
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestion et suivi de tous les abonnements actifs et expirés
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeUp} custom={1}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                  <p className="text-xl font-bold">{data?.total || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <CreditCard className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annulés</p>
                  <p className="text-xl font-bold">{cancelledCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                  <CreditCard className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expirés</p>
                  <p className="text-xl font-bold">{expiredCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} custom={2}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {data ? `${data.total} abonnement${data.total !== 1 ? "s" : ""}` : "Chargement..."}
              </p>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscriptions Table */}
      <motion.div variants={fadeUp} custom={3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des abonnements</CardTitle>
            <CardDescription>
              Tous les abonnements avec leurs statuts actuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded" />
                ))}
              </div>
            ) : data?.subscriptions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun abonnement trouvé
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="hidden sm:table-cell">Début</TableHead>
                        <TableHead className="hidden md:table-cell">Fin</TableHead>
                        <TableHead className="hidden lg:table-cell">Annulation auto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.subscriptions.map((sub: SubscriptionItem) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">
                            {sub.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              {sub.packName}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <SubscriptionStatusBadge status={sub.status} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                            {sub.currentPeriodStart
                              ? format(new Date(sub.currentPeriodStart), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {sub.currentPeriodEnd
                              ? format(new Date(sub.currentPeriodEnd), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {sub.cancelAtPeriodEnd ? (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                                Oui
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">Non</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {data.page} sur {data.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page >= data.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
