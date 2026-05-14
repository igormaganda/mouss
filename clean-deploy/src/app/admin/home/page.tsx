"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Users,
  AlertTriangle,
  Grid3X3,
  Map,
  ClipboardCheck,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Award,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Loader2,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// ── Types ──────────────────────────────────────────────────────────────────────

interface SectionItem {
  id: string;
  label: string;
  content: string | null;
  icon: string | null;
  color: string | null;
  data: string | null;
  active: boolean;
  order: number;
}

interface Section {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  badge: string;
  active: boolean;
  order: number;
  settings: string | null;
  items: SectionItem[];
}

interface SectionConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  hasItems: boolean;
  itemLabel: string;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const sectionConfig: SectionConfig[] = [
  { type: "hero", label: "Hero", icon: Sparkles, description: "Section d'accroche principale avec CTA", hasItems: true, itemLabel: "Statistique" },
  { type: "profiles", label: "Profils", icon: Users, description: "Cartes profils entrepreneur", hasItems: true, itemLabel: "Profil" },
  { type: "pain_points", label: "Pain Points", icon: AlertTriangle, description: "Frustrations et solutions", hasItems: true, itemLabel: "Pain Point" },
  { type: "thematic", label: "Thématiques", icon: Grid3X3, description: "Navigation par thème", hasItems: true, itemLabel: "Thème" },
  { type: "roadmap", label: "Roadmap", icon: Map, description: "Parcours en 4 phases", hasItems: true, itemLabel: "Phase" },
  { type: "audit", label: "Audit", icon: ClipboardCheck, description: "Section quiz/audit", hasItems: false, itemLabel: "" },
  { type: "testimonials", label: "Témoignages", icon: MessageSquareQuote, description: "Témoignages clients", hasItems: true, itemLabel: "Témoignage" },
  { type: "faq", label: "FAQ", icon: HelpCircle, description: "Questions fréquentes", hasItems: true, itemLabel: "Question" },
  { type: "newsletter", label: "Newsletter", icon: Mail, description: "Section inscription newsletter", hasItems: false, itemLabel: "" },
  { type: "social_proof", label: "Social Proof", icon: Award, description: "Partenaires et logos", hasItems: true, itemLabel: "Partenaire" },
];

const emptyItemForm = {
  label: "",
  content: "",
  icon: "",
  color: "",
  data: "",
  active: true,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur lors du chargement");
  return res.json();
}

