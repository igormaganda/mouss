"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const personas = [
  {
    id: "thomas",
    name: "Thomas",
    emoji: "\uD83D\uDCBB",
    role: "Freelance",
    age: "32 ans",
    goal: "Passer en SASU et structurer son activité de consulting",
    painPoints: ["Cherche le bon statut fiscal", "Veut une compta automatisée", "Besoin d'une banque pro gratuite"],
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
    href: "#audit",
  },
  {
    id: "sarah",
    name: "Sarah",
    emoji: "\uD83D\uDCBC",
    role: "En reconversion",
    age: "41 ans",
    goal: "Quitter le CDI et lancer son activité de coaching en sécurité",
    painPoints: ["Cumul emploi + auto-entrepreneur", "Besoin d'un accompagnement juridique", "Simulation de revenus"],
    color: "bg-rose-500",
    lightBg: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-600",
    href: "#audit",
  },
  {
    id: "marc",
    name: "Marc",
    emoji: "\uD83D\uDE80",
    role: "Startup",
    age: "27 ans",
    goal: "Créer une SaaS avec associés et lever des fonds",
    painPoints: ["Statut pour associés multiples", "BP pour investisseurs", "Marketing & croissance"],
    color: "bg-violet-500",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-200",
    textColor: "text-violet-600",
    href: "#audit",
  },
  {
    id: "lea",
    name: "Léa",
    emoji: "\uD83C\uDF93",
    role: "Étudiante",
    age: "22 ans",
    goal: "Lancer un e-commerce en parallèle de ses études",
    painPoints: ["Budget limité", "Statut étudiant-entrepreneur", "Création de site web"],
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600",
    href: "#audit",
  },
];

export function PersonasSection() {
  return (
    <section id="personas" className="py-16 sm:py-20 bg-gradient-to-b from-white via-muted/20 to-white border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600 mb-4">
            Qui
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quel entrepreneur êtes-vous ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Chaque profil a des besoins uniques. Identifiez le vôtre pour recevoir des recommandations personnalisées.
          </p>
        </motion.div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative rounded-2xl border-2 ${p.borderColor} ${p.lightBg} p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col`}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.color} text-white text-2xl shadow-lg`}>
                  {p.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                  <p className={`text-sm font-medium ${p.textColor}`}>{p.role} · {p.age}</p>
                </div>
              </div>

              {/* Goal */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {p.goal}
              </p>

              {/* Pain Points */}
              <div className="space-y-2 mb-5 flex-1">
                {p.painPoints.map((pp) => (
                  <div key={pp} className="flex items-start gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${p.color} shrink-0`} />
                    <span className="text-xs text-muted-foreground leading-snug">{pp}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={p.href}
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${p.textColor} group-hover:gap-2.5 transition-all`}
              >
                Mon audit personnalisé
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
