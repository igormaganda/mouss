'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row: Logos + contact */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            {/* France Travail text logo (simple text representation) */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#1e3a5f] flex items-center justify-center">
                <span className="text-white text-xs font-bold">RF</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-[#1e3a5f]">RÉPUBLIQUE</span>
                <span className="text-xs font-semibold text-[#1e3a5f]">FRANÇAISE</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            {/* Gidef Logo */}
            <Image
              src="/logo-gidef.svg"
              alt="Gidef"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="w-px h-8 bg-gray-300" />
            {/* Echo Entreprise branding */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Echo Entreprise
              </span>
            </div>
          </div>

          {/* Accessibility contact */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:accessibilite@bge-bretagne.com" className="hover:text-emerald-600 transition-colors">
              accessibilite@bge-bretagne.com
            </a>
          </div>
        </div>

        {/* Bottom row: legal links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Echo Entreprise — Partenariat Gidef / BGE Bretagne / France Travail
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Conformité WCAG 2.1 Level AA</span>
            <span>•</span>
            <span>Diagnostic Expert</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
