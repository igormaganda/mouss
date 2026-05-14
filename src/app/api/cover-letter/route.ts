import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

interface CoverLetterInput {
  userId: string;
  jobId: string;
  tone?: 'professional' | 'enthusiastic' | 'creative';
  language?: 'fr' | 'ar';
  customPoints?: string[];
}

interface CoverLetterResult {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
  fullLetter: string;
}

// POST /api/cover-letter - Generate cover letter using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      jobId, 
      tone = 'professional',
      language = 'fr',
      customPoints = []
    } = body as CoverLetterInput;

    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, error: 'userId and jobId are required' },
        { status: 400 }
      );
    }

    // Fetch user data
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

    // Fetch job data
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Initialize AI
    const zai = await ZAI.create();

    // Define tone descriptions
    const toneDescriptions = {
      professional: 'professionnel, formel et respectueux',
      enthusiastic: 'enthousiaste, passionné et dynamique',
      creative: 'créatif, original et mémorable',
    };

    // Define system prompt based on language
    const systemPrompt = language === 'ar'
      ? `أنت خبير في كتابة رسائل التقديم المميزة التي تحصل على مقابلات العمل.
        
        اكتب رسالة تقديم مخصصة بناءً على:
        - معلومات المرشح (الاسم، المهارات، الخبرات)
        - متطلبات الوظيفة
        - النغمة المحددة: ${tone}
        
        يجب أن ترد بتنسيق JSON فقط:
        {
          "subject": "عنوان البريد الإلكتروني",
          "greeting": "التحية المناسبة",
          "body": "محتوى الرسالة الرئيسي (3-4 فقرات)",
          "closing": "الخاتمة",
          "signature": "التوقيع",
          "fullLetter": "الرسالة الكاملة منسقة"
        }
        
        اجعل الرسالة مقنعة ومخصصة للوظيفة المحددة.`
      : `Tu es un expert en rédaction de lettres de motivation percutantes qui décrochent des entretiens.
        
        Rédige une lettre de motivation personnalisée basée sur:
        - Les informations du candidat (nom, compétences, expériences)
        - Les exigences du poste
        - Le ton spécifié: ${toneDescriptions[tone]}
        
        Tu DOIS répondre UNIQUEMENT en format JSON:
        {
          "subject": "Objet de l'email",
          "greeting": "Formule de salutation appropriée",
          "body": "Corps principal de la lettre (3-4 paragraphes)",
          "closing": "Formule de politesse",
          "signature": "Signature",
          "fullLetter": "Lettre complète formatée"
        }
        
        Rends la lettre convaincante et personnalisée pour le poste spécifique.`;

    const candidateInfo = [
      `Nom: ${user.name || 'Candidat'}`,
      user.careerIdentity ? `Super-pouvoir: ${user.careerIdentity.superPower}` : '',
      user.careerIdentity ? `Mission: ${user.careerIdentity.mission}` : '',
      `Compétences techniques: ${user.skills.map(s => s.skill.name).join(', ')}`,
      `Points forts: ${user.pepites.map(p => p.pepite.name).join(', ')}`,
      customPoints.length > 0 ? `Points à mentionner: ${customPoints.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const jobInfo = [
      `Titre du poste: ${job.title}`,
      `Entreprise: ${job.company}`,
      job.location ? `Lieu: ${job.location}` : '',
      job.description ? `Description: ${job.description.substring(0, 500)}...` : '',
      `Compétences requises: ${job.skills.map(s => s.skill.name).join(', ')}`,
      job.salaryMin && job.salaryMax 
        ? `Salaire: ${job.salaryMin} - ${job.salaryMax} ${job.currency}` 
        : '',
    ].filter(Boolean).join('\n');

    const userPrompt = language === 'ar'
      ? `اكتب رسالة تقديم للمرشح التالي:\n${candidateInfo}\n\nللوظيفة التالية:\n${jobInfo}`
      : `Rédige une lettre de motivation pour le candidat suivant:\n${candidateInfo}\n\nPour le poste suivant:\n${jobInfo}`;

    // Call AI for cover letter generation
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
        { success: false, error: 'Failed to generate cover letter' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let coverLetter: CoverLetterResult;
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
      coverLetter = JSON.parse(cleanResponse.trim());
    } catch {
      console.error('Failed to parse AI response:', responseContent);
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Check if user already has an application for this job
    const existingApplication = await db.jobApplication.findFirst({
      where: { userId, jobId },
    });

    // Save cover letter to job application
    if (existingApplication) {
      await db.jobApplication.update({
        where: { id: existingApplication.id },
        data: { coverLetter: coverLetter.fullLetter },
      });
    } else {
      await db.jobApplication.create({
        data: {
          userId,
          jobId,
          status: 'saved',
          coverLetter: coverLetter.fullLetter,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...coverLetter,
        jobId,
        jobTitle: job.title,
        company: job.company,
        generatedAt: new Date().toISOString(),
      },
      message: language === 'ar' 
        ? 'تم إنشاء رسالة التقديم بنجاح' 
        : 'Lettre de motivation générée avec succès',
    });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
