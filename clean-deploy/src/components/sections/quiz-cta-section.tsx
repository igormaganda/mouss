"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function QuizCTASection() {
  return (
    <section id="quiz" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
          >
            <Brain className="h-3.5 w-3.5 mr-1" />
            Quiz personnalisé
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Quel{" "}
            <span className="text-violet-600 dark:text-violet-400">
              statut entrepreneurial
            </span>{" "}
            est fait pour vous ?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Répondez à 5 questions et découvrez la structure juridique qui
            correspond le mieux à votre profil.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-violet-200 dark:border-violet-800/50 overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Features */}
                <div className="space-y-5">
                  <div className="space-y-4">
                    {[
                      {
                        icon: Brain,
                        title: "5 questions simples",
                        desc: "Profil, revenus, frais, patrimoine, horizon",
                      },
                      {
                        icon: Sparkles,
                        title: "Résultat instantané",
                        desc: "Micro-entreprise, SASU, EURL ou SARL",
                      },
                      {
                        icon: CheckCircle2,
                        title: "Avantages & points de vigilance",
                        desc: "Un bilan complet pour chaque statut",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 shrink-0">
                          <item.icon className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="text-6xl">🎯</div>
                  <h3 className="text-xl font-bold">
                    Découvrez votre statut idéal
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    En moins de 2 minutes, identifiez la structure juridique
                    parfaitement adaptée à votre projet entrepreneurial.
                  </p>
                  <Link href="/audit">
                    <Button
                      size="lg"
                      className="gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base px-8 h-12 shadow-lg shadow-violet-500/20"
                    >
                      <Sparkles className="h-5 w-5" />
                      Passer le quiz gratuit
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    100% gratuit • Résultat immédiat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
