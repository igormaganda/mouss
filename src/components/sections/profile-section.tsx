"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Laptop, Building2, ArrowRight } from "lucide-react";

const profiles = [
  {
    id: "etudiant",
    title: "L'Étudiant Entrepreneur",
    description:
      "Étudier et entreprendre en parallèle. Beneficiez du statut d'auto-entrepreneur ou etudiant-entrepreneur pour lancer votre premier projet sans risque financier.",
    icon: GraduationCap,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-700",
    tagline: "Étudier & entreprendre",
    solutions: [
      "Auto-entrepreneur gratuit",
      "Abby (compta gratuite)",
      "Indy Basic (gratuit)",
      "ACRE (exoneration charges)",
    ],
    needs: ["Statut juridique simple", "Cout reduit", "Flexibilite horaires"],
  },
  {
    id: "salarie",
    title: "Le Salarié en Transition",
    description:
      "Securiser le lancement avant de quitter son poste ou cumuler les deux activités. Anticipez les impacts fiscaux et optimisez votre transition.",
    icon: Briefcase,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
    tagline: "Securiser & transitionner",
    solutions: [
      "Cumul emploi + auto-entrepreneur",
      "Simulation impact fiscal",
      "Assurance perte d'emploi",
      "Accompagnement juridique",
    ],
    needs: ["Securite financiere", "Conseil juridique", "Simulation revenus"],
  },
  {
    id: "freelance",
    title: "Le Freelance / Auto-entrepreneur",
    description:
      "Besoin de simplicite et de gratuité pour demarrer. Concentrez-vous sur votre activite grâce aux outils automatisés et gratuits.",
    icon: Laptop,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    tagline: "Simplicité & efficacité",
    solutions: [
      "Indy Basic (gratuit)",
      "Abby (gratuit)",
      "Shine par Qonto (gratuit)",
      "Tiime (gratuit)",
    ],
    needs: ["Gratuite", "Automatisation", "Interface simple"],
  },
  {
    id: "tpe-pme",
    title: "La TPE / PME",
    description:
      "Besoin de gestion d'équipe et de flux complexes. Equipez votre entreprise avec des outils professionnels adaptés à votre taille.",
    icon: Building2,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    borderHover: "hover:border-sky-300 dark:hover:border-sky-700",
    tagline: "Gestion & performance",
    solutions: [
      "Qonto Business",
      "Pennylane (compta complete)",
      "HubSpot CRM (gratuit)",
      "PayFit (paie)",
    ],
    needs: ["Gestion d'équipe", "Comptabilité avancée", "Outils collaboratifs"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProfileSection() {
  return (
    <section id="profils" className="hidden md:block py-10 sm:py-14 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Votre Profil
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quel entrepreneur etes-vous ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Les besoins juridiques et bancaires different radicalement selon
            votre profil. Identifiez le votre pour recevoir des recommandations
            ciblees.
          </p>
        </div>

        {/* Profile Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {profiles.map((profile) => (
            <motion.div key={profile.id} variants={itemVariants}>
              <Card
                className={`group h-full transition-all duration-300 hover:shadow-lg ${profile.borderHover} hover:-translate-y-1 cursor-pointer`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${profile.color}`}
                    >
                      <profile.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {profile.tagline}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{profile.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {profile.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Solutions */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Solutions adaptées
                    </p>
                    <div className="space-y-1.5">
                      {profile.solutions.map((sol) => (
                        <div
                          key={sol}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {sol}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Needs */}
                  <div className="pt-3 border-t">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Vos priorites
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.needs.map((need) => (
                        <Badge
                          key={need}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a href="#audit" className="block pt-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Recevoir mon audit
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
