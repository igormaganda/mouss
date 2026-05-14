"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  ShieldCheck,
  Headphones,
  Star,
  Zap,
} from "lucide-react";

const packs = [
  {
    id: "creer",
    name: "Créer",
    price: 9,
    oldPrice: 15,
    badge: null,
    desc: "Idéal pour démarrer simplement",
    color: "border-border/60 bg-white",
    buttonVariant: "outline" as const,
    features: [
      "Rédaction des statuts",
      "Formalités d'immatriculation",
      "Déclaration des bénéficiaires effectifs",
      "KBIS en 48h",
      "Guide de création PDF",
    ],
    excludes: [
      "Modifications statuts",
      "Accompagnement personnalisé",
      "Siège social domiciliation",
    ],
    cta: "Choisir Créer",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    oldPrice: 49,
    badge: "Populaire",
    desc: "Le meilleur rapport qualité/prix",
    color: "border-primary bg-gradient-to-b from-primary/5 to-white shadow-lg shadow-primary/10",
    buttonVariant: "default" as const,
    features: [
      "Tout le pack Créer",
      "Modifications statuts incluses",
      "Siège social domiciliation 3 mois",
      "Accompagnement par email",
      "Rappel échéances fiscales",
      "Certificat de conformité",
      "Carte exonération ACRE",
    ],
    excludes: [
      "Accompagnement téléphonique",
      "Représentation fiscale",
    ],
    cta: "Choisir Pro",
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    oldPrice: 129,
    badge: "Complet",
    desc: "Accompagnement complet de A à Z",
    color: "border-amber-300 bg-gradient-to-b from-amber-50/50 to-white",
    buttonVariant: "default" as const,
    features: [
      "Tout le pack Pro",
      "Accompagnement téléphonique",
      "Siège social domiciliation 12 mois",
      "Représentation fiscale",
      "Business plan + prévisionnel",
      "Recherche de financement",
      "Dashboard suivi projet",
      "Support prioritaire 6 mois",
    ],
    excludes: [],
    cta: "Choisir Premium",
  },
];

export function PacksSection() {
  return (
    <section id="packs" className="py-16 sm:py-20 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Offre limitée
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Packs d&apos;immatriculation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choisissez le pack adapté à votre projet. Réduction de <strong className="text-primary">-40%</strong> pendant la période de lancement.
          </p>
        </motion.div>

        {/* Pack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {packs.map((pack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col rounded-2xl border-2 ${pack.color} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Badge */}
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className={pack.id === "pro" ? "bg-primary text-primary-foreground" : "bg-amber-500 text-white"}>
                    {pack.badge === "Populaire" && <Star className="h-3 w-3 mr-1" />}
                    {pack.badge}
                  </Badge>
                </div>
              )}

              {/* Name + Desc */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{pack.desc}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-extrabold text-foreground">{pack.price}€</span>
                  <span className="text-lg text-muted-foreground line-through">{pack.oldPrice}€</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Économisez {pack.oldPrice - pack.price}€
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2.5 mb-6 flex-1">
                {pack.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
                {pack.excludes.map((f) => (
                  <div key={f} className="flex items-start gap-2 opacity-40">
                    <span className="h-4 w-4 shrink-0 mt-0.5 text-center text-xs leading-4">—</span>
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                variant={pack.buttonVariant}
                className={`w-full h-12 text-base font-semibold gap-2 ${
                  pack.id === "premium" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                }`}
              >
                {pack.id === "pro" && <Sparkles className="h-4 w-4" />}
                {pack.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-10"
        >
          {[
            { icon: FileText, label: "Statuts conformes" },
            { icon: ShieldCheck, label: "Garantie satisfait" },
            { icon: Headphones, label: "Support réactif" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
