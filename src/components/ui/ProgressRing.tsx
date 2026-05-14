"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps extends React.ComponentProps<"div"> {
  /**
   * Progress value (0-100)
   */
  progress: number
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Custom size in pixels
   */
  customSize?: number
  /**
   * Stroke width in pixels
   */
  strokeWidth?: number
  /**
   * Show percentage text in center
   */
  showPercentage?: boolean
  /**
   * Custom center content
   */
  centerContent?: React.ReactNode
  /**
   * Gradient colors for the progress stroke
   */
  gradientColors?: {
    from: string
    to: string
  }
  /**
   * Animation duration in ms
   */
  animationDuration?: number
  /**
   * Background track color
   */
  trackColor?: string
  /**
   * Animation easing function
   */
  easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out"
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 180,
}

const strokeWidthMap = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
}

/**
 * Circular progress indicator with:
 * - SVG-based crisp rendering at any size
 * - Animated stroke-dashoffset
 * - Gradient stroke colors
 * - Center text showing percentage
 * - Multiple size variants
 */
const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      className,
      progress,
      size = "md",
      customSize,
      strokeWidth: customStrokeWidth,
      showPercentage = true,
      centerContent,
      gradientColors = { from: "oklch(0.646 0.222 41.116)", to: "oklch(0.6 0.118 184.704)" },
      animationDuration = 1000,
      trackColor = "oklch(0.922 0 0)",
      easing = "ease-out",
      style,
      ...props
    },
    ref
  ) => {
    const actualSize = customSize ?? sizeMap[size]
    const actualStrokeWidth = customStrokeWidth ?? strokeWidthMap[size]
    const [animatedProgress, setAnimatedProgress] = React.useState(0)
    const animationRef = React.useRef<number | null>(null)
    const startTimeRef = React.useRef<number | null>(null)
    const prevProgressRef = React.useRef(0)

    // Calculate circle properties
    const radius = (actualSize - actualStrokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

    // Animation using requestAnimationFrame
    React.useEffect(() => {
      const startProgress = prevProgressRef.current
      const endProgress = Math.min(100, Math.max(0, progress))
      const progressDelta = endProgress - startProgress

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      startTimeRef.current = null

      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / animationDuration, 1)

        // Apply easing
        let easedProgress: number
        switch (easing) {
          case "linear":
            easedProgress = progress
            break
          case "ease":
            easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
            break
          case "ease-in":
            easedProgress = progress * progress
            break
          case "ease-in-out":
            easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
            break
          case "ease-out":
          default:
            easedProgress = 1 - Math.pow(1 - progress, 3)
        }

        const currentProgress = startProgress + progressDelta * easedProgress
        setAnimatedProgress(currentProgress)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          prevProgressRef.current = endProgress
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [progress, animationDuration, easing])

    // Generate unique gradient ID
    const gradientId = React.useId()

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: actualSize, height: actualSize, ...style }}
        {...props}
      >
        <svg
          width={actualSize}
          height={actualSize}
          viewBox={`0 0 ${actualSize} ${actualSize}`}
          className="transform -rotate-90"
          style={{ contain: "strict" }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors.from} />
              <stop offset="100%" stopColor={gradientColors.to} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={actualSize / 2}
            cy={actualSize / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={actualStrokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={actualSize / 2}
            cy={actualSize / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={actualStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: `stroke-dashoffset ${animationDuration}ms ${easing}`,
              willChange: "stroke-dashoffset",
            }}
          />
        </svg>

        {/* Center content */}
        {(showPercentage || centerContent) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {centerContent ?? (
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  size === "sm" && "text-xs",
                  size === "md" && "text-lg",
                  size === "lg" && "text-2xl",
                  size === "xl" && "text-4xl"
                )}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {Math.round(animatedProgress)}%
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

ProgressRing.displayName = "ProgressRing"

export { ProgressRing, type ProgressRingProps }
