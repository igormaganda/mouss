"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps extends React.ComponentProps<"span"> {
  /**
   * Target number to count up to
   */
  target: number
  /**
   * Animation duration in milliseconds
   */
  duration?: number
  /**
   * Prefix to display before the number (e.g., "$")
   */
  prefix?: string
  /**
   * Suffix to display after the number (e.g., "+", "K", "%")
   */
  suffix?: string
  /**
   * Number of decimal places
   */
  decimals?: number
  /**
   * Custom easing function (t: 0-1, returns eased value 0-1)
   */
  easing?: (t: number) => number
  /**
   * Whether to start animation when in view
   */
  startOnView?: boolean
  /**
   * Whether to format with thousand separators
   */
  formatNumber?: boolean
  /**
   * Custom formatter function
   */
  formatter?: (value: number) => string
  /**
   * Callback when animation completes
   */
  onComplete?: () => void
}

/**
 * Easing functions for smooth animations
 */
const easings = {
  linear: (t: number) => t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

/**
 * Animated number counter component with:
 * - Smooth count-up animation using requestAnimationFrame
 * - Configurable easing functions
 * - Prefix/suffix formatting (e.g., "15K+", "$1,234")
 * - Auto-start when element enters viewport
 * - 60fps performance
 */
const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      className,
      target,
      duration = 2000,
      prefix = "",
      suffix = "",
      decimals = 0,
      easing = easings.easeOutQuart,
      startOnView = true,
      formatNumber = true,
      formatter,
      onComplete,
      style,
      ...props
    },
    ref
  ) => {
    const spanRef = React.useRef<HTMLSpanElement>(null)
    const [displayValue, setDisplayValue] = React.useState(0)
    const [hasStarted, setHasStarted] = React.useState(!startOnView)
    const animationRef = React.useRef<number | null>(null)
    const startTimeRef = React.useRef<number | null>(null)
    const onCompleteRef = React.useRef(onComplete)

    // Keep onComplete ref updated
    React.useEffect(() => {
      onCompleteRef.current = onComplete
    }, [onComplete])

    // Format the display value
    const formatValue = React.useCallback(
      (value: number): string => {
        if (formatter) {
          return formatter(value)
        }

        let formatted = value.toFixed(decimals)

        if (formatNumber) {
          // Add thousand separators
          const parts = formatted.split(".")
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          formatted = parts.join(".")
        }

        return `${prefix}${formatted}${suffix}`
      },
      [decimals, formatNumber, formatter, prefix, suffix]
    )

    // Animation loop - defined as a stable ref callback to avoid dependency issues
    React.useEffect(() => {
      if (!hasStarted) return

      const animateFrame = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)
        const currentValue = easedProgress * target

        setDisplayValue(currentValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateFrame)
        } else {
          setDisplayValue(target)
          onCompleteRef.current?.()
        }
      }

      // Start the animation
      animationRef.current = requestAnimationFrame(animateFrame)

      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [hasStarted, duration, easing, target])

    // Handle intersection observer for viewport detection
    React.useEffect(() => {
      if (!startOnView || !spanRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHasStarted(true)
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(spanRef.current)

      return () => {
        observer.disconnect()
      }
    }, [startOnView])

    return (
      <span
        ref={(node) => {
          ;(spanRef as React.MutableRefObject<HTMLSpanElement | null>).current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn("tabular-nums", className)}
        style={{ fontVariantNumeric: "tabular-nums", ...style }}
        {...props}
      >
        {formatValue(displayValue)}
      </span>
    )
  }
)

AnimatedCounter.displayName = "AnimatedCounter"

export { AnimatedCounter, type AnimatedCounterProps, easings }
