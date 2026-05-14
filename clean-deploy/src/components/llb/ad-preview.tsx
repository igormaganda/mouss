'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, MapPin, ExternalLink, Sparkles, Eye } from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface AdPreviewData {
  title: string
  description: string
  sector: string
  region: string
  cta: string
  destinationUrl?: string
  company?: string
  budget?: number
}

export interface AdPreviewProps {
  ad: AdPreviewData
  mode?: 'inline' | 'modal'
  wedgeName?: string
  newsletterDate?: string
}

// ============================================
// HELPERS
// ============================================

function formatDateFr(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getCompanyInitials(company?: string): string {
  if (!company) return '??'
  const parts = company.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return company.substring(0, 2).toUpperCase()
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdPreview({ ad, mode = 'inline', wedgeName, newsletterDate }: AdPreviewProps) {
  const displayDate = useMemo(() => formatDateFr(newsletterDate), [newsletterDate])
  const initials = useMemo(() => getCompanyInitials(ad.company), [ad.company])

  const hasContent = ad.title || ad.description

  // Empty state placeholder for inline mode
  if (!hasContent && mode === 'inline') {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
        <Eye className="mx-auto mb-2 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-400">Aperçu de l&apos;annonce</p>
        <p className="mt-1 text-xs text-gray-300">
          Remplissez les champs ci-dessus pour voir l&apos;aperçu en temps réel
        </p>
      </div>
    )
  }

  // ── Inline mode: compact card preview ──
  if (mode === 'inline') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Newsletter context header */}
        <div
          className="px-4 py-2.5 text-xs font-medium text-white flex items-center gap-2"
          style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
        >
          <span className="text-sm">📬</span>
          <span>La Lettre Business</span>
          {wedgeName && (
            <>
              <span className="opacity-50">·</span>
              <span className="font-normal opacity-90">{wedgeName}</span>
            </>
          )}
        </div>

        {/* Ad body */}
        <div className="p-5">
          {/* Partner label */}
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 border border-amber-200">
              <Sparkles className="h-3 w-3" />
              Annonce partenaire
            </span>
            <span className="text-[11px] text-gray-400">{displayDate}</span>
          </div>

          {/* Company logo placeholder + Title row */}
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold leading-snug text-gray-900">
                {ad.title || 'Titre de votre annonce'}
              </h4>
              {ad.company && (
                <p className="mt-0.5 text-xs text-gray-500">{ad.company}</p>
              )}
            </div>
          </div>

          {/* Badges */}
          {(ad.sector || ad.region) && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {ad.sector && (
                <Badge
                  variant="secondary"
                  className="rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-medium"
                >
                  {ad.sector}
                </Badge>
              )}
              {ad.region && (
                <Badge
                  variant="outline"
                  className="rounded-md text-[11px] font-medium text-gray-600"
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {ad.region}
                </Badge>
              )}
            </div>
          )}

          {/* Description */}
          {ad.description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
              {ad.description}
            </p>
          )}

          {/* CTA button */}
          {ad.cta && (
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                style={{ backgroundColor: 'oklch(0.65 0.2 45)' }}
              >
                {ad.cta}
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Modal mode: full realistic newsletter embed ──
  return (
    <div className="w-full">
      {/* Simulated email header */}
      <div className="mb-0 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">De :</span>
          <span>La Lettre Business &lt;contact@lalettrebusiness.fr&gt;</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Objet :</span>
          <span>
            📬 {wedgeName || 'Newsletter'} — {displayDate}
          </span>
        </div>
      </div>

      {/* Email body container */}
      <div className="rounded-b-lg border border-gray-200 bg-white">
        <div className="mx-auto max-w-[620px] p-0">
          {/* Newsletter top bar */}
          <div
            className="px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, oklch(0.63 0.17 250) 0%, oklch(0.53 0.18 260) 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📬</span>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    La Lettre Business
                  </h2>
                  {wedgeName && (
                    <p className="text-xs text-blue-100">{wedgeName}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-blue-200">{displayDate}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-200" />

          {/* Ad section */}
          <div className="px-6 py-5">
            {/* Partner label */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 border border-amber-200">
                <Sparkles className="h-3 w-3" />
                Annonce partenaire
              </span>
            </div>

            {/* Company + Title */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold leading-snug text-gray-900">
                  {ad.title || 'Titre de l\'annonce'}
                </h3>
                {ad.company && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <Building2 className="h-3.5 w-3.5" />
                    {ad.company}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {(ad.sector || ad.region) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {ad.sector && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                    {ad.sector}
                  </span>
                )}
                {ad.region && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                    <MapPin className="h-3 w-3" />
                    {ad.region}
                  </span>
                )}
                {ad.budget != null && ad.budget > 0 && (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                    {ad.budget}€
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {ad.description && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {ad.description}
              </p>
            )}

            {/* CTA button */}
            {ad.cta && (
              <div className="mt-5">
                <a
                  href={ad.destinationUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: 'oklch(0.65 0.2 45)' }}
                >
                  {ad.cta}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {/* Destination URL preview */}
            {ad.destinationUrl && (
              <p className="mt-2 text-[11px] text-gray-400 truncate">
                {ad.destinationUrl}
              </p>
            )}
          </div>

          {/* Separator before footer */}
          <div className="h-px bg-gray-100" />

          {/* Mini footer */}
          <div className="px-6 py-4 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Vous recevez cet email car vous êtes abonné(e) à{' '}
              <span className="font-medium">{wedgeName || 'La Lettre Business'}</span>.
              <br />
              <a href="#" className="text-blue-500 hover:underline">
                Se désabonner
              </a>
              {' · '}
              <a href="#" className="text-blue-500 hover:underline">
                Mentions légales
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
