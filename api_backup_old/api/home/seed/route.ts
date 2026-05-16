import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const sectionsData = [
  {
    type: "hero",
    title: "",
    subtitle: "",
    badge: "Le Media B2B référence pour les entrepreneurs",
    order: 0,
    settings: JSON.stringify({
      headline: "Votre guide complet pour entreprendre en 100 jours",
      headlineHighlight: "entreprendre",
      subheadline:
        "Comparez les meilleures solutions, suivez votre roadmap et recevez un audit personnalisé pour lancer votre activité avec confiance.",
      cta1: { text: "Générer mon audit gratuit", url: "#audit", icon: "Sparkles" },
      cta2: { text: "Découvrir nos solutions", url: "/profils", icon: "ArrowDown" },
    }),
    items: [
      { label: "50 000+", content: "Entrepreneurs accompagnés", icon: "Users", order: 0 },
      { label: "200+", content: "Solutions comparées", icon: "TrendingUp", order: 1 },
      { label: "4.8/5", content: "Satisfaction moyenne", icon: "ShieldCheck", order: 2 },
    ],
  },
  {
    type: "profiles",
    title: "Quel entrepreneur êtes-vous ?",
    subtitle:
      "Les besoins juridiques et bancaires diffèrent radicalement selon votre profil. Identifiez le vôtre pour recevoir des recommandations ciblées.",
    badge: "Votre Profil",
    order: 1,
    settings: null,
    items: [
      {
        label: "L'Étudiant Entrepreneur",
        content: "Étudier et entreprendre en parallèle. Bénéficiez du statut d'auto-entrepreneur ou étudiant-entrepreneur pour lancer votre premier projet sans risque financier.",
        icon: "GraduationCap",
        color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
        data: JSON.stringify({
          tagline: "Étudier & entreprendre",
          solutions: ["Auto-entrepreneur gratuit", "Abby (compta gratuite)", "Indy Basic (gratuit)", "ACRE (exonération charges)"],
          needs: ["Statut juridique simple", "Coût réduit", "Flexibilité horaires"],
        }),
        order: 0,
      },
      {
        label: "Le Salarié en Transition",
        content: "Sécuriser le lancement avant de quitter son poste ou cumuler les deux activités. Anticipez les impacts fiscaux et optimisez votre transition.",
        icon: "Briefcase",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        data: JSON.stringify({
          tagline: "Sécuriser & transitionner",
          solutions: ["Cumul emploi + auto-entrepreneur", "Simulation impact fiscal", "Assurance perte d'emploi", "Accompagnement juridique"],
          needs: ["Sécurité financière", "Conseil juridique", "Simulation revenus"],
        }),
        order: 1,
      },
      {
        label: "Le Freelance / Auto-entrepreneur",
        content: "Besoin de simplicité et de gratuité pour démarrer. Concentrez-vous sur votre activité grâce aux outils automatisés et gratuits.",
        icon: "Laptop",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        data: JSON.stringify({
          tagline: "Simplicité & efficacité",
          solutions: ["Indy Basic (gratuit)", "Abby (gratuit)", "Shine par Qonto (gratuit)", "Tiime (gratuit)"],
          needs: ["Gratuité", "Automatisation", "Interface simple"],
        }),
        order: 2,
      },
      {
        label: "La TPE / PME",
        content: "Besoin de gestion d'équipe et de flux complexes. Équipez votre entreprise avec des outils professionnels adaptés à votre taille.",
        icon: "Building2",
        color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        data: JSON.stringify({
          tagline: "Gestion & performance",
          solutions: ["Qonto Business", "Pennylane (compta complète)", "HubSpot CRM (gratuit)", "PayFit (paie)"],
          needs: ["Gestion d'équipe", "Comptabilité avancée", "Outils collaboratifs"],
        }),
        order: 3,
      },
    ],
  },
  {
    type: "pain_points",
    title: "Quelle est votre plus grande difficulté ?",
    subtitle:
      "Cibler votre frustration nous permet de vous orienter vers la solution la plus pertinente. Pas de perte de temps, juste des résultats concrets.",
    badge: "Vos Frustrations",
    order: 2,
    settings: null,
    items: [
      {
        label: "Je suis perdu dans l'administratif",
        content: "Trop de démarches, trop de jargon, trop de paperasse. Trouvez votre chemin avec notre guide structuré.",
        icon: "FileQuestion",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        data: JSON.stringify({
          solutions: ["Création clé en main en ligne", "Guides pas-à-pas par statut", "Assistance juridique illimitée", "Templates de documents"],
          affiliatePartners: ["Legalstart", "Captain Contrat"],
        }),
        order: 0,
      },
      {
        label: "Mes frais bancaires sont trop élevés",
        content: "Les banques traditionnelles prélèvent des frais disproportionnés. Comparez les offres gratuites et sans conditions.",
        icon: "Wallet",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        data: JSON.stringify({
          solutions: ["Comparatif des banques pro gratuites", "Carte CB sans frais à l'étranger", "Virements SEPA gratuits et illimités", "Sous-comptes et budget intelligent"],
          affiliatePartners: ["Qonto", "Shine", "N26 Business"],
        }),
        order: 1,
      },
      {
        label: "Je n'ai pas le temps pour ma compta",
        content: "La compta vous fait perdre des heures précieuses. Automatisez-la grâce à la synchronisation bancaire intelligente.",
        icon: "Calculator",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        data: JSON.stringify({
          solutions: ["Synchronisation bancaire automatique", "Catégorisation intelligente des écritures", "Déclarations URSSAF automatiques", "Bilan et compte de résultat en 1 clic"],
          affiliatePartners: ["Indy", "Tiime", "Freebe"],
        }),
        order: 2,
      },
      {
        label: "Je crains les risques juridiques",
        content: "Une erreur juridique peut coûter cher. Protégez votre activité avec les assurances adaptées à votre métier.",
        icon: "ShieldAlert",
        color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        data: JSON.stringify({
          solutions: ["RC Pro par métier (VTC, IT, Artisan)", "Mutuelle TNS & prévoyance", "Assurance décennale obligatoire", "Protection juridique entreprise"],
          affiliatePartners: ["Hiscox", "Simplit", "Abeille Assurances"],
        }),
        order: 3,
      },
    ],
  },
  {
    type: "thematic",
    title: "Explorez par thématique",
    subtitle:
      "Vous avez déjà un besoin précis ? Accédez directement à nos guides et comparatifs classés par thématique.",
    badge: "Navigation Thématique",
    order: 3,
    settings: null,
    items: [
      {
        label: "Création d'entreprise",
        content: "Choisissez votre statut juridique (SASU, EURL, SARL, auto-entrepreneur) et lancez votre activité en quelques jours.",
        icon: "Building",
        color: "from-emerald-500 to-emerald-700",
        data: JSON.stringify({ items: ["Comparatif des statuts juridiques", "Guide immatriculation en ligne", "Documents constitutifs", "Kbis et extrait d'immatriculation"], bgColor: "bg-emerald-50 dark:bg-emerald-950/30", iconColor: "text-emerald-600 dark:text-emerald-400", category: "legal", categoryLabel: "Création d'entreprise", categoryColor: "emerald" }),
        order: 0,
      },
      {
        label: "Banque & Finance",
        content: "Comparez les comptes pro, terminaux de paiement et prêts professionnels pour optimiser vos finances.",
        icon: "Landmark",
        color: "from-amber-500 to-amber-700",
        data: JSON.stringify({ items: ["Comparatif banques pro en ligne", "Terminal de paiement sans engagement", "Prêt professionnel & crédit", "Financement participatif"], bgColor: "bg-amber-50 dark:bg-amber-950/30", iconColor: "text-amber-600 dark:text-amber-400", category: "bank", categoryLabel: "Banque & Finance", categoryColor: "amber" }),
        order: 1,
      },
      {
        label: "Comptabilité & Facturation",
        content: "Logiciels de paie, gestion des notes de frais et expert-comptable en ligne pour une compta sans prise de tête.",
        icon: "Receipt",
        color: "from-sky-500 to-sky-700",
        data: JSON.stringify({ items: ["Logiciels de comptabilité", "Facturation et relances automatisées", "Gestion des notes de frais", "Expert-comptable en ligne"], bgColor: "bg-sky-50 dark:bg-sky-950/30", iconColor: "text-sky-600 dark:text-sky-400", category: "compta", categoryLabel: "Comptabilité & Facturation", categoryColor: "sky" }),
        order: 2,
      },
      {
        label: "Assurances",
        content: "RC Pro, mutuelle TNS, prévoyance et assurance décennale : protégez votre activité selon votre métier.",
        icon: "Shield",
        color: "from-rose-500 to-rose-700",
        data: JSON.stringify({ items: ["RC Pro par métier (VTC, IT, BTP)", "Mutuelle TNS & prévoyance", "Assurance décennale obligatoire", "Comparatif des offres"], bgColor: "bg-rose-50 dark:bg-rose-950/30", iconColor: "text-rose-600 dark:text-rose-400", category: "assurance", categoryLabel: "Assurances", categoryColor: "rose" }),
        order: 3,
      },
      {
        label: "Juridique",
        content: "Contrats, mentions légales, protection de marque : tous les outils pour être en règle et protéger votre activité.",
        icon: "Scale",
        color: "from-violet-500 to-violet-700",
        data: JSON.stringify({ items: ["Générateur de contrats", "Mentions légales et CGV", "Dépôt de marque", "Protection de la propriété intellectuelle"], bgColor: "bg-violet-50 dark:bg-violet-950/30", iconColor: "text-violet-600 dark:text-violet-400", category: "legal", categoryLabel: "Juridique", categoryColor: "violet" }),
        order: 4,
      },
      {
        label: "Marketing & CRM",
        content: "Email marketing, CRM, automation et outils de croissance pour attirer et fidéliser vos clients.",
        icon: "Megaphone",
        color: "from-orange-500 to-orange-700",
        data: JSON.stringify({ items: ["Email marketing & newsletters", "CRM pour gérer vos prospects", "Automatisation marketing", "Campagnes publicitaires"], bgColor: "bg-orange-50 dark:bg-orange-950/30", iconColor: "text-orange-600 dark:text-orange-400", category: "marketing", categoryLabel: "Marketing", categoryColor: "orange" }),
        order: 5,
      },
    ],
  },
  {
    type: "roadmap",
    title: "Votre parcours, étape par étape",
    subtitle:
      "Suivez notre guide structuré en 4 phases pour passer de l'idée à la création, puis à la croissance de votre entreprise.",
    badge: "Roadmap des 100 Jours",
    order: 4,
    settings: null,
    items: [
      {
        label: "Phase de Réflexion",
        content: "Je cherche mon idée ou je valide mon business model. Trouvez votre concept, testez votre marché et structurez votre projet.",
        icon: "Lightbulb",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        data: JSON.stringify({ days: "J1 - J15", solutions: [{ name: "Outils de Business Plan", partner: "WiziShop" }, { name: "Simulateurs de Revenus", partner: "Le Coin des Entrepreneurs" }, { name: "Étude de Marché", partner: "Statista" }] }),
        order: 0,
      },
      {
        label: "Phase de Création",
        content: "Je lance les démarches administratives. Choisissez votre statut juridique et immatriculez votre entreprise en ligne.",
        icon: "FileText",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        data: JSON.stringify({ days: "J31 - J60", solutions: [{ name: "Immatriculation en ligne", partner: "Legalstart" }, { name: "Documents juridiques", partner: "Captain Contrat" }, { name: "Création SASU / SARL", partner: "LegalPlace" }] }),
        order: 1,
      },
      {
        label: "Phase de Gestion",
        content: "J'optimise mon organisation et ma compta. Automatisez votre comptabilité et simplifiez votre quotidien.",
        icon: "Settings",
        color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        data: JSON.stringify({ days: "J61 - J80", solutions: [{ name: "Banque pro en ligne", partner: "Qonto" }, { name: "Comptabilité automatisée", partner: "Indy" }, { name: "Facturation & Compta", partner: "Pennylane" }] }),
        order: 2,
      },
      {
        label: "Phase de Croissance",
        content: "Je veux accélérer mon impact. Recrutez, automatisez votre marketing et développez votre chiffre d'affaires.",
        icon: "Rocket",
        color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
        data: JSON.stringify({ days: "J81 - J100", solutions: [{ name: "CRM & Pipeline", partner: "HubSpot" }, { name: "Recrutement", partner: "Welcome to the Jungle" }, { name: "Marketing automation", partner: "Brevo" }] }),
        order: 3,
      },
    ],
  },
  {
    type: "audit",
    title: "Générez votre Audit de Lancement Gratuit",
    subtitle:
      "En 2 minutes, nous analysons votre situation et vous recommandons le pack optimal (Banque + Compta + Assurance) adapté à votre profil.",
    badge: "Gratuit & Personnalisé",
    order: 5,
    settings: JSON.stringify({
      cta: "Commencer mon audit gratuit",
      features: [
        { icon: "ClipboardCheck", title: "Analyse personnalisée", desc: "Basée sur votre profil" },
        { icon: "Sparkles", title: "Recommandations ciblées", desc: "Banque + Compta + Assurance" },
        { icon: "Mail", title: "Résultats par email", desc: "Audit complet en PDF" },
      ],
    }),
    items: [],
  },
  {
    type: "testimonials",
    title: "Ils ont lancé leur entreprise grâce à nous",
    subtitle:
      "Découvrez les témoignages de nos entrepreneurs qui ont réussi leur lancement en 100 jours.",
    badge: "Témoignages",
    order: 6,
    settings: null,
    items: [
      {
        label: "Sophie Martin",
        content: "Grâce à Créa Entreprise, j'ai trouvé la banque pro idéale et lancé mon auto-entreprise en 2 semaines. L'audit m'a fait gagner un temps précieux !",
        icon: "Star",
        data: JSON.stringify({ role: "Auto-entrepreneuse", company: "Sophie Design", rating: 5 }),
        order: 0,
      },
      {
        label: "Thomas Dubois",
        content: "Le comparatif d'assurances m'a permis d'économiser 120€/mois sur ma RC Pro. Un outil indispensable pour tout entrepreneur.",
        icon: "Star",
        data: JSON.stringify({ role: "Consultant IT freelance", company: "TD Consulting", rating: 5 }),
        order: 1,
      },
      {
        label: "Marie Lefebvre",
        content: "En tant que TPE, on perd un temps fou sur l'administratif. La roadmap m'a permis de structurer mon lancement étape par étape.",
        icon: "Star",
        data: JSON.stringify({ role: "Fondatrice", company: "ML Conseil", rating: 5 }),
        order: 2,
      },
      {
        label: "Alexandre Chen",
        content: "J'étais salarié et je voulais me lancer. Les outils recommandés m'ont permis de cumuler les deux activités en toute sécurité.",
        icon: "Star",
        data: JSON.stringify({ role: "Salarié-entrepreneur", company: "AlexDev", rating: 4 }),
        order: 3,
      },
    ],
  },
  {
    type: "faq",
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir pour bien démarrer votre aventure entrepreneuriale.",
    badge: "FAQ",
    order: 7,
    settings: null,
    items: [
      {
        label: "Comment fonctionne l'audit gratuit ?",
        content: "L'audit se compose de 4 questions rapides : votre profil entrepreneur, votre phase de projet, votre principale difficulté et vos coordonnées. En 2 minutes, vous recevez par email des recommandations personnalisées pour Banque, Comptabilité et Assurance.",
        order: 0,
      },
      {
        label: "Les services recommandés sont-ils gratuits ?",
        content: "Nous comparons des solutions gratuites et payantes. Plusieurs de nos partenaires proposent des offres gratuites (Qonto Shine, Indy Basic, Abby...). Chaque recommandation indique clairement le niveau de prix.",
        order: 1,
      },
      {
        label: "Comment choisir son statut juridique ?",
        content: "Le choix dépend de votre activité, vos revenus prévisionnels et votre situation personnelle. Notre section Création d'entreprise compare SASU, SARL, EURL et auto-entrepreneur avec leurs avantages et inconvénients respectifs.",
        order: 2,
      },
      {
        label: "Quels sont les packs d'accompagnement ?",
        content: "Nous proposons 4 packs : Découverte (gratuit), Entrepreneur (19€/mois), Business (39€/mois) et Premium (79€/mois). Chaque pack inclut un niveau d'accès différent à nos outils, comparatifs et accompagnement personnalisé.",
        order: 3,
      },
      {
        label: "Comment annuler mon abonnement ?",
        content: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. L'annulation prend effet à la fin de la période en cours. Aucun frais d'annulation ne sera appliqué.",
        order: 4,
      },
      {
        label: "Mes données personnelles sont-elles protégées ?",
        content: "Oui. Nous respectons le RGPD. Vos données ne sont jamais vendues à des tiers. Elles servent uniquement à vous fournir des recommandations pertinentes et à améliorer nos services.",
        order: 5,
      },
    ],
  },
  {
    type: "newsletter",
    title: "Recevez nos guides exclusifs",
    subtitle:
      "Inscrivez-vous à notre newsletter et recevez chaque semaine des conseils pratiques, des comparatifs et des offres exclusives pour entrepreneurs.",
    badge: "Newsletter",
    order: 8,
    settings: JSON.stringify({
      placeholder: "votre@email.com",
      ctaText: "S'inscrire gratuitement",
      description: "Rejoignez +5 000 entrepreneurs qui reçoivent nos conseils chaque semaine. Désabonnement en 1 clic.",
    }),
    items: [],
  },
  {
    type: "social_proof",
    title: "Nos partenaires de confiance",
    subtitle: "Nous travaillons avec les meilleures solutions du marché pour vous offrir des recommandations de qualité.",
    badge: "Partenaires",
    order: 9,
    settings: null,
    items: [
      { label: "Qonto", icon: "Landmark", order: 0 },
      { label: "Indy", icon: "Calculator", order: 1 },
      { label: "Pennylane", icon: "Receipt", order: 2 },
      { label: "Legalstart", icon: "FileText", order: 3 },
      { label: "Captain Contrat", icon: "Scale", order: 4 },
      { label: "Hiscox", icon: "Shield", order: 5 },
      { label: "HubSpot", icon: "Users", order: 6 },
      { label: "Brevo", icon: "Megaphone", order: 7 },
    ],
  },
];

