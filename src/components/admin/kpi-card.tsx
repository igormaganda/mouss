"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down";
}

export function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "font-medium",
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
