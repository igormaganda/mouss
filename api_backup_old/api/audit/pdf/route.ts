import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const pdfRequestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = pdfRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const { email } = result.data;

    const lead = await db.lead.findUnique({
      where: { email },
      include: { AuditResult: true },
    });

    if (!lead?.AuditResult) {
      return NextResponse.json(
        { error: "Aucun audit trouvé pour cet email" },
        { status: 404 }
      );
    }

    const audit = lead.AuditResult;
    const recs = audit.recommendations as any || {};
    const profileLabels: Record<string, string> = {
      etudiant: "Étudiant Entrepreneur",
      salarie: "Salarié en Transition",
      freelance: "Freelance / Auto-entrepreneur",
      "tpe-pme": "TPE / PME",
    };

    // Generate HTML report that can be printed as PDF
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Audit Créa Entreprise — ${lead.firstName || "Utilisateur"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
  .brand { font-size: 28px; font-weight: 800; color: #059669; }
  .date { font-size: 12px; color: #6b7280; text-align: right; }
  .dest { margin-bottom: 30px; font-size: 14px; color: #374151; }
  .dest strong { color: #111827; }
  .score-box { text-align: center; padding: 30px; background: #f3f4f6; border-radius: 16px; margin-bottom: 30px; }
  .score-number { font-size: 56px; font-weight: 800; color: ${audit.score >= 70 ? "#10b981" : audit.score >= 40 ? "#f59e0b" : "#ef4444"}; }
  .score-label { font-size: 14px; color: #6b7280; margin-top: 8px; }
  .section { margin-bottom: 30px; }
  .section-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
  .summary-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 30px; font-size: 14px; line-height: 1.6; }
  .savings-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 30px; }
  .savings-box .amount { font-size: 24px; font-weight: 700; color: #059669; }
  .savings-box .desc { font-size: 13px; color: #374151; margin-top: 4px; }
  .alert-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; margin-bottom: 30px; }
  .alert-box h3 { font-size: 15px; font-weight: 700; color: #e11d48; margin-bottom: 8px; }
  .alert-box ul { list-style: none; padding: 0; }
  .alert-box li { font-size: 13px; color: #9f1239; padding: 3px 0; }
  .tool-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 12px; page-break-inside: avoid; }
  .tool-card.priority { border-color: #fecdd3; background: #fff5f5; }
  .tool-name { font-size: 16px; font-weight: 700; }
  .tool-tagline { font-size: 13px; color: #6b7280; margin-top: 2px; }
  .tool-link { display: inline-block; margin-top: 8px; padding: 8px 20px; background: #059669; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
  .tool-link:hover { background: #047857; }
  .tool-pros { font-size: 12px; color: #374151; margin-top: 8px; }
  .steps { counter-reset: step; }
  .step { display: flex; gap: 12px; padding: 8px 0; font-size: 14px; }
  .step::before { counter-increment: step; content: counter(step); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #059669; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; }
  .disclaimer { margin-top: 12px; font-size: 10px; color: #9ca3af; font-style: italic; }
  @media print { body { padding: 20px; } .tool-link { break-inside: avoid; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">CE</div>
      <div style="font-size: 10px; color: #6b7280; margin-top: -4px;">Créa Entreprise</div>
    </div>
    <div class="date">
      <strong style="font-size: 14px; color: #111827;">RAPPORT D'AUDIT PERSONNALISÉ</strong><br>
      ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
    </div>
  </div>

  <div class="dest">
    Audit réalisé pour <strong>${lead.firstName || ""} ${lead.lastName || ""}</strong> — ${email}
  </div>

  <div class="score-box">
    <div style="font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Votre score de maturité</div>
    <div class="score-number">${audit.score}/100</div>
    <div class="score-label">${recs.scoreLabel || "Évaluation entrepreneuriale"}</div>
  </div>

  <div class="summary-box">${audit.summary || "Analyse complète de votre profil entrepreneurial."}</div>

  <div class="savings-box">
    <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">💰 Économies estimées</div>
    <div class="amount">${recs.estimatedSavings || "Variable selon les outils choisis"}</div>
    <div class="desc">En suivant nos recommandations d'outils</div>
  </div>

  ${audit.isRegulated ? `
  <div class="alert-box">
    <h3>⚠️ Secteur réglementé — ${recs.regulatedProfession || audit.regulatedProfession || ""}</h3>
    <ul>
      ${(recs.regulatoryAlerts || []).map((a: string) => `<li>• ${a}</li>`).join("\n      ")}
      ${(recs.regulatedWarning?.requirements || []).map((r: string) => `<li>✓ ${r}</li>`).join("\n      ")}
    </ul>
  </div>
  ` : ""}

  ${(recs.recommendations?.prioritaires || []).length > 0 ? `
  <div class="section">
    <div class="section-title" style="color: #e11d48;">🔴 Recommandations prioritaires</div>
    ${recs.recommendations.prioritaires.map((t: any) => `
    <div class="tool-card priority">
      <div class="tool-name">${t.name} <span style="font-size: 12px; color: #6b7280; font-weight: 400;">${t.pricing}</span></div>
      <div class="tool-tagline">${t.tagline || ""}</div>
      ${t.whyRecommended ? `<p style="font-size: 12px; color: #374151; margin-top: 8px; font-style: italic;">💡 ${t.whyRecommended}</p>` : ""}
      ${(t.pros || []).length > 0 ? `<div class="tool-pros">${t.pros.slice(0, 3).map((p: string) => `✅ ${p}`).join(" | ")}</div>` : ""}
      <a href="${t.affiliateUrl}" class="tool-link" target="_blank">Découvrir →</a>
    </div>`).join("")}
  </div>
  ` : ""}

  ${(recs.recommendations?.essentielles || []).length > 0 ? `
  <div class="section">
    <div class="section-title" style="color: #059669;">🟢 Outils essentiels</div>
    ${recs.recommendations.essentielles.map((t: any) => `
    <div class="tool-card">
      <div class="tool-name">${t.name} <span style="font-size: 12px; color: #6b7280; font-weight: 400;">${t.pricing}</span></div>
      <div class="tool-tagline">${t.tagline || ""}</div>
      ${t.whyRecommended ? `<p style="font-size: 12px; color: #374151; margin-top: 8px; font-style: italic;">💡 ${t.whyRecommended}</p>` : ""}
      <a href="${t.affiliateUrl}" class="tool-link" target="_blank">Découvrir →</a>
    </div>`).join("")}
  </div>
  ` : ""}

  ${(recs.recommendations?.optionnelles || []).length > 0 ? `
  <div class="section">
    <div class="section-title" style="color: #3b82f6;">🔵 Pour aller plus loin</div>
    ${recs.recommendations.optionnelles.map((t: any) => `
    <div class="tool-card">
      <div class="tool-name">${t.name} <span style="font-size: 12px; color: #6b7280; font-weight: 400;">${t.pricing}</span></div>
      <div class="tool-tagline">${t.tagline || ""}</div>
      <a href="${t.affiliateUrl}" class="tool-link" target="_blank">Découvrir →</a>
    </div>`).join("")}
  </div>
  ` : ""}

  ${(recs.nextSteps || []).length > 0 ? `
  <div class="section">
    <div class="section-title">Prochaines étapes</div>
    <div class="steps">
      ${recs.nextSteps.map((s: string) => `<div class="step">${s}</div>`).join("\n      ")}
    </div>
  </div>
  ` : ""}

  <div class="footer">
    <div>Georges Ernest Conseil, SAS<br>SIREN 830693032 — contact@crea-entreprise.fr</div>
    <div style="text-align: right;">Audit généré par Créa Entreprise<br>crea-entreprise.fr</div>
  </div>
  <div class="disclaimer">Les liens vers les outils partenaires dans ce rapport sont des liens affiliés. Créa Entreprise peut percevoir une commission si vous souscrivez via ces liens, sans aucun surcoût pour vous.</div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="audit-crea-entreprise-${(lead.firstName || "utilisateur").toLowerCase().replace(/\s+/g, "-")}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
