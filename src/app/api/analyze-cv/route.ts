import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
import { cvAnalysisSchema } from '@/lib/validations';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limiter';
import { sanitizeCVContent, logSecurityEvent } from '@/lib/sanitize';
import { logAIUsage } from '@/lib/ai-protection';

interface CVAnalysisResult {
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  experience: {
    years: number;
    positions: string[];
    companies: string[];
  };
  education: {
    degrees: string[];
    institutions: string[];
  };
  suggestedCareerPaths: string[];
  strengths: string[];
  areasForDevelopment: string[];
}

// POST /api/analyze-cv - Analyze CV text and extract skills using AI
export async function POST(request: NextRequest) {
  try {
    // 1. Get client identifier for rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // 2. Check rate limit
    const rateLimitResult = checkRateLimit(`cv:${clientIp}`, RATE_LIMIT_CONFIGS.cv);
    if (!rateLimitResult.allowed) {
      logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        details: `CV analysis rate limit exceeded`,
        ip: clientIp,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    
    const validationResult = cvAnalysisSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const { cvText, userId, language = 'fr' } = validationResult.data;

    // 4. Sanitize CV content to remove sensitive data
    const { sanitized, warnings, redactedItems } = sanitizeCVContent(cvText);
    
    if (redactedItems.length > 0) {
      logSecurityEvent({
        type: 'sensitive_data',
        severity: 'low',
        details: `Sensitive data found in CV: ${redactedItems.map(i => i.type).join(', ')}`,
        ip: clientIp,
        userId,
      });
    }

    // 5. Initialize AI
    const zai = await ZAI.create();

    // 6. Define system prompt based on language
    const systemPrompt = language === 'ar'
      ? `أنت محلل سير ذاتية خبير. قم بتحليل السيرة الذاتية واستخراج المعلومات المطلوبة.
        
        يجب أن ترد بتنسيق JSON فقط بدون أي نص إضافي:
        {
          "technicalSkills": ["مهارة تقنية 1", "مهارة تقنية 2"],
          "softSkills": ["مهارة شخصية 1", "مهارة شخصية 2"],
          "languages": ["لغة 1", "لغة 2"],
          "experience": {
            "years": عدد السنوات,
            "positions": ["منصب 1", "منصب 2"],
            "companies": ["شركة 1", "شركة 2"]
          },
          "education": {
            "degrees": ["شهادة 1", "شهادة 2"],
            "institutions": ["مؤسسة 1", "مؤسسة 2"]
          },
          "suggestedCareerPaths": ["مسار مهني مقترح 1", "مسار مهني مقترح 2"],
          "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
          "areasForDevelopment": ["مجال للتطوير 1", "مجال للتطوير 2"]
        }`
      : `Tu es un expert en analyse de CV. Analyse le CV et extrais les informations demandées.
        
        Tu DOIS répondre UNIQUEMENT en format JSON sans aucun texte supplémentaire:
        {
          "technicalSkills": ["compétence technique 1", "compétence technique 2"],
          "softSkills": ["compétence douce 1", "compétence douce 2"],
          "languages": ["langue 1", "langue 2"],
          "experience": {
            "years": nombre d'années,
            "positions": ["poste 1", "poste 2"],
            "companies": ["entreprise 1", "entreprise 2"]
          },
          "education": {
            "degrees": ["diplôme 1", "diplôme 2"],
            "institutions": ["institution 1", "institution 2"]
          },
          "suggestedCareerPaths": ["parcours suggéré 1", "parcours suggéré 2"],
          "strengths": ["point fort 1", "point fort 2"],
          "areasForDevelopment": ["domaine à développer 1", "domaine à développer 2"]
        }`;

    const userPrompt = language === 'ar'
      ? `قم بتحليل السيرة الذاتية التالية واستخراج جميع المهارات والخبرات:\n\n${sanitized}`
      : `Analyse le CV suivant et extrais toutes les compétences et expériences:\n\n${sanitized}`;

    // 7. Call AI for analysis
    const startTime = Date.now();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });
    const duration = Date.now() - startTime;

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      // Log AI failure
      if (userId) {
        await logAIUsage({
          userId,
          feature: 'cv_analysis',
          success: false,
          errorMessage: 'No response from AI',
          metadata: { duration },
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Échec de l\'analyse du CV' },
        { status: 500 }
      );
    }

    // 8. Parse JSON response
    let analysis: CVAnalysisResult;
    try {
      // Remove markdown code blocks if present
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
      analysis = JSON.parse(cleanResponse.trim());
    } catch {
      console.error('Failed to parse AI response:', responseContent);
      
      if (userId) {
        await logAIUsage({
          userId,
          feature: 'cv_analysis',
          success: false,
          errorMessage: 'Failed to parse AI response',
          metadata: { duration },
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Échec de l\'analyse de la réponse IA' },
        { status: 500 }
      );
    }

    // 9. Log successful AI usage
    if (userId) {
      await logAIUsage({
        userId,
        feature: 'cv_analysis',
        success: true,
        metadata: { duration },
      });
      
      // 10. Save extracted skills to database
      const allSkills = [...(analysis.technicalSkills || []), ...(analysis.softSkills || [])];
      
      for (const skillName of allSkills) {
        // Check if skill exists (case-insensitive search)
        const existingSkills = await db.skill.findMany({
          where: {
            name: { contains: skillName }
          }
        });
        
        let skill = existingSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());

        // Create skill if it doesn't exist
        if (!skill) {
          const isTechnical = analysis.technicalSkills?.includes(skillName);
          skill = await db.skill.create({
            data: {
              name: skillName,
              category: isTechnical ? 'Technical' : 'Soft',
            }
          });
        }

        // Add to user's skills
        await db.userSkill.upsert({
          where: {
            userId_skillId: {
              userId,
              skillId: skill.id,
            }
          },
          update: {
            source: 'cv',
          },
          create: {
            userId,
            skillId: skill.id,
            level: 1,
            source: 'cv',
          }
        });
      }
    }

    // 11. Return response with security warnings if any
    return NextResponse.json({
      success: true,
      data: {
        analysis,
        rawText: cvText,
        analyzedAt: new Date().toISOString(),
        securityWarnings: warnings.length > 0 ? warnings : undefined,
      },
      message: language === 'ar' 
        ? 'تم تحليل السيرة الذاتية بنجاح' 
        : 'CV analysé avec succès',
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      }
    });
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { success: false, error: 'Échec de l\'analyse du CV' },
      { status: 500 }
    );
  }
}
