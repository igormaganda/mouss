'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, articles } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, ChevronRight, BookOpen, Copy, Check, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryColors: Record<string, string> = {
  guide: 'bg-[#006994] text-white',
  actualite: 'bg-[#F39C12] text-white',
  comparatif: 'bg-[#8E44AD] text-white',
  conseil: 'bg-[#2ECC71] text-white',
};

export default function ArticlePage() {
  const params = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const article = params?.slug ? getArticleBySlug(params.slug as string) : undefined;
  const related = article ? getRelatedArticles(article.slug, article.category) : [];

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: 'Lien copié !', description: 'Le lien de l\'article a été copié dans votre presse-papier.' });
    setTimeout(() => setCopied(false), 2000);
  }, [toast]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} – AQUABION®`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', article.description);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-gradient-hero text-white py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#00A3CC]" />
            <h1 className="text-3xl font-bold">Article introuvable</h1>
            <p className="text-white/70 mt-2">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
            <Link href="/actualites" className="inline-flex items-center gap-2 mt-6 text-white/90 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voir tous les articles
            </Link>
          </div>
        </header>
      </div>
    );
  }

  const headings = article.content.match(/<h2[^>]*>(.*?)<\/h2>/g)?.map(h => {
    const text = h.replace(/<[^>]*>/g, '');
    return { id: text.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüçÿœæ]+/g, '-'), text };
  }) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Breadcrumb + Header */}
      <header className="bg-gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 truncate max-w-[200px] sm:max-w-none">{article.categoryLabel}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className={`text-xs ${categoryColors[article.category]}`}>{article.categoryLabel}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} de lecture
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <User className="w-3.5 h-3.5" />
              {article.author}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight max-w-4xl">{article.title}</h1>
          <p className="text-white/70 mt-3 text-base sm:text-lg max-w-2xl">{article.description}</p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10 lg:gap-12">
            {/* Article content */}
            <div>
              {/* Hero image */}
              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img src={article.image} alt={article.title} className="w-full h-64 sm:h-80 lg:h-[420px] object-cover" />
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <Link href="/actualites">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Tous les articles
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié !' : 'Copier le lien'}
                </Button>
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#006994] prose-h3:text-lg sm:prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-foreground/80 prose-strong:text-foreground prose-blockquote:border-l-[#006994] prose-blockquote:bg-[#E0F2F7] prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-sm"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/<h2([^>]*)>(.*?)<\/h2>/g, (_, attrs, text) => {
                    const id = text.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüçÿœæ]+/g, '-');
                    return `<h2${attrs} id="${id}">${text}</h2>`;
                  })
                }}
              />

              {/* Author box */}
              <div className="mt-10 p-6 bg-muted/50 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-aquabion flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{article.author}</p>
                  <p className="text-sm text-muted-foreground">Publié le {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {article.readingTime} de lecture</p>
                </div>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="mt-12 pt-10 border-t">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Articles similaires</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {related.map(r => (
                      <Link key={r.slug} href={`/actualites/${r.slug}`} className="group block">
                        <div className="rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                          <div className="relative h-36 overflow-hidden">
                            <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <Badge className={`absolute top-2 left-2 text-xs ${categoryColors[r.category]}`}>{r.categoryLabel}</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{r.readingTime}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to all articles */}
              <div className="mt-10 text-center">
                <Link href="/actualites">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4" /> Voir tous les articles
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table of contents */}
                {headings.length > 0 && (
                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                    <h4 className="font-bold text-sm text-foreground mb-3">Sommaire</h4>
                    <nav className="space-y-2">
                      {headings.map(h => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors leading-snug"
                          onClick={e => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-aquabion rounded-xl p-5 text-white text-center">
                  <p className="font-bold text-sm mb-2">Besoin d&apos;un devis ?</p>
                  <p className="text-xs text-white/80 mb-4">Étude personnalisée gratuite sous 24h</p>
                  <Link href="/#devis-section">
                    <Button className="bg-white text-[#006994] hover:bg-white/90 font-semibold text-sm w-full">
                      Demander mon devis gratuit
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-aquabion text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} aquabion-mag.com – Distributeur officiel AQUABION®</p>
        </div>
      </footer>
    </div>
  );
}
