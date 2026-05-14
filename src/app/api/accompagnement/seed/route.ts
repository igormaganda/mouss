import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SERVICES = [
  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    shortTitle: "Marketing Digital",
    description:
      "Stratégie marketing complète pour développer votre présence en ligne, attirer des prospects et convertir vos visiteurs en clients. Campagnes Google Ads, Meta Ads, emailing automation et analyse des performances.",
    icon: "Megaphone",
    color: "emerald",
    category: "accompagnement",
    targetAudience: "TPE créées < 12 mois",
    pricingType: "monthly",
    priceFrom: 490,
    priceUnit: "/mois",
    features: JSON.stringify([
      "Audit marketing initial complet",
      "Stratégie digitale personnalisée",
      "Gestion de campagnes Google Ads & Meta Ads",
      "Emailing automation et newsletters",
      "Reporting mensuel détaillé",
      "Optimisation continue du ROI",
    ]),
    deliverables: JSON.stringify([
      "Plan marketing sur 3 mois",
      "Campagnes publicitaires configurées et optimisées",
      "Templates d'emails personnalisés",
      "Tableau de bord de suivi KPI",
      "Rapport mensuel d'analyse des performances",
    ]),
    faq: JSON.stringify([
      {
        question: "Combien de temps faut-il pour voir des résultats ?",
        answer:
          "Les premiers résultats apparaissent généralement entre 1 et 3 mois selon le secteur d'activité et la concurrence. Nous mettons en place des quick wins dès le premier mois pour générer du trafic qualifié rapidement.",
      },
      {
        question: "Quel budget publicitaire est nécessaire en plus ?",
        answer:
          "Nous recommandons un budget publicitaire de 300€ à 1500€/mois selon vos objectifs. Ce budget est géré directement sur vos comptes publicitaires et reste entièrement sous votre contrôle.",
      },
      {
        question: "Puis-je changer d'offre en cours de contrat ?",
        answer:
          "Oui, vous pouvez évoluer entre les offres Starter, Growth et Scale à tout moment. Le changement prend effet au début du mois suivant avec une facturation au prorata.",
      },
    ]),
    active: true,
    order: 1,
  },
  {
    slug: "community-management",
    title: "Community Management",
    shortTitle: "Community Management",
    description:
      "Gestion professionnelle de vos réseaux sociaux : création de contenu, engagement communautaire, stratégies de croissance et monitoring de votre e-réputation pour renforcer votre marque employeur et fidéliser votre audience.",
    icon: "Users",
    color: "amber",
    category: "accompagnement",
    targetAudience: "TPE et indépendants",
    pricingType: "monthly",
    priceFrom: 390,
    priceUnit: "/mois",
    features: JSON.stringify([
      "Stratégie éditoriale réseaux sociaux",
      "Création de visuels et contenus originaux",
      "Publication et planification de posts",
      "Modération et engagement communautaire",
      "Veille concurrentielle et tendances",
      "Reporting mensuel d'analyse",
    ]),
    deliverables: JSON.stringify([
      "Calendrier éditorial mensuel",
      "15 à 30 publications par mois selon l'offre",
      "Visuels professionnels et formats vidéo courts",
      "Rapport de performance communautaire",
      "Recommandations stratégiques mensuelles",
    ]),
    faq: JSON.stringify([
      {
        question: "Sur quels réseaux sociaux intervenez-vous ?",
        answer:
          "Nous gérons Instagram, Facebook, LinkedIn, TikTok et X (Twitter). La stratégie est adaptée à votre cible et à votre secteur d'activité pour maximiser l'impact sur les plateformes les plus pertinentes.",
      },
      {
        question: "Fournissez-vous les photos et vidéos ?",
        answer:
          "Nous créons des visuels graphiques professionnels. Pour les photos et vidéos originales, nous pouvons coordonner un shooting ou utiliser du contenu fourni par vos soins. L'offre Scale inclut la création de contenu vidéo court.",
      },
    ]),
    active: true,
    order: 2,
  },
  {
    slug: "supports-communication",
    title: "Supports de Communication",
    shortTitle: "Identité & Supports",
    description:
      "Création de votre identité visuelle complète : logo, charte graphique, cartes de visite, flyers, plaquettes commerciales et tous les supports de communication nécessaires pour profesionaliser votre image de marque.",
    icon: "Palette",
    color: "violet",
    category: "accompagnement",
    targetAudience: "TPE en lancement",
    pricingType: "oneshot",
    priceFrom: 290,
    priceUnit: "one-shot",
    features: JSON.stringify([
      "Création de logo professionnel",
      "Charte graphique complète",
      "Cartes de visite et papeterie",
      "Flyers et brochures commerciales",
      "Kits réseaux sociaux personnalisés",
      "Fichiers sources fournis",
    ]),
    deliverables: JSON.stringify([
      "3 propositions de logo avec modifications",
      "Guide de style et charte graphique",
      "Modèles cartes de visite prêts à imprimer",
      "Flyers et supports imprimables HD",
      "Kit réseaux social (bannières, stories, thumbnails)",
    ]),
    faq: JSON.stringify([
      {
        question: "Combien de allers-retours de modifications ?",
        answer:
          "L'offre inclut 3 allers-retours de modifications sur chaque livrable. Des allers-retours supplémentaires sont facturés 50€ l'unité. L'offre Premium inclut des allers-retours illimités.",
      },
      {
        question: "Les fichiers sont-ils imprimables ?",
        answer:
          "Oui, tous les fichiers sont fournis en haute résolution (300 DPI) aux formats print (PDF, AI) et web (PNG, SVG). Nous pouvons aussi nous charger de l'impression via nos partenaires.",
      },
    ]),
    active: true,
    order: 3,
  },
  {
    slug: "lead-generation",
    title: "Lead Generation B2B",
    shortTitle: "Lead Gen B2B",
    description:
      "Génération de prospects qualifiés B2B grâce au social selling, emailing froid, LinkedIn automation et stratégies inbound marketing. Pipeline de vente alimenté en continu avec des contacts ciblés et qualifiés.",
    icon: "Target",
    color: "rose",
    category: "accompagnement",
    targetAudience: "Prestataires B2B",
    pricingType: "monthly",
    priceFrom: 790,
    priceUnit: "/mois",
    features: JSON.stringify([
      "Ciblage et segmentation de prospects B2B",
      "Campagnes d'emailing froid personnalisées",
      "Social selling LinkedIn automatisé",
      "Création de landing pages optimisées",
      "Nuturing et scoring des leads",
      "CRM et suivi du pipeline commercial",
    ]),
    deliverables: JSON.stringify([
      "Base de prospects qualifiés (50 à 200 contacts/mois)",
      "Séquences email personnalisées",
      "Templates LinkedIn optimisés",
      "Tableau de bord de suivi des conversions",
      "Rapport mensuel de performance lead gen",
    ]),
    faq: JSON.stringify([
      {
        question: "Quel type de prospects allez-vous cibler ?",
        answer:
          "Nous définissons ensemble votre ICP (Ideal Customer Profile) et vos personas. Les prospects sont ciblés selon le secteur, la taille d'entreprise, la fonction du décideur et les critères géographiques que vous définissez.",
      },
      {
        question: "Combien de leads qualifiés puis-je espérer par mois ?",
        answer:
          "Selon votre secteur et votre offre, l'offre Starter génère 20 à 50 leads/mois, Growth 50 à 150 leads/mois et Scale peut atteindre 200 à 500 leads/mois. Un lead est considéré comme qualifié quand il répond à au moins un de vos critères d'engagement.",
      },
      {
        question: "Utilisez-vous des techniques conformes au RGPD ?",
        answer:
          "Absolument. Toutes nos campagnes respectent le RGPD. Nous utilisons uniquement des bases de données légales (B2B légitime, opt-in), les emails incluent un lien de désinscription et nous assurons la traçabilité des consentements.",
      },
    ]),
    active: true,
    order: 4,
  },
  {
    slug: "business-plan",
    title: "Business Plan & Prévisionnel",
    shortTitle: "Business Plan",
    description:
      "Rédaction professionnelle de votre business plan et prévisionnel financier pour convaincre banques, investisseurs et partenaires. Étude de marché, stratégie commerciale, projections financières sur 3 ans et pitch deck.",
    icon: "FileText",
    color: "blue",
    category: "accompagnement",
    targetAudience: "Créateurs en financement",
    pricingType: "oneshot",
    priceFrom: 290,
    priceUnit: "one-shot",
    features: JSON.stringify([
      "Étude de marché approfondie",
      "Analyse stratégique SWOT / PESTEL",
      "Rédaction complète du business plan",
      "Prévisionnel financier sur 3 ans",
      "Pitch deck pour investisseurs",
      "Accompagnement face aux banques",
    ]),
    deliverables: JSON.stringify([
      "Business plan complet (20-40 pages)",
      "Tableaux financiers Excel détaillés",
      "Pitch deck de présentation (15-20 slides)",
      "Synthèse opérationnelle d'une page",
      "Guide de préparation aux entretiens bancaires",
    ]),
    faq: JSON.stringify([
      {
        question: "Combien de temps faut-il pour obtenir le business plan ?",
        answer:
          "Le délai standard est de 2 à 3 semaines après réception de toutes les informations nécessaires. L'offre Express est livrée en 5 jours ouvrés, et l'offre Premium inclut des révisions pendant 6 mois.",
      },
      {
        question: "Puis-je utiliser le business plan pour plusieurs banques ?",
        answer:
          "Oui, le business plan vous appartient et vous pouvez le présenter à autant de banques et investisseurs que vous le souhaitez. Nous adaptons la présentation si nécessaire selon l'interlocuteur.",
      },
    ]),
    active: true,
    order: 5,
  },
  {
    slug: "recouvrement-creances",
    title: "Recouvrement de Créances",
    shortTitle: "Recouvrement",
    description:
      "Service professionnel de recouvrement amiable de vos factures impayées. Lettres de relance, négociation avec les débiteurs, mise en demeure et accompagnement vers les procédures judiciaires si nécessaire. Intervention au succès uniquement.",
    icon: "HandCoins",
    color: "orange",
    category: "accompagnement",
    targetAudience: "TPE avec impayés",
    pricingType: "success",
    priceFrom: 8,
    priceUnit: "% au succès",
    features: JSON.stringify([
      "Relances amiables personnalisées",
      "Négociation avec les débiteurs",
      "Mise en demeure formelle",
      "Suivi juridique des dossiers",
      "Reporting en temps réel des encaissements",
      "Accès au portail de suivi des créances",
    ]),
    deliverables: JSON.stringify([
      "Plan de relance personnalisé",
      "Courriers de mise en demeure",
      "Rapports de suivi mensuels",
      "Accès au tableau de bord de recouvrement",
      "Conseil sur les procédures judiciaires si nécessaire",
    ]),
    faq: JSON.stringify([
      {
        question: "Comment fonctionne la facturation au succès ?",
        answer:
          "Nous prenons un pourcentage sur les montants effectivement recouvrés. Si nous ne recouvrons rien, vous ne payez rien. Le pourcentage varie de 8% à 15% selon le volume des créances et leur ancienneté.",
      },
      {
        question: "Quelle est la durée moyenne de recouvrement ?",
        answer:
          "En moyenne, 60% des dossiers sont résolus en amiable sous 30 jours. Pour les dossiers nécessitant une mise en demeure, comptez 45 à 90 jours. Nous vous tenons informé à chaque étape.",
      },
      {
        question: "Gérez-vous aussi les procédures judiciaires ?",
        answer:
          "Nous préparons le dossier et vous orientons vers nos partenaires huissiers et avocats. Les frais de procédure judiciaire restent à votre charge mais nous négocions des tarifs préférentiels pour nos clients.",
      },
    ]),
    active: true,
    order: 6,
  },
  {
    slug: "copilote-entreprise",
    title: "Copilote Entreprise",
    shortTitle: "Copilote Entreprise",
    description:
      "Coaching opérationnel personnalisé pour dirigeants de TPE/PME. Un expert à vos côtés pour prendre les bonnes décisions, structurer votre activité, optimiser vos processus et accélérer votre croissance avec des sessions régulières et un suivi concret.",
    icon: "Compass",
    color: "teal",
    category: "accompagnement",
    targetAudience: "Tous les dirigeants",
    pricingType: "monthly",
    priceFrom: 490,
    priceUnit: "/mois",
    features: JSON.stringify([
      "Sessions de coaching individuel (2 à 4/mois)",
      "Tableau de bord stratégique personnalisé",
      "Plan d'action opérationnel hebdomadaire",
      "Mise en réseau avec des experts partenaires",
      "Veille sectorielle et recommandations",
      "Support WhatsApp/Email illimité",
    ]),
    deliverables: JSON.stringify([
      "Bilan initial de votre entreprise (360°)",
      "Roadmap stratégique sur 6 mois",
      "Comptes-rendus de chaque session de coaching",
      "Fiches action hebdomadaires concrètes",
      "Bilan trimestriel de progression",
    ]),
    faq: JSON.stringify([
      {
        question: "En quoi le copilote se distille d'un consultant classique ?",
        answer:
          "Le copilote est un accompagnement continu et opérationnel, pas une mission ponctuelle. Il est à vos côtés sur la durée, vous aide au quotidien dans vos décisions et se concentre sur l'exécution concrète plutôt que sur la théorie.",
      },
      {
        question: "Comment se déroulent les sessions de coaching ?",
        answer:
          "Les sessions se déroulent en visioconférence (ou en présentiel selon la formule). Chaque session dure 1h à 1h30 et est structurée autour de vos enjeux du moment avec des objectifs d'action clairs à la fin.",
      },
    ]),
    active: true,
    order: 7,
  },
  {
    slug: "daf-externalise",
    title: "DAF Externalisé",
    shortTitle: "DAF Externalisé",
    description:
      "Direction financière externalisée pour PME : gestion de la trésorerie, reporting financier, pilotage budgétaire, relations avec les banques et optimisation fiscale. Un directeur financier expérimenté à fraction du coût d'un CDI.",
    icon: "TrendingUp",
    color: "emerald",
    category: "accompagnement",
    targetAudience: "PME 10-50 salariés",
    pricingType: "monthly",
    priceFrom: 1490,
    priceUnit: "/mois",
    features: JSON.stringify([
      "Suivi et prévision de trésorerie",
      "Reporting financier mensuel détaillé",
      "Élaboration et suivi budgétaire",
      "Relations bancaires et négociation de financements",
      "Optimisation de la structure fiscale",
      "Pilotage de la performance financière",
    ]),
    deliverables: JSON.stringify([
      "Tableau de bord financier en temps réel",
      "Rapport financier mensuel avec analyses",
      "Prévisions de trésorerie à 3-6 mois",
      "Business case pour les investissements",
      "Fichier de consolidation budgétaire",
      "Dossier de présentation bancaire annuel",
    ]),
    faq: JSON.stringify([
      {
        question: "Pourquoi externaliser la direction financière plutôt que recruter ?",
        answer:
          "Un DAF en CDI coûte entre 80K€ et 120K€/an. Notre service externalisé offre une expertise similaire à partir de 1490€/mois, soit 60% à 80% d'économies. De plus, vous bénéficiez d'une expérience pluri-sectorielle et d'une disponibilité immédiate.",
      },
      {
        question: "Le DAF externalisé remplace-t-il mon expert-comptable ?",
        answer:
          "Non, nous travaillons en complémentarité avec votre expert-comptable. L'expert-comptable gère la comptabilité et la fiscalité, le DAF externalisé se concentre sur le pilotage financier stratégique, la trésorerie et la relation bancaire.",
      },
      {
        question: "Quel est le niveau d'implication requis de ma part ?",
        answer:
          "Nous adaptons notre niveau d'intervention à vos besoins. L'offre Essentiel nécessite peu de votre temps (réunion mensuelle), l'offre Avancée inclut un suivi hebdomadaire et l'offre Premium offre une disponibilité quasi-quotidienne.",
      },
    ]),
    active: true,
    order: 8,
  },
  {
    slug: "seo-referencement",
    title: "SEO & Référencement",
    shortTitle: "SEO & Référencement",
    description:
      "Optimisation de votre référencement naturel pour remonter dans les résultats Google. Audit technique, stratégie de mots-clés, optimisation on-page, création de contenu SEO et link building pour un trafic organique durable et qualifié.",
    icon: "Search",
    color: "amber",
    category: "accompagnement",
    targetAudience: "TPE avec site web",
    pricingType: "mixed",
    priceFrom: 490,
    priceUnit: "",
    features: JSON.stringify([
      "Audit SEO technique et sémantique complet",
      "Recherche de mots-clés stratégiques",
      "Optimisation on-page des pages existantes",
      "Stratégie de contenu SEO éditorial",
      "Campagne de netlinking et backlinks",
      "Suivi de positionnement mensuel",
    ]),
    deliverables: JSON.stringify([
      "Rapport d'audit SEO initial (50+ points)",
      "Stratégie de mots-clés avec volume de recherche",
      "Optimisations techniques appliquées au site",
      "Articles de blog optimisés SEO (2 à 8/mois)",
      "Rapport mensuel de positionnement et trafic",
      "Recommandations de maillage interne",
    ]),
    faq: JSON.stringify([
      {
        question: "En combien de temps vais-je apparaître sur la première page de Google ?",
        answer:
          "Le SEO est un investissement moyen-long terme. Pour des mots-clés peu concurrentiels, des résultats apparaissent en 2 à 4 mois. Pour des requêtes plus compétitives, comptez 6 à 12 mois. Nous mettons en place des actions quick-win dès le premier mois.",
      },
      {
        question: "Dois-je modifier mon site web ?",
        answer:
          "L'audit initial identifie les modifications techniques nécessaires. Selon votre CMS, nous pouvons appliquer les corrections ou fournir des instructions détaillées à votre développeur. L'offre Premium inclut les modifications techniques directement.",
      },
    ]),
    active: true,
    order: 9,
  },
  {
    slug: "creation-site-web",
    title: "Création Site Web",
    shortTitle: "Site Web",
    description:
      "Conception et développement de sites web professionnels, modernes et optimisés pour la conversion. Sites vitrines, e-commerce, landing pages et applications web. Design responsive, SEO-friendly et performant.",
    icon: "Globe",
    color: "violet",
    category: "accompagnement",
    targetAudience: "TPE sans site",
    pricingType: "oneshot",
    priceFrom: 890,
    priceUnit: "one-shot",
    features: JSON.stringify([
      "Design UI/UX personnalisé et moderne",
      "Développement responsive (mobile, tablette, desktop)",
      "Optimisation SEO de base intégrée",
      "Intégration des formulaires et outils marketing",
      "Formation à l'administration du site",
      "Hébergement et maintenance inclus (1 an)",
    ]),
    deliverables: JSON.stringify([
      "Site web fonctionnel et testé",
      "Maquettes validées avant développement",
      "Guide d'utilisation et formation vidéo",
      "Certificat SSL et configuration domaine",
      "3 mois de support technique inclus",
      "Proposition d'évolution à 6 mois",
    ]),
    faq: JSON.stringify([
      {
        question: "Quelle technologie utilisez-vous ?",
        answer:
          "Nous utilisons principalement WordPress (WooCommerce pour l'e-commerce), Webflow ou Next.js selon vos besoins. Le choix de la technologie est fait ensemble lors de la phase de conception pour correspondre à votre projet et votre budget.",
      },
      {
        question: "Le site sera-t-il visible sur mobile ?",
        answer:
          "Oui, tous nos sites sont 100% responsive et optimisés pour tous les écrans. Nous testons sur plus de 20 configurations différentes (iOS, Android, différentes tailles d'écran) avant la mise en ligne.",
      },
      {
        question: "Puis-je modifier le contenu moi-même après la livraison ?",
        answer:
          "Absolument. Nous utilisons des CMS intuitifs et vous formons à l'administration de votre site. Vous pourrez modifier textes, images, produits et pages sans compétences techniques. Un guide vidéo est fourni.",
      },
    ]),
    active: true,
    order: 10,
  },
  {
    slug: "formation",
    title: "Formation & Compétences",
    shortTitle: "Formation",
    description:
      "Formations pratiques et certifiantes pour entrepreneurs et dirigeants. Marketing digital, gestion financière, droit des affaires, management et compétences numériques. Sessions en présentiel, visioconférence ou e-learning.",
    icon: "GraduationCap",
    color: "rose",
    category: "accompagnement",
    targetAudience: "Tous les stades",
    pricingType: "session",
    priceFrom: 49,
    priceUnit: "/session",
    features: JSON.stringify([
      "Formations animées par des experts praticiens",
      "Programmes adaptés aux entrepreneurs",
      "Exercices pratiques et études de cas réels",
      "Attestation de fin de formation",
      "Accès aux ressources et supports pédagogiques",
      "Suivi post-formation de 30 jours",
    ]),
    deliverables: JSON.stringify([
      "Support de cours complet en PDF",
      "Exercices pratiques et templates téléchargeables",
      "Attestation de formation certifiée",
      "Accès à la communauté d'apprenants",
      "Checklists et fiches pratiques",
    ]),
    faq: JSON.stringify([
      {
        question: "Les formations sont-elles éligibles au financement OPCO ?",
        answer:
          "Oui, la plupart de nos formations sont éligibles aux financements OPCO, Pôle Emploi et Région. Nous vous accompagnons dans les démarches administratives de prise en charge. Le financement peut couvrir jusqu'à 100% du coût de la formation.",
      },
      {
        question: "Quels sont les formats de formation disponibles ?",
        answer:
          "Nous proposons 3 formats : sessions en visioconférence (2h à 3h, à partir de 49€), journées complètes en présentiel ou visio (à partir de 290€/jour) et parcours e-learning en autonomie (à partir de 49€ avec accès illimité).",
      },
    ]),
    active: true,
    order: 11,
  },
  {
    slug: "juridique-ongoing",
    title: "Juridique & Conformité",
    shortTitle: "Juridique & Conformité",
    description:
      "Accompagnement juridique continu pour TPE/PME : rédaction de contrats, mise en conformité RGPD, protection de la marque, formalités légales et conseil juridique au quotidien. Un avocat partenaire accessible à tarifs maîtrisés.",
    icon: "Scale",
    color: "teal",
    category: "accompagnement",
    targetAudience: "TPE/PME",
    pricingType: "mixed",
    priceFrom: 89,
    priceUnit: "/doc",
    features: JSON.stringify([
      "Rédaction et révision de contrats",
      "Mise en conformité RGPD complète",
      "Dépôt de marque et propriété intellectuelle",
      "Conseil juridique ponctuel et récurrent",
      "Veille réglementaire sectorielle",
      "Modèles de documents juridiques à jour",
    ]),
    deliverables: JSON.stringify([
      "Documents juridiques personnalisés",
      "Pack conformité RGPD complet",
      "Kit de contrats types pour votre activité",
      "Veille réglementaire mensuelle personnalisée",
      "Fiches pratiques juridiques sectorielles",
    ]),
    faq: JSON.stringify([
      {
        question: "Le service remplace-t-il un avocat ?",
        answer:
          "Notre service couvre 90% des besoins juridiques courants d'une TPE/PME. Pour les litiges complexes ou les procédures contentieuses, nous travaillons en réseau avec des avocats partenaires avec des tarifs négociés pour nos clients.",
      },
      {
        question: "Comment fonctionne le forfait mensuel ?",
        answer:
          "Le forfait mensuel inclut un quota d'heures de conseil (1h à 4h selon l'offre), l'accès à tous nos modèles de contrats, la veille réglementaire et le support par email. Les actes complexes (dépôt de marque, rédaction de contrats spécifiques) sont facturés en supplément à tarif préférentiel.",
      },
      {
        question: "La mise en conformité RGPD est-elle incluse ?",
        answer:
          "L'offre Essential inclut un audit RGPD et les documents de base (mentions légales, politique de confidentialité). Les offres Advanced et Premium incluent la mise en conformité complète : registre des traitements, AIPD, consentements et formation des équipes.",
      },
    ]),
    active: true,
    order: 12,
  },
];

export async function POST() {
  try {
    const existingCount = await db.accompanimentService.count();

    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Des services d'accompagnement existent déjà. Supprimez-les d'abord si vous souhaitez les réinitialiser.",
          existingCount,
        },
        { status: 409 }
      );
    }

    const result = await db.$transaction(
      SERVICES.map((service) =>
        db.accompanimentService.create({
          data: service,
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.length} services d'accompagnement créés avec succès`,
        servicesCreated: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Accompaniment service seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des services d'accompagnement" },
      { status: 500 }
    );
  }
}
