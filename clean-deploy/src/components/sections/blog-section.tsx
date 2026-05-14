"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Clock,
  Newspaper,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── TYPES ────────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string | null;
  createdAt: string;
  User?: { name: string | null; email: string };
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  banque: "Banque",
  creation: "Création",
  finance: "Finance",
  comptabilite: "Comptabilité",
  assurance: "Assurance",
  legal: "Juridique",
  marketing: "Marketing",
  crm: "CRM",
  gestion: "Gestion",
};

const gradients = [
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-emerald-600",
  "from-orange-500 to-red-500",
];

// ─── HELPERS ──────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimateReadTime(content: string | null, excerpt: string | null): number {
  const text = content || excerpt || "";
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

async function fetchPosts() {
  const params = new URLSearchParams({ limit: "3" });

  const res = await fetch(`/api/posts?${params}`);
  if (!res.ok) throw new Error("Erreur");
  return res.json() as Promise<{ posts: Post[]; total: number }>;
}

// ─── COMPONENT ────────────────────────────────────────────────────

interface BlogSectionProps {
  initialPosts?: Post[];
  totalPosts?: number;
}

export function BlogSection({ initialPosts, totalPosts: initialTotal }: BlogSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: () => fetchPosts(),
    initialData: initialPosts
      ? { posts: initialPosts, total: initialTotal || initialPosts.length }
      : undefined,
    staleTime: 60 * 1000,
  });

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;

  return (
    <section className="py-10 sm:py-14 bg-muted/30 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-emerald-500/30 text-emerald-600 bg-emerald-50"
          >
            <Newspaper className="h-3.5 w-3.5 mr-1.5" />
            Blog & Ressources
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Actualités &amp; Conseils
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Guides pratiques, comparatifs détaillés et conseils d&apos;experts
            pour vous accompagner dans votre aventure entrepreneuriale.
          </p>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">
              Aucun article dans cette catégorie
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Revenez bientôt, nos experts rédigent du contenu pour vous !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <ArticleCard
                key={post.id}
                post={post}
                gradient={gradients[index % gradients.length]}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        {total > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="group border-primary/30 hover:bg-primary hover:text-primary-foreground font-semibold"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ARTICLE CARD ─────────────────────────────────────────────────

function ArticleCard({
  post,
  gradient,
}: {
  post: Post;
  gradient: string;
}) {
  const readTime = estimateReadTime(post.content, post.excerpt);

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer rounded-2xl border-border/60">
      {/* Cover */}
      <div
        className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-white/30" />
        )}

        {post.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white text-xs font-medium backdrop-blur-sm">
            {categoryLabels[post.category] || post.category}
          </Badge>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readTime} min de lecture
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {post.excerpt ||
            "Découvrez nos conseils et guides pratiques pour votre entreprise."}
        </p>

        {/* Read more */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
            Lire la suite
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
