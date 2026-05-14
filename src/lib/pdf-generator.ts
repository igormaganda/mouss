// ═══════════════════════════════════════════════════════════════
// PDF GENERATOR — Audit Report avec liens affiliés cliquables
// Utilise pdfmake pour générer des PDFs professionnels
// ═══════════════════════════════════════════════════════════════

import type { AuditResult } from "./audit-engine";

// Couleurs branding Créa Entreprise
const COLORS = {
  primary: "#059669",
  primaryDark: "#047857",
  rose: "#e11d48",
  roseLight: "#fff1f2",
  gray: "#6b7280",
  grayLight: "#f3f4f6",
  dark: "#111827",
  white: "#ffffff",
  emerald: "#10b981",
  amber: "#f59e0b",
  orange: "#f97316",
};

function getCategoryLabel(category: string): string {
  switch (category) {
    case "bank": return "🏦 Banque";
    case "compta": return "📊 Comptabilité";
    case "assurance": return "🛡️ Assurance";
    case "juridique": return "⚖️ Juridique";
    case "marketing": return "📢 Marketing";
    default: return "🔧 Outil";
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "bank": return "#3b82f6";
    case "compta": return "#8b5cf6";
    case "assurance": return "#f97316";
    case "juridique": return "#e11d48";
    case "marketing": return "#059669";
    default: return "#6b7280";
  }
}

