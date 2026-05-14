import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ZAISDK from "z-ai-web-dev-sdk";

// ── Rate limiting (in-memory) ────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Validation ──────────────────────────────────────────────────────────────

const refineObjetSchema = z.object({
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne doit pas dépasser 2000 caractères"),
  companyType: z
    .enum(["SASU", "SAS", "SARL", "EURL", "Micro-entreprise", "Auto-entrepreneur"])
    .optional()
    .default("SASU"),
});

// ── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un juriste d'entreprise français. Aide à formuler l'objet social d'une société de manière précise, complète et juridiquement correcte.

Règles :
- Formule toujours l'objet social avec "La société a pour objet :" comme introduction
- Utilise un langage juridique précis et professionnel
- Inclue les activités principales ET les activités connexes
- Termine systématiquement par une clause générale : "et plus généralement, toutes opérations commerciales, industrielles, financières, mobilières ou immobilières pouvant se rattacher directement ou indirectement à l'objet social ci-dessus ou susceptible d'en faciliter l'extension ou le développement."
- Reste concis mais complet (3-6 phrases)
- Réponds UNIQUEMENT avec le texte reformulé, sans commentaire ni explication`;

// ── POST: Refine business activity description ──────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trop de requêtes. Veuillez réessayer dans quelques instants.",
        },
        { status: 429 },
      );
    }

    // Parse & validate body
    const body = await request.json();
    const parsed = refineObjetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: parsed.error.issues.map((issue) => ({
            field: String(issue.path.join(".")),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { description, companyType } = parsed.data;

    // Build user prompt
    const userPrompt = `Formule l'objet social juridique à partir de la description suivante pour une société de type ${companyType} :

"${description}"

Rédige uniquement l'objet social reformulé, commençant par "La société a pour objet :".`;

    // Call LLM via z-ai-web-dev-sdk
    const sdk = await ZAISDK.create({});
    const completion = await sdk.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    });

    const rawContent = completion.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        {
          success: false,
          error: "Le modèle n'a pas pu reformuler l'objet social. Veuillez réessayer.",
        },
        { status: 502 },
      );
    }

    // Clean up: strip markdown code fences if present
    let refined = rawContent.trim();
    refined = refined.replace(/^```(?:markdown)?\s*\n?/i, "");
    refined = refined.replace(/\n?```\s*$/i, "");
    refined = refined.trim();

    return NextResponse.json({
      success: true,
      refined,
    });
  } catch (error) {
    console.error("[statuts/refine-objet] Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erreur serveur lors de la reformulation de l'objet social.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
