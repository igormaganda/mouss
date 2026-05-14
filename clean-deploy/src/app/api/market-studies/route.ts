import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for market study
const marketStudySchema = z.object({
  projectId: z.string(),
  sector: z.string(),
  subSector: z.string().optional(),
  location: z.string(),
  targetAudience: z.string().optional(),
  competitors: z.string().optional(),
});

// Market data by sector (can be replaced with real data API)
const MARKET_DATA: Record<string, any> = {
  tech: { growthRate: 12.5, avgTicketSize: '50-150€', competitionLevel: 'Élevé', cacRange: '25-80€' },
  commerce: { growthRate: 4.2, avgTicketSize: '30-100€', competitionLevel: 'Moyen', cacRange: '20-50€' },
  services: { growthRate: 6.8, avgTicketSize: '40-200€', competitionLevel: 'Moyen', cacRange: '30-100€' },
  artisanat: { growthRate: 3.5, avgTicketSize: '50-300€', competitionLevel: 'Faible', cacRange: '15-40€' },
  sante: { growthRate: 8.2, avgTicketSize: '60-250€', competitionLevel: 'Moyen', cacRange: '35-90€' },
  education: { growthRate: 9.5, avgTicketSize: '30-150€', competitionLevel: 'Moyen', cacRange: '20-60€' },
  tourisme: { growthRate: 5.8, avgTicketSize: '80-500€', competitionLevel: 'Élevé', cacRange: '40-120€' },
};

// POST /api/market-studies - Generate market study
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = marketStudySchema.parse(body);
    
    const marketBase = MARKET_DATA[validatedData.sector] || MARKET_DATA.services;
    
    // Generate market data
    const baseMarket = 500000000 + Math.floor(Math.random() * 1500000000);
    const marketSize = {
      tam: baseMarket,
      sam: Math.floor(baseMarket * 0.15),
      som: Math.floor(baseMarket * 0.01),
      growthRate: marketBase.growthRate,
      currency: 'EUR'
    };

    const competitors = [
      {
        name: 'Leader du secteur',
        marketShare: 25 + Math.floor(Math.random() * 10),
        positioning: 'Acteur historique avec forte notoriété',
        strengths: ['Marque reconnue', 'Réseau étendu', 'Expérience'],
        weaknesses: ['Prix élevés', 'Innovation limitée', 'Service client'],
      },
      {
        name: 'Concurrent digital',
        marketShare: 15 + Math.floor(Math.random() * 10),
        positioning: 'Nouvel acteur disruptif sur le digital',
        strengths: ['Prix compétitifs', 'UX moderne', 'Marketing digital'],
        weaknesses: ['Notoriété', 'Service après-vente', 'Couverture géographique'],
      },
      {
        name: 'Acteur local',
        marketShare: 8 + Math.floor(Math.random() * 8),
        positioning: 'Spécialiste régional avec ancrage local',
        strengths: ['Proximité clients', 'Réseau local', 'Adaptabilité'],
        weaknesses: ['Croissance limitée', 'Digitalisation', 'Ressources'],
      }
    ];

    const trends = [
      { name: 'Digitalisation accélérée', description: 'Transformation numérique des processus et canaux de vente', impact: 'positive', importance: 'high' },
      { name: 'RSE et développement durable', description: 'Attentes croissantes des consommateurs sur l\'impact environnemental', impact: 'positive', importance: 'medium' },
      { name: 'Inflation des coûts', description: 'Augmentation des coûts de production et de l\'énergie', impact: 'negative', importance: 'high' },
      { name: 'Nouvelles réglementations', description: 'Évolution du cadre réglementaire et fiscal', impact: 'neutral', importance: 'medium' }
    ];

    const targetSegments = [
      { name: 'Jeunes actifs urbains', size: '30%', characteristics: ['25-35 ans', 'Villes moyennes et grandes', 'Digital natives'], painPoints: ['Manque de temps', 'Recherche de praticité', 'Sensibilité au prix'] },
      { name: 'Familles', size: '28%', characteristics: ['30-45 ans', 'Banlieue et périphérie', 'Consommateurs avisés'], painPoints: ['Budget', 'Qualité', 'Sécurité'] },
      { name: 'Seniors actifs', size: '22%', characteristics: ['55-65 ans', 'Pouvoir d\'achat élevé', 'Recherche de qualité'], painPoints: ['Service personnalisé', 'Confiance', 'Accessibilité'] }
    ];

    const recommendations = [
      `Miser sur les canaux digitaux pour atteindre votre cible ${validatedData.location || 'régionale'}`,
      'Développer une offre responsable pour répondre aux attentes RSE',
      'Optimiser l\'expérience client pour vous différencier',
      'Prévoir une stratégie de fidélisation dès le lancement',
      'Identifier les partenariats locaux stratégiques'
    ];

    // Save to database
    const marketStudy = await db.marketStudy.create({
      data: {
        projectId: validatedData.projectId,
        title: `Étude de marché - ${validatedData.sector} - ${validatedData.location}`,
        description: validatedData.targetAudience ? `Cible: ${validatedData.targetAudience}` : null,
        marketSize,
        competitors,
        trends,
        targetAudience: targetSegments,
        recommendations,
        swot: {
          strengths: ['Expertise métier', 'Réseau local', 'Flexibilité'],
          weaknesses: ['Notoriété à construire', 'Ressources limitées', 'Digitalisation'],
          opportunities: ['Tendance du secteur', 'Digitalisation', 'Nouveaux canaux'],
          threats: ['Concurrence', 'Réglementation', 'Évolution consommation'],
        },
        aiInsights: [
          { type: 'opportunity', title: 'Marché en croissance', description: `Le secteur ${validatedData.sector} connaît une croissance de ${marketBase.growthRate}%`, confidence: 85 },
          { type: 'recommendation', title: 'Focus digital', description: 'La digitalisation représente une opportunité majeure', confidence: 78 },
        ],
        status: 'completed',
        completionRate: 100,
      },
    });

    return NextResponse.json({
      success: true,
      data: marketStudy,
      message: 'Étude de marché générée avec succès'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error generating market study:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération de l\'étude de marché' },
      { status: 500 }
    );
  }
}

// GET /api/market-studies - Get market studies
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');
    
    const where = projectId ? { projectId } : {};
    
    const marketStudies = await db.marketStudy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: marketStudies
    });
  } catch (error) {
    console.error('Error fetching market studies:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des études de marché' },
      { status: 500 }
    );
  }
}
