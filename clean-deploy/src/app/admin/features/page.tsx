"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// ── Types ──────────────────────────────────────────────────────────────────

interface Pack {
  id: string;
  slug: string;
  name: string;
  active: boolean;
}

interface Feature {
  id: string;
  name: string;
  slug: string;
  category: string;
  order: number;
  active: boolean;
  packs: Record<string, boolean>;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface FeaturesResponse {
  categories: FeatureCategory[];
  packs: Pack[];
}

// ── Pack color config ──────────────────────────────────────────────────────

const PACK_COLORS: Record<string, { bg: string; text: string; switchChecked: string }> = {
  creation: {
    bg: "bg-sky-100 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-400",
    switchChecked: "data-[state=checked]:bg-sky-600",
  },
  pro: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    switchChecked: "data-[state=checked]:bg-emerald-600",
  },
  premium: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    switchChecked: "data-[state=checked]:bg-orange-600",
  },
};

// ── Fetcher ────────────────────────────────────────────────────────────────

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur de chargement");
  return res.json();
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminFeaturesPage() {
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const { data, isLoading, isError } = useQuery<FeaturesResponse>({
    queryKey: ["admin-features"],
    queryFn: () => fetcher("/api/admin/features"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      featureId,
      packId,
      enabled,
    }: {
      featureId: string;
      packId: string;
      enabled: boolean;
    }) => {
      const res = await fetch("/api/admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, packId, enabled }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-features"] });
      setOptimisticUpdates({});
    },
    onError: () => {
      setOptimisticUpdates({});
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const getEnabled = useCallback(
    (featureId: string, packSlug: string): boolean => {
      // Check optimistic update first
      const optFeature = optimisticUpdates[featureId];
      if (optFeature && optFeature[packSlug] !== undefined) {
        return optFeature[packSlug];
      }
      // Then check fetched data
      if (!data) return false;
      for (const cat of data.categories) {
        const feat = cat.features.find((f) => f.id === featureId);
        if (feat) return feat.packs[packSlug] ?? false;
      }
      return false;
    },
    [data, optimisticUpdates]
  );

  const handleToggle = useCallback(
    (featureId: string, packSlug: string, currentValue: boolean) => {
      const pack = data?.packs.find((p) => p.slug === packSlug);
      if (!pack) return;

      const newValue = !currentValue;

      // Optimistic update
      setOptimisticUpdates((prev) => ({
        ...prev,
        [featureId]: {
          ...(prev[featureId] || {}),
          [packSlug]: newValue,
        },
      }));

      toggleMutation.mutate({
        featureId,
        packId: pack.id,
        enabled: newValue,
      });

      const featureName =
        data?.categories
          .flatMap((c) => c.features)
          .find((f) => f.id === featureId)?.name ?? "Fonctionnalité";

      toast.success(
        newValue
          ? `"${featureName}" activé pour ${pack.name}`
          : `"${featureName}" désactivé pour ${pack.name}`
      );
    },
    [data, toggleMutation]
  );

  const totalFeatures = data?.categories.reduce(
    (acc, cat) => acc + cat.features.length,
    0
  );
  const totalCategories = data?.categories.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Gestion des fonctionnalités
            </h1>
            <p className="text-muted-foreground mt-0.5">
              Définir l&apos;accès aux fonctionnalités par pack
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Catégories
            </p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                totalCategories
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fonctionnalités
            </p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                totalFeatures
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Packs
            </p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                data?.packs.length ?? 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dernière MAJ
            </p>
            <p className="text-sm font-medium mt-2">
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  En temps réel
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Access Matrix */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Skeleton header */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex-1" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
              {/* Skeleton rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-2"
                >
                  <Skeleton className="h-5 w-52" />
                  <div className="flex-1" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-destructive/50">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-semibold text-lg">
                Erreur de chargement
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Impossible de charger les fonctionnalités. Vérifiez la connexion
                à la base de données et réessayez.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50%] sm:w-[45%] pl-4 sm:pl-6">
                    Fonctionnalité
                  </TableHead>
                  {data?.packs.map((pack) => {
                    const colors =
                      PACK_COLORS[pack.slug] ?? PACK_COLORS.premium;
                    return (
                      <TableHead
                        key={pack.id}
                        className="text-center w-[16.6%]"
                      >
                        <Badge
                          variant="secondary"
                          className={`${colors.bg} ${colors.text} text-xs px-2.5 py-0.5`}
                        >
                          {pack.name}
                        </Badge>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.categories.map((category) => (
                  <>
                    {/* Category header row */}
                    <TableRow
                      key={`cat-${category.name}`}
                      className="hover:bg-transparent bg-muted/40"
                    >
                      <TableCell
                        colSpan={1 + (data.packs?.length ?? 0)}
                        className="pl-4 sm:pl-6 font-semibold text-sm text-muted-foreground"
                      >
                        {category.name}
                      </TableCell>
                    </TableRow>
                    {/* Feature rows */}
                    {category.features.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell className="pl-6 sm:pl-10 font-medium text-sm">
                          <div className="flex items-center gap-2">
                            {feature.active ? (
                              <span className="text-sm">
                                {feature.name}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground line-through">
                                {feature.name}
                              </span>
                            )}
                            {!feature.active && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 text-muted-foreground"
                              >
                                inactif
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        {data.packs.map((pack) => {
                          const colors =
                            PACK_COLORS[pack.slug] ?? PACK_COLORS.premium;
                          const enabled = getEnabled(
                            feature.id,
                            pack.slug
                          );
                          const isMutating =
                            toggleMutation.isPending &&
                            optimisticUpdates[feature.id]?.[
                              pack.slug
                            ] !== undefined;

                          return (
                            <TableCell
                              key={`${feature.id}-${pack.id}`}
                              className="text-center"
                            >
                              <div className="flex items-center justify-center">
                                <Switch
                                  checked={enabled}
                                  disabled={isMutating || !feature.active}
                                  onCheckedChange={() =>
                                    handleToggle(
                                      feature.id,
                                      pack.slug,
                                      enabled
                                    )
                                  }
                                  className={`transition-colors ${colors.switchChecked}`}
                                />
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {!isLoading && !isError && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Légende :</span>
          {data?.packs.map((pack) => {
            const colors = PACK_COLORS[pack.slug] ?? PACK_COLORS.premium;
            return (
              <span key={pack.slug} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    pack.slug === "creation"
                      ? "bg-sky-500"
                      : pack.slug === "pro"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                  }`}
                />
                <span>{pack.name}</span>
              </span>
            );
          })}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-muted" />
            <span>Inactif</span>
          </span>
        </div>
      )}
    </div>
  );
}
