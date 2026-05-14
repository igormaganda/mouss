"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CHART_COLORS = [
  "oklch(0.696 0.17 162.48)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.666 0.179 58.318)",
  "oklch(0.646 0.222 41.116)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

function GrowthIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
      {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      <span>{isPositive ? "+" : ""}{(value ?? 0).toFixed(1)}%</span>
    </div>
  );
}

export default function AdminRevenuePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-revenue-stats"],
    queryFn: () => fetcher("/api/admin/stats"),
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  if (!data) return null;

  // Calculate last month revenue from revenueByMonth
  const months = data.revenueByMonth;
  const currentMonthRevenue = months.length > 0 ? months[months.length - 1].revenue : 0;
  const lastMonthRevenue = months.length > 1 ? months[months.length - 2].revenue : 0;
  const growthPercent = lastMonthRevenue > 0
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  // Revenue by pack with percentage
  const totalPackRevenue = data.revenueByPack.reduce((s: number, p: { revenue: number }) => s + p.revenue, 0);
  const revenueByPackWithPercent = data.revenueByPack.map((item: { pack: string; revenue: number }) => ({
    ...item,
    percent: totalPackRevenue > 0 ? ((item.revenue / totalPackRevenue) * 100).toFixed(1) : "0",
  }));

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Revenus
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyse détaillée de vos revenus et performances
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={fadeUp} custom={1}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Ce mois</p>
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(currentMonthRevenue)}</p>
                <div className="mt-1">
                  <GrowthIndicator value={growthPercent} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} custom={2}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Mois dernier</p>
                <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
                  <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(lastMonthRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.monthlyOrders} commandes ce mois
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} custom={3}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                  <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(data.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis le début
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <motion.div variants={fadeUp} custom={4}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendance des revenus</CardTitle>
              <CardDescription>Évolution mensuelle sur 12 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueByMonth}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.912 0.01 166)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [formatCurrency(value), "Revenu"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.696 0.17 162.48)"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue by Pack */}
        <motion.div variants={fadeUp} custom={5}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenus par pack</CardTitle>
              <CardDescription>Répartition des revenus par offre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {data.revenueByPack.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.revenueByPack}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="revenue"
                        nameKey="pack"
                        label={({ pack, percent }) =>
                          `${pack} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {data.revenueByPack.map((_: unknown, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(1 0 0)",
                          border: "1px solid oklch(0.912 0.01 166)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Revenu"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Aucune donnée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Orders by Pack Chart */}
      <motion.div variants={fadeUp} custom={6}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commandes par pack</CardTitle>
            <CardDescription>Nombre de commandes par type d&apos;offre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {data.ordersByPack.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ordersByPack} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="pack"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.912 0.01 166)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="oklch(0.696 0.17 162.48)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Aucune donnée
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue by Pack Table */}
      <motion.div variants={fadeUp} custom={7}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des revenus</CardTitle>
            <CardDescription>Détail des revenus par pack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pack</TableHead>
                    <TableHead className="text-right">Revenu</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Part</TableHead>
                    <TableHead className="text-right">Commandes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByPackWithPercent.map((item: { pack: string; revenue: number; percent: string }) => {
                    const orderInfo = data.ordersByPack.find((o: { pack: string }) => o.pack === item.pack);
                    return (
                      <TableRow key={item.pack}>
                        <TableCell className="font-medium">{item.pack}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.revenue)}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                            {item.percent}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{orderInfo?.count || 0}</TableCell>
                      </TableRow>
                    );
                  })}
                  {revenueByPackWithPercent.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Aucune donnée de revenu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
