"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Home,
  ChevronRight,
  BarChart3,
  Search,
  ArrowRight,
  Building,
  Landmark,
  Receipt,
  Shield,
  Scale,
  Megaphone,
  Users,
  LayoutGrid,
  Handshake,
  HardHat,
  Calculator,
  TrendingUp,
  ClipboardList,
  FolderOpen,
  PiggyBank,
  FileText,
  Wrench,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

// ─── THEME NAVIGATION CONFIG ──────────────────────────────────────

const themeNavItems = [
  {
    id: "creation",
    icon: Building,
    title: "Création d'entreprise",
    items: [
      "Comparatif des statuts",
      "Guide immatriculation",
      "Documents constitutifs",
      "Kbis",
    ],
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "banque",
    icon: Landmark,
    title: "Banque & Finance",
    items: [
      "Banques pro en ligne",
      "Terminal paiement",
      "Prêt professionnel",
      "Financement participatif",
    ],
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "compta",
    icon: Receipt,
    title: "Comptabilité & Facturation",
    items: [
      "Logiciels comptabilité",
      "Facturation auto",
      "Notes de frais",
      "Expert-comptable en ligne",
    ],
    color: "from-sky-500 to-sky-700",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-200 dark:border-sky-800",
  },
  {
    id: "assurances",
    icon: Shield,
    title: "Assurances",
    items: [
      "RC Pro",
      "Mutuelle TNS",
      "Assurance décennale",
      "Comparatif offres",
    ],
    color: "from-rose-500 to-rose-700",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  {
    id: "juridique",
    icon: Scale,
    title: "Juridique",
    items: [
      "Contrats",
      "Mentions légales",
      "Dépôt de marque",
      "Propriété intellectuelle",
    ],
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  {
    id: "marketing-crm",
    icon: Megaphone,
    title: "Marketing & CRM",
    items: [
      "Email marketing",
      "CRM",
      "Automatisation",
      "Campagnes pub",
    ],
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
];

// ─── CATEGORY CONFIG ──────────────────────────────────────────────

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  itemCount: number;
  defaultIcon: LucideIcon;
  items: string[];
}

const categories: CategoryData[] = [
  {
    id: "compta-finance",
    title: "Comptabilité & Finance",
    description:
      "Si la comptabilité est rarement une partie de plaisir pour les entrepreneurs, elle est bien plus agréable avec des outils dédiés au numérique.",
    icon: Calculator,
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    itemCount: 23,
    defaultIcon: Receipt,
    items: [
      "Logiciel de devis et facturation",
      "Logiciel de comptabilité",
      "Logiciel de comptabilité pour TPE/PME",
      "Expert comptable en Ligne",
      "Logiciel ERP",
      "Logiciel de gestion d'abonnements",
      "Logiciel de gestion de caisse",
      "Logiciel de rapprochement bancaire",
      "Logiciel de trésorerie",
      "Logiciel d'achats",
      "Logiciel de gestion des investissements",
      "Logiciel de rapport financier",
      "Logiciel de gestion risques financiers",
      "Logiciel de conformité comptable",
      "Logiciel d'audit et commissariat aux comptes",
      "Logiciel de comptes débiteurs",
      "Logiciel de comptes fournisseurs",
      "Logiciel de saisie des commandes",
      "Logiciel de recouvrement",
      "Logiciel de gestion des actifs (EAM)",
      "Logiciels de suivi des actifs",
      "Logiciel de réservation voyages d'affaires",
      "Portage salarial",
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "À l'heure où le numérique apporte une concurrence accrue, nous avons identifié tous les leviers marketing que vous pourriez activer dès demain.",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
    itemCount: 38,
    defaultIcon: Megaphone,
    items: [
      "Logiciels d'Emailing",
      "Génération de leads",
      "Automatisation marketing",
      "E-commerce",
      "Création Graphique",
      "SEM/SEO/SEA",
      "Événementiel",
      "Sondages et questionnaires",
      "Gestion des actifs numériques (DAM)",
      "Affiliation",
      "Marketing de contenu",
      "Site Web (CMS)",
      "Marketing des réseaux sociaux",
      "Gestion des avis et feedback",
      "Webmarketing",
      "Envoi SMS Marketing",
      "Marketplace",
      "Veille marketing",
      "Publicité",
      "Digital Signage",
      "Customer Data Platform (CDP)",
      "Gestion de flux produit",
      "Gestion de réputation",
      "Webinar Marketing",
      "Influence Marketing",
      "Analyses Marketing",
      "Landing Pages",
      "Géomarketing",
      "Intelligence économique",
      "Copywriting",
      "Relations publiques (RP)",
      "A/B Testing",
      "Referral Marketing",
      "Data marketing",
      "Multi Level Marketing",
      "Gestion de marque",
      "Marketing Mobile",
      "Affichage publicitaire",
    ],
  },
  {
    id: "rh",
    title: "Ressources Humaines - RH",
    description:
      "Notre expérience nous a montré un déficit de connaissance des entreprises sur le suivi des candidats et la gestion des entretiens professionnels.",
    icon: Users,
    color: "from-rose-500 to-rose-700",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-800",
    itemCount: 30,
    defaultIcon: ClipboardList,
    items: [
      "Système d'information RH (SIRH)",
      "Gestion des temps",
      "Gestion de Paie",
      "Suivi des candidats (ATS)",
      "Recrutement",
      "Learning Management System (LMS)",
      "Formation",
      "Engagement des collaborateurs",
      "Gestion des employés",
      "Entretien Professionnel",
      "Gestion des données RH (BDESE)",
      "Gestion des congés et absences",
      "Gestion des talents",
      "Gestion des compétences",
      "Suivi des présences",
      "Pointage",
      "Test de recrutement",
      "Intégration des employés",
      "Bien-être des employés",
      "Entretien vidéo différé",
      "Organisation des employés",
      "Job Board",
      "Gestion des salariés nomades",
      "Gestion des bénévoles",
      "Reconnaissance des employés",
      "Plateforme d'Adoption Digitale",
      "Gestion internationale RH (GIRH)",
      "Automatisation du Recrutement",
      "Gamification",
      "Gestion de centre de formation",
    ],
  },
  {
    id: "organisation",
    title: "Organisation et Planification",
    description:
      "Avec des logiciels utilisables directement en ligne, la planification et l'organisation sont accessibles à toutes les entreprises.",
    icon: LayoutGrid,
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
    itemCount: 42,
    defaultIcon: FolderOpen,
    items: [
      "Gestion de projet",
      "Gestion commerciale",
      "Gestion des interventions et tournées",
      "QHSE",
      "Gestion d'entreprise",
      "GMAO",
      "Business Process Management (BPM)",
      "Gestion de stock",
      "Gestion de portefeuille de projets (PPM)",
      "Gestion de l'Information Produit (PIM)",
      "Gestion de la qualité projet",
      "Gestion de la chaîne logistique (SCM)",
      "Gestion des contrats",
      "Logistique",
      "Workflow",
      "Gestion de planning",
      "Gestion de produits (PLM)",
      "Gestion d'entrepôt",
      "Gestion de la maintenance",
      "Gestion de l'inventaire",
      "Gestion des fournisseurs",
      "Système d'Information Géographique (SIG)",
      "Conception Assistée par Ordinateur (CAO)",
      "Facility management",
      "Gestion des visiteurs",
      "Automatisation de Services professionnels (PSA)",
      "Vote en ligne",
      "Approvisionnement",
      "Business Plan",
      "Planification des ressources",
      "Planning sécurité",
      "Gestion de commandes",
      "Ordre de travail",
      "Gouvernance Risques & Conformité (GRC)",
      "Planification des Ressources de Production (MRP)",
      "Contrôle de l'inventaire",
      "Livraison",
      "Planification",
      "Gestion des besoins",
      "Gestion des immobilisations",
      "Création entreprise en ligne",
    ],
  },
  {
    id: "relation-client",
    title: "Gestion et Relation Client",
    description:
      "Ces logiciels vous permettent de gérer tout le processus client, de la prospection en passant par la conversion, jusqu'à la fidélisation.",
    icon: Handshake,
    color: "from-sky-500 to-sky-700",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-200 dark:border-sky-800",
    itemCount: 26,
    defaultIcon: Briefcase,
    items: [
      "CRM",
      "Point de vente (POS)",
      "Centre d'appel",
      "Support client",
      "Expérience client",
      "Réservation",
      "Sales Enablement",
      "Service Client",
      "Configuration de prix et devis (CPQ)",
      "Fidélité client",
      "Satisfaction client",
      "Billetterie",
      "Automatisation des forces de vente",
      "Extraction de données",
      "Engagement client",
      "Appels d'offre",
      "Service d'assistance",
      "Gestion des adhérences",
      "Configurateur de produit",
      "Optimisation des prix",
      "Customer Success",
      "Gestion des ventes",
      "Prospection Client",
      "Sales Intelligence",
      "Gestion des contacts",
      "Lead management",
    ],
  },
  {
    id: "immobilier",
    title: "Immobilier et Construction",
    description:
      "Nos comparatifs vous faciliteront le quotidien en tant que promoteur immobilier, architecte ou agent immobilier.",
    icon: HardHat,
    color: "from-teal-500 to-teal-700",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200 dark:border-teal-800",
    itemCount: 10,
    defaultIcon: Building,
    items: [
      "ERP BTP Bâtiment",
      "Logiciels de BTP",
      "Logiciels d'Agence immobilière",
      "Suivi de chantier",
      "Promoteurs immobiliers",
      "Logiciels d'Architecture",
      "Modélisation BIM (BIM)",
      "Gestion de propriétés",
      "Gestion de patrimoine immobilier",
      "Gestion locative",
    ],
  },
  {
    id: "banque-assurance-pro",
    title: "Banque et Assurance Pro",
    description:
      "Pour ces outils et services, nous avons pris plusieurs mois pour vous apporter un réel retour d'expérience complet et honnête.",
    icon: Landmark,
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200 dark:border-violet-800",
    itemCount: 16,
    defaultIcon: Shield,
    items: [
      "Assurances professionnelles",
      "Assurances décennales",
      "Assurance flotte auto",
      "Assurance multirisque pro",
      "Assurance cyber risques",
      "Banques professionnelles",
      "Comptes professionnels",
      "Carte carburant",
      "TPE (Terminal de paiement)",
      "Prêt professionnel",
      "RC Pro",
      "Mutuelle TNS",
      "Mutuelle d'entreprise",
      "Prévoyance TNS",
      "Prévoyance entreprise",
      "Protection juridique",
    ],
  },
  {
    id: "banque-assurance-perso",
    title: "Banque et Assurance Personnelles",
    description:
      "Optimisez vos finances personnelles avec nos comparatifs indépendants sur les banques, assurances et placements.",
    icon: PiggyBank,
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    iconColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200 dark:border-pink-800",
    itemCount: 23,
    defaultIcon: Wrench,
    items: [
      "Assurance vie",
      "Banque en ligne",
      "Cryptomonnaie",
      "Livret d'épargne",
      "Plateforme de trading",
      "Assurance-vie Luxembourgeoise",
      "Robo Advisor",
      "Plateforme de staking crypto",
      "PER",
      "SCPI",
      "PEA",
      "CTO (Compte Titres Ordinaire)",
      "Courtier en bourse",
      "Gestion pilotée",
      "ETF Assurance Vie",
      "Plateforme de crowdfunding",
      "Compte à terme",
      "ETF",
      "Fonds euro",
      "Carte bancaire gratuite",
      "Neobanques",
      "Banque en ligne gratuite",
      "SCPI Assurance Vie",
    ],
  },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ─── COMPONENT ────────────────────────────────────────────────────

export default function ComparatifsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);

  // Filter categories and items based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();

    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter(
          (item) =>
            item.toLowerCase().includes(query) ||
            cat.title.toLowerCase().includes(query)
        );
        return { ...cat, items: filteredItems, itemCount: filteredItems.length };
      })
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Auto-open accordion when searching
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      setOpenAccordion(filteredCategories.map((c) => c.id));
    } else {
      setOpenAccordion([]);
    }
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/40 dark:via-background dark:to-amber-950/30">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/30 dark:bg-amber-800/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              aria-label="Breadcrumb"
              className="mb-8"
            >
              <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    Accueil
                  </a>
                </li>
                <li>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </li>
                <li className="font-medium text-foreground">
                  Comparatifs et Avis
                </li>
              </ol>
            </motion.nav>

            {/* Title + Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <Badge
                variant="outline"
                className="mb-5 px-4 py-1.5 text-sm font-medium border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
              >
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                Guide Comparatif
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Comparatifs{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-amber-600 dark:from-emerald-400 dark:to-amber-400 bg-clip-text text-transparent">
                  et Avis
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Comparez les meilleurs outils et services pour entrepreneurs. Nos
                analyses détaillées vous aident à choisir les solutions adaptées
                à votre activité.
              </p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-6 sm:gap-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">176+</p>
                  <p className="text-sm text-muted-foreground">comparatifs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <LayoutGrid className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">categories</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/40">
                  <Shield className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">
                    avis objectifs
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ THEMATIC NAVIGATION ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
              >
                Navigation Thématique
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explorez par thème
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Vous avez déjà un besoin précis ? Accédez directement à nos
                guides classés par thématique.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {themeNavItems.map((theme) => (
                <motion.div
                  key={theme.id}
                  variants={itemVariants}
                  className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${theme.borderColor}`}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.color}`}
                  />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.bgColor}`}
                      >
                        <theme.icon className={`h-6 w-6 ${theme.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{theme.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {theme.items.length} guides disponibles
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {theme.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors"
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${theme.color} opacity-60 shrink-0`}
                          />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Voir le comparatif complet
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ CATEGORIES SECTION ═══ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
              >
                Toutes les Catégories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {totalItems} comparatifs en détail
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Explorez nos analyses approfondies réparties en 8 catégories
                thématiques pour trouver exactement ce dont vous avez besoin.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-xl mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un comparatif (ex: CRM, facturation, assurance...)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 text-base bg-muted/50 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Effacer
                  </button>
                )}
              </div>
              {searchQuery.trim() && (
                <p className="mt-3 text-sm text-muted-foreground text-center">
                  {filteredCategories.reduce((a, c) => a + c.items.length, 0)}{" "}
                  résultat{filteredCategories.reduce((a, c) => a + c.items.length, 0) > 1 ? "s" : ""}{" "}
                  pour &quot;{searchQuery}&quot;
                </p>
              )}
            </motion.div>

            {/* Categories Accordion */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Accordion
                type="multiple"
                value={openAccordion}
                onValueChange={setOpenAccordion}
                className="space-y-4"
              >
                {filteredCategories.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <AccordionItem
                      value={category.id}
                      className={`rounded-2xl border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md ${category.borderColor}`}
                    >
                      <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/30 transition-colors rounded-t-2xl">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.bgColor}`}
                          >
                            <category.icon
                              className={`h-6 w-6 ${category.iconColor}`}
                            />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-lg font-bold">
                                {category.title}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs font-semibold px-2.5 py-0.5"
                              >
                                {category.itemCount}{" "}
                                {category.itemCount > 1
                                  ? "comparatifs"
                                  : "comparatif"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 mt-2">
                          {category.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                          {category.items.map((item, index) => (
                            <motion.div
                              key={`${category.id}-${item}`}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: Math.min(index * 0.02, 0.4),
                              }}
                              className={`group/item relative flex items-start gap-3 p-4 rounded-xl border bg-background/50 transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:bg-background ${category.borderColor}`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.bgColor} transition-transform duration-200 group-hover/item:scale-110`}
                              >
                                <category.defaultIcon
                                  className={`h-4 w-4 ${category.iconColor}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-foreground leading-snug">
                                  {item}
                                </h4>
                                <a
                                  href="#"
                                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 hover:underline"
                                >
                                  Voir le comparatif
                                  <ArrowRight className="h-3 w-3" />
                                </a>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              {/* No results state */}
              {searchQuery.trim() && filteredCategories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Aucun résultat
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Aucun comparatif ne correspond à votre recherche &quot;
                    {searchQuery}&quot;. Essayez avec d&apos;autres mots-clés.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => handleSearch("")}
                  >
                    Effacer la recherche
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA SECTION ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/30 dark:via-background dark:to-amber-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-amber-600 dark:from-emerald-700 dark:to-amber-700 p-8 sm:p-12 lg:p-16 text-center"
            >
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Vous ne trouvez pas votre comparatif ?
                </h2>
                <p className="mt-4 text-emerald-50/90 text-lg max-w-2xl mx-auto">
                  Notre équipe rédige en permanence de nouvelles analyses.
                  Suggérez-nous un sujet ou prenez rendez-vous avec un expert
                  pour obtenir un conseil personnalisé.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#audit">
                    <Button
                      size="lg"
                      className="gap-2 bg-white text-emerald-700 hover:bg-white/90 font-semibold text-base px-8 h-12 rounded-xl shadow-lg"
                    >
                      <BarChart3 className="h-5 w-5" />
                      Demander un comparatif
                    </Button>
                  </a>
                  <a href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 h-12 rounded-xl"
                    >
                      <Home className="h-5 w-5" />
                      Retour à l&apos;accueil
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--muted-foreground) / 0.4);
        }
      `}</style>
    </div>
  );
}
