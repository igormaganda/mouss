import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook non configuré' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const packId = session.metadata?.packId || '';
      const packName = session.metadata?.packName || 'Inconnu';
      const amount = session.amount_total || 0;
      const currency = session.currency || 'eur';
      const email = session.customer_email || '';

      // Create Order record
      const order = await db.order.create({
        data: {
          stripeSession: session.id,
          email,
          packId,
          packName,
          amount,
          currency,
          status: 'completed',
        },
      });

      // Create Payment record
      await db.payment.create({
        data: {
          orderId: order.id,
          stripePaymentId: session.payment_intent as string,
          amount,
          currency,
          status: 'succeeded',
          metadata: JSON.stringify({
            sessionId: session.id,
            customerEmail: email,
            packId,
            packName,
          }),
        },
      });

      console.log(`✅ Order ${order.id} created for ${email} — ${packName} (${amount / 100} ${currency})`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Stripe webhook error:', error);

    if (error instanceof stripe.webhooks.StripeSignatureVerificationError) {
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du webhook' },
      { status: 500 }
    );
  }
}
