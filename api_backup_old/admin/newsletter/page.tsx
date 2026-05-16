"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  UserMinus,
  TrendingUp,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Inbox,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────────

interface Subscriber {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  source: string;
  active: boolean;
  createdAt: string;
}

interface NewsletterResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────────

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

function getFullName(sub: Subscriber) {
  const parts = [sub.firstName, sub.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "—";
}

function formatFrenchDate(dateStr: string) {
  return format(new Date(dateStr), "d MMM yyyy à HH:mm", { locale: fr });
}

// ─── Animation Variants ───────────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ─── Source Labels ────────────────────────────────────────────────────────────────

const sourceLabels: Record<string, string> = {
  footer: "Footer",
  popup: "Popup",
  "audit-form": "Formulaire audit",
  "landing-page": "Landing page",
  blog: "Blog",
  referral: "Parrainage",
};

const sourceStyles: Record<string, string> = {
  footer: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-0",
  popup: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 border-0",
  "audit-form": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0",
  "landing-page": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-0",
  blog: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 border-0",
  referral: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
};

// ─── Main Component ───────────────────────────────────────────────────────────────

export default function NewsletterPage() {
  const queryClient = useQueryClient();

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteEmail, setDeleteEmail] = useState("");

  // Debounce search
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [search]);

  // ─── Queries ──────────────────────────────────────────────────────────────────

  const { data, isLoading } = useQuery<NewsletterResponse>({
    queryKey: ["admin-newsletter", page, debouncedSearch, statusFilter],
    queryFn: () =>
      fetcher(
        `/api/admin/newsletter?page=${page}&limit=20&search=${encodeURIComponent(debouncedSearch)}&status=${statusFilter}`
      ),
  });

  // Stats query — fetch totals without filters
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-newsletter-stats"],
    queryFn: async () => {
      const [allRes, activeRes] = await Promise.all([
        fetcher("/api/admin/newsletter?page=1&limit=1&status=all"),
        fetcher("/api/admin/newsletter?page=1&limit=1&status=active"),
      ]);
      const total = allRes.total ?? 0;
      const active = activeRes.total ?? 0;
      return {
        total,
        active,
        inactive: total - active,
        engagementRate: total > 0 ? Math.round((active / total) * 100) : 0,
      };
    },
  });

  // ─── Mutations ────────────────────────────────────────────────────────────────

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onMutate: async ({ id, active }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["admin-newsletter"] });
      const previousData = queryClient.getQueryData<NewsletterResponse>([
        "admin-newsletter",
      ]);
      // We update all pages since we don't know which page has the item
      queryClient.setQueriesData<NewsletterResponse>(
        { queryKey: ["admin-newsletter"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            subscribers: old.subscribers.map((sub) =>
              sub.id === id ? { ...sub, active } : sub
            ),
          };
        }
      );
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-stats"] });
      toast.success("Statut mis à jour avec succès");
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: ["admin-newsletter"] },
          context.previousData
        );
      }
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-stats"] });
      toast.success("Abonné supprimé avec succès");
      setDeleteId(null);
      setDeleteEmail("");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleToggle = useCallback(
    (sub: Subscriber) => {
      toggleMutation.mutate({ id: sub.id, active: !sub.active });
    },
    [toggleMutation]
  );

  const handleDeleteClick = useCallback((sub: Subscriber) => {
    setDeleteId(sub.id);
    setDeleteEmail(sub.email);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  }, [deleteId, deleteMutation]);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  // ─── Derived data ─────────────────────────────────────────────────────────────

  const subscribers = data?.subscribers ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const stats = statsData ?? {
    total: 0,
    active: 0,
    inactive: 0,
    engagementRate: 0,
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div {...fadeInUp}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Newsletter
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer les abonnés à la newsletter
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <motion.div {...fadeInUp}>
              <Card className="rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Abonnés actifs
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {stats.active}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    sur {stats.total} abonnés au total
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Card className="rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Désabonnés
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <UserMinus className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                    {stats.inactive}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    abonnés inactifs
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Card className="rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taux d&apos;engagement
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.engagementRate}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    actifs / total
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div {...fadeInUp}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email ou nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40 rounded-lg">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {total} abonné{total !== 1 ? "s" : ""}
          </div>
        </div>
      </motion.div>

      {/* Subscribers Table / Cards */}
      <motion.div {...fadeInUp}>
        {isLoading ? (
          /* Loading Skeleton */
          <Card className="rounded-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Desktop table skeleton */}
                <div className="hidden sm:block space-y-3">
                  <Skeleton className="h-10 w-full" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
                {/* Mobile card skeleton */}
                <div className="block sm:hidden space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : subscribers.length === 0 ? (
          /* Empty State */
          <Card className="rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Aucun abonné trouvé
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {search || statusFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche ou de filtre."
                  : "Aucun abonné ne s'est encore inscrit à la newsletter."}
              </p>
              {(search || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="rounded-xl hidden sm:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d&apos;inscription</TableHead>
                      <TableHead className="w-[120px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate max-w-[240px]">
                              {sub.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getFullName(sub)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              sourceStyles[sub.source] ??
                              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0"
                            }
                          >
                            {sourceLabels[sub.source] ?? sub.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sub.active ? (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                              Actif
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0">
                              Inactif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatFrenchDate(sub.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggle(sub)}
                              disabled={toggleMutation.isPending}
                              title={
                                sub.active ? "Désactiver" : "Activer"
                              }
                              className={
                                sub.active
                                  ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              }
                            >
                              {toggleMutation.isPending &&
                              toggleMutation.variables?.id === sub.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : sub.active ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(sub)}
                              disabled={deleteMutation.isPending}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-3">
              {subscribers.map((sub) => (
                <Card key={sub.id} className="rounded-xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {sub.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getFullName(sub)}
                        </p>
                      </div>
                      {sub.active ? (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 flex-shrink-0">
                          Actif
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0 flex-shrink-0">
                          Inactif
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className={
                          sourceStyles[sub.source] ??
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0 text-xs"
                        }
                      >
                        {sourceLabels[sub.source] ?? sub.source}
                      </Badge>
                      <span>·</span>
                      <span>{formatFrenchDate(sub.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggle(sub)}
                        disabled={toggleMutation.isPending}
                      >
                        {toggleMutation.isPending &&
                        toggleMutation.variables?.id === sub.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : sub.active ? (
                          <ToggleRight className="h-4 w-4 mr-2 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 mr-2" />
                        )}
                        {sub.active ? "Désactiver" : "Activer"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(sub)}
                        disabled={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDeleteEmail("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;abonné{" "}
              <span className="font-semibold text-foreground">
                {deleteEmail}
              </span>{" "}
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

