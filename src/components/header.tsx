"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  UserCircle,
  ArrowRight,
  Rocket,
  Building2,
  Building,
  Landmark,
  Lightbulb,
  Scale,
  FileText,
  Stamp,
  Package,
  Briefcase,
  Store,
  HardHat,
  Stethoscope,
  Shuffle,
  Megaphone,
  Target,
  Users,
  Globe,
  FilePenLine,
  Bot,
  CreditCard,
  Receipt,
  Banknote,
  ShieldCheck,
  FileSignature,
  MapPin,
  Umbrella,
  HandCoins,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Calculator,
  FileSpreadsheet,
  MessageCircleQuestion,
  Mail,
  ClipboardCheck,
} from "lucide-react";

/* ───────────────────────────────────────────
   DATA TYPES
   ─────────────────────────────────────────── */

interface MegaMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

interface MegaMenuColumn {
  heading: string;
  items: MegaMenuItem[];
}

interface MegaMenuCTA {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

interface MegaMenuData {
  columns: MegaMenuColumn[];
  cta: MegaMenuCTA;
}

interface NavItem {
  label: string;
  href?: string;
  megaMenu?: MegaMenuData;
}

/* ───────────────────────────────────────────
   MEGA-MENU DATA
   ─────────────────────────────────────────── */

const lancerData: MegaMenuData = {
  columns: [
    {
      heading: "Par statut juridique",
      items: [
        {
          icon: Rocket,
          title: "Auto-entrepreneur",
          description: "Créez sans frais",
          href: "/creer-mon-entreprise/auto-entrepreneur",
        },
        {
          icon: Building2,
          title: "SASU / SAS",
          description: "La forme préférée",
          href: "/creer-mon-entreprise/sasu-sas",
        },
        {
          icon: Building,
          title: "SARL / EURL",
          description: "Protégez votre patrimoine",
          href: "/creer-mon-entreprise/sarl-eurl",
        },
        {
          icon: Landmark,
          title: "SCI / Association",
          description: "Investissement immobilier",
          href: "/creer-mon-entreprise/sci-association",
        },
        {
          icon: Lightbulb,
          title: "Micro-entreprise",
          description: "Testez votre idée",
          href: "/creer-mon-entreprise/micro-entreprise",
        },
      ],
    },
    {
      heading: "Par démarche",
      items: [
        {
          icon: Scale,
          title: "Comparateur de statuts",
          description: "Trouvez le statut idéal",
          href: "/comparatifs/statuts",
        },
        {
          icon: FileText,
          title: "Rédiger mes statuts",
          description: "Statuts conformes au code",
          href: "/outils/rediger-statuts",
        },
        {
          icon: Stamp,
          title: "Immatriculer ma société",
          description: "Dépôt au greffe en 48h",
          href: "/accompagnement/immatriculation",
        },
        {
          icon: Package,
          title: "Packs immatriculation",
          description: "Créer 9€ · Pro 29€ · Premium 79€",
          href: "/tarifs",
        },
        {
          icon: FilePenLine,
          title: "Business Plan",
          description: "Convaincre banques & investisseurs",
          href: "/outils/business-plan",
        },
      ],
    },
    {
      heading: "Par situation",
      items: [
        {
          icon: Briefcase,
          title: "Freelance / Consulting",
          description: "Simplifiez votre activité",
          href: "/creer-mon-entreprise/freelance",
        },
        {
          icon: Store,
          title: "E-commerce",
          description: "Lancez votre boutique",
          href: "/creer-mon-entreprise/e-commerce",
        },
        {
          icon: HardHat,
          title: "Artisan / BTP",
          description: "Créez votre entreprise du bâtiment",
          href: "/creer-mon-entreprise/artisan-btp",
        },
        {
          icon: Stethoscope,
          title: "Prof. libéral réglementé",
          description: "Avocat, médecin, expert-comptable...",
          href: "/metiers-reglementes",
        },
        {
          icon: Shuffle,
          title: "Reconversion professionnelle",
          description: "Quittez votre CDI en sécurité",
          href: "/creer-mon-entreprise/reconversion",
        },
      ],
    },
  ],
  cta: {
    icon: ClipboardCheck,
    title: "Audit gratuit en 3 min",
    description:
      "Découvrez les outils et le statut adaptés à votre projet",
    buttonLabel: "Commencer mon audit",
    href: "/audit",
  },
};

const gererData: MegaMenuData = {
  columns: [
    {
      heading: "Marketing & Croissance",
      items: [
        {
          icon: Megaphone,
          title: "Marketing Digital",
          description: "SEO, ads, réseaux sociaux",
          href: "/outils/marketing-digital",
        },
        {
          icon: Target,
          title: "Lead Generation B2B",
          description: "Prospects qualifiés en continu",
          href: "/outils/lead-generation",
        },
        {
          icon: Users,
          title: "Community Management",
          description: "Gérez vos réseaux sociaux",
          href: "/outils/community-management",
        },
        {
          icon: Globe,
          title: "Création de Site Web",
          description: "Site vitrine, e-commerce",
          href: "/outils/creation-site-web",
        },
        {
          icon: FilePenLine,
          title: "Stratégie de contenu",
          description: "Articles, vidéos, podcast",
          href: "/outils/strategie-contenu",
        },
      ],
    },
    {
      heading: "Gestion & Admin",
      items: [
        {
          icon: Bot,
          title: "Copilote Entreprise",
          description: "Votre partenaire stratégique",
          href: "/outils/copilote",
        },
        {
          icon: CreditCard,
          title: "Comptabilité en ligne",
          description: "Outils automatisés : Indy, Pennylane",
          href: "/outils/comptabilite",
        },
        {
          icon: Banknote,
          title: "Banque Professionnelle",
          description: "Qonto, Shine, Finom",
          href: "/outils/banque-pro",
        },
        {
          icon: Receipt,
          title: "Facturation",
          description: "Devis, factures, relances",
          href: "/outils/facturation",
        },
        {
          icon: HandCoins,
          title: "Payroll / Paie",
          description: "Gestion de la paie",
          href: "/outils/paie",
        },
      ],
    },
    {
      heading: "Juridique",
      items: [
        {
          icon: FileSignature,
          title: "Formalités & Déclarations",
          description: "Modifications, transferts",
          href: "/outils/formalites",
        },
        {
          icon: FileText,
          title: "Contrats & Documents",
          description: "CGV, contrats de travail, bail...",
          href: "/outils/contrats",
        },
        {
          icon: MapPin,
          title: "Domiciliation d'entreprise",
          description: "Adresse professionnelle",
          href: "/outils/domiciliation",
        },
        {
          icon: Umbrella,
          title: "Assurance Professionnelle",
          description: "RC Pro, décennale, multirisque",
          href: "/outils/assurance-pro",
        },
        {
          icon: HandCoins,
          title: "Dossier de financement",
          description: "Business plan pour investisseurs",
          href: "/outils/dossier-financement",
        },
      ],
    },
  ],
  cta: {
    icon: Store,
    title: "Marketplace d'outils",
    description: "Comparez +200 outils pour votre entreprise",
    buttonLabel: "Explorer les outils",
    href: "/outils",
  },
};

const ressourcesData: MegaMenuData = {
  columns: [
    {
      heading: "Contenu & Guides",
      items: [
        {
          icon: BookOpen,
          title: "Blog Entrepreneur",
          description: "Guides, actus, conseils",
          href: "/actualites",
        },
        {
          icon: GraduationCap,
          title: "Guides de Création",
          description: "Statuts, formalités, checklist",
          href: "/creer-mon-entreprise",
        },
        {
          icon: ClipboardList,
          title: "Fiches Métiers",
          description: "25 professions réglementées",
          href: "/metiers-reglementes",
        },
        {
          icon: Scale,
          title: "Comparatifs d'Outils",
          description: "Banque, compta, assurance",
          href: "/comparatifs",
        },
      ],
    },
    {
      heading: "Outils Pratiques",
      items: [
        {
          icon: Calculator,
          title: "Simulateurs",
          description: "IS, TVA, charges sociales...",
          href: "/outils/simulateurs",
        },
        {
          icon: FileSpreadsheet,
          title: "Modèles & Templates",
          description: "PV AG, statuts types, contrats",
          href: "/outils/modeles",
        },
        {
          icon: MessageCircleQuestion,
          title: "FAQ & Chatbot",
          description: "Réponses instantanées",
          href: "/outils/faq",
        },
        {
          icon: Mail,
          title: "Newsletter",
          description: "Conseils hebdomadaires",
          href: "/actualites",
        },
      ],
    },
  ],
  cta: {
    icon: BookOpen,
    title: "Ebook gratuit",
    description:
      "Les 10 erreurs à éviter quand on crée son entreprise",
    buttonLabel: "Télécharger",
    href: "/outils/ebook",
  },
};

const navItems: NavItem[] = [
  { label: "Lancer ma boîte", megaMenu: lancerData },
  { label: "Gérer ma boîte", megaMenu: gererData },
  { label: "Ressources", megaMenu: ressourcesData },
  { label: "Métiers réglementés", href: "/metiers-reglementes" },
];

/* ───────────────────────────────────────────
   DESKTOP MEGA-MENU PANEL
   ─────────────────────────────────────────── */

function MegaMenuPanel({ data }: { data: MegaMenuData }) {
  return (
    <div className="flex gap-6 p-6">
      {/* Columns */}
      <div className="flex-1 grid gap-6" style={{ gridTemplateColumns: `repeat(${data.columns.length}, 1fr)` }}>
        {data.columns.map((column) => (
          <div key={column.heading} className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {column.heading}
            </p>
            <ul className="space-y-0.5">
              {column.items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-accent/50"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Card */}
      <div className="w-64 shrink-0">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 flex flex-col items-center text-center h-full justify-center relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <data.cta.icon className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1.5">
              {data.cta.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {data.cta.description}
            </p>
            <Link
              href={data.cta.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {data.cta.buttonLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   MOBILE ACCORDION SECTION
   ─────────────────────────────────────────── */

function MobileAccordionSection({
  label,
  children,
  isOpen,
  onToggle,
}: {
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/50">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-accent/30 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pb-2">{children}</div>
      </div>
    </div>
  );
}

function MobileMenuColumn({
  heading,
  items,
  onClose,
}: {
  heading: string;
  items: MegaMenuItem[];
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileAccordionSection
      label={heading}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="pl-2 pr-2 space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={onClose}
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
          >
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </MobileAccordionSection>
  );
}

function MobileMegaMenu({
  data,
  onClose,
}: {
  data: MegaMenuData;
  onClose: () => void;
}) {
  const [mainOpen, setMainOpen] = useState(false);

  return (
    <MobileAccordionSection
      label={data.columns.map((c) => c.heading).join(" · ")}
      isOpen={mainOpen}
      onToggle={() => setMainOpen(!mainOpen)}
    >
      <div className="pl-2">
        {data.columns.map((column) => (
          <MobileMenuColumn
            key={column.heading}
            heading={column.heading}
            items={column.items}
            onClose={onClose}
          />
        ))}
        {/* Mobile CTA */}
        <div className="px-3 py-3">
          <Link
            href={data.cta.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/10 p-3 transition-colors hover:bg-primary/10"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <data.cta.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-foreground">
                {data.cta.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {data.cta.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          </Link>
        </div>
      </div>
    </MobileAccordionSection>
  );
}

/* ───────────────────────────────────────────
   MAIN HEADER COMPONENT
   ─────────────────────────────────────────── */

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg transition-transform group-hover:scale-105">
            CE
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Créa
            </span>
            <span className="text-xs block -mt-1 text-muted-foreground">
              Entreprise
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent/50"
                >
                  {item.label}
                </Link>
              );
            }

            const isActive = activeMenu === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.megaMenu && handleMouseEnter(item.label)
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-foreground bg-accent/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isActive && "rotate-180"
                    )}
                  />
                </button>

                {/* Mega-menu dropdown */}
                {isActive && item.megaMenu && (
                  <div
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-2 w-[860px]"
                    onMouseEnter={() =>
                      item.megaMenu && handleMouseEnter(item.label)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rounded-2xl border border-border/60 bg-white shadow-xl overflow-hidden">
                      <MegaMenuPanel data={item.megaMenu} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Right-side Actions ── */}
        <div className="flex items-center gap-2">
          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <UserCircle className="h-4 w-4" />
                Connexion
              </Button>
            </Link>
            <Link href="/audit">
              <Button className="gap-1.5 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20">
                <ClipboardCheck className="h-4 w-4" />
                Audit Gratuit
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0 overflow-y-auto">
              <SheetHeader className="px-4 pt-6 pb-0">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    CE
                  </div>
                  <span className="text-base font-bold">Créa Entreprise</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-4 flex flex-col">
                {/* Direct link items */}
                {navItems
                  .filter((item) => item.href)
                  .map((item) => (
                    <Link
                      key={item.label}
                      href={item.href!}
                      onClick={closeMobile}
                      className="flex items-center px-4 py-3.5 text-sm font-medium text-foreground hover:bg-accent/30 transition-colors border-b border-border/50"
                    >
                      {item.label}
                    </Link>
                  ))}

                {/* Mega-menu items (mobile accordion) */}
                {navItems
                  .filter((item) => item.megaMenu)
                  .map((item) => (
                    <MobileMegaMenu
                      key={item.label}
                      data={item.megaMenu!}
                      onClose={closeMobile}
                    />
                  ))}

                {/* Bottom actions */}
                <div className="mt-auto space-y-2 p-4 border-t border-border/50">
                  <Link href="/login" onClick={closeMobile}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-center"
                    >
                      <UserCircle className="h-4 w-4" />
                      Connexion / Mon Compte
                    </Button>
                  </Link>
                  <Link href="/audit" onClick={closeMobile}>
                    <Button className="w-full gap-2 justify-center bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20">
                      <ClipboardCheck className="h-4 w-4" />
                      Audit Gratuit
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
