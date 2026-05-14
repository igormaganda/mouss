"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Types
interface ConfettiParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
  shape: "square" | "circle" | "strip"
  opacity: number
}

interface ConfettiProps extends React.ComponentProps<"div"> {
  /**
   * Whether to trigger the confetti animation
   */
  active: boolean
  /**
   * Number of particles to generate
   */
  particleCount?: number
  /**
   * Colors to use for the confetti (defaults to theme colors)
   */
  colors?: string[]
  /**
   * Duration of the animation in ms
   */
  duration?: number
  /**
   * Origin point for burst ("center" | "top" | { x: number, y: number })
   */
  origin?: "center" | "top" | "bottom" | { x: number; y: number }
  /**
   * Callback when animation completes
   */
  onComplete?: () => void
  /**
   * Whether to auto-cleanup after animation
   */
  autoCleanup?: boolean
  /**
   * Gravity strength (default: 0.3)
   */
  gravity?: number
  /**
   * Initial velocity spread
   */
  velocity?: number
  /**
   * Wind force (horizontal drift)
   */
  wind?: number
}

// Default theme colors matching the project
const defaultColors = [
  "oklch(0.646 0.222 41.116)", // chart-1 (orange)
  "oklch(0.6 0.118 184.704)", // chart-2 (cyan)
  "oklch(0.398 0.07 227.392)", // chart-3 (blue)
  "oklch(0.828 0.189 84.429)", // chart-4 (lime)
  "oklch(0.769 0.188 70.08)", // chart-5 (gold)
  "oklch(0.704 0.191 22.216)", // destructive (red)
  "oklch(0.488 0.243 264.376)", // purple
]

// Physics constants
const GRAVITY = 0.3
const AIR_RESISTANCE = 0.99
const WIND_RESISTANCE = 0.98

/**
 * Confetti celebration effect component with:
 * - Physics-based particle animation
 * - Multiple particle shapes (squares, circles, strips)
 * - Gravity, wind, and air resistance simulation
 * - Configurable burst origin
 * - Auto-cleanup after animation
 * - GPU-accelerated rendering
 */
