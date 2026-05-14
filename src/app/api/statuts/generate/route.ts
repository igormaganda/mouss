import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ZAISDK from "z-ai-web-dev-sdk";

// ── Rate limiting (in-memory) ────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;

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

const associateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom de l'associé est requis"),
  email: z.string().email("Email invalide"),
  parts: z.number().int().min(1, "Le nombre de parts/actions doit être ≥ 1"),
});

const clausesSchema = z.object({
  agreement: z.boolean(),
  preemption: z.boolean(),
  inalienability: z.boolean(),
  exclusion: z.boolean(),
  confidentiality: z.boolean(),
});

const generateSchema = z.object({
  companyType: z.enum(["SASU", "SAS", "SARL", "EURL", "Micro-entreprise", "Auto-entrepreneur"]),
  companyName: z.string().min(1, "La dénomination sociale est requise"),
  tradeName: z.string().optional().default(""),
  acronym: z.string().optional().default(""),
  address: z.string().min(1, "L'adresse du siège social est requise"),
  postalCodeCity: z.string().min(1, "Le code postal et la ville sont requis"),
  domiciliationType: z.enum(["personnelle", "bureau", "coworking", "pepiniere"]).optional(),
  businessActivity: z.string().min(10, "L'objet social doit contenir au moins 10 caractères"),
  capital: z.number().min(0),
  shareCount: z.number().int().min(0),
  nominalValue: z.number().min(0),
  associates: z.array(associateSchema),
  directorName: z.string().min(1, "Le nom du dirigeant est requis"),
  directorBirthDate: z.string().min(1, "La date de naissance du dirigeant est requise"),
  directorAddress: z.string().optional().default(""),
  directorNationality: z.string().min(1, "La nationalité du dirigeant est requise"),
  directorRole: z.string().optional().default(""),
  isFounder: z.boolean().optional().default(true),
  clauses: clausesSchema,
  customClauses: z.string().optional().default(""),
});

// ── System prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un expert juriste français spécialisé en droit des sociétés. Tu rédiges des statuts de société complets et conformes au droit français en vigueur. Tu utilises un langage juridique précis et professionnel, mais accessible. Tu inclues toutes les clauses obligatoires selon la forme juridique choisie, ainsi que les clauses particulières demandées.

Règles de rédaction :
- Rédige en français avec la terminologie juridique appropriée
- Structure le document avec des titres et articles numérotés
- Adapte le contenu à la forme juridique (SASU, SAS, SARL, EURL)
- Utilise "parts sociales" pour SARL/EURL et "actions" pour SAS/SASU
- Intègre toutes les informations fournies par l'utilisateur
- Pour une Micro-entreprise ou Auto-entrepreneur, rédige un document informatif décrivant le régime plutôt que des statuts`;

// ── Helper: build user prompt from form data ────────────────────────────────

function buildUserPrompt(data: z.infer<typeof generateSchema>): string {
  const isSASLike = data.companyType === "SAS" || data.companyType === "SASU";
  const isSARLLike = data.companyType === "SARL" || data.companyType === "EURL";
  const isMicro = data.companyType === "Micro-entreprise" || data.companyType === "Auto-entrepreneur";

  const shareLabel = isSASLike ? "actions" : "parts sociales";

  // Selected clauses
  const selectedClauses: string[] = [];
  if (data.clauses.agreement) selectedClauses.push("Clause d'agrément");
  if (data.clauses.preemption) selectedClauses.push("Clause de préemption");
  if (data.clauses.inalienability) selectedClauses.push("Clause d'inaliénabilité temporaire");
  if (data.clauses.exclusion) selectedClauses.push("Clause d'exclusion");
  if (data.clauses.confidentiality) selectedClauses.push("Clause de confidentialité");
  if (data.customClauses.trim()) selectedClauses.push(`Clause personnalisée : ${data.customClauses.trim()}`);

  // Associates
  let associateText = "";
  if (data.associates.length > 0) {
    const lines = data.associates.map(
      (a) => `- ${a.name} (${a.email}) : ${a.parts} ${shareLabel}`,
    );
    associateText = `\nRépartition des ${shareLabel} :\n${lines.join("\n")}`;
  }

  // Director role
  const directorRole = data.directorRole || (isSASLike ? "Président" : isSARLLike ? "Gérant" : "Dirigeant");

  return `Rédige les statuts complets pour la société suivante. Le document doit être en markdown et contenir TOUTES les sections obligatoires.

## Informations de la société

