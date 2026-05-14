"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  completed: { label: "Complété", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  succeeded: { label: "Succès", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  failed: { label: "Échoué", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  refunded: { label: "Remboursé", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
};

function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status];
  if (!config) return <Badge variant="outline">{status}</Badge>;
  return (
    <Badge variant="secondary" className={`border-0 font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}

interface OrderItem {
  id: string;
  email: string;
  packId: string;
  packName: string;
  amount: number;
  currency: string;
  status: string;
  stripeSession: string | null;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: string;
    stripePaymentId: string | null;
    amount: number;
    currency: string;
    status: string;
    metadata: string | null;
    createdAt: string;
  } | null;
}

interface OrderDetailProps {
  order: OrderItem;
  open: boolean;
  onClose: () => void;
}

function OrderDetailDialog({ order, open, onClose }: OrderDetailProps) {
  let paymentMeta: Record<string, unknown> | null = null;
  try {
    paymentMeta = order.payment?.metadata ? JSON.parse(order.payment.metadata) : null;
  } catch {
    paymentMeta = null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de la commande</DialogTitle>
          <DialogDescription>
            Commande #{order.id.slice(0, 12)}...
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Email</p>
              <p className="font-medium mt-1">{order.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Pack</p>
              <p className="font-medium mt-1">{order.packName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Montant</p>
              <p className="font-medium mt-1">{formatCurrency(order.amount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Statut</p>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Date</p>
              <p className="font-medium mt-1">
                {format(new Date(order.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Session Stripe</p>
              <p className="font-mono text-xs mt-1 text-muted-foreground truncate">
                {order.stripeSession || "—"}
              </p>
            </div>
          </div>
          {order.payment && (
            <div className="border-t pt-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Paiement</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">ID Paiement</p>
                  <p className="font-mono text-xs mt-0.5 truncate">
                    {order.payment.stripePaymentId || order.payment.id.slice(0, 12) + "..."}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Statut Paiement</p>
                  <div className="mt-0.5">
                    <OrderStatusBadge status={order.payment.status} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packFilter, setPackFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (packFilter && packFilter !== "all") params.set("pack", packFilter);
    return `/api/admin/orders?${params.toString()}`;
  }, [page, search, statusFilter, packFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, search, statusFilter, packFilter],
    queryFn: () => fetch(buildQuery()).then((r) => r.json()),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePackChange = (value: string) => {
    setPackFilter(value);
    setPage(1);
  };

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
          Commandes
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestion et suivi de toutes les commandes
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} custom={1}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={packFilter} onValueChange={handlePackChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Pack" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les packs</SelectItem>
                  <SelectItem value="decouverte">Découverte</SelectItem>
                  <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={fadeUp} custom={2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Toutes les commandes</CardTitle>
            <CardDescription>
              {data ? `${data.total} commande${data.total !== 1 ? "s" : ""} trouvée${data.total !== 1 ? "s" : ""}` : "Chargement..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded" />
                ))}
              </div>
            ) : data?.orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune commande trouvée
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.orders.map((order: OrderItem) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {order.email}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.packName}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.amount)}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {format(new Date(order.createdAt), "d MMM yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
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

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  );
}
