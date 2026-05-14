'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/hooks/use-store'
import { Zap, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const setView = useAppStore((s) => s.setView)
  const login = useAppStore((s) => s.login)
  const setRole = useAppStore((s) => s.setRole)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Stats data fetched from API for left panel
  const [statsData, setStatsData] = useState<Array<{ value: string; label: string }>>([])
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(window.location.hostname === 'localhost')

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStatsData([
          { value: data.totalUsers ? `${data.totalUsers.toLocaleString('fr-FR')}+` : '—', label: 'Diagnostics' },
          { value: '95%', label: 'Satisfaction' },
          { value: '12', label: 'Territoires' },
          { value: '7', label: 'Modules' },
        ])
      } catch {
        setStatsData([
          { value: '—', label: 'Diagnostics' },
          { value: '—', label: 'Satisfaction' },
          { value: '—', label: 'Territoires' },
          { value: '—', label: 'Modules' },
        ])
      }
    }
    fetchStats()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Erreur de connexion')
          setLoading(false)
          return
        }

        // Store JWT token in localStorage
        localStorage.setItem('cp_token', data.token)

        // Map Prisma role to frontend role
        const roleMap: Record<string, 'user' | 'counselor' | 'admin'> = {
          USER: 'user',
          COUNSELOR: 'counselor',
          ADMIN: 'admin',
        }
        const frontendRole = roleMap[data.user.role] || 'user'
        setRole(frontendRole)
        login(data.user.name, data.user.email, data.user.id)
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Erreur lors de la création du compte')
          setLoading(false)
          return
        }

        // Store JWT token in localStorage
        localStorage.setItem('cp_token', data.token)
        login(data.user.name, data.user.email, data.user.id)
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Bienvenue sur CréaPulse
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Votre plateforme de diagnostic entrepreneurial propulsée par l&apos;intelligence artificielle.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
              {(statsData.length > 0 ? statsData : [
                { value: '—', label: 'Diagnostics' },
                { value: '—', label: 'Satisfaction' },
                { value: '—', label: 'Territoires' },
                { value: '—', label: 'Modules' },
              ]).map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-emerald-200">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Test accounts info - development only */}
            {isDev && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-emerald-100 mb-2">Comptes de test</p>
                <div className="space-y-1 text-xs text-emerald-200">
                  <p>Porteur : marie@example.com</p>
                  <p>Conseiller : conseiller@creapulse.fr</p>
                  <p>Admin : admin@creapulse.fr</p>
                  <p className="text-emerald-300 mt-1">Mot de passe : password123</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </button>

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CréaPulse
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-gray-500 mb-8">
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre espace'
              : 'Rejoignez CréaPulse et lancez votre diagnostic'}
          </p>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Nom complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Marie Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Adresse e-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="marie@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  J&apos;accepte les{' '}
                  <span className="text-emerald-600 font-medium cursor-pointer hover:underline">
                    conditions générales
                  </span>{' '}
                  et la{' '}
                  <span className="text-emerald-600 font-medium cursor-pointer hover:underline">
                    politique de confidentialité
                  </span>
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : mode === 'login' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          {/* Social login */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-gray-200 hover:bg-gray-50 font-normal"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-gray-200 hover:bg-gray-50 font-normal"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00A4EF" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>

          {/* Quick login buttons for testing - development only */}
          {isDev && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-3">Accès rapide (test)</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Porteur', email: 'marie@example.com', role: 'user' },
                  { label: 'Conseiller', email: 'conseiller@creapulse.fr', role: 'counselor' },
                  { label: 'Admin', email: 'admin@creapulse.fr', role: 'admin' },
                ].map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={async () => {
                      setLoading(true)
                      setError('')
                      try {
                        const res = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: account.email, password: 'password123' }),
                        })
                        const data = await res.json()
                        if (res.ok) {
                          localStorage.setItem('cp_token', data.token)
                          const roleMap: Record<string, 'user' | 'counselor' | 'admin'> = {
                            USER: 'user', COUNSELOR: 'counselor', ADMIN: 'admin',
                          }
                          setRole(roleMap[data.user.role] || 'user')
                          login(data.user.name, data.user.email, data.user.id)
                        } else {
                          setError(data.error || 'Erreur')
                        }
                      } catch {
                        setError('Erreur réseau')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                  >
                    {account.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle login/register */}
          <p className="mt-8 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  onClick={() => { setMode('register'); setError('') }}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
