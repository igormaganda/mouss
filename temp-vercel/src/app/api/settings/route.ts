import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: all settings
export async function GET() {
  try {
    const settings = await prisma.appSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.key] = s.value })
    return NextResponse.json({ settings: map })
  } catch (err) {
    console.error('GET settings error:', err)
    return NextResponse.json({ settings: {} })
  }
}

// POST: upsert a setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body
    if (!key) return NextResponse.json({ error: 'key requis' }, { status: 400 })

    const setting = await prisma.appSetting.upsert({
      where: { key },
      update: { value: value ?? '' },
      create: { key, value: value ?? '' },
    })
    return NextResponse.json({ setting })
  } catch (err) {
    console.error('POST settings error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
