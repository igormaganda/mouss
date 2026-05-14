import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | 100 Jours Pour Entreprendre",
  description:
    "Guides pratiques, comparatifs détaillés et conseils d'experts pour vous accompagner dans votre aventure entrepreneuriale.",
  openGraph: {
    title: "Blog | 100 Jours Pour Entreprendre",
    description:
      "Guides pratiques, comparatifs détaillés et conseils d'experts pour entrepreneurs.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
