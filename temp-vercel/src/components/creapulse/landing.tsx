'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/hooks/use-store'
import {
  Sparkles,
  Accessibility,
  Gamepad2,
  Layers,
  ArrowRight,
  Star,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  BarChart3,
  Quote,
  Monitor,
  Smartphone,
  Bot,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {target.toLocaleString('fr-FR')}{suffix}
    </motion.span>
  )
}

const features = [
  {
    icon: Sparkles,
    title: 'IA Co-Pilote',
    description:
      "Un assistant intelligent qui analyse votre projet en temps réel et vous propose des recommandations personnalisées adaptées à votre profil entrepreneurial.",
    color: 'from-emerald-500 to-teal-600',
    image: '/images/landing/pexels-creative.jpg',
  },
  {
    icon: Accessibility,
    title: 'Accessibilité',
    description:
      "Conçu pour tous : taille de texte ajustable, mode haut contraste, police dyslexique, masque de lecture et ligne de suivi pour une navigation inclusive.",
    color: 'from-violet-500 to-purple-600',
    image: '/images/landing/pexels-meeting.jpg',
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    description:
      "Apprenez en jouant ! Le Jeu des Pépites, la loterie de mots-clés et les parcours interactifs rendent le diagnostic engageant et motivant.",
    color: 'from-amber-500 to-orange-600',
    image: '/images/landing/pexels-startup.jpg',
  },
  {
    icon: Layers,
    title: 'Modularité',
    description:
      '7 modules configurables selon vos besoins : bilan découverte, orientation RIASEC, compétences, marché, financier, livrables et suivi territorial.',
    color: 'from-sky-500 to-blue-600',
    image: '/images/landing/pexels-creative.jpg',
  },
]

const testimonialImages = [
  '/images/landing/testimonial-woman.png',
  '/images/landing/testimonial-man.png',
  '/images/landing/testimonial-aminata.png',
]

// Fallback testimonials used when API returns no data
const fallbackTestimonials = [
  {
    name: 'Sophie Martin',
    role: 'Créatrice de GreenTech Solutions',
    text: "CréaPulse m'a permis d'identifier les forces et les faiblesses de mon projet en seulement 2 heures. L'IA m'a surpris par la pertinence de ses conseils !",
    rating: 5,
  },
  {
    name: 'Thomas Bernard',
    role: 'Porteur de projet immobilier',
    text: "La gamification du diagnostic rend l'expérience vraiment agréable. Le jeu des pépites m'a fait découvrir des compétences que je ne soupçonnais pas.",
    rating: 5,
  },
  {
    name: 'Amina Diallo',
    role: 'Conseillère BGE Lyon',
    text: "En tant que conseillère, l'espace dédié me fait gagner un temps précieux. Le co-pilote IA synthétise parfaitement les profils de mes porteurs de projets.",
    rating: 4,
  },
]

const fallbackStats = [
  { value: 2500, suffix: '+', label: 'Diagnostics réalisés', icon: BarChart3 },
  { value: 95, suffix: '%', label: 'Taux de satisfaction', icon: Star },
  { value: 12, suffix: '', label: 'Territoires couverts', icon: Shield },
  { value: 7, suffix: '', label: 'Modules interactifs', icon: Zap },
]

