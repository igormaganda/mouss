import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// Helper: generate invoice number from payment
function generateInvoiceNumber(payment: any, index: number): string {
  const year = new Date(payment.paidAt || payment.createdAt).getFullYear()
  const padded = String(index).padStart(4, '0')
  return `FAC-${year}-${padded}`
}

// Helper: generate mock client secret
function generateClientSecret(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let secret = 'pi_mock_'
  for (let i = 0; i < 24; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  secret += '_secret_'
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

// ============================================
// GET /api/payments?userId=xxx
// Enhanced: returns payments with computed invoice numbers
// ============================================

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

    const payments = await db.payment.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, company: true } },
        ad: { select: { id: true, title: true, sector: true, region: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Add computed invoice numbers for completed payments
    const paymentsWithInvoices = await Promise.all(
      payments.map(async (payment, index) => {
        let invoiceNumber: string | undefined

        if (payment.status === 'COMPLETED') {
          const year = new Date(payment.paidAt || payment.createdAt).getFullYear()
          const yearStart = new Date(year, 0, 1)
          const yearEnd = new Date(year + 1, 0, 1)

          const count = await db.payment.count({
            where: {
              status: 'COMPLETED',
              paidAt: { gte: yearStart, lt: yearEnd },
              createdAt: { lte: payment.createdAt },
            },
          })

          invoiceNumber = generateInvoiceNumber(payment, count)
        }

        return {
          ...payment,
          invoiceNumber,
          type: payment.adId ? 'ad' : payment.description?.toLowerCase().includes('abonnement') ? 'subscription' : 'other',
        }
      })
    )

    return NextResponse.json(paymentsWithInvoices)
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ============================================
// POST /api/payments - Create payment (with type support)
// Enhanced: accepts { amount, description, adId, method, type }
// ============================================

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { amount, description, adId, method, type } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    // Validate type
    if (type && !['ad', 'subscription', 'boost'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide. Valeurs possibles : ad, subscription, boost' }, { status: 400 })
    }

    const paymentMethod = method || 'card'
    if (!['card', 'paypal', 'wire'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Méthode de paiement invalide. Valeurs possibles : card, paypal, wire' }, { status: 400 })
    }

    // Build description from type if not provided
    let paymentDescription = description
    if (!paymentDescription) {
      switch (type) {
        case 'ad':
          paymentDescription = 'Bus Mailing - Annonce'
          break
        case 'subscription':
          paymentDescription = 'Abonnement La Lettre Business'
          break
        case 'boost':
          paymentDescription = 'Boost de visibilité'
          break
        default:
          paymentDescription = 'Paiement'
      }
    }

    // Verify ad belongs to user if adId provided
    if (adId) {
      const ad = await db.ad.findUnique({ where: { id: adId } })
      if (!ad) {
        return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 })
      }
      if (auth.role === 'CLIENT' && ad.clientId !== auth.userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Create payment as PENDING
    const payment = await db.payment.create({
      data: {
        amount: parseFloat(amount.toString()),
        description: paymentDescription,
        adId: adId || null,
        userId: auth.userId,
        method: paymentMethod,
        status: 'PENDING',
      },
      include: {
        user: { select: { firstName: true, lastName: true, company: true } },
        ad: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ============================================
// POST /api/payments/checkout - Simulate Stripe checkout
// Handled via query parameter routing
// ============================================

// We handle /checkout via the same route file since Next.js App Router
// uses file-based routing. The checkout logic is triggered when the
// request has a specific header or we use a different approach.
// For simplicity, we check if the request has an X-Action header.

export async function PUT(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req)
    if (!auth) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const action = req.headers.get('x-action')

    // Handle checkout simulation
    if (action === 'checkout') {
      const { amount, description, adId, method, type } = await req.json()

      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
      }

      // Generate mock payment intent
      const clientSecret = generateClientSecret()
      const mockPaymentIntentId = `pi_mock_${Date.now()}`

      return NextResponse.json({
        clientSecret,
        paymentIntentId: mockPaymentIntentId,
        amount: parseFloat(amount.toString()),
        currency: 'eur',
        status: 'requires_payment_method',
        metadata: {
          description,
          adId: adId || null,
          type: type || 'ad',
          method: method || 'card',
        },
      })
    }

    // Handle payment confirmation
    if (action === 'confirm') {
      const { paymentId } = await req.json()

      if (!paymentId) {
        return NextResponse.json({ error: 'paymentId requis' }, { status: 400 })
      }

      const payment = await db.payment.findUnique({
        where: { id: paymentId },
      })

      if (!payment) {
        return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 })
      }

      if (auth.role === 'CLIENT' && payment.userId !== auth.userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }

      // Simulate: mark as completed
      const completedPayment = await db.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
          stripePaymentId: `pi_mock_confirmed_${Date.now()}`,
        },
        include: {
          user: { select: { firstName: true, lastName: true, company: true } },
          ad: { select: { id: true, title: true } },
        },
      })

      // Update ad status if linked
      if (payment.adId) {
        await db.ad.update({
          where: { id: payment.adId },
          data: { status: 'PAID' },
        })
      }

      return NextResponse.json({
        ...completedPayment,
        confirmed: true,
        message: 'Paiement confirmé avec succès',
      })
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
  } catch (error) {
    console.error('Payment action error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
