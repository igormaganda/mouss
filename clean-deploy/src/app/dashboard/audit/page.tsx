"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  Calculator,
  Shield,
  ClipboardCheck,
  Target,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Download,
  Zap,
  Star,
  CheckCircle2,
  Lightbulb,
  FileText,
  Megaphone,
  Scale,
} from "lucide-react";
import { toast } from "sonner";

// Force dynamic rendering for this page since it's inside a layout with useSession()
export const dynamic = 'force-dynamic';

// ─── TYPES ─────────────────────────────────────────────────────

interface ToolRec {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  pricing: string;
  affiliateUrl: string;
  website: string;
  commission: number;
  rating: number;
  pros: string[];
  cons: string[];
  whyRecommended: string;
}

interface RegulatedWarning {
  profession: string;
  authority: string;
  diploma: string;
  requirements: string[];
  additionalCosts: string[];
  recommendedTools: ToolRec[];
}

interface DashboardAudit {
  auditResult: {
    id: string;
    profile: string;
    phase: string;
    painPoint: string;
    sector: string | null;
    isRegulated: boolean;
    regulatedProfession: string | null;
    score: number;
    summary: string | null;
    recommendations: any;
    regulatedWarnings: string | null;
    createdAt: string;
  } | null;
  lead: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profile: string;
    phase: string;
  } | null;
  tools: ToolRec[];
}

const PROFILE_LABELS: Record<string, string> = {
  etudiant: "Étudiant",
  salarie: "Salarié",
  freelance: "Freelance",
  "tpe-pme": "TPE / PME",
};

const PHASE_LABELS: Record<string, string> = {
  reflexion: "Phase 1 — Réflexion",
  creation: "Phase 2 — Création",
  gestion: "Phase 3 — Gestion",
  croissance: "Phase 4 — Croissance",
};

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  bank: { icon: <Building2 className="h-5 w-5" />, label: "Banque", color: "text-blue-600 bg-blue-50" },
  compta: { icon: <Calculator className="h-5 w-5" />, label: "Comptabilité", color: "text-purple-600 bg-purple-50" },
  assurance: { icon: <Shield className="h-5 w-5" />, label: "Assurance", color: "text-orange-600 bg-orange-50" },
  juridique: { icon: <Scale className="h-5 w-5" />, label: "Juridique", color: "text-rose-600 bg-rose-50" },
  marketing: { icon: <Megaphone className="h-5 w-5" />, label: "Marketing", color: "text-emerald-600 bg-emerald-50" },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// ─── SAFE NUMBER FORMATTING ────────────────────────────────────

function safeToFixed(value: unknown, digits: number = 1): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  return num.toFixed(digits);
}

// ─── CIRCULAR SCORE ────────────────────────────────────────────

function CircularScore({ score, label }: { score: number; label: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
          <circle
            cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className={color} style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && (
        <p className="text-sm text-muted-foreground mt-3 text-center max-w-[200px]">{label}</p>
      )}
    </div>
  );
}

// ─── TOOL CARD ─────────────────────────────────────────────────

