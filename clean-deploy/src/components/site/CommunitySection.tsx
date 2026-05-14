"use client";

import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: "👨‍👩‍👧‍👦", title: "Familles actives", desc: "Une communauté engagée" },
  { icon: "🏆", title: "Événements mensuels", desc: "Rencontres et tournois" },
  { icon: "💬", title: "Forum privé", desc: "Échanges entre parents" },
  { icon: "📚", title: "Ressources partagées", desc: "Documents et conseils" },
];

const testimonials = [
  {
    text: "CS Ternes a transformé notre approche de l'IEF. Les enfants sont épanouis, sportifs, et nous avons trouvé une vraie communauté.",
    name: "Marie L.",
    role: "Maman de 3 enfants IEF",
    initials: "ML",
  },
  {
    text: "Le mercredi multisports est devenu le moment fort de la semaine pour toute la famille. Un cadre parfait pour la socialisation.",
    name: "Thomas B.",
    role: "Papa d'une adolescente",
    initials: "TB",
  },
];

export function CommunitySection() {
  return (
    <section id="community" className="py-24 bg-[#F4F6FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className={`shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${
                  index === 3 ? "col-span-2 flex-row items-center" : ""
                }`}
              >
                <CardContent className={`p-5 ${index === 3 ? "flex items-center gap-4" : ""}`}>
                  <div className="text-3xl">{benefit.icon}</div>
                  <div className={index === 3 ? "text-left" : ""}>
                    <div className="font-bold text-sm text-[#0B1F3A]">{benefit.title}</div>
                    <div className="text-xs text-[#607090]">{benefit.desc}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Content */}
          <div>
            <span className="label">✦ Communauté</span>
            <h2 className="section-title mb-4">
              Rejoignez une communauté bienveillante
            </h2>
            <p className="section-sub">
              Plus qu&apos;un club sportif, CS Ternes Paris Ouest est une communauté de familles partageant les mêmes valeurs éducatives.
            </p>
            
            {/* Testimonials */}
            <div className="mt-8 space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-5">
                    <p className="font-serif italic text-sm text-[#1C2D4A] leading-relaxed mb-4">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-xs font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0B1F3A]">{testimonial.name}</div>
                        <div className="text-xs text-[#8899BB]">{testimonial.role}</div>
                      </div>
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
