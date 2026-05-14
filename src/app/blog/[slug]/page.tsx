"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Calendar,
  ArrowLeft,
  User,
  BookOpen,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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

function getImageForCategory(category: string | null): string {
  if (!category || !categoryImages[category]) return defaultImage;
  return categoryImages[category];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["blog-post", params.slug],
    queryFn: () => fetcher(`/api/blog/${params.slug}`),
    enabled: !!params.slug,
  });

  const post: Post | null = response?.post ?? null;

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <ArticleSkeleton />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AlertCircle className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
            <h1 className="text-2xl font-bold">Article non trouvé</h1>
            <p className="mt-2 text-muted-foreground">
              L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux articles
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const coverSrc = getImageForCategory(post.category);

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Navigation ───────────────────────────────────── */}
      <motion.div
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux articles
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Accueil
          </Link>
        </div>
      </motion.div>

      {/* ── Article ──────────────────────────────────────── */}
      <article className="flex-1">
        {/* Cover image */}
        <motion.div
          className="h-48 sm:h-64 lg:h-72 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={coverSrc}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </motion.div>

        {/* Article header */}
        <motion.div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Category badge */}
          {post.category && (
            <Badge
              variant="secondary"
              className="mb-4 px-3 py-1 text-sm font-medium"
            >
              {categoryLabels[post.category] || post.category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="font-medium">
                {post.author.name || "Anonyme"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          )}
        </motion.div>

        <Separator className="mx-auto max-w-3xl mt-8" />

        {/* Excerpt */}
        {post.excerpt && (
          <motion.div
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">
              {post.excerpt}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-8 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {post.content ? (
            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-li:marker:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-pre:bg-muted prose-pre:rounded-xl prose-img:rounded-xl prose-hr:border-border">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Cet article n&apos;a pas encore de contenu.
            </p>
          )}
        </motion.div>
      </article>

      {/* ── Footer Navigation ────────────────────────────── */}
      <Separator />
      <div className="border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux articles
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <>
      {/* Nav skeleton */}
      <div className="border-b py-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Cover skeleton */}
      <Skeleton className="h-64 sm:h-72 w-full" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-4 py-12">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="pt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 w-full ${i === 2 || i === 5 ? "w-2/3" : ""}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