function ToolCard({ tool, priority }: { tool: ToolRec; priority: boolean }) {
  const config = CATEGORY_CONFIG[tool.category] || {
    icon: <ExternalLink className="h-5 w-5" />, label: "Outil", color: "text-gray-600 bg-gray-50",
  };

  const handleDiscover = async () => {
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug }),
      });
    } catch {}
    window.open(tool.affiliateUrl || tool.website, "_blank");
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${priority ? "border-rose-200 bg-rose-50/30" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.color}`}>
            {config.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{config.label}</Badge>
              {priority && (
                <Badge className="text-[10px] px-1.5 bg-rose-100 text-rose-700 border-rose-200">Prioritaire</Badge>
              )}
            </div>
            <CardTitle className="text-base mt-1">{tool.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tool.tagline && (
          <p className="text-sm text-muted-foreground">{tool.tagline}</p>
        )}
        {tool.whyRecommended && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
            <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{tool.whyRecommended}</p>
          </div>
        )}
        {tool.pros && tool.pros.length > 0 && (
          <div className="space-y-1">
            {tool.pros.slice(0, 3).map((pro, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 inline text-emerald-500 mr-1" />
                {pro}
              </p>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{tool.pricing}</Badge>
            {(tool.rating ?? 0) > 0 && (
              <span className="text-xs text-muted-foreground">⭐ {safeToFixed(tool.rating, 1)}</span>
            )}
          </div>
        </div>
        <Button
          size="sm"
          className={`w-full gap-2 ${priority ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-primary hover:bg-primary/90"}`}
          onClick={handleDiscover}
        >
          Découvrir
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function AuditDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch("/api/user/audit");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Audit fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, []);

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  // ─── No audit ─────────────────────────────────────────────
  if (!data?.auditResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun audit trouvé</h2>
            <p className="text-muted-foreground mb-6">
              Complétez votre audit depuis la page d&apos;accueil pour obtenir vos recommandations personnalisées.
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={() => router.push("/#audit")}
            >
              <ClipboardCheck className="h-4 w-4" />
              Commencer l&apos;audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const auditResult = data.auditResult;
  const recs = auditResult.recommendations || {
    scoreLabel: "", scoreColor: "emerald", summary: auditResult.summary,
    isRegulated: auditResult.isRegulated, regulatedProfession: auditResult.regulatedProfession,
    regulatedWarning: null, recommendations: { prioritaires: [], essentielles: [], optionnelles: [] },
    nextSteps: [], estimatedSavings: "", regulatoryAlerts: [],
  };

  const allTools: ToolRec[] = [
    ...(recs.recommendations?.prioritaires || []),
    ...(recs.recommendations?.essentielles || []),
    ...(recs.recommendations?.optionnelles || []),
    ...(data.tools || []),
  ];

  const handleDownloadPdf = () => {
    toast.loading("Génération du PDF en cours...");
    fetch("/api/audit/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.lead?.email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((html) => {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
        }
        toast.dismiss();
        toast.success("PDF téléchargé avec succès !");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Erreur lors du téléchargement du PDF");
      });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mon Audit</h1>
          <p className="text-muted-foreground mt-1">
            Résultats et recommandations personnalisées
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4" />
          Télécharger le PDF
        </Button>
      </motion.div>

      {/* Profile & Score */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Votre profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Profil</p>
                <Badge variant="secondary" className="mt-1">{PROFILE_LABELS[auditResult.profile] || auditResult.profile}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Secteur</p>
                <p className="font-medium mt-1 capitalize">{auditResult.sector || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phase</p>
                <p className="font-medium mt-1">{PHASE_LABELS[auditResult.phase] || auditResult.phase}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut réglementé</p>
                <Badge className={`mt-1 ${auditResult.isRegulated ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {auditResult.isRegulated ? (
                    <><ShieldCheck className="h-3 w-3 mr-1" />Réglementé</>
                  ) : (
                    <><CheckCircle2 className="h-3 w-3 mr-1" />Non réglementé</>
                  )}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Points de difficulté</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {auditResult.painPoint?.split(",").map((p, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{p.trim()}</Badge>
                  ))}
                </div>
              </div>
            </div>
            {recs.summary && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm leading-relaxed">{recs.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Score de maturité
            </CardTitle>
            <CardDescription>Évaluation entrepreneuriale</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <CircularScore score={auditResult.score} label={recs.scoreLabel} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Savings */}
      {recs.estimatedSavings && (
        <motion.div variants={item}>
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Zap className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Économies estimées</p>
                  <p className="text-2xl font-bold text-emerald-600">{recs.estimatedSavings}</p>
                </div>
              </div>
              <p className="text-sm text-emerald-700 text-center sm:text-right max-w-xs">
                En suivant nos recommandations d&apos;outils, vous pourriez réduire significativement vos coûts de gestion.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Regulatory Warning */}
      {auditResult.isRegulated && (
        <motion.div variants={item}>
          <Card className="border-rose-200 bg-rose-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                Secteur réglementé — {recs.regulatedProfession || auditResult.regulatedProfession}
              </CardTitle>
              <CardDescription className="text-rose-600">
                {recs.regulatedWarning?.authority && `Autorité compétente : ${recs.regulatedWarning.authority}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recs.regulatedWarning?.requirements && (
                <div>
                  <p className="text-sm font-semibold text-rose-700 mb-2">Obligations principales :</p>
                  <ul className="space-y-1.5">
                    {recs.regulatedWarning.requirements.map((req: string, i: number) => (
                      <li key={i} className="text-sm text-rose-600 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recs.regulatedWarning?.additionalCosts && (
                <div>
                  <p className="text-sm font-semibold text-rose-700 mb-2">Budget à prévoir :</p>
                  <div className="flex flex-wrap gap-2">
                    {recs.regulatedWarning.additionalCosts.map((cost: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-rose-200 text-rose-600">{cost}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Priority Recommendations */}
      {(recs.recommendations?.prioritaires || []).length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <h2 className="text-xl font-bold">Recommandations prioritaires</h2>
            <Badge className="bg-rose-100 text-rose-700">Urgent</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recs.recommendations.prioritaires.map((tool: ToolRec, i: number) => (
              <ToolCard key={`${tool.slug}-${i}`} tool={tool} priority />
            ))}
          </div>
        </motion.div>
      )}

      {/* Essential Recommendations */}
      {(recs.recommendations?.essentielles || []).length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold">Outils essentiels</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recs.recommendations.essentielles.map((tool: ToolRec, i: number) => (
              <ToolCard key={`${tool.slug}-${i}`} tool={tool} priority={false} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Optional Recommendations */}
      {(recs.recommendations?.optionnelles || []).length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <h2 className="text-xl font-bold">Pour aller plus loin</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recs.recommendations.optionnelles.map((tool: ToolRec, i: number) => (
              <ToolCard key={`${tool.slug}-${i}`} tool={tool} priority={false} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      {recs.nextSteps && recs.nextSteps.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recs.nextSteps.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Regulatory Alerts */}
      {recs.regulatoryAlerts && recs.regulatoryAlerts.length > 0 && (
        <motion.div variants={item}>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <FileText className="h-5 w-5" />
                Alertes réglementaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recs.regulatoryAlerts.map((alert: string, i: number) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    {alert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
