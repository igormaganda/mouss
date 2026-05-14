"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const badges = [
  {
    icon: "🏅",
    title: "Champion du Mois",
    desc: "L&apos;adhérent le plus actif du mois remporte ce badge exclusif.",
    progress: 75,
  },
  {
    icon: "⭐",
    title: "Étoile Montante",
    desc: "Participer à 10 séances pour débloquer ce badge.",
    progress: 60,
  },
  {
    icon: "🤝",
    title: "Esprit d'Équipe",
    desc: "Encourager ses coéquipiers lors des compétitions.",
    progress: 45,
  },
  {
    icon: "📚",
    title: "Scholar Achievement",
    desc: "Excellent suivi du soutien scolaire en ligne.",
    progress: 90,
  },
];

export function GamificationSection() {
  return (
    <section id="gamification" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="label">✦ Gamification</span>
          <h2 className="section-title">Progressez, gagnez des badges</h2>
          <p className="section-sub mx-auto text-center mt-3">
            Un système de gamification motivant pour encourager la participation et la progression de chaque adhérent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((badge, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-heading text-lg tracking-wide text-[#0B1F3A] mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-[#607090] leading-relaxed">
                  {badge.desc}
                </p>
                <div className="mt-4">
                  <Progress value={badge.progress} className="h-1.5 bg-[#F4F6FA]" />
                  <div className="text-xs text-[#8899BB] mt-1">{badge.progress}%</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="#pricing">
            <Button className="bg-[#0B1F3A] text-white hover:bg-[#122850] font-bold px-6 py-4 rounded-full">
              Rejoindre l&apos;aventure 🚀
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
