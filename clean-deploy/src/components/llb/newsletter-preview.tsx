'use client'

import { useMemo } from 'react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Mail,
  Calendar,
  Users,
  Sparkles,
  MessageSquare,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  BookOpen,
  TrendingUp,
  ArrowRight,
  PenTool,
} from 'lucide-react'
import { AdPreview, type AdPreviewData } from '@/components/llb/ad-preview'

// ============================================
// TYPES
// ============================================

export interface NewsletterPreviewProps {
  newsletter: {
    subject: string
    editorialContent?: string
    aiArticle1?: string
    aiArticle2?: string
    questionOfMonth?: string
    ads: Array<{
      title: string
      description: string
      sector: string
      region: string
      cta: string
      company?: string
    }>
    recipientCount?: number
    sentAt?: string
    scheduledAt?: string
  }
  wedgeName?: string
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

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  })
}

// ============================================
// MAIN COMPONENT
// ============================================

export function NewsletterPreview({ newsletter, wedgeName }: NewsletterPreviewProps) {
  const displayDate = useMemo(() => formatDateFr(newsletter.sentAt || newsletter.scheduledAt), [newsletter.sentAt, newsletter.scheduledAt])
  const hasAds = newsletter.ads && newsletter.ads.length > 0

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════ */}
      {/* EMAIL CLIENT CHROME                     */}
      {/* ═══════════════════════════════════════ */}
      <div className="mb-0 rounded-t-xl border border-b-0 border-gray-200 bg-gray-100">
        {/* Toolbar */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="ml-3 flex-1 text-center text-xs text-gray-400">
            Aperçu de la newsletter
          </div>
          <div className="w-14" />
        </div>

        {/* Email header fields */}
        <div className="px-5 py-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-12 text-right text-xs font-medium text-gray-500">De :</span>
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
              >
                <span className="text-white text-[10px]">📬</span>
              </div>
              <span className="text-xs font-medium text-gray-800">
                La Lettre Business
              </span>
              <span className="text-xs text-gray-400">
                &lt;contact@lalettrebusiness.fr&gt;
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-right text-xs font-medium text-gray-500">À :</span>
            <span className="text-xs text-gray-600">
              {newsletter.recipientCount
                ? `${newsletter.recipientCount.toLocaleString('fr-FR')} abonnés`
                : 'liste-de-diffusion@lalettrebusiness.fr'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-right text-xs font-medium text-gray-500">Objet :</span>
            <span className="text-xs font-semibold text-gray-800">
              {newsletter.subject || 'Newsletter La Lettre Business'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* EMAIL BODY (scrollable)                */}
      {/* ═══════════════════════════════════════ */}
      <div className="rounded-b-xl border border-gray-200 bg-gray-100">
        <ScrollArea className="max-h-[75vh]">
          <div className="mx-auto max-w-[620px] bg-white shadow-lg min-h-full">
            {/* ── HEADER ── */}
            <div
              className="relative overflow-hidden px-8 pt-8 pb-6"
              style={{
                background: 'linear-gradient(135deg, oklch(0.63 0.17 250) 0%, oklch(0.53 0.18 260) 60%, oklch(0.48 0.16 255) 100%)',
              }}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-[0.04]">
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
              </div>

              <div className="relative">
                {/* Logo and branding */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur-sm">
                      📬
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white tracking-tight">
                        La Lettre Business
                      </h1>
                      <p className="text-[11px] text-blue-200 tracking-wide">
                        L&apos;actualité B2B qui compte pour vous
                      </p>
                    </div>
                  </div>
                  {wedgeName && (
                    <Badge className="bg-white/15 text-white border-white/20 text-[10px] font-medium backdrop-blur-sm hover:bg-white/20">
                      {wedgeName}
                    </Badge>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-blue-100">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium capitalize">{displayDate}</span>
                </div>
              </div>
            </div>

            {/* ── SUBJECT LINE ── */}
            <div className="px-8 py-5 bg-white">
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {newsletter.subject || 'Votre newsletter hebdomadaire'}
              </h2>
              <div className="mt-2 h-0.5 w-12 rounded-full" style={{ backgroundColor: 'oklch(0.65 0.2 45)' }} />
            </div>

            {/* ── MOT DU RÉDACTEUR ── */}
            {newsletter.editorialContent && (
              <>
                <div className="px-8 py-5 bg-gray-50/80 border-y border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <PenTool className="h-4 w-4" style={{ color: 'oklch(0.63 0.17 250)' }} />
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Mot du rédacteur
                    </h3>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-0.5 rounded-full" style={{ backgroundColor: 'oklch(0.63 0.17 250)' }} />
                    <p className="pl-4 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                      {newsletter.editorialContent}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ── ARTICLES IA ── */}
            {(newsletter.aiArticle1 || newsletter.aiArticle2) && (
              <div className="px-8 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4" style={{ color: 'oklch(0.63 0.17 250)' }} />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    À la une
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Article 1 */}
                  {newsletter.aiArticle1 && (
                    <div className="group rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-4 transition-all hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
                        >
                          1
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Article IA
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {newsletter.aiArticle1}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Article 2 */}
                  {newsletter.aiArticle2 && (
                    <div className="group rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-4 transition-all hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
                        >
                          2
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Article IA
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {newsletter.aiArticle2}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ANNONCES PARTENAIRES ── */}
            {hasAds && (
              <div className="border-y border-gray-100">
                {/* Section header */}
                <div className="px-8 pt-5 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: 'oklch(0.65 0.2 45)' }} />
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Offres de nos partenaires
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Découvrez les offres sélectionnées pour vous cette semaine
                  </p>
                </div>

                {/* Ads list */}
                <div className="px-8 pb-5 space-y-4">
                  {newsletter.ads.map((ad, index) => (
                    <div key={index} className="rounded-xl border border-gray-150 overflow-hidden shadow-sm bg-white">
                      <div className="p-5">
                        {/* Partner label */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 border border-amber-200">
                            <Sparkles className="h-3 w-3" />
                            Annonce partenaire
                          </span>
                          {ad.company && (
                            <span className="text-[11px] text-gray-400 font-medium">{ad.company}</span>
                          )}
                        </div>

                        {/* Company + Title */}
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}
                          >
                            {ad.company
                              ? ad.company.substring(0, 2).toUpperCase()
                              : ad.title.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 leading-snug">
                              {ad.title}
                            </h4>
                            {ad.company && (
                              <p className="mt-0.5 text-xs text-gray-500">{ad.company}</p>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {(ad.sector || ad.region) && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {ad.sector && (
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-100">
                                {ad.sector}
                              </span>
                            )}
                            {ad.region && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200">
                                📍 {ad.region}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        {ad.description && (
                          <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
                            {ad.description}
                          </p>
                        )}

                        {/* CTA */}
                        {ad.cta && (
                          <div className="mt-4">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white cursor-pointer transition-all hover:shadow-md"
                              style={{ backgroundColor: 'oklch(0.65 0.2 45)' }}
                            >
                              {ad.cta}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Separator between ads */}
                      {index < newsletter.ads.length - 1 && (
                        <div className="h-px bg-gray-100 mx-5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── QUESTION DU MOIS ── */}
            {newsletter.questionOfMonth && (
              <div className="px-8 py-6">
                <div className="rounded-xl p-5 text-center" style={{ backgroundColor: 'oklch(0.97 0.01 250)' }}>
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'oklch(0.63 0.17 250)' }}>
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Question du mois
                  </p>
                  <p className="text-base font-semibold text-gray-800 leading-snug italic">
                    &ldquo;{newsletter.questionOfMonth}&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    Répondez en répondant à cet email — nous lirons chaque réponse !
                  </p>
                </div>
              </div>
            )}

            {/* ── FOOTER ── */}
            <div
              className="px-8 pt-6 pb-8"
              style={{
                background: 'linear-gradient(180deg, oklch(0.15 0.03 250) 0%, oklch(0.12 0.025 250) 100%)',
              }}
            >
              {/* Top separator */}
              <div className="mb-6 h-px bg-white/10" />

              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-lg">📬</span>
                <span className="text-sm font-bold text-white tracking-tight">
                  La Lettre Business
                </span>
              </div>

              {/* Social icons */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Site web"
                >
                  <Globe className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Unsubscribe + legal */}
              <div className="space-y-2 text-center">
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Vous recevez cet email car vous êtes abonné(e) à{' '}
                  <span className="text-white/60 font-medium">
                    {wedgeName || 'La Lettre Business'}
                  </span>
                  .
                </p>
                <div className="flex items-center justify-center gap-3 text-[11px]">
                  <a href="#" className="text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors">
                    Se désabonner
                  </a>
                  <span className="text-white/20">·</span>
                  <a href="#" className="text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors">
                    Préférences email
                  </a>
                  <span className="text-white/20">·</span>
                  <a href="#" className="text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors">
                    Mentions légales
                  </a>
                </div>
                <p className="text-[10px] text-white/25 mt-3">
                  © {new Date().getFullYear()} La Lettre Business — Tous droits réservés
                  <br />
                  La Lettre Business SAS · 12 Rue de la Paix, 75002 Paris
                  <br />
                  SIRET : 123 456 789 00012 · RCS Paris
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* BOTTOM INFO BAR                        */}
      {/* ═══════════════════════════════════════ */}
      <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {newsletter.recipientCount
              ? `${newsletter.recipientCount.toLocaleString('fr-FR')} destinataires`
              : '—'}
          </span>
          {hasAds && (
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {newsletter.ads.length} annonce{newsletter.ads.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {newsletter.sentAt ? (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Envoyée le {formatShortDate(newsletter.sentAt)}
            </span>
          ) : newsletter.scheduledAt ? (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Planifiée le {formatShortDate(newsletter.scheduledAt)}
            </span>
          ) : (
            <span className="text-gray-400">Brouillon</span>
          )}
        </div>
      </div>
    </div>
  )
}
