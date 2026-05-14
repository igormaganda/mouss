'use client';

import { motion } from 'framer-motion';
import { Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { memo } from 'react';

export interface SkillGapData {
  name: string;
  status: 'have' | 'develop' | 'missing';
  importance?: 'critical' | 'required' | 'preferred';
}

interface SkillGapIndicatorProps {
  skills: SkillGapData[];
  showPercentage?: boolean;
  compact?: boolean;
  className?: string;
}

const statusConfig = {
  have: {
    color: 'var(--emerald-500)',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
    icon: Check,
    label: 'Acquis',
  },
  develop: {
    color: 'var(--amber-500)',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30',
    icon: AlertTriangle,
    label: 'À développer',
  },
  missing: {
    color: 'var(--rose-500)',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500/30',
    icon: X,
    label: 'Manquant',
  },
};

const importanceConfig = {
  critical: { label: 'Critique', weight: 3 },
  required: { label: 'Requis', weight: 2 },
  preferred: { label: 'Préféré', weight: 1 },
};

const SkillGapIndicatorComponent = ({
  skills,
  showPercentage = true,
  compact = false,
  className,
}: SkillGapIndicatorProps) => {
  // Calculate overall percentage with weighted importance
  const calculatePercentage = () => {
    if (skills.length === 0) return 100;
    
    let totalWeight = 0;
    let achievedWeight = 0;
    
    skills.forEach(skill => {
      const weight = importanceConfig[skill.importance || 'required'].weight;
      totalWeight += weight;
      if (skill.status === 'have') {
        achievedWeight += weight;
      } else if (skill.status === 'develop') {
        achievedWeight += weight * 0.5; // Partial credit for skills to develop
      }
    });
    
    return Math.round((achievedWeight / totalWeight) * 100);
  };

  const percentage = calculatePercentage();
  
  // Group skills by status
  const skillsByStatus = {
    have: skills.filter(s => s.status === 'have'),
    develop: skills.filter(s => s.status === 'develop'),
    missing: skills.filter(s => s.status === 'missing'),
  };

  // Compact mode: just show progress bar and percentage
  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Compétences</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <Progress
          value={percentage}
          className="h-2"
          style={{
            // @ts-expect-error CSS custom property
            '--progress-background': percentage >= 80 ? 'var(--emerald-500)' :
              percentage >= 50 ? 'var(--amber-500)' : 'var(--rose-500)',
          }}
        />
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {skillsByStatus.have.length}
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {skillsByStatus.develop.length}
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {skillsByStatus.missing.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Progress */}
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Niveau de préparation</h4>
            <motion.span
              key={percentage}
              initial={{ scale: 1.2, color: 'var(--foreground)' }}
              animate={{ scale: 1, color: 'var(--foreground)' }}
              className="text-2xl font-bold"
              style={{
                color: percentage >= 80 ? 'var(--emerald-500)' :
                  percentage >= 50 ? 'var(--amber-500)' : 'var(--rose-500)',
              }}
            >
              {percentage}%
            </motion.span>
          </div>
          <Progress
            value={percentage}
            className="h-3"
            style={{
              // @ts-expect-error CSS custom property
              '--progress-background': percentage >= 80 ? 'var(--emerald-500)' :
                percentage >= 50 ? 'var(--amber-500)' : 'var(--rose-500)',
            }}
          />
        </motion.div>
      )}

      {/* Skills breakdown */}
      <div className="space-y-3">
        {/* Have skills */}
        {skillsByStatus.have.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Acquises ({skillsByStatus.have.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {skillsByStatus.have.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
                      skill.importance === 'critical' && "ring-1 ring-emerald-500",
                    )}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {skill.name}
                    {skill.importance && skill.importance !== 'required' && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {importanceConfig[skill.importance].label}
                      </span>
                    )}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills to develop */}
        {skillsByStatus.develop.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                À développer ({skillsByStatus.develop.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {skillsByStatus.develop.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
                      skill.importance === 'critical' && "ring-1 ring-amber-500",
                    )}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {skill.name}
                    {skill.importance && skill.importance !== 'required' && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {importanceConfig[skill.importance].label}
                      </span>
                    )}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Missing skills */}
        {skillsByStatus.missing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                Manquantes ({skillsByStatus.missing.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {skillsByStatus.missing.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
                      skill.importance === 'critical' && "ring-1 ring-rose-500",
                    )}
                  >
                    <X className="w-3 h-3 mr-1" />
                    {skill.name}
                    {skill.importance && skill.importance !== 'required' && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {importanceConfig[skill.importance].label}
                      </span>
                    )}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const SkillGapIndicator = memo(SkillGapIndicatorComponent);
