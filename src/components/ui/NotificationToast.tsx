"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

// Types
export type ToastVariant = "success" | "error" | "warning" | "info" | "loading"

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant: ToastVariant
  duration?: number
  action?: ToastAction
  persistent?: boolean
  createdAt: number
}

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, "id" | "createdAt">) => string
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<ToastData>) => void
  clearAll: () => void
}

// Context
const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

// Default durations
const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: 0, // No auto-dismiss for loading
}

// Icons
const ToastIcons: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
}

// Variant colors
const variantStyles: Record<ToastVariant, { icon: string; bg: string; border: string; progress: string }> = {
  success: {
    icon: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    progress: "bg-green-500",
  },
  error: {
    icon: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    progress: "bg-red-500",
  },
  warning: {
    icon: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    progress: "bg-yellow-500",
  },
  info: {
    icon: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    progress: "bg-blue-500",
  },
  loading: {
    icon: "text-primary",
    bg: "bg-card",
    border: "border-border",
    progress: "bg-primary",
  },
}

// Generate unique ID
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const addToast = React.useCallback((toast: Omit<ToastData, "id" | "createdAt">) => {
    const id = generateId()
    const newToast: ToastData = {
      ...toast,
      id,
      createdAt: Date.now(),
      duration: toast.duration ?? DEFAULT_DURATIONS[toast.variant],
    }

    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const updateToast = React.useCallback((id: string, updates: Partial<ToastData>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    )
  }, [])

  const clearAll = React.useCallback(() => {
    setToasts([])
  }, [])

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast, updateToast, clearAll }),
    [toasts, addToast, removeToast, updateToast, clearAll]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

// Hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Individual Toast Component
interface ToastItemProps {
  toast: ToastData
  onRemove: (id: string) => void
}

const ToastItem = React.memo(function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false)
  const [progress, setProgress] = React.useState(100)
  const animationRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef<number | null>(null)
  const pausedRef = React.useRef(false)

  const Icon = ToastIcons[toast.variant]
  const styles = variantStyles[toast.variant]

  // Handle removal with exit animation
  const handleRemove = React.useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [onRemove, toast.id])

  // Auto-dismiss timer with progress
  React.useEffect(() => {
    if (toast.persistent || toast.duration === 0 || toast.variant === "loading") return

    const duration = toast.duration ?? DEFAULT_DURATIONS[toast.variant]

    const animate = (timestamp: number) => {
      if (pausedRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        handleRemove()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [toast.duration, toast.persistent, toast.variant, handleRemove])

  const handleMouseEnter = () => {
    pausedRef.current = true
  }

  const handleMouseLeave = () => {
    pausedRef.current = false
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "group relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        "transform transition-all duration-300 ease-out",
        styles.bg,
        styles.border,
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100 animate-in slide-in-from-right-full"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ contain: "layout style" }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon
          className={cn(
            "h-5 w-5",
            styles.icon,
            toast.variant === "loading" && "animate-spin"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        {toast.title && (
          <p className="text-sm font-medium text-foreground">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        )}

        {/* Action button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Progress bar */}
      {!toast.persistent && toast.duration !== 0 && toast.variant !== "loading" && (
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg">
          <div
            className={cn("h-full transition-all duration-100", styles.progress)}
            style={{ width: `${progress}%`, opacity: 0.6 }}
          />
        </div>
      )}
    </div>
  )
})

// Toast Container Component
export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div
      aria-label="Notifications"
      className="fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-sm"
      style={{ contain: "strict" }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

// Convenience functions
export const toast = {
  success: (options: Omit<ToastData, "id" | "createdAt" | "variant">) =>
    ({ ...options, variant: "success" as const }),
  error: (options: Omit<ToastData, "id" | "createdAt" | "variant">) =>
    ({ ...options, variant: "error" as const }),
  warning: (options: Omit<ToastData, "id" | "createdAt" | "variant">) =>
    ({ ...options, variant: "warning" as const }),
  info: (options: Omit<ToastData, "id" | "createdAt" | "variant">) =>
    ({ ...options, variant: "info" as const }),
  loading: (options: Omit<ToastData, "id" | "createdAt" | "variant">) =>
    ({ ...options, variant: "loading" as const }),
}

export { ToastItem, type ToastItemProps }
