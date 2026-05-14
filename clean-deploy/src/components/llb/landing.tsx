'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Mail,
  Megaphone,
  BarChart3,
  MapPin,
  Sparkles,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Send,
  Users,
  TrendingUp,
  Target,
  Star,
  Quote,
  ChevronRight,
  Zap,
  Globe,
  FileCheck,
  Eye,
  MousePointerClick,
} from 'lucide-react'

/* ────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ────────────────────────────────────────────
   Section wrapper (intersection observer)
   ──────────────────────────────────────────── */

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────── */

const stats = [
  { value: '5 000+', label: 'Contacts B2B', icon: Users },
  { value: '15+', label: 'Secteurs couverts', icon: Target },
  { value: '98%', label: 'Délivrabilité', icon: ShieldCheck },
  { value: '4,2%', label: 'Taux de clic moyen', icon: MousePointerClick },
]

const steps = [
  {
    icon: FileCheck,
    title: 'Créez votre annonce',
    description:
      'Rédigez votre offre en quelques clics grâce à notre éditeur intuitif. Notre IA optimise automatiquement votre message pour maximiser l\'impact.',
  },
  {
    icon: Send,
    title: 'Nous la diffusons',
    description:
      'Votre annonce est intégrée dans la newsletter de votre secteur et région cibles. Envoi à des milliers de décideurs qualifiés.',
  },
  {
    icon: BarChart3,
    title: 'Suivez vos résultats',
    description:
      'Consultez en temps réel vos statistiques : taux d\'ouverture, clics, conversions. Optimisez chaque campagne grâce aux données.',
  },
]

const features = [
  {
    icon: MapPin,
    title: 'Ciblage géographique',
    description:
      'Ciblez précisément les décideurs par région, département ou code postal. Nos données sont actualisées en continu.',
  },
  {
    icon: Sparkles,
    title: 'Contenu IA',
    description:
      'Notre intelligence artificielle génère des éditoriaux pertinents et optimise vos annonces pour un meilleur taux de conversion.',
  },
  {
    icon: BarChart3,
    title: 'Analytics avancés',
    description:
      'Tableaux de bord complets avec suivi des performances, comparaisons sectorielles et recommandations personnalisées.',
  },
  {
    icon: ShieldCheck,
    title: 'Délivrabilité garantie',
    description:
      'Infrastructure d\'envoi certifiée, vérification des e-mails, gestion des bounces et conformité SPF/DKIM/DMARC.',
  },
  {
    icon: FileCheck,
    title: 'Conformité RGPD',
    description:
      'Base de données consentie, droit de désinscription garanti, documentation de conformité complète fournie.',
  },
  {
    icon: Headphones,
    title: 'Support dédié',
    description:
      'Un conseiller dédié pour vous accompagner dans la rédaction de vos annonces et l\'analyse de vos résultats.',
  },
]

const wedges = [
  {
    name: 'Compta Growth 33',
    sector: 'Comptabilité & Finance',
    region: 'Nouvelle-Aquitaine',
    subscribers: 847,
    openRate: 42,
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'RH Excellence 75',
    sector: 'Ressources Humaines',
    region: 'Île-de-France',
    subscribers: 1243,
    openRate: 38,
    color: 'from-yellow-500 to-amber-600',
  },
  {
    name: 'Tech Innovation 69',
    sector: 'Tech & Numérique',
    region: 'Auvergne-Rhône-Alpes',
    subscribers: 962,
    openRate: 45,
    color: 'from-orange-400 to-red-500',
  },
  {
    name: 'Formation Plus IDF',
    sector: 'Formation & Conseil',
    region: 'Île-de-France',
    subscribers: 1089,
    openRate: 41,
    color: 'from-amber-400 to-yellow-600',
  },
]

