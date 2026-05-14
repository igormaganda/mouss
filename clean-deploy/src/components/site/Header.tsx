"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#concept", label: "Le Projet" },
  { href: "#activities", label: "Activités" },
  { href: "#magazine", label: "Magazine" },
  { href: "#community", label: "Communauté" },
  { href: "#pricing", label: "Inscriptions" },
  { href: "#faq", label: "Contact" },
];

interface HeaderProps {
  user?: {
    name: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-[#0B1F3A]/96 backdrop-blur-xl border-b border-white/7"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mr-auto flex-shrink-0">
            <Image
              src="/logo.png"
              alt="CS Ternes Paris Ouest"
              width={42}
              height={42}
              className="rounded-xl"
            />
            <div className="leading-tight">
              <div className="font-heading text-[1.1rem] text-white tracking-wider">
                CS Ternes Paris Ouest
              </div>
              <div className="text-[0.65rem] text-[#E8A020] tracking-wider uppercase font-semibold">
                Bientôt 100 ans d&apos;esprit du sport
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mr-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.83rem] font-medium text-white/72 hover:text-white hover:bg-white/8 px-3 py-2 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Connexion
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button className="bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A] font-bold text-sm px-5 py-2.5 rounded-full">
                    ✦ Préinscription
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden ml-4">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0B1F3A] border-l border-white/10 w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="CS Ternes Paris Ouest"
                      width={42}
                      height={42}
                      className="rounded-xl"
                    />
                    <div>
                      <div className="font-heading text-white">CS Ternes</div>
                      <div className="text-xs text-[#E8A020]">Bientôt 100 ans</div>
                    </div>
                  </div>
                </div>
                
                <nav className="flex-1 p-6">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base text-white/80 hover:text-white hover:bg-white/8 px-4 py-3 rounded-lg transition-all border-b border-white/5"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="p-6 border-t border-white/10 space-y-3">
                  {user ? (
                    <>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full border-white/20 text-white">
                            <Settings className="w-4 h-4 mr-2" />
                            Administration
                          </Button>
                        </Link>
                      )}
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-white/20 text-white">
                          <User className="w-4 h-4 mr-2" />
                          Mon Espace
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-white hover:bg-white/10"
                        onClick={onLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-white/20 text-white">
                          Connexion
                        </Button>
                      </Link>
                      <Link href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-[#E8A020] text-[#0B1F3A] hover:bg-[#F5BE5A] font-bold">
                          ✦ Préinscription
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
