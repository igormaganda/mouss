import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Abonnement | 100 Jours Pour Entreprendre",
  description: "Gérez votre abonnement, consultez vos factures et suivez vos paiements.",
};

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