export function generateAuditPdfContent(
  formData: {
    firstName: string;
    lastName?: string;
    email: string;
    profile: string;
    sector: string;
    phase: string;
  },
  result: AuditResult
) {
  const fullName = `${formData.firstName}${formData.lastName ? ` ${formData.lastName}` : ""}`;
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ─── Sections dynamiques ────────────────────────────────
  const content: any[] = [];

  // HEADER
  content.push({
    columns: [
      {
        stack: [
          { text: "CE", fontSize: 28, bold: true, color: COLORS.primary },
          { text: "Créa Entreprise", fontSize: 10, color: COLORS.gray, margin: [0, -4, 0, 0] },
        ],
        width: 80,
      },
      {
        stack: [
          { text: "RAPPORT D'AUDIT PERSONNALISÉ", fontSize: 16, bold: true, color: COLORS.dark, alignment: "right" },
          { text: dateStr, fontSize: 9, color: COLORS.gray, alignment: "right" },
        ],
        alignment: "right",
      },
    ],
    margin: [0, 0, 0, 20],
  });

  // Séparateur
  content.push({
    canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: COLORS.primary }],
    margin: [0, 0, 0, 20],
  });

  // DESTINATAIRE
  content.push({
    text: [
      { text: "Audit réalisé pour ", fontSize: 11, color: COLORS.gray },
      { text: fullName, fontSize: 14, bold: true, color: COLORS.dark },
      { text: ` — ${formData.email}`, fontSize: 10, color: COLORS.gray },
    ],
    margin: [0, 0, 0, 20],
  });

  // SCORE
  const scoreColor = result.scoreColor === "emerald" ? COLORS.emerald
    : result.scoreColor === "amber" ? COLORS.amber
    : result.scoreColor === "orange" ? COLORS.orange
    : COLORS.rose;

  content.push({
    table: {
      widths: ["*"],
      body: [[{
        stack: [
          { text: "VOTRE SCORE DE MATURITÉ", fontSize: 10, bold: true, color: COLORS.gray, alignment: "center" },
          { text: `${result.score}/100`, fontSize: 42, bold: true, color: scoreColor, alignment: "center", margin: [0, 4, 0, 4] },
          { text: result.scoreLabel, fontSize: 11, color: COLORS.gray, alignment: "center" },
        ],
        fillColor: COLORS.grayLight,
        margin: [20, 15, 20, 15],
      }]],
    },
    layout: { hLineWidth: () => 0, vLineWidth: () => 0 },
    margin: [0, 0, 0, 15],
  });

  // RÉSUMÉ
  content.push({
    text: "RÉSUMÉ DE VOTRE SITUATION",
    fontSize: 13,
    bold: true,
    color: COLORS.dark,
    margin: [0, 10, 0, 8],
  });

  content.push({
    text: result.summary,
    fontSize: 10,
    color: COLORS.dark,
    lineHeight: 1.5,
    margin: [0, 0, 0, 15],
  });

  // ÉCONOMIES ESTIMÉES
  content.push({
    table: {
      widths: ["*"],
      body: [[{
        stack: [
          { text: "💰 ÉCONOMIES ESTIMÉES", fontSize: 11, bold: true, color: COLORS.primary },
          { text: `En suivant nos recommandations, vous pourriez économiser jusqu'à ${result.estimatedSavings} sur vos frais de gestion.`, fontSize: 10, color: COLORS.dark, margin: [0, 4, 0, 0] },
        ],
        fillColor: "#ecfdf5",
        margin: [15, 12, 15, 12],
      }]],
    },
    layout: { hLineWidth: () => 0, vLineWidth: () => 0 },
    margin: [0, 0, 0, 15],
  });

  // ALERTES RÉGLEMENTAIRES
  if (result.isRegulated && result.regulatoryAlerts.length > 0) {
    content.push({
      table: {
        widths: ["*"],
        body: [[{
          stack: [
            { text: "⚠️ ALERTE — SECTEUR RÉGLEMENTÉ", fontSize: 11, bold: true, color: COLORS.rose },
            ...result.regulatoryAlerts.map((alert) => ({
              text: `• ${alert}`,
              fontSize: 9,
              color: COLORS.dark,
              margin: [0, 3, 0, 0],
            })),
            ...(result.regulatedWarning ? [
              { text: "\nObligations principales :", fontSize: 9, bold: true, color: COLORS.dark, margin: [0, 6, 0, 3] },
              ...result.regulatedWarning.requirements.map((req) => ({
                text: `  ✓ ${req}`,
                fontSize: 9,
                color: COLORS.dark,
                margin: [0, 2, 0, 0],
              })),
            ] : []),
          ],
          fillColor: COLORS.roseLight,
          margin: [15, 12, 15, 12],
        }]],
      },
      layout: { hLineWidth: () => 0, vLineWidth: () => 0 },
      margin: [0, 0, 0, 15],
    });
  }

  // RECOMMANDATIONS PRIORITAIRES
  if (result.recommendations.prioritaires.length > 0) {
    content.push({
      text: "🔴 RECOMMANDATIONS PRIORITAIRES",
      fontSize: 13,
      bold: true,
      color: COLORS.rose,
      margin: [0, 15, 0, 10],
    });

    result.recommendations.prioritaires.forEach((tool) => {
      content.push(createToolCard(tool, true));
    });
  }

  // RECOMMANDATIONS ESSENTIELLES
  if (result.recommendations.essentielles.length > 0) {
    content.push({
      text: "🟢 OUTILS ESSENTIELS",
      fontSize: 13,
      bold: true,
      color: COLORS.primary,
      margin: [0, 15, 0, 10],
    });

    result.recommendations.essentielles.forEach((tool) => {
      content.push(createToolCard(tool, false));
    });
  }

  // RECOMMANDATIONS OPTIONNELLES
  if (result.recommendations.optionnelles.length > 0) {
    content.push({
      text: "🔵 POUR ALLER PLUS LOIN",
      fontSize: 13,
      bold: true,
      color: "#3b82f6",
      margin: [0, 15, 0, 10],
    });

    result.recommendations.optionnelles.forEach((tool) => {
      content.push(createToolCard(tool, false));
    });
  }

  // PROCHAINES ÉTAPES
  content.push({
    text: "PROCHAINES ÉTAPES",
    fontSize: 13,
    bold: true,
    color: COLORS.dark,
    margin: [0, 15, 0, 10],
  });

  content.push({
    ol: result.nextSteps.map((step) => ({
      text: step,
      fontSize: 10,
      color: COLORS.dark,
      margin: [0, 3, 0, 3],
    })),
    margin: [10, 0, 0, 15],
  });

  // FOOTER
  content.push({
    canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: COLORS.grayLight }],
    margin: [0, 20, 0, 10],
  });

  content.push({
    columns: [
      {
        stack: [
          { text: "Georges Ernest Conseil, SAS", fontSize: 8, bold: true, color: COLORS.gray },
          { text: "SIREN 830693032 — contact@crea-entreprise.fr", fontSize: 7, color: COLORS.gray },
        ],
      },
      {
        text: "Audit généré par Créa Entreprise — crea-entreprise.fr", fontSize: 7, color: COLORS.gray, alignment: "right", margin: [0, 4, 0, 0],
      },
    ],
  });

  content.push({
    text: "Les liens vers les outils partenaires dans ce rapport sont des liens affiliés. Créa Entreprise peut percevoir une commission si vous souscrivez via ces liens, sans aucun surcoût pour vous.",
    fontSize: 7,
    color: COLORS.gray,
    margin: [0, 8, 0, 0],
    italics: true,
  });

  return {
    content,
    defaultStyle: {
      fontSize: 10,
      color: COLORS.dark,
    },
    pageSize: "A4" as const,
    pageMargins: [40, 40, 40, 40],
    styles: {
      toolName: {
        fontSize: 12,
        bold: true,
        color: COLORS.dark,
      },
      toolTagline: {
        fontSize: 9,
        color: COLORS.gray,
      },
    },
  };
}

