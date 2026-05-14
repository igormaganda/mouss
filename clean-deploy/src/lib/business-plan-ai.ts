import ZAI from 'z-ai-web-dev-sdk';

// Types for business plan analysis
export interface BusinessPlanInput {
  projectName: string;
  sector: string;
  projectType?: string;
  description?: string;
  targetMarket?: string;
  valueProposition?: string;
  revenueModel?: string;
  initialInvestment?: number;
  monthlyRevenue?: number;
  teamSize?: string;
  competition?: string;
  strengths?: string;
  weaknesses?: string;
}

export interface AnalysisResult {
  score: number;
  grade: string;
  summary: string;
  details: {
    market: { score: number; feedback: string };
    financial: { score: number; feedback: string };
    team: { score: number; feedback: string };
    product: { score: number; feedback: string };
  };
  recommendations: string[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  nextSteps: string[];
}

// System prompt for business plan analysis
const BUSINESS_PLAN_SYSTEM_PROMPT = `Tu es un expert en création d'entreprise et analyse de business plans. Tu as plus de 20 ans d'expérience en accompagnement de porteurs de projets entrepreneurs.

Ta mission est d'analyser les projets entrepreneuriaux de manière approfondie et bienveillante, en fournissant:
1. Un score de viabilité global sur 100
2. Une note de A à E (A = excellent, E = non viable)
3. Une analyse détaillée par catégorie (marché, financier, équipe, produit)
4. Des recommandations concrètes et actionnables
5. Une analyse SWOT si suffisamment d'informations

Tu réponds TOUJOURS en JSON valide avec la structure exacte demandée.
Sois constructif, encourageant mais réaliste. Donne des exemples concrets dans tes recommandations.`;

// AI-powered business plan analysis
export async function analyzeBusinessPlan(input: BusinessPlanInput): Promise<AnalysisResult> {
  try {
    const zai = await ZAI.create();

    // Build the user prompt with all available information
    const projectDetails = Object.entries({
      'Nom du projet': input.projectName,
      'Secteur d\'activité': input.sector,
      'Type de projet': input.projectType,
      'Description': input.description,
      'Marché cible': input.targetMarket,
      'Proposition de valeur': input.valueProposition,
      'Modèle de revenus': input.revenueModel,
      'Investissement initial': input.initialInvestment ? `${input.initialInvestment.toLocaleString('fr-FR')} €` : undefined,
      'CA mensuel visé': input.monthlyRevenue ? `${input.monthlyRevenue.toLocaleString('fr-FR')} €` : undefined,
      'Taille de l\'équipe': input.teamSize,
      'Concurrence': input.competition,
      'Forces': input.strengths,
      'Faiblesses': input.weaknesses,
    })
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');

    const userPrompt = `Analyse ce projet entrepreneurial et fournis une évaluation complète.

DONNÉES DU PROJET:
${projectDetails}

RÉPONDS EN JSON AVEC CETTE STRUCTURE EXACTE:
{
  "score": <nombre entre 0 et 100>,
  "grade": "<lettre: A, B, C, D ou E>",
  "summary": "<résumé de 2-3 phrases sur la viabilité du projet>",
  "details": {
    "market": {
      "score": <nombre 0-100>,
      "feedback": "<analyse du marché et positionnement, 2-3 phrases>"
    },
    "financial": {
      "score": <nombre 0-100>,
      "feedback": "<analyse financière, 2-3 phrases>"
    },
    "team": {
      "score": <nombre 0-100>,
      "feedback": "<analyse de l'équipe et compétences, 2-3 phrases>"
    },
    "product": {
      "score": <nombre 0-100>,
      "feedback": "<analyse du produit/service et différenciation, 2-3 phrases>"
    }
  },
  "recommendations": [
    "<recommandation 1 concrète et actionnable>",
    "<recommandation 2>",
    "<recommandation 3>",
    "<recommandation 4>",
    "<recommandation 5>"
  ],
  "swot": {
    "strengths": ["<force 1>", "<force 2>", "<force 3>"],
    "weaknesses": ["<faiblesse 1>", "<faiblesse 2>", "<faiblesse 3>"],
    "opportunities": ["<opportunité 1>", "<opportunité 2>", "<opportunité 3>"],
    "threats": ["<menace 1>", "<menace 2>", "<menace 3>"]
  },
  "nextSteps": [
    "<étape suivante prioritaire 1>",
    "<étape suivante 2>",
    "<étape suivante 3>",
    "<étape suivante 4>"
  ]
}

IMPORTANT: 
- Le score global doit être une moyenne pondérée réaliste des 4 catégories
- Le grade A (90-100), B (75-89), C (60-74), D (45-59), E (0-44)
- Les recommandations doivent être spécifiques au projet, pas génériques
- L'analyse SWOT doit être cohérente avec les informations fournies`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: BUSINESS_PLAN_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('Pas de réponse de l\'IA');
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = responseContent;
    const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Parse the JSON response
    const analysis: AnalysisResult = JSON.parse(jsonStr.trim());

    // Validate and sanitize the response
    return {
      score: Math.min(100, Math.max(0, analysis.score || 0)),
      grade: ['A', 'B', 'C', 'D', 'E'].includes(analysis.grade) ? analysis.grade : 'E',
      summary: analysis.summary || 'Analyse non disponible',
      details: {
        market: {
          score: Math.min(100, Math.max(0, analysis.details?.market?.score || 50)),
          feedback: analysis.details?.market?.feedback || 'Analyse non disponible',
        },
        financial: {
          score: Math.min(100, Math.max(0, analysis.details?.financial?.score || 50)),
          feedback: analysis.details?.financial?.feedback || 'Analyse non disponible',
        },
        team: {
          score: Math.min(100, Math.max(0, analysis.details?.team?.score || 50)),
          feedback: analysis.details?.team?.feedback || 'Analyse non disponible',
        },
        product: {
          score: Math.min(100, Math.max(0, analysis.details?.product?.score || 50)),
          feedback: analysis.details?.product?.feedback || 'Analyse non disponible',
        },
      },
      recommendations: Array.isArray(analysis.recommendations) 
        ? analysis.recommendations.slice(0, 6) 
        : ['Consultez un conseiller en création d\'entreprise'],
      swot: analysis.swot,
      nextSteps: Array.isArray(analysis.nextSteps) 
        ? analysis.nextSteps.slice(0, 5) 
        : ['Planifier une rencontre avec un conseiller'],
    };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    
    // Fallback analysis if AI fails
    return generateFallbackAnalysis(input);
  }
}

// Fallback analysis (used when AI is unavailable)
function generateFallbackAnalysis(input: BusinessPlanInput): AnalysisResult {
  let marketScore = 50;
  let financialScore = 50;
  let teamScore = 50;
  let productScore = 50;

  // Adjust scores based on available information
  if (input.targetMarket) marketScore += 15;
  if (input.competition) marketScore += 10;
  
  if (input.revenueModel) financialScore += 15;
  if (input.initialInvestment !== undefined) financialScore += 10;
  if (input.monthlyRevenue !== undefined) financialScore += 10;
  
  if (input.teamSize) teamScore += 20;
  
  if (input.valueProposition) productScore += 20;
  if (input.description) productScore += 10;

  // Cap scores at 85 for fallback
  marketScore = Math.min(85, marketScore);
  financialScore = Math.min(85, financialScore);
  teamScore = Math.min(85, teamScore);
  productScore = Math.min(85, productScore);

  const overallScore = Math.round((marketScore + financialScore + teamScore + productScore) / 4);
  
  let grade = 'E';
  if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 75) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else if (overallScore >= 45) grade = 'D';

