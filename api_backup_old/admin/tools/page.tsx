"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryBadge } from "@/components/admin/stat-badge";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  pricing: string;
  affiliateUrl: string | null;
  website: string | null;
  commission: number;
  rating: number;
  pros: string | null;
  cons: string | null;
  features: string | null;
  active: boolean;
  order: number;
  _count: { clicks: number };
}

const categoryTabs = [
  { value: "all", label: "Tous" },
  { value: "bank", label: "Banque" },
  { value: "compta", label: "Comptabilité" },
  { value: "assurance", label: "Assurance" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "crm", label: "CRM" },
];

const categoryOptions = [
  { value: "bank", label: "Banque" },
  { value: "compta", label: "Comptabilité" },
  { value: "assurance", label: "Assurance" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "crm", label: "CRM" },
  { value: "other", label: "Autre" },
];

const emptyForm = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  category: "bank",
  pricing: "gratuit",
  affiliateUrl: "",
  website: "",
  commission: 0,
  rating: 0,
  pros: "",
  cons: "",
  features: "",
};

export default function ToolsPage() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: () => fetcher("/api/admin/tools"),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof emptyForm & { id?: string }) => {
      const isEdit = !!data.id;
      const { id, ...payload } = data;
      const res = await fetch("/api/admin/tools", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id, ...payload } : payload),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      toast.success(editingTool ? "Outil mis à jour" : "Outil créé");
      setShowDialog(false);
      setEditingTool(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/tools?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      toast.success("Outil supprimé");
      setDeleteId(null);
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await fetch("/api/admin/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
    },
  });

  const handleOpenNew = () => {
    setEditingTool(null);
    setForm(emptyForm);
    setShowDialog(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setForm({
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline || "",
      description: tool.description || "",
      category: tool.category,
      pricing: tool.pricing,
      affiliateUrl: tool.affiliateUrl || "",
      website: tool.website || "",
      commission: tool.commission,
      rating: tool.rating,
      pros: tool.pros || "",
      cons: tool.cons || "",
      features: tool.features || "",
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    saveMutation.mutate(
      editingTool ? { ...form, id: editingTool.id } : form
    );
  };

  const filteredTools = tools?.filter(
    (t: Tool) => categoryFilter === "all" || t.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Outils</h1>
          <p className="text-muted-foreground mt-1">
            Gérer les outils et partenaires d&apos;affiliation
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un outil
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryTabs.map((tab) => (
          <Button
            key={tab.value}
            variant={categoryFilter === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools?.map((tool: Tool) => (
            <Card key={tool.id} className={!tool.active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    {tool.tagline && (
                      <CardDescription className="text-xs">{tool.tagline}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{(tool.rating ?? 0).toFixed(1)}</span>
                    </div>
                    <Switch
                      checked={tool.active}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: tool.id, active: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={tool.category} />
                  <Badge variant="outline" className="text-xs">
                    {tool.pricing === "gratuit" ? "Gratuit" : tool.pricing === "freemium" ? "Freemium" : "Payant"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="h-3 w-3" />
                    {tool._count.clicks} clics
                  </span>
                  <span>{tool.commission > 0 ? `${tool.commission}€ com.` : ""}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(tool)}>
                    <Pencil className="mr-1 h-3 w-3" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeleteId(tool.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTools?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Aucun outil dans cette catégorie
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>{editingTool ? "Modifier l'outil" : "Nouvel outil"}</DialogTitle>
            <DialogDescription>
              {editingTool ? "Mettre à jour les informations" : "Ajouter un nouveau partenaire"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tarification</Label>
                <Select value={form.pricing} onValueChange={(v) => setForm({ ...form, pricing: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuit">Gratuit</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="payant">Payant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL Site web</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL Affiliation</Label>
                <Input value={form.affiliateUrl} onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Commission (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.commission}
                  onChange={(e) => setForm({ ...form, commission: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Note (/5)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Points forts (un par ligne)</Label>
              <Textarea value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Points faibles (un par ligne)</Label>
              <Textarea value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Fonctionnalités (un par ligne)</Label>
              <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet outil ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;outil sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
