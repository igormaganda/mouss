"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#E8A020]`} />
      {text && <p className="text-sm text-[#607090]">{text}</p>}
    </div>
  );
}

export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text || "Chargement..."} />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-4 bg-[#F4F6FA] rounded w-1/2 mb-4" />
      <div className="h-8 bg-[#F4F6FA] rounded w-1/3 mb-2" />
      <div className="h-3 bg-[#F4F6FA] rounded w-2/3" />
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm animate-pulse"
        >
          <div className="w-10 h-10 bg-[#F4F6FA] rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#F4F6FA] rounded w-1/3" />
            <div className="h-3 bg-[#F4F6FA] rounded w-1/2" />
          </div>
          <div className="h-6 bg-[#F4F6FA] rounded w-20" />
        </div>
      ))}
    </div>
  );
}
