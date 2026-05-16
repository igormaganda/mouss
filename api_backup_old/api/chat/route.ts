import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import ZAISDK from "z-ai-web-dev-sdk";

// ── Validation ──────────────────────────────────────────────────────────────

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
    }),
  ).min(1),
  sessionId: z.string().optional(),
});

// ── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un expert en création d'entreprise en France, spécialisé dans les métiers réglementés. Tu aides les entrepreneurs sur les sujets suivants:

1. MÉTIERS RÉGLEMENTÉS (TA SPÉCIALITÉ): Si l'utilisateur mentionne un métier réglementé (médecin, infirmier, pharmacien, dentiste, avocat, notaire, expert-comptable, agent immobilier, restaurateur, boucher, taxi/VTC, coiffeur, esthéticienne, coach sportif, artisan BTP, architecte, diagnostiqueur, etc.), tu DOIS:
- Identifier le métier réglementé concerné
- Mentionner l'autorité de régulation (Ordre, Préfecture, ORIAS, COFRAC...)
- Lister les diplômes/certifications obligatoires
- Expliquer les démarches administratives spécifiques
- Recommander les outils adaptés au secteur
- Suggérer les services d'accompagnement pertinents
- Rediriger vers la page dédiée: /metiers-reglementes/[slug]

2. CRÉATION D'ENTREPRISE: statut juridique (SASU, EURL, SARL, auto-entrepreneur), formalités de création
3. OUTILS B2B: banque pro, comptabilité, assurance, marketing, CRM - recommande des outils spécifiques au secteur
4. GESTION: fiscalité, social, juridique, RH

RÈGLES:
- Réponds en français, de manière claire et structurée
- Si un métier réglementé est mentionné, mets en avant les obligations spécifiques AVANT les conseils généraux
- Quand c'est pertinent, redirige vers la page dédiée du métier sur crea-entreprise.fr/metiers-reglementes/[slug]
- Tu peux recommander des outils du site crea-entreprise.fr quand c'est pertinent
- Sois précis sur les autorités, diplômes et démarches`;

// ── POST: Chat with AI ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? ((session.user as Record<string, unknown>).id as string) : null;

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { messages, sessionId } = parsed.data;
    const currentSessionId = sessionId || `session_${Date.now()}`;

    // Extract the last user message for saving
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    // Build messages for LLM: system + conversation history
    const llmMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Initialize SDK and call chat completions
    const sdk = await ZAISDK.create({});
    const response = await sdk.chat.completions.create({
      messages: llmMessages,
    });

    // Extract message content from OpenAI-compatible response
    const aiMessage =
      response?.choices?.[0]?.message?.content
      ?? JSON.stringify(response);

    // Save messages to database if user is logged in
    if (userId) {
      const saveOps: Array<Promise<unknown>> = [];

      if (lastUserMessage) {
        saveOps.push(
          db.chatMessage.create({
            data: {
              userId,
              sessionId: currentSessionId,
              role: "user",
              content: lastUserMessage.content,
            },
          }),
        );
      }

      saveOps.push(
        db.chatMessage.create({
          data: {
            userId,
            sessionId: currentSessionId,
            role: "assistant",
            content: aiMessage,
          },
        }),
      );

      await Promise.all(saveOps);
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
