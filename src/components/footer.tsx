"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Home,
  Wrench,
  Newspaper,
  ClipboardCheck,
  BookOpen,
  FileText,
  BarChart3,
  HelpCircle,
  Scale,
  ShieldCheck,
  ScrollText,
  Phone,
  Mail,
  Check,
  Loader2,
  Sparkles,
  Stethoscope,
  Heart,
  Calculator,
  Building2,
  UtensilsCrossed,
  HardHat,
  Car,
  Scissors,
  Dumbbell,
  Megaphone,
  Target,
  Compass,
  CreditCard,
  UserCircle,
  Users,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── FOOTER DATA — Organized by Univers ────────────────────────

const footerData = {
  // Univers: Lancer ma boîte
  lancer: {
    title: "Lancer ma boîte",
    icon: Rocket,
    color: "text-emerald-600",
    links: [
      { label: "Vue d'ensemble", href: "/lancer-ma-boite", icon: Home },
      { label: "Comparateur de statuts", href: "/comparatifs", icon: BarChart3 },
      { label: "Créer mon entreprise", href: "/creer-mon-entreprise", icon: Sparkles },
      { label: "Packs immatriculation", href: "/tarifs", icon: FileText },
      { label: "Métiers réglementés", href: "/metiers-reglementes", icon: ShieldCheck },
      { label: "Audit gratuit", href: "/audit", icon: ClipboardCheck },
    ],
  },
  // Univers: Gérer ma boîte
  gerer: {
    title: "Gérer ma boîte",
    icon: Compass,
    color: "text-amber-600",
    links: [
      { label: "Vue d'ensemble", href: "/gerer-ma-boite", icon: Home },
      { label: "Marketplace outils", href: "/outils", icon: Wrench },
      { label: "Accompagnement", href: "/accompagnement", icon: Users },
      { label: "Tarifs & packs", href: "/tarifs", icon: CreditCard },
      { label: "Dashboard", href: "/dashboard", icon: UserCircle },
    ],
  },
  // Ressources
  ressources: {
    title: "Ressources",
    icon: BookOpen,
    color: "text-primary",
    links: [
      { label: "Blog & Actualités", href: "/actualites", icon: Newspaper },
      { label: "Guides de création", href: "/creer-mon-entreprise", icon: GraduationCap },
      { label: "Comparatifs d'outils", href: "/comparatifs", icon: BarChart3 },
      { label: "Modèles & templates", href: "/creer-mon-entreprise", icon: FileText },
      { label: "FAQ", href: "#faq", icon: HelpCircle },
      { label: "Newsletter", href: "#newsletter", icon: Mail },
    ],
  },
  // Légal
  legal: {
    title: "Légal",
    icon: Scale,
    color: "text-muted-foreground",
    links: [
      { label: "Mentions légales", href: "/mentions-legales", icon: Scale },
      { label: "Politique de confidentialité", href: "/politique-de-confidentialite", icon: ShieldCheck },
      { label: "CGU", href: "/cgu", icon: ScrollText },
      { label: "Politique de remboursement", href: "/politique-remboursement", icon: ScrollText },
      { label: "Contact", href: "mailto:contact@crea-entreprise.fr", icon: Phone },
    ],
  },
  // Métiers Réglementés (compact)
  metiers: {
    title: "Métiers Réglementés",
    icon: ShieldCheck,
    color: "text-rose-500",
    links: [
      { label: "Médecin", href: "/metiers-reglementes/medecin", icon: Stethoscope },
      { label: "Infirmier", href: "/metiers-reglementes/infirmier", icon: Heart },
      { label: "Avocat", href: "/metiers-reglementes/avocat", icon: Scale },
      { label: "Expert-comptable", href: "/metiers-reglementes/expert-comptable", icon: Calculator },
      { label: "Agent immobilier", href: "/metiers-reglementes/agent-immobilier", icon: Building2 },
      { label: "Restaurateur", href: "/metiers-reglementes/restaurateur", icon: UtensilsCrossed },
      { label: "BTP Artisan", href: "/metiers-reglementes/btp-artisan", icon: HardHat },
      { label: "Taxi / VTC", href: "/metiers-reglementes/taxi-vtc", icon: Car },
      { label: "Coiffeur", href: "/metiers-reglementes/coiffeur", icon: Scissors },
      { label: "Coach sportif", href: "/metiers-reglementes/coach-sportif", icon: Dumbbell },
    ],
  },
};

const partnerLogos = [
  "Qonto",
  "Indy",
  "Pennylane",
  "Legalstart",
  "Captain Contrat",
  "Hiscox",
  "HubSpot",
  "Brevo",
];

// ─── FOOTER COMPONENT ──────────────────────────────────────────

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Inscription réussie !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }

  return (
    <footer id="newsletter" className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-7">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                CE
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Créa
                </span>
                <span className="text-xs block -mt-1 text-muted-foreground">
                  Entreprise
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Le media B2B de référence pour les entrepreneurs. Guides,
              comparatifs et outils pour créer, gérer et développer votre
              entreprise.
            </p>

            {/* Newsletter */}
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Mail className="h-4 w-4 text-primary" />
                Newsletter
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Recevez nos derniers guides et conseils pour entrepreneurs.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== "idle") {
                        setStatus("idle");
                        setMessage("");
                      }
                    }}
                    className="h-9 text-sm bg-background"
                    disabled={status === "loading"}
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 shrink-0 bg-primary hover:bg-primary/90"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : status === "success" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </div>
                {message && (
                  <p
                    className={`text-xs ${
                      status === "success"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Lancer ma boîte */}
          <div>
            <h4 className={`flex items-center gap-2 text-sm font-semibold mb-4 ${footerData.lancer.color}`}>
              <footerData.lancer.icon className="h-4 w-4" />
              {footerData.lancer.title}
            </h4>
            <ul className="space-y-2.5">
              {footerData.lancer.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Gérer ma boîte */}
          <div>
            <h4 className={`flex items-center gap-2 text-sm font-semibold mb-4 ${footerData.gerer.color}`}>
              <footerData.gerer.icon className="h-4 w-4" />
              {footerData.gerer.title}
            </h4>
            <ul className="space-y-2.5">
              {footerData.gerer.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className={`flex items-center gap-2 text-sm font-semibold mb-4 ${footerData.ressources.color}`}>
              <footerData.ressources.icon className="h-4 w-4" />
              {footerData.ressources.title}
            </h4>
            <ul className="space-y-2.5">
              {footerData.ressources.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-4">
              <footerData.legal.icon className="h-4 w-4 text-muted-foreground" />
              {footerData.legal.title}
            </h4>
            <ul className="space-y-2.5">
              {footerData.legal.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Métiers Réglementés */}
          <div>
            <h4 className={`flex items-center gap-2 text-sm font-semibold mb-4 ${footerData.metiers.color}`}>
              <footerData.metiers.icon className="h-4 w-4" />
              {footerData.metiers.title}
            </h4>
            <ul className="space-y-2.5">
              {footerData.metiers.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/metiers-reglementes"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Voir les 25 métiers →
            </a>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-10 pt-8 border-t hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {partnerLogos.map((partner) => (
              <span
                key={partner}
                className="text-sm font-bold text-muted-foreground/35 hover:text-muted-foreground/60 transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Créa Entreprise — Georges Ernest Conseil, SAS
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/mentions-legales"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="/politique-de-confidentialite"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Politique de confidentialité
            </a>
            <a
              href="/cgu"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              CGU
            </a>
            <a
              href="/politique-remboursement"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Remboursement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