const plans = [
  {
    name: 'Bus Mailing',
    price: '49',
    period: '/annonce',
    description: 'Idéal pour un test ponctuel ou une communication ciblée.',
    features: [
      '1 annonce dans 1 newsletter',
      'Ciblage par secteur et région',
      'Rapport de performance détaillé',
      'Conformité RGPD incluse',
    ],
    cta: 'Publier une annonce',
    popular: false,
  },
  {
    name: 'Standard',
    price: '99',
    period: '/mois',
    description: 'Pour les entreprises qui souhaitent communiquer régulièrement.',
    features: [
      '4 annonces par mois',
      'Multi-secteurs et multi-régions',
      'Analytics avancés en temps réel',
      'Éditeur IA pour vos annonces',
      'Support par e-mail',
    ],
    cta: 'Démarrer l\'essai gratuit',
    popular: true,
  },
  {
    name: 'Premium',
    price: '199',
    period: '/mois',
    description: 'La solution complète pour maximiser votre croissance B2B.',
    features: [
      'Annonces illimitées',
      'Accès à toutes les newsletters',
      'Analytics premium + API',
      'Conseiller dédié personnalisé',
      'Priorité de diffusion',
      'Branding personnalisé',
    ],
    cta: 'Contacter l\'équipe',
    popular: false,
  },
]

const testimonials = [
  {
    name: 'Sophie Marchand',
    role: 'Directrice Commerciale',
    company: 'Fiduciaire du Sud',
    location: 'Toulouse',
    quote:
      'Depuis que nous utilisons La Lettre Business, notre pipeline commercial a augmenté de 35 %. Le ciblage géographique est vraiment précis.',
    rating: 5,
  },
  {
    name: 'Thomas Lefèvre',
    role: 'Gérant',
    company: 'FormatPro Conseil',
    location: 'Lyon',
    quote:
      'L\'outil est simple et efficace. En 10 minutes, mon annonce est prête et envoyée à des centaines de décideurs qualifiés. Un gain de temps énorme.',
    rating: 5,
  },
  {
    name: 'Marie Dupont',
    role: 'Responsable Marketing',
    company: 'TechSolutions SAS',
    location: 'Paris',
    quote:
      'Les analytics sont incroyablement détaillés. On sait exactement qui ouvre et clique. Le support est réactif et toujours à l\'écoute.',
    rating: 5,
  },
]