function parseJSONSafe(str: string | null): string {
  if (!str) return "{}";
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AdminHomePage() {
  const queryClient = useQueryClient();

  // ── State ──
  const [activeTab, setActiveTab] = useState("hero");
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<{ sectionId: string; itemId: string } | null>(null);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  // Section settings editing
  const [editingSettings, setEditingSettings] = useState<Record<string, { title: string; subtitle: string; badge: string; settings: string; order: number }>>({});

  // ── Data fetching ──
  const { data: sectionsData, isLoading } = useQuery({
    queryKey: ["home-sections"],
    queryFn: () => fetcher("/api/home/sections?all=true"),
  });

  const sections: Section[] = Array.isArray(sectionsData) ? sectionsData : sectionsData?.sections ?? [];

  const getSection = useCallback(
    (type: string) => sections.find((s: Section) => s.type === type),
    [sections]
  );

  const getEditingSetting = useCallback(
    (section: Section) => {
      if (!editingSettings[section.id]) {
        return {
          title: section.title,
          subtitle: section.subtitle,
          badge: section.badge,
          settings: parseJSONSafe(section.settings),
          order: section.order,
        };
      }
      return editingSettings[section.id];
    },
    [editingSettings]
  );

  // ── Mutations ──

  // Update section
  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title?: string; subtitle?: string; badge?: string; active?: boolean; order?: number; settings?: string }) => {
      const res = await fetch(`/api/home/sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
      setEditingSettings((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
      toast.success("Section mise à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  // Create item
  const createItemMutation = useMutation({
    mutationFn: async ({ sectionId, ...data }: { sectionId: string; label: string; content?: string; icon?: string; color?: string; data?: string; order?: number }) => {
      const res = await fetch(`/api/home/sections/${sectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
      toast.success("Élément créé");
      setShowItemDialog(false);
      setEditingItem(null);
      setItemForm(emptyItemForm);
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  // Update item
  const updateItemMutation = useMutation({
    mutationFn: async ({ sectionId, itemId, ...data }: { sectionId: string; itemId: string; label?: string; content?: string; icon?: string; color?: string; data?: string; active?: boolean; order?: number }) => {
      const res = await fetch(`/api/home/sections/${sectionId}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
      toast.success("Élément mis à jour");
      setShowItemDialog(false);
      setEditingItem(null);
      setItemForm(emptyItemForm);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  // Delete item
  const deleteItemMutation = useMutation({
    mutationFn: async ({ sectionId, itemId }: { sectionId: string; itemId: string }) => {
      const res = await fetch(`/api/home/sections/${sectionId}/items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
      toast.success("Élément supprimé");
      setDeleteItemId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  // Reorder item
  const reorderItemMutation = useMutation({
    mutationFn: async ({ sectionId, itemId, order }: { sectionId: string; itemId: string; order: number }) => {
      const res = await fetch(`/api/home/sections/${sectionId}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
    },
  });

  // Toggle item active
  const toggleItemMutation = useMutation({
    mutationFn: async ({ sectionId, itemId, active }: { sectionId: string; itemId: string; active: boolean }) => {
      const res = await fetch(`/api/home/sections/${sectionId}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-sections"] });
      toast.success("Statut mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });

  // ── Handlers ──

  const handleSaveSectionSettings = (section: Section) => {
    const es = getEditingSetting(section);
    try {
      const parsedSettings = JSON.parse(es.settings || "{}");
      updateSectionMutation.mutate({
        id: section.id,
        title: es.title,
        subtitle: es.subtitle,
        badge: es.badge,
        order: es.order,
        settings: JSON.stringify(parsedSettings),
      });
    } catch {
      toast.error("JSON invalide dans les paramètres");
    }
  };

  const handleToggleSection = (section: Section) => {
    updateSectionMutation.mutate({ id: section.id, active: !section.active });
  };

  const handleOpenNewItem = (section: Section) => {
    setEditingItem(null);
    setItemForm(emptyItemForm);
    setShowItemDialog(true);
  };

  const handleOpenEditItem = (item: SectionItem) => {
    setEditingItem(item);
    setItemForm({
      label: item.label,
      content: item.content || "",
      icon: item.icon || "",
      color: item.color || "",
      data: parseJSONSafe(item.data),
      active: item.active,
    });
    setShowItemDialog(true);
  };

  const handleSaveItem = (section: Section) => {
    const payload = {
      label: itemForm.label,
      content: itemForm.content || undefined,
      icon: itemForm.icon || undefined,
      color: itemForm.color || undefined,
      data: itemForm.data || undefined,
      active: itemForm.active,
    };

    if (editingItem) {
      updateItemMutation.mutate({
        sectionId: section.id,
        itemId: editingItem.id,
        ...payload,
      });
    } else {
      createItemMutation.mutate({
        sectionId: section.id,
        ...payload,
        order: section.items?.length ?? 0,
      });
    }
  };

  const handleMoveItem = (section: Section, itemIndex: number, direction: "up" | "down") => {
    const items = [...(section.items || [])].sort((a, b) => a.order - b.order);
    if (direction === "up" && itemIndex === 0) return;
    if (direction === "down" && itemIndex === items.length - 1) return;

    const swapIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    const currentItem = items[itemIndex];
    const swapItem = items[swapIndex];

    reorderItemMutation.mutate({ sectionId: section.id, itemId: currentItem.id, order: swapItem.order });
    reorderItemMutation.mutate({ sectionId: section.id, itemId: swapItem.id, order: currentItem.order });
  };

  const currentConfig = sectionConfig.find((c) => c.type === activeTab)!;
  const currentSection = getSection(activeTab);

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Gestion Home
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérer les sections de la page d&apos;accueil
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tabs Navigation */}
          <div className="border rounded-lg p-1 bg-muted/30">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
              {sectionConfig.map((config) => {
                const section = getSection(config.type);
                return (
                  <TabsTrigger
                    key={config.type}
                    value={config.type}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <config.icon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{config.label}</span>
                    {section && (
                      <Badge
                        variant={section.active ? "default" : "secondary"}
                        className="ml-1 h-5 px-1.5 text-[10px]"
                      >
                        {section.items?.length ?? 0}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          {sectionConfig.map((config) => {
            const section = getSection(config.type);
            if (!section) return null;

            return (
              <TabsContent key={config.type} value={config.type}>
                <div className="space-y-6">
                  {/* Section Settings Card */}
                  <SectionSettingsCard
                    section={section}
                    config={config}
                    editingSettings={editingSettings}
                    getEditingSetting={getEditingSetting}
                    onUpdateSetting={(id, field, value) =>
                      setEditingSettings((prev) => ({
                        ...prev,
                        [id]: prev[id]
                          ? { ...prev[id], [field]: value }
                          : {
                              title: section.title,
                              subtitle: section.subtitle,
                              badge: section.badge,
                              settings: parseJSONSafe(section.settings),
                              order: section.order,
                              [field]: value,
                            },
                      }))
                    }
                    onSave={() => handleSaveSectionSettings(section)}
                    onToggle={() => handleToggleSection(section)}
                    isSaving={updateSectionMutation.isPending}
                  />

                  {/* Items List */}
                  {config.hasItems && (
                    <ItemsList
                      section={section}
                      config={config}
                      onAdd={() => handleOpenNewItem(section)}
                      onEdit={(item) => handleOpenEditItem(item)}
                      onDelete={(itemId) => setDeleteItemId({ sectionId: section.id, itemId })}
                      onToggle={(item) =>
                        toggleItemMutation.mutate({
                          sectionId: section.id,
                          itemId: item.id,
                          active: !item.active,
                        })
                      }
                      onMove={(itemIndex, direction) => handleMoveItem(section, itemIndex, direction)}
                    />
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Item Add/Edit Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? `Modifier ${currentConfig.itemLabel}`
                : `Nouveau ${currentConfig.itemLabel}`}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? `Mettre à jour les informations du ${currentConfig.itemLabel.toLowerCase()}`
                : `Ajouter un nouveau ${currentConfig.itemLabel.toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label / Titre *</Label>
                <Input
                  value={itemForm.label}
                  onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                  placeholder={
                    activeTab === "hero"
                      ? "50 000+"
                      : activeTab === "faq"
                        ? "La question..."
                        : "Titre de l'élément"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Icône (Lucide)</Label>
                <Input
                  value={itemForm.icon}
                  onChange={(e) => setItemForm({ ...itemForm, icon: e.target.value })}
                  placeholder="ex: Users, Rocket, Star..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contenu / Description</Label>
              <Textarea
                value={itemForm.content}
                onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                rows={3}
                placeholder={
                  activeTab === "hero"
                    ? "Entrepreneurs accompagnés"
                    : activeTab === "faq"
                      ? "La réponse à la question..."
                      : "Description de l'élément"
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur (Tailwind classes)</Label>
              <Input
                value={itemForm.color}
                onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })}
                placeholder="ex: bg-emerald-500, text-blue-600..."
              />
            </div>

            <div className="space-y-2">
              <Label>Données JSON</Label>
              <Textarea
                value={itemForm.data}
                onChange={(e) => setItemForm({ ...itemForm, data: e.target.value })}
                rows={6}
                className="font-mono text-sm"
                placeholder='{"key": "value"}'
              />
              <p className="text-xs text-muted-foreground">
                JSON brut pour les données supplémentaires (solutions, sous-éléments, etc.)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={itemForm.active}
                onCheckedChange={(checked) => setItemForm({ ...itemForm, active: checked })}
              />
              <Label>Actif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => currentSection && handleSaveItem(currentSection)}
              disabled={!itemForm.label || createItemMutation.isPending || updateItemMutation.isPending}
            >
              {(createItemMutation.isPending || updateItemMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingItem ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;élément sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() =>
                deleteItemId &&
                deleteItemMutation.mutate({
                  sectionId: deleteItemId.sectionId,
                  itemId: deleteItemId.itemId,
                })
              }
              disabled={deleteItemMutation.isPending}
            >
              {deleteItemMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Section Settings Card ──────────────────────────────────────────────────────

function SectionSettingsCard({
  section,
  config,
  editingSettings,
  getEditingSetting,
  onUpdateSetting,
  onSave,
  onToggle,
  isSaving,
}: {
  section: Section;
  config: SectionConfig;
  editingSettings: Record<string, { title: string; subtitle: string; badge: string; settings: string; order: number }>;
  getEditingSetting: (section: Section) => { title: string; subtitle: string; badge: string; settings: string; order: number };
  onUpdateSetting: (id: string, field: string, value: string | number) => void;
  onSave: () => void;
  onToggle: () => void;
  isSaving: boolean;
}) {
  const es = getEditingSetting(section);
  const isEditing = !!editingSettings[section.id];
  const hasSettings = ["hero", "audit", "newsletter"].includes(section.type);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-muted p-2">
              <config.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {config.label}
                <Badge variant={section.active ? "default" : "secondary"} className="text-xs">
                  {section.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={`toggle-${section.type}`} className="text-sm">
                {section.active ? "Active" : "Inactive"}
              </Label>
              <Switch
                id={`toggle-${section.type}`}
                checked={section.active}
                onCheckedChange={onToggle}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre de la section</Label>
              <Input
                value={es.title}
                onChange={(e) => onUpdateSetting(section.id, "title", e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            <div className="space-y-2">
              <Label>Sous-titre</Label>
              <Input
                value={es.subtitle}
                onChange={(e) => onUpdateSetting(section.id, "subtitle", e.target.value)}
                placeholder="Sous-titre de la section"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input
                value={es.badge}
                onChange={(e) => onUpdateSetting(section.id, "badge", e.target.value)}
                placeholder="Texte du badge"
              />
            </div>
            <div className="space-y-2">
              <Label>Ordre d&apos;affichage</Label>
              <Input
                type="number"
                value={es.order}
                onChange={(e) => onUpdateSetting(section.id, "order", parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          {hasSettings && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Paramètres (JSON)</Label>
                <Textarea
                  value={es.settings}
                  onChange={(e) => onUpdateSetting(section.id, "settings", e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="{}"
                />
                <p className="text-xs text-muted-foreground">
                  Configuration JSON de la section (CTAs, features, etc.)
                </p>
              </div>
            </>
          )}

          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={onSave} disabled={isSaving} size="sm">
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Enregistrer la section
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Items List ─────────────────────────────────────────────────────────────────

function ItemsList({
  section,
  config,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onMove,
}: {
  section: Section;
  config: SectionConfig;
  onAdd: () => void;
  onEdit: (item: SectionItem) => void;
  onDelete: (itemId: string) => void;
  onToggle: (item: SectionItem) => void;
  onMove: (itemIndex: number, direction: "up" | "down") => void;
}) {
  const items = [...(section.items || [])].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              Éléments ({items.length})
            </CardTitle>
            <CardDescription>
              Gérer les {config.itemLabel.toLowerCase()}s de la section
            </CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-3">
              <config.icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Aucun {config.itemLabel.toLowerCase()} pour le moment
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un {config.itemLabel.toLowerCase()}
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                  item.active ? "bg-background" : "bg-muted/30 opacity-60"
                }`}
              >
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <button
                    onClick={() => onMove(index, "up")}
                    disabled={index === 0}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Monter"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onMove(index, "down")}
                    disabled={index === items.length - 1}
                    className="rounded p-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Descendre"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Item Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {item.icon}
                      </span>
                    )}
                    <span className="font-medium text-sm truncate">{item.label}</span>
                    <Badge variant={item.active ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {item.active ? "Actif" : "Inactif"}
                    </Badge>
                    {item.color && (
                      <span className="text-[10px] font-mono text-muted-foreground hidden md:inline">
                        {item.color}
                      </span>
                    )}
                  </div>
                  {item.content && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.content}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggle(item)}
                    className="rounded p-1.5 hover:bg-muted transition-colors"
                    title={item.active ? "Désactiver" : "Activer"}
                  >
                    <Switch
                      checked={item.active}
                      className="pointer-events-none"
                    />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded p-1.5 hover:bg-muted transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
