"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InteractiveCardProps extends React.ComponentProps<"div"> {
  /**
   * Maximum tilt rotation in degrees
   */
  maxTilt?: number
  /**
   * Scale factor on hover (1.05 = 5% larger)
   */
  scaleOnHover?: number
  /**
   * Spring animation duration in ms
   */
  springDuration?: number
  /**
   * Enable shine/glow effect
   */
  enableShine?: boolean
  /**
   * Enable tilt effect
   */
  enableTilt?: boolean
  /**
   * Enable scale on hover
   */
  enableScale?: boolean
  /**
   * Children to render inside the card
   */
  children: React.ReactNode
}

/**
 * A card component with advanced hover effects:
 * - 3D tilt effect that follows cursor movement
 * - Shine/glow effect that tracks cursor position
 * - Smooth scale on hover
 * - Spring-based animations for fluid transitions
 * - Uses CSS transforms for GPU-accelerated performance
 */
const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  (
    {
      className,
      children,
      maxTilt = 15,
      scaleOnHover = 1.02,
      springDuration = 300,
      enableShine = true,
      enableTilt = true,
      enableScale = true,
      style,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = React.useState(false)
    const [tilt, setTilt] = React.useState({ x: 0, y: 0 })
    const [shine, setShine] = React.useState({ x: 50, y: 50 })
    const rafRef = React.useRef<number | null>(null)
    const targetTilt = React.useRef({ x: 0, y: 0 })
    const currentTilt = React.useRef({ x: 0, y: 0 })
    const animationRef = React.useRef<number | null>(null)

    // Start animation function - defined inside useEffect to avoid hoisting issues
    const startAnimation = React.useCallback(() => {
      if (animationRef.current) return
      
      const animateFrame = () => {
        const spring = 0.15
        const damping = 0.8

        const dx = (targetTilt.current.x - currentTilt.current.x) * spring
        const dy = (targetTilt.current.y - currentTilt.current.y) * spring

        currentTilt.current.x += dx
        currentTilt.current.y += dy

        // Apply damping for smoother deceleration
        currentTilt.current.x *= damping + (1 - damping)
        currentTilt.current.y *= damping + (1 - damping)

        setTilt({
          x: currentTilt.current.x,
          y: currentTilt.current.y,
        })

        // Continue animation if not settled
        if (
          Math.abs(targetTilt.current.x - currentTilt.current.x) > 0.01 ||
          Math.abs(targetTilt.current.y - currentTilt.current.y) > 0.01
        ) {
          animationRef.current = requestAnimationFrame(animateFrame)
        } else {
          animationRef.current = null
        }
      }
      
      animationRef.current = requestAnimationFrame(animateFrame)
    }, [])

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate mouse position relative to center
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        // Calculate shine position (0-100%)
        const shineX = ((e.clientX - rect.left) / rect.width) * 100
        const shineY = ((e.clientY - rect.top) / rect.height) * 100

        setShine({ x: shineX, y: shineY })

        // Calculate tilt based on mouse position
        if (enableTilt) {
          const tiltX = (mouseY / (rect.height / 2)) * maxTilt
          const tiltY = -(mouseX / (rect.width / 2)) * maxTilt

          targetTilt.current = { x: tiltX, y: tiltY }
          startAnimation()
        }

        onMouseMove?.(e)
      },
      [enableTilt, maxTilt, startAnimation, onMouseMove]
    )

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

        // Reset tilt with spring animation
        targetTilt.current = { x: 0, y: 0 }
        startAnimation()

        onMouseLeave?.(e)
      },
      [startAnimation, onMouseLeave]
    )

    // Cleanup animation frame on unmount
    React.useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }, [])

    // CSS transition for smooth scale
    const transitionStyle = React.useMemo(
      () => ({
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
          enableScale && isHovered ? `scale(${scaleOnHover})` : "scale(1)"
        }`,
        transition: isHovered
          ? `transform ${springDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`
          : `transform ${springDuration * 2}ms cubic-bezier(0.23, 1, 0.32, 1)`,
        willChange: "transform",
        transformStyle: "preserve-3d" as const,
        contain: "layout style paint" as const,
        ...style,
      }),
      [tilt.x, tilt.y, enableScale, isHovered, scaleOnHover, springDuration, style]
    )

    return (
      <div
        ref={(node) => {
          // Handle both refs
          ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow",
          "hover:shadow-lg hover:shadow-primary/5",
          className
        )}
        style={transitionStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Shine overlay effect */}
        {enableShine && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.3 : 0,
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Inner glow effect */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-xl"
          style={{
            boxShadow: isHovered
              ? "inset 0 0 30px rgba(255,255,255,0.1)"
              : "inset 0 0 0px rgba(255,255,255,0)",
            transition: "box-shadow 300ms ease",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)

InteractiveCard.displayName = "InteractiveCard"

export { InteractiveCard, type InteractiveCardProps }
