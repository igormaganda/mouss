import { NextRequest, NextResponse } from "next/server";

// Z.Ai API configuration - Environment variables only (no hardcoded tokens)
const ANTHROPIC_AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN;
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || "https://api.z.ai/api/anthropic";

interface CVAssistRequest {
  section: string;
  context: string;
  currentData?: Record<string, unknown>;
  language?: "fr" | "ar";
}

export async function POST(request: NextRequest) {
  try {
    // Verify API token is configured
    if (!ANTHROPIC_AUTH_TOKEN) {
      console.error("ANTHROPIC_AUTH_TOKEN not configured");
      return NextResponse.json(
        { success: false, error: "Service non configuré. Contactez l'administrateur." },
        { status: 503 }
      );
    }

    const body = await request.json() as CVAssistRequest;
    const { section, context, currentData, language = "fr" } = body;

    // Build prompt based on section
    const systemPrompt = buildSystemPrompt(section, language);
    const userPrompt = buildUserPrompt(section, context, currentData, language);

    // Call Z.Ai API (Claude Opus 4)
    const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_AUTH_TOKEN,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Z.Ai API error:", errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.content?.[0]?.text || "";

    return NextResponse.json({
      success: true,
      suggestion,
      section,
    });
  } catch (error) {
    console.error("CV Assist API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(section: string, language: "fr" | "ar"): string {
  const isFrench = language === "fr";

  const prompts: Record<string, string> = {
    summary: isFrench
      ? `Tu es un expert en rédaction de CV et de profils professionnels. Ton rôle est d'aider à créer des résumés professionnels percutants et mémorables.
         
         Règles:
         - Le résumé doit faire 3-5 lignes maximum
         - Utilise des verbes d'action forts
         - Met en valeur les accomplissements uniques
         - Adapte le ton au secteur d'activité
         - Évite les clichés et les phrases génériques
         - Utilise des mots-clés pertinents pour le SEO de CV`
      : `أنت خبير في كتابة السير الذاتية والملفات المهنية. دورك هو المساعدة في إنشاء ملخصات مهنية مؤثرة ولا تُنسى.
         
         القواعد:
         - يجب أن يكون الملخص 3-5 أسطر كحد أقصى
         - استخدم أفعال قوية
         - أبرز الإنجازات الفريدة
         - كن محترفاً وموجزاً`,

    experience: isFrench
      ? `Tu es un expert en rédaction d'expériences professionnelles pour CV. Ton rôle est d'aider à décrire les postes de manière impactante.
         
         Règles:
         - Utilise des verbes d'action au passé composé
         - Quantifie les résultats quand possible (%, chiffres)
         - Structure: Action → Résultat → Impact
         - Maximum 3-5 points par expérience
         - Focus sur les accomplissements, pas les tâches`
      : `أنت خبير في كتابة الخبرات المهنية للسير الذاتية. دورك هو المساعدة في وصف المناصب بشكل مؤثر.
         
         القواعد:
         - استخدم أفعال قوية
         - كمّم النتائج عندما يكون ذلك ممكناً
         - ركز على الإنجازات وليس المهام`,

    skills: isFrench
      ? `Tu es un expert en identification et formulation de compétences professionnelles.
         
         Règles:
         - Propose des compétences pertinentes pour le poste
         - Classe les compétences par catégorie (technique, soft skills, etc.)
         - Utilise la terminologie standard du secteur`
      : `أنت خبير في تحديد وصياغة المهارات المهنية.`,

    project: isFrench
      ? `Tu es un expert en description de projets professionnels.
         
         Règles:
         - Décris le contexte, l'action et les résultats
         - Mentionne les technologies utilisées
         - Sois concis mais impactant`
      : `أنت خبير في وصف المشاريع المهنية.`,

    default: isFrench
      ? `Tu es un expert en rédaction de CV et documents professionnels. Aide l'utilisateur à améliorer son contenu de manière professionnelle et impactante.`
      : `أنت خبير في كتابة السير الذاتية والمستندات المهنية.`,
  };

  return prompts[section] || prompts.default;
}

function buildUserPrompt(
  section: string,
  context: string,
  currentData: Record<string, unknown> | undefined,
  language: "fr" | "ar"
): string {
  const isFrench = language === "fr";

  // Add context about current CV data
  let dataContext = "";
  if (currentData) {
    const personalInfo = currentData.personalInfo as Record<string, string> | undefined;
    if (personalInfo) {
      dataContext = isFrench
        ? `\n\nInformations sur le profil:\n- Nom: ${personalInfo.firstName || ""} ${personalInfo.lastName || ""}\n- Email: ${personalInfo.email || ""}\n- Localisation: ${personalInfo.location || ""}\n- Résumé actuel: ${personalInfo.summary || "Non renseigné"}`
        : `\n\nمعلومات الملف:\n- الاسم: ${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`;
    }
  }

  const prompts: Record<string, string> = {
    summary: isFrench
      ? `Aide-moi à rédiger un résumé professionnel percutant pour mon CV.
         
         Contexte: ${context}
         ${dataContext}
         
         Propose un résumé professionnel impactant de 3-5 lignes qui met en valeur mon profil unique.`
      : `ساعدني في كتابة ملخص مهني مؤثر لسيرتي الذاتية.
         
         السياق: ${context}
         ${dataContext}
         
         اقترح ملخصاً مهنياً مؤثراً من 3-5 أسطر.`,

    experience: isFrench
      ? `Aide-moi à rédiger la description de mon expérience professionnelle.
         
         ${context}
         ${dataContext}
         
         Propose une description impactante avec 3-5 points utilisant des verbes d'action et si possible des résultats chiffrés.`
      : `ساعدني في كتابة وصف خبرتي المهنية.
         
         ${context}`,

    skills: isFrench
      ? `Suggère des compétences pertinentes basées sur ce contexte:
         
         ${context}
         ${dataContext}
         
         Propose une liste de 5-10 compétences pertinentes avec leur niveau suggéré.`
      : `اقترح مهارات ذات صلة بناءً على هذا السياق:`,

    project: isFrench
      ? `Aide-moi à décrire ce projet professionnel:
         
         ${context}
         ${dataContext}
         
         Propose une description structurée avec le contexte, les actions réalisées et les résultats obtenus.`
      : `ساعدني في وصف هذا المشروع المهني:`,

    default: isFrench
      ? `Aide-moi à améliorer cette section de mon CV:
         
         Section: ${section}
         Contexte: ${context}
         ${dataContext}`
      : `ساعدني في تحسين هذا القسم من سيرتي الذاتية:`,
  };

  return prompts[section] || prompts.default;
}
