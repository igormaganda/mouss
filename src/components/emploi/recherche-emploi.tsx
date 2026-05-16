'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, Building2, Search, Filter, ChevronDown, ChevronUp, Clock, DollarSign, Loader2, Calendar } from 'lucide-react'

interface Offre {
  id: string
  intitule: string
  description: string
  dateCreation: string
  lieuTravail: {
    libelle: string
    codePostal: string
    commune: string
    latitude: number
    longitude: number
  }
  entreprise: {
    nom: string
    description?: string
    logo?: string
    url?: string
  }
  typeContrat: string
  typeContratLibelle: string
  natureContrat: string
  dureeTravailLibelle: string
  dureeTravailLibelleConverti: string
  experienceExige: string
  experienceLibelle: string
  salaire?: {
    libelle: string
    commentaire?: string
  }
 romeCode: string
  romeLibelle: string
  alternance: boolean
  nombrePostes: number
  origineOffre: {
    origine: string
    urlOrigine: string
  }
}

interface ResultatRecherche {
  resultats: Offre[]
}

export function RechercheEmploi() {
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState('0-49')
  const [totalResults, setTotalResults] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Filtres
  const [filters, setFilters] = useState({
    motsCles: '',
    departement: '',
    commune: '',
    distance: '',
    typeContrat: '',
    experience: '',
    salaireMin: '',
    dureeHebdoMin: '',
    dureeHebdoMax: '',
    alternance: false,
  })

  const fetchOffres = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('range', range)

      if (filters.motsCles) params.set('motsCles', filters.motsCles)
      if (filters.departement) params.set('departement', filters.departement)
      if (filters.commune) params.set('commune', filters.commune)
      if (filters.distance) params.set('distance', filters.distance)
      if (filters.typeContrat) params.set('typeContrat', filters.typeContrat)
      if (filters.experience) params.set('experience', filters.experience)
      if (filters.salaireMin) params.set('salaireMin', filters.salaireMin)
      if (filters.dureeHebdoMin) params.set('dureeHebdoMin', filters.dureeHebdoMin)
      if (filters.dureeHebdoMax) params.set('dureeHebdoMax', filters.dureeHebdoMax)
      if (filters.alternance) params.set('alternance', 'true')

      const response = await fetch(`/api/offres-emploi?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres')
      }

      const data: ResultatRecherche = await response.json()

      if (Array.isArray(data.resultats)) {
        setOffres(data.resultats)
        // Extraire le nombre total de résultats depuis Content-Range header
        const contentRange = response.headers.get('Content-Range')
        if (contentRange) {
          const match = contentRange.match(/\/(\d+)$/)
          if (match) {
            setTotalResults(parseInt(match[1]))
          }
        }
      } else {
        setOffres([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setOffres([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffres()
  }, [range])

  const handleSearch = () => {
    setRange('0-49')
    fetchOffres()
  }

  const handleReset = () => {
    setFilters({
      motsCles: '',
      departement: '',
      commune: '',
      distance: '',
      typeContrat: '',
      experience: '',
      salaireMin: '',
      dureeHebdoMin: '',
      dureeHebdoMax: '',
      alternance: false,
    })
    setRange('0-49')
    fetchOffres()
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "Aujourd'hui"
      if (diffDays === 1) return "Hier"
      if (diffDays < 7) return `Il y a ${diffDays} jours`
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`

      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  const getNextPageRange = () => {
    const [start, end] = range.split('-').map(Number)
    const newStart = end + 1
    const newEnd = Math.min(newStart + 49, 3149)
    return `${newStart}-${newEnd}`
  }

  const getPrevPageRange = () => {
    const [start, end] = range.split('-').map(Number)
    const newEnd = start - 1
    const newStart = Math.max(0, newEnd - 49)
    return `${newStart}-${newEnd}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recherche d'Emploi</h1>
          <p className="text-gray-600 mt-2">
            Retrouvez les opportunités de carrière France Travail
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Recherche par mots-clés */}
            <div>
              <Label htmlFor="motsCles">Mots-clés</Label>
              <Input
                id="motsCles"
                type="text"
                placeholder="ex: boulanger, comptable, développeur web"
                value={filters.motsCles}
                onChange={(e) => setFilters({ ...filters, motsCles: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez les mots-clés par des virgules
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Localisation */}
              <div>
                <Label htmlFor="departement">Département</Label>
                <Input
                  id="departement"
                  type="text"
                  placeholder="ex: 75, 92, 93"
                  value={filters.departement}
                  onChange={(e) => setFilters({ ...filters, departement: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="commune">Commune (code INSEE)</Label>
                <Input
                  id="commune"
                  type="text"
                  placeholder="ex: 75056"
                  value={filters.commune}
                  onChange={(e) => setFilters({ ...filters, commune: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="ex: 10"
                  value={filters.distance}
                  onChange={(e) => setFilters({ ...filters, distance: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Type de contrat */}
              <div>
                <Label htmlFor="typeContrat">Type de contrat</Label>
                <select
                  id="typeContrat"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.typeContrat}
                  onChange={(e) => setFilters({ ...filters, typeContrat: e.target.value })}
                >
                  <option value="">Tous les types</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="DDT">CDD Temporaire</option>
                </select>
              </div>

              {/* Expérience */}
              <div>
                <Label htmlFor="experience">Expérience</Label>
                <select
                  id="experience"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                >
                  <option value="">Tous niveaux</option>
                  <option value="1">Moins d'un an</option>
                  <option value="2">1 à 3 ans</option>
                  <option value="3">Plus de 3 ans</option>
                </select>
              </div>

              {/* Durée hebdomadaire */}
              <div>
                <Label htmlFor="dureeHebdoMin">Durée min (heure/semaine)</Label>
                <Input
                  id="dureeHebdoMin"
                  type="text"
                  placeholder="ex: 20"
                  value={filters.dureeHebdoMin}
                  onChange={(e) => setFilters({ ...filters, dureeHebdoMin: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dureeHebdoMax">Durée max (heure/semaine)</Label>
                <Input
                  id="dureeHebdoMax"
                  type="text"
                  placeholder="ex: 39"
                  value={filters.dureeHebdoMax}
                  onChange={(e) => setFilters({ ...filters, dureeHebdoMax: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Salaire minimum */}
              <div>
                <Label htmlFor="salaireMin">Salaire minimum (€)</Label>
                <Input
                  id="salaireMin"
                  type="number"
                  placeholder="ex: 1500"
                  value={filters.salaireMin}
                  onChange={(e) => setFilters({ ...filters, salaireMin: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="alternance"
                    checked={filters.alternance}
                    onChange={(e) => setFilters({ ...filters, alternance: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="alternance" className="text-sm">
                    Offres d'alternance uniquement
                  </Label>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalResults > 0 ? `${totalResults} offre${totalResults > 1 ? 's' : ''} trouvée${totalResults > 1 ? 's' : ''}` : 'Aucune offre trouvée'}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      )}

      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {!loading && !error && offres.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Aucune offre trouvée</p>
          <p className="text-sm text-gray-500 mt-2">
            Essayez d'élargir vos critères de recherche
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.isArray(offres) && offres.map((offre) => (
          <Card key={offre.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{offre.intitule}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {offre.description}
                  </CardDescription>
                </div>
                {offre.alternance && (
                  <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                    Alternance
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations clés */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{offre.entreprise?.nom || 'Entreprise non renseignée'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{offre.lieuTravail?.libelle || 'Lieu non renseigné'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{offre.typeContratLibelle}</span>
                  </div>
                  {offre.salaire && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{offre.salaire.libelle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Détails du poste */}
              <div className="border-t pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Durée</p>
                    <p className="font-medium">{offre.dureeTravailLibelle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expérience</p>
                    <p className="font-medium">{offre.experienceLibelle || 'Non précisé'}</p>
                  </div>
                </div>

                {offre.nombrePostes > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {offre.nombrePostes} poste{offre.nombrePostes > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{formatDate(offre.dateCreation)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {offre.romeLibelle}
                </Badge>
                {offre.dureeTravailLibelleConverti && (
                  <Badge variant="outline" className="text-xs">
                    {offre.dureeTravailLibelleConverti}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => window.open(offre.origineOffre.urlOrigine, '_blank')}
                >
                  Postuler sur France Travail
                </Button>
                {offre.entreprise?.url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(offre.entreprise.url, '_blank')}
                  >
                    Entreprise
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalResults > 50 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setRange(getPrevPageRange())}
            disabled={range === '0-49'}
            variant="outline"
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Offres {range.split('-')[0]} à {range.split('-')[1]}
          </span>
          <Button
            onClick={() => setRange(getNextPageRange())}
            disabled={parseInt(range.split('-')[1]) >= Math.min(totalResults, 3149)}
            variant="outline"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}