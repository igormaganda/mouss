'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/hooks/use-store'
import {
  Sparkles,
  Accessibility,
  Gamepad2,
  ArrowRight,
  Star,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  BarChart3,
  Bot,
  Target,
  Lightbulb,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  FileText,
  PieChart,
  ChevronRight,
  Play,
  Lock,
  Globe,
  Menu,
  X,
} from 'lucide-react'

/* ────────────── animations ────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])

  return (
    <span ref={ref}>
      {val.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

/* ────────────── data ────────────── */

const steps = [
  { num: '01', title: 'Inscrivez-vous', desc: 'Créez votre compte gratuitement en 30 secondes.', icon: Lock },
  { num: '02', title: 'Passez le diagnostic', desc: '7 modules interactifs alimentés par l\'IA.', icon: BrainCircuit },
  { num: '03', title: 'Obtenez votre verdict', desc: 'Go / No-Go personnalisé avec plan d\'action.', icon: Target },
]

const featureGrid = [
  {
    icon: Sparkles,
    title: 'IA Co-Pilote',
    desc: 'Un assistant intelligent analyse votre projet en temps réel et propose des recommandations personnalisées.',
    accent: 'emerald',
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    desc: 'Le Jeu des Pépites, la loterie de mots-clés et les parcours interactifs rendent le diagnostic engageant.',
    accent: 'amber',
  },
  {
    icon: Accessibility,
    title: 'Accessibilité inclusive',
    desc: 'Taille de texte ajustable, haut contraste, police dyslexique et masque de lecture pour une navigation inclusive.',
    accent: 'violet',
  },
  {
    icon: BarChart3,
    title: 'Analyse de marché',
    desc: 'Données sectorielles, étude concurrentielle et tendances territoriales pour valider votre positionnement.',
    accent: 'sky',
  },
  {
    icon: FileText,
    title: 'Business Plan IA',
    desc: 'Génération automatique de votre business plan avec questionnaire guidé et suggestions intelligentes.',
    accent: 'rose',
  },
  {
    icon: TrendingUp,
    title: 'Prévisionnel financier',
    desc: 'Projections sur 3 ans avec tableaux interactifs, calcul de charges et simulation d\'emprunt.',
    accent: 'orange',
  },
]

const profiles = [
  {
    role: 'Porteur de projet',
    desc: 'Un parcours structuré en 7 modules pour passer de l\'idée à la création, avec un suivi personnalisé.',
    icon: Users,
    features: ['Diagnostic interactif', 'Business Plan IA', 'Simulations financières', 'Suivi personnalisé'],
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    role: 'Conseiller',
    desc: 'Espace dédié avec IA Co-Pilote pour préparer, animer et synthétiser les entretiens.',
    icon: MessageSquare,
    features: ['Portfolio porteurs', 'IA Co-Pilote', 'Livrables auto', 'Entretiens guidés'],
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    role: 'Administrateur',
    desc: 'Vue d\'ensemble territoriale, indicateurs clés et gestion modulaire de la plateforme.',
    icon: PieChart,
    features: ['Pilotage territorial', 'Indicateurs live', 'Gestion modules', 'Suivi handicap'],
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
]

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Créatrice · GreenTech Solutions',
    text: "CréaPulse m'a permis d'identifier les forces et faiblesses de mon projet en 2 heures. L'IA m'a surprise par la pertinence de ses conseils !",
    rating: 5,
  },
  {
    name: 'Thomas Bernard',
    role: 'Porteur de projet · Immobilier',
    text: "La gamification rend l'expérience vraiment agréable. Le jeu des pépites m'a fait découvrir des compétences que je ne soupçonnais pas.",
    rating: 5,
  },
  {
    name: 'Amina Diallo',
    role: 'Conseillère · BGE Lyon',
    text: "L'espace conseiller me fait gagner un temps précieux. Le co-pilote IA synthétise parfaitement les profils de mes porteurs de projets.",
    rating: 5,
  },
]

