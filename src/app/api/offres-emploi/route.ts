import { NextRequest, NextResponse } from 'next/server'

const FT_CLIENT_ID = 'PAR_echoentreprendre_cb476288db252b420abf83b2c7ca3b5898773e84c1e6ef92a1db7ebcbb6093d4'
const FT_CLIENT_SECRET = '0c8974678bd23a7ecafe88adb2da50a410aa47f319abc1502ce16dffb28d8892'
const FT_TOKEN_URL = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire'
const FT_API_URL = 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search'

// Cache séparé pour les offres d'emploi
let accessTokenCacheOffres: { token: string; expiresAt: number } | null = null

async function getAccessTokenOffres(): Promise<string> {
  // Vérifier si le token en cache est encore valide
  if (accessTokenCacheOffres && Date.now() < accessTokenCacheOffres.expiresAt) {
    return accessTokenCacheOffres.token
  }

  // Récupérer un nouveau token spécifique pour les offres
  const response = await fetch(FT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: FT_CLIENT_ID,
      client_secret: FT_CLIENT_SECRET,
      scope: 'o2dsoffre api_offresdemploiv2',
    }),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du token d\'accès offres')
  }

  const data = await response.json()

  // Mettre en cache le token
  accessTokenCacheOffres = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return data.access_token
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '0-49'
    const motsCles = searchParams.get('motsCles') || ''
    const departement = searchParams.get('departement') || ''
    const commune = searchParams.get('commune') || ''
    const distance = searchParams.get('distance') || ''

    const accessToken = await getAccessTokenOffres()

    // Construire l'URL avec les paramètres
    const url = new URL(FT_API_URL)
    url.searchParams.set('range', range)

    if (motsCles) url.searchParams.set('motsCles', motsCles)
    if (departement) url.searchParams.set('departement', departement)
    if (commune) url.searchParams.set('commune', commune)
    if (distance) url.searchParams.set('distance', distance)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API France Travail Offres:', response.status, errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des offres' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors de la requête:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des offres' },
      { status: 500 }
    )
  }
}