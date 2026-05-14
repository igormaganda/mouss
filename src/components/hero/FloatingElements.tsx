'use client';

import { memo } from 'react';
import { GraduationCap, Briefcase, Rocket, Trophy, Lightbulb, Target, Star, Zap } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface FloatingElement {
  id: string;
  icon: React.ElementType;
  label: string;
  gradient: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: 'sm' | 'md' | 'lg';
}

const floatingElements: FloatingElement[] = [
  {
    id: 'graduation',
    icon: GraduationCap,
    label: 'Formation',
    gradient: 'from-emerald-400 to-teal-500',
    delay: 0,
    duration: 6,
    x: '5%',
    y: '20%',
    size: 'lg'
  },
  {
    id: 'briefcase',
    icon: Briefcase,
    label: 'Carrière',
    gradient: 'from-amber-400 to-orange-500',
    delay: 0.5,
    duration: 7,
    x: '85%',
    y: '15%',
    size: 'md'
  },
  {
    id: 'rocket',
    icon: Rocket,
    label: 'Innovation',
    gradient: 'from-cyan-400 to-teal-500',
    delay: 1,
    duration: 5,
    x: '90%',
    y: '70%',
    size: 'lg'
  },
  {
    id: 'trophy',
    icon: Trophy,
    label: 'Succès',
    gradient: 'from-yellow-400 to-amber-500',
    delay: 1.5,
    duration: 6.5,
    x: '10%',
    y: '75%',
    size: 'md'
  },
  {
    id: 'lightbulb',
    icon: Lightbulb,
    label: 'Idées',
    gradient: 'from-teal-400 to-emerald-500',
    delay: 2,
    duration: 7.5,
    x: '75%',
    y: '40%',
    size: 'sm'
  },
  {
    id: 'target',
    icon: Target,
    label: 'Objectifs',
    gradient: 'from-rose-400 to-pink-500',
    delay: 2.5,
    duration: 5.5,
    x: '20%',
    y: '50%',
    size: 'sm'
  },
  {
    id: 'star',
    icon: Star,
    label: 'Excellence',
    gradient: 'from-purple-400 to-violet-500',
    delay: 3,
    duration: 6,
    x: '60%',
    y: '25%',
    size: 'sm'
  },
  {
    id: 'zap',
    icon: Zap,
    label: 'Énergie',
    gradient: 'from-lime-400 to-green-500',
    delay: 3.5,
    duration: 5,
    x: '40%',
    y: '80%',
    size: 'sm'
  }
];

const sizeClasses = {
  sm: 'w-12 h-12 sm:w-14 sm:h-14',
  md: 'w-16 h-16 sm:w-20 sm:h-20',
  lg: 'w-20 h-20 sm:w-24 sm:h-24'
};

const iconSizes = {
  sm: 'w-5 h-5 sm:w-6 sm:h-6',
  md: 'w-7 h-7 sm:w-8 sm:h-8',
  lg: 'w-8 h-8 sm:w-10 sm:h-10'
};

interface FloatingCardProps {
  element: FloatingElement;
  reducedMotion: boolean;
}

const FloatingCard = memo(function FloatingCard({ element, reducedMotion }: FloatingCardProps) {
  const { icon: Icon, gradient, delay, duration, x, y, size } = element;

  return (
    <div
      className={cn(
        'absolute pointer-events-none select-none',
        'will-change-transform transform-gpu',
        'perspective-1000'
      )}
      style={{
        left: x,
        top: y,
        animation: reducedMotion ? 'none' : `float-${element.id} ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {/* 3D Card container */}
      <div
        className={cn(
          'relative group',
          'transform-gpu transition-transform duration-300',
          'hover:scale-110'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(20px)'
        }}
      >
        {/* Card with glass effect */}
        <div
          className={cn(
            'rounded-2xl backdrop-blur-md',
            'bg-white/80 dark:bg-white/10',
            'border border-white/50 dark:border-white/20',
            'shadow-lg shadow-black/5 dark:shadow-black/20',
            sizeClasses[size],
            'flex items-center justify-center',
            'transition-shadow duration-300'
          )}
          style={{
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1),
              0 0 20px rgba(16, 185, 129, 0.1)
            `
          }}
        >
          {/* Gradient background glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-50',
              `bg-gradient-to-br ${gradient}`,
              'blur-sm'
            )}
          />
          
          {/* Icon */}
          <Icon
            className={cn(
              'relative z-10',
              iconSizes[size],
              'text-gray-700 dark:text-white'
            )}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}
          />
        </div>

        {/* Dynamic shadow */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl',
            `bg-gradient-to-br ${gradient}`,
            'opacity-20 blur-xl',
            '-z-10'
          )}
          style={{
            transform: 'translateZ(-20px) translateY(10px)'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float-${element.id} {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-15px) translateX(5px) rotate(2deg) scale(1.02);
          }
          50% {
            transform: translateY(-5px) translateX(-5px) rotate(-1deg) scale(1);
          }
          75% {
            transform: translateY(-20px) translateX(3px) rotate(1deg) scale(1.01);
          }
        }
      `}</style>
    </div>
  );
});

/**
 * 3D Floating elements component
 * Performance optimized with CSS-only animations (no JS for animation loop)
 * Respects prefers-reduced-motion
 */
function FloatingElements() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {floatingElements.map((element) => (
        <FloatingCard
          key={element.id}
          element={element}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

export default memo(FloatingElements);