export default function LandingPage() {
  const setView = useAppStore((s) => s.setView)
  const [stats, setStats] = useState(fallbackStats)
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [entrepreneursText, setEntrepreneursText] = useState('+2 500 entrepreneurs accompagnés')
  const [ctaEntrepreneursText, setCtaEntrepreneursText] = useState('plus de 2 500 entrepreneurs')

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [statsRes, testimonialsRes] = await Promise.allSettled([
          fetch('/api/dashboard/stats').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/testimonials').then((r) => (r.ok ? r.json() : null)),
        ])

        const statsData = statsRes.status === 'fulfilled' ? statsRes.value : null
        if (statsData) {
          const totalUsers = statsData.stats?.totalUsers || statsData.totalUsers || 2500
          const territoryCount = statsData.stats?.territories?.length || 0
          const goDecisions = statsData.stats?.diagnosticsByDecision?.GO || 0
          const totalDecisions = Object.values(statsData.stats?.diagnosticsByDecision || {}).reduce(
            (sum: number, v: number) => sum + v,
            0
          ) as number
          const satisfaction = totalDecisions > 0 ? Math.round((goDecisions / totalDecisions) * 100) : null

          setStats([
            { value: totalUsers, suffix: '+', label: 'Diagnostics réalisés', icon: BarChart3 },
            { value: satisfaction ?? 95, suffix: '%', label: 'Taux de satisfaction', icon: Star },
            { value: territoryCount || 12, suffix: '', label: 'Territoires couverts', icon: Shield },
            { value: 7, suffix: '', label: 'Modules interactifs', icon: Zap },
          ])

          setEntrepreneursText(`+${totalUsers.toLocaleString('fr-FR')} entrepreneurs accompagnés`)
          setCtaEntrepreneursText(`plus de ${totalUsers.toLocaleString('fr-FR')} entrepreneurs`)
        }

        const testimonialsData = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value : null
        if (testimonialsData?.testimonials && testimonialsData.testimonials.length > 0) {
          setTestimonials(testimonialsData.testimonials)
        }
      } catch {
        // Keep fallback values already set in state
      } finally {
        setStatsLoaded(true)
      }
    }
    fetchLandingData()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CréaPulse
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#mockup" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Plateforme
              </a>
              <a href="#stats" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Résultats
              </a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Témoignages
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('auth')}
                className="text-gray-600 hover:text-emerald-600"
              >
                Connexion
              </Button>
              <Button
                size="sm"
                onClick={() => setView('auth')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 sm:pt-40 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 opacity-50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-50 to-violet-50 opacity-30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-8"
              >
                <Sparkles className="w-4 h-4" />
                Propulsé par l&apos;Intelligence Artificielle
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
              >
                Diagnostiquez votre{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  projet entrepreneurial
                </span>{' '}
                avec l&apos;IA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed"
              >
                CréaPulse combine intelligence artificielle et accompagnement humain pour
                vous guider à chaque étape de votre parcours de création d&apos;entreprise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-8"
              >
                <Button
                  size="lg"
                  onClick={() => setView('auth')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all"
                >
                  Commencer le diagnostic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setView('auth')}
                  className="rounded-full px-8 h-12 text-base border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                >
                  Voir la démo
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Gratuit pour les porteurs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" />
                  {!statsLoaded ? (
                    <span className="inline-block w-36 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    entrepreneursText
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Données sécurisées RGPD</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Hero image composition */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main coaching image */}
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
                >
                  <Image
                    src="/images/landing/hero-coaching.png"
                    alt="Session de coaching entrepreneurial CréaPulse"
                    width={560}
                    height={420}
                    className="object-cover w-full h-auto"
                    priority
                  />
                </motion.div>

                {/* Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 z-20 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">+2 500 diagnostics</p>
                    <p className="text-xs text-gray-400">réalisés en 2025</p>
                  </div>
                </motion.div>

                {/* Floating AI badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg p-3 flex items-center gap-2 text-white"
                >
                  <Bot className="w-5 h-5" />
                  <span className="text-sm font-semibold">IA Active</span>
                </motion.div>

                {/* Background accent shape */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-3xl -z-10 blur-sm" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Mockup Section */}
      <section id="mockup" className="py-12 sm:py-16 bg-gradient-to-b from-gray-50/80 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} custom={0} className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wider">
              Aperçu de la plateforme
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Une interface intuitive et puissante
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-lg text-gray-500 max-w-2xl mx-auto">
              Découvrez les trois espaces conçus pour les porteurs de projet, les conseillers et les administrateurs.
            </motion.p>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl">
              {/* Browser chrome */}
              <div className="bg-gray-800 rounded-t-xl px-4 py-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-400 text-center max-w-md mx-auto">
                    app.creapulse.fr/dashboard
                  </div>
                </div>
              </div>
              {/* Screen */}
              <div className="relative rounded-b-xl overflow-hidden">
                <Image
                  src="/images/landing/mockup-dashboard.png"
                  alt="Tableau de bord CréaPulse - Vue d'ensemble du diagnostic entrepreneurial"
                  width={1344}
                  height={768}
                  className="w-full h-auto"
                />
                {/* Gradient overlay bottom for smooth blend */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>
            </div>

            {/* Floating labels around the mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden lg:flex absolute left-0 top-1/4 -translate-y-1/2 items-center gap-2"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Dashboard Usager</p>
                  <p className="text-[10px] text-gray-400">7 modules interactifs</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:flex absolute right-0 top-1/3 -translate-y-1/2 items-center gap-2"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900">IA Co-Pilote</p>
                  <p className="text-[10px] text-gray-400">Analyse en temps réel</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile mockup row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Monitor, title: 'Espace Usager', desc: 'Bilan, RIASEC, compétences, marché, financier', color: 'from-emerald-500 to-teal-600' },
              { icon: Smartphone, title: 'Espace Conseiller', desc: 'Entretiens, notes, livrables, collaboration', color: 'from-violet-500 to-purple-600' },
              { icon: Shield, title: 'Espace Admin', desc: 'Pilotage, indicateurs, gestion modulaire', color: 'from-amber-500 to-orange-600' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} custom={0} className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wider">
              Fonctionnalités
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Tout ce dont vous avez besoin pour réussir
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-lg text-gray-500 max-w-2xl mx-auto">
              Une plateforme complète qui s&apos;adapte à votre parcours entrepreneurial unique.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300"
              >
                {/* Image background */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div
                    className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team / Illustration Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src="/images/landing/hero-team.png"
                alt="Équipe d'entrepreneurs collaborant sur CréaPulse"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
                  Accompagnement
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Un écosystème complet pour chaque acteur
                </h2>
              </div>

              {[
                {
                  icon: Users,
                  title: 'Porteurs de projet',
                  desc: 'Un parcours structuré en 7 modules pour passer de l\'idée à la création, avec un suivi personnalisé et des outils de simulation.',
                  color: 'text-emerald-600 bg-emerald-50',
                },
                {
                  icon: Star,
                  title: 'Conseillers',
                  desc: 'Un espace dédié avec IA Co-Pilote pour préparer, animer et synthétiser les entretiens avec des livrables automatiques.',
                  color: 'text-violet-600 bg-violet-50',
                },
                {
                  icon: Shield,
                  title: 'Administrateurs',
                  desc: 'Vue d\'ensemble territorial, indicateurs de performance, gestion modulaire et suivi de l\'accessibilité en temps réel.',
                  color: 'text-amber-600 bg-amber-50',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/80 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden relative"
          >
            {/* Background image overlay */}
            <div className="absolute inset-0 opacity-5">
              <Image
                src="/images/landing/pexels-startup.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
            <div className="relative">
              <motion.p
                variants={fadeInUp}
                custom={0}
                className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider"
              >
                Résultats
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                custom={1}
                className="text-3xl sm:text-4xl font-bold text-white mb-12"
              >
                Des chiffres qui parlent d&apos;eux-mêmes
              </motion.h2>

              {!statsLoaded ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse mb-3" />
                      <div className="w-24 h-10 bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label} variants={fadeInUp} custom={i + 2}>
                      <div className="flex items-center gap-2 mb-3">
                        <stat.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} custom={0} className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wider">
              Témoignages
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Ils ont confiance en CréaPulse
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                custom={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                {/* Photo */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={testimonialImages[i] || testimonialImages[0]}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4">
                    <Quote className="w-8 h-8 text-white/60" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Prêt à lancer votre projet ?
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              Rejoignez {ctaEntrepreneursText} qui ont déjà bénéficié de notre diagnostic intelligent.
            </p>
            <Button
              size="lg"
              onClick={() => setView('auth')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all"
            >
              Démarrer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CréaPulse
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Mentions légales</span>
              <span>Politique de confidentialité</span>
              <span>CGU</span>
              <span>Contact</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CréaPulse. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
