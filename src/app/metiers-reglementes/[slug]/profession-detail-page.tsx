"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Stethoscope,
  Heart,
  Pill,
  Smile,
  Activity,
  Baby,
  Scale,
  Stamp,
  Calculator,
  ShieldCheck,
  Building2,
  HardHat,
  Compass,
  Search,
  Leaf,
  UtensilsCrossed,
  Croissant,
  Beef,
  Wine,
  Car,
  Truck,
  Box,
  Scissors,
  Sparkles,
  Dumbbell,
  ArrowRight,
  Check,
  Star,
  Lightbulb,
  GraduationCap,
  ClipboardCheck,
  Wrench,
  ArrowLeft,
  Phone,
  Zap,
  Rocket,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tool {
  name: string;
  description: string;
  category: string;
  pricing: string;
  rating: number;
}

interface ServiceLink {
  slug: string;
  title: string;
  description: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ProfessionData {
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  authority: string;
  diploma: string;
  requirements: string[];
  tools: Tool[];
  services: ServiceLink[];
  tips: string[];
  faq: FaqItem[];
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope, Heart, Pill, Smile, Activity, Baby, Scale, Stamp, Calculator,
  ShieldCheck, Building2, HardHat, Compass, Search, Leaf, UtensilsCrossed,
  Croissant, Beef, Wine, Car, Truck, Box, Scissors, Sparkles, Dumbbell,
};

// ─── Color Gradients ──────────────────────────────────────────────────────────

const colorGradients: Record<string, string> = {
  rose: "from-rose-400 to-pink-500",
  red: "from-red-400 to-rose-500",
  emerald: "from-emerald-400 to-teal-500",
  blue: "from-blue-400 to-cyan-500",
  teal: "from-teal-400 to-emerald-500",
  pink: "from-pink-400 to-rose-500",
  amber: "from-amber-400 to-orange-500",
  yellow: "from-yellow-400 to-amber-500",
  indigo: "from-indigo-400 to-violet-500",
  cyan: "from-cyan-400 to-blue-500",
  orange: "from-orange-400 to-red-500",
  slate: "from-slate-400 to-gray-500",
  stone: "from-stone-400 to-neutral-500",
  green: "from-green-400 to-emerald-500",
  purple: "from-purple-400 to-violet-500",
  violet: "from-violet-400 to-purple-500",
  brown: "from-amber-700 to-orange-800",
  fuchsia: "from-fuchsia-400 to-pink-500",
  lime: "from-lime-400 to-green-500",
};

const colorBgs: Record<string, string> = {
  rose: "bg-rose-50 dark:bg-rose-950/30",
  red: "bg-red-50 dark:bg-red-950/30",
  emerald: "bg-emerald-50 dark:bg-emerald-950/30",
  blue: "bg-blue-50 dark:bg-blue-950/30",
  teal: "bg-teal-50 dark:bg-teal-950/30",
  pink: "bg-pink-50 dark:bg-pink-950/30",
  amber: "bg-amber-50 dark:bg-amber-950/30",
  yellow: "bg-yellow-50 dark:bg-yellow-950/30",
  indigo: "bg-indigo-50 dark:bg-indigo-950/30",
  cyan: "bg-cyan-50 dark:bg-cyan-950/30",
  orange: "bg-orange-50 dark:bg-orange-950/30",
  slate: "bg-slate-50 dark:bg-slate-950/30",
  stone: "bg-stone-50 dark:bg-stone-950/30",
  green: "bg-green-50 dark:bg-green-950/30",
  purple: "bg-purple-50 dark:bg-purple-950/30",
  violet: "bg-violet-50 dark:bg-violet-950/30",
  brown: "bg-amber-50 dark:bg-amber-950/30",
  fuchsia: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
  lime: "bg-lime-50 dark:bg-lime-950/30",
};

const colorTexts: Record<string, string> = {
  rose: "text-rose-600 dark:text-rose-400",
  red: "text-red-600 dark:text-red-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400",
  teal: "text-teal-600 dark:text-teal-400",
  pink: "text-pink-600 dark:text-pink-400",
  amber: "text-amber-600 dark:text-amber-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  orange: "text-orange-600 dark:text-orange-400",
  slate: "text-slate-600 dark:text-slate-400",
  stone: "text-stone-600 dark:text-stone-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  violet: "text-violet-600 dark:text-violet-400",
  brown: "text-amber-700 dark:text-amber-400",
  fuchsia: "text-fuchsia-600 dark:text-fuchsia-400",
  lime: "text-lime-600 dark:text-lime-400",
};

// ─── ALL 25 PROFESSIONS ──────────────────────────────────────────────────────

const PROFESSION_DATA: Record<string, ProfessionData> = {
  medecin: {
    name: "Médecin",
    shortName: "Médecin généraliste ou spécialiste",
    description: "La création d'un cabinet médical est un parcours exigeant qui nécessite d'abord l'obtention du Doctorat en médecine, puis l'inscription au Conseil National de l'Ordre des médecins. En tant que profession libérale réglementée, le médecin doit respecter le code de déontologie médicale, s'inscrire au tableau de l'Ordre, et mettre en place un système de facturation du tiers payant avec l'Assurance Maladie. La convention médicale détermine les tarifs et les conditions d'exercice.",
    icon: "Stethoscope", color: "rose", category: "Santé & Médical",
    authority: "Ordre des médecins / ARS",
    diploma: "Doctorat en médecine (9 ans d'études)",
    requirements: [
      "Doctorat en médecine et DES/DIS de spécialité",
      "Inscription au Conseil National de l'Ordre des médecins",
      "Déclaration d'installation auprès de l'ARS",
      "Adhésion à une caisse de retraite et prévoyance (CARPIMKO)",
      "Souscription d'une assurance RC Professionnelle",
      "Mise en place du tiers payant et télétransmission",
      "Conformité aux normes sanitaires du local professionnel",
      "Respect du code de déontologie médicale"
    ],
    tools: [
      { name: "Doctolib", description: "Gestion de rendez-vous et téléconsultation pour professionnels de santé", category: "Planning", pricing: "Sur devis", rating: 4.8 },
      { name: "Ma Question Santé", description: "Ressources médicales et veille scientifique", category: "Formation", pricing: "Gratuit", rating: 4.5 },
      { name: "Qonto", description: "Compte bancaire professionnel adapté aux professions libérales de santé", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Indy", description: "Comptabilité automatisée pour professions libérales, liée à la CPS", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "Legalstart", description: "Formalités de création de société et documents juridiques", category: "Juridique", pricing: "Sur devis", rating: 4.3 },
      { name: "Hiscox", description: "Assurance RC Professionnelle spécifique aux professionnels de santé", category: "Assurance", pricing: "Sur devis", rating: 4.4 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Un accompagnement personnalisé pour chaque étape de votre installation" },
      { slug: "business-plan", title: "Business Plan", description: "Plan financier détaillé pour votre cabinet médical" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine pour votre cabinet avec prise de RDV en ligne" },
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développement de votre patientèle et visibilité locale" }
    ],
    tips: [
      "Anticipez votre inscription à l'Ordre : le délai peut être de 2 à 4 mois",
      "Choisissez votre zone d'installation en vérifiant la densité médicale (carte de l'ARS)",
      "Investissez dans un logiciel médical certifié (DMP, CPS, télétransmission)",
      "Renseignez-vous sur les aides à l'installation (NACRE, ARC, prêt d'honneur)",
      "Souscrivez une RC Pro adaptée dès le premier jour d'exercice"
    ],
    faq: [
      { q: "Peut-on créer un cabinet médical en société (SELARL, SEP) ?", a: "Oui, les médecins peuvent exercer sous forme de SELARL, SELAS, SEP ou SELAFA. La SELARL est la forme la plus courante. L'avantage principal est la protection du patrimoine personnel. La constitution nécessite l'avis favorable de l'Ordre des médecins." },
      { q: "Quelle assurance est obligatoire pour un médecin ?", a: "L'assurance RC Professionnelle est fortement recommandée et souvent exigée par les conventions. L'assurance décennale n'est pas obligatoire contrairement au BTP. L'assurance multirisque pour le local est recommandée." },
      { q: "Comment obtenir le remboursement du tiers payant ?", a: "Vous devez signer une convention avec l'Assurance Maladie (CPAM), adhérer à un organisme de télétransmission (feuille de soins électronique), et utiliser un logiciel médical certifié. La teletransmission est obligatoire depuis 2017." }
    ]
  },
  infirmier: {
    name: "Infirmier libéral",
    shortName: "Infirmier libéral",
    description: "L'infirmier libéral exerce à son compte, au domicile des patients ou en cabinet. Après l'obtention du Diplôme d'État Infirmier (DEI), il doit s'inscrire au tableau du Conseil départemental de l'Ordre des infirmiers et obtenir un numéro ADELI. La convention avec l'Assurance Maladie régit les tarifs et la prise en charge.",
    icon: "Heart", color: "red", category: "Santé & Médical",
    authority: "Ordre des infirmiers / ARS",
    diploma: "Diplôme d'État Infirmier (DEI - 3 ans)",
    requirements: [
      "Diplôme d'État Infirmier (Bac+3, 3 ans d'études)",
      "Inscription au tableau de l'Ordre des infirmiers",
      "Obtention du numéro ADELI auprès de l'ARS",
      "Souscription assurance RC Professionnelle",
      "Adhésion à la télétransmission FSE",
      "Déclaration d'installation (ARS + Ordre)",
      "Adhésion CARPIMKO (retraite + prévoyance)"
    ],
    tools: [
      { name: "Doctolib", description: "Prise de RDV et gestion de planning infirmier", category: "Planning", pricing: "Sur devis", rating: 4.7 },
      { name: "Maelia", description: "Logiciel de gestion pour infirmiers libéraux", category: "Gestion", pricing: "Sur devis", rating: 4.5 },
      { name: "Indy", description: "Comptabilité simplifiée pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "Qonto", description: "Compte pro avec fonctionnalités de gestion des déplacements", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement de votre installation en libéral" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine digitale et prise de RDV en ligne" },
      { slug: "juridique-ongoing", title: "Juridique & Conformité", description: "Formalités et suivi réglementaire" }
    ],
    tips: [
      "Vérifiez la densité infirmière dans votre zone avant l'installation",
      "Les actes infirmiers sont remboursés à 60% par l'Assurance Maladie",
      "Le statut TNS ou non-TNS a un impact significatif sur vos cotisations sociales",
      "Le démarrage en cabinet de groupe (cabinet pluridisciplinaire) limite les coûts"
    ],
    faq: [
      { q: "Quel est le revenu moyen d'un infirmier libéral ?", a: "Le revenu net moyen d'un infirmier libéral en France est d'environ 35 000 à 45 000\u20AC par an, selon l'activité et la zone d'installation. Les IDE en zone sous-dense peuvent bénéficier d'aides à l'installation supplémentaires." },
      { q: "Peut-on cumuler salariat et libéral ?", a: "Oui, l'exercice mixte est possible sous certaines conditions. Vous devez informer votre employeur et l'Ordre. L'activité libérale ne doit pas concurrencer votre employeur (clause de non-concurrence)." }
    ]
  },
  pharmacien: {
    name: "Pharmacien",
    shortName: "Pharmacien d'officine",
    description: "L'ouverture d'une pharmacie d'officine est l'un des secteurs les plus réglementés en France. Le nombre de pharmacies est limité par le plan de zonage sanitaire. Le pharmacien titulaire doit être diplômé (Doctorat en pharmacie, 6 ans), inscrit à l'Ordre des pharmaciens, et disposer d'une licence d'exploitation délivrée par l'ARS.",
    icon: "Pill", color: "emerald", category: "Santé & Médical",
    authority: "Ordre des pharmaciens / ARS",
    diploma: "Doctorat en pharmacie (6 ans d'études)",
    requirements: [
      "Doctorat en pharmacie (Bac+6)",
      "Inscription à l'Ordre des pharmaciens",
      "Licence d'exploitation délivrée par l'ARS",
      "Respect du plan de zonage sanitaire (densité pharmaceutique)",
      "Capital minimum obligatoire (variable selon la pharmacie)",
      "Certification Qualité conforme aux BPF",
      "Assurance RC Professionnelle obligatoire",
      "Formation continue annuelle obligatoire (100h/3 ans)"
    ],
    tools: [
      { name: "Vidal", description: "Base de données médicamenteuse de référence", category: "Référentiel", pricing: "Sur devis", rating: 4.8 },
      { name: "Phoenix Pharma", description: "Gestion de stock et approvisionnement pharmaceutique", category: "Gestion", pricing: "Sur devis", rating: 4.4 },
      { name: "Pennylane", description: "Comptabilité et gestion financière adaptée aux pharmacies", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 },
      { name: "Hiscox", description: "Assurance RC Pro spécifique pharmacie", category: "Assurance", pricing: "Sur devis", rating: 4.3 }
    ],
    services: [
      { slug: "business-plan", title: "Business Plan", description: "Plan financier détaillé pour le rachat ou la création de pharmacie" },
      { slug: "daf-externalise", title: "DAF Externalisé", description: "Gestion financière et comptable de votre pharmacie" },
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans les démarches de création et rachat" }
    ],
    tips: [
      "Le plan de zonage sanitaire est la contrainte principale : vérifiez qu'une ouverture est possible dans votre zone",
      "Le capital minimum varie selon l'arrêté préfectoral (souvent 40 000\u20AC à 100 000\u20AC+)",
      "Envisagez le rachat d'une officine existante si la création n'est pas possible",
      "Les marges pharmaceutiques sont réglementées : informez-vous sur les réformes en cours"
    ],
    faq: [
      { q: "Combien coûte l'ouverture d'une pharmacie ?", a: "Le budget pour ouvrir une pharmacie varie de 150 000\u20AC (rachat petite officine) à 800 000\u20AC+ (création ou pharmacie de grande surface). Le capital minimum imposé par le préfet varie de 40 000\u20AC à plus de 100 000\u20AC." },
      { q: "Peut-on ouvrir une pharmacie dans une zone de sous-densité ?", a: "Oui, les zones de sous-densité pharmaceutique (ZSD) offrent des conditions d'installation facilitées. L'ARS publie régulièrement la carte de densité. Dans ces zones, certaines aides financières peuvent être accordées." }
    ]
  },
  dentiste: {
    name: "Chirurgien-dentiste",
    shortName: "Chirurgien-dentiste",
    description: "Le chirurgien-dentiste libéral doit obtenir le Doctorat en chirurgie dentaire (6 ans minimum), s'inscrire au tableau de l'Ordre des chirurgiens-dentistes, et respecter les normes sanitaires strictes pour l'exercice. La convention avec la Sécurité Sociale régit les actes remboursables et les dépassements d'honoraires.",
    icon: "Smile", color: "blue", category: "Santé & Médical",
    authority: "Ordre des chirurgiens-dentistes / ARS",
    diploma: "Doctorat en chirurgie dentaire (6 ans)",
    requirements: [
      "Doctorat en chirurgie dentaire (Bac+6)",
      "Inscription à l'Ordre des chirurgiens-dentistes",
      "Conformité du local aux normes sanitaires (radiologie, stérilisation)",
      "Licence d'exploitation de matériel radiologique",
      "Assurance RC Professionnelle obligatoire",
      "Adhésion à la télétransmission FSE",
      "Déclaration d'installation auprès de l'ARS"
    ],
    tools: [
      { name: "Dental Monitoring", description: "Suivi à distance et télésurveillance orthodontique", category: "Innovation", pricing: "Sur devis", rating: 4.6 },
      { name: "Doctolib", description: "Gestion de rendez-vous pour cabinet dentaire", category: "Planning", pricing: "Sur devis", rating: 4.7 },
      { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "Hiscox", description: "Assurance RC Pro chirurgien-dentiste", category: "Assurance", pricing: "Sur devis", rating: 4.4 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement personnalisé pour l'installation" },
      { slug: "business-plan", title: "Business Plan", description: "Plan financier incluant les investissements matériels lourds" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV et présentation des soins" }
    ],
    tips: [
      "L'investissement matériel initial est très élevé (fauteuil, radiographie, stérilisation) : prévoyez 80 000-150 000\u20AC",
      "Respectez scrupuleusement les normes d'hygiène et de stérilisation (contrôles réguliers de l'ARS)",
      "La sectorisation tarifaire vous permet ou non de pratiquer des dépassements d'honoraires",
      "Adhérez à une mutuelle professionnelle pour la prévoyance"
    ],
    faq: [
      { q: "Quel budget pour ouvrir un cabinet dentaire ?", a: "Le budget varie de 100 000\u20AC (reprise de cabinet avec matériel existant) à 300 000\u20AC+ (création avec matériel neuf). Les principaux postes sont le matériel dentaire, les normes d'hygiène, l'aménagement et le fonds de roulement." }
    ]
  },
  kinesitherapeute: {
    name: "Kinésithérapeute",
    shortName: "Masseur-kinésithérapeute",
    description: "Le masseur-kinésithérapeute libéral doit être diplômé (DE MK, 4 ans), inscrit au tableau de l'Ordre et titulaire d'un numéro ADELI. L'exercice libéral nécessite l'installation dans un local conforme et l'adhésion au conventionnement avec l'Assurance Maladie pour le tiers payant.",
    icon: "Activity", color: "teal", category: "Santé & Médical",
    authority: "Ordre des masseurs-kinésithérapeutes / ARS",
    diploma: "DE de masseur-kinésithérapeute (4 ans)",
    requirements: [
      "DE Masseur-kinésithérapeute (Bac+4)",
      "Inscription à l'Ordre des masseurs-kinésithérapeutes",
      "Numéro ADELI auprès de l'ARS",
      "Convention avec l'Assurance Maladie (optionnel mais recommandé)",
      "Assurance RC Professionnelle",
      "Local conforme aux normes d'accessibilité"
    ],
    tools: [
      { name: "Doctolib", description: "Gestion de RDV et téléconsultation", category: "Planning", pricing: "Sur devis", rating: 4.7 },
      { name: "KinePro", description: "Logiciel de gestion de cabinet de kinésithérapie", category: "Gestion", pricing: "Sur devis", rating: 4.3 },
      { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "Qonto", description: "Compte pro avec gestion des notes de frais", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans l'installation et le développement" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec prise de RDV en ligne" }
    ],
    tips: [
      "Le cabinet de groupe (pluridisciplinaire) est une excellente option pour partager les frais",
      "La téléconsultation est possible pour les suivis de rééducation",
      "Le statut TNS (travailleur non salarié) est le plus courant"
    ],
    faq: [
      { q: "Quels actes sont remboursés ?", a: "La Sécurité Sociale rembourse les actes de rééducation prescrits par un médecin. Le kinésithérapeute conventionné est tenu d'appliquer les tarifs conventionnels. Les dépassements sont interdits pour les actes remboursés." }
    ]
  },
  "sage-femme": {
    name: "Sage-femme",
    shortName: "Sage-femme libérale",
    description: "La sage-femme libérale assure le suivi de grossesse, la préparation à l'accouchement, et les soins post-partum. Elle doit être diplômée (DE sage-femme, 5 ans), inscrite à l'Ordre des sages-femmes et obtenir un numéro ADELI.",
    icon: "Baby", color: "pink", category: "Santé & Médical",
    authority: "Ordre des sages-femmes / ARS",
    diploma: "DE de sage-femme (5 ans d'études)",
    requirements: [
      "DE de sage-femme (Bac+5)",
      "Inscription à l'Ordre des sages-femmes",
      "Numéro ADELI auprès de l'ARS",
      "Convention avec l'Assurance Maladie",
      "Assurance RC Professionnelle",
      "Formation continue obligatoire"
    ],
    tools: [
      { name: "Doctolib", description: "Prise de RDV et suivi patientes", category: "Planning", pricing: "Sur devis", rating: 4.7 },
      { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "Qonto", description: "Compte bancaire professionnel", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans l'installation libérale" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine présentant vos services et compétences" }
    ],
    tips: [
      "Le suivi global de grossesse est entièrement remboursé (8 consultations)",
      "Vous pouvez prescrire des examens et certains médicaments",
      "L'installation en maison de naissance est une alternative au cabinet individuel"
    ],
    faq: [
      { q: "Quel est le revenu moyen d'une sage-femme libérale ?", a: "Le revenu net moyen est d'environ 30 000 à 40 000\u20AC par an. L'activité varie selon la zone d'installation et le type de prestations proposées (suivi grossesse, préparation, rééducation périnéale)." }
    ]
  },
  avocat: {
    name: "Avocat",
    shortName: "Avocat au barreau",
    description: "L'avocat est un officier ministériel inscrit à un barreau. Il doit être titulaire du Certificat d'Aptitude à la Profession d'Avocat (CAPA), prêter serment, et s'inscrire au Tableau de l'Ordre. Il peut exercer en cabinet individuel, en SELARL ou en SCP.",
    icon: "Scale", color: "amber", category: "Juridique & Finance",
    authority: "Barreau / Ordre des avocats",
    diploma: "Master 1 juridique + CAPA (1 an)",
    requirements: [
      "Master 1 en droit minimum (Bac+4)",
      "Certificat d'Aptitude à la Profession d'Avocat (CAPA)",
      "Prestation de serment devant la Cour d'appel",
      "Inscription au Tableau de l'Ordre du barreau",
      "Certification de la Caisse des Dépôts pour les fonds clients (CARPA)",
      "Assurance RC Professionnelle obligatoire",
      "Formation continue annuelle (20h minimum)"
    ],
    tools: [
      { name: "Lextenso", description: "Base de données juridique et veille légale", category: "Juridique", pricing: "Sur devis", rating: 4.6 },
      { name: "Case.law", description: "Gestion de cabinet d'avocat, facturation et dossiers", category: "Gestion", pricing: "Sur devis", rating: 4.5 },
      { name: "Pennylane", description: "Comptabilité et facturation pour professions juridiques", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 },
      { name: "Captain Contrat", description: "Génération de contrats et documents juridiques", category: "Juridique", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro avec gestion des fonds clients", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre visibilité et attirer des clients" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site professionnel pour votre cabinet d'avocat" },
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Développement commercial de votre cabinet" },
      { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour les cabinets d'avocats" }
    ],
    tips: [
      "Le réseau et la réputation sont essentiels : investissez dès le début dans votre visibilité",
      "Les niches juridiques (droit du numérique, droit des startups) sont très porteuses",
      "La gestion des fonds clients (CARPA) est strictement réglementée",
      "Envisagez le modèle de la SELARL pour protéger votre patrimoine"
    ],
    faq: [
      { q: "Peut-on créer un cabinet d'avocat sous forme de société ?", a: "Oui, les avocats peuvent créer des SELARL, SELAS, SCP ou SEP. La SELARL est la forme la plus utilisée car elle permet de protéger le patrimoine personnel tout en conservant le bénéfice des honoraires personnels." },
      { q: "Quelle assurance est obligatoire ?", a: "La souscription à une assurance RC Professionnelle est obligatoire pour tous les avocats inscrits au barreau. Elle couvre les erreurs, omissions et négligences dans l'exercice professionnel. Le budget annuel est de 500 à 3 000\u20AC selon la spécialité." }
    ]
  },
  notaire: {
    name: "Notaire",
    shortName: "Notaire",
    description: "Le notaire est un officier public titulaire d'une charge notariale. L'accès à la profession est très réglementé : il nécessite un Master notariat suivi d'un diplôme notarial (DJCN ou DSN) et d'un stage professionnel de 2 ans dans une étude notariale. Les offices notariaux sont soumis à un numerus clausus.",
    icon: "Stamp", color: "yellow", category: "Juridique & Finance",
    authority: "Chambre des notaires / Conseil Supérieur du Notariat",
    diploma: "Master notariat + DJCN/DSN (Bac+8)",
    requirements: [
      "Master 2 en droit notarial ou équivalent",
      "Diplôme de Notaire (DJCN ou DSN)",
      "Stage professionnel de 2 ans en étude notariale",
      "Examen d'aptitude professionnelle",
      "Nomination par le Garde des Sceaux",
      "Serment devant le Tribunal judiciaire",
      "Assurance RC Professionnelle obligatoire",
      "Respect du règlement national du notariat"
    ],
    tools: [
      { name: "Notary++", description: "Solution logicielle complète pour études notariales", category: "Gestion", pricing: "Sur devis", rating: 4.5 },
      { name: "Pennylane", description: "Comptabilité des études notariales", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 },
      { name: "Lextenso", description: "Veille juridique et bases de données notariales", category: "Juridique", pricing: "Sur devis", rating: 4.4 }
    ],
    services: [
      { slug: "business-plan", title: "Business Plan", description: "Plan financier pour la reprise ou la création d'office notarial" },
      { slug: "daf-externalise", title: "DAF Externalisé", description: "Gestion financière de l'étude notariale" }
    ],
    tips: [
      "Le numerus clausus rend la reprise d'office plus accessible que la création",
      "Le coût de reprise d'une étude varie de 200 000\u20AC à plusieurs millions d'euros",
      "Les aides à la reprise existent : prêt d'honneur du Crédit Agricole, aides régionales"
    ],
    faq: [
      { q: "Comment devenir notaire ?", a: "Le parcours est long : Bac+8 minimum (Master 2 notariat), puis 2 ans de stage rémunéré en étude notariale (clerc de notaire), passage du DJCN (Diplôme Supérieur de Notariat) ou du DSN, puis examen d'aptitude professionnelle et nomination par le Garde des Sceaux. Durée totale : 10-12 ans d'études et de stage." }
    ]
  },
  "expert-comptable": {
    name: "Expert-comptable",
    shortName: "Expert-comptable",
    description: "L'expert-comptable est inscrit à l'Ordre des experts-comptables. Il doit être titulaire du DEC (Diplôme d'Expertise Comptable) obtenu après 8 ans d'études. Il peut exercer en cabinet individuel, en SELARL, en SCP ou en SELAS. L'expert-comptable est le partenaire privilégié des TPE/PME pour la gestion comptable, fiscale et sociale.",
    icon: "Calculator", color: "indigo", category: "Juridique & Finance",
    authority: "Ordre des experts-comptables / CNCC",
    diploma: "DEC - Diplôme d'Expertise Comptable (8 ans)",
    requirements: [
      "Diplôme d'Expertise Comptable (DEC) - Bac+8",
      "3 ans de stage professionnel supervisé",
      "Inscription au Tableau de l'Ordre des experts-comptables",
      "Assurance RC Professionnelle obligatoire",
      "Respect du code de déontologie de la profession",
      "Formation continue annuelle obligatoire (40h)",
      "Tenue de la comptabilité selon les normes"
    ],
    tools: [
      { name: "Pennylane", description: "Solution de comptabilité collaborative pour cabinets", category: "Comptabilité", pricing: "Sur devis", rating: 4.7 },
      { name: "Sage", description: "Logiciel de comptabilité et gestion pour cabinets d'expertise comptable", category: "Comptabilité", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro avec synchronisation comptable automatisée", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Hiscox", description: "Assurance RC Pro pour expert-comptable", category: "Assurance", pricing: "Sur devis", rating: 4.3 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développer la clientèle de votre cabinet" },
      { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour attirer des PME clientes" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site professionnel pour votre cabinet" },
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Stratégie de développement de votre cabinet" }
    ],
    tips: [
      "La prospection digitale est le canal d'acquisition le plus efficace pour les jeunes cabinets",
      "Nichez-vous : expertise sectorielle (BTP, restauration, e-commerce) différencie votre cabinet",
      "Le réseau des CES (Conseil de l'Ordre) est un excellent levier de développement"
    ],
    faq: [
      { q: "Comment devenir expert-comptable ?", a: "Le DEC s'obtient en 3 étapes : DCG (3 ans, Bac+3), DSCG (2 ans, Bac+5), puis DEC (stage professionnel de 3 ans). Au total, le parcours dure environ 8 ans. L'admission au DEC nécessite la réussite de 3 épreuves d'examen." }
    ]
  },
  "courtier-assurance": {
    name: "Courtier en assurance",
    shortName: "Courtier en assurance",
    description: "Le courtier en assurance est un intermédiaire d'assurance inscrit à l'ORIAS (Organisme pour le Registre des Intermédiaires en Assurance). Il doit disposer d'une carte professionnelle, d'une garantie financière et d'une assurance RC Professionnelle. Il peut exercer en cabinet individuel ou en société.",
    icon: "ShieldCheck", color: "cyan", category: "Juridique & Finance",
    authority: "ORIAS / ACPR",
    diploma: "Certification professionnelle ou expérience de 4 ans",
    requirements: [
      "Inscription à l'ORIAS (registre obligatoire)",
      "Garantie financière (déposée auprès d'un organisme agréé)",
      "Assurance RC Professionnelle obligatoire",
      "Formation professionnelle initiale (ou expérience de 4 ans minimum)",
      "Formation continue annuelle (15h minimum)",
      "Respect du code des assurances"
    ],
    tools: [
      { name: "Weex", description: "Plateforme de gestion et de comparaison d'assurances", category: "Gestion", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro pour encaisser les commissions", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Indy", description: "Comptabilité simplifiée pour courtiers", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 },
      { name: "HubSpot", description: "CRM pour gérer le portefeuille clients", category: "CRM", pricing: "Sur devis", rating: 4.5 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de clients en ligne" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site de comparaison et prise de contact" },
      { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour le portefeuille clients" }
    ],
    tips: [
      "L'ORIAS est gratuit mais la garantie financière est un coût non négligeable (1 000-5 000\u20AC/an)",
      "Les comparateurs en ligne sont vos concurrents principaux : différenciez-vous par le conseil humain",
      "Le marché de l'assurance B2B est très porteur (assurance responsabilité civile, flotte automobile, multirisque)"
    ],
    faq: [
      { q: "Comment obtenir l'inscription ORIAS ?", a: "L'inscription à l'ORIAS se fait en ligne sur orias.fr. Vous devez fournir un justificatif de compétence (diplôme ou expérience), une attestation de garantie financière et une attestation d'assurance RC Pro. L'inscription est gratuite et valable 1 an (renouvellement annuel)." }
    ]
  },
  "agent-immobilier": {
    name: "Agent immobilier",
    shortName: "Agent immobilier / Négociateur",
    description: "L'agent immobilier doit détenir la carte T (transaction immobilière) délivrée par la préfecture. Cette carte est obtenue après justification d'une capacité professionnelle (diplôme ou expérience) et d'une garantie financière. L'agent peut exercer en indépendant, en franchise ou en agence.",
    icon: "Building2", color: "orange", category: "Juridique & Finance",
    authority: "Préfecture / CCI",
    diploma: "Attestation de capacité professionnelle",
    requirements: [
      "Attestation de capacité professionnelle (diplôme niveau III ou 3 ans d'expérience)",
      "Carte T délivrée par la préfecture (renouvelable tous les 3 ans)",
      "Garantie financière obligatoire (somme variable selon le chiffre d'affaires)",
      "Assurance RC Professionnelle obligatoire",
      "Non-condamnation pénale (casier judiciaire vierge)",
      "Respect de la loi Hoguet (réglementation de la transaction immobilière)"
    ],
    tools: [
      { name: "SeLoger Pro", description: "Portail de diffusion d'annonces immobilières", category: "Marketing", pricing: "Sur devis", rating: 4.5 },
      { name: "ImmoVision", description: "Logiciel de gestion immobilière (mandats, clients, comptes)", category: "Gestion", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour encaisser les frais d'honoraire", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Mailchimp", description: "Emailing pour prospection immobilière", category: "Marketing", pricing: "Gratuit", rating: 4.4 },
      { name: "Canva", description: "Création de visuels pour annonces immobilières", category: "Design", pricing: "Gratuit", rating: 4.7 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Stratégie d'acquisition et visibilité immobilière" },
      { slug: "community-management", title: "Community Management", description: "Animation de vos réseaux sociaux immobiliers" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site immobilier avec portail d'annonces" },
      { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection immobilière ciblée" }
    ],
    tips: [
      "La franchise est un excellent moyen de démarrer avec une marque connue (Century 21, Orpi, etc.)",
      "Investissez dans la photographie professionnelle : c'est le #1 critère de choix pour les acheteurs",
      "Le mandat exclusif vous protège mais le mandat simple élargit votre portefeuille",
      "Google My Business est gratuit et extrêmement efficace en immobilier local"
    ],
    faq: [
      { q: "Comment obtenir la carte T d'agent immobilier ?", a: "La demande se fait auprès de la préfecture de votre département. Vous devez fournir : justificatif de capacité professionnelle (diplôme Bac+2 immobilier ou attestation d'expérience 3 ans), attestation de garantie financière, extrait de casier judiciaire, et justification de l'absence de faillite. Délai : 2-4 mois." }
    ]
  },
  "btp-artisan": {
    name: "Artisan BTP",
    shortName: "Plombier, électricien, maçon",
    description: "L'artisan du BTP est soumis à des obligations réglementaires majeures : inscription à la Chambre des Métiers (ou au Répertoire des Métiers), qualification professionnelle (CAP/BP du métier), et surtout l'assurance décennale OBLIGATOIRE. Sans cette assurance, l'artisan ne peut pas exercer légalement ni obtenir de marché public.",
    icon: "HardHat", color: "yellow", category: "BTP & Construction",
    authority: "Chambre des Métiers / CMA",
    diploma: "CAP ou BP du métier concerné",
    requirements: [
      "Inscription au Répertoire des Métiers (Chambre des Métiers)",
      "Qualification professionnelle (CAP, BP, BTM du métier)",
      "Assurance décennale OBLIGATOIRE (responsabilité civile décennale)",
      "Immatriculation URSSAF (si salariés : déclaration DUE)",
      "Carte BTP (obligatoire pour les chantiers, depuis le 1er janvier 2017)",
      "SIRET et KBIS pour les sociétés",
      "Respect des normes de sécurité sur les chantiers"
    ],
    tools: [
      { name: "Tolteck", description: "Gestion de chantier, devis, factures et planning pour artisans", category: "Gestion", pricing: "Sur devis", rating: 4.6 },
      { name: "Obat", description: "Logiciel de devis et facturation pour artisans du BTP", category: "Comptabilité", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro pour artisans avec gestion des dépenses chantier", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Hiscox", description: "Assurance décennale et RC Pro pour artisans BTP", category: "Assurance", pricing: "Sur devis", rating: 4.3 },
      { name: "Google My Business", description: "Visibilité locale gratuite pour artisans", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement de l'artisan dans le développement" },
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre visibilité locale et attirer des clients" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier sur Google dans votre zone d'intervention" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec devis en ligne et témoignages" }
    ],
    tips: [
      "L'assurance décennale coûte entre 2 000\u20AC et 10 000\u20AC/an selon le métier et le CA",
      "La qualification RGE est un avantage concurrentiel majeur (éco-rénovation)",
      "Les avis Google et les recommandations sont le #1 moteur d'acquisition pour les artisans",
      "Le statut d'auto-entrepreneur est possible mais limite l'assurance décennale pour les chantiers importants"
    ],
    faq: [
      { q: "L'assurance décennale est-elle vraiment obligatoire ?", a: "OUI. Sans assurance décennale, un artisan du BTP ne peut pas légalement exercer pour des travaux de construction, rénovation ou gros oeuvre. Elle couvre les dommages pendant 10 ans après réception des travaux. Sanctions : amende de 75 000\u20AC et 6 mois d'emprisonnement, plus interdiction d'exercer." },
      { q: "Qu'est-ce que la carte BTP ?", a: "La carte d'identification professionnelle BTP est obligatoire depuis le 1er janvier 2017 pour toute intervention sur un chantier de BTP. Elle est délivrée par la CNETP et doit être présentée sur chaque chantier. Elle certifie que l'artisan est immatriculé et assuré." }
    ]
  },
  architecte: {
    name: "Architecte",
    shortName: "Architecte",
    description: "L'architecte doit être inscrit au Tableau de l'Ordre des architectes. Il doit être titulaire du DEA (Diplôme d'Architecte d'État) ou du HMONP (Habilitation à la Maîtrise d'Oeuvre en Nom Propre). La maîtrise d'oeuvre est obligatoire pour les projets soumis à permis de construire de plus de 150m\u00B2.",
    icon: "Compass", color: "slate", category: "BTP & Construction",
    authority: "Ordre des architectes",
    diploma: "DEA / HMONP (Bac+5 minimum)",
    requirements: [
      "Diplôme d'Architecte d'État (DEA) ou HMONP",
      "Inscription au Tableau de l'Ordre des architectes",
      "Assurance décennale obligatoire",
      "Assurance RC Professionnelle obligatoire",
      "Respect de la loi MOP (Maîtrise d'Oeuvre Publique) pour les marchés publics"
    ],
    tools: [
      { name: "ArchiPro", description: "Logiciel de conception et gestion de projets architecturaux", category: "Conception", pricing: "Sur devis", rating: 4.5 },
      { name: "Pennylane", description: "Comptabilité pour agence d'architecture", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 },
      { name: "Qonto", description: "Compte pro pour agence d'architecture", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Visibilité et acquisition de clients pour votre agence" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Portfolio et site vitrine de votre agence" },
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Développement de votre agence d'architecture" }
    ],
    tips: [
      "L'intervention d'un architecte est OBLIGATOIRE pour les projets > 150m\u00B2",
      "Le portfolio est votre meilleur argument commercial : investissez dans la photographie",
      "Les concours d'architecture sont un excellent moyen de se faire connaître"
    ],
    faq: [
      { q: "Quand l'intervention d'un architecte est-elle obligatoire ?", a: "L'architecte est obligatoire pour tout projet soumis à permis de construire dépassant 150m\u00B2 de surface de plancher (depuis le 1er janvier 2023, ce seuil est passé de 150m\u00B2 à 150m\u00B2). En dessous de ce seuil, vous pouvez faire appel à un maître d'oeuvre non architecte ou vous-même." }
    ]
  },
  diagnostiqueur: {
    name: "Diagnostiqueur immobilier",
    shortName: "Diagnostiqueur immobilier",
    description: "Le diagnostiqueur immobilier réalise les diagnostics techniques obligatoires lors d'une transaction immobilière (DPE, amiante, plomb, termites, gaz, électricité). Il doit être certifié par un organisme accrédité par le COFRAC et souscrire une assurance RC Professionnelle.",
    icon: "Search", color: "stone", category: "BTP & Construction",
    authority: "COFRAC / Ministère de la Transition écologique",
    diploma: "Certification par organisme accrédité COFRAC",
    requirements: [
      "Certification par un organisme accrédité par le COFRAC",
      "Compétences validées par examen ou formation agréée",
      "Assurance RC Professionnelle obligatoire",
      "Matériel de diagnostic conforme aux normes en vigueur",
      "Respect des méthodes de mesure réglementaires"
    ],
    tools: [
      { name: "Altéa", description: "Logiciel de rédaction de rapports de diagnostic immobilier", category: "Gestion", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro pour diagnostiqueur indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale pour les diagnostics immobiliers", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être visible localement sur les diagnostics obligatoires" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec tarifaire et zones d'intervention" },
      { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de mandats et partenariats agences" }
    ],
    tips: [
      "Le partenariat avec les agents immobiliers est la source de revenus la plus stable",
      "Multi-certifiez-vous (DPE + amiante + plomb = plus de mandats)",
      "Le marché de la rénovation énergétique booste la demande en DPE"
    ],
    faq: [
      { q: "Quels diagnostics sont obligatoires lors d'une vente ?", a: "Le DPE (Diagnostic de Performance Énergétique) est obligatoire pour toutes les ventes depuis 2023. Selon le logement, d'autres diagnostics peuvent être obligatoires : amiante (avant 1997), plomb (avant 1949), termites (zones infestées), gaz, électricité (installations > 15 ans), état des risques naturels." }
    ]
  },
  "rge-entrepreneur": {
    name: "Entrepreneur RGE",
    shortName: "Entrepreneur RGE (Éco-rénovation)",
    description: "L'entrepreneur RGE (Reconnu Garant de l'Environnement) bénéficie d'une qualification certifiée qui permet à ses clients d'accéder aux aides financières de l'État (MaPrimeRénov', CEE, Éco-PTZ). La certification est délivrée par Qualibat ou Cerqual pour une durée de 3 ans.",
    icon: "Leaf", color: "green", category: "BTP & Construction",
    authority: "Qualibat / Cerqual / France Rénov'",
    diploma: "Qualification RGE (renouvelable tous les 3 ans)",
    requirements: [
      "Qualification ou certification délivrée par un organisme accrédité (Qualibat, Cerqual)",
      "Compétences techniques validées dans le domaine des économies d'énergie",
      "Assurance décennale et RC Professionnelle",
      "Renouvellement de la qualification tous les 3 ans",
      "Respect du cahier des charges RGE"
    ],
    tools: [
      { name: "Tolteck", description: "Gestion de chantier RGE et facturation", category: "Gestion", pricing: "Sur devis", rating: 4.6 },
      { name: "Hiscox", description: "Assurance décennale adaptée aux travaux RGE", category: "Assurance", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro avec suivi des subventions", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale avec badge RGE", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Visibilité RGE et acquisition de clients éco-responsables" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site avec badge RGE et simulateur d'aides financières" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Référencement local pour les travaux d'éco-rénovation" }
    ],
    tips: [
      "Le label RGE est un argument commercial majeur : vos clients accèdent à MaPrimeRénov'",
      "Le marché de la rénovation énergétique est en pleine croissance (objectif neutralité carbone 2050)",
      "Formez-vous en permanence aux nouvelles techniques d'isolation et de chauffage"
    ],
    faq: [
      { q: "Comment obtenir la qualification RGE ?", a: "Vous devez contacter un organisme de qualification accrédité (Qualibat pour le bâtiment, Cerqual pour l'isolation). Le processus inclut : examen des qualifications professionnelles, audit de compétences, et visite d'un chantier. Le coût varie de 500 à 2 000\u20AC selon la qualification. Validité : 3 ans." }
    ]
  },
  restaurateur: {
    name: "Restaurateur",
    shortName: "Restaurateur / Traiteur",
    description: "Le secteur de la restauration est soumis à des règles sanitaires strictes. Tout restaurateur doit avoir suivi une formation en hygiène alimentaire (HACCP), disposer d'une licence de restaurant, et élaborer un plan de maîtrise sanitaire. Les normes d'hygiène sont contrôlées par la DDPP (Direction Départementale de la Protection des Populations).",
    icon: "UtensilsCrossed", color: "orange", category: "Commerce & Alimentation",
    authority: "DDPP / Préfecture",
    diploma: "Formation HACCP obligatoire (non diplômante)",
    requirements: [
      "Formation en hygiène alimentaire HACCP (obligatoire pour le responsable)",
      "Déclaration d'activité auprès de la DDPP",
      "Plan de maîtrise sanitaire (PMS)",
      "Licence de restaurant (obtention gratuite en mairie)",
      "Respect des normes d'hygiène (règlement CE 852/2004)",
      "Installation conforme aux normes ERP (locaux accueillant du public)",
      "Assurance RC Professionnelle",
      "Permis d'exploitation (si vente d'alcool)"
    ],
    tools: [
      { name: "TheFork", description: "Réservation en ligne et visibilité pour restaurants", category: "Réservation", pricing: "Commission sur couverts", rating: 4.5 },
      { name: "Zenply", description: "Gestion de planning et des rotations du personnel", category: "Gestion", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour restaurants avec gestion du fonds de caisse", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Mailchimp", description: "Emailing pour fidéliser la clientèle", category: "Marketing", pricing: "Gratuit", rating: 4.4 },
      { name: "Google My Business", description: "Avis clients et visibilité locale (ESSENTIEL)", category: "Marketing", pricing: "Gratuit", rating: 4.9 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Stratégie de communication et acquisition de clients" },
      { slug: "community-management", title: "Community Management", description: "Instagram, Facebook, TikTok pour votre restaurant" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec menu en ligne et carte interactive" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier sur Google 'restaurant [ville]'" }
    ],
    tips: [
      "Les avis Google sont LE critère #1 pour choisir un restaurant : sollicitez activement vos clients",
      "Instagram est le réseau social le plus puissant pour la restauration",
      "Le menu digital réduit les coûts d'impression et permet les mises à jour instantanées",
      "La livraison (UberEats, Deliveroo) est un complément de revenus mais les commissions sont élevées (25-30%)"
    ],
    faq: [
      { q: "Comment obtenir la licence de restaurant ?", a: "La licence de restaurant est délivrée gratuitement par le maire de la commune où se situe l'établissement. Vous devez en faire la demande auprès de la mairie. La licence est obligatoire pour servir des repas sur place." },
      { q: "Quelle est la formation HACCP ?", a: "La formation HACCP (Hazard Analysis Critical Control Points) est obligatoire pour toute personne responsable de la préparation de denrées alimentaires. Elle dure 1 à 2 jours et coûte 150-400\u20AC. Elle est renouvelable et doit être actualisée régulièrement." }
    ]
  },
  boulanger: {
    name: "Boulanger pâtissier",
    shortName: "Boulanger / Pâtissier",
    description: "Le boulanger-pâtissier artisanal doit être titulaire d'un CAP Boulanger (ou équivalent) et respecter l'appellation 'boulanger' (pétri sur place). L'installation nécessite une déclaration d'activité à la Chambre des Métiers et le respect des normes d'hygiène alimentaire.",
    icon: "Croissant", color: "amber", category: "Commerce & Alimentation",
    authority: "Chambre des Métiers / DDPP",
    diploma: "CAP Boulanger ou CAP Pâtissier",
    requirements: [
      "CAP Boulanger (ou qualification professionnelle équivalente)",
      "Inscription au Répertoire des Métiers (Chambre des Métiers)",
      "Déclaration d'activité auprès de la DDPP",
      "Respect de l'appellation 'boulanger' (pétrissage sur place)",
      "Formation en hygiène alimentaire",
      "Conformité du local aux normes sanitaires et ERP",
      "Assurance RC Professionnelle"
    ],
    tools: [
      { name: "Resengo", description: "Gestion des commandes et click & collect", category: "Ventes", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour boulangerie", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale et avis clients", category: "Marketing", pricing: "Gratuit", rating: 4.8 },
      { name: "Canva", description: "Création de visuels pour réseaux sociaux", category: "Design", pricing: "Gratuit", rating: 4.7 }
    ],
    services: [
      { slug: "community-management", title: "Community Management", description: "Instagram et Facebook pour votre boulangerie" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec catalogue de produits" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Visibilité locale 'boulangerie [ville]'" }
    ],
    tips: [
      "L'appellation 'boulanger' est protégée : le pain doit être pétri, façonné et cuit sur place",
      "Le click & collect et la livraison sont des leviers de croissance importants",
      "Les réseaux sociaux (surtout Instagram) boostent les ventes de pâtisserie"
    ],
    faq: [
      { q: "L'appellation 'boulanger' est-elle protégée ?", a: "Oui, depuis la loi du 25 mai 1998. Pour utiliser l'appellation 'boulanger', vous devez : pétrir la pâte sur place, la façonner et la cuire sur place. La congélation de la pâte est interdite pour un 'véritable boulanger'. La durée de conservation du pain ne doit pas dépasser 24h." }
    ]
  },
  "boucher-charcutier": {
    name: "Boucher charcutier",
    shortName: "Boucher / Charcutier / Traiteur",
    description: "Le boucher-charcutier doit être titulaire d'un CAP Boucher ou CAP Charcutier et respecter les normes sanitaires strictes (agrément sanitaire DSV). L'activité implique la manipulation de denrées animales et nécessite un respect rigoureux de la chaîne du froid et des normes d'hygiène.",
    icon: "Beef", color: "red", category: "Commerce & Alimentation",
    authority: "DSV / DDPP / Chambre des Métiers",
    diploma: "CAP Boucher ou CAP Charcutier Traiteur",
    requirements: [
      "CAP Boucher ou CAP Charcutier Traiteur",
      "Inscription au Répertoire des Métiers",
      "Agrément sanitaire délivré par la DSV",
      "Respect des normes d'hygiène HACCP",
      "Formation en hygiène alimentaire",
      "Installation conforme aux normes sanitaires (chaîne du froid, surfaces lavables)",
      "Assurance RC Professionnelle"
    ],
    tools: [
      { name: "Resengo", description: "Gestion des commandes et click & collect", category: "Ventes", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour boucherie-charcuterie", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "community-management", title: "Community Management", description: "Mettre en valeur vos produits sur les réseaux sociaux" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec vos spécialités" }
    ],
    tips: [
      "La diversification (plats préparés, click & collect, livraison) est clé pour la rentabilité",
      "Les circuits courts et le local sont des arguments commerciaux très forts"
    ],
    faq: [
      { q: "Comment obtenir l'agrément sanitaire ?", a: "L'agrément sanitaire est délivré par la DSV (Direction des Services Vétérinaires) après inspection des locaux. Vous devez justifier de compétences professionnelles et d'une installation conforme aux normes sanitaires (chaîne du froid, surfaces, matériel). Délai : 1-3 mois." }
    ]
  },
  caviste: {
    name: "Caviste",
    shortName: "Caviste / Débit de boissons",
    description: "L'ouverture d'un débit de boissons nécessite une licence délivrée par la préfecture. La licence III autorise la vente à emporter de boissons alcoolisées, la licence IV la consommation sur place. Le vendeur doit avoir suivi une formation EFS (Éducation à la Santé et à la Citoyenneté).",
    icon: "Wine", color: "purple", category: "Commerce & Alimentation",
    authority: "Préfecture / Mairie",
    diploma: "Licence III ou IV + formation EFS",
    requirements: [
      "Licence de débit de boissons (licence III ou IV) délivrée par la préfecture",
      "Formation EFS (Éducation à la Santé et à la Citoyenneté) de 20h",
      "Déclaration en mairie (autorisation d'ouverture d'un ERP)",
      "Permis d'exploitation (si vente d'alcool fort > 15% vol.)",
      "Assurance RC Professionnelle",
      "Respect des horaires d'ouverture et de vente d'alcool"
    ],
    tools: [
      { name: "Google My Business", description: "Visibilité locale essentielle pour un caviste", category: "Marketing", pricing: "Gratuit", rating: 4.8 },
      { name: "Qonto", description: "Compte pro pour caviste", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Mailchimp", description: "Newsletter pour annonces de dégustations et arrivages", category: "Marketing", pricing: "Gratuit", rating: 4.4 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Promotion et événementiel autour de vos vins" },
      { slug: "community-management", title: "Community Management", description: "Instagram pour mettre en avant vos bouteilles" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site e-commerce de vente de vin en ligne" }
    ],
    tips: [
      "La licence IV est plus difficile à obtenir que la licence III (conditions supplémentaires)",
      "Les dégustations et ateliers vin sont des événements très rentables",
      "Le commerce en ligne de vin est un marché en forte croissance"
    ],
    faq: [
      { q: "Quelle est la différence entre licence III et IV ?", a: "La licence III autorise la vente à emporter de boissons à faible taux d'alcool (vin, bière, cidre). La licence IV autorise la vente de toutes les boissons alcoolisées (y compris spiritueux > 15% vol.), y compris pour la consommation sur place. La licence IV est soumise à des conditions plus strictes." }
    ]
  },
  "taxi-vtc": {
    name: "Taxi / VTC",
    shortName: "Chauffeur Taxi / VTC",
    description: "Le transport de personnes par taxi ou VTC est réglementé. Le chauffeur de taxi doit obtenir une carte professionnelle et s'inscrire au registre préfectoral. Le chauffeur VTC doit obtenir une licence de transport et respecter un délai de 15 minutes entre chaque course (règle du temps de course).",
    icon: "Car", color: "violet", category: "Transport & Logistique",
    authority: "Préfecture / DREAL",
    diploma: "Carte professionnelle chauffeur",
    requirements: [
      "Carte professionnelle de chauffeur de taxi ou VTC",
      "Inscription au registre préfectoral des transports",
      "Examen médical de conduite (pour taxi)",
      "Licence de transport (pour VTC)",
      "Assurance RC Professionnelle (obligatoire)",
      "Contrôle technique du véhicule (annuel)",
      "Respect de la réglementation des tarifs (taxi) ou du temps de course (VTC)"
    ],
    tools: [
      { name: "LeCab / Heetch", description: "Plateformes de mise en relation chauffeur-client", category: "Plateforme", pricing: "Commission sur courses", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour chauffeur indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale pour taxi/VTC", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine pour votre service de transport" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être visible localement 'taxi [ville]' ou 'VTC [ville]'" }
    ],
    tips: [
      "Le taxi a l'avantage de la tarification réglementée et de la prise de clients à la station",
      "Le VTC offre plus de flexibilité mais les revenus sont moins stables",
      "Les plateformes (Uber, Bolt) sont des compléments mais ne doivent pas être la source unique de revenus"
    ],
    faq: [
      { q: "Comment obtenir la carte de chauffeur de taxi ?", a: "Vous devez remplir les conditions suivantes : être majeur, avoir le permis B depuis au moins 3 ans, réussir l'examen de la carte professionnelle (formation de 150h si primo-demandeur), passer un examen médical. La carte est délivrée par la préfecture. Coût de la formation : 1 500-3 000\u20AC." }
    ]
  },
  "transporteur-marchandises": {
    name: "Transporteur marchandises",
    shortName: "Transporteur de marchandises",
    description: "Le transporteur de marchandises doit être titulaire d'une licence de transport communautaire délivrée par la DREAL, et d'une attestation de capacité professionnelle. Le transport routier de marchandises est soumis à des règles strictes (temps de conduite, assurance fret, contrôle technique).",
    icon: "Truck", color: "blue", category: "Transport & Logistique",
    authority: "DREAL / Préfecture",
    diploma: "Attestation de capacité professionnelle (LOA)",
    requirements: [
      "Licence communautaire de transport de marchandises (DREAL)",
      "Attestation de capacité professionnelle (LOA)",
      "Assurance marchandises transportées (obligatoire)",
      "Respect de la réglementation sociale européenne (temps de conduite et de repos)",
      "Immatriculation des véhicules (carte grise professionnelle)",
      "Contrôle technique régulier des véhicules",
      "Conformité aux normes d'émissions polluantes (ZFE)"
    ],
    tools: [
      { name: "TNT Express", description: "Solution de gestion de tournées et livraison", category: "Logistique", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro pour transporteur", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Hiscox", description: "Assurance fret et marchandises transportées", category: "Assurance", pricing: "Sur devis", rating: 4.3 }
    ],
    services: [
      { slug: "business-plan", title: "Business Plan", description: "Plan financier pour votre activité de transport" },
      { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans le développement de votre flotte" }
    ],
    tips: [
      "Les Zones à Faibles Émissions (ZFE) contraignent les flottes : investissez dans des véhicules propres",
      "L'affacturage peut aider à gérer les délais de paiement des clients",
      "Le fret collaboratif est une tendance forte pour optimiser les tournées"
    ],
    faq: [
      { q: "Comment obtenir la licence de transport ?", a: "La licence communautaire de transport de marchandises se demande auprès de la DREAL de votre région. Conditions : attestation de capacité professionnelle, capacité financière suffisante, honorabilité. La licence est valable 5 ans. Coût : gratuit." }
    ]
  },
  demenagementur: {
    name: "Déménageur professionnel",
    shortName: "Déménageur professionnel",
    description: "Le déménageur professionnel doit être titulaire d'une carte de déménageur délivrée par la préfecture et d'une attestation de capacité professionnelle. Il doit également disposer d'une garantie responsabilité civile professionnelle et respecter la tarification réglementée.",
    icon: "Box", color: "brown", category: "Transport & Logistique",
    authority: "Préfecture",
    diploma: "Attestation de capacité professionnelle",
    requirements: [
      "Carte de déménageur délivrée par la préfecture",
      "Attestation de capacité professionnelle",
      "Garantie responsabilité civile professionnelle",
      "Assurance des marchandises transportées",
      "Respect de la tarification réglementée (barème kilométrique)",
      "Véhicules adaptés et équipés (hayons élévateurs, couvertures de protection)"
    ],
    tools: [
      { name: "Qonto", description: "Compte pro pour entreprise de déménagement", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale pour déménageur", category: "Marketing", pricing: "Gratuit", rating: 4.8 },
      { name: "Mailchimp", description: "Emailing pour fidéliser les clients", category: "Marketing", pricing: "Gratuit", rating: 4.4 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de clients et visibilité locale" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec simulateur de devis" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'déménageur [ville]'" }
    ],
    tips: [
      "La saisonnalité est forte (juin-septembre = 50% du CA annuel) : anticipez",
      "Le devis gratuit et sur mesure est le principal canal d'acquisition",
      "Les avis Google et les recommandations sont cruciaux dans ce secteur"
    ],
    faq: [
      { q: "Comment obtenir la carte de déménageur ?", a: "La carte de déménageur se demande auprès de la préfecture de votre département. Conditions : attestation de capacité professionnelle, garantie financière, honoration. La carte est valable 5 ans. Délai : 2-3 mois." }
    ]
  },
  coiffeur: {
    name: "Coiffeur barbier",
    shortName: "Coiffeur / Barbier",
    description: "Le coiffeur-barbier doit être titulaire d'un CAP Coiffure et effectuer une déclaration d'activité auprès de la Chambre des Métiers. Pour les barbiers, une formation spécifique à la manipulation du rasoir et des produits sanguins est recommandée. Le local doit respecter les normes d'hygiène et d'accessibilité.",
    icon: "Scissors", color: "fuchsia", category: "Beauté & Bien-être",
    authority: "Chambre des Métiers / DDPP",
    diploma: "CAP Coiffure (2 ans)",
    requirements: [
      "CAP Coiffure (ou qualification professionnelle reconnue)",
      "Déclaration d'activité à la Chambre des Métiers",
      "Formation en hygiène et sécurité (obligatoire)",
      "Formation spécifique barbier (manipulation rasoir, produits sanguins)",
      "Conformité du local aux normes d'hygiène et d'accessibilité (PMR)",
      "Assurance RC Professionnelle",
      "Respect du code du travail (salariés) ou statut d'indépendant"
    ],
    tools: [
      { name: "Resengo", description: "Gestion de rendez-vous en ligne", category: "Planning", pricing: "Sur devis", rating: 4.5 },
      { name: "Qonto", description: "Compte pro pour salon de coiffure", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Avis clients et réservation (ESSENTIEL)", category: "Marketing", pricing: "Gratuit", rating: 4.9 },
      { name: "Canva", description: "Création de visuels pour réseaux sociaux", category: "Design", pricing: "Gratuit", rating: 4.7 }
    ],
    services: [
      { slug: "community-management", title: "Community Management", description: "Instagram et TikTok pour votre salon" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV en ligne" },
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développement de la clientèle du salon" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'coiffeur [ville]'" }
    ],
    tips: [
      "Instagram et TikTok sont LES réseaux sociaux pour un coiffeur : publiez des before/after",
      "La prise de RDV en ligne (Resengo, Treatwell) augmente le taux de remplissage",
      "Les produits de revente (shampooing, soins) sont une source de marge supplémentaire (30-50%)"
    ],
    faq: [
      { q: "Le CAP coiffure est-il obligatoire ?", a: "Pour ouvrir un salon de coiffure en nom propre, le CAP Coiffure n'est pas strictement obligatoire (vous pouvez embaucher un coiffeur diplômé). Cependant, pour coiffer vous-même, le CAP est nécessaire. En franchise, le diplôme est souvent exigé." }
    ]
  },
  estheticienne: {
    name: "Esthéticienne",
    shortName: "Esthéticienne / Prothésiste ongulaire",
    description: "L'esthéticienne doit être titulaire d'un BP Esthétique ou d'un CAP (niveau V). Elle doit effectuer une déclaration d'activité à la Chambre des Métiers et respecter les normes d'hygiène strictes pour les soins du visage, du corps et les techniques de prothèse ongulaire.",
    icon: "Sparkles", color: "rose", category: "Beauté & Bien-être",
    authority: "Chambre des Métiers / DDPP",
    diploma: "BP Esthétique ou CAP Esthétique",
    requirements: [
      "BP Esthétique (2 ans) ou CAP Esthétique (2 ans)",
      "Déclaration d'activité à la Chambre des Métiers",
      "Formation en hygiène et sécurité",
      "Conformité du local aux normes sanitaires et d'accessibilité",
      "Assurance RC Professionnelle",
      "Respect de la réglementation des produits cosmétiques"
    ],
    tools: [
      { name: "Resengo", description: "Gestion de rendez-vous et agenda", category: "Planning", pricing: "Sur devis", rating: 4.4 },
      { name: "Qonto", description: "Compte pro pour institut de beauté", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Avis clients et visibilité locale", category: "Marketing", pricing: "Gratuit", rating: 4.9 }
    ],
    services: [
      { slug: "community-management", title: "Community Management", description: "Instagram pour votre institut de beauté" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV et catalogue de soins" },
      { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition et fidélisation de la clientèle" }
    ],
    tips: [
      "Les soins du visage et la prothèse ongulaire sont les services les plus rentables",
      "La fidélisation est clé : proposez des cartes de fidélité et des forfaits",
      "Instagram Stories est le format le plus engageant pour les instituts"
    ],
    faq: [
      { q: "Quelle différence entre CAP et BP Esthétique ?", a: "Le CAP Esthétique (niveau V, Bac-2) permet les soins de base du visage, du corps et l'épilation. Le BP Esthétique (niveau IV, Bac) est plus complet et inclut en plus la cosmétique appliquée, la maquillage, et les techniques avancées. Le BP ouvre plus de portes pour l'évolution de carrière." }
    ]
  },
  "coach-sportif": {
    name: "Coach sportif",
    shortName: "Coach sportif / Préparateur physique",
    description: "Le coach sportif doit être titulaire d'une certification professionnelle reconnue par l'État (BPJEPS, DEUST STAPS, etc.). Il doit souscrire une assurance RC Professionnelle et respecter le cadre légal de l'enseignement sportif. L'activité peut s'exercer en salle de sport, en extérieur ou en entreprise.",
    icon: "Dumbbell", color: "lime", category: "Beauté & Bien-être",
    authority: "DRJSCS / Préfecture",
    diploma: "BPJEPS ou DEUST STAPS",
    requirements: [
      "Certification professionnelle (BPJEPS, DEUST STAPS, Master entraînement)",
      "Inscription à la préfecture pour l'enseignement sportif",
      "Assurance RC Professionnelle OBLIGATOIRE",
      "Attestation de secourisme (PSC1 recommandé)",
      "Respect du code du sport et de la réglementation de l'enseignement sportif",
      "Déclaration d'activité auto-entrepreneur ou société"
    ],
    tools: [
      { name: "Heitz", description: "Logiciel de gestion et facturation pour coachs sportifs", category: "Gestion", pricing: "Sur devis", rating: 4.3 },
      { name: "Qonto", description: "Compte pro pour coach sportif indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 },
      { name: "Google My Business", description: "Visibilité locale et avis clients", category: "Marketing", pricing: "Gratuit", rating: 4.8 }
    ],
    services: [
      { slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre clientèle de coach sportif" },
      { slug: "community-management", title: "Community Management", description: "Instagram et TikTok pour votre activité de coaching" },
      { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec témoignages et programmes" },
      { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'coach sportif [ville]'" }
    ],
    tips: [
      "La certification BPJEPS APT (activités physiques pour tous) est le minimum requis",
      "Instagram et TikTok sont les meilleurs canaux d'acquisition pour un coach sportif",
      "Le coaching en entreprise (santé au travail) est un marché en forte croissance",
      "Les programmes en ligne (coaching à distance) augmentent votre CA sans augmenter votre temps"
    ],
    faq: [
      { q: "Le coach sportif doit-il obligatoirement être diplômé ?", a: "OUI. L'enseignement sportif contre rémunération est encadré par le code du sport. Vous devez disposer d'une certification professionnelle enregistrée au Répertoire National des Certifications Professionnelles (RNCP) : BPJEPS, DEUST STAPS, Master, ou titre professionnel enregistré." }
    ]
  }
};

// ─── Animation Helpers ────────────────────────────────────────────────────────

function FadeInWhenVisible({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ─── Rating Stars Component ───────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-medium">{rating}</span>
    </div>
  );
}

// ─── Category Badge Colors ────────────────────────────────────────────────────

const categoryBadgeColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Gestion: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Banque: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Comptabilité: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
  Juridique: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Assurance: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  Formation: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  Innovation: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
  Référentiel: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  CRM: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400",
  Marketing: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
  Design: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Réservation: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  Ventes: "bg-lime-100 text-lime-700 dark:bg-lime-950/40 dark:text-lime-400",
  Logistique: "bg-stone-100 text-stone-700 dark:bg-stone-950/40 dark:text-stone-400",
  Conception: "bg-slate-100 text-slate-700 dark:bg-slate-950/40 dark:text-slate-400",
  Plateforme: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfessionDetailPage({ slug }: { slug: string }) {
  const profession = PROFESSION_DATA[slug];

  if (!profession) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Métier non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              Ce métier réglementé n&apos;existe pas dans notre base de données.
            </p>
            <a href="/metiers-reglementes">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux métiers réglementés
              </Button>
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = ICON_MAP[profession.icon] || GraduationCap;
  const gradient = colorGradients[profession.color] || "from-slate-400 to-gray-500";
  const bg = colorBgs[profession.color] || "bg-slate-50";
  const text = colorTexts[profession.color] || "text-slate-600";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══ HERO ═══ */}
        <section className={`relative overflow-hidden ${bg}`}>
          <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Breadcrumb className="mb-8">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">Accueil</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/metiers-reglementes" className="text-muted-foreground hover:text-foreground">Métiers Réglementés</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">{profession.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.nav>

            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
              <motion.div
                className="flex-shrink-0 flex justify-center lg:justify-start mb-6 lg:mb-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl`}>
                  <Icon className="h-12 w-12" />
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Badge variant="secondary" className="mb-4">{profession.category}</Badge>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-2">{profession.name}</h1>
                  <p className={`text-lg ${text} font-medium mb-4`}>{profession.shortName}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl text-base sm:text-lg">{profession.description}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6 flex flex-wrap gap-3">
                  <Badge className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    {profession.authority}
                  </Badge>
                  <Badge className="px-3 py-1.5 text-sm bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                    {profession.diploma}
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EXIGENCES RÉGLEMENTAIRES ═══ */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Exigences réglementaires</h2>
              </div>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
              {profession.requirements.map((req, i) => (
                <motion.div key={i} variants={staggerChild}>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm leading-relaxed">{req}</span>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ OUTILS RECOMMANDÉS ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Outils recommandés</h2>
              </div>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {profession.tools.map((tool, i) => (
                <motion.div key={i} variants={staggerChild}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-bold">{tool.name}</CardTitle>
                        <Badge variant="secondary" className={`text-xs shrink-0 ${categoryBadgeColors[tool.category] || "bg-muted text-muted-foreground"}`}>
                          {tool.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{tool.pricing}</span>
                        <RatingStars rating={tool.rating} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ SERVICES D'ACCOMPAGNEMENT ═══ */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Services d&apos;accompagnement</h2>
              </div>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {profession.services.map((svc, i) => (
                <motion.div key={i} variants={staggerChild}>
                  <Link href={`/accompagnement/${svc.slug}`}>
                    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">{svc.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{svc.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          Découvrir <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ CONSEILS D'EXPERTS ═══ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/40">
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Conseils d&apos;experts</h2>
              </div>
            </FadeInWhenVisible>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
              {profession.tips.map((tip, i) => (
                <motion.div key={i} variants={staggerChild}>
                  <Card className="h-full border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/10">
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{tip}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Questions fréquentes</h2>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {profession.faq.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/95">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 text-center lg:px-8 lg:py-24">
            <FadeInWhenVisible>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Prêt à lancer votre activité de {profession.name.toLowerCase()} ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Notre équipe vous accompagne dans toutes les démarches réglementaires et stratégiques pour démarrer votre activité en toute sérénité.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/audit">
                  <Button size="lg" className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90 shadow-xl gap-2.5">
                    <ClipboardCheck className="h-5 w-5" />
                    Audit Gratuit
                  </Button>
                </a>
                <a href="/accompagnement">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white gap-2.5">
                    <Rocket className="h-5 w-5" />
                    Accompagnement
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Réponse sous 24h
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sans engagement
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Devis gratuit
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
