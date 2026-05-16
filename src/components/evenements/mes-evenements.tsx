'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Building2, Search, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface Evenement {
  id: number
  titre: string
  description: string
  dateEvenement: string
  heureDebut: string
  heureFin: string
  ville: string
  codePostal: string
  type: string
  modalites: string[]
  objectifs: string[]
  publics: string[]
  benefices: string[]
  urlDetailEvenement: string
  libelleOrganisateurPrincipal: string
}

interface EvenementsResponse {
  totalElements: number
  content: Evenement[]
}

export function MesEvenements() {
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Filtres
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    codePostal: '',
    typeEvenement: '',
    modalite: '',
  })

  const fetchEvenements = async () => {
    setLoading(true)
    setError(null)

    try {
      const requestBody: any = {
        page,
        size: 20,
        objectifs: [33, 34], // Aides à l'emploi, Création d'entreprise
      }

      if (filters.dateDebut) requestBody.dateDebut = filters.dateDebut
      if (filters.dateFin) requestBody.dateFin = filters.dateFin
      if (filters.codePostal) requestBody.codePostal = [filters.codePostal]
      if (filters.typeEvenement) requestBody.typeEvenement = parseInt(filters.typeEvenement)
      if (filters.modalite) requestBody.modalite = filters.modalite

      const response = await fetch('/api/evenements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des événements')
      }

      const data: EvenementsResponse = await response.json()

      // Vérifier que content est bien un tableau
      if (Array.isArray(data.content)) {
        setEvenements(data.content)
      } else {
        setEvenements([])
      }

      setTotalElements(data.totalElements || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setEvenements([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvenements()
  }, [page])

  const handleSearch = () => {
    setPage(0)
    fetchEvenements()
  }

  const handleReset = () => {
    setFilters({
      dateDebut: '',
      dateFin: '',
      codePostal: '',
      typeEvenement: '',
      modalite: '',
    })
    setPage(0)
    fetchEvenements()
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':')
      return `${hours}:${minutes}`
    } catch {
      return timeString
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Événements</h1>
          <p className="text-gray-600 mt-2">
            Retrouvez les événements France Travail près de chez vous
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={filters.dateDebut}
                onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={filters.dateFin}
                onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                type="text"
                placeholder="75001"
                value={filters.codePostal}
                onChange={(e) => setFilters({ ...filters, codePostal: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="typeEvenement">Type d'événement</Label>
              <select
                id="typeEvenement"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.typeEvenement}
                onChange={(e) => setFilters({ ...filters, typeEvenement: e.target.value })}
              >
                <option value="">Tous les types</option>
                <option value="13">Réunion d'information</option>
                <option value="14">Forum</option>
                <option value="15">Conférence</option>
                <option value="16">Atelier</option>
                <option value="17">Salon en ligne</option>
                <option value="18">Job Dating</option>
              </select>
            </div>

            <div>
              <Label htmlFor="modalite">Modalité</Label>
              <select
                id="modalite"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.modalite}
                onChange={(e) => setFilters({ ...filters, modalite: e.target.value })}
              >
                <option value="">Toutes les modalités</option>
                <option value="ADIST">À distance</option>
                <option value="ENPHY">En présentiel</option>
              </select>
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
        </Card>
      )}

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalElements} événement{totalElements > 1 ? 's' : ''} trouvé{totalElements > 1 ? 's' : ''}
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

      {!loading && !error && evenements.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Aucun événement trouvé</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(evenements) && evenements.map((evenement) => (
          <Card key={evenement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{evenement.titre}</CardTitle>
                <Badge variant="secondary">{evenement.type}</Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {evenement.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{formatDate(evenement.dateEvenement)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span>
                  {formatTime(evenement.heureDebut)} - {formatTime(evenement.heureFin)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>
                  {evenement.codePostal} {evenement.ville}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs">{evenement.libelleOrganisateurPrincipal}</span>
              </div>

              {evenement.modalites && evenement.modalites.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {evenement.modalites.map((modalite, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {modalite}
                    </Badge>
                  ))}
                </div>
              )}

              {evenement.objectifs && evenement.objectifs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {evenement.objectifs.slice(0, 2).map((objectif, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {objectif}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                className="w-full mt-4"
                onClick={() => window.open(evenement.urlDetailEvenement, '_blank')}
              >
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalElements > 20 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            variant="outline"
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {page + 1} sur {Math.ceil(totalElements / 20)}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * 20 >= totalElements}
            variant="outline"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}