'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  /** Text to type out */
  text: string;
  /** Typing speed in milliseconds */
  speed?: number;
  /** Pause duration at end before restart (ms) */
  pauseDuration?: number;
  /** Whether to loop the animation */
  loop?: boolean;
  /** Additional class names */
  className?: string;
  /** Cursor character */
  cursorChar?: string;
  /** Callback when typing completes */
  onComplete?: () => void;
}

/**
 * Typewriter effect component with blinking cursor
 * Performance optimized with requestAnimationFrame and reduced motion support
 */
function TypewriterText({
  text,
  speed = 50,
  pauseDuration = 2000,
  loop = true,
  className,
  cursorChar = '|',
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  // Typing effect
  useEffect(() => {
    if (reducedMotion) {
      // If reduced motion, show text immediately
      setDisplayText(text);
      setIsTyping(false);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let animationFrameId: number;
    let lastTime = 0;

    const type = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      
      const delta = timestamp - lastTime;
      
      if (delta >= speed) {
        lastTime = timestamp;
        
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
          animationFrameId = requestAnimationFrame(type);
        } else {
          setIsTyping(false);
          onComplete?.();
          
          if (loop) {
            timeoutId = setTimeout(() => {
              currentIndex = 0;
              setIsTyping(true);
              setDisplayText('');
              animationFrameId = requestAnimationFrame(type);
            }, pauseDuration);
          }
        }
      } else {
        animationFrameId = requestAnimationFrame(type);
      }
    };

    animationFrameId = requestAnimationFrame(type);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [text, speed, pauseDuration, loop, reducedMotion, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (reducedMotion) {
      setCursorVisible(true);
      return;
    }

    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530); // Slightly off-sync for natural feel

    return () => clearInterval(blinkInterval);
  }, [reducedMotion]);

  return (
    <span className={cn('inline-flex items-center', className)}>
      <span className="inline">{displayText}</span>
      <span
        className={cn(
          'inline-block w-[0.1em] ml-1 font-thin',
          'text-emerald-500 dark:text-emerald-400',
          'transition-opacity duration-100',
          cursorVisible ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      >
        {cursorChar}
      </span>
    </span>
  );
}

export default memo(TypewriterText);
