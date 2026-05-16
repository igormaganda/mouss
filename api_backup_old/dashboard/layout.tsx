"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Rocket, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Force dynamic rendering for this layout since it uses useSession()
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || 'loading';

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
        {/* Mobile menu toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden mr-3">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="p-4 text-sm text-muted-foreground">
              Utilisez la navigation dans le tableau de bord
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Rocket className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm">Tableau de bord</span>
        </div>

        <div className="flex-1" />

        {/* Right side: user info + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-900/30 dark:text-emerald-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{user?.name}</span>
              <span className="text-xs text-muted-foreground leading-tight">{user?.email}</span>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
