'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  Flag,
  MapPin,
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useCallback, memo } from 'react';

// Types for the node data
export interface CareerNodeData {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  nodeType: 'job' | 'education' | 'certification' | 'milestone';
  x: number;
  y: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  growthRate?: number;
  isCurrent?: boolean;
  isTarget?: boolean;
  requirements?: string[];
  duration?: string;
}

interface CareerNodeProps {
  node: CareerNodeData;
  lineColor: string;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onSetTarget?: (nodeId: string) => void;
  userSkills?: string[];
  scale?: number;
}

const nodeTypeIcons = {
  job: Briefcase,
  education: GraduationCap,
  certification: Award,
  milestone: Flag,
};

const nodeTypeLabels = {
  job: 'Poste',
  education: 'Formation',
  certification: 'Certification',
  milestone: 'Étape',
};

const formatSalary = (min?: number, max?: number, currency = 'EUR') => {
  if (!min && !max) return null;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
  if (min && max) {
    return `${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k${currencySymbol}`;
  }
  if (min) return `${(min / 1000).toFixed(0)}k${currencySymbol}+`;
  return `Up to ${(max! / 1000).toFixed(0)}k${currencySymbol}`;
};

const CareerNodeComponent = ({
  node,
  lineColor,
  isSelected,
  onSelect,
  onSetTarget,
  userSkills = [],
  scale = 1,
}: CareerNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = nodeTypeIcons[node.nodeType];

  // Calculate skill gap
  const calculateSkillGap = useCallback(() => {
    if (!node.requirements || node.requirements.length === 0) return 100;
    const matchedSkills = node.requirements.filter(req =>
      userSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
    );
    return Math.round((matchedSkills.length / node.requirements.length) * 100);
  }, [node.requirements, userSkills]);

  const skillGap = calculateSkillGap();
  const salaryDisplay = formatSalary(node.salaryMin, node.salaryMax, node.currency);
  const growthTrend = node.growthRate && node.growthRate > 5 ? 'up' : node.growthRate && node.growthRate < 0 ? 'down' : 'stable';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <motion.g
          style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
          className="cursor-pointer"
          onClick={() => onSelect(node.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer glow for selected/hovered state */}
          <AnimatePresence>
            {(isSelected || isHovered) && (
              <motion.circle
                r={28}
                fill={lineColor}
                opacity={0.2}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Station outer ring */}
          <circle
            r={22}
            fill={isSelected ? lineColor : 'var(--background)'}
            stroke={lineColor}
            strokeWidth={isSelected ? 3 : 2}
            className="transition-all duration-200"
          />

          {/* Inner circle */}
          <circle
            r={18}
            fill={isSelected ? lineColor : 'var(--card)'}
            className="transition-all duration-200"
          />

          {/* Icon */}
          <foreignObject x={-10} y={-10} width={20} height={20}>
            <Icon
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isSelected ? "text-white" : "text-foreground"
              )}
            />
          </foreignObject>

          {/* Current position indicator */}
          {node.isCurrent && (
            <motion.circle
              r={28}
              fill="none"
              stroke="var(--emerald-500)"
              strokeWidth={2}
              strokeDasharray="4 2"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
              style={{ transformOrigin: 'center' }}
            />
          )}

          {/* Target indicator */}
          {node.isTarget && (
            <g transform="translate(20, -20)">
              <circle r={10} fill="var(--amber-500)" />
              <foreignObject x={-6} y={-6} width={12} height={12}>
                <Target className="w-3 h-3 text-white" />
              </foreignObject>
            </g>
          )}

          {/* Salary badge */}
          {salaryDisplay && (
            <g transform="translate(0, 35)">
              <foreignObject x={-30} y={0} width={60} height={18}>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium bg-card border shadow-sm"
                >
                  {salaryDisplay}
                </Badge>
              </foreignObject>
            </g>
          )}

          {/* Growth indicator */}
          {node.growthRate !== undefined && (
            <g transform="translate(24, -8)">
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <circle
                  r={8}
                  fill={
                    growthTrend === 'up' ? 'var(--emerald-500)' :
                    growthTrend === 'down' ? 'var(--rose-500)' :
                    'var(--muted)'
                  }
                />
                <foreignObject x={-5} y={-5} width={10} height={10}>
                  {growthTrend === 'up' && <TrendingUp className="w-3 h-3 text-white" />}
                  {growthTrend === 'down' && <TrendingDown className="w-3 h-3 text-white" />}
                  {growthTrend === 'stable' && <Minus className="w-3 h-3 text-white" />}
                </foreignObject>
              </motion.g>
            </g>
          )}

          {/* Skill gap mini indicator */}
          {node.requirements && node.requirements.length > 0 && (
            <g transform="translate(-24, -8)">
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <circle
                  r={8}
                  fill={
                    skillGap >= 80 ? 'var(--emerald-500)' :
                    skillGap >= 50 ? 'var(--amber-500)' :
                    'var(--rose-500)'
                  }
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[8px] font-bold fill-white"
                >
                  {skillGap}%
                </text>
              </motion.g>
            </g>
          )}
        </motion.g>

        <TooltipContent
          side="top"
          className="max-w-xs p-3 bg-card border shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                style={{ borderColor: lineColor, color: lineColor }}
              >
                {nodeTypeLabels[node.nodeType]}
              </Badge>
              {node.isCurrent && (
                <Badge className="bg-emerald-500 text-white text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  Actuel
                </Badge>
              )}
              {node.isTarget && (
                <Badge className="bg-amber-500 text-white text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Objectif
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-sm">{node.title}</h4>
            {node.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {node.description}
              </p>
            )}
            {node.duration && (
              <p className="text-xs text-muted-foreground">
                Durée: {node.duration}
              </p>
            )}
            {node.requirements && node.requirements.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-medium mb-1">Compétences requises:</p>
                <div className="flex flex-wrap gap-1">
                  {node.requirements.slice(0, 3).map((req, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {req}
                    </Badge>
                  ))}
                  {node.requirements.length > 3 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{node.requirements.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground pt-1">
              Cliquez pour voir les détails
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CareerNode = memo(CareerNodeComponent);
