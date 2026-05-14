"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const activities = [
  {
    icon: "📚",
    tag: "Lundi – Vendredi",
    title: "Soutien Scolaire en Ligne",
    desc: "Des séances de soutien structurées, adaptées au rythme de chaque enfant instruit en famille. Exercices interactifs, cours en direct et suivi personnalisé par des enseignants expérimentés.",
    link: "#pricing",
    linkText: "Explorer l'offre →",
    badge: "📡 En ligne",
    image: "/images/activities/education.png",
    gradient: "from-[#0B1F3A] to-[#1D3B72]",
  },
  {
    icon: "⚽",
    tag: "Mercredi après-midi",
    title: "Mercredi Multisports",
    desc: "Entraînements collectifs sur le modèle UNSS : football, basketball, athlétisme, arts martiaux… Un programme varié pour développer les compétences motrices et l'esprit d'équipe.",
    link: "#planning",
    linkText: "Voir le planning →",
    badge: "📍 Paris Ouest",
    image: "/images/activities/multisports.png",
    gradient: "from-[#B8720E] to-[#E8A020]",
  },
  {
    icon: "🏆",
    tag: "Week-end & Vacances",
    title: "Challenges & Compétitions",
    desc: "Tournois inter-familles, défis gamifiés, stages thématiques pendant les vacances scolaires avec compétitions de fin de stage. La compétition bienveillante au service de la progression.",
    link: "#gamification",
    linkText: "Voir la gamification →",
    badge: "🎮 Gamification",
    image: "/images/activities/stage.png",
    gradient: "from-[#1E3A5F] to-[#2A5298]",
  },
];

export function ActivitiesSection() {
  return (
    <section id="activities" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="label">✦ Activités</span>
          <h2 className="section-title">Trois piliers, une cohérence</h2>
          <p className="section-sub mx-auto text-center mt-3">
            Chaque activité est pensée pour s&apos;articuler avec les autres et offrir aux enfants IEF un rythme structurant et épanouissant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {activities.map((activity, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group"
            >
              {/* Thumbnail with Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${activity.gradient} opacity-40`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl drop-shadow-lg">{activity.icon}</span>
                </div>
              </div>
              
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="text-[0.68rem] font-bold tracking-wider uppercase text-[#E8A020] mb-2">
                  {activity.tag}
                </div>
                <h3 className="font-heading text-xl tracking-wide text-[#0B1F3A] mb-2">
                  {activity.title}
                </h3>
                <p className="text-sm text-[#607090] leading-relaxed flex-1">
                  {activity.desc}
                </p>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <Link
                    href={activity.link}
                    className="text-sm font-bold text-[#0B1F3A] hover:text-[#E8A020] transition-colors flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    {activity.linkText}
                  </Link>
                  <span className="text-[0.72rem] font-bold px-2.5 py-1 rounded-full bg-[#F4F6FA] text-[#0B1F3A]">
                    {activity.badge}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