- **Forme juridique** : ${data.companyType}${data.companyType === "SASU" ? " (Société par Actions Simplifiée Unipersonnelle)" : data.companyType === "SAS" ? " (Société par Actions Simplifiée)" : data.companyType === "SARL" ? " (Société à Responsabilité Limitée)" : data.companyType === "EURL" ? " (Entreprise Unipersonnelle à Responsabilité Limitée)" : ""}
- **Dénomination sociale** : ${data.companyName}
${data.tradeName ? `- **Nom commercial** : ${data.tradeName}` : ""}
${data.acronym ? `- **Sigle** : ${data.acronym}` : ""}
- **Siège social** : ${data.address}, ${data.postalCodeCity}
${data.domiciliationType ? `- **Type de domiciliation** : ${data.domiciliationType}` : ""}
- **Objet social** : ${data.businessActivity}

${!isMicro ? `
## Capital social

- **Capital** : ${data.capital.toLocaleString("fr-FR")} €
- **Nombre de ${shareLabel}** : ${data.shareCount}
- **Valeur nominale unitaire** : ${data.nominalValue.toFixed(2)} €
${associateText}
` : ""}

## Dirigeant

- **Nom** : ${data.directorName}
- **Date de naissance** : ${data.directorBirthDate}
${data.directorAddress ? `- **Adresse personnelle** : ${data.directorAddress}` : ""}
- **Nationalité** : ${data.directorNationality}
- **Fonction** : ${directorRole}
- **Fondateur** : ${data.isFounder ? "Oui" : "Non"}

## Clauses particulières${selectedClauses.length > 0 ? ` (${selectedClauses.length})` : ""}

${selectedClauses.length > 0 ? selectedClauses.map((c) => `- ${c}`).join("\n") : "Aucune clause particulière demandée."}

---

## Structure attendue du document

Rédige un document markdown complet comprenant :

1. **STATUTS** — Document complet avec tous les articles obligatoires :
   - Dispositions générales (forme, dénomination, objet, durée, siège)
   - Capital social (${!isMicro ? `montant, ${shareLabel}, libération` : "non applicable"})
   - ${isMultiAssociateCompany(data.companyType) ? "Associés et droits" : "Associé unique"}
   - Direction et gestion
   - Décisions collectives (${data.companyType === "SASU" || data.companyType === "EURL" ? "décisions de l'associé unique" : "assemblées générales"})
   - Exercice social, comptes, résultats
   - Modifications des statuts
   - Dissolution et liquidation
   - ${selectedClauses.length > 0 ? "Clauses particulières" : ""}
   - Dispositions diverses

2. **PV D'ASSEMBLÉE GÉNÉRALE CONSTITUTIVE** — Procès-verbal de constitution de la société

3. **ATTESTATION DE NON-CONDAMNATION** — Attestation sur l'honneur du dirigeant

${isMicro ? "\n**Note** : Pour un régime " + data.companyType + ", rédige un document informatif et non des statuts au sens strict, car ce régime ne crée pas de personne morale." : ""}

Réponds UNIQUEMENT avec le document en markdown, sans commentaires additionnels.`;
}

function isMultiAssociateCompany(type: string): boolean {
  return type === "SAS" || type === "SARL";
}

// ── Helper: parse LLM response into statuts + pvAg sections ─────────────────

function parseResponse(raw: string): { statuts: string; pvAg: string } {
  // Try to split on PV section heading
  const pvHeadingPatterns = [
    /^#\s*PROC[EÈ]S[- ]VERBAL/i,
    /^##\s*PROC[EÈ]S[- ]VERBAL/i,
    /^#\s*PV\s/i,
    /^##\s*PV\s/i,
  ];

  let pvAgIndex = -1;
  for (const pattern of pvHeadingPatterns) {
    const match = raw.match(pattern);
    if (match && match.index !== undefined) {
      pvAgIndex = match.index;
      break;
    }
  }

  if (pvAgIndex > 0) {
    return {
      statuts: raw.slice(0, pvAgIndex).trim(),
      pvAg: raw.slice(pvAgIndex).trim(),
    };
  }

  // If no PV section found, return everything as statuts
  return { statuts: raw.trim(), pvAg: "" };
}

// ── POST: Generate statutes ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Veuillez réessayer dans quelques instants." },
        { status: 429 },
      );
    }

    // Parse & validate body
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

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

    const formData = parsed.data;

    // Build prompts
    const userPrompt = buildUserPrompt(formData);

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
        { success: false, error: "Le modèle n'a pas pu générer les statuts. Veuillez réessayer." },
        { status: 502 },
      );
    }

    // Parse response into sections
    const { statuts, pvAg } = parseResponse(rawContent);

    // Build title
    const title = `Statuts - ${formData.companyName} - ${formData.companyType}`;

    return NextResponse.json({
      success: true,
      statuts,
      pvAg,
      title,
    });
  } catch (error) {
    console.error("[statuts/generate] Error:", error);

    const message =
      error instanceof Error ? error.message : "Erreur serveur lors de la génération des statuts.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
