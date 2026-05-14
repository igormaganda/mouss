'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Lock, User, Building, Phone, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => useAppStore.getState().navigate('landing')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </button>
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold">La Lettre Business</h1>
          <p className="text-muted-foreground mt-1">Plateforme B2B Newsletter</p>
        </motion.div>

        <AuthForm />
      </div>
    </div>
  )
}

function AuthForm() {
  const { currentView, navigate, login, showToast, setLoading, loading } = useAppStore()
  const isLogin = currentView === 'login'

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide'
    if (!form.password) newErrors.password = 'Mot de passe requis'
    return newErrors
  }

  const validateRegister = () => {
    const newErrors: Record<string, string> = {}
    if (!form.firstName) newErrors.firstName = 'Prénom requis'
    if (!form.lastName) newErrors.lastName = 'Nom requis'
    if (!form.email) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide'
    if (!form.password) newErrors.password = 'Mot de passe requis'
    else if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = isLogin ? validateLogin() : validateRegister()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin
        ? { email: form.email, password: form.password }
        : {
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            company: form.company,
            phone: form.phone,
          }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Erreur lors de la connexion', 'error')
        return
      }

      if (isLogin) {
        localStorage.setItem('llb-token', data.token)
        login(data.user)
        showToast(`Bienvenue ${data.user.firstName} !`, 'success')
      } else {
        showToast('Compte créé avec succès ! Connectez-vous.', 'success')
        navigate('login')
        setForm({ email: form.email, password: '', firstName: '', lastName: '', company: '', phone: '', confirmPassword: '' })
      }
    } catch {
      showToast('Erreur de connexion au serveur', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-lg border-0 shadow-black/5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Accédez à votre espace LLB'
              : 'Rejoignez La Lettre Business'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Marie"
                        value={form.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={form.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Mon Entreprise SARL"
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="06 12 34 56 78"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Separator />
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@monentreprise.fr"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="pl-9"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="pl-9"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Separator />
          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
            <button
              onClick={() => navigate(isLogin ? 'register' : 'login')}
              className="text-primary font-medium hover:underline ml-1"
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
          {isLogin && (
            <p className="text-xs text-muted-foreground text-center mt-1">
              Comptes démo : admin@lalettrebusiness.com / Admin123!
              <br />
              contact@digitalplus.fr / Client123!
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
