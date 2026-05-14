"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical, Sparkles, type LucideIcon } from "lucide-react";
import type { Keyword, KeywordCategory } from "./KeywordSlot";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "./KeywordSlot";

interface SelectedKeywordsProps {
  keywords: Keyword[];
  onReorder: (keywords: Keyword[]) => void;
  onRemove: (keywordId: string) => void;
  onGenerateMission: () => void;
}

// Category icons mapping
const CATEGORY_ICONS: Record<KeywordCategory, LucideIcon> = {
  industry: Sparkles,
  value: Sparkles,
  impact: Sparkles,
  lifestyle: Sparkles,
};

// Sortable keyword item
interface SortableKeywordProps {
  keyword: Keyword;
  onRemove: (id: string) => void;
}

function SortableKeyword({ keyword, onRemove }: SortableKeywordProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: keyword.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const categoryColor = CATEGORY_COLORS[keyword.category];
  const CategoryIcon = CATEGORY_ICONS[keyword.category];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative group",
        isDragging && "z-50"
      )}
    >
      <Badge
        variant="outline"
        className={cn(
          "px-4 py-2 text-base font-medium gap-2 cursor-grab active:cursor-grabbing",
          "border-2 shadow-md hover:shadow-lg transition-all duration-200",
          categoryColor.bg,
          categoryColor.text,
          categoryColor.border,
          isDragging && "shadow-xl ring-2 ring-offset-2 ring-gray-400"
        )}
      >
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 opacity-40 group-hover:opacity-70" />
        </span>

        {/* Category indicator */}
        <span className="w-2 h-2 rounded-full bg-gradient-to-br from-current to-current opacity-60" />

        {/* Keyword text */}
        <span>{keyword.text}</span>

        {/* Remove button */}
        <button
          onClick={() => onRemove(keyword.id)}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </Badge>

      {/* Category label on hover */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
      >
        {CATEGORY_LABELS[keyword.category]}
      </motion.div>
    </motion.div>
  );
}

export function SelectedKeywords({
  keywords,
  onReorder,
  onRemove,
  onGenerateMission,
}: SelectedKeywordsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = keywords.findIndex((k) => k.id === active.id);
      const newIndex = keywords.findIndex((k) => k.id === over.id);
      onReorder(arrayMove(keywords, oldIndex, newIndex));
    }
  };

  const canGenerate = keywords.length >= 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Mots-clés sélectionnés
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Glissez-déposez pour réorganiser • {keywords.length}/5 sélectionnés
        </p>
      </div>

      {/* Keywords container */}
      {keywords.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={keywords.map((k) => k.id)}
            strategy={horizontalListSortingStrategy}
          >
            <motion.div
              layout
              className="flex flex-wrap justify-center gap-4 min-h-[60px] pb-6"
            >
              <AnimatePresence mode="popLayout">
                {keywords.map((keyword) => (
                  <SortableKeyword
                    key={keyword.id}
                    keyword={keyword}
                    onRemove={onRemove}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400 dark:text-gray-500"
        >
          <p>Aucun mot-clé sélectionné</p>
          <p className="text-sm mt-1">Lancez la loterie pour commencer!</p>
        </motion.div>
      )}

      {/* Generate mission button */}
      <AnimatePresence>
        {canGenerate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center pt-4"
          >
            <Button
              onClick={onGenerateMission}
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-purple-600 hover:via-rose-600 hover:to-amber-600 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 gap-3 px-8"
            >
              <Sparkles className="w-5 h-5" />
              Générer ma mission professionnelle
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimum requirement hint */}
      {!canGenerate && keywords.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Sélectionnez au moins {3 - keywords.length} mot{3 - keywords.length > 1 ? "s" : ""}-clé{3 - keywords.length > 1 ? "s" : ""} de plus
        </motion.p>
      )}
    </div>
  );
}
