"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Clock,
  Newspaper,
  ArrowLeft,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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

const CATEGORIES = [
  { value: "all", label: "Tous" },
  { value: "creation", label: "Création" },
  { value: "finance", label: "Finance" },
  { value: "comptabilite", label: "Comptabilité" },
  { value: "assurance", label: "Assurance" },
  { value: "marketing", label: "Marketing" },
  { value: "gestion", label: "Gestion" },
] as const;

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

const categoryColors: Record<string, string> = {
  creation: "bg-emerald-100 text-emerald-700",
  finance: "bg-amber-100 text-amber-700",
  comptabilite: "bg-blue-100 text-blue-700",
  assurance: "bg-rose-100 text-rose-700",
  marketing: "bg-violet-100 text-violet-700",
  gestion: "bg-teal-100 text-teal-700",
  default: "bg-muted text-muted-foreground",
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

function estimateReadTime(
  content: string | null,
  excerpt: string | null
): number {
  const text = content || excerpt || "";
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

async function fetchPosts(
  category: string,
  page: number,
  search: string
) {
  const params = new URLSearchParams({
    limit: "9",
    offset: String((page - 1) * 9),
  });
  if (category !== "all") params.set("category", category);

  const res = await fetch(`/api/posts?${params}`);
  if (!res.ok) throw new Error("Erreur");
  const data = await res.json();

  let posts = data.posts;
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p: Post) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    );
  }

  return { posts, total: data.total };
}

// ─── COMPONENT ────────────────────────────────────────────────────

export function ActualitesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["all-posts", activeCategory, page],
    queryFn: () => fetchPosts(activeCategory, page, search),
  });

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-b">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 text-sm font-medium border-emerald-500/30 text-emerald-600 bg-emerald-50"
              >
                <Newspaper className="h-3.5 w-3.5 mr-1.5" />
                Blog &amp; Ressources
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Actualités &amp; Conseils
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Guides pratiques, comparatifs détaillés et conseils
                d&apos;experts pour vous accompagner dans votre aventure
                entrepreneuriale.
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 h-11 bg-background"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveCategory(cat.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.value
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              <span className="ml-auto text-sm text-muted-foreground self-center">
                {total} article{total > 1 ? "s" : ""}
              </span>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-[420px] rounded-2xl" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-xl font-semibold text-muted-foreground">
                  Aucun article trouvé
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  Essayez une autre catégorie ou recherche.
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCategory}-${page}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.06,
                        }}
                      >
                        <ArticleCard
                          post={post}
                          gradient={
                            gradients[index % gradients.length]
                          }
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
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
  const colorClass =
    (post.category && categoryColors[post.category]) ||
    categoryColors.default;

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col cursor-pointer rounded-2xl border-border/60">
      {/* Cover */}
      <div
        className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="h-14 w-14 text-white/30" />
        )}

        {post.category && (
          <Badge
            className={`absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white text-xs font-medium backdrop-blur-sm`}
          >
            {categoryLabels[post.category] || post.category}
          </Badge>
        )}

        {post.tags && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {post.tags
              .split(",")
              .slice(0, 2)
              .map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
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