const Confetti = React.forwardRef<HTMLDivElement, ConfettiProps>(
  (
    {
      className,
      active,
      particleCount = 150,
      colors = defaultColors,
      duration = 4000,
      origin = "center",
      onComplete,
      autoCleanup = true,
      gravity = GRAVITY,
      velocity = 15,
      wind = 0.1,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [particles, setParticles] = React.useState<ConfettiParticle[]>([])
    const animationRef = React.useRef<number | null>(null)
    const startTimeRef = React.useRef<number | null>(null)
    const isActiveRef = React.useRef(false)

    // Calculate origin position
    const getOriginPosition = React.useCallback(
      (width: number, height: number): { x: number; y: number } => {
        if (typeof origin === "object") {
          return { x: origin.x * width, y: origin.y * height }
        }

        switch (origin) {
          case "top":
            return { x: width / 2, y: 0 }
          case "bottom":
            return { x: width / 2, y: height }
          case "center":
          default:
            return { x: width / 2, y: height / 2 }
        }
      },
      [origin]
    )

    // Create particles
    const createParticles = React.useCallback(() => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const width = rect.width || window.innerWidth
      const height = rect.height || window.innerHeight
      const { x: originX, y: originY } = getOriginPosition(width, height)

      const shapes: ConfettiParticle["shape"][] = ["square", "circle", "strip"]
      const newParticles: ConfettiParticle[] = []

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * velocity + velocity / 2
        const isBottomOrigin = origin === "bottom" || (typeof origin === "object" && origin.y > 0.5)

        newParticles.push({
          id: i,
          x: originX + (Math.random() - 0.5) * 20,
          y: originY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed * (isBottomOrigin ? 1.2 : 1),
          vy: Math.sin(angle) * speed - (isBottomOrigin ? 5 : 0),
          color: colors[Math.floor(Math.random() * colors.length)] ?? defaultColors[0]!,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          size: Math.random() * 8 + 6,
          shape: shapes[Math.floor(Math.random() * shapes.length)]!,
          opacity: 1,
        })
      }

      setParticles(newParticles)
    }, [particleCount, colors, velocity, origin, getOriginPosition])

    // Animation loop - use useEffect with stable refs to avoid dependency issues
    React.useEffect(() => {
      if (!active) return

      const animateFrame = (timestamp: number) => {
        if (!isActiveRef.current) return

        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = elapsed / duration

        // Update particles
        setParticles(prevParticles => prevParticles.map((particle) => {
          // Apply physics
          const newVy = particle.vy + gravity
          const newVx = particle.vx + wind * (Math.random() - 0.5)

          // Apply air resistance
          const finalVx = newVx * AIR_RESISTANCE
          const finalVy = newVy * AIR_RESISTANCE

          // Update position
          const newX = particle.x + finalVx
          const newY = particle.y + finalVy

          // Update rotation
          const newRotation = particle.rotation + particle.rotationSpeed

          // Fade out towards end
          const fadeStart = 0.7
          const newOpacity = progress > fadeStart ? 1 - (progress - fadeStart) / (1 - fadeStart) : 1

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: finalVx * WIND_RESISTANCE,
            vy: finalVy,
            rotation: newRotation,
            opacity: Math.max(0, newOpacity),
          }
        }))

        // Continue animation or complete
        if (elapsed < duration) {
          animationRef.current = requestAnimationFrame(animateFrame)
        } else {
          if (autoCleanup) {
            setParticles([])
          }
          onComplete?.()
        }
      }

      // Start animation
      isActiveRef.current = true
      startTimeRef.current = null
      createParticles()
      animationRef.current = requestAnimationFrame(animateFrame)

      return () => {
        isActiveRef.current = false
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        setParticles([])
      }
    }, [active, createParticles, duration, gravity, wind, autoCleanup, onComplete])

    // Render particles
    const renderParticle = React.useCallback((particle: ConfettiParticle) => {
      const baseStyle: React.CSSProperties = {
        position: "absolute",
        left: particle.x,
        top: particle.y,
        transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
        opacity: particle.opacity,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }

      switch (particle.shape) {
        case "circle":
          return (
            <div
              key={particle.id}
              style={{
                ...baseStyle,
                width: particle.size,
                height: particle.size,
                borderRadius: "50%",
                backgroundColor: particle.color,
              }}
            />
          )
        case "strip":
          return (
            <div
              key={particle.id}
              style={{
                ...baseStyle,
                width: particle.size * 0.4,
                height: particle.size * 2,
                borderRadius: 2,
                backgroundColor: particle.color,
              }}
            />
          )
        case "square":
        default:
          return (
            <div
              key={particle.id}
              style={{
                ...baseStyle,
                width: particle.size,
                height: particle.size,
                borderRadius: 2,
                backgroundColor: particle.color,
              }}
            />
          )
      }
    }, [])

    return (
      <div
        ref={(node) => {
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn("fixed inset-0 overflow-hidden pointer-events-none z-50", className)}
        style={{ contain: "strict", ...style }}
        {...props}
      >
        {particles.map(renderParticle)}
      </div>
    )
  }
)

Confetti.displayName = "Confetti"

// Hook for triggering confetti
function useConfetti() {
  const [active, setActive] = React.useState(false)
  const [key, setKey] = React.useState(0)

  const trigger = React.useCallback(() => {
    setKey((prev) => prev + 1)
    setActive(true)
  }, [])

  const handleComplete = React.useCallback(() => {
    setActive(false)
  }, [])

  return {
    trigger,
    isActive: active,
    confettiProps: {
      key,
      active,
      onComplete: handleComplete,
    },
  }
}

// Preset configurations
const confettiPresets = {
  celebration: {
    particleCount: 200,
    velocity: 20,
    gravity: 0.4,
    origin: "center" as const,
  },
  snowfall: {
    particleCount: 100,
    velocity: 5,
    gravity: 0.1,
    wind: 0.5,
    origin: "top" as const,
  },
  explosion: {
    particleCount: 300,
    velocity: 30,
    gravity: 0.5,
    origin: { x: 0.5, y: 0.8 } as { x: number; y: number },
  },
}

export { Confetti, useConfetti, confettiPresets, type ConfettiProps, type ConfettiParticle }
