import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

// GET: Return swipe game results for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const results = await db.swipeGameResult.findMany({
      where: { userId },
      orderBy: { swipedAt: 'asc' },
    })

    return NextResponse.json(results, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching swipe game results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swipe game results' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST: Save swipe game results (delete old ones first)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, skills } = body

    if (!userId || !skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'userId and skills array are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Delete old swipe game results for this user
    await db.swipeGameResult.deleteMany({
      where: { userId },
    })

    // Create new swipe game results
    await db.swipeGameResult.createMany({
      data: skills.map(
        (s: { skillId: string; skillName: string; kept: boolean }) => ({
          userId,
          skillId: s.skillId,
          skillName: s.skillName,
          kept: s.kept,
        })
      ),
    })

    // Fetch the created results to return them
    const savedResults = await db.swipeGameResult.findMany({
      where: { userId },
      orderBy: { swipedAt: 'asc' },
    })

    return NextResponse.json(savedResults, { headers: corsHeaders })
  } catch (error) {
    console.error('Error saving swipe game results:', error)
    return NextResponse.json(
      { error: 'Failed to save swipe game results' },
      { status: 500, headers: corsHeaders }
    )
  }
}
