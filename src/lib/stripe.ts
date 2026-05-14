import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export type PaymentMethod = 'stripe' | 'paypal';

// Pack definitions matching the 4 pricing tiers
export const PACKS = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: 0,
    priceId: process.env.STRIPE_PRICE_DECOUVERTE || 'price_decouverte',
    paymentMethods: ['stripe', 'paypal'] as PaymentMethod[],
    features: ['Audit gratuit', '3 guides', 'Newsletter', 'Communauté'],
    popular: false,
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    price: 19,
    priceId: process.env.STRIPE_PRICE_ENTREPRENEUR || 'price_entrepreneur',
    paymentMethods: ['stripe', 'paypal'] as PaymentMethod[],
    features: ['Guides illimités', 'Outils comparatifs', 'Support email', 'Templates business plan'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 39,
    priceId: process.env.STRIPE_PRICE_BUSINESS || 'price_business',
    paymentMethods: ['stripe', 'paypal'] as PaymentMethod[],
    features: ['Mentorship mensuel', 'Documents IA', 'CRM intégré', 'Support prioritaire'],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    priceId: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
    paymentMethods: ['stripe', 'paypal'] as PaymentMethod[],
    features: ['Consultant dédié', 'Audit approfondi', 'Formation complète', 'API accès'],
    popular: true,
  },
] as const;

export type PackId = (typeof PACKS)[number]['id'];

export function getPackById(id: string) {
  return PACKS.find((p) => p.id === id);
}

/**
 * Generate a mock PayPal checkout URL.
 * Replace with real PayPal API integration when credentials are available.
 */
export function generatePayPalCheckoutUrl(
  packId: string,
  packName: string,
  amount: number,
  email: string
): string {
  const params = new URLSearchParams({
    packId,
    packName,
    amount: (amount * 100).toString(),
    email,
    currency: 'EUR',
    paymentMethod: 'paypal',
    t: Date.now().toString(),
  });
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/billing/paypal/callback?${params.toString()}`;
}
