"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

const categoryImages: Record<string, string> = {
  banque: "https://images.pexels.com/photos/4060251/pexels-photo-4060251.jpeg?auto=compress&cs=tinysrgb&w=600",
  creation: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
  comptabilite: "https://images.pexels.com/photos/6375/desk-office-work-space.jpg?auto=compress&cs=tinysrgb&w=600",
  assurance: "https://images.pexels.com/photos/6219618/pexels-photo-6219618.jpeg?auto=compress&cs=tinysrgb&w=600",
  legal: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600",
  marketing: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600",
  crm: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600",
  gestion: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
};

const defaultImage = "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=600";

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

// ─── CONTAINER ANIMATION ─────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── COMPONENT ────────────────────────────────────────────────────

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["all-published-posts"],
    queryFn: () => fetcher("/api/admin/posts?published=true"),
  });

  const allPosts: Post[] = Array.isArray(posts)
    ? posts
    : posts?.posts
      ? (posts.posts as Post[])
      : [];

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-20 sm:py-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge className="mb-5 bg-white/15 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
              Blog & Guides
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Blog &amp; Guides
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-lg text-white/80 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Guides pratiques, comparatifs détaillés et conseils d&apos;experts
            pour vous accompagner dans votre aventure entrepreneuriale.
          </motion.p>
        </div>
      </section>

      {/* ── Articles Grid ────────────────────────────────── */}
      <section className="flex-1 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : allPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">
                Aucun article publié pour le moment
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Revenez bientôt, nos experts rédigeront du contenu pour vous !
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {allPosts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <ArticleCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── ARTICLE CARD ─────────────────────────────────────────────────

function ArticleCard({ post }: { post: Post }) {
  const coverSrc = post.coverImage
    || (post.category && categoryImages[post.category])
    || defaultImage;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        {/* Cover image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={coverSrc}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    </Link>
  );
}
