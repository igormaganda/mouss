import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── AVAILABLE CATEGORIES ────────────────────────────────────────

const CATEGORIES = [
  "Création d'entreprise",
  "Banque Pro",
  "Comptabilité",
  "Assurances",
  "Marketing & Acquisition",
  "Gestion & Productivité",
] as const;

const CATEGORY_TOPICS: Record<string, string[]> = {
  "Création d'entreprise": [
    "Choix du statut juridique en France",
    "Comment créer une SASU étape par étape",
    "Guide de l'auto-entrepreneur débutant",
    "EURL vs SARL : comparatif complet",
    "Formalités d'immatriculation en ligne",
    "Capital social : combien investir pour votre création",
    "Les aides à la création d'entreprise en 2025",
    "ACRE : comment bénéficier de l'exonération de charges",
  ],
  "Banque Pro": [
    "Comparatif banques pro en ligne 2025",
    "Comment ouvrir un compte professionnel",
    "Carte bancaire professionnelle : bien choisir",
    "Terminal de paiement : quelles solutions gratuites",
    "Compte pro vs compte personnel : les différences",
    "Obtenir un prêt professionnel quand on démarre",
  ],
  "Comptabilité": [
    "Logiciels de comptabilité gratuits pour auto-entrepreneur",
    "Comment faire sa comptabilité soi-même",
    "Expert-comptable en ligne : comparatif et prix",
    "Déclarations URSSAF : guide complet",
    "Facturation : les obligations légales en France",
    "Optimiser sa comptabilité avec l'automatisation",
  ],
  "Assurances": [
    "RC Pro : obligatoire ou pas ? Guide par métier",
    "Mutuelle TNS : comment bien choisir",
    "Assurance décennale : quand est-elle requise ?",
    "Assurance perte d'emploi pour indépendant",
    "Comparatif assurances professionnelles 2025",
  ],
  "Marketing & Acquisition": [
    "Stratégie SEO pour les TPE et freelances",
    "Réseaux sociaux : quelles plateformes pour B2B",
    "Email marketing : outils et stratégies pour débuter",
    "Créer un site vitrine professionnel rapidement",
    "Google My Business : optimiser sa fiche gratuite",
    "Acquérir ses premiers clients : 10 stratégies concrètes",
  ],
  "Gestion & Productivité": [
    "Meilleurs outils de productivité pour entrepreneurs",
    "Gérer sa trésorerie : guide pratique",
    "Outils collaboratifs gratuits pour TPE",
    "Comment déléguer quand on est solo",
    "Automatiser son entreprise avec le no-code",
  ],
};

// ─── SYSTEM PROMPT FOR ARTICLE GENERATION ────────────────────────

const ARTICLE_SYSTEM_PROMPT = `Tu es un rédacteur expert en création d'entreprise et entrepreneurship français.
Tu rédiges des articles de blog professionnels, informatifs et optimisés pour le SEO.
Tes articles sont destinés au site "100 Jours Pour Entreprendre".
Tu réponds en français avec un ton professionnel mais accessible.
Chaque article doit :
- Être structuré en sections avec des titres H2 et H3
- Inclure des listes à puces pour une meilleure lisibilité
- Contenir des conseils concrets et actionnables
- Être optimisé pour le SEO avec des mots-clés pertinents
- Contenir au moins 1200 mots
- Être formaté en Markdown propre
- Inclure un paragraphe d'introduction captivant
- Se terminer par une conclusion avec un call-to-action vers l'audit gratuit du site`;

// ─── POST: Generate an article with AI ───────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, topic, customPrompt, saveToDb } = body;

    // Validate category
    if (category && !CATEGORIES.includes(category as typeof CATEGORIES[number])) {
      return NextResponse.json(
        { error: `Catégorie invalide. Catégories disponibles : ${CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const selectedCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const availableTopics = CATEGORY_TOPICS[selectedCategory as string] || CATEGORY_TOPICS["Création d'entreprise"];
    const selectedTopic = topic || availableTopics[Math.floor(Math.random() * availableTopics.length)];

    // Build the article prompt
    const userPrompt = customPrompt
      ? customPrompt
      : `Rédige un article de blog complet sur le sujet : "${selectedTopic}".
Catégorie : ${selectedCategory}.
L'article doit être optimisé pour le SEO et destiné à des entrepreneurs français qui souhaitent créer ou développer leur entreprise.`;

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
          { role: "system", content: ARTICLE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Article generation API error:", err);
      return NextResponse.json({ error: "Erreur lors de la génération de l'article" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract title from first H1 or generate one
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[*#]/g, "").trim() : selectedTopic;

    // Generate excerpt from first paragraph
    const paragraphs = content.split("\n\n").filter((p: string) => p.trim().length > 50);
    const excerpt = paragraphs[0]
      ? paragraphs[0].replace(/^#+\s+/gm, "").replace(/[*_`]/g, "").trim().substring(0, 200) + "..."
      : `Découvrez notre guide complet sur ${selectedTopic}.`;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 80) + "-" + Date.now().toString(36);

    // Get a default author (first admin user)
    const defaultAuthor = await db.user.findFirst({ where: { role: "admin" } });
    const authorId = defaultAuthor?.id || (await db.user.findFirst())?.id || "system";

    // Save to database if requested
    let savedPost = null;
    if (saveToDb) {
      try {
        savedPost = await db.post.create({
          data: {
            title,
            slug,
            excerpt,
            content,
            category: selectedCategory,
            published: false,
            authorId,
          },
          include: { author: { select: { name: true, email: true } } },
        });
      } catch (dbError) {
        console.error("Failed to save article:", dbError);
      }
    }

    return NextResponse.json({
      article: {
        title,
        slug,
        excerpt,
        content,
        category: selectedCategory,
        topic: selectedTopic,
        savedToDb: !!savedPost,
        post: savedPost,
      },
    });
  } catch (error) {
    console.error("Article generation error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la génération" }, { status: 500 });
  }
}

// ─── GET: List available topics for article generation ───────────

export async function GET() {
  return NextResponse.json({
    categories: CATEGORIES,
    topics: CATEGORY_TOPICS,
  });
}
