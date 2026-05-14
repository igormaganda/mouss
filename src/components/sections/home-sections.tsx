"use client";

import { PricingSection } from "@/components/sections/pricing-section";
import { BlogSection } from "@/components/sections/blog-section";

interface Pack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  active: boolean;
  order: number;
}

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

interface HomeSectionsProps {
  initialPacks?: Pack[];
  initialPosts?: Post[];
  totalPosts?: number;
}

/**
 * Renders the pricing section ("Tarifs transparents") first,
 * followed by the blog section ("Blog & Ressources").
 */
export function HomeSections({ initialPacks, initialPosts, totalPosts }: HomeSectionsProps) {
  return (
    <>
      <div id="tarifs">
        <PricingSection initialPacks={initialPacks} />
      </div>
      <div id="actualites">
        <BlogSection initialPosts={initialPosts} totalPosts={totalPosts} />
      </div>
    </>
  );
}
