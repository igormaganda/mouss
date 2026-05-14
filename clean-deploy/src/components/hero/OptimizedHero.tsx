'use client';

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  memo,
  useMemo 
} from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChevronDown,
  Compass 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import TypewriterText from './TypewriterText';
import FloatingElements from './FloatingElements';
import { cn } from '@/lib/utils';

interface OptimizedHeroProps {
  /** Main title text (first line) */
  title?: string;
  /** Title highlight text for typewriter effect */
  titleHighlight?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Badge text */
  badgeText?: string;
  /** Primary CTA text */
  ctaText?: string;
  /** Secondary CTA text */
  ctaSecondaryText?: string;
  /** Primary CTA click handler */
  onCtaClick?: () => void;
  /** Secondary CTA click handler */
  onCtaSecondaryClick?: () => void;
  /** Stats to display */
  stats?: Array<{ value: number; suffix?: string; label: string }>;
  /** Additional class names */
  className?: string;
}

// Animated counter component
const AnimatedCounter = memo(function AnimatedCounter({ 
  value, 
  suffix = '' 
}: { 
  value: number; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(() => 0);
  const reducedMotion = useReducedMotion();
  
  useEffect(() => {
    // Handle reduced motion immediately
    if (reducedMotion) {
      // Use requestAnimationFrame to defer setState
      const raf = requestAnimationFrame(() => setCount(value));
      return () => cancelAnimationFrame(raf);
    }

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, reducedMotion]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
});

// Stats item component
const StatItem = memo(function StatItem({ 
  stat, 
  delay, 
  reducedMotion 
}: { 
  stat: { value: number; suffix?: string; label: string }; 
  delay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: reducedMotion ? 0.01 : 0.5 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold text-emerald-500">
        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
});

/**
 * Optimized Hero Section with parallax, 3D effects, and performance optimizations
 * - Parallax scroll effect for background
 * - Mouse-following gradient
 * - Typewriter effect for title highlight
 * - Staggered content reveal animations
 * - Respects prefers-reduced-motion
 * - GPU-accelerated animations using transform/opacity only
 */
function OptimizedHero({
  title = 'Découvrez votre',
  titleHighlight = 'identité de carrière',
  subtitle = 'Transformez votre orientation professionnelle en une aventure interactive. Découvrez vos forces, visualisez vos parcours et atteignez vos objectifs avec l\'aide de l\'IA.',
  badgeText = '🚀 Nouveau : IA Générative intégrée',
  ctaText = 'Commencer l\'aventure',
  ctaSecondaryText = 'Voir la démo',
  onCtaClick,
  onCtaSecondaryClick,
  stats = [
    { value: 15000, suffix: '+', label: 'utilisateurs actifs' },
    { value: 8500, suffix: '+', label: 'parcours créés' },
    { value: 98, suffix: '%', label: 'taux de satisfaction' }
  ],
  className,
}: OptimizedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const reducedMotion = useReducedMotion();
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  // Smooth spring for parallax
  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -100]),
    { stiffness: 100, damping: 30, restDelta: 0.001 }
  );
  
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse position tracking for gradient effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (reducedMotion) return;
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, reducedMotion]);

  // Animation variants for staggered reveal
  const containerVariants = useMemo(() => ({
    hidden: reducedMotion ? {} : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
        delayChildren: reducedMotion ? 0 : 0.2
      }
    }
  }), [reducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: reducedMotion ? {} : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  }), [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'pt-24 pb-16',
        className
      )}
    >
      {/* Animated gradient background with mouse follow */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: reducedMotion ? 0 : parallaxY }}
      >
        {/* Primary gradient - follows mouse */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30 will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: reducedMotion ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out'
          }}
        />
        
        {/* Static gradients for depth */}
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-teal-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-1/2 h-1/2 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        
        {/* Animated pulse effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
        </div>
      </motion.div>

      {/* Floating 3D elements */}
      <FloatingElements />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: reducedMotion ? 1 : parallaxOpacity }}
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            {badgeText}
          </span>
        </motion.div>

        {/* Title with typewriter */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          {title}
          <br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            <TypewriterText
              text={titleHighlight}
              speed={80}
              pauseDuration={3000}
              loop
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button 
            size="lg" 
            onClick={onCtaClick}
            className={cn(
              'bg-gradient-to-r from-emerald-500 to-teal-500',
              'hover:from-emerald-600 hover:to-teal-600',
              'text-white px-8 py-6 text-lg rounded-xl',
              'shadow-lg shadow-emerald-500/25',
              'transition-all duration-300',
              'hover:shadow-xl hover:shadow-emerald-500/30',
              'hover:scale-105 active:scale-100'
            )}
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={onCtaSecondaryClick}
            className={cn(
              'px-8 py-6 text-lg rounded-xl',
              'border-2 hover:bg-accent',
              'transition-all duration-300',
              'hover:scale-105 active:scale-100'
            )}
          >
            <Play className="w-5 h-5 mr-2" />
            {ctaSecondaryText}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-16"
        >
          {stats.map((stat, i) => (
            <StatItem 
              key={i} 
              stat={stat} 
              delay={0.4 + i * 0.1}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Défiler</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={reducedMotion ? {} : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-emerald-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative compass */}
      <motion.div
        className="absolute bottom-8 right-8 opacity-10"
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <Compass className="w-32 h-32 text-emerald-500" />
      </motion.div>
    </section>
  );
}

export default memo(OptimizedHero);
