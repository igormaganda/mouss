import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  projet: [
    { label: "Notre mission", href: "#concept" },
    { label: "L'équipe", href: "#community" },
    { label: "L'association", href: "#" },
    { label: "Partenaires", href: "#" },
  ],
  activites: [
    { label: "Soutien scolaire", href: "#activities" },
    { label: "Mercredi multisports", href: "#activities" },
    { label: "Compétitions", href: "#gamification" },
    { label: "Stages vacances", href: "#planning" },
  ],
  ressources: [
    { label: "Magazine", href: "#magazine" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#faq" },
    { label: "Mentions légales", href: "/legal/mentions-legales" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0B1F3A] pt-16 pb-8 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
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
            <p className="text-[0.85rem] text-white/50 leading-relaxed mb-5 max-w-[260px]">
              La communauté sport & éducation pour les familles pratiquant l&apos;instruction en famille.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/7 border border-white/8 flex items-center justify-center text-white/60 hover:bg-[#E8A020]/20 hover:border-[#E8A020]/40 hover:text-[#E8A020] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/7 border border-white/8 flex items-center justify-center text-white/60 hover:bg-[#E8A020]/20 hover:border-[#E8A020]/40 hover:text-[#E8A020] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/7 border border-white/8 flex items-center justify-center text-white/60 hover:bg-[#E8A020]/20 hover:border-[#E8A020]/40 hover:text-[#E8A020] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/7 border border-white/8 flex items-center justify-center text-white/60 hover:bg-[#E8A020]/20 hover:border-[#E8A020]/40 hover:text-[#E8A020] transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-heading text-[0.95rem] tracking-wider text-white mb-5">
              Le Projet
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.projet.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.83rem] text-white/50 hover:text-[#E8A020] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-[0.95rem] tracking-wider text-white mb-5">
              Activités
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.activites.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.83rem] text-white/50 hover:text-[#E8A020] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-[0.95rem] tracking-wider text-white mb-5">
              Ressources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.ressources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.83rem] text-white/50 hover:text-[#E8A020] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-[#E8A020]" />
                <span>contact@csternes.fr</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-[#E8A020]" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-[#E8A020]" />
                <span>Paris Ouest, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/7 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[0.78rem] text-white/30">
            © {new Date().getFullYear()} CS Ternes Paris Ouest – Association loi 1901
          </p>
          <div className="flex gap-6">
            <Link href="/legal/mentions-legales" className="text-[0.78rem] text-white/30 hover:text-white/50 transition-colors">
              Mentions légales
            </Link>
            <Link href="/legal/politique-confidentialite" className="text-[0.78rem] text-white/30 hover:text-white/50 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/legal/cgv" className="text-[0.78rem] text-white/30 hover:text-white/50 transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
