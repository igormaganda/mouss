'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

// Initial value for SSR
const getServerSnapshot = () => false;

// Get snapshot for client
function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Subscribe to changes
function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }
  
  // Fallback for older browsers
  mediaQuery.addListener(callback);
  return () => mediaQuery.removeListener(callback);
}

/**
 * Hook to detect user's motion preferences
 * Respects prefers-reduced-motion media query
 * Uses useSyncExternalStore for SSR-safe subscription
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Get animation variants based on reduced motion preference
 */
export function getMotionVariants(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };
  }
  
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
}

/**
 * Get transition config based on reduced motion preference
 */
export function getMotionTransition(reducedMotion: boolean) {
  if (reducedMotion) {
    return { duration: 0.01 };
  }
  
  return { duration: 0.5, ease: 'easeOut' };
}

export default useReducedMotion;
