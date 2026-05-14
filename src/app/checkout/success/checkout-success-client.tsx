'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, Home, ArrowLeft, Package } from 'lucide-react';

interface SessionData {
  id: string;
  amount_total: number;
  currency: string;
  status: string;
  customer_email: string | null;
  metadata: {
    packId?: string;
    packName?: string;
  };
  payment_status?: string;
}

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Session de paiement introuvable.');
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch(`/api/billing/session?session_id=${encodeURIComponent(sessionId!)}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Impossible de récupérer les détails du paiement.');
          return;
        }

        setSession(data);
      } catch {
        setError('Erreur de connexion. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Détails indisponibles</CardTitle>
            <CardDescription>{error || 'Aucune information de paiement trouvée.'}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <Button onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const isCompleted = session.status === 'complete' && session.payment_status !== 'unpaid';
  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: session.currency.toUpperCase(),
  }).format((session.amount_total || 0) / 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto">
            <CheckCircle className={`h-16 w-16 ${isCompleted ? 'text-green-500' : 'text-muted-foreground'}`} />
          </div>
          <CardTitle className="text-2xl">
            {isCompleted
              ? 'Paiement confirmé !'
              : session.amount_total === 0
                ? 'Inscription réussie !'
                : 'Paiement en cours de traitement'}
          </CardTitle>
          <CardDescription className="text-base">
            {isCompleted
              ? 'Merci pour votre confiance. Votre commande a été enregistrée.'
              : session.amount_total === 0
                ? 'Bienvenue ! Votre accès gratuit est maintenant actif.'
                : 'Votre paiement est en cours de vérification. Vous recevrez une confirmation par email.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Référence</span>
              <Badge variant="outline" className="font-mono text-xs">
                {session.id.slice(0, 20)}...
              </Badge>
            </div>
            {session.metadata?.packName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-semibold">{session.metadata.packName}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Montant</span>
              <span className="font-semibold text-lg">
                {session.amount_total === 0 ? 'Gratuit' : amountFormatted}
              </span>
            </div>
            {session.customer_email && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">{session.customer_email}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge
                variant={isCompleted ? 'default' : 'secondary'}
                className={
                  isCompleted
                    ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20'
                    : ''
                }
              >
                {isCompleted ? 'Complété' : 'En attente'}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" size="lg" onClick={() => router.push('/')}>
            <Home className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
