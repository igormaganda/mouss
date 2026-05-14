"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator, TrendingDown, Wallet, Calendar, Euro } from "lucide-react";

type ActivityType = "services" | "ventes" | "mixed";
type StructureType = "micro-entreprise" | "sasu" | "eurl" | "sarl";

interface StructureCalc {
  name: string;
  socialCharges: number;
  incomeTax: number;
  netIncome: number;
  monthlyNet: number;
  effectiveRate: number;
}

const STRUCTURE_NAMES: Record<StructureType, string> = {
  "micro-entreprise": "Micro-entreprise",
  SASU: "SASU",
  EURL: "EURL",
  SARL: "SARL",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateStructures(
  revenue: number,
  activity: ActivityType
): Record<StructureType, StructureCalc> {
  // Micro-entreprise rates (2025)
  const microRates: Record<ActivityType, number> = {
    services: 0.22,
    ventes: 0.123,
    mixed: 0.17, // weighted average
  };

  // Micro-entreprise
  const microCharges = revenue * microRates[activity];
  const microTaxable = revenue - microCharges;
  // Micro BIC abatement: 50% for services, 71% for sales
  const microAbattement: Record<ActivityType, number> = {
    services: 0.5,
    ventes: 0.71,
    mixed: 0.6,
  };
  const microIRBase = microTaxable * (1 - microAbattement[activity]);
  // Progressive tax bracket estimation (simplified 30% average rate)
  const microIR = microIRBase * 0.3;
  const microNet = revenue - microCharges - microIR;

  // SASU: ~45% employer charges on gross salary
  // Optimize salary to maximize net: distribute ~55-60% as salary
  const sasuGrossSalary = revenue * 0.6;
  const sasuCharges = sasuGrossSalary * 0.45;
  const sasuNetSalary = sasuGrossSalary - sasuCharges;
  // Dividends on remaining after corporate tax (15% up to 42.5K, 25% above)
  const sasuRemainder = revenue - sasuGrossSalary;
  const sasuCorpTax =
    sasuRemainder <= 42500
      ? sasuRemainder * 0.15
      : 42500 * 0.15 + (sasuRemainder - 42500) * 0.25;
  const sasuDividends = sasuRemainder - sasuCorpTax;
  // Flat tax (PFU) 30% on dividends
  const sasuDivTax = sasuDividends * 0.3;
  const sasuNet = sasuNetSalary + sasuDividends - sasuDivTax;
  const sasuTotalTax = sasuCharges + sasuCorpTax + sasuDivTax;

  // EURL: TNS, ~45% charges on net
  const eurlCharges = revenue * 0.45;
  const eurlNet = revenue - eurlCharges;
  // IR on EURL income (progressive brackets, ~30% average)
  const eurlIR = eurlNet * 0.3;
  const eurlFinalNet = eurlNet - eurlIR;

  // SARL: similar to EURL but with more flexibility
  const sarlCharges = revenue * 0.42; // slightly lower than EURL due to salary optimization
  const sarlNet = revenue - sarlCharges;
  const sarlIR = sarlNet * 0.3;
  const sarlFinalNet = sarlNet - sarlIR;

  return {
    "micro-entreprise": {
      name: STRUCTURE_NAMES["micro-entreprise"],
      socialCharges: microCharges,
      incomeTax: microIR,
      netIncome: microNet,
      monthlyNet: microNet / 12,
      effectiveRate: revenue > 0 ? ((microCharges + microIR) / revenue) * 100 : 0,
    },
    SASU: {
      name: STRUCTURE_NAMES.SASU,
      socialCharges: sasuTotalTax,
      incomeTax: sasuDivTax + sasuCorpTax,
      netIncome: sasuNet,
      monthlyNet: sasuNet / 12,
      effectiveRate: revenue > 0 ? (sasuTotalTax / revenue) * 100 : 0,
    },
    EURL: {
      name: STRUCTURE_NAMES.EURL,
      socialCharges: eurlCharges,
      incomeTax: eurlIR,
      netIncome: eurlFinalNet,
      monthlyNet: eurlFinalNet / 12,
      effectiveRate:
        revenue > 0 ? ((eurlCharges + eurlIR) / revenue) * 100 : 0,
    },
    SARL: {
      name: STRUCTURE_NAMES.SARL,
      socialCharges: sarlCharges,
      incomeTax: sarlIR,
      netIncome: sarlFinalNet,
      monthlyNet: sarlFinalNet / 12,
      effectiveRate:
        revenue > 0 ? ((sarlCharges + sarlIR) / revenue) * 100 : 0,
    },
  };
}

function getBestStructure(
  results: Record<StructureType, StructureCalc>
): StructureType {
  let best: StructureType = "micro-entreprise";
  let maxNet = 0;
  for (const [key, val] of Object.entries(results)) {
    if (val.netIncome > maxNet) {
      maxNet = val.netIncome;
      best = key as StructureType;
    }
  }
  return best;
}

export function SimulatorSection() {
  const [revenue, setRevenue] = useState([50000]);
  const [activity, setActivity] = useState<ActivityType>("services");

  const revenueValue = revenue[0];

  const results = useMemo(
    () => calculateStructures(revenueValue, activity),
    [revenueValue, activity]
  );

  const bestStructure = getBestStructure(results);

  const activityLabels: Record<ActivityType, string> = {
    services: "Prestations BIC/BNC",
    ventes: "Ventes marchandises",
    mixed: "Activité mixte",
  };

  const step = 5000;
  const handleSliderChange = (value: number[]) => {
    setRevenue(value);
  };

  return (
    <section id="simulateur" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          >
            <Calculator className="h-3.5 w-3.5 mr-1" />
            Simulateur interactif
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simulez vos{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              charges sociales
            </span>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comparez en temps réel le coût de chaque structure juridique selon
            votre activité et vos revenus prévisionnels.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 border-emerald-200 dark:border-emerald-800/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Revenue Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Euro className="h-4 w-4 text-emerald-600" />
                      Chiffre d&apos;affaires annuel estimé
                    </label>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(revenueValue)}
                    </span>
                  </div>
                  <Slider
                    value={revenue}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={200000}
                    step={step}
                    className="w-full [&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:border-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 €</span>
                    <span>50 000 €</span>
                    <span>100 000 €</span>
                    <span>150 000 €</span>
                    <span>200 000 €</span>
                  </div>
                </div>

                {/* Activity Type Select */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Type d&apos;activité
                  </label>
                  <Select
                    value={activity}
                    onValueChange={(v) => setActivity(v as ActivityType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="services">
                        Prestations BIC/BNC
                      </SelectItem>
                      <SelectItem value="ventes">
                        Ventes marchandises
                      </SelectItem>
                      <SelectItem value="mixed">Activité mixte</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Activité : {activityLabels[activity]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {(
            [
              {
                icon: TrendingDown,
                label: "Charges sociales",
                value: formatCurrency(results[bestStructure].socialCharges),
                color: "text-orange-600 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-900/20",
              },
              {
                icon: Calculator,
                label: "Impôt estimé",
                value: formatCurrency(results[bestStructure].incomeTax),
                color: "text-rose-600 dark:text-rose-400",
                bg: "bg-rose-50 dark:bg-rose-900/20",
              },
              {
                icon: Wallet,
                label: "Revenu net annuel",
                value: formatCurrency(results[bestStructure].netIncome),
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
              },
              {
                icon: Calendar,
                label: "Revenu net mensuel",
                value: formatCurrency(results[bestStructure].monthlyNet),
                color: "text-teal-600 dark:text-teal-400",
                bg: "bg-teal-50 dark:bg-teal-900/20",
              },
            ] as const
          ).map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Meilleur choix :{" "}
                  <span className="font-medium text-foreground">
                    {results[bestStructure].name}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-600" />
                Comparaison détaillée des structures
              </CardTitle>
              <CardDescription>
                Pour un chiffre d&apos;affaires de{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(revenueValue)}
                </span>{" "}
                en activité{" "}
                <span className="font-semibold text-foreground">
                  {activityLabels[activity]}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Structure</TableHead>
                      <TableHead className="text-right min-w-[130px]">
                        Charges sociales
                      </TableHead>
                      <TableHead className="text-right min-w-[120px]">
                        Impôt estimé
                      </TableHead>
                      <TableHead className="text-right min-w-[130px]">
                        Revenu net annuel
                      </TableHead>
                      <TableHead className="text-right min-w-[130px]">
                        Revenu net / mois
                      </TableHead>
                      <TableHead className="text-right min-w-[100px]">
                        Taux effectif
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(
                      Object.keys(results) as StructureType[]
                    ).map((key) => {
                      const r = results[key];
                      const isBest = key === bestStructure;
                      return (
                        <TableRow
                          key={key}
                          className={
                            isBest
                              ? "bg-emerald-50 dark:bg-emerald-900/20 font-medium"
                              : ""
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {r.name}
                              {isBest && (
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] px-1.5 py-0">
                                  ★ Recommandé
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-orange-600 dark:text-orange-400">
                            {formatCurrency(r.socialCharges)}
                          </TableCell>
                          <TableCell className="text-right text-rose-600 dark:text-rose-400">
                            {formatCurrency(r.incomeTax)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(r.netIncome)}
                          </TableCell>
                          <TableCell className="text-right text-teal-600 dark:text-teal-400">
                            {formatCurrency(r.monthlyNet)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {(r.effectiveRate ?? 0).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Info note */}
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">ℹ️ Note :</strong> Ce
                  simulateur fournit des estimations basées sur les taux 2025. Les
                  calculs sont simplifiés et ne remplacent pas l&apos;avis d&apos;un
                  expert-comptable. Les taux réels peuvent varier selon votre
                  situation personnelle, votre département et les exonérations
                  applicables (ACRE, etc.).
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
