import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch cards for a phase (public/user-facing)
// Query params: phase (1|2|3), userId (optional, for AI-adaptive selection), count (optional override)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phase = parseInt(searchParams.get('phase') || '1', 10)
    const userId = searchParams.get('userId') || null
    const countOverride = searchParams.get('count')
      ? parseInt(searchParams.get('count')!, 10)
      : null

    // 1. Fetch swipe settings to determine mode & card counts
    const settings = await db.appSetting.findMany({
      where: {
        key: {
          in: [
            'swipe_mode',
            'swipe_phase_1_count',
            'swipe_phase_2_count',
            'swipe_phase_3_count',
          ],
        },
      },
    })
    const settingsMap: Record<string, string> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    const mode = settingsMap['swipe_mode'] || 'fixed_global'
    const defaultCount = settingsMap[`swipe_phase_${phase}_count`]
      ? parseInt(settingsMap[`swipe_phase_${phase}_count`], 10)
      : 20

    const targetCount = countOverride || defaultCount

    // 2. Fetch all active cards for this phase
    const allCards = await db.swipeCard.findMany({
      where: { phase, isActive: true },
      orderBy: [{ isEssential: 'desc' }, { sortOrder: 'asc' }],
    })

    if (allCards.length === 0) {
      return NextResponse.json({ cards: [], phase, mode, totalCards: 0, selectedCount: 0 })
    }

    // 3. Select cards based on mode
    let selectedCards = allCards

    if (mode === 'ai_adaptive' && userId) {
      // AI-adaptive: try to load user's CV analysis profile
      const skillGap = await db.skillGapAnalysis.findFirst({
        where: { userId },
        orderBy: { analyzedAt: 'desc' },
      })

      const essential = allCards.filter((c) => c.isEssential)
      const optional = allCards.filter((c) => !c.isEssential)

      if (skillGap) {
        const acquired: string[] = Array.isArray(skillGap.acquiredSkills)
          ? skillGap.acquiredSkills.map((s: any) =>
              typeof s === 'string' ? s.toLowerCase() : (s?.name || '').toLowerCase()
            )
          : []
        const gaps: string[] = Array.isArray(skillGap.gapSkills)
          ? skillGap.gapSkills.map((s: any) =>
              typeof s === 'string' ? s.toLowerCase() : (s?.name || '').toLowerCase()
            )
          : []

        // Score each optional card by relevance to user profile
        const scored = optional.map((card) => {
          const cardTags = card.tags.map((t) => t.toLowerCase())
          let score = Math.random() * 0.3 // base randomness for variety

          // Boost cards matching gaps (missing skills)
          for (const gap of gaps) {
            if (cardTags.some((t) => t.includes(gap) || gap.includes(t))) {
              score += 2
            }
          }

          // Slight boost for cards matching acquired skills (affirmation)
          for (const skill of acquired) {
            if (cardTags.some((t) => t.includes(skill) || skill.includes(t))) {
              score += 0.5
            }
          }

          return { card, score }
        })

        scored.sort((a, b) => b.score - a.score)
        const pickedOptional = scored
          .slice(0, Math.max(0, targetCount - essential.length))
          .map((s) => s.card)

        selectedCards = [...essential, ...pickedOptional].slice(0, targetCount)
      } else {
        // No CV analysis yet: fallback to mixed selection
        const shuffled = [...optional].sort(() => Math.random() - 0.5)
        selectedCards = [...essential, ...shuffled].slice(0, targetCount)
      }
    } else if (mode === 'per_phase') {
      // per_phase: use specific count per phase, prioritize essential, fill with random
      const essential = allCards.filter((c) => c.isEssential)
      const optional = allCards.filter((c) => !c.isEssential)
      const shuffled = [...optional].sort(() => Math.random() - 0.5)
      selectedCards = [...essential, ...shuffled].slice(0, targetCount)
    }
    // fixed_global: use targetCount, same logic as per_phase (essential first + random)

    // Ensure we don't exceed available cards
    selectedCards = selectedCards.slice(0, Math.min(targetCount, allCards.length))

    // Shuffle final selection for variety (but keep essential first batch)
    const essential = selectedCards.filter((c) => c.isEssential)
    const nonEssential = selectedCards.filter((c) => !c.isEssential).sort(() => Math.random() - 0.5)
    const finalOrder =
      phase === 1
        ? [...nonEssential, ...essential] // discover first, core skills at end
        : [...essential, ...nonEssential] // core interests/professions first

    return NextResponse.json({
      cards: finalOrder,
      phase,
      mode,
      totalAvailable: allCards.length,
      selectedCount: finalOrder.length,
    })
  } catch (err) {
    console.error('GET swipe-cards error:', err)
    return NextResponse.json({ cards: [], error: 'Erreur interne' }, { status: 500 })
  }
}
