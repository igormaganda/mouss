"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MoreHorizontal, GripVertical, HelpCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export default function AdminFAQsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isPublished: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await fetch("/api/admin/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingFAQ
        ? `/api/admin/faqs/${editingFAQ.id}`
        : "/api/admin/faqs";

      const method = editingFAQ ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: editingFAQ ? "FAQ modifiée" : "FAQ créée",
          description: "Les modifications ont été enregistrées",
        });
        setDialogOpen(false);
        fetchFAQs();
        resetForm();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.error || "Une erreur est survenue",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette FAQ ?")) return;

    try {
      const res = await fetch(`/api/admin/faqs/${faqId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "FAQ supprimée",
          description: "La FAQ a été supprimée",
        });
        fetchFAQs();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la FAQ",
      });
    }
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isPublished: faq.isPublished,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      isPublished: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-[#0B1F3A] tracking-wide">
            FAQs
          </h1>
          <p className="text-[#607090] mt-1">
            Gérez les questions fréquentes
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A] font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl text-[#0B1F3A]">
                {editingFAQ ? "Modifier la FAQ" : "Nouvelle FAQ"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Réponse</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publier</Label>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A]">
                  {editingFAQ ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* FAQs Table */}
      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F4F6FA]">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[100px]">Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-[#607090]">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-[#607090]">
                    Aucune FAQ trouvée
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq, index) => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-[#8899BB]">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{faq.question}</div>
                      <div className="text-sm text-[#607090] mt-1 line-clamp-2">{faq.answer}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${faq.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {faq.isPublished ? "Publié" : "Brouillon"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(faq)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(faq.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
