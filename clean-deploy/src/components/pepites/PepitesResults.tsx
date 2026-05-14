"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { type PepiteResult } from "./PepitesGame";
import { CategoryBadge, type PepiteCategory, CATEGORY_CONFIG } from "./CategoryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RotateCcw,
  Share2,
  Download,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
} from "lucide-react";

interface PepitesResultsProps {
  results: PepiteResult[];
  pepites: PepiteResult["pepite"][];
  onRestart: () => void;
}

const CATEGORY_COLORS: Record<PepiteCategory, string> = {
  communication: "#10b981", // emerald-500
  leadership: "#f59e0b", // amber-500
  creativity: "#a855f7", // purple-500
  strategy: "#f43f5e", // rose-500
  technical: "#06b6d4", // cyan-500
  interpersonal: "#f97316", // orange-500
};

const CELEBRATION_EMOJIS = ["\u2728", "\U0001F389", "\U0001F38A", "\U0001F31F", "\U0001F48E"];

export function PepitesResults({ results, pepites, onRestart }: PepitesResultsProps) {
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const have = results.filter((r) => r.decision === "have").length;
    const want = results.filter((r) => r.decision === "want").length;
    const notPriority = results.filter((r) => r.decision === "not_priority").length;

    // Group by category
    const byCategory: Record<string, { have: number; want: number; total: number }> = {};
    results.forEach((r) => {
      const cat = r.pepite.category;
      if (!byCategory[cat]) {
        byCategory[cat] = { have: 0, want: 0, total: 0 };
      }
      byCategory[cat].total++;
      if (r.decision === "have") byCategory[cat].have++;
      if (r.decision === "want") byCategory[cat].want++;
    });

    // Radar chart data - strength score per category
    const radarData = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
      const catStats = byCategory[key] || { have: 0, want: 0, total: 0 };
      // Score: have = 100%, want = 50%, not_priority = 0%
      const score = catStats.total > 0
        ? Math.round((catStats.have * 100 + catStats.want * 50) / catStats.total)
        : 0;
      return {
        category: config.label,
        score,
        fullMark: 100,
        have: catStats.have,
        want: catStats.want,
      };
    });

    // Pie chart data - distribution by decision
    const pieData = [
      { name: "J'ai", value: have, color: "#10b981" },
      { name: "A acquerir", value: want, color: "#a855f7" },
      { name: "Pas priorite", value: notPriority, color: "#f43f5e" },
    ].filter((d) => d.value > 0);

    // Bar chart data - categories by interest
    const barData = Object.entries(byCategory)
      .map(([key, stats]) => ({
        name: CATEGORY_CONFIG[key as PepiteCategory]?.label || key,
        have: stats.have,
        want: stats.want,
        color: CATEGORY_COLORS[key as PepiteCategory],
      }))
      .sort((a, b) => (b.have + b.want) - (a.have + a.want));

    return {
      have,
      want,
      notPriority,
      total: results.length,
      radarData,
      pieData,
      barData,
      byCategory,
    };
  }, [results]);

  // Find dominant strengths
  const topStrengths = React.useMemo(() => {
    return Object.entries(stats.byCategory)
      .filter(([_, s]) => s.have > 0)
      .sort((a, b) => b[1].have - a[1].have)
      .slice(0, 3)
      .map(([key]) => key as PepiteCategory);
  }, [stats.byCategory]);

  // Find areas to develop
  const areasToDevelop = React.useMemo(() => {
    return Object.entries(stats.byCategory)
      .filter(([_, s]) => s.want > 0)
      .sort((a, b) => b[1].want - a[1].want)
      .slice(0, 3)
      .map(([key]) => key as PepiteCategory);
  }, [stats.byCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pb-8">
      {/* Celebration confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: -50,
                x: Math.random() * window.innerWidth,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: Math.random() * 360,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
              className="absolute text-2xl"
            >
              {CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 via-purple-500 to-cyan-500 text-white py-8 px-4"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Felicitations !</h1>
          <p className="text-white/80">
            Vous avez complete le jeu des pepites. Decouvrez votre profil de competences.
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-6">
        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="pt-4 pb-3 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{stats.have}</p>
              <p className="text-xs opacity-80">J'ai</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-4 pb-3 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{stats.want}</p>
              <p className="text-xs opacity-80">A acquerir</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0">
            <CardContent className="pt-4 pb-3 text-center">
              <Target className="w-6 h-6 mx-auto mb-1 opacity-80" />
              <p className="text-2xl font-bold">{stats.notPriority}</p>
              <p className="text-xs opacity-80">Pas priorite</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart - Competency Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Votre profil de competences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Score base sur vos competences actuelles et vos envies d'acquisition
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Strengths & Areas to Develop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Vos forces
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topStrengths.length > 0 ? (
                <div className="space-y-2">
                  {topStrengths.map((cat) => (
                    <div key={cat} className="flex items-center justify-between">
                      <CategoryBadge category={cat} size="sm" />
                      <span className="text-sm text-gray-600">
                        {stats.byCategory[cat].have} competence{stats.byCategory[cat].have > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Continuez a explorer pour decouvrir vos forces !</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                A developper
              </CardTitle>
            </CardHeader>
            <CardContent>
              {areasToDevelop.length > 0 ? (
                <div className="space-y-2">
                  {areasToDevelop.map((cat) => (
                    <div key={cat} className="flex items-center justify-between">
                      <CategoryBadge category={cat} size="sm" />
                      <span className="text-sm text-gray-600">
                        {stats.byCategory[cat].want} a acquerir
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Vous etes equilibre dans vos competences !</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Distribution by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution par categorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.barData}
                    layout="vertical"
                    margin={{ left: 80, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="have"
                      name="J'ai"
                      stackId="a"
                      fill="#10b981"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="want"
                      name="A acquerir"
                      stackId="a"
                      fill="#a855f7"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart - Overall Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6 space-y-2">
                  {stats.pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
        >
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={onRestart}
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          >
            <Download className="w-4 h-4" />
            Telecharger le rapport
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
