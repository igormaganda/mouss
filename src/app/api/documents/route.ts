import { NextRequest, NextResponse } from "next/server";

// ─── DOCUMENT TYPE CONFIGURATIONS ────────────────────────────────

interface DocConfig {
  type: string;
  label: string;
  description: string;
  systemPrompt: string;
  sections: string[];
}

const DOC_CONFIGS: Record<string, DocConfig> = {
  "plan-affaires": {
    type: "plan-affaires",
    label: "Plan d'Affaires",
    description: "Document stratégique complet pour votre création d'entreprise",
    systemPrompt: `Tu es un expert en création d'entreprise et en business planning en France.
Tu rédiges des plans d'affaires professionnels, complets et adaptés au droit français.
Tu inclus obligatoirement les sections demandées avec un contenu détaillé et concret.
Tu utilises un ton professionnel mais accessible.
Le plan doit inclure TOUT ce qui est nécessaire à la création d'une société française :
- Choix du statut juridique (auto-entrepreneur, SASU, EURL, SARL, SA) avec avantages/inconvénients
- Capital social et apports
- Démarches d'immatriculation (INPI, CFE, Greffe)
- Mentions légales obligatoires
- Formalités post-création (KBIS, publication JAL, comptes bancaires)
Tu formats ta réponse en Markdown propre avec des titres H1, H2, H3, des listes à puces et des tableaux.`,
    sections: [
      "Résumé exécutif (Executive Summary)",
      "Présentation du porteur de projet",
      "Concept et description de l'activité",
      "Étude de marché (analyse sectorielle, concurrence, clients cibles)",
      "Stratégie commerciale et marketing",
      "Choix du statut juridique et forme sociale",
      "Organisation et équipe",
      "Prévisions financières (compte de résultat, BFR, plan de trésorerie)",
      "Plan de financement initial",
      "Démarches de création d'entreprise",
      "Annexe : formalités post-création (KBIS, JAL, URSSAF, etc.)",
    ],
  },
  "plan-marketing": {
    type: "plan-marketing",
    label: "Plan Marketing",
    description: "Stratégie marketing complète pour votre entreprise",
    systemPrompt: `Tu es un expert en marketing digital et stratégie commerciale pour les entreprises françaises.
Tu rédiges des plans marketing détaillés, actionnables et adaptés au marché français.
Tu inclus des stratégies SEO, réseaux sociaux, email marketing, publicité en ligne et offline.
Tu intègres les obligations légales françaises (RGPD, mentions légales).
Tu formats ta réponse en Markdown propre avec des titres, listes et tableaux comparatifs.
Chaque action doit être accompagnée d'un budget estimé et d'un indicateur de performance (KPI).`,
    sections: [
      "Analyse SWOT de l'entreprise",
      "Positionnement et proposition de valeur unique (USP)",
      "Cibles et personas marketing détaillés",
      "Stratégie de tarification",
      "Plan d'action digital (SEO, SEM, réseaux sociaux, email)",
      "Stratégie de contenu et calendrier éditorial",
      "Budget marketing prévisionnel",
      "KPIs et tableau de bord marketing",
      "Plan d'action sur 12 mois",
    ],
  },
  "sommaire-executif": {
    type: "sommaire-executif",
    label: "Sommaire Exécutif",
    description: "Résumé professionnel de votre plan d'affaires",
    systemPrompt: `Tu es un expert en création d'entreprise en France.
Tu rédiges des résumés exécutifs percutants et professionnels pour des plans d'affaires.
Le sommaire exécutif doit donner envie aux investisseurs et partenaires de lire le plan complet.
Il doit être concis (2-3 pages), structuré et convaincant.
Tu inclus les projections financières clés et les points forts du projet.
Tu formats ta réponse en Markdown propre avec des titres et des points clés.`,
    sections: [
      "Présentation du projet (concept, problème résolu, opportunité)",
      "Marché et opportunité (taille, tendances, positionnement)",
      "Modèle économique et sources de revenus",
      "Avantages concurrentiels",
      "Prévisions financières clés (CA 3 ans, rentabilité, seuil)",
      "Besoins en financement et utilisation des fonds",
      "Équipe et compétences clés",
      "Prochaines étapes et planning",
    ],
  },
  "guide-creation": {
    type: "guide-creation",
    label: "Guide de Création d'Entreprise",
    description: "Guide complet étape par étape pour créer votre société",
    systemPrompt: `Tu es un expert en droit des sociétés français et formalités de création d'entreprise.
Tu rédiges un guide complet et précis pour créer une entreprise en France.
Tu couvres TOUTES les étapes : choix du statut, capital, immatriculation, post-création.
Tu inclus les coûts exacts, les délais, les organismes à contacter (INPI, URSSAF, Greffe, etc.).
Tu détailles les obligations légales : assurances, comptabilité, déclarations sociales.
Tu formats ta réponse en Markdown avec des checklists, tableaux et liens utiles.
Le guide doit être applicable immédiatement par un entrepreneur débutant.`,
    sections: [
      "Choix du statut juridique (comparatif détaillé : auto-entrepreneur, EIRL, EURL, SASU, SARL, SA)",
      "Capital social : montant, apports, libération",
      "Rédaction des statuts (éléments obligatoires, clauses recommandées)",
      "Formalités d'immatriculation (démarches CFE / INPI, pièces à fournir)",
      "Ouverture du compte bancaire professionnel",
      "Assurances obligatoires et recommandées (RC Pro, décennale, mutuelle TNS)",
      "Obligations comptables par statut",
      "Déclarations sociales (URSSAF, DSN, CFE)",
      "Formalités post-création : KBIS, JAL, affichage, registre",
      "Checklist complète de création",
      "Ressources utiles et liens officiels",
    ],
  },
  "etude-marche": {
    type: "etude-marche",
    label: "Plan d'Étude de Marché",
    description: "Analyse complète de votre marché et de votre clientèle cible",
    systemPrompt: `Tu es un expert en études de marché et analyse sectorielle pour le marché français.
Tu rédiges des études de marché professionnelles avec données chiffrées et analyses pertinentes.
Tu inclus des méthodologies d'enquête, des outils d'analyse et des sources de données fiables.
Tu proposes une analyse concurrentielle détaillée et des recommandations stratégiques.
Tu formats ta réponse en Markdown avec des titres, tableaux comparatifs et graphiques textuels.
Chaque section doit contenir des exemples concrets et des données réelles du marché français.`,
    sections: [
      "Objectifs et méthodologie de l'étude",
      "Macro-environnement (PESTEL) du secteur",
      "Taille et croissance du marché (données chiffrées France)",
      "Segmentation et ciblage client (personas détaillés)",
      "Analyse de la demande (besoins, comportements, tendances)",
      "Analyse concurrentielle (directe et indirecte, benchmark)",
      "Matrice SWOT du projet",
      "Barrières à l'entrée et menaces du marché",
      "Recommandations stratégiques",
      "Annexe : sources de données et outils recommandés",
    ],
  },
};

