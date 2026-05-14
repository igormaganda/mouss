"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

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
  author: { name: string | null; email: string };
}

// ─── HELPERS ──────────────────────────────────────────────────────

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur");
  return res.json();
}

const gradients = [
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
];

const categoryLabels: Record<string, string> = {
  banque: "Banque",
  creation: "Création",
  comptabilite: "Comptabilité",
  assurance: "Assurance",
  legal: "Juridique",
  marketing: "Marketing",
  crm: "CRM",
  gestion: "Gestion",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────

export function BlogPreview() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["published-posts"],
    queryFn: () => fetcher("/api/admin/posts?published=true"),
  });

  const latestPosts = Array.isArray(posts)
    ? (posts as Post[]).slice(0, 3)
    : [];

  return (
    <section className="py-20 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            Blog & Guides
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nos derniers articles
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Guides pratiques, comparatifs détaillés et conseils d&apos;experts pour
            vous accompagner dans votre aventure entrepreneuriale.
          </p>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">
              Aucun article publié pour le moment
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Revenez bientot, nos experts redigeront du contenu pour vous !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ArticleCard post={post} gradient={gradients[index % gradients.length]} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {latestPosts.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" className="group">
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

function ArticleCard({ post, gradient }: { post: Post; gradient: string }) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer">
      {/* Cover image placeholder */}
      <div
        className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <BookOpen className="h-12 w-12 text-white/40" />
        {post.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90 text-xs font-medium backdrop-blur-sm">
            {categoryLabels[post.category] || post.category}
          </Badge>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.createdAt)}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="mt-4 pt-3 border-t">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
            Lire la suite
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