  return {
    score: overallScore,
    grade,
    summary: overallScore >= 70
      ? 'Votre projet présente un potentiel intéressant. Une analyse approfondie avec un conseiller est recommandée.'
      : 'Votre projet nécessite un travail de fond sur plusieurs aspects. N\'hésitez pas à vous faire accompagner.',
    details: {
      market: {
        score: marketScore,
        feedback: marketScore >= 70
          ? 'Marché identifié. Poursuivez l\'analyse avec une étude de marché approfondie.'
          : 'Le marché doit être mieux défini. Identifiez vos segments de clientèle cibles.',
      },
      financial: {
        score: financialScore,
        feedback: financialScore >= 70
          ? 'Prévisions financières esquissées. Détaillez votre plan de trésorerie.'
          : 'Le modèle économique nécessite plus de détails sur les sources de revenus.',
      },
      team: {
        score: teamScore,
        feedback: teamScore >= 70
          ? 'Structure d\'équipe définie. Identifiez les compétences clés à renforcer.'
          : 'Précisez la composition de votre équipe et les compétences nécessaires.',
      },
      product: {
        score: productScore,
        feedback: productScore >= 70
          ? 'Proposition de valeur identifiée. Travaillez votre différenciation concurrentielle.'
          : 'Clarifiez votre offre et ce qui vous distingue de la concurrence.',
      },
    },
    recommendations: [
      'Planifiez une rencontre avec un conseiller en création d\'entreprise (CCI, BGE, etc.)',
      'Réalisez une étude de marché avec des entretiens clients',
      'Établissez un prévisionnel financier sur 3 ans',
      'Identifiez les aides et financements disponibles (France Travail, ADIE, etc.)',
      'Définissez vos indicateurs clés de performance (KPIs)',
    ],
    nextSteps: [
      'Prendre rendez-vous avec un conseiller création',
      'Compléter l\'étude de marché',
      'Établir le plan de financement initial',
    ],
  };
}

// Export singleton instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}
