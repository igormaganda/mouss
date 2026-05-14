"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "new" | "contacted" | "converted" | "lost" | "draft" | "scheduled" | "sent" | "published";
type ProfileType = "etudiant" | "salarie" | "freelance" | "tpe-pme";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  new: { label: "Nouveau", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  contacted: { label: "Contacté", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  converted: { label: "Converti", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  lost: { label: "Perdu", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
  scheduled: { label: "Planifié", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  sent: { label: "Envoyé", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  published: { label: "Publié", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const profileConfig: Record<ProfileType, { label: string; className: string }> = {
  etudiant: { label: "Étudiant", className: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400" },
  salarie: { label: "Salarié", className: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400" },
  freelance: { label: "Freelance", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  "tpe-pme": { label: "TPE/PME", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as StatusType];
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export function ProfileBadge({ profile }: { profile: string }) {
  const config = profileConfig[profile as ProfileType];
  if (!config) {
    return <Badge variant="outline">{profile}</Badge>;
  }
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const categoryMap: Record<string, string> = {
    bank: "Banque",
    compta: "Comptabilité",
    assurance: "Assurance",
    legal: "Legal",
    marketing: "Marketing",
    crm: "CRM",
    other: "Autre",
  };
  return (
    <Badge variant="outline" className="font-medium">
      {categoryMap[category] || category}
    </Badge>
  );
}

export function PhaseBadge({ phase }: { phase: string }) {
  const phaseMap: Record<string, { label: string; className: string }> = {
    reflexion: { label: "Réflexion", className: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400" },
    creation: { label: "Création", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    gestion: { label: "Gestion", className: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400" },
    croissance: { label: "Croissance", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  };
  const config = phaseMap[phase];
  if (!config) {
    return <Badge variant="outline">{phase}</Badge>;
  }
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