/* ────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════
          1. NAVBAR
          ═══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="text-2xl">📬</span>
            <span>
              La Lettre<span className="text-primary"> Business</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => scrollToSection('comment-ca-marche')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Comment ça marche
            </button>
            <button
              onClick={() => scrollToSection('tarifs')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tarifs
            </button>
            <button
              onClick={() => navigate('about')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              À propos
            </button>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" onClick={() => navigate('login')}>
              Se connecter
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('register')}
              className="gradient-primary border-0 text-white hover:opacity-90"
            >
              S&apos;inscrire
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background px-4 pb-6 pt-2 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('comment-ca-marche')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Comment ça marche
              </button>
              <button
                onClick={() => scrollToSection('tarifs')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Tarifs
              </button>
              <button
                onClick={() => navigate('about')}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                À propos
              </button>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('login')}
                >
                  Se connecter
                </Button>
                <Button
                  size="sm"
                  className="w-full gradient-primary border-0 text-white"
                  onClick={() => navigate('register')}
                >
                  S&apos;inscrire
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════════════════════════════════════
          2. HERO
          ═══════════════════════════════════════ */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 size-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 size-96 rounded-full bg-amber-500/8 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left – copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeIn} custom={0}>
                <Badge className="mb-6 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-400">
                  <Zap className="mr-1 size-3" />
                  Nouveau : intelligence artificielle intégrée
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Publiez vos offres B2B dans des{' '}
                <span className="text-gradient">newsletters locales ciblées</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0"
              >
                Créez vos annonces en quelques clics, diffusez-les auprès de milliers de
                décideurs qualifiés dans votre secteur et votre région. Suivez vos résultats
                en temps réel grâce à une plateforme pensée pour les PME françaises.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => navigate('register')}
                  className="gradient-primary border-0 text-white shadow-lg shadow-primary/20 hover:opacity-90"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => scrollToSection('comment-ca-marche')}
                >
                  Voir comment ça marche
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </motion.div>

              <motion.div
                variants={fadeIn}
                custom={4}
                className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50 lg:justify-start"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-amber-400" />
                  Sans engagement
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-amber-400" />
                  RGPD conforme
                </span>
              </motion.div>
            </motion.div>

            {/* Right – mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="animate-float rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-sm">
                {/* Mini newsletter mockup */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 pb-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
                      <Mail className="size-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Compta Growth 33</p>
                      <p className="text-xs text-white/50">Newsletter #47 &middot; 847 abonnés</p>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">Envoyée</Badge>
                  </div>

                  {/* Mockup stats */}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-white">42%</p>
                      <p className="text-xs text-white/50">Ouverture</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-amber-400">4,2%</p>
                      <p className="text-xs text-white/50">Clics</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-white">12</p>
                      <p className="text-xs text-white/50">Conversions</p>
                    </div>
                  </div>

                  {/* Mockup ad entries */}
                  <div className="mt-3 space-y-2">
                    {['Offre de formation comptable', 'Audit fiscal promotionnel'].map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg bg-white/5 p-2.5"
                        >
                          <div className="size-8 rounded bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                            <Megaphone className="size-4 text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium text-white">{item}</p>
                            <p className="text-xs text-white/40">Votre entreprise</p>
                          </div>
                          <Eye className="size-3.5 text-white/30" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 -top-4 rounded-xl border border-white/10 bg-white/10 px-4 py-2 shadow-lg backdrop-blur-md sm:-right-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">+35% conversions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. STATS BAR
          ═══════════════════════════════════════ */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px divide-x divide-border bg-border sm:grid-cols-4 lg:divide-x-0 lg:border-b lg:border-t">
          {stats.map((stat, idx) => (
            <AnimatedSection
              key={stat.label}
              delay={idx}
              className="flex flex-col items-center gap-2 bg-background px-4 py-8 text-center sm:py-10"
            >
              <stat.icon className="size-5 text-primary" />
              <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. HOW IT WORKS
          ═══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 size-3" />
              Simple et efficace
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Comment ça marche&nbsp;?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trois étapes simples pour toucher votre audience B2B idéale.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <AnimatedSection key={step.title} delay={idx * 2}>
                <Card className="relative h-full border-border/60 bg-background py-8 text-center shadow-none transition-shadow hover:shadow-md">
                  {/* Step number */}
                  <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {idx + 1}
                  </div>

                  <CardHeader className="items-center pb-0">
                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                      <step.icon className="size-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Connector arrow (desktop only, not on last item) */}
                  {idx < steps.length - 1 && (
                    <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                      <ChevronRight className="size-8 text-border" />
                    </div>
                  )}
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. FEATURES
          ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-28" id="a-propos">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 size-3" />
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pourquoi choisir La Lettre Business&nbsp;?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une plateforme complète conçue pour les besoins spécifiques des PME françaises.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, idx) => (
              <AnimatedSection key={feat.title} delay={idx}>
                <Card className="group h-full border-border/60 bg-background py-8 shadow-none transition-all hover:border-primary/30 hover:shadow-md">
                  <CardHeader className="pb-0">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <feat.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feat.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. WEDGE EXAMPLES
          ═══════════════════════════════════════ */}
      <section className="gradient-dark py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Globe className="mr-1 size-3" />
              Newsletters sectorielles
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Nos newsletters par secteur et région
            </h2>
            <p className="mt-4 text-white/60">
              Chaque newsletter cible un secteur et une zone géographique pour des résultats optimaux.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wedges.map((wedge, idx) => (
              <AnimatedSection key={wedge.name} delay={idx}>
                <div className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-amber-500/30 hover:bg-white/10">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${wedge.color}`}
                    >
                      <Mail className="size-5 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white/70 text-xs"
                    >
                      {wedge.openRate}% ouverture
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">{wedge.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{wedge.sector}</p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                    <MapPin className="size-3.5" />
                    {wedge.region}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Users className="size-3.5 text-amber-400" />
                    <span className="font-semibold text-white">
                      {wedge.subscribers.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-white/50">abonnés</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PRICING
          ═══════════════════════════════════════ */}
      <section id="tarifs" className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="mr-1 size-3" />
              Tarifs transparents
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Un plan adapté à chaque besoin
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pas de frais cachés. Changez de plan ou annulez à tout moment.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid items-start gap-8 md:grid-cols-3">
            {plans.map((plan, idx) => (
              <AnimatedSection key={plan.name} delay={idx}>
                <Card
                  className={`relative h-full py-8 transition-shadow hover:shadow-lg ${
                    plan.popular
                      ? 'border-primary shadow-md ring-2 ring-primary/20'
                      : 'border-border/60 shadow-none'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-primary border-0 px-3 py-1 text-white shadow-sm">
                        Le plus populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-extrabold tracking-tight">{plan.price}&euro;</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6">
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="justify-center px-6">
                    <Button
                      className={
                        plan.popular
                          ? 'w-full gradient-primary border-0 text-white hover:opacity-90'
                          : 'w-full'
                      }
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => navigate('register')}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-1.5 size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Quote className="mr-1 size-3" />
              Témoignages
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ils nous font confiance
            </h2>
            <p className="mt-4 text-muted-foreground">
              Découvrez les retours de nos clients à travers la France.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <AnimatedSection key={t.name} delay={idx}>
                <Card className="h-full border-border/60 bg-background py-8 shadow-none">
                  <CardContent>
                    {/* Stars */}
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <Quote className="mb-2 size-5 text-primary/40" />
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {t.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} &middot; {t.company}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Prêt à développer votre business B2B&nbsp;?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Rejoignez des centaines d&apos;entreprises qui utilisent La Lettre Business
              pour trouver de nouveaux clients qualifiés.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-primary focus-visible:ring-primary/30"
              />
              <Button
                size="lg"
                className="gradient-primary border-0 text-white hover:opacity-90"
                onClick={() => {
                  if (email) navigate('register')
                }}
              >
                <Send className="mr-2 size-4" />
                Démarrer
              </Button>
            </div>

            <p className="mt-4 text-xs text-white/40">
              Essai gratuit &middot; Sans carte bancaire &middot; Annulation en 1 clic
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-lg font-bold">
                <span className="text-2xl">📬</span>
                <span>
                  La Lettre<span className="text-primary"> Business</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                La plateforme de newsletters B2B pour les PME françaises. Ciblez, diffusez,
                convertissez.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Plateforme
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => scrollToSection('comment-ca-marche')}
                    className="transition-colors hover:text-foreground"
                  >
                    Comment ça marche
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('tarifs')}
                    className="transition-colors hover:text-foreground"
                  >
                    Tarifs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('blog')}
                    className="transition-colors hover:text-foreground"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('case-studies')}
                    className="transition-colors hover:text-foreground"
                  >
                    Cas clients
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Entreprise
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate('about')}
                    className="transition-colors hover:text-foreground"
                  >
                    À propos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('blog')}
                    className="transition-colors hover:text-foreground"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('careers')}
                    className="transition-colors hover:text-foreground"
                  >
                    Carrières
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('contact')}
                    className="transition-colors hover:text-foreground"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Légal
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate('legal/mentions')}
                    className="transition-colors hover:text-foreground"
                  >
                    Mentions légales
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('legal/cgv')}
                    className="transition-colors hover:text-foreground"
                  >
                    CGV
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('legal/privacy')}
                    className="transition-colors hover:text-foreground"
                  >
                    Politique de confidentialité
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('legal/cookies')}
                    className="transition-colors hover:text-foreground"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 La Lettre Business. Tous droits réservés.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <button className="transition-colors hover:text-foreground" aria-label="LinkedIn">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button className="transition-colors hover:text-foreground" aria-label="Twitter">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
