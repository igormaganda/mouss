"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Gift,
  Percent,
  Euro,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KPICard } from "@/components/admin/kpi-card";

interface CouponData {
  id: string;
  code: string;
  type: string;
  value: number;
  description: string | null;
  packId: string | null;
  minAmount: number;
  maxUses: number;
  usedCount: number;
  totalUsages: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponStats {
  total: number;
  active: number;
  usedThisMonth: number;
  totalDiscount: number;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

const emptyForm = {
  code: "",
  type: "percentage",
  value: "",
  description: "",
  packId: "",
  minAmount: "",
  maxUses: "",
  startDate: "",
  endDate: "",
  active: true,
};

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{
    coupons: CouponData[];
    stats: CouponStats;
  }>({
    queryKey: ["admin-coupons"],
    queryFn: () => fetcher("/api/admin/coupons"),
  });

  const createMutation = useMutation({
    mutationFn: async (values: typeof emptyForm) => {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la création");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Coupon créé avec succès");
      setIsCreateOpen(false);
      setFormData(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/coupons/${editingCoupon?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la modification");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Coupon mis à jour avec succès");
      setIsEditOpen(false);
      setEditingCoupon(null);
      setFormData(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Coupon désactivé avec succès");
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const coupons = data?.coupons || [];
  const stats = data?.stats;

  const filteredCoupons = coupons.filter((c) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && c.active) ||
      (filterStatus === "inactive" && !c.active);
    const matchesSearch =
      !searchQuery ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEdit = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      description: coupon.description || "",
      packId: coupon.packId || "",
      minAmount: String(coupon.minAmount),
      maxUses: String(coupon.maxUses),
      startDate: coupon.startDate ? coupon.startDate.split("T")[0] : "",
      endDate: coupon.endDate ? coupon.endDate.split("T")[0] : "",
      active: coupon.active,
    });
    setIsEditOpen(true);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Coupons &amp; Codes promo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos codes de réduction et promotions
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setFormData(emptyForm);
                setIsCreateOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer un coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau coupon</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau code promo.
              </DialogDescription>
            </DialogHeader>
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => createMutation.mutate(formData)}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total coupons"
          value={stats?.total ?? 0}
          icon={Tag}
        />
        <KPICard
          title="Coupons actifs"
          value={stats?.active ?? 0}
          icon={Gift}
        />
        <KPICard
          title="Utilisations ce mois"
          value={stats?.usedThisMonth ?? 0}
          icon={Percent}
        />
        <KPICard
          title="Remise totale accordée"
          value={formatCurrency(stats?.totalDiscount ?? 0)}
          icon={Euro}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un code ou description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
            >
              <SelectTrigger className="w-full sm:w-44">
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
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des coupons</CardTitle>
          <CardDescription>
            {filteredCoupons.length} coupon(s) affiché(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead className="hidden md:table-cell">Utilisations</TableHead>
                  <TableHead className="hidden lg:table-cell">Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">Dates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                          {coupon.code}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          coupon.type === "percentage"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                        }
                      >
                        {coupon.type === "percentage" ? "%" : "€"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : formatCurrency(coupon.value)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">
                        {coupon.totalUsages}
                        {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ""}
                      </span>
                      {coupon.maxUses > 0 && (
                        <div className="mt-1 h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                              width: `${Math.min(
                                (coupon.totalUsages / coupon.maxUses) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="secondary"
                        className={
                          coupon.active
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0"
                        }
                      >
                        {coupon.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground">
                        {coupon.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(coupon.startDate), "d MMM yyyy", { locale: fr })}
                          </div>
                        )}
                        {coupon.endDate && (
                          <div className="flex items-center gap-1">
                            →{" "}
                            {format(new Date(coupon.endDate), "d MMM yyyy", { locale: fr })}
                          </div>
                        )}
                        {!coupon.startDate && !coupon.endDate && <span>Illimité</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(coupon)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {coupon.active ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(coupon.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              updateMutation.mutate({
                                active: true,
                                code: coupon.code,
                              });
                            }}
                            className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            Réactiver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCoupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchQuery || filterStatus !== "all"
                        ? "Aucun coupon trouvé"
                        : "Aucun coupon créé"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le coupon</DialogTitle>
            <DialogDescription>
              Modifiez les informations du code promo.
            </DialogDescription>
          </DialogHeader>
          <CouponForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => updateMutation.mutate(formData)}
            isSubmitting={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Désactiver le coupon</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir désactiver ce coupon ? Il ne sera plus utilisable.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Désactivation..." : "Désactiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Coupon Form Component ─── */

function CouponForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: {
  formData: Record<string, unknown>;
  setFormData: (data: Record<string, unknown>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const update = (key: string, value: unknown) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            placeholder="PROMO2024"
            value={formData.code as string}
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type as string}
            onValueChange={(v) => update("type", v)}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Pourcentage (%)</SelectItem>
              <SelectItem value="fixed">Montant fixe (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">
            Valeur ({formData.type === "percentage" ? "%" : "centimes"})
          </Label>
          <Input
            id="value"
            type="number"
            min="0"
            max={formData.type === "percentage" ? "100" : undefined}
            placeholder={formData.type === "percentage" ? "20" : "1500"}
            value={formData.value as string}
            onChange={(e) => update("value", e.target.value)}
          />
          {formData.type === "fixed" && formData.value && (
            <p className="text-xs text-muted-foreground">
              = {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                Number(formData.value) / 100
              )}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Réduction de lancement..."
            value={formData.description as string}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minAmount">Montant minimum (centimes)</Label>
          <Input
            id="minAmount"
            type="number"
            min="0"
            placeholder="0"
            value={formData.minAmount as string}
            onChange={(e) => update("minAmount", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Utilisations max (0 = illimité)</Label>
          <Input
            id="maxUses"
            type="number"
            min="0"
            placeholder="0"
            value={formData.maxUses as string}
            onChange={(e) => update("maxUses", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate as string}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate as string}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Switch
          id="active"
          checked={formData.active as boolean}
          onCheckedChange={(v) => update("active", v)}
        />
        <Label htmlFor="active">Coupon actif</Label>
      </div>

      <DialogFooter>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={
            isSubmitting || !formData.code || !formData.value
          }
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogFooter>
    </div>
  );
}
