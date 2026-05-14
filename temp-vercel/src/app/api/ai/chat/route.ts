import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = '8c3e54b9923a4ce6baf8464e08f00842.DDb9ovEKOWhEJviE'
const ANTHROPIC_BASE_URL = 'https://api.z.ai/api/anthropic'
const MODEL = 'claude-opus-4-6-20250514'

const SYSTEM_PROMPT = `Tu es l'IA Co-Pilote de CréaPulse, un assistant intelligent intégré à une plateforme de diagnostic entrepreneurial. Tu aides les conseillers et les porteurs de projet dans leur parcours de création d'entreprise.

Tu dois :
- Analyser les profils entrepreneuriaux (RIASEC, compétences, Kiviat)
- Fournir des recommandations personnalisées et actionnables
- Identifier les forces et les axes d'amélioration
- Suggérer des formations et des ressources adaptées
- Répondre en français avec un ton professionnel et bienveillant
- Formatter tes réponses de manière claire avec des listes quand approprié`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    // Build system message with context
    let systemMessage = SYSTEM_PROMPT
    if (context) {
      systemMessage += `\n\nContexte utilisateur:\n- Nom: ${context.userName || 'Non renseigné'}\n- Rôle: ${context.userRole || 'Utilisateur'}`
      if (context.diagnosticData) {
        systemMessage += `\n\nDonnées de diagnostic:\n${JSON.stringify(context.diagnosticData, null, 2)}`
      }
    }

    // Call Anthropic API
    const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: systemMessage,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la communication avec l\'IA' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Extract text from response
    const text = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('') || 'Pas de réponse'

    return NextResponse.json({
      content: text,
      model: MODEL,
      usage: data.usage,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
