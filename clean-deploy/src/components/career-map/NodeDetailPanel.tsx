'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  GraduationCap,
  Award,
  Flag,
  MapPin,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SkillGapIndicator, type SkillGapData } from './SkillGapIndicator';
import type { CareerNodeData } from './CareerNode';
import { memo } from 'react';

interface NodeDetailPanelProps {
  node: CareerNodeData | null;
  lineColor: string;
  lineName: string;
  onClose: () => void;
  onSetTarget?: (nodeId: string) => void;
  onViewJobs?: (nodeId: string) => void;
  userSkills?: string[];
  isOpen: boolean;
}

const nodeTypeConfig = {
  job: {
    icon: Briefcase,
    label: 'Poste',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  education: {
    icon: GraduationCap,
    label: 'Formation',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  certification: {
    icon: Award,
    label: 'Certification',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  milestone: {
    icon: Flag,
    label: 'Étape',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
};

const formatSalary = (min?: number, max?: number, currency = 'EUR') => {
  if (!min && !max) return null;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString();
  
  if (min && max) {
    return `${formatNum(min)} - ${formatNum(max)} ${currencySymbol}`;
  }
  if (min) return `À partir de ${formatNum(min)} ${currencySymbol}`;
  return `Jusqu'à ${formatNum(max!)} ${currencySymbol}`;
};

const NodeDetailPanelComponent = ({
  node,
  lineColor,
  lineName,
  onClose,
  onSetTarget,
  onViewJobs,
  userSkills = [],
  isOpen,
}: NodeDetailPanelProps) => {
  // Convert requirements to skill gap data
  const skillGapData: SkillGapData[] = (() => {
    if (!node?.requirements) return [];
    
    return node.requirements.map(req => {
      const hasSkill = userSkills.some(skill =>
        skill.toLowerCase().includes(req.toLowerCase())
      );
      return {
        name: req,
        status: hasSkill ? 'have' : 'missing' as const,
        importance: 'required' as const,
      };
    });
  })();

  if (!node) return null;

  const typeConfig = nodeTypeConfig[node.nodeType];
  const TypeIcon = typeConfig.icon;
  const salaryDisplay = formatSalary(node.salaryMin, node.salaryMax, node.currency);
  const growthTrend = node.growthRate && node.growthRate > 5 ? 'up' : node.growthRate && node.growthRate < 0 ? 'down' : 'stable';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l shadow-xl z-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${lineColor}20` }}
                >
                  <TypeIcon className="w-5 h-5" style={{ color: lineColor }} />
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className="mb-1"
                    style={{ borderColor: lineColor, color: lineColor }}
                  >
                    {lineName}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {typeConfig.label}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Title and description */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <h2 className="text-xl font-semibold flex-1">{node.title}</h2>
                    <div className="flex gap-1">
                      {node.isCurrent && (
                        <Badge className="bg-emerald-500 text-white text-xs shrink-0">
                          <MapPin className="w-3 h-3 mr-1" />
                          Actuel
                        </Badge>
                      )}
                      {node.isTarget && (
                        <Badge className="bg-amber-500 text-white text-xs shrink-0">
                          <Target className="w-3 h-3 mr-1" />
                          Objectif
                        </Badge>
                      )}
                    </div>
                  </div>
                  {node.description && (
                    <p className="text-sm text-muted-foreground">
                      {node.description}
                    </p>
                  )}
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Salary */}
                  {salaryDisplay && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Salaire</span>
                      </div>
                      <p className="font-semibold text-sm">{salaryDisplay}</p>
                    </div>
                  )}

                  {/* Duration */}
                  {node.duration && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Durée</span>
                      </div>
                      <p className="font-semibold text-sm">{node.duration}</p>
                    </div>
                  )}

                  {/* Growth rate */}
                  {node.growthRate !== undefined && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        {growthTrend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        {growthTrend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                        {growthTrend === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground">Croissance</span>
                      </div>
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          growthTrend === 'up' && "text-emerald-600 dark:text-emerald-400",
                          growthTrend === 'down' && "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {node.growthRate > 0 ? '+' : ''}{node.growthRate}%
                      </p>
                    </div>
                  )}

                  {/* Demand level placeholder */}
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Demande</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            level <= 3 ? "bg-emerald-500" : "bg-muted"
                          )}
                        />
                      ))}
                      <span className="text-xs ml-1 font-medium">Élevée</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Skills gap */}
                {skillGapData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Compétences requises</h3>
                    <SkillGapIndicator
                      skills={skillGapData}
                      showPercentage
                    />
                  </div>
                )}

                {/* Requirements list if no skill gap calculation */}
                {node.requirements && node.requirements.length > 0 && skillGapData.length === 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Prérequis</h3>
                    <ul className="space-y-1">
                      {node.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <ChevronRight className="w-4 h-4 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer actions */}
            <div className="p-4 border-t space-y-2">
              {!node.isTarget && !node.isCurrent && (
                <Button
                  className="w-full"
                  style={{ backgroundColor: lineColor }}
                  onClick={() => onSetTarget?.(node.id)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Définir comme objectif
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onViewJobs?.(node.id)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir les offres d'emploi
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const NodeDetailPanel = memo(NodeDetailPanelComponent);
