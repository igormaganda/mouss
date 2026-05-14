import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/auth-middleware'

// GET — fetch latest financial forecast for the authenticated user.
// Returns the stored payload flat so the frontend reads data.revenue, data.expenses, etc.
export async function GET(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  try {
    const forecasts = await db.financialForecast.findMany({
      where: { userId: payload!.userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })

    if (forecasts.length === 0) {
      return NextResponse.json({ revenue: null, expenses: null, growthRate: null, inflationRate: null, projection: null })
    }

    const record = forecasts[0]

    // The full payload lives in the `data` JSON column.
    // Spread it first so frontend gets back exactly what it saved.
    const stored = (record.data as Record<string, unknown>) ?? {}

    return NextResponse.json({
      revenue: stored.revenue ?? record.revenue,
      expenses: stored.expenses ?? record.expenses,
      growthRate: stored.growthRate ?? null,
      inflationRate: stored.inflationRate ?? null,
      projection: stored.projection ?? null,
    })
  } catch (err) {
    console.error('Get financial forecast error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// POST — upsert financial forecast data.
// Frontend sends: { userId?, revenue, expenses, growthRate, inflationRate, projection }
// revenue/expenses may be numbers (financial-forecast.tsx) or objects (bp-financials.tsx).
// We store the raw payload in `data` (JSON) and extract scalar totals for the
// structured columns (month/year are derived from `now()` for simple upsert key).
export async function POST(request: NextRequest) {
  const { authenticated, payload, error } = authenticateRequest(request)
  if (!authenticated) return error!

  try {
    const body = await request.json()
    const { revenue, expenses, growthRate, inflationRate, projection } = body

    if (revenue === undefined || expenses === undefined) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const now = new Date()
    const month = now.getMonth() + 1 // 1-12
    const year = now.getFullYear()

    // Derive scalar totals for the structured columns.
    // Revenue may be a number or an object with a `monthlyCA` field.
    const totalRevenue = typeof revenue === 'number'
      ? revenue
      : (typeof revenue === 'object' && revenue !== null && 'monthlyCA' in revenue)
        ? Number((revenue as { monthlyCA: number }).monthlyCA) || 0
        : 0

    // Expenses may be a number or an object whose values should be summed.
    let totalExpenses = 0
    if (typeof expenses === 'number') {
      totalExpenses = expenses
    } else if (typeof expenses === 'object' && expenses !== null) {
      totalExpenses = Object.values(expenses as Record<string, number>)
        .reduce((sum: number, v) => sum + (Number(v) || 0), 0)
    }

    const netResult = totalRevenue - totalExpenses
    const margin = totalRevenue > 0 ? (netResult / totalRevenue) * 100 : 0

    // Extract individual expense fields from object if available.
    const expenseObj = (typeof expenses === 'object' && expenses !== null)
      ? expenses as Record<string, number>
      : {}

    const forecast = await db.financialForecast.upsert({
      where: { userId_month_year: { userId: payload!.userId, month, year } },
      update: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        salary: Number(expenseObj.salaires) || 0,
        rent: Number(expenseObj.loyers) || 0,
        marketing: Number(expenseObj.marketing) || 0,
        supplies: Number(expenseObj.fournitures) || 0,
        insurance: Number(expenseObj.assurances) || 0,
        otherCharges: Number(expenseObj.autres) || 0,
        netResult,
        margin: +margin.toFixed(2),
        data: { revenue, expenses, growthRate, inflationRate, projection },
      },
      create: {
        userId: payload!.userId,
        month,
        year,
        revenue: totalRevenue,
        expenses: totalExpenses,
        salary: Number(expenseObj.salaires) || 0,
        rent: Number(expenseObj.loyers) || 0,
        marketing: Number(expenseObj.marketing) || 0,
        supplies: Number(expenseObj.fournitures) || 0,
        insurance: Number(expenseObj.assurances) || 0,
        otherCharges: Number(expenseObj.autres) || 0,
        netResult,
        margin: +margin.toFixed(2),
        data: { revenue, expenses, growthRate, inflationRate, projection },
      },
    })

    return NextResponse.json({
      revenue,
      expenses,
      growthRate,
      inflationRate,
      projection,
      forecastId: forecast.id,
    }, { status: 201 })
  } catch (err) {
    console.error('Save financial forecast error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
