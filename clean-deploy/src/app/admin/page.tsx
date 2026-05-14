"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, DollarSign, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LineChart,
  Line,
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
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/admin/kpi-card";
import { StatusBadge, ProfileBadge } from "@/components/admin/stat-badge";

const CHART_COLORS = [
  "oklch(0.696 0.17 162.48)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.666 0.179 58.318)",
  "oklch(0.646 0.222 41.116)",
];

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetcher("/api/admin/stats"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!data) return null;

  const stats = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activité entrepreneuriale
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          change={12}
          trend="up"
        />
        <KPICard
          title="Conversions"
          value={stats.convertedLeads}
          icon={Target}
          change={8}
          trend="up"
        />
        <KPICard
          title="Revenus estimés"
          value={`${(stats.estimatedRevenue ?? 0).toFixed(0)} €`}
          icon={DollarSign}
          change={15}
          trend="up"
        />
        <KPICard
          title="Taux conversion"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          change={3}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads per day - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads par jour</CardTitle>
            <CardDescription>30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.leadsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return format(d, "d MMM", { locale: fr });
                    }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.912 0.01 166)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(value) => {
                      const d = new Date(value);
                      return format(d, "d MMMM yyyy", { locale: fr });
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="oklch(0.696 0.17 162.48)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "oklch(0.696 0.17 162.48)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leads by profile - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads par profil</CardTitle>
            <CardDescription>Répartition des leads par type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.leadsByProfile}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="profile"
                    label={({ profile, percent }) =>
                      `${profile} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats.leadsByProfile.map((_, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Leads */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Leads récents</CardTitle>
            <CardDescription>10 derniers leads capturés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Profil</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentLeads.map((lead: Record<string, unknown>) => (
                    <TableRow key={lead.id as string}>
                      <TableCell className="font-medium">
                        {lead.firstName as string} {lead.lastName as string}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {lead.email as string}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <ProfileBadge profile={lead.profile as string} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.status as string} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {format(
                          new Date(lead.createdAt as string),
                          "d MMM yyyy",
                          { locale: fr }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {stats.recentLeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Aucun lead pour le moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Tools */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Outils populaires</CardTitle>
            <CardDescription>Par nombre de clics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topTools}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
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
                    dataKey="clicks"
                    fill="oklch(0.696 0.17 162.48)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
