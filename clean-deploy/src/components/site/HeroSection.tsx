"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#122850] to-[#1D3B72] flex flex-col justify-center pt-[68px] relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-[100px] -right-[120px] w-[560px] h-[560px] rounded-full bg-gradient-radial from-[#E8A020]/18 to-transparent pointer-events-none" />
      <div className="absolute -bottom-[80px] -left-[60px] w-[380px] h-[380px] rounded-full bg-gradient-radial from-white/4 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-center py-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Bientôt centenaire badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/15 border border-[#E8A020]/40 text-[#F5BE5A] text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full">
              <span className="text-base">🏆</span>
              <span>Bientôt 100 ans d&apos;esprit du sport</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-none tracking-wide">
              La communauté<br />
              <span className="text-[#E8A020]">sport & éducation</span><br />
              des familles IEF.
            </h1>
            
            <p className="text-base sm:text-lg text-white/72 max-w-lg leading-relaxed">
              CS Ternes Paris Ouest réunit les familles pratiquant l&apos;instruction en famille autour d&apos;un projet unique : entraînements multisports, soutien scolaire, défis, stages et une communauté bienveillante.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link href="#pricing">
                <Button className="bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A] font-bold px-6 py-4 rounded-full text-sm">
                  🏅 Rejoindre le programme pilote
                </Button>
              </Link>
              <Link href="#concept">
                <Button variant="outline" className="border-white/55 text-white hover:bg-white/10 hover:border-white px-6 py-4 rounded-full text-sm">
                  Découvrir le projet →
                </Button>
              </Link>
            </div>
            
            <div className="inline-flex items-center gap-3 bg-white/7 border border-white/12 rounded-full px-4 py-2 text-sm text-white/70">
              <span>🎯</span>
              <span>
                <strong className="text-white">30 places</strong> · Cotisation annuelle <strong className="text-white">450 €</strong> · Démarrage septembre
              </span>
            </div>
          </div>
          
          {/* Right Card */}
          <div className="hidden lg:block">
            <div className="bg-white/6 backdrop-blur-xl border border-white/12 rounded-[22px] p-8 space-y-4">
              <h2 className="font-heading text-xl text-white tracking-wide border-b border-white/10 pb-4">
                📅 Organisation de la semaine
              </h2>
              
              {/* Schedule Items */}
              {[
                {
                  icon: "📚",
                  day: "Lundi – Vendredi",
                  title: "Soutien scolaire en ligne",
                  desc: "Cours interactifs, exercices, suivi personnalisé",
                },
                {
                  icon: "⚽",
                  day: "Mercredi après-midi",
                  title: "Entraînement multisports",
                  desc: "Format UNSS · Terrain ou gymnase Paris Ouest",
                },
                {
                  icon: "🏆",
                  day: "Week-end",
                  title: "Challenges & Compétitions",
                  desc: "Tournois, gamification, classements familles",
                },
                {
                  icon: "🏕️",
                  day: "Vacances scolaires",
                  title: "Stages thématiques",
                  desc: "Tournois de fin de stage · Multi-activités",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 py-3 border-b border-white/6 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-[#E8A020]/15 flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[0.68rem] font-bold tracking-wider uppercase text-[#E8A020]">
                      {item.day}
                    </div>
                    <div className="text-sm text-white/82 font-medium">{item.title}</div>
                    <div className="text-xs text-[#8899BB] mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
              
              {/* Price Footer */}
              <div className="bg-[#E8A020] rounded-xl p-4 text-center mt-2">
                <div className="font-heading text-2xl text-[#0B1F3A] tracking-wide">450 € / an</div>
                <div className="text-xs text-[#0B1F3A]/75 font-semibold">Tout inclus · Association loi 1901</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
