"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, Mail, MapPin, Clock, Send, ArrowLeft, CheckCircle2, MessageCircle, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function RGPDCheckbox({ checked, onChange, className }: { checked: boolean; onChange: (v: boolean) => void; className?: string }) {
  return (
    <label className={`flex items-start gap-2 text-xs text-muted-foreground leading-relaxed cursor-pointer ${className || ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required className="mt-0.5 accent-[#006994] shrink-0" />
      <span>
        J&apos;accepte que mes données soient traitées conformément à la{" "}
        <a href="/politique-confidentialite" className="underline hover:text-primary">
          Politique de Confidentialité
        </a>{" "}
        de aquabion-mag.com. Mes données ne seront jamais transmises à des tiers sans mon consentement explicite.
        Conformément au RGPD, j&apos;exerce un droit d&apos;accès, de rectification, de suppression et de portabilité
        de mes données en contactant{" "}
        <a href="mailto:contact@aquabion-mag.com" className="underline hover:text-primary">contact@aquabion-mag.com</a>.
      </span>
    </label>
  );
}

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", subject: "", message: "", consentRGPD: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.consentRGPD) {
      toast({ title: "RGPD requis", description: "Veuillez accepter la politique de confidentialité.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "contact" }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Message envoyé !", description: data.message });
        setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "", consentRGPD: false });
      } else {
        toast({ title: "Erreur", description: data.message || "Veuillez réessayer.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur serveur", description: "Veuillez réessayer.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </button>
          <a href="/" className="flex items-center gap-2">
            <img src="/images/logo-aquabion.png" alt="AQUABION®" className="h-9 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-hero text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3">Contactez-nous</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Une question sur AQUABION® ? Besoin d&apos;un conseil personnalisé ? Notre équipe d&apos;experts est à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="c-firstName" className="text-sm font-medium">Prénom *</Label>
                        <Input id="c-firstName" name="firstName" required value={form.firstName} onChange={handleChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="c-lastName" className="text-sm font-medium">Nom *</Label>
                        <Input id="c-lastName" name="lastName" required value={form.lastName} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="c-email" className="text-sm font-medium">Email *</Label>
                        <Input id="c-email" name="email" type="email" required value={form.email} onChange={handleChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="c-phone" className="text-sm font-medium">Téléphone</Label>
                        <Input id="c-phone" name="phone" type="tel" placeholder="06 00 00 00 00" value={form.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-subject" className="text-sm font-medium">Sujet</Label>
                      <Input id="c-subject" name="subject" placeholder="De quoi souhaitez-vous parler ?" value={form.subject} onChange={handleChange} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-message" className="text-sm font-medium">Message *</Label>
                      <textarea
                        id="c-message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Décrivez votre besoin en détail..."
                        value={form.message}
                        onChange={handleChange}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      />
                    </div>
                    <RGPDCheckbox checked={form.consentRGPD} onChange={(v) => setForm((p) => ({ ...p, consentRGPD: v }))} />
                    <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-aquabion text-white hover:opacity-90 font-semibold h-12">
                      {loading ? "Envoi en cours..." : "Envoyer mon message"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      🔒 Vos données sont protégées · Réponse sous 24h ouvrées
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Téléphone</p>
                      <p className="text-sm text-muted-foreground">Du lundi au vendredi, 9h–18h</p>
                      <a href="tel:+33977550359" className="text-base font-bold text-primary mt-1 hover:underline">09 77 55 03 59</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">Réponse sous 24h</p>
                      <a href="mailto:contact@aquabion-mag.com" className="text-base font-bold text-primary mt-1 block">contact@aquabion-mag.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Adresse</p>
                      <p className="text-sm text-muted-foreground">Distributeur officiel AQUABION®<br />France, Belgique, Luxembourg</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Horaires</p>
                      <p className="text-sm text-muted-foreground">Lun–Ven : 9h–18h<br />Sam : 9h–13h (sur rendez-vous)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-aquabion text-white border-0">
                <CardContent className="pt-6 text-center space-y-4">
                  <Phone className="w-12 h-12 mx-auto" />
                  <h3 className="text-lg font-bold">Besoin d&apos;un conseil immédiat ?</h3>
                  <p className="text-white/80 text-sm">Nos experts sont à votre écoute pour vous guider dans votre choix AQUABION®.</p>
                  <a href="tel:+33977550359" className="inline-flex items-center bg-white text-[#006994] hover:bg-white/90 font-semibold rounded-md px-6 py-2.5 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    09 77 55 03 59
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Nos engagements
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Réponse personnalisée sous 24h ouvrées
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Conseil gratuit et sans engagement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Expert certifié AQUABION®
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Devis personnalisé gratuit
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004E6D] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} aquabion-mag.com – Distributeur officiel AQUABION® – France, Belgique, Luxembourg
        </div>
      </footer>
    </div>
  );
}