function createToolCard(tool: any, isPriority: boolean) {
  const prosText = tool.pros ? tool.pros.map((p: string) => `  ✅ ${p}`).join("\n") : "";
  const consText = tool.cons ? tool.cons.map((c: string) => `  ⚠️ ${c}`).join("\n") : "";

  return {
    table: {
      widths: ["*"],
      body: [[{
        stack: [
          {
            columns: [
              {
                stack: [
                  { text: `${getCategoryLabel(tool.category)}  ${tool.name}`, fontSize: 11, bold: true, color: COLORS.dark },
                  { text: tool.tagline, fontSize: 9, color: COLORS.gray, margin: [0, 2, 0, 4] },
                  {
                    text: `${tool.pricing}`,
                    fontSize: 10,
                    bold: true,
                    color: COLORS.primary,
                  },
                ],
                width: "*",
              },
              {
                stack: [
                  {
                    text: `Découvrir →`,
                    fontSize: 10,
                    bold: true,
                    color: COLORS.white,
                    alignment: "center",
                    margin: [0, 4, 0, 4],
                  },
                ],
                fillColor: isPriority ? COLORS.rose : COLORS.primary,
                margin: [15, 0, 0, 0],
                width: 80,
                link: tool.affiliateUrl,
              },
            ],
          },
          ...(tool.whyRecommended ? [
            { text: `💡 ${tool.whyRecommended}`, fontSize: 9, color: COLORS.dark, margin: [0, 6, 0, 4], italics: true },
          ] : []),
          ...(prosText ? [
            { text: "Avantages :", fontSize: 8, bold: true, color: COLORS.dark, margin: [0, 4, 0, 1] },
            { text: prosText, fontSize: 8, color: COLORS.dark, lineHeight: 1.3 },
          ] : []),
          ...(consText ? [
            { text: "Points de vigilance :", fontSize: 8, bold: true, color: COLORS.gray, margin: [0, 4, 0, 1] },
            { text: consText, fontSize: 8, color: COLORS.gray, lineHeight: 1.3 },
          ] : []),
        ],
        fillColor: isPriority ? "#fef2f2" : COLORS.white,
        margin: [12, 10, 12, 10],
        borderColor: isPriority ? COLORS.rose : "#e5e7eb",
      }]],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => (isPriority ? COLORS.rose : "#e5e7eb"),
      vLineColor: () => (isPriority ? COLORS.rose : "#e5e7eb"),
    },
    margin: [0, 0, 0, 8],
  };
}

// ─── GENERATE PDF AS BASE64 BUFFER ──────────────────────────

export async function generateAuditPdfBuffer(
  formData: {
    firstName: string;
    lastName?: string;
    email: string;
    profile: string;
    sector: string;
    phase: string;
  },
  result: AuditResult
): Promise<Buffer> {
  // Dynamic import to avoid SSR issues
  const PdfPrinter = (await import("pdfmake")).default;

  // Use standard fonts (built-in)
  const docDefinition = generateAuditPdfContent(formData, result);

  // Create PDF
  return new Promise((resolve, reject) => {
    const pdfDocGenerator = PdfPrinter.createPdf(docDefinition as any);
    const chunks: Buffer[] = [];

    pdfDocGenerator.getBuffer((buffer: Buffer) => {
      resolve(buffer);
    });
  });
}
