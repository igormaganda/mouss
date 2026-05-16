import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";
import { ProfileSection } from "@/components/sections/profile-section";
import { PainPointsSection } from "@/components/sections/pain-points-section";
import { ThematicSection } from "@/components/sections/thematic-section";
import { AuditSection } from "@/components/sections/audit-section";
import { OutilsSection } from "@/components/sections/outils-section";
import { HomeSections } from "@/components/sections/home-sections";
import { Footer } from "@/components/footer";
import { ShieldCheck } from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  affiliateUrl: string | null;
  commission: number;
  category: string;
  pricing: string;
  rating: number;
  pros: string | null;
  cons: string | null;
  features: string | null;
  active: boolean;
  order: number;
}

interface Pack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  active: boolean;
  order: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string | null;
  createdAt: string;
  User?: { name: string | null; email: string };
}

// ─── ACCOMPAGNEMENT FALLBACK DATA ──────────────────────────────

const fallbackServices = [
  { slug: "copilote-entreprise", shortTitle: "Copilote Entreprise", description: "Un partenaire dédié pour vous accompagner au quotidien dans toutes vos décisions stratégiques.", icon: "Compass", color: "emerald", priceFrom: 490, priceUnit: "/mois" },
  { slug: "marketing-digital", shortTitle: "Marketing Digital", description: "Stratégie, publicité en ligne, SEO et réseaux sociaux pour attirer vos premiers clients.", icon: "Megaphone", color: "amber", priceFrom: 490, priceUnit: "/mois" },
  { slug: "lead-generation", shortTitle: "Lead Generation B2B", description: "Générez un flux constant de prospects qualifiés avec nos méthodes éprouvées.", icon: "Target", color: "violet", priceFrom: 790, priceUnit: "/mois" },
  { slug: "business-plan", shortTitle: "Business Plan", description: "Réalisez un business plan professionnel pour convaincre banques et investisseurs.", icon: "FileText", color: "rose", priceFrom: 490, priceUnit: "" },
  { slug: "community-management", shortTitle: "Community Management", description: "Gérez vos réseaux sociaux comme un pro et développez votre communauté en ligne.", icon: "Users", color: "blue", priceFrom: 390, priceUnit: "/mois" },
  { slug: "creation-site-web", shortTitle: "Création de Site Web", description: "Un site professionnel, moderne et optimisé pour convertir vos visiteurs en clients.", icon: "Globe", color: "teal", priceFrom: 890, priceUnit: "" },
];

const serviceColorGradients: Record<string, string> = {
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
  violet: "from-violet-400 to-purple-500",
  rose: "from-rose-400 to-pink-500",
  blue: "from-blue-400 to-indigo-500",
  teal: "from-teal-400 to-cyan-500",
  orange: "from-orange-400 to-red-500",
};

// ─── DATA FETCHERS (Server-side) ─────────────────────────────────

async function getTools(): Promise<Tool[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/tools?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tools || [];
  } catch {
    return [];
  }
}

async function getPacks(): Promise<Pack[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/packs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.packs || [];
  } catch {
    return [];
  }
}

async function getServices(): Promise<typeof fallbackServices> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/services?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return fallbackServices;
    const data = await res.json();
    return (data.services || []).length > 0 ? data.services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

async function getPosts(): Promise<{ posts: Post[]; total: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return { posts: [], total: 0 };
    const data = await res.json();
    return { posts: data.posts || [], total: data.total || 0 };
  } catch {
    return { posts: [], total: 0 };
  }
}

// ─── PAGE ────────────────────────────────────────────────────────

export default async function Home() {
  const [{ posts, total: totalPosts }, tools, packs, services] = await Promise.all([
    getPosts(),
    getTools(),
    getPacks(),
    getServices(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* TOUJOURS VISIBLE — Hero principal */}
        <section id="accueil">
          <HeroSection />
        </section>

        {/* CACHÉ SUR MOBILE — Roadmap (non prioritaire) */}
        <section id="roadmap" className="hidden md:block">
          <RoadmapSection />
        </section>

        {/* CACHÉ SUR MOBILE — Profils entrepreneurs (non prioritaire) */}
        <section id="profils" className="hidden lg:block">
          <ProfileSection />
        </section>

        {/* CACHÉ SUR MOBILE — Pain Points + Solutions thématiques */}
        <section id="solutions" className="hidden md:block">
          <PainPointsSection />
          <ThematicSection />
        </section>

        {/* TOUJOURS VISIBLE — Outils (prioritaire) */}
        <section id="outils">
          <OutilsSection initialTools={tools} />
        </section>

        {/* CACHÉ SUR MOBILE — Tarifs + Blog (via HomeSections) */}
        <div className="hidden md:block">
          <HomeSections
            initialPacks={packs}
            initialPosts={posts}
            totalPosts={totalPosts}
          />
        </div>

        {/* TOUJOURS VISIBLE — Audit CTA (prioritaire) */}
        <section id="audit">
          <AuditSection />
        </section>

        {/* TOUJOURS VISIBLE — Métiers Réglementés Preview */}
        <section className="py-16 sm:py-20 border-t bg-gradient-to-b from-white via-rose-50/20 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600 mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secteurs réglementés
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Votre métier est réglementé ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Diplômes, autorisations, obligations spécifiques... Découvrez les démarches pour 25 métiers réglementés
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Médecin", href: "/metiers-reglementes/medecin", icon: "🏥" },
                { name: "Avocat", href: "/metiers-reglementes/avocat", icon: "⚖️" },
                { name: "Restaurateur", href: "/metiers-reglementes/restaurateur", icon: "🍽️" },
                { name: "Agent immobilier", href: "/metiers-reglementes/agent-immobilier", icon: "🏠" },
                { name: "Taxi / VTC", href: "/metiers-reglementes/taxi-vtc", icon: "🚗" },
                { name: "Infirmier", href: "/metiers-reglementes/infirmier", icon: "❤️" },
                { name: "Expert-comptable", href: "/metiers-reglementes/expert-comptable", icon: "🧮" },
                { name: "BTP Artisan", href: "/metiers-reglementes/btp-artisan", icon: "🏗️" },
                { name: "Coiffeur", href: "/metiers-reglementes/coiffeur", icon: "✂️" },
                { name: "Coach sportif", href: "/metiers-reglementes/coach-sportif", icon: "💪" },
              ].map((profession) => (
                <a
                  key={profession.name}
                  href={profession.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-white p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-center"
                >
                  <span className="text-3xl">{profession.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-rose-600 transition-colors">
                    {profession.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/metiers-reglementes"
                className="inline-flex items-center gap-2 text-base font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Découvrir les 25 métiers réglementés →
              </a>
            </div>
          </div>
        </section>

        {/* TOUJOURS VISIBLE — Accompagnement Preview */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-amber-50/30 to-white border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => {
                const gradient = serviceColorGradients[service.color] || "from-gray-400 to-gray-500";
                return (
                  <a
                    key={service.slug}
                    href={`/accompagnement/${service.slug}`}
                    className="group flex flex-col rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
                      <span className="text-lg font-bold text-white">
                        {(service.shortTitle || service.slug).charAt(0).toUpperCase()}
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
                        {service.priceFrom}€{service.priceUnit ? ` ${service.priceUnit}` : ""}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Voir détails →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

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
      </main>
      <Footer />
    </div>
  );
}
