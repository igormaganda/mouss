import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// Helper: generate invoice number FAC-YYYY-XXXX
function generateInvoiceNumber(year: number, index: number): string {
  const padded = String(index).padStart(4, '0')
  return `FAC-${year}-${padded}`
}

// Helper: compute due date (30 days from given date)
function computeDueDate(date: Date): Date {
  const due = new Date(date)
  due.setDate(due.getDate() + 30)
  return due
}

// Helper: build invoice object from a payment
function buildInvoice(payment: any, index: number) {
  const year = new Date(payment.paidAt || payment.createdAt).getFullYear()
  const invoiceNumber = generateInvoiceNumber(year, index)
  const subtotal = payment.amount / 1.2 // HT
  const tax = payment.amount - subtotal // TVA 20%

  return {
    id: payment.id,
    invoiceNumber,
    date: payment.paidAt || payment.createdAt,
    dueDate: computeDueDate(new Date(payment.paidAt || payment.createdAt)).toISOString(),
    description: payment.description || 'Paiement',
    items: [
      {
        description: payment.description || 'Bus Mailing',
        amount: Math.round(subtotal * 100) / 100,
      },
    ],
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: payment.amount,
    status: payment.status,
    method: payment.method || 'card',
    user: payment.user
      ? { firstName: payment.user.firstName, lastName: payment.user.lastName, company: payment.user.company }
      : null,
    ad: payment.ad ? { id: payment.ad.id, title: payment.ad.title } : null,
  }
}

// GET /api/invoices?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = req.nextUrl.searchParams.get('userId')
    const where: any = {}

    if (auth.role === 'CLIENT') {
      where.userId = auth.userId
    } else if (userId) {
      where.userId = userId
    }

    // Only show completed payments as invoices
    where.status = 'COMPLETED'

    const payments = await db.payment.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, company: true } },
        ad: { select: { id: true, title: true } },
      },
      orderBy: { paidAt: 'desc' },
    })

    // Generate sequential invoice numbers
    const invoices = payments.map((payment, index) => buildInvoice(payment, index + 1))

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/invoices - Generate an invoice from a payment
export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId requis' }, { status: 400 })
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: { select: { firstName: true, lastName: true, company: true } },
        ad: { select: { id: true, title: true } },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 })
    }

    // Client can only access their own invoices
    if (auth.role === 'CLIENT' && payment.userId !== auth.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Count existing invoices for this year to get next number
    const year = new Date(payment.paidAt || payment.createdAt).getFullYear()
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year + 1, 0, 1)

    const invoiceCount = await db.payment.count({
      where: {
        status: 'COMPLETED',
        paidAt: { gte: yearStart, lt: yearEnd },
        id: { lt: payment.id }, // Only count payments before this one
      },
    })

    const invoice = buildInvoice(payment, invoiceCount + 1)

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Generate invoice error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
