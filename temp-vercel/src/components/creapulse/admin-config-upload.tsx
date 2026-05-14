'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileUp, Save, Shield, Loader2, CheckCircle2 } from 'lucide-react'

// ====================== TYPES ======================
interface SettingConfig {
  key: string
  label: string
  description: string
  defaultValue: number
  icon: typeof FileUp
}

// ====================== SETTINGS CONFIGURATION ======================
const SETTINGS_CONFIG: SettingConfig[] = [
  {
    key: 'max_cv_size_mb',
    label: 'Taille max CV',
    description: 'Taille maximale autorisée pour l\'upload de CV',
    defaultValue: 5,
    icon: FileUp,
  },
  {
    key: 'max_market_doc_size_mb',
    label: 'Taille max document marché',
    description: 'Taille maximale pour les documents d\'analyse de marché',
    defaultValue: 10,
    icon: FileUp,
  },
  {
    key: 'max_general_upload_size_mb',
    label: 'Taille max upload général',
    description: 'Taille maximale pour les uploads de documents généraux',
    defaultValue: 10,
    icon: FileUp,
  },
  {
    key: 'max_image_size_mb',
    label: 'Taille max image',
    description: 'Taille maximale pour l\'upload d\'images',
    defaultValue: 5,
    icon: FileUp,
  },
]

// ====================== ANIMATION VARIANTS ======================
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

// ====================== SKELETON ======================
function SkeletonCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-gray-200 mb-3" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-48 bg-gray-100 rounded mb-3" />
          <div className="h-10 w-24 bg-gray-100 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

// ====================== MAIN COMPONENT ======================
export default function AdminConfigUpload() {
  const [values, setValues] = useState<Record<string, number>>({})
  const [originalValues, setOriginalValues] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Fetch settings on mount
  useEffect(() => {
    let cancelled = false
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          const settings = data.settings ?? data ?? {}
          const initial: Record<string, number> = {}
          SETTINGS_CONFIG.forEach((config) => {
            initial[config.key] =
              settings[config.key] != null
                ? Number(settings[config.key])
                : config.defaultValue
          })
          setValues(initial)
          setOriginalValues({ ...initial })
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Erreur de chargement des paramètres')
          // Fallback to defaults
          const defaults: Record<string, number> = {}
          SETTINGS_CONFIG.forEach((config) => {
            defaults[config.key] = config.defaultValue
          })
          setValues(defaults)
          setOriginalValues({ ...defaults })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSettings()
    return () => { cancelled = true }
  }, [])

  // Update a value
  const updateValue = useCallback((key: string, raw: string) => {
    const num = parseInt(raw, 10)
    if (!isNaN(num) && num >= 0) {
      setValues((prev) => ({ ...prev, [key]: num }))
      setSavedKeys((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }, [])

  // Save a single setting
  const saveSetting = useCallback(
    async (key: string) => {
      const value = values[key]
      setSaving(true)
      setError(null)

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })

        if (!res.ok) throw new Error(`Erreur ${res.status}`)

        setOriginalValues((prev) => ({ ...prev, [key]: value }))
        setSavedKeys((prev) => new Set(prev).add(key))
      } catch (e: any) {
        setError(e.message || 'Erreur lors de la sauvegarde')
      } finally {
        setSaving(false)
      }
    },
    [values]
  )

  // Save all changed settings
  const saveAll = useCallback(async () => {
    setSaving(true)
    setError(null)

    const changedKeys = SETTINGS_CONFIG.filter(
      (config) => values[config.key] !== originalValues[config.key]
    )

    if (changedKeys.length === 0) return

    try {
      const promises = changedKeys.map((config) =>
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: config.key, value: values[config.key] }),
        })
      )

      const results = await Promise.all(promises)
      const failed = results.filter((r) => !r.ok)
      if (failed.length > 0) {
        throw new Error(`${failed.length} paramètre(s) n'ont pas pu être sauvegardé(s)`)
      }

      // Update original values and saved keys
      const newOriginals = { ...originalValues }
      const newSavedKeys = new Set(savedKeys)
      changedKeys.forEach((config) => {
        newOriginals[config.key] = values[config.key]
        newSavedKeys.add(config.key)
      })
      setOriginalValues(newOriginals)
      setSavedKeys(newSavedKeys)
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }, [values, originalValues, savedKeys])

  // Check if there are unsaved changes
  const hasChanges = SETTINGS_CONFIG.some(
    (config) => values[config.key] !== originalValues[config.key]
  )

  if (loading) {
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeIn}>
          <div className="flex items-center gap-3 mb-6">
            <div className="animate-pulse w-10 h-10 rounded-xl bg-gray-200" />
            <div>
              <div className="animate-pulse h-5 w-48 bg-gray-200 rounded mb-1" />
              <div className="animate-pulse h-3 w-72 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Configuration des uploads
                </h3>
                <p className="text-sm text-gray-500">
                  Définissez les tailles maximales autorisées pour chaque type de document
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-xs text-red-600">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Settings grid */}
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SETTINGS_CONFIG.map((config) => {
          const currentValue = values[config.key] ?? config.defaultValue
          const isChanged = currentValue !== originalValues[config.key]
          const isSaved = savedKeys.has(config.key)
          const Icon = config.icon

          return (
            <motion.div key={config.key} variants={fadeIn}>
              <Card
                className={`border-0 shadow-sm transition-all ${
                  isChanged ? 'ring-2 ring-emerald-200' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {config.label}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        {config.description}
                      </p>
                    </div>
                    {isSaved && !isChanged && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={config.key} className="sr-only">
                      {config.label} en Mo
                    </Label>
                    <div className="relative flex-1">
                      <Input
                        id={config.key}
                        type="number"
                        min={0}
                        step={1}
                        value={currentValue}
                        onChange={(e) => updateValue(config.key, e.target.value)}
                        className="pr-10 rounded-lg h-10 text-sm"
                        disabled={saving}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        Mo
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={isChanged ? 'default' : 'outline'}
                      onClick={() => saveSetting(config.key)}
                      disabled={!isChanged || saving}
                      className={`rounded-lg h-10 px-3 ${
                        isChanged
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : ''
                      }`}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {isChanged && (
                    <p className="text-[10px] text-emerald-600 mt-2">
                      Modifié : {originalValues[config.key]} Mo → {currentValue} Mo
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Save all button */}
      {hasChanges && (
        <motion.div variants={fadeIn} className="flex justify-end">
          <Button
            onClick={saveAll}
            disabled={saving}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-6"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Tout sauvegarder
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