// ─── GET: List available document types ──────────────────────────

export async function GET() {
  const types = Object.values(DOC_CONFIGS).map((config) => ({
    type: config.type,
    label: config.label,
    description: config.description,
    sections: config.sections,
  }));

  return NextResponse.json({ documents: types });
}

// ─── POST: Generate a specific document ──────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentType, projectName, activity, profile, additionalInfo } = body;

    // Validate document type
    const config = DOC_CONFIGS[documentType];
    if (!config) {
      return NextResponse.json(
        { error: `Type de document inconnu. Types disponibles : ${Object.keys(DOC_CONFIGS).join(", ")}` },
        { status: 400 }
      );
    }

    // Build the user prompt with provided context
    const userPrompt = `Génère un "${config.label}" pour le projet suivant :

**Nom du projet :** ${projectName || "Non spécifié"}
**Type d'activité :** ${activity || "Non spécifié"}
**Profil de l'entrepreneur :** ${profile || "Non spécifié"}
${additionalInfo ? `**Informations complémentaires :** ${additionalInfo}` : ""}

Rédige le document complet avec toutes les sections suivantes :
${config.sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Le document doit être :
- Détaillé et professionnel (au moins 1500 mots)
- Adapté au marché français et au droit français
- Structuré en Markdown avec titres H1, H2, H3
- Concret avec des exemples, chiffres et recommandations actionnables
- Inclure les aspects légaux et fiscaux français pertinents
- Contenir des tableaux comparatifs quand c'est pertinent`;

    // Call AI API
    const response = await fetch("https://open.91z.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Document generation API error:", err);
      return NextResponse.json({ error: "Erreur lors de la génération du document" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Erreur lors de la génération.";

    return NextResponse.json({
      document: {
        type: config.type,
        label: config.label,
        content,
        generatedAt: new Date().toISOString(),
        sections: config.sections,
      },
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la génération" }, { status: 500 });
  }
}
