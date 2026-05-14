// ─── TYPES ────────────────────────────────────────────────────────

interface ServiceItem {
  slug: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  priceFrom: number;
  priceUnit: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const serviceColorGradients: Record<string, string> = {
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
  violet: "from-violet-400 to-purple-500",
  rose: "from-rose-400 to-pink-500",
  blue: "from-blue-400 to-indigo-500",
  teal: "from-teal-400 to-cyan-500",
  orange: "from-orange-400 to-red-500",
};

// ─── COMPONENT ────────────────────────────────────────────────────

interface AccompagnementSectionProps {
  initialServices?: ServiceItem[];
}

export function AccompagnementSection({ initialServices }: AccompagnementSectionProps) {
  const services = initialServices ?? [];

  if (services.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600 mb-4">
            Accompagnement
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bien plus qu&apos;une création d&apos;entreprise
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Du marketing au juridique, découvrez nos 12 services pour accélérer votre croissance
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => {
            const gradient =
              serviceColorGradients[service.color] || "from-gray-400 to-gray-500";
            return (
              <a
                key={service.slug}
                href={`/accompagnement/${service.slug}`}
                className="group flex flex-col rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}
                >
                  <span className="text-lg font-bold text-white">
                    {(service.shortTitle || service.slug)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.shortTitle}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {service.priceFrom}€
                    {service.priceUnit ? ` ${service.priceUnit}` : ""}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Voir détails →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/accompagnement"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Découvrir tous nos services →
          </a>
        </div>
      </div>
    </section>
  );
}
