'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAppStore, type Wedge } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  Target,
  Eye,
  MousePointerClick,
  Zap,
  Mail,
  Clock,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdPreview } from '@/components/llb/ad-preview'
import { NewsletterPreview } from '@/components/llb/newsletter-preview'

const SECTOR_OPTIONS = [
  'Immobilier',
  'Finance & Banque',
  'Santé & Pharma',
  'Tech & IT',
  'Industrie',
  'Commerce & Distribution',
  'BTP & Construction',
  'Énergie & Environnement',
  'Tourisme & Hôtellerie',
  'Formation & Éducation',
  'Juridique & Conseil',
  'Experts-comptables',
  'Ressources Humaines',
  'Autre',
]

export default function AdCreationForm() {
  const { navigate, user, wedges, addAd, showToast, setLoading, loading } = useAppStore()

  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    region: '',
    wedgeId: '',
    cta: '',
    destinationUrl: '',
    budget: 49,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState<'ad' | 'newsletter'>('ad')

  // Stable form update
  const updateField = useCallback((field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validateStep = useCallback((step: number): boolean => {
    const errors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Le titre est requis'
      if (!formData.description.trim()) errors.description = 'La description est requise'
      else if (formData.description.length < 20) errors.description = 'La description doit contenir au moins 20 caractères'
      if (!formData.sector) errors.sector = 'Le secteur est requis'
      if (!formData.region.trim()) errors.region = 'La région est requise'
    }
    if (step === 2) {
      if (!formData.wedgeId) errors.wedgeId = 'Veuillez sélectionner un wedge'
      if (!formData.cta.trim()) errors.cta = 'Le texte du CTA est requis'
      if (!formData.destinationUrl.trim()) errors.destinationUrl = "L'URL de destination est requise"
      else if (!/^https?:\/\/.+/.test(formData.destinationUrl)) errors.destinationUrl = "L'URL doit commencer par http:// ou https://"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmitAd = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

      const adRes = await fetch('/api/ads', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      }).then((r) => r.json())

      const newAd = adRes.data || adRes
      if (newAd && newAd.id) {
        addAd(newAd)

        try {
          await fetch('/api/payments', {
            method: 'POST',
            headers,
            body: JSON.stringify({ adId: newAd.id, amount: formData.budget }),
          }).then((r) => r.json())
        } catch {
          // Payment endpoint might not exist yet
        }

        showToast('Annonce créée avec succès !')
        navigate('client/ads')
      } else {
        showToast(adRes.error || "Erreur lors de la création de l'annonce", 'error')
      }
    } catch {
      showToast("Erreur lors de la création de l'annonce", 'error')
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Offre', 'Ciblage', 'Confirmation']

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate('client/ads')} className="text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux annonces
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Créer une annonce</h1>
        <p className="text-muted-foreground">Configurez votre annonce en 3 étapes</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => {
                if (i < formStep) setFormStep(i + 1)
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all flex-1 ${
                formStep === i + 1
                  ? 'bg-amber-500 text-white shadow-md'
                  : formStep > i + 1
                  ? 'bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                formStep > i + 1 ? 'bg-amber-500 text-white' : ''
              }`}>
                {formStep > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < stepLabels.length - 1 && (
              <div className={`h-0.5 w-6 ${formStep > i + 1 ? 'bg-amber-400' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form + Live Preview Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="max-w-2xl">
          {/* Step 1: Offre */}
          {formStep === 1 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Votre offre
                </CardTitle>
                <CardDescription>Décrivez votre annonce et votre offre commerciale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="ad-title">Titre de l&apos;annonce *</Label>
                  <Input
                    id="ad-title"
                    placeholder="Ex: Expertise Comptable - Audit & Conseil"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className={formErrors.title ? 'border-red-400' : ''}
                  />
                  {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-description">Description *</Label>
                  <Textarea
                    id="ad-description"
                    placeholder="Décrivez votre offre en détail..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    className={formErrors.description ? 'border-red-400' : ''}
                  />
                  <div className="flex justify-between">
                    {formErrors.description ? (
                      <p className="text-xs text-red-500">{formErrors.description}</p>
                    ) : (
                      <span />
                    )}
                    <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {formData.description.length} / 500
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secteur *</Label>
                  <Select value={formData.sector} onValueChange={(val) => updateField('sector', val)}>
                    <SelectTrigger className={formErrors.sector ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTOR_OPTIONS.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.sector && <p className="text-xs text-red-500">{formErrors.sector}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-region">Région *</Label>
                  <Input
                    id="ad-region"
                    placeholder="Ex: Nouvelle-Aquitaine"
                    value={formData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                    className={formErrors.region ? 'border-red-400' : ''}
                  />
                  {formErrors.region && <p className="text-xs text-red-500">{formErrors.region}</p>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-5 justify-end">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleNextStep}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Ciblage */}
          {formStep === 2 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  Ciblage & Action
                </CardTitle>
                <CardDescription>Choisissez votre audience et configurez l&apos;appel à l&apos;action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Wedge (newsletter) *</Label>
                  <Select value={formData.wedgeId} onValueChange={(val) => updateField('wedgeId', val)}>
                    <SelectTrigger className={formErrors.wedgeId ? 'border-red-400' : ''}>
                      <SelectValue placeholder="Sélectionnez un wedge" />
                    </SelectTrigger>
                    <SelectContent>
                      {wedges.length === 0 ? (
                        <SelectItem value="__none" disabled>Aucun wedge disponible</SelectItem>
                      ) : (
                        wedges.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name} ({w.subscriberCount} abonnés)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formErrors.wedgeId && <p className="text-xs text-red-500">{formErrors.wedgeId}</p>}
                  <p className="text-xs text-muted-foreground">
                    {wedges.length > 0
                      ? `${wedges.length} wedge${wedges.length > 1 ? 's' : ''} disponible${wedges.length > 1 ? 's' : ''}`
                      : 'Chargement des wedges...'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-cta">Texte du bouton (CTA) *</Label>
                  <Input
                    id="ad-cta"
                    placeholder="Ex: Demander un devis"
                    value={formData.cta}
                    onChange={(e) => updateField('cta', e.target.value)}
                    className={formErrors.cta ? 'border-red-400' : ''}
                  />
                  {formErrors.cta && <p className="text-xs text-red-500">{formErrors.cta}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-url">URL de destination *</Label>
                  <Input
                    id="ad-url"
                    placeholder="https://www.example.com/offre"
                    value={formData.destinationUrl}
                    onChange={(e) => updateField('destinationUrl', e.target.value)}
                    className={formErrors.destinationUrl ? 'border-red-400' : ''}
                  />
                  {formErrors.destinationUrl && <p className="text-xs text-red-500">{formErrors.destinationUrl}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-budget">Budget (€)</Label>
                  <Input
                    id="ad-budget"
                    type="number"
                    min={1}
                    value={formData.budget}
                    onChange={(e) => updateField('budget', parseInt(e.target.value) || 49)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Budget minimum : 49€ par envoi (Bus Mailing)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-5 justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleNextStep}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {formStep === 3 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Confirmation
                </CardTitle>
                <CardDescription>Vérifiez votre annonce avant de la publier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Ad Summary */}
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{formData.title || 'Sans titre'}</h3>
                    <Badge variant="outline" className="text-xs shrink-0">{formData.budget}€</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Secteur</p>
                      <p className="font-medium">{formData.sector || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Région</p>
                      <p className="font-medium">{formData.region || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Wedge</p>
                      <p className="font-medium">{wedges.find((w) => w.id === formData.wedgeId)?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Abonnés</p>
                      <p className="font-medium">{wedges.find((w) => w.id === formData.wedgeId)?.subscriberCount || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CTA</p>
                      <p className="font-medium">{formData.cta}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Destination</p>
                      <a href={formData.destinationUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-600 hover:underline text-xs truncate block">
                        {formData.destinationUrl}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Résumé
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Votre annonce sera soumise à validation par notre équipe</li>
                    <li>• Après validation, vous pourrez effectuer le paiement</li>
                    <li>• L&apos;annonce sera diffusée dans la prochaine newsletter du wedge sélectionné</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-5 justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  disabled={loading}
                  onClick={handleSubmitAd}
                >
                  {loading ? 'Création...' : `Confirmer et payer ${formData.budget}€`}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Live Preview Panel - visible on ALL steps */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Aperçu en direct</h3>
            </div>
            <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'ad' | 'newsletter')}>
              <TabsList className="h-7 p-0.5">
                <TabsTrigger value="ad" className="text-xs px-2.5 h-6">Annonce</TabsTrigger>
                <TabsTrigger value="newsletter" className="text-xs px-2.5 h-6">Newsletter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {previewMode === 'ad' ? (
            <AdPreview
              ad={{
                title: formData.title,
                description: formData.description,
                sector: formData.sector,
                region: formData.region,
                cta: formData.cta,
                destinationUrl: formData.destinationUrl,
                company: user?.company,
                budget: formData.budget,
              }}
            />
          ) : (
            <NewsletterPreview
              newsletter={{
                subject: formData.title || 'Votre annonce',
                wedge: wedges.find((w) => w.id === formData.wedgeId),
                ad: {
                  title: formData.title,
                  description: formData.description,
                  cta: formData.cta,
                  company: user?.company,
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
