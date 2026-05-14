"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface QuickActionsProps {
  onSelect: (message: string) => void;
  actions: string[];
}

export function QuickActions({ onSelect, actions }: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(action)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <Sparkles className="size-3 text-amber-500" />
          <span>{action}</span>
        </motion.button>
      ))}
    </div>
  );
}
