"use client";

const schedule = [
  {
    day: "Lundi → Vendredi",
    icon: "📚",
    title: "Soutien Scolaire en Ligne",
    desc: "Séances de soutien adaptées, exercices interactifs et suivi individualisé depuis chez soi. Flexible et complémentaire au programme IEF de la famille.",
    tags: ["En ligne", "Flexible", "Suivi personnalisé"],
    featured: false,
  },
  {
    day: "Mercredi après-midi",
    icon: "⚽",
    title: "Entraînement Multisports",
    desc: "Le temps fort de la semaine. Terrain ou gymnase, encadrement qualifié, format UNSS. Football, basket, athlétisme selon les cycles. Socialisation garantie.",
    tags: ["Paris Ouest", "Format UNSS", "6 sports"],
    featured: true,
  },
  {
    day: "Week-end",
    icon: "🏆",
    title: "Challenges & Compétitions",
    desc: "Tournois amicaux entre familles, défis sportifs, classements et récompenses. Un moment de partage et de dépassement de soi.",
    tags: ["Compétition", "Classements", "Récompenses"],
    featured: false,
  },
];

export function PlanningSection() {
  return (
    <section id="planning" className="py-24 bg-[#0B1F3A] relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#E8A020]/12 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="mb-14">
          <span className="inline-flex items-center gap-2 text-[#F5BE5A] text-[0.72rem] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-[#E8A020]/40 mb-4">
            ✦ Organisation
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">
            La semaine type d&apos;un adhérent
          </h2>
          <p className="text-[#8899BB] text-base mt-2 max-w-xl">
            Un rythme clair, structurant et compatible avec l&apos;instruction en famille.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-7 transition-all hover:-translate-y-1 ${
                item.featured
                  ? "bg-[#E8A020] border border-[#E8A020]"
                  : "bg-white/5 border border-white/10 hover:bg-[#E8A020]/10 hover:border-[#E8A020]/30"
              }`}
            >
              <div className={`font-heading text-sm tracking-widest uppercase mb-4 ${
                item.featured ? "text-[#0B1F3A]" : "text-[#E8A020]"
              }`}>
                {item.day}
              </div>
              
              <div className="text-3xl mb-3">{item.icon}</div>
              
              <h3 className={`font-heading text-xl tracking-wide mb-2 ${
                item.featured ? "text-[#0B1F3A]" : "text-white"
              }`}>
                {item.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${
                item.featured ? "text-[#0B1F3A]/70" : "text-white/60"
              }`}>
                {item.desc}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`text-[0.68rem] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${
                      item.featured
                        ? "bg-[#0B1F3A]/12 text-[#0B1F3A]"
                        : "bg-white/8 text-white/65"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
