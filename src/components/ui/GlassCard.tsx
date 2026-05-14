"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentProps<"div"> {
  /**
   * Blur intensity (default: 12px)
   */
  blur?: number | "none" | "sm" | "md" | "lg" | "xl"
  /**
   * Background opacity (0-1)
   */
  opacity?: number
  /**
   * Border gradient colors
   */
  borderGradient?: {
    from: string
    via?: string
    to: string
  }
  /**
   * Enable inner glow effect
   */
  enableInnerGlow?: boolean
  /**
   * Enable hover state with increased blur
   */
  enableHoverEffect?: boolean
  /**
   * Hover blur intensity multiplier
   */
  hoverBlurMultiplier?: number
  /**
   * Children to render inside the card
   */
  children: React.ReactNode
}

const blurMap = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
}

/**
 * Glassmorphism card component with:
 * - Backdrop blur effect
 * - Semi-transparent background
 * - Gradient border effect
 * - Inner glow for depth
 * - Hover state with enhanced effects
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      children,
      blur = "lg",
      opacity = 0.1,
      borderGradient = {
        from: "rgba(255, 255, 255, 0.3)",
        via: "rgba(255, 255, 255, 0.1)",
        to: "rgba(255, 255, 255, 0.2)",
      },
      enableInnerGlow = true,
      enableHoverEffect = true,
      hoverBlurMultiplier = 1.5,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const cardRef = React.useRef<HTMLDivElement>(null)

    // Calculate actual blur value
    const baseBlur = typeof blur === "number" ? blur : blurMap[blur]
    const currentBlur = enableHoverEffect && isHovered ? baseBlur * hoverBlurMultiplier : baseBlur

    const handleMouseEnter = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(true)
        onMouseEnter?.(e)
      },
      [onMouseEnter]
    )

    const handleMouseLeave = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(false)
        onMouseLeave?.(e)
      },
      [onMouseLeave]
    )

    // Generate unique gradient ID for the border
    const gradientId = React.useId()

    return (
      <div
        ref={(node) => {
          ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          "relative overflow-hidden rounded-xl p-px",
          "transition-all duration-300 ease-out",
          enableHoverEffect && "hover:shadow-2xl hover:shadow-white/5",
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${borderGradient.from}, ${borderGradient.via ?? borderGradient.from}, ${borderGradient.to})`,
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Inner container with glass effect */}
        <div
          className="relative h-full w-full rounded-xl"
          style={{
            backdropFilter: `blur(${currentBlur}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${currentBlur}px) saturate(180%)`,
            backgroundColor: `rgba(255, 255, 255, ${opacity})`,
            transition: enableHoverEffect ? "backdrop-filter 300ms ease, background-color 300ms ease" : undefined,
            contain: "layout style",
          }}
        >
          {/* Inner glow effect */}
          {enableInnerGlow && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                boxShadow: `
                  inset 0 1px 1px rgba(255, 255, 255, 0.15),
                  inset 0 -1px 1px rgba(0, 0, 0, 0.05)
                `,
                transition: enableHoverEffect ? "box-shadow 300ms ease" : undefined,
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 p-6">{children}</div>

          {/* Subtle noise texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Animated shimmer effect on hover */}
        {enableHoverEffect && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-20 animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        )}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

// Dark mode variant with different defaults
const DarkGlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ borderGradient, opacity = 0.05, ...props }, ref) => {
    const defaultBorderGradient = borderGradient ?? {
      from: "rgba(255, 255, 255, 0.1)",
      via: "rgba(255, 255, 255, 0.05)",
      to: "rgba(255, 255, 255, 0.08)",
    }

    return (
      <GlassCard
        ref={ref}
        borderGradient={defaultBorderGradient}
        opacity={opacity}
        {...props}
      />
    )
  }
)

DarkGlassCard.displayName = "DarkGlassCard"

export { GlassCard, DarkGlassCard, type GlassCardProps }
