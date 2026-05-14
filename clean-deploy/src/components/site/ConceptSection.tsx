"use client";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: "👨‍👩‍👧‍👦", label: "Familles adhérentes", value: "30" },
  { icon: "🏅", label: "Sports pratiqués", value: "6+", accent: true },
  { icon: "📆", label: "Jours de pratique", value: "52" },
  { icon: "📚", label: "Cotisation annuelle", value: "450€", small: true },
];

const features = [
  {
    icon: "🎓",
    title: "Complément éducatif structurant",
    desc: "Un cadre hebdomadaire qui soutient l'instruction en famille sans la remplacer",
  },
  {
    icon: "🤝",
    title: "Socialisation réelle et bienveillante",
    desc: "Des liens durables entre familles partageant les mêmes valeurs éducatives",
  },
  {
    icon: "🏅",
    title: "Cadre sportif reconnu et structuré",
    desc: "Créneaux UNSS, encadrement qualifié, progression sportive visible",
  },
  {
    icon: "📰",
    title: "Un média d'information dédié",
    desc: "Actualités sport, éducation, IEF, cadre institutionnel et conseils familles",
  },
];

export function ConceptSection() {
  return (
    <section id="concept" className="bg-[#F4F6FA] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`${
                  stat.accent ? "bg-[#0B1F3A]" : "bg-white"
                } shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                <CardContent className="p-5 flex flex-col gap-2">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`font-bold text-sm ${stat.accent ? "text-white" : "text-[#0B1F3A]"}`}>
                    {stat.label}
                  </div>
                  <div className={`font-heading text-3xl ${stat.accent ? "text-[#E8A020]" : "text-[#E8A020]"} tracking-wide`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content */}
          <div>
            <span className="label">✦ Le Projet</span>
            <h2 className="section-title mb-4">
              Une nouvelle organisation sport & éducation
            </h2>
            <p className="section-sub">
              CS Ternes Paris Ouest n&apos;est pas un simple club sportif. C&apos;est un écosystème complet conçu pour les familles qui éduquent à la maison, combinant pratique sportive régulière, soutien scolaire et vie communautaire.
            </p>
            
            <div className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#E8A020]/12 flex items-center justify-center text-lg flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0B1F3A]">{feature.title}</div>
                      <div className="text-xs text-[#607090] mt-0.5">{feature.desc}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
