import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── Fallback data for all 25 professions ────────────────────────────────────

const fallbackProfessions = [
  { slug: "medecin", name: "Médecin", shortName: "Médecin généraliste ou spécialiste", description: "La création d'un cabinet médical est un parcours exigeant qui nécessite d'abord l'obtention du Doctorat en médecine, puis l'inscription au Conseil National de l'Ordre des médecins.", icon: "Stethoscope", color: "rose", category: "Santé & Médical", authority: "Ordre des médecins / ARS", diploma: "Doctorat en médecine (9 ans d'études)" },
  { slug: "infirmier", name: "Infirmier libéral", shortName: "Infirmier libéral", description: "L'infirmier libéral exerce à son compte, au domicile des patients ou en cabinet. Après l'obtention du Diplôme d'État Infirmier (DEI), il doit s'inscrire au tableau du Conseil départemental de l'Ordre des infirmiers.", icon: "Heart", color: "red", category: "Santé & Médical", authority: "Ordre des infirmiers / ARS", diploma: "Diplôme d'État Infirmier (DEI - 3 ans)" },
  { slug: "pharmacien", name: "Pharmacien", shortName: "Pharmacien d'officine", description: "L'ouverture d'une pharmacie d'officine est l'un des secteurs les plus réglementés en France. Le nombre de pharmacies est limité par le plan de zonage sanitaire.", icon: "Pill", color: "emerald", category: "Santé & Médical", authority: "Ordre des pharmaciens / ARS", diploma: "Doctorat en pharmacie (6 ans d'études)" },
  { slug: "dentiste", name: "Chirurgien-dentiste", shortName: "Chirurgien-dentiste", description: "Le chirurgien-dentiste libéral doit obtenir le Doctorat en chirurgie dentaire (6 ans minimum), s'inscrire au tableau de l'Ordre des chirurgiens-dentistes.", icon: "Smile", color: "blue", category: "Santé & Médical", authority: "Ordre des chirurgiens-dentistes / ARS", diploma: "Doctorat en chirurgie dentaire (6 ans)" },
  { slug: "kinesitherapeute", name: "Kinésithérapeute", shortName: "Masseur-kinésithérapeute", description: "Le masseur-kinésithérapeute libéral doit être diplômé (DE MK, 4 ans), inscrit au tableau de l'Ordre et titulaire d'un numéro ADELI.", icon: "Activity", color: "teal", category: "Santé & Médical", authority: "Ordre des masseurs-kinésithérapeutes / ARS", diploma: "DE de masseur-kinésithérapeute (4 ans)" },
  { slug: "sage-femme", name: "Sage-femme", shortName: "Sage-femme libérale", description: "La sage-femme libérale assure le suivi de grossesse, la préparation à l'accouchement, et les soins post-partum.", icon: "Baby", color: "pink", category: "Santé & Médical", authority: "Ordre des sages-femmes / ARS", diploma: "DE de sage-femme (5 ans d'études)" },
  { slug: "avocat", name: "Avocat", shortName: "Avocat au barreau", description: "L'avocat est un officier ministériel inscrit à un barreau. Il doit être titulaire du Certificat d'Aptitude à la Profession d'Avocat (CAPA).", icon: "Scale", color: "amber", category: "Juridique & Finance", authority: "Barreau / Ordre des avocats", diploma: "Master 1 juridique + CAPA (1 an)" },
  { slug: "notaire", name: "Notaire", shortName: "Notaire", description: "Le notaire est un officier public titulaire d'une charge notariale. L'accès à la profession est très réglementé.", icon: "Stamp", color: "yellow", category: "Juridique & Finance", authority: "Chambre des notaires / Conseil Supérieur du Notariat", diploma: "Master notariat + DJCN/DSN (Bac+8)" },
  { slug: "expert-comptable", name: "Expert-comptable", shortName: "Expert-comptable", description: "L'expert-comptable est inscrit à l'Ordre des experts-comptables. Il doit être titulaire du DEC obtenu après 8 ans d'études.", icon: "Calculator", color: "indigo", category: "Juridique & Finance", authority: "Ordre des experts-comptables / CNCC", diploma: "DEC - Diplôme d'Expertise Comptable (8 ans)" },
  { slug: "courtier-assurance", name: "Courtier en assurance", shortName: "Courtier en assurance", description: "Le courtier en assurance est un intermédiaire d'assurance inscrit à l'ORIAS. Il doit disposer d'une carte professionnelle et d'une garantie financière.", icon: "ShieldCheck", color: "cyan", category: "Juridique & Finance", authority: "ORIAS / ACPR", diploma: "Certification professionnelle ou expérience de 4 ans" },
  { slug: "agent-immobilier", name: "Agent immobilier", shortName: "Agent immobilier / Négociateur", description: "L'agent immobilier doit détenir la carte T (transaction immobilière) délivrée par la préfecture.", icon: "Building2", color: "orange", category: "Juridique & Finance", authority: "Préfecture / CCI", diploma: "Attestation de capacité professionnelle" },
  { slug: "btp-artisan", name: "Artisan BTP", shortName: "Plombier, électricien, maçon", description: "L'artisan du BTP est soumis à des obligations réglementaires majeures : inscription à la Chambre des Métiers et assurance décennale OBLIGATOIRE.", icon: "HardHat", color: "yellow", category: "BTP & Construction", authority: "Chambre des Métiers / CMA", diploma: "CAP ou BP du métier concerné" },
  { slug: "architecte", name: "Architecte", shortName: "Architecte", description: "L'architecte doit être inscrit au Tableau de l'Ordre des architectes. Il doit être titulaire du DEA ou du HMONP.", icon: "Compass", color: "slate", category: "BTP & Construction", authority: "Ordre des architectes", diploma: "DEA / HMONP (Bac+5 minimum)" },
  { slug: "diagnostiqueur", name: "Diagnostiqueur immobilier", shortName: "Diagnostiqueur immobilier", description: "Le diagnostiqueur immobilier réalise les diagnostics techniques obligatoires lors d'une transaction immobilière.", icon: "Search", color: "stone", category: "BTP & Construction", authority: "COFRAC / Ministère de la Transition écologique", diploma: "Certification par organisme accrédité COFRAC" },
  { slug: "rge-entrepreneur", name: "Entrepreneur RGE", shortName: "Entrepreneur RGE (Éco-rénovation)", description: "L'entrepreneur RGE bénéficie d'une qualification certifiée qui permet à ses clients d'accéder aux aides financières de l'État.", icon: "Leaf", color: "green", category: "BTP & Construction", authority: "Qualibat / Cerqual / France Rénov'", diploma: "Qualification RGE (renouvelable tous les 3 ans)" },
  { slug: "restaurateur", name: "Restaurateur", shortName: "Restaurateur / Traiteur", description: "Le secteur de la restauration est soumis à des règles sanitaires strictes. Tout restaurateur doit avoir suivi une formation en hygiène alimentaire (HACCP).", icon: "UtensilsCrossed", color: "orange", category: "Commerce & Alimentation", authority: "DDPP / Préfecture", diploma: "Formation HACCP obligatoire (non diplômante)" },
  { slug: "boulanger", name: "Boulanger pâtissier", shortName: "Boulanger / Pâtissier", description: "Le boulanger-pâtissier artisanal doit être titulaire d'un CAP Boulanger et respecter l'appellation 'boulanger' (pétri sur place).", icon: "Croissant", color: "amber", category: "Commerce & Alimentation", authority: "Chambre des Métiers / DDPP", diploma: "CAP Boulanger ou CAP Pâtissier" },
  { slug: "boucher-charcutier", name: "Boucher charcutier", shortName: "Boucher / Charcutier / Traiteur", description: "Le boucher-charcutier doit être titulaire d'un CAP Boucher ou CAP Charcutier et respecter les normes sanitaires strictes.", icon: "Beef", color: "red", category: "Commerce & Alimentation", authority: "DSV / DDPP / Chambre des Métiers", diploma: "CAP Boucher ou CAP Charcutier Traiteur" },
  { slug: "caviste", name: "Caviste", shortName: "Caviste / Débit de boissons", description: "L'ouverture d'un débit de boissons nécessite une licence délivrée par la préfecture. La licence III ou IV selon le type d'établissement.", icon: "Wine", color: "purple", category: "Commerce & Alimentation", authority: "Préfecture / Mairie", diploma: "Licence III ou IV + formation EFS" },
  { slug: "taxi-vtc", name: "Taxi / VTC", shortName: "Chauffeur Taxi / VTC", description: "Le transport de personnes par taxi ou VTC est réglementé. Le chauffeur doit obtenir une carte professionnelle.", icon: "Car", color: "violet", category: "Transport & Logistique", authority: "Préfecture / DREAL", diploma: "Carte professionnelle chauffeur" },
  { slug: "transporteur-marchandises", name: "Transporteur marchandises", shortName: "Transporteur de marchandises", description: "Le transporteur de marchandises doit être titulaire d'une licence de transport communautaire délivrée par la DREAL.", icon: "Truck", color: "blue", category: "Transport & Logistique", authority: "DREAL / Préfecture", diploma: "Attestation de capacité professionnelle (LOA)" },
  { slug: "demenagementur", name: "Déménageur professionnel", shortName: "Déménageur professionnel", description: "Le déménageur professionnel doit être titulaire d'une carte de déménageur délivrée par la préfecture.", icon: "Box", color: "brown", category: "Transport & Logistique", authority: "Préfecture", diploma: "Attestation de capacité professionnelle" },
  { slug: "coiffeur", name: "Coiffeur barbier", shortName: "Coiffeur / Barbier", description: "Le coiffeur-barbier doit être titulaire d'un CAP Coiffure et effectuer une déclaration d'activité auprès de la Chambre des Métiers.", icon: "Scissors", color: "fuchsia", category: "Beauté & Bien-être", authority: "Chambre des Métiers / DDPP", diploma: "CAP Coiffure (2 ans)" },
  { slug: "estheticienne", name: "Esthéticienne", shortName: "Esthéticienne / Prothésiste ongulaire", description: "L'esthéticienne doit être titulaire d'un BP Esthétique ou d'un CAP et respecter les normes d'hygiène strictes.", icon: "Sparkles", color: "rose", category: "Beauté & Bien-être", authority: "Chambre des Métiers / DDPP", diploma: "BP Esthétique ou CAP Esthétique" },
  { slug: "coach-sportif", name: "Coach sportif", shortName: "Coach sportif / Préparateur physique", description: "Le coach sportif doit être titulaire d'une certification professionnelle reconnue par l'État (BPJEPS, DEUST STAPS).", icon: "Dumbbell", color: "lime", category: "Beauté & Bien-être", authority: "DRJSCS / Préfecture", diploma: "BPJEPS ou DEUST STAPS" },
];

export async function GET() {
  try {
    // Try to fetch from database first
    const professions = await db.regulatedProfession.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    if (professions.length > 0) {
      return NextResponse.json({ professions, total: professions.length });
    }
  } catch {
    // Fallback to static data if DB query fails
  }

  return NextResponse.json({
    professions: fallbackProfessions,
    total: fallbackProfessions.length,
  });
}
