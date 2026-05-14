import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPackById, generatePayPalCheckoutUrl, type PaymentMethod } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packId, email, paymentMethod = 'stripe' } = body as {
      packId: string;
      email: string;
      paymentMethod?: PaymentMethod;
    };

    if (!packId || !email) {
      return NextResponse.json(
        { error: 'packId et email sont requis' },
        { status: 400 }
      );
    }

    const pack = getPackById(packId);
    if (!pack) {
      return NextResponse.json(
        { error: 'Pack introuvable' },
        { status: 404 }
      );
    }

    // Validate payment method is supported by this pack
    if (!pack.paymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: `Méthode de paiement ${paymentMethod} non supportée pour ce pack` },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Free pack — no checkout needed
    if (pack.price === 0) {
      const successUrl = `${origin}/checkout/success?session_id=free_${pack.id}_${Date.now()}`;
      return NextResponse.json({ url: successUrl, paymentMethod });
    }

    // PayPal checkout
    if (paymentMethod === 'paypal') {
      const paypalUrl = generatePayPalCheckoutUrl(pack.id, pack.name, pack.price, email);
      return NextResponse.json({ url: paypalUrl, paymentMethod });
    }

    // Stripe checkout (default)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: pack.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tarifs`,
      customer_email: email,
      metadata: {
        packId: pack.id,
        packName: pack.name,
        paymentMethod: 'stripe',
      },
    });

    return NextResponse.json({ url: session.url, paymentMethod });
  } catch (error: unknown) {
    console.error('Checkout error:', error);

    const message =
      error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