const stats = [
  { value: 2500, suffix: '+', label: 'Diagnostics réalisés', icon: BarChart3 },
  { value: 95, suffix: '%', label: 'Taux de satisfaction', icon: Star },
  { value: 12, suffix: '', label: 'Territoires couverts', icon: Globe },
  { value: 7, suffix: '', label: 'Modules interactifs', icon: Zap },
]

const logos = [
  'BGE', 'CCI France', 'Réseau Entreprendre', 'Initiative France', 'ADIE', 'France Active',
]

/* ────────────── component ────────────── */

export default function LandingPage() {
  const setView = useAppStore((s) => s.setView)
  const [mobileMenu, setMobileMenu] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenu(false)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-900 antialiased overflow-x-hidden">

      {/* ═══════ NAV ═══════ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[1.15rem] font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CréaPulse
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Fonctionnalités', id: 'features' },
              { label: 'Comment ça marche', id: 'how' },
              { label: 'Espaces', id: 'profiles' },
              { label: 'Témoignages', id: 'testimonials' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-3.5 py-2 text-[0.82rem] font-medium text-gray-500 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('auth')}
              className="text-gray-600 hover:text-emerald-700 text-sm font-medium"
            >
              Connexion
            </Button>
            <Button
              size="sm"
              onClick={() => setView('auth')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-5 shadow-lg shadow-emerald-600/20 font-semibold text-sm"
            >
              Commencer
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 -mr-2 text-gray-600"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 py-4 space-y-1"
          >
            {[
              { label: 'Fonctionnalités', id: 'features' },
              { label: 'Comment ça marche', id: 'how' },
              { label: 'Espaces', id: 'profiles' },
              { label: 'Témoignages', id: 'testimonials' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Button variant="outline" onClick={() => setView('auth')} className="w-full rounded-xl">
                Connexion
              </Button>
              <Button onClick={() => setView('auth')} className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">
                Commencer
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* bg blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-emerald-100/50 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-100/40 blur-3xl pointer-events-none" />
        <div className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5">
          <div className="max-w-3xl mx-auto text-center">
            {/* badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[0.78rem] font-semibold mb-7"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Propulsé par l&apos;Intelligence Artificielle
            </motion.div>

            {/* heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[2.6rem] sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Votre projet entrepreneurial,{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                diagnostiqué par l&apos;IA
              </span>
            </motion.h1>

            {/* sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              CréaPulse combine intelligence artificielle et accompagnement humain
              pour vous guider à chaque étape de votre création d&apos;entreprise.
              Gratuit, accessible et ludique.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10"
            >
              <Button
                size="lg"
                onClick={() => setView('auth')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl px-8 h-[52px] text-[0.95rem] font-semibold shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all"
              >
                Démarrer le diagnostic
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollTo('how')}
                className="rounded-2xl px-7 h-[52px] text-[0.95rem] font-medium border-gray-200 hover:border-emerald-300 hover:text-emerald-700 gap-2"
              >
                <Play className="w-4 h-4" />
                Voir comment ça marche
              </Button>
            </motion.div>

            {/* trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8rem] text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Gratuit
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> RGPD Conforme
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" /> 2 500+ entrepreneurs
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ LOGOS BAR ═══════ */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-center text-[0.72rem] uppercase tracking-widest text-gray-400 font-semibold mb-6">
            Accompagné par les réseaux de la création d&apos;entreprise
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((l) => (
              <span key={l} className="text-sm font-bold text-gray-300 tracking-wide hover:text-emerald-500 transition-colors cursor-default">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          {/* header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[0.78rem] font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Fonctionnalités
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Tout pour réussir votre création
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-[1.05rem] leading-relaxed">
              Une plateforme complète, modulaire et intelligente qui s&apos;adapte à votre parcours unique.
            </motion.p>
          </motion.div>

          {/* grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {featureGrid.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-${f.accent}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 text-${f.accent}-600`} />
                </div>
                <h3 className="text-[1.05rem] font-bold mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how" className="py-20 sm:py-28 bg-gradient-to-b from-white via-emerald-50/30 to-white">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[0.78rem] font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Comment ça marche
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              3 étapes vers votre création
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-[1.05rem] leading-relaxed max-w-xl mx-auto">
              Un processus fluide et intuitif, conçu pour passer de l&apos;idée à l&apos;entreprise en un temps record.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp} custom={i} className="relative text-center">
                {/* connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-emerald-200" />
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 mb-5">
                  <s.icon className="w-8 h-8" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-white shadow-md grid place-items-center text-[0.7rem] font-extrabold text-emerald-600">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[260px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ PROFILES / SPACES ═══════ */}
      <section id="profiles" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[0.78rem] font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Espaces dédiés
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Un rôle, un espace sur mesure
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-[1.05rem] leading-relaxed">
              Chaque acteur de l&apos;écosystème dispose d&apos;une interface adaptée à ses besoins.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {profiles.map((p, i) => (
              <motion.div
                key={p.role}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${p.gradient}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                    <p.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">{p.role}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 rounded-[2rem] p-8 sm:p-12 lg:p-16 overflow-hidden"
          >
            {/* decorative */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center lg:text-left">
                  <s.icon className="w-5 h-5 text-emerald-400 mb-3 mx-auto lg:mx-0" />
                  <div className="text-4xl sm:text-5xl font-extrabold text-white mb-1.5 tracking-tight">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-sm text-gray-400">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[0.78rem] font-bold text-emerald-600 uppercase tracking-widest mb-3">
              Témoignages
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ils ont lancé leur projet avec CréaPulse
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center text-white text-xs font-bold">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-[2rem] p-10 sm:p-16 text-center overflow-hidden"
          >
            {/* decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            <div className="absolute -bottom-16 -left-16 w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-[0.75rem] font-semibold mb-6">
                <Lightbulb className="w-3.5 h-3.5" />
                Prêt à vous lancer ?
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Votre diagnostic en 15 minutes
              </h2>
              <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Rejoignez plus de 2 500 entrepreneurs qui ont déjà bénéficié de notre diagnostic intelligent et gratuit.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setView('auth')}
                  className="bg-white text-emerald-700 hover:bg-gray-50 rounded-2xl px-8 h-[52px] text-[0.95rem] font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setView('auth')}
                  className="text-white/90 hover:text-white hover:bg-white/10 rounded-2xl px-6 h-[52px] text-[0.95rem] font-medium gap-1.5"
                >
                  Se connecter
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  CréaPulse
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                La plateforme SaaS d&apos;accompagnement à la création d&apos;entreprise propulsée par l&apos;IA.
              </p>
            </div>

            {/* produit */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Produit</h4>
              <ul className="space-y-2.5">
                {['Fonctionnalités', 'Tarifs', 'API', 'Changelog'].map(l => (
                  <li key={l}>
                    <span className="text-sm text-gray-400 hover:text-emerald-600 transition-colors cursor-default">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ressources */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Ressources</h4>
              <ul className="space-y-2.5">
                {['Documentation', 'Blog', 'Guides', 'FAQ'].map(l => (
                  <li key={l}>
                    <span className="text-sm text-gray-400 hover:text-emerald-600 transition-colors cursor-default">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* legal */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Légal</h4>
              <ul className="space-y-2.5">
                {['Mentions légales', 'Confidentialité', 'CGU', 'Contact'].map(l => (
                  <li key={l}>
                    <span className="text-sm text-gray-400 hover:text-emerald-600 transition-colors cursor-default">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CréaPulse. Tous droits réservés.
            </p>
            <p className="text-xs text-gray-300">
              Fait avec passion pour les entrepreneurs francophones
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
