"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const articles = [
  {
    title: "L'IEF en France : comprendre le cadre légal et les démarches",
    excerpt: "Tout ce que vous devez savoir sur l'instruction en famille en France, de la déclaration préalable aux contrôles annuels.",
    category: "IEF",
    author: "Marie Dupont",
    date: "15 Jan 2025",
    readTime: "8 min",
    image: "/images/articles/ief-education.png",
    featured: true,
  },
  {
    title: "Les bienfaits du sport chez l'enfant",
    excerpt: "Découvrez comment la pratique sportive régulière favorise le développement cognitif et social.",
    category: "Sport",
    author: "Dr. Martin",
    date: "10 Jan 2025",
    readTime: "5 min",
    image: "/images/articles/sport-children.png",
    featured: false,
  },
  {
    title: "Organiser son temps en IEF",
    excerpt: "Conseils pratiques pour structurer les journées et optimiser l'apprentissage à la maison.",
    category: "Éducation",
    author: "Sophie L.",
    date: "8 Jan 2025",
    readTime: "4 min",
    image: "/images/articles/time-organization.png",
    featured: false,
  },
  {
    title: "Rencontres IEF : témoignages de familles",
    excerpt: "Des familles partagent leur expérience et leurs conseils pour réussir l'instruction en famille.",
    category: "Communauté",
    author: "Équipe CS",
    date: "5 Jan 2025",
    readTime: "6 min",
    image: "/images/articles/family-community.png",
    featured: false,
  },
];

export function MagazineSection() {
  const featuredArticle = articles.find(a => a.featured);
  const otherArticles = articles.filter(a => !a.featured);

  return (
    <section id="magazine" className="py-24 bg-[#F4F6FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="label">✦ Magazine</span>
          <h2 className="section-title">Actualités & Ressources</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          {featuredArticle && (
            <Card className="lg:col-span-2 lg:row-span-2 overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 to-transparent" />
              </div>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="text-[0.68rem] font-bold tracking-wider uppercase text-[#E8A020] mb-2">
                  {featuredArticle.category}
                </div>
                <h3 className="font-serif text-xl text-[#0B1F3A] leading-tight mb-3">
                  {featuredArticle.title}
                </h3>
                <p className="text-sm text-[#607090] leading-relaxed flex-1">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-4 text-xs text-[#8899BB]">
                  <span>{featuredArticle.author}</span>
                  <span>·</span>
                  <span>{featuredArticle.date}</span>
                  <span>·</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <Link
                  href="#"
                  className="mt-4 text-sm font-bold text-[#0B1F3A] hover:text-[#E8A020] transition-colors flex items-center gap-1"
                >
                  Lire l&apos;article →
                </Link>
              </CardContent>
            </Card>
          )}
          
          {/* Other Articles */}
          <div className="space-y-6">
            {otherArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group flex">
                <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 flex flex-col justify-center">
                  <div className="text-[0.68rem] font-bold tracking-wider uppercase text-[#E8A020] mb-1">
                    {article.category}
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1F3A] leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#8899BB]">
                    <span>{article.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
