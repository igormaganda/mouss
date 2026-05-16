import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

interface CareerIdentityInput {
  userId: string;
  pepitesHave: string[];
  pepitesWant: string[];
  skills: string[];
  experience?: string;
  aspirations?: string[];
  language?: 'fr' | 'ar';
}

interface CareerIdentityResult {
  superPower: string;
  mission: string;
  values: string[];
  strengths: string[];
  rawAiAnalysis: string;
}

// POST /api/career-identity - Generate Career Identity Statement using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      pepitesHave, 
      pepitesWant, 
      skills, 
      experience,
      aspirations,
      language = 'fr' 
    } = body as CareerIdentityInput;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    if ((!pepitesHave || pepitesHave.length === 0) && (!skills || skills.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'At least some pepites or skills are required' },
        { status: 400 }
      );
    }

    // Initialize AI
    const zai = await ZAI.create();

    // Define system prompt based on language
    const systemPrompt = language === 'ar'
      ? `أنت خبير تطوير مهني متخصص في مساعدة الأشخاص على اكتشاف هوياتهم المهنية الفريدة.
        
        بناءً على المعلومات المقدمة، قم بإنشاء "بيان الهوية المهنية" يتضمن:
        1. "القوة الخارقة": الموهبة الفريدة التي يمتلكها الشخص (جملة واحدة قوية)
        2. "المهمة": الغرض المهني أو الهدف الرئيسي (جملة واحدة ملهمة)
        3. "القيم": 3-5 قيم أساسية توجه قرارات الشخص المهنية
        4. "نقاط القوة": 3-5 نقاط قوة رئيسية
        
        يجب أن ترد بتنسيق JSON فقط:
        {
          "superPower": "القوة الخارقة",
          "mission": "المهمة",
          "values": ["قيمة 1", "قيمة 2", "قيمة 3"],
          "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
          "rawAiAnalysis": "تحليل مفصل باللغة العربية"
        }`
      : `Tu es un expert en développement de carrière spécialisé dans l'aide aux personnes pour découvrir leur identité professionnelle unique.
        
        Basé sur les informations fournies, crée une "Déclaration d'Identité Professionnelle" qui comprend:
        1. "Super-pouvoir": Le talent unique que possède la personne (une phrase puissante)
        2. "Mission": Le but professionnel ou l'objectif principal (une phrase inspirante)
        3. "Valeurs": 3-5 valeurs fondamentales qui guident les décisions professionnelles
        4. "Forces": 3-5 points forts principaux
        
        Tu DOIS répondre UNIQUEMENT en format JSON:
        {
          "superPower": "Le super-pouvoir identifié",
          "mission": "La mission professionnelle",
          "values": ["valeur 1", "valeur 2", "valeur 3"],
          "strengths": ["force 1", "force 2", "force 3"],
          "rawAiAnalysis": "Analyse détaillée en français"
        }`;

    const userInfo = [
      pepitesHave?.length > 0 ? `Compétences douces possédées: ${pepitesHave.join(', ')}` : '',
      pepitesWant?.length > 0 ? `Compétences douces souhaitées: ${pepitesWant.join(', ')}` : '',
      skills?.length > 0 ? `Compétences techniques: ${skills.join(', ')}` : '',
      experience ? `Expérience: ${experience}` : '',
      aspirations?.length > 0 ? `Aspirations: ${aspirations.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const userPrompt = language === 'ar'
      ? `بناءً على المعلومات التالية، أنشئ هوية مهنية فريدة:\n\n${userInfo}`
      : `Basé sur les informations suivantes, crée une identité professionnelle unique:\n\n${userInfo}`;

    // Call AI for career identity generation
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate career identity' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let identity: CareerIdentityResult;
    try {
      let cleanResponse = responseContent.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7);
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3);
      }
      if (cleanResponse.endsWith('```')) {
        cleanResponse = cleanResponse.slice(0, -3);
      }
      identity = JSON.parse(cleanResponse.trim());
    } catch {
      console.error('Failed to parse AI response:', responseContent);
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Save to database
    const savedIdentity = await db.careerIdentity.upsert({
      where: { userId },
      update: {
        superPower: identity.superPower,
        mission: identity.mission,
        values: identity.values,
        strengths: identity.strengths,
        rawAiAnalysis: identity.rawAiAnalysis,
      },
      create: {
        userId,
        superPower: identity.superPower,
        mission: identity.mission,
        values: identity.values,
        strengths: identity.strengths,
        rawAiAnalysis: identity.rawAiAnalysis,
      },
    });

    return NextResponse.json({
      success: true,
      data: savedIdentity,
      message: language === 'ar' 
        ? 'تم إنشاء الهوية المهنية بنجاح' 
        : 'Identité professionnelle générée avec succès',
    });
  } catch (error) {
    console.error('Error generating career identity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate career identity' },
      { status: 500 }
    );
  }
}