export async function POST() {
  try {
    const results = [];

    for (const sectionData of sectionsData) {
      // Upsert section
      const section = await db.homeSection.upsert({
        where: { type: sectionData.type },
        update: {
          title: sectionData.title,
          subtitle: sectionData.subtitle,
          badge: sectionData.badge,
          order: sectionData.order,
          settings: sectionData.settings,
        },
        create: {
          type: sectionData.type,
          title: sectionData.title,
          subtitle: sectionData.subtitle,
          badge: sectionData.badge,
          order: sectionData.order,
          settings: sectionData.settings,
        },
      });

      // Delete existing items and recreate
      await db.homeSectionItem.deleteMany({
        where: { sectionId: section.id },
      });

      // Create new items
      if (sectionData.items && sectionData.items.length > 0) {
        for (const itemData of sectionData.items) {
          await db.homeSectionItem.create({
            data: {
              sectionId: section.id,
              label: itemData.label,
              content: itemData.content || null,
              icon: itemData.icon || null,
              color: itemData.color || null,
              data: itemData.data || null,
              active: true,
              order: itemData.order ?? 0,
            },
          });
        }
      }

      results.push({
        type: sectionData.type,
        id: section.id,
        itemCount: sectionData.items?.length ?? 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${results.length} sections`,
      sections: results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seed" },
      { status: 500 }
    );
  }
}
