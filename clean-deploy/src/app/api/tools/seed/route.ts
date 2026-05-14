import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST() {
  try {
    // Check existing tools to avoid duplicates
    const existingTools = await db.tool.findMany({
      select: { slug: true, name: true },
    });
    const existingSlugs = new Set(existingTools.map((t) => t.slug));
    const existingNames = new Set(existingTools.map((t) => t.name.toLowerCase()));

    const toolsToSeed = [
      // ─── Banque/Business ─────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Blank",
        slug: "blank",
        tagline: "La banque pro nouvelle génération",
        description:
          "Blank réinvente la banque professionnelle avec une approche 100% mobile et sans frais cachés. Idéal pour les auto-entrepreneurs et TPE qui veulent une gestion financière simple et moderne. Ouverture de compte en quelques minutes depuis votre smartphone.",
        website: "https://www.blank.app",
        category: "bank",
        pricing: "gratuit",
        rating: 4.3,
        commission: 15,
        pros: "Ouverture rapide en ligne,Frais bancaires réduits,Application mobile intuitive,Carte Mastercard incluse",
        cons: "Fonctionnalités avancées limitées,Pas de crédit pro disponible",
        features: "Compte pro sans conditions,Carte bancaire virtuelle et physique,Virements SEPA instantanés,Catégorisation automatique,Notifications en temps réel",
        order: 13,
      },
      {
        id: randomUUID(),
        name: "Nickel Business",
        slug: "nickel-business",
        tagline: "Le compte pro sans conditions",
        description:
          "Nickel Business propose un compte professionnel accessible à tous, sans conditions de revenus ni de durée d'activité. Parfait pour les micro-entrepreneurs et les créateurs d'entreprise qui cherchent une solution bancaire simple et économique.",
        website: "https://www.nickel.fr",
        category: "bank",
        pricing: "gratuit",
        rating: 3.6,
        commission: 10,
        pros: "Sans conditions d'éligibilité,Frais fixes transparents,Réseau de points Nickel,Idéal pour débuter",
        cons: "Fonctionnalités basiques,Pas d'accompagnement pro,Service client parfois lent",
        features: "Compte pro sans justificatif,Carte Visa incluse,Retraits distributeurs gratuits,Frais de gestion réduits,Application mobile Nickel",
        order: 14,
      },
      {
        id: randomUUID(),
        name: "Memo Bank",
        slug: "memo-bank",
        tagline: "La banque des PME et ETI",
        description:
          "Memo Bank accompagne les PME et ETI avec une offre bancaire complète adaptée à leurs besoins spécifiques. Crédit, financement et gestion de trésorerie sont pensés pour soutenir la croissance des entreprises de taille intermédiaire.",
        website: "https://www.memo.bank",
        category: "bank",
        pricing: "payant",
        rating: 4.1,
        commission: 30,
        pros: "Solutions de crédit adaptées,Accompagnement personnalisé,Outils de trésorerie avancés,Idéal pour PME en croissance",
        cons: "Tarifs élevés pour micro-entreprises,Ouverture plus longue,Moins adapté aux auto-entrepreneurs",
        features: "Crédit professionnel,Taux préférentiels,Gestion de trésorerie,Tableau de bord analytique,Interlocuteur dédié",
        order: 15,
      },
      {
        id: randomUUID(),
        name: "Lydia Pro",
        slug: "lydia-pro",
        tagline: "Paiements et gestion pour pros",
        description:
          "Lydia Pro offre une solution de paiement et de gestion financière pensée pour les indépendants et petites entreprises. Avec son interface intuitive, gérez facilement vos encaissements, notes de frais et paiements au quotidien.",
        website: "https://pro.lydia-app.com",
        category: "bank",
        pricing: "freemium",
        rating: 3.9,
        commission: 12,
        pros: "Interface très intuitive,Paiement mobile rapide,Bon rapport qualité-prix,Idéal pour les artisans",
        cons: "Fonctionnalités comptables limitées,Pas de virement SEPA sortant dans la version gratuite",
        features: "Paiement par lien,NFC et QR code,Gestion des notes de frais,Multi-utilisateurs,Export comptable",
        order: 16,
      },

      // ─── Comptabilité ────────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Pennylane",
        slug: "pennylane",
        tagline: "La comptabilité pour les TPE/PME",
        description:
          "Pennylane transforme la comptabilité des TPE/PME en une expérience fluide et collaborative. Connectez votre banque, automatisez vos écritures et collaborez en temps réel avec votre expert-comptable pour une gestion financière simplifiée.",
        website: "https://www.pennylane.com",
        category: "compta",
        pricing: "payant",
        rating: 4.6,
        commission: 25,
        pros: "Automatisation des écritures,Interface moderne et intuitive,Collaboration avec l'expert-comptable,Nombreuses intégrations",
        cons: "Tarifs qui montent avec les fonctionnalités,Courbe d'apprentissage pour les novices",
        features: "Synchronisation bancaire automatique,Facturation intégrée,Gestion des notes de frais,Tableau de bord financier,Export TB et liasse fiscale",
        order: 17,
      },
      {
        id: randomUUID(),
        name: "Dougs",
        slug: "dougs",
        tagline: "L'expert-comptable en ligne",
        description:
          "Dougs réinvente l'expertise comptable en ligne avec un accompagnement humain et des outils digitaux performants. Bénéficiez d'un expert-comptable dédié, de la saisie automatique et d'un suivi financier en temps réel.",
        website: "https://www.dougs.fr",
        category: "compta",
        pricing: "payant",
        rating: 4.3,
        commission: 20,
        pros: "Expert-comptable dédié,Saisie automatique des factures,Application mobile performante,Conseil stratégique inclus",
        cons: "Offre packagée moins flexible,Tarifs plus élevés que la concurrence",
        features: "Comptabilité en ligne,Expert-comptable dédié,Saisie automatique OCR,Gestion des impayés,Prévisionnel et bilan",
        order: 18,
      },
      {
        id: randomUUID(),
        name: "Abby",
        slug: "abby",
        tagline: "La compta auto pour indépendants",
        description:
          "Abby automatise la comptabilité des indépendants et auto-entrepreneurs grâce à l'intelligence artificielle. Scannez vos factures, Abby s'occupe du reste : catégorisation, déclarations et bilan en toute simplicité.",
        website: "https://www.abby.fr",
        category: "compta",
        pricing: "freemium",
        rating: 4.0,
        commission: 18,
        pros: "Automatisation par IA,Interface simple et épurée,Prix accessible pour les indépendants,Déclaration URSSAF automatique",
        cons: "Fonctionnalités limitées au statut indépendant,Pas de collaboration avec un expert-comptable",
        features: "Scan intelligent de factures,Déclaration automatique,Gestion des encaissements,Bilan annuel simplifié,Alertes de paiement",
        order: 19,
      },
      {
        id: randomUUID(),
        name: "Tiime",
        slug: "tiime",
        tagline: "Comptabilité connectée et intelligente",
        description:
          "Tiime propose une plateforme comptable connectée qui centralise vos documents et automatise vos processus. Idéal pour les TPE qui veulent gagner du temps sur la gestion administrative tout en gardant le contrôle.",
        website: "https://www.tiime.fr",
        category: "compta",
        pricing: "payant",
        rating: 4.2,
        commission: 15,
        pros: "Centralisation des documents,Automatisation avancée,Interface collaborative,Très bon rapport qualité-prix",
        cons: "Moins de fonctionnalités que Pennylane,Accompagnement pro en option",
        features: "Saisie automatique,Centralisation documentaire,Gestion des immobilisations,Bilan et compte de résultat,Connecteur bancaire",
        order: 20,
      },

      // ─── Assurance ───────────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Hiscox",
        slug: "hiscox",
        tagline: "Assurance pro sur mesure",
        description:
          "Hiscox propose des assurances professionnelles sur mesure pour les TPE et indépendants. Protection civile professionnelle, multirisque pro ou assurance cyber : des garanties adaptées à chaque métier et chaque besoin.",
        website: "https://www.hiscox.fr",
        category: "assurance",
        pricing: "payant",
        rating: 4.1,
        commission: 20,
        pros: "Garanties sur mesure,Souscription 100% en ligne,Remboursement rapide,Couverture internationale",
        cons: "Tarifs parfois élevés,Pas d'assurance santé pro",
        features: "Responsabilité civile professionnelle,Assurance multirisque,Cyber-assurance,Abris juridique,Assurance décennale",
        order: 21,
      },
      {
        id: randomUUID(),
        name: "Simplitoo",
        slug: "simplitoo",
        tagline: "Assurance TNS simple et rapide",
        description:
          "Simplitoo simplifie l'assurance pour les travailleurs non salariés avec des offres claires et un processus de souscription rapide. Prévoyance, mutuelle santé et retraite complémentaire adaptés aux indépendants.",
        website: "https://www.simplitoo.com",
        category: "assurance",
        pricing: "payant",
        rating: 3.8,
        commission: 18,
        pros: "Souscription rapide,Offres dédiées TNS,Conseillers accessibles,Simulateur en ligne",
        cons: "Offre limitée aux TNS,Pas d'assurance responsabilité civile,Comparaison limitée",
        features: "Prévoyance TNS,Mutuelle santé indépendant,Retraite complémentaire,Simulateur de devis,Gestion en ligne",
        order: 22,
      },
      {
        id: randomUUID(),
        name: "Swile",
        slug: "swile",
        tagline: "Tickets restaurant et avantages",
        description:
          "Swile réinvente les avantages salariaux avec une carte unique pour les titres-restaurant, chèques cadeaux et avantages sociaux. Une solution moderne pour fidéliser vos collaborateurs et simplifier la gestion RH.",
        website: "https://www.swile.co",
        category: "assurance",
        pricing: "payant",
        rating: 4.4,
        commission: 22,
        pros: "Carte unique multi-avantages,Application mobile intuitive,Excellent pour la fidélisation,Service client réactif",
        cons: "Uniquement pour les entreprises avec salariés,Frais de gestion par carte",
        features: "Titres-restaurant dématérialisés,Chèques cadeaux,Avantages CSE,Gestion RH intégrée,Application employé",
        order: 23,
      },

      // ─── Juridique ───────────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Legalstart",
        slug: "legalstart",
        tagline: "Création d'entreprise en ligne",
        description:
          "Legalstart est la plateforme de référence pour la création d'entreprise en ligne. De la SAS à la micro-entreprise, créez votre société en quelques jours avec un accompagnement juridique complet et des tarifs transparents.",
        website: "https://www.legalstart.fr",
        category: "legal",
        pricing: "payant",
        rating: 4.5,
        commission: 30,
        pros: "Processus de création rapide,Accompagnement juridique complet,Tarifs transparents,Statuts personnalisés",
        cons: "Coût des formalités en sus,Options payantes pour certaines modifications",
        features: "Création de société en ligne,Gestion des statuts,Suivi des formalités,Depôt de marque,Kit du dirigeant",
        order: 24,
      },
      {
        id: randomUUID(),
        name: "Captain Contrat",
        slug: "captain-contrat",
        tagline: "Contrats juridiques intelligents",
        description:
          "Captain Contrat génère des contrats juridiques sur mesure grâce à un questionnaire interactif intelligent. CGV, contrats de travail, baux commerciaux : tous vos documents juridiques en quelques clics.",
        website: "https://www.captaincontrat.com",
        category: "legal",
        pricing: "freemium",
        rating: 4.2,
        commission: 15,
        pros: "Génération automatique de contrats,Modèles juridiques validés,Prix abordable,Mises à jour régulières",
        cons: "Pas de conseil juridique personnalisé,Contrats parfois génériques",
        features: "Générateur de contrats,Modèles CGV et mentions légales,Questionnaire intelligent,Espace de stockage,Consultation avocat en option",
        order: 25,
      },
      {
        id: randomUUID(),
        name: "Avostart",
        slug: "avostart",
        tagline: "L'avocat en ligne pour entrepreneurs",
        description:
          "Avostart met les entrepreneurs en relation avec des avocats spécialisés en droit des affaires. Consultation en ligne, devis gratuit et accompagnement juridique personnalisé pour toutes vos problématiques professionnelles.",
        website: "https://www.avostart.fr",
        category: "legal",
        pricing: "payant",
        rating: 4.0,
        commission: 20,
        pros: "Réseau d'avocats spécialisés,Consultation en ligne facile,Devis gratuit sans engagement,Avis clients vérifiés",
        cons: "Coût variable selon l'avocat,Pas de garantie de résultat,Pas de génération automatique de documents",
        features: "Consultation avocat en ligne,Devis gratuit,Rendez-vous vidéo,Sélection par spécialité,Avis et notation des avocats",
        order: 26,
      },

      // ─── Marketing ───────────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Brevo",
        slug: "brevo",
        tagline: "Email marketing & CRM tout-en-un",
        description:
          "Brevo (ex-Sendinblue) est la plateforme marketing tout-en-un idéale pour les TPE et PME françaises. Emailing, SMS, CRM et marketing automation : un outil complet pour développer votre activité sans exploser votre budget.",
        website: "https://www.brevo.com",
        category: "marketing",
        pricing: "freemium",
        rating: 4.3,
        commission: 18,
        pros: "Offre gratuite généreuse,CRM intégré,Interface en français,Automatisation puissante",
        cons: "Design d'emails limité,Volume d'emails limité en gratuit,Support lent en gratuit",
        features: "Email marketing,Campagnes SMS,CRM intégré,Marketing automation,Chat en direct",
        order: 27,
      },
      {
        id: randomUUID(),
        name: "HubSpot",
        slug: "hubspot",
        tagline: "CRM et marketing automation",
        description:
          "HubSpot est la plateforme de référence pour le CRM et le marketing automation. Avec son outil gratuit très complet et ses modules payants, il accompagne les entreprises dans la croissance de leur activité commerciale.",
        website: "https://www.hubspot.fr",
        category: "marketing",
        pricing: "freemium",
        rating: 4.5,
        commission: 20,
        pros: "CRM gratuit très complet,Nombreuses intégrations,Ressources éducatives riches,Scalabilité",
        cons: "Modules payants coûteux,Interface complexe pour les débutants,Support limité en gratuit",
        features: "CRM gratuit illimité,Marketing hub,Sales hub,Service hub,Analytics et reporting",
        order: 28,
      },
      {
        id: randomUUID(),
        name: "Loomly",
        slug: "loomly",
        tagline: "Gestion des réseaux sociaux",
        description:
          "Loomly est un outil de gestion et de planification des réseaux sociaux qui aide les entreprises à créer, programmer et analyser leurs publications. Idéal pour les marques qui veulent optimiser leur présence sur les réseaux.",
        website: "https://www.loomly.com",
        category: "marketing",
        pricing: "payant",
        rating: 4.1,
        commission: 15,
        pros: "Planification multi-plateformes,Suggestions de contenu,Bon outil de collaboration,Analytics détaillés",
        cons: "Pas de version gratuite,Prix qui augmente vite,Pas d'écoute sociale intégrée",
        features: "Planification de posts,Suggestions de contenu,Calendrier collaboratif,Analytics avancés,Approbation multi-utilisateurs",
        order: 29,
      },

      // ─── CRM ─────────────────────────────────────────────────────
      {
        id: randomUUID(),
        name: "Pipedrive",
        slug: "pipedrive",
        tagline: "CRM simple et efficace",
        description:
          "Pipedrive est un CRM conçu par des vendeurs pour des vendeurs. Son interface visuelle en pipeline permet de suivre facilement vos opportunités commerciales et d'automatiser votre processus de vente.",
        website: "https://www.pipedrive.com",
        category: "crm",
        pricing: "payant",
        rating: 4.4,
        commission: 20,
        pros: "Interface visuelle intuitive,Pipeline de vente clair,Automatisation avancée,Nombreuses intégrations",
        cons: "Pas de version gratuite durable,Prix qui monte avec les utilisateurs,Rapports basiques en entrée de gamme",
        features: "Pipeline visuel,Suivi des contacts,Automatisation des tâches,Génération de rapports,Intégrations tierces",
        order: 30,
      },
      {
        id: randomUUID(),
        name: "Tally",
        slug: "tally",
        tagline: "Formulaires et enquêtes pro",
        description:
          "Tally est un outil de création de formulaires en ligne qui se démarque par sa gratuité totale et son interface élégante. Créez des formulaires, enquêtes et quiz professionnels sans aucune limite ni filigrane.",
        website: "https://tally.so",
        category: "crm",
        pricing: "gratuit",
        rating: 4.2,
        commission: 10,
        pros: "Gratuit sans limites,Interface moderne et élégante,Logique conditionnelle avancée,Pas de filigrane",
        cons: "Moins de modèles que Typeform,Fonctionnalités d'analyse basiques,Intégrations limitées en gratuit",
        features: "Création de formulaires,Logique conditionnelle,Paiement intégré,Notation automatique,Exports CSV et PDF",
        order: 31,
      },
      {
        id: randomUUID(),
        name: "Notion",
        slug: "notion",
        tagline: "Workspace tout-en-un",
        description:
          "Notion est le workspace tout-en-un qui remplace vos outils de prise de notes, gestion de projet et base de données. Extrêmement flexible, il s'adapte à tous les usages et toutes les tailles d'équipe.",
        website: "https://www.notion.so",
        category: "crm",
        pricing: "freemium",
        rating: 4.7,
        commission: 0,
        pros: "Extrêmement polyvalent,Interface élégante,Gratuit pour un usage individuel,Communauté active et templates",
        cons: "Peut être complexe à configurer,Performance sur gros projets,Pas de gestion native des contacts pro",
        features: "Bases de données,Gestion de projet,Wiki d'équipe,Templates personnalisables,Intégrations et API",
        order: 32,
      },
    ];

    // Filter out tools that already exist
    const newTools = toolsToSeed.filter(
      (tool) => !existingSlugs.has(tool.slug) && !existingNames.has(tool.name.toLowerCase())
    );

    if (newTools.length === 0) {
      return NextResponse.json({
        message: "Tous les outils existent déjà dans la base de données",
        created: 0,
        skipped: toolsToSeed.length,
      });
    }

    // Insert new tools
    const result = await db.tool.createMany({
      data: newTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        tagline: tool.tagline,
        description: tool.description,
        website: tool.website,
        category: tool.category,
        pricing: tool.pricing,
        rating: tool.rating,
        commission: tool.commission,
        pros: tool.pros,
        cons: tool.cons,
        features: tool.features,
        active: true,
        order: tool.order,
      })),
    });

    return NextResponse.json({
      message: `${result.count} outil(s) ajouté(s) avec succès`,
      created: result.count,
      skipped: toolsToSeed.length - result.count,
      total: await db.tool.count(),
    });
  } catch (error) {
    console.error("Seed tools error:", error);
    return NextResponse.json(
      { error: "Erreur lors du seeding des outils" },
      { status: 500 }
    );
  }
}
