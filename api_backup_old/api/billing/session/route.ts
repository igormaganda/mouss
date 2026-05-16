import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id est requis' },
        { status: 400 }
      );
    }

    // Handle free pack sessions (prefixed with "free_")
    if (sessionId.startsWith('free_')) {
      const parts = sessionId.replace('free_', '').split('_');
      const packId = parts[0];
      const packNames: Record<string, string> = {
        decouverte: 'Découverte',
        entrepreneur: 'Entrepreneur',
        business: 'Business',
        premium: 'Premium',
      };
      return NextResponse.json({
        id: sessionId,
        amount_total: 0,
        currency: 'eur',
        status: 'complete',
        customer_email: null,
        metadata: {
          packId,
          packName: packNames[packId] || packId,
        },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      status: session.status,
      customer_email: session.customer_email,
      metadata: session.metadata,
      payment_status: session.payment_status,
    });
  } catch (error: unknown) {
    console.error('Stripe session retrieval error:', error);

    const message =
      error instanceof Error ? error.message : 'Erreur lors de la récupération de la session';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
