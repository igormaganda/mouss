"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
  Plus,
  Save,
  Trash2,
  GripVertical,
  Sparkles,
  Zap,
  Crown,
  Loader2,
  Undo2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeatureItem {
  id?: string;
  name: string;
  order: number;
  hasCreation: boolean;
  hasPro: boolean;
  hasPremium: boolean;
  active: boolean;
}

interface FeatureCategory {
  id?: string;
  name: string;
  order: number;
  active: boolean;
  items: FeatureItem[];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPackFeaturesPage() {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ─── Data Fetching ───────────────────────────────────────────────────────

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pack-features"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pack-features");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      return data.categories as FeatureCategory[];
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
      setHasChanges(false);
    }
  }, [data]);

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const updateCategories = useCallback(
    (updater: (prev: FeatureCategory[]) => FeatureCategory[]) => {
      setCategories((prev) => {
        const next = updater(prev);
        setHasChanges(true);
        return next;
      });
    },
    []
  );

  const addCategory = () => {
    updateCategories((prev) => [
      ...prev,
      {
        name: "Nouvelle catégorie",
        order: prev.length,
        active: true,
        items: [],
      },
    ]);
  };

  const removeCategory = (catIndex: number) => {
    updateCategories((prev) => prev.filter((_, i) => i !== catIndex));
  };

  const updateCategory = (catIndex: number, updates: Partial<FeatureCategory>) => {
    updateCategories((prev) =>
      prev.map((cat, i) => (i === catIndex ? { ...cat, ...updates } : cat))
    );
  };

  const addItem = (catIndex: number) => {
    updateCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  name: "Nouvelle fonctionnalité",
                  order: cat.items.length,
                  hasCreation: false,
                  hasPro: false,
                  hasPremium: false,
                  active: true,
                },
              ],
            }
          : cat
      )
    );
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    updateCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, items: cat.items.filter((_, j) => j !== itemIndex) }
          : cat
      )
    );
  };

  const updateItem = (
    catIndex: number,
    itemIndex: number,
    updates: Partial<FeatureItem>
  ) => {
    updateCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              items: cat.items.map((item, j) =>
                j === itemIndex ? { ...item, ...updates } : item
              ),
            }
          : cat
      )
    );
  };

  // ─── Save ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pack-features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: categories.map((cat, idx) => ({
            ...cat,
            order: idx,
            items: cat.items.map((item, iIdx) => ({
              ...item,
              order: iIdx,
            })),
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Erreur lors de la sauvegarde");
      }

      toast.success("Matrice sauvegardée avec succès");
      queryClient.invalidateQueries({ queryKey: ["admin-pack-features"] });
      queryClient.invalidateQueries({ queryKey: ["pack-features"] });
      setHasChanges(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setCategories(data);
      setHasChanges(false);
      toast.info("Modifications annulées");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Impossible de charger la matrice des fonctionnalités.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["admin-pack-features"] })
          }
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Comparatif des Packs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les fonctionnalités disponibles pour chaque pack (Création,
            Pro, Premium)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Undo2 className="h-4 w-4 mr-1.5" />
              Annuler
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm text-amber-700 dark:text-amber-400">
            Modifications non sauvegardées
          </span>
        </div>
      )}

      {/* Feature Matrix */}
      <div className="space-y-6">
        {categories.map((category, catIndex) => (
          <Card
            key={category.id || `cat-${catIndex}`}
            className={
              !category.active
                ? "opacity-60 border-dashed"
                : ""
            }
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <GripVertical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      updateCategory(catIndex, { name: e.target.value })
                    }
                    className="font-semibold text-base h-9 max-w-xs"
                    placeholder="Nom de la catégorie"
                  />
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={category.active ? "default" : "secondary"}
                      className={
                        category.active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : ""
                      }
                    >
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <Switch
                      checked={category.active}
                      onCheckedChange={(checked) =>
                        updateCategory(catIndex, { active: checked })
                      }
                    />
                    Visible
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(catIndex)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Items Table */}
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] sm:w-[400px]">
                        Fonctionnalité
                      </TableHead>
                      <TableHead className="text-center w-[100px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-xs">Création</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-[100px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <Zap className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-xs">Pro</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-[100px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <Crown className="h-3.5 w-3.5 text-orange-600" />
                          <span className="text-xs">Premium</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-[80px]">
                        <span className="text-xs">Visible</span>
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.items.map((item, itemIndex) => (
                      <TableRow
                        key={item.id || `item-${itemIndex}`}
                        className={!item.active ? "opacity-50" : ""}
                      >
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateItem(catIndex, itemIndex, {
                                name: e.target.value,
                              })
                            }
                            className="h-8 text-sm"
                            placeholder="Nom de la fonctionnalité"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={item.hasCreation}
                              onCheckedChange={(checked) =>
                                updateItem(catIndex, itemIndex, {
                                  hasCreation: checked,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={item.hasPro}
                              onCheckedChange={(checked) =>
                                updateItem(catIndex, itemIndex, {
                                  hasPro: checked,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={item.hasPremium}
                              onCheckedChange={(checked) =>
                                updateItem(catIndex, itemIndex, {
                                  hasPremium: checked,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={item.active}
                              onCheckedChange={(checked) =>
                                updateItem(catIndex, itemIndex, {
                                  active: checked,
                                })
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(catIndex, itemIndex)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {category.items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground text-sm"
                        >
                          Aucune fonctionnalité dans cette catégorie
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Add Item Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addItem(catIndex)}
                className="mt-3"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Ajouter une fonctionnalité
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Category Button */}
        <Button variant="outline" onClick={addCategory} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>
    </div>
  );
}
