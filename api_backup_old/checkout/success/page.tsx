import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { CheckoutSuccessContent } from './checkout-success-client';

// Force dynamic rendering for this page since it uses useSearchParams()
export const dynamic = 'force-dynamic';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
