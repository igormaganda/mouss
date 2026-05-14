"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Handshake,
  ArrowRight,
  FileText,
  Wrench,
  Megaphone,
  Target,
  Compass,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const univers = [
  {
    id: "creer",
    label: "Lancer ma boîte",
    sublabel: "Création d'entreprise",
    desc: "Trouvez votre statut, rédigez vos statuts, immatriculez votre entreprise et recevez votre KBIS en 48h.",
    icon: Rocket,
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-600",
    borderColor: "border-emerald-200",
    features: [
      { icon: BarChart3, label: "Comparateur de statuts" },
      { icon: FileText, label: "Rédaction de statuts" },
      { icon: ShieldCheck, label: "Formalités d'immatriculation" },
      { icon: Target, label: "Packs tout-en-un dès 9€" },
    ],
    cta: { label: "Lancer ma création", href: "#packs" },
  },
  {
    id: "gerer",
    label: "Gérer ma boîte",
    sublabel: "Accompagnement & outils",
    desc: "Banque, compta, marketing, juridique... Accédez aux meilleurs outils et à un accompagnement sur-mesure.",
    icon: Handshake,
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    lightText: "text-amber-600",
    borderColor: "border-amber-200",
    features: [
      { icon: Wrench, label: "Marketplace d'outils" },
      { icon: Compass, label: "Copilote Entreprise" },
      { icon: Megaphone, label: "Marketing digital" },
      { icon: Target, label: "Lead generation B2B" },
    ],
    cta: { label: "Explorer les outils", href: "#outils" },
  },
];

export function UniversSection() {
  return (
    <section id="univers" className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Quoi
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Créer ou gérer, quel est votre besoin ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Deux univers pour répondre à chaque étape de votre parcours entrepreneurial.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {univers.map((u, idx) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`group relative rounded-2xl border-2 ${u.borderColor} ${u.lightBg} p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Top badge */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${u.color} text-white shadow-lg`}>
                  <u.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{u.label}</h3>
                  <p className={`text-sm font-medium ${u.lightText}`}>{u.sublabel}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {u.desc}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {u.features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ${u.lightText}`}>
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={u.cta.href}
                className={`inline-flex items-center gap-2 text-sm font-bold ${u.lightText} group-hover:gap-3 transition-all`}
              >
                {u.cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
