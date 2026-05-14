import { PrismaClient } from '@prisma/client'

const POSTGRESQL_URL = "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours?sslmode=prefer"

const db = new PrismaClient({
  datasourceUrl: POSTGRESQL_URL,
})

// ─── Helpers ──────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start: Date, end: Date): Date {
  const diff = end.getTime() - start.getTime()
  return new Date(start.getTime() + Math.random() * diff)
}

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function monthsAgo(months: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding billing data...\n')

  // Fetch existing data
  const packs = await db.pack.findMany({ orderBy: { order: 'asc' } })
  const users = await db.user.findMany()
  const leads = await db.lead.findMany({ take: 10 })

  console.log(`  📦 Found ${packs.length} packs: ${packs.map(p => `${p.name} (${p.price}€)`).join(', ')}`)
  console.log(`  👤 Found ${users.length} users`)
  console.log(`  🧑‍💼 Found ${leads.length} leads\n`)

  if (packs.length === 0) {
    console.error('❌ No packs found. Run seed-packs.ts first.')
    process.exit(1)
  }

  // Clean existing billing data
  const delPayments = await db.payment.deleteMany()
  const delInvoices = await db.invoice.deleteMany()
  const delOrders = await db.order.deleteMany()
  const delSubscriptions = await db.subscription.deleteMany()
  console.log(`  🗑️  Cleaned: ${delSubscriptions.count} subscriptions, ${delOrders.count} orders, ${delPayments.count} payments, ${delInvoices.count} invoices\n`)

  // ─── SUBSCRIPTIONS (15) ────────────────────────────────

  const subscriptionConfigs = [
    // 10 active
    ...Array(10).fill(null).map((_, i) => ({
      status: 'active' as const,
      packIndex: i < 3 ? 3 : i < 6 ? 2 : i < 8 ? 1 : 0, // Pack IA: 3, Pro: 3, Starter: 2, Découverte: 2
      paymentMethod: i < 7 ? 'card' as const : i < 9 ? 'paypal' as const : 'wallet' as const,
    })),
    // 2 paused
    ...Array(2).fill(null).map(() => ({
      status: 'paused' as const,
      packIndex: randomBetween(1, 3),
      paymentMethod: 'card' as const,
    })),
    // 2 cancelled
    ...Array(2).fill(null).map(() => ({
      status: 'cancelled' as const,
      packIndex: randomBetween(1, 2),
      paymentMethod: 'card' as const,
    })),
    // 1 expired
    {
      status: 'expired' as const,
      packIndex: 1,
      paymentMethod: 'paypal' as const,
    },
  ]

  const cardBrands = ['visa', 'mastercard', 'visa', 'visa', 'mastercard']
  const last4Digits = ['4242', '8888', '1234', '5555', '9876']

  const subscriptions: Array<{
    id: string
    userId: string | null
    leadId: string | null
    packId: string
    status: string
    paymentMethod: string
    providerCustomerId: string
    providerSubscriptionId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    cancelledAt: Date | null
    trialEnd: Date | null
    lastBillingDate: Date | null
    nextBillingDate: Date | null
  }> = []

  const BATCH_SIZE = 5

  console.log('  📋 Creating 15 subscriptions...')
  for (let i = 0; i < subscriptionConfigs.length; i++) {
    const config = subscriptionConfigs[i]
    const pack = packs[config.packIndex]

    // Alternate between users and leads
    const isUser = i < users.length && i % 2 === 0
    const userId = isUser ? users[i % users.length].id : null
    const leadId = !isUser && leads.length > 0 ? leads[i % leads.length].id : null

    const periodStart = monthsAgo(randomBetween(1, 3))
    const periodEnd = new Date(periodStart)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const nextBilling = new Date(periodEnd)
    nextBilling.setDate(nextBilling.getDate() - 1)

    const cancelledAt = config.status === 'cancelled' || config.status === 'expired'
      ? new Date(periodStart.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000)
      : null

    subscriptions.push({
      id: crypto.randomUUID(),
      userId,
      leadId,
      packId: pack.id,
      status: config.status,
      paymentMethod: config.paymentMethod,
      providerCustomerId: `cus_${crypto.randomUUID().slice(0, 12)}`,
      providerSubscriptionId: `sub_${crypto.randomUUID().slice(0, 12)}`,
      currentPeriodStart: periodStart,
      currentPeriodEnd: config.status === 'expired' ? periodStart : periodEnd,
      cancelAtPeriodEnd: config.status === 'cancelled',
      cancelledAt,
      trialEnd: i < 2 ? new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000) : null,
      lastBillingDate: periodStart,
      nextBillingDate: config.status === 'active' ? nextBilling : null,
    })

    // Batch create every BATCH_SIZE
    if ((i + 1) % BATCH_SIZE === 0 || i === subscriptionConfigs.length - 1) {
      const batch = subscriptions.slice(i - (i % BATCH_SIZE), i + 1)
      await Promise.all(
        batch.map(s => db.subscription.create({ data: s }))
      )
    }
  }
  console.log(`  ✅ 15 subscriptions created\n`)

  // ─── ORDERS (25) ───────────────────────────────────────

  const orderStatuses = [
    ...Array(20).fill('completed' as const),
    ...Array(3).fill('pending' as const),
    'failed' as const,
    'refunded' as const,
  ]

  console.log('  🛒 Creating 25 orders...')
  const orders: Array<{
    id: string
    orderNumber: string
    subscriptionId: string | null
    userId: string | null
    leadId: string | null
    packId: string
    amount: number
    tax: number
    total: number
    currency: string
    status: string
    paymentMethod: string
    provider: string
    providerCheckoutId: string
    providerPaymentId: string
    completedAt: Date | null
    createdAt: Date
  }> = []

  for (let i = 0; i < 25; i++) {
    const status = orderStatuses[i]
    const packIndex = i < 8 ? 3 : i < 15 ? 2 : i < 20 ? 1 : 0
    const pack = packs[packIndex]
    const amount = pack.price
    const tax = amount * 0.2 // 20% TVA
    const total = amount + tax

    const isUser = i < users.length && i % 3 === 0
    const userId = isUser ? users[i % users.length].id : null
    const leadId = !isUser && leads.length > 0 ? leads[i % leads.length].id : null

    // Link some orders to existing subscriptions
    const linkedSubscription = subscriptions[i % subscriptions.length]
    const subscriptionId = i < 20 ? linkedSubscription.id : null

    const createdAt = randomDate(monthsAgo(3), new Date())

    orders.push({
      id: crypto.randomUUID(),
      orderNumber: `CMD-2024-${String(i + 1).padStart(3, '0')}`,
      subscriptionId,
      userId,
      leadId,
      packId: pack.id,
      amount,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: 'eur',
      status,
      paymentMethod: i < 18 ? 'card' : i < 22 ? 'paypal' : 'wallet',
      provider: i < 18 ? 'stripe' : 'paypal',
      providerCheckoutId: `cs_${crypto.randomUUID().slice(0, 14)}`,
      providerPaymentId: `pi_${crypto.randomUUID().slice(0, 14)}`,
      completedAt: status === 'completed' ? createdAt : null,
      createdAt,
    })
  }

  // Create orders in batches
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(o => db.order.create({ data: o }))
    )
  }
  console.log(`  ✅ 25 orders created\n`)

  // ─── PAYMENTS (25) ─────────────────────────────────────

  console.log('  💳 Creating 25 payments...')
  const payments: Array<{
    id: string
    orderId: string
    amount: number
    currency: string
    status: string
    provider: string
    paymentMethod: string
    providerPaymentId: string
    last4: string | null
    brand: string | null
    walletType: string | null
    createdAt: Date
  }> = []

  for (let i = 0; i < 25; i++) {
    const order = orders[i]
    const paymentStatus = order.status === 'completed' ? 'succeeded'
      : order.status === 'failed' ? 'failed'
      : order.status === 'refunded' ? 'refunded'
      : 'pending'

    const isCard = order.paymentMethod === 'card'
    const isWallet = order.paymentMethod === 'wallet'

    payments.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      amount: order.total,
      currency: order.currency,
      status: paymentStatus,
      provider: order.provider,
      paymentMethod: order.paymentMethod,
      providerPaymentId: `pay_${crypto.randomUUID().slice(0, 14)}`,
      last4: isCard ? last4Digits[i % last4Digits.length] : null,
      brand: isCard ? cardBrands[i % cardBrands.length] : null,
      walletType: isWallet ? (i % 2 === 0 ? 'apple_pay' : 'google_pay') : null,
      createdAt: order.createdAt,
    })
  }

  for (let i = 0; i < payments.length; i += BATCH_SIZE) {
    const batch = payments.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(p => db.payment.create({ data: p }))
    )
  }
  console.log(`  ✅ 25 payments created\n`)

  // ─── INVOICES (20) ─────────────────────────────────────

  console.log('  🧾 Creating 20 invoices...')
  const invoiceStatuses = [
    ...Array(15).fill('paid' as const),
    ...Array(3).fill('pending' as const),
    ...Array(2).fill('overdue' as const),
  ]

  for (let i = 0; i < 20; i++) {
    const status = invoiceStatuses[i]
    const packIndex = i < 6 ? 3 : i < 12 ? 2 : i < 16 ? 1 : 0
    const pack = packs[packIndex]
    const amount = pack.price
    const tax = Math.round(amount * 0.2 * 100) / 100
    const total = Math.round((amount + tax) * 100) / 100

    const isUser = i < users.length && i % 2 === 0
    const userId = isUser ? users[i % users.length].id : null

    const linkedSubscription = subscriptions[i % subscriptions.length]

    const createdAt = randomDate(monthsAgo(3), new Date())
    const dueDate = new Date(createdAt)
    dueDate.setDate(dueDate.getDate() + 30)

    const paidAt = status === 'paid' ? new Date(createdAt.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : null

    await db.invoice.create({
      data: {
        id: crypto.randomUUID(),
        invoiceNumber: `FAC-2024-${String(i + 1).padStart(3, '0')}`,
        subscriptionId: linkedSubscription.id,
        userId,
        orderId: i < orders.length ? orders[i].id : null,
        amount,
        tax,
        total,
        currency: 'eur',
        status,
        dueDate,
        paidAt,
        stripeInvoiceId: `in_${crypto.randomUUID().slice(0, 14)}`,
        createdAt,
      },
    })
  }
  console.log(`  ✅ 20 invoices created\n`)

  // ─── SUMMARY ───────────────────────────────────────────

  console.log('═══════════════════════════════════════════')
  console.log('✅ Billing seed completed!')
  console.log('═══════════════════════════════════════════')
  console.log(`  Subscriptions : 15 (active: 10, paused: 2, cancelled: 2, expired: 1)`)
  console.log(`  Orders        : 25 (completed: 20, pending: 3, failed: 1, refunded: 1)`)
  console.log(`  Payments      : 25`)
  console.log(`  Invoices      : 20 (paid: 15, pending: 3, overdue: 2)`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
