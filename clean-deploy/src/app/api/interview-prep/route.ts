import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

interface InterviewPrepInput {
  userId: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  interviewType?: 'technical' | 'behavioral' | 'case' | 'general';
  language?: 'fr' | 'ar';
  focusAreas?: string[];
}

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAnswer: string;
  tips: string[];
}

interface InterviewPrepResult {
  questions: InterviewQuestion[];
  generalTips: string[];
  companyInsights: string;
  estimatedDuration: string;
}

// POST /api/interview-prep - Generate interview questions using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      jobId,
      jobTitle,
      company,
      interviewType = 'general',
      language = 'fr',
      focusAreas = []
    } = body as InterviewPrepInput;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get job details if jobId is provided
    let job = null;
    if (jobId) {
      job = await db.job.findUnique({
        where: { id: jobId },
        include: {
          skills: {
            include: { skill: true },
          },
        },
      });
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        skills: {
          include: { skill: true },
          take: 10,
        },
        careerIdentity: true,
        pepites: {
          where: { category: 'have' },
          include: { pepite: true },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize AI
    const zai = await ZAI.create();

    // Define interview type descriptions
    const interviewTypeDescriptions = {
      technical: 'technique avec des questions sur les compétences et résolution de problèmes',
      behavioral: 'comportementale avec la méthode STAR (Situation, Tâche, Action, Résultat)',
      case: 'étude de cas avec des problèmes business à résoudre',
      general: 'générale couvrant expérience, motivations et personnalité',
    };

    // Define system prompt based on language
    const systemPrompt = language === 'ar'
      ? `أنت خبير في التحضير للمقابلات الوظيفية مع خبرة واسعة في التوظيف.
        
        أنشئ دليل تحضير للمقابلة يتضمن:
        - 8-10 أسئلة مقابلة محتملة مع إجابات مقترحة
        - نصائح عامة للمقابلة
        - رؤى عن الشركة (إذا تم توفيرها)
        
        نوع المقابلة: ${interviewType}
        
        يجب أن ترد بتنسيق JSON فقط:
        {
          "questions": [
            {
              "question": "السؤال",
              "category": "الفئة (تقنية/سلوكية/خبرة/تحفيز)",
              "difficulty": "سهل/متوسط/صعب",
              "suggestedAnswer": "الإجابة المقترحة",
              "tips": ["نصيحة 1", "نصيحة 2"]
            }
          ],
          "generalTips": ["نصيحة عامة 1", "نصيحة عامة 2"],
          "companyInsights": "رؤى عن الشركة والثقافة المؤسسية",
          "estimatedDuration": "الوقت المقدر للتحضير"
        }`
      : `Tu es un expert en préparation d'entretiens d'embauche avec une vaste expérience en recrutement.
        
        Crée un guide de préparation à l'entretien comprenant:
        - 8-10 questions d'entretien probables avec réponses suggérées
        - Des conseils généraux pour l'entretien
        - Des insights sur l'entreprise (si fournie)
        
        Type d'entretien: ${interviewTypeDescriptions[interviewType]}
        
        Tu DOIS répondre UNIQUEMENT en format JSON:
        {
          "questions": [
            {
              "question": "La question",
              "category": "catégorie (technique/comportementale/expérience/motivation)",
              "difficulty": "facile/moyen/difficile",
              "suggestedAnswer": "La réponse suggérée",
              "tips": ["conseil 1", "conseil 2"]
            }
          ],
          "generalTips": ["conseil général 1", "conseil général 2"],
          "companyInsights": "Insights sur l'entreprise et sa culture",
          "estimatedDuration": "Durée estimée de préparation"
        }`;

    const candidateInfo = [
      `Nom: ${user.name || 'Candidat'}`,
      user.careerIdentity ? `Super-pouvoir: ${user.careerIdentity.superPower}` : '',
      user.careerIdentity ? `Mission: ${user.careerIdentity.mission}` : '',
      `Compétences: ${user.skills.map(s => s.skill.name).join(', ')}`,
      `Points forts: ${user.pepites.map(p => p.pepite.name).join(', ')}`,
      focusAreas.length > 0 ? `Domaines à approfondir: ${focusAreas.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const jobInfo = job 
      ? [
          `Poste: ${job.title}`,
          `Entreprise: ${job.company}`,
          job.location ? `Lieu: ${job.location}` : '',
          job.description ? `Description: ${job.description.substring(0, 500)}...` : '',
          `Compétences requises: ${job.skills.map(s => s.skill.name).join(', ')}`,
        ].filter(Boolean).join('\n')
      : [
          jobTitle ? `Poste: ${jobTitle}` : '',
          company ? `Entreprise: ${company}` : '',
        ].filter(Boolean).join('\n');

    const userPrompt = language === 'ar'
      ? `أنشئ دليل تحضير للمقابلة للمرشح:\n${candidateInfo}\n\nللوظيفة:\n${jobInfo}`
      : `Crée un guide de préparation à l'entretien pour le candidat:\n${candidateInfo}\n\nPour le poste:\n${jobInfo}`;

    // Call AI for interview prep generation
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
        { success: false, error: 'Failed to generate interview preparation' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let prepResult: InterviewPrepResult;
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
      prepResult = JSON.parse(cleanResponse.trim());
    } catch {
      console.error('Failed to parse AI response:', responseContent);
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Save to database
    const savedPrep = await db.interviewPrep.create({
      data: {
        userId,
        jobId: jobId || null,
        questions: prepResult.questions,
        tips: prepResult.generalTips.join('\n'),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedPrep.id,
        ...prepResult,
        jobTitle: job?.title || jobTitle,
        company: job?.company || company,
        interviewType,
        generatedAt: savedPrep.createdAt.toISOString(),
      },
      message: language === 'ar' 
        ? 'تم إنشاء دليل التحضير للمقابلة بنجاح' 
        : 'Guide de préparation à l\'entretien généré avec succès',
    });
  } catch (error) {
    console.error('Error generating interview prep:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate interview preparation' },
      { status: 500 }
    );
  }
}
