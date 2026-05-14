/**
 * Schema.org JSON-LD Structured Data
 * Améliore le SEO avec des données structurées pour Google
 */

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CS Ternes Paris Ouest",
  alternateName: "CSTPO",
  description:
    "Association sportive et éducative à Paris. Football, Basket, Judo, Tennis et soutien scolaire pour tous les âges. Bientôt 100 ans d'esprit du sport.",
  url: "https://csternes.paris",
  logo: "https://csternes.paris/images/logo.png",
  foundingDate: "1927",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Rue du Père Brottier",
    addressLocality: "Paris",
    postalCode: "75016",
    addressCountry: "FR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+33-1-47-04-17-55",
    contactType: "customer service",
    availableLanguage: "French",
  },
  sameAs: [
    "https://www.facebook.com/csternesparisouest",
    "https://www.instagram.com/csternesparisouest",
  ],
};

// LocalBusiness Schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "CS Ternes Paris Ouest",
  description:
    "Club sportif multisport et centre d'éducation à Paris. Inscriptions ouvertes toute l'année.",
  url: "https://csternes.paris",
  telephone: "+33-1-47-04-17-55",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Rue du Père Brottier",
    addressLocality: "Paris",
    postalCode: "75016",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.8665,
    longitude: 2.2833,
  },
  openingHours: "Mo-Fr 09:00-19:00, Sa 09:00-17:00",
  priceRange: "€€",
  image: "https://csternes.paris/images/club.webp",
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Football",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Basketball",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Judo",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Tennis",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Soutien scolaire",
      value: true,
    },
  ],
};

// WebSite Schema pour le sitelinks search box
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CS Ternes Paris Ouest",
  url: "https://csternes.paris",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://csternes.paris/recherche?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// SportsOrganization Schema
export const sportsOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "CS Ternes Paris Ouest",
  sport: ["Football", "Basketball", "Judo", "Tennis", "Athlétisme"],
  location: {
    "@type": "Place",
    name: "Complexe Sportif CS Ternes",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 Rue du Père Brottier",
      addressLocality: "Paris",
      postalCode: "75016",
      addressCountry: "FR",
    },
  },
};

// BreadcrumbList Schema pour la navigation
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://csternes.paris${item.url}`,
    })),
  };
}

// Event Schema pour les événements
export function generateEventSchema(event: {
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
  address?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.title,
    description: event.description || "",
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    location: {
      "@type": "Place",
      name: event.location || "CS Ternes Paris Ouest",
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address || "3 Rue du Père Brottier",
        addressLocality: "Paris",
        postalCode: "75016",
        addressCountry: "FR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "CS Ternes Paris Ouest",
      url: "https://csternes.paris",
    },
  };
}

// Article Schema pour le magazine
export function generateArticleSchema(article: {
  title: string;
  excerpt?: string | null;
  publishedAt: Date;
  author?: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    datePublished: article.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author || "CS Ternes Paris Ouest",
    },
    publisher: {
      "@type": "Organization",
      name: "CS Ternes Paris Ouest",
      url: "https://csternes.paris",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://csternes.paris/magazine/${article.slug}`,
    },
  };
}

// FAQ Schema
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
