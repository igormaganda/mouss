import { NextRequest, NextResponse } from 'next/server'

const FT_CLIENT_ID = 'PAR_echoentreprendre_cb476288db252b420abf83b2c7ca3b5898773e84c1e6ef92a1db7ebcbb6093d4'
const FT_CLIENT_SECRET = '0c8974678bd23a7ecafe88adb2da50a410aa47f319abc1502ce16dffb28d8892'
const FT_TOKEN_URL = 'https://authentification-partenaire.francetravail.io/connexion/oauth2/access_token?realm=/partenaire'
const FT_API_URL = 'https://api.francetravail.io/partenaire/evenements/v1/mee/evenements'

// Cache pour le token d'accès (expirera après 3600s)
let accessTokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Vérifier si le token en cache est encore valide
  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.token
  }

  // Récupérer un nouveau token
  const response = await fetch(FT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: FT_CLIENT_ID,
      client_secret: FT_CLIENT_SECRET,
      scope: 'api_evenementsv1 evenements',
    }),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du token d\'accès')
  }

  const data = await response.json()

  // Mettre en cache le token (expire 60 secondes avant la fin réelle pour sécurité)
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Récupérer le token d'accès
    const accessToken = await getAccessToken()

    // Construire l'URL avec les paramètres de query
    const url = new URL(FT_API_URL)

    if (body.page) url.searchParams.set('page', body.page.toString())
    if (body.size) url.searchParams.set('size', body.size.toString())
    if (body.sort) url.searchParams.set('sort', body.sort)

    // Préparer le corps de la requête
    const requestBody: Record<string, any> = {}

    // Date de début et de fin
    if (body.dateDebut) requestBody.dateDebut = body.dateDebut
    if (body.dateFin) requestBody.dateFin = body.dateFin

    // Objectifs (33 - Aides à l'emploi, 34 - Création d'entreprise)
    if (body.objectifs && body.objectifs.length > 0) {
      requestBody.objectifs = body.objectifs
    }

    // Public cible
    if (body.publicCible && body.publicCible.length > 0) {
      requestBody.publicCible = body.publicCible
    }

    // Bénéfices participation
    if (body.beneficeParticipations && body.beneficeParticipations.length > 0) {
      requestBody.beneficeParticipations = body.beneficeParticipations
    }

    // Départements
    if (body.departements && body.departements.length > 0) {
      requestBody.departements = body.departements
    }

    // Code postal
    if (body.codePostal && body.codePostal.length > 0) {
      requestBody.codePostal = body.codePostal
    }

    // Modalité
    if (body.modalite) {
      requestBody.modalite = body.modalite
    }

    // Secteur d'activité
    if (body.secteurActivite) {
      requestBody.secteurActivite = body.secteurActivite
    }

    // Type d'événement
    if (body.typeEvenement) {
      requestBody.typeEvenement = body.typeEvenement
    }

    // Recherche géographique
    if (body.latitude && body.longitude) {
      requestBody.latitude = body.latitude
      requestBody.longitude = body.longitude
      requestBody.rayon = body.rayon || 10
    }

    // Appel à l'API France Travail
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API France Travail:', response.status, errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des événements' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors de la requête:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}

// GET pour récupérer les événements sans filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'

    const accessToken = await getAccessToken()

    const url = new URL(FT_API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('size', size)

    // Par défaut, filtrer sur les objectifs 33 et 34
    const requestBody = {
      objectifs: [33, 34], // Aides à l'emploi, Création d'entreprise
      dateDebut: new Date().toISOString().split('T')[0], // À partir d'aujourd'hui
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des événements' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors de la requête:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}