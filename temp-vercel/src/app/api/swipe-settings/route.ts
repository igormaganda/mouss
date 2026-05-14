import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch all swipe game settings
export async function GET() {
  try {
    const keys = [
      'swipe_mode',
      'swipe_phase_1_count',
      'swipe_phase_2_count',
      'swipe_phase_3_count',
      'swipe_allow_undo',
      'swipe_allow_maybe',
    ]

    const settings = await db.appSetting.findMany({
      where: { key: { in: keys } },
    })

    const map: Record<string, string> = {
      swipe_mode: 'fixed_global',
      swipe_phase_1_count: '20',
      swipe_phase_2_count: '20',
      swipe_phase_3_count: '20',
      swipe_allow_undo: 'true',
      swipe_allow_maybe: 'true',
    }
    settings.forEach((s) => {
      map[s.key] = s.value
    })

    return NextResponse.json({ settings: map })
  } catch (err) {
    console.error('GET swipe-settings error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST: Save swipe game settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key et value requis' }, { status: 400 })
    }

    const setting = await db.appSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })

    return NextResponse.json({ setting })
  } catch (err) {
    console.error('POST swipe-settings error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
