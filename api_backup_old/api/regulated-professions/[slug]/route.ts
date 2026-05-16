import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── Full fallback data for all 25 professions ────────────────────────────────

const PROFESSION_DATA: Record<string, {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  authority: string;
  diploma: string;
  requirements: string[];
  tools: { name: string; description: string; category: string; pricing: string; rating: number }[];
  services: { slug: string; title: string; description: string }[];
  tips: string[];
  faq: { q: string; a: string }[];
}> = {
  medecin: {
    slug: "medecin", name: "Médecin", shortName: "Médecin généraliste ou spécialiste",
    description: "La création d'un cabinet médical est un parcours exigeant qui nécessite d'abord l'obtention du Doctorat en médecine, puis l'inscription au Conseil National de l'Ordre des médecins. En tant que profession libérale réglementée, le médecin doit respecter le code de déontologie médicale, s'inscrire au tableau de l'Ordre, et mettre en place un système de facturation du tiers payant avec l'Assurance Maladie.",
    icon: "Stethoscope", color: "rose", category: "Santé & Médical", authority: "Ordre des médecins / ARS", diploma: "Doctorat en médecine (9 ans d'études)",
    requirements: ["Doctorat en médecine et DES/DIS de spécialité", "Inscription au Conseil National de l'Ordre des médecins", "Déclaration d'installation auprès de l'ARS", "Adhésion à une caisse de retraite et prévoyance (CARPIMKO)", "Souscription d'une assurance RC Professionnelle", "Mise en place du tiers payant et télétransmission", "Conformité aux normes sanitaires du local professionnel", "Respect du code de déontologie médicale"],
    tools: [{ name: "Doctolib", description: "Gestion de rendez-vous et téléconsultation pour professionnels de santé", category: "Planning", pricing: "Sur devis", rating: 4.8 }, { name: "Ma Question Santé", description: "Ressources médicales et veille scientifique", category: "Formation", pricing: "Gratuit", rating: 4.5 }, { name: "Qonto", description: "Compte bancaire professionnel adapté aux professions libérales de santé", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Indy", description: "Comptabilité automatisée pour professions libérales", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "Legalstart", description: "Formalités de création de société et documents juridiques", category: "Juridique", pricing: "Sur devis", rating: 4.3 }, { name: "Hiscox", description: "Assurance RC Professionnelle spécifique aux professionnels de santé", category: "Assurance", pricing: "Sur devis", rating: 4.4 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Un accompagnement personnalisé pour chaque étape de votre installation" }, { slug: "business-plan", title: "Business Plan", description: "Plan financier détaillé pour votre cabinet médical" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine pour votre cabinet avec prise de RDV en ligne" }, { slug: "marketing-digital", title: "Marketing Digital", description: "Développement de votre patientèle et visibilité locale" }],
    tips: ["Anticipez votre inscription à l'Ordre : le délai peut être de 2 à 4 mois", "Choisissez votre zone d'installation en vérifiant la densité médicale (carte de l'ARS)", "Investissez dans un logiciel médical certifié (DMP, CPS, télétransmission)", "Renseignez-vous sur les aides à l'installation (NACRE, ARC, prêt d'honneur)", "Souscrivez une RC Pro adaptée dès le premier jour d'exercice"],
    faq: [{ q: "Peut-on créer un cabinet médical en société (SELARL, SEP) ?", a: "Oui, les médecins peuvent exercer sous forme de SELARL, SELAS, SEP ou SELAFA. La SELARL est la forme la plus courante." }, { q: "Quelle assurance est obligatoire pour un médecin ?", a: "L'assurance RC Professionnelle est fortement recommandée et souvent exigée par les conventions." }, { q: "Comment obtenir le remboursement du tiers payant ?", a: "Vous devez signer une convention avec l'Assurance Maladie (CPAM), adhérer à un organisme de télétransmission, et utiliser un logiciel médical certifié." }]
  },
  infirmier: {
    slug: "infirmier", name: "Infirmier libéral", shortName: "Infirmier libéral",
    description: "L'infirmier libéral exerce à son compte, au domicile des patients ou en cabinet. Après l'obtention du Diplôme d'État Infirmier (DEI), il doit s'inscrire au tableau du Conseil départemental de l'Ordre des infirmiers et obtenir un numéro ADELI.",
    icon: "Heart", color: "red", category: "Santé & Médical", authority: "Ordre des infirmiers / ARS", diploma: "Diplôme d'État Infirmier (DEI - 3 ans)",
    requirements: ["Diplôme d'État Infirmier (Bac+3, 3 ans d'études)", "Inscription au tableau de l'Ordre des infirmiers", "Obtention du numéro ADELI auprès de l'ARS", "Souscription assurance RC Professionnelle", "Adhésion à la télétransmission FSE", "Déclaration d'installation (ARS + Ordre)", "Adhésion CARPIMKO (retraite + prévoyance)"],
    tools: [{ name: "Doctolib", description: "Prise de RDV et gestion de planning infirmier", category: "Planning", pricing: "Sur devis", rating: 4.7 }, { name: "Maelia", description: "Logiciel de gestion pour infirmiers libéraux", category: "Gestion", pricing: "Sur devis", rating: 4.5 }, { name: "Indy", description: "Comptabilité simplifiée pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "Qonto", description: "Compte pro avec gestion des déplacements", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement de votre installation en libéral" }, { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine digitale et prise de RDV en ligne" }, { slug: "juridique-ongoing", title: "Juridique & Conformité", description: "Formalités et suivi réglementaire" }],
    tips: ["Vérifiez la densité infirmière dans votre zone avant l'installation", "Les actes infirmiers sont remboursés à 60% par l'Assurance Maladie", "Le statut TNS ou non-TNS a un impact significatif sur vos cotisations sociales", "Le démarrage en cabinet de groupe limite les coûts"],
    faq: [{ q: "Quel est le revenu moyen d'un infirmier libéral ?", a: "Le revenu net moyen d'un infirmier libéral en France est d'environ 35 000 à 45 000\u20AC par an." }, { q: "Peut-on cumuler salariat et libéral ?", a: "Oui, l'exercice mixte est possible sous certaines conditions. Vous devez informer votre employeur et l'Ordre." }]
  },
  pharmacien: {
    slug: "pharmacien", name: "Pharmacien", shortName: "Pharmacien d'officine",
    description: "L'ouverture d'une pharmacie d'officine est l'un des secteurs les plus réglementés en France. Le nombre de pharmacies est limité par le plan de zonage sanitaire.",
    icon: "Pill", color: "emerald", category: "Santé & Médical", authority: "Ordre des pharmaciens / ARS", diploma: "Doctorat en pharmacie (6 ans d'études)",
    requirements: ["Doctorat en pharmacie (Bac+6)", "Inscription à l'Ordre des pharmaciens", "Licence d'exploitation délivrée par l'ARS", "Respect du plan de zonage sanitaire", "Capital minimum obligatoire", "Certification Qualité conforme aux BPF", "Assurance RC Professionnelle obligatoire", "Formation continue annuelle (100h/3 ans)"],
    tools: [{ name: "Vidal", description: "Base de données médicamenteuse de référence", category: "Référentiel", pricing: "Sur devis", rating: 4.8 }, { name: "Phoenix Pharma", description: "Gestion de stock et approvisionnement pharmaceutique", category: "Gestion", pricing: "Sur devis", rating: 4.4 }, { name: "Pennylane", description: "Comptabilité et gestion financière adaptée aux pharmacies", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 }, { name: "Hiscox", description: "Assurance RC Pro spécifique pharmacie", category: "Assurance", pricing: "Sur devis", rating: 4.3 }],
    services: [{ slug: "business-plan", title: "Business Plan", description: "Plan financier détaillé pour le rachat ou la création de pharmacie" }, { slug: "daf-externalise", title: "DAF Externalisé", description: "Gestion financière et comptable de votre pharmacie" }, { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans les démarches de création et rachat" }],
    tips: ["Le plan de zonage sanitaire est la contrainte principale", "Le capital minimum varie selon l'arrêté préfectoral (40 000\u20AC à 100 000\u20AC+)", "Envisagez le rachat d'une officine existante si la création n'est pas possible", "Les marges pharmaceutiques sont réglementées"],
    faq: [{ q: "Combien coûte l'ouverture d'une pharmacie ?", a: "Le budget varie de 150 000\u20AC (rachat) à 800 000\u20AC+ (création)." }, { q: "Peut-on ouvrir une pharmacie dans une zone de sous-densité ?", a: "Oui, les ZSD offrent des conditions d'installation facilitées." }]
  },
  dentiste: {
    slug: "dentiste", name: "Chirurgien-dentiste", shortName: "Chirurgien-dentiste",
    description: "Le chirurgien-dentiste libéral doit obtenir le Doctorat en chirurgie dentaire, s'inscrire au tableau de l'Ordre, et respecter les normes sanitaires strictes pour l'exercice.",
    icon: "Smile", color: "blue", category: "Santé & Médical", authority: "Ordre des chirurgiens-dentistes / ARS", diploma: "Doctorat en chirurgie dentaire (6 ans)",
    requirements: ["Doctorat en chirurgie dentaire (Bac+6)", "Inscription à l'Ordre des chirurgiens-dentistes", "Conformité du local aux normes sanitaires", "Licence d'exploitation de matériel radiologique", "Assurance RC Professionnelle obligatoire", "Adhésion à la télétransmission FSE", "Déclaration d'installation auprès de l'ARS"],
    tools: [{ name: "Dental Monitoring", description: "Suivi à distance et télésurveillance orthodontique", category: "Innovation", pricing: "Sur devis", rating: 4.6 }, { name: "Doctolib", description: "Gestion de rendez-vous pour cabinet dentaire", category: "Planning", pricing: "Sur devis", rating: 4.7 }, { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "Hiscox", description: "Assurance RC Pro chirurgien-dentiste", category: "Assurance", pricing: "Sur devis", rating: 4.4 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement personnalisé pour l'installation" }, { slug: "business-plan", title: "Business Plan", description: "Plan financier incluant les investissements matériels lourds" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV et présentation des soins" }],
    tips: ["L'investissement matériel initial est très élevé : prévoyez 80 000-150 000\u20AC", "Respectez scrupuleusement les normes d'hygiène et de stérilisation", "La sectorisation tarifaire vous permet ou non des dépassements d'honoraires", "Adhérez à une mutuelle professionnelle pour la prévoyance"],
    faq: [{ q: "Quel budget pour ouvrir un cabinet dentaire ?", a: "Le budget varie de 100 000\u20AC (reprise) à 300 000\u20AC+ (création)." }]
  },
  kinesitherapeute: {
    slug: "kinesitherapeute", name: "Kinésithérapeute", shortName: "Masseur-kinésithérapeute",
    description: "Le masseur-kinésithérapeute libéral doit être diplômé (DE MK, 4 ans), inscrit au tableau de l'Ordre et titulaire d'un numéro ADELI.",
    icon: "Activity", color: "teal", category: "Santé & Médical", authority: "Ordre des masseurs-kinésithérapeutes / ARS", diploma: "DE de masseur-kinésithérapeute (4 ans)",
    requirements: ["DE Masseur-kinésithérapeute (Bac+4)", "Inscription à l'Ordre", "Numéro ADELI auprès de l'ARS", "Convention avec l'Assurance Maladie", "Assurance RC Professionnelle", "Local conforme aux normes d'accessibilité"],
    tools: [{ name: "Doctolib", description: "Gestion de RDV et téléconsultation", category: "Planning", pricing: "Sur devis", rating: 4.7 }, { name: "KinePro", description: "Logiciel de gestion de cabinet de kinésithérapie", category: "Gestion", pricing: "Sur devis", rating: 4.3 }, { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "Qonto", description: "Compte pro avec gestion des notes de frais", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans l'installation et le développement" }, { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec prise de RDV en ligne" }],
    tips: ["Le cabinet de groupe est une excellente option pour partager les frais", "La téléconsultation est possible pour les suivis de rééducation", "Le statut TNS est le plus courant"],
    faq: [{ q: "Quels actes sont remboursés ?", a: "La Sécurité Sociale rembourse les actes de rééducation prescrits par un médecin. Les dépassements sont interdits pour les actes remboursés." }]
  },
  "sage-femme": {
    slug: "sage-femme", name: "Sage-femme", shortName: "Sage-femme libérale",
    description: "La sage-femme libérale assure le suivi de grossesse, la préparation à l'accouchement, et les soins post-partum.",
    icon: "Baby", color: "pink", category: "Santé & Médical", authority: "Ordre des sages-femmes / ARS", diploma: "DE de sage-femme (5 ans d'études)",
    requirements: ["DE de sage-femme (Bac+5)", "Inscription à l'Ordre des sages-femmes", "Numéro ADELI auprès de l'ARS", "Convention avec l'Assurance Maladie", "Assurance RC Professionnelle", "Formation continue obligatoire"],
    tools: [{ name: "Doctolib", description: "Prise de RDV et suivi patientes", category: "Planning", pricing: "Sur devis", rating: 4.7 }, { name: "Indy", description: "Comptabilité pour professions libérales de santé", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "Qonto", description: "Compte bancaire professionnel", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans l'installation libérale" }, { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine présentant vos services et compétences" }],
    tips: ["Le suivi global de grossesse est entièrement remboursé", "Vous pouvez prescrire des examens et certains médicaments", "L'installation en maison de naissance est une alternative au cabinet individuel"],
    faq: [{ q: "Quel est le revenu moyen d'une sage-femme libérale ?", a: "Le revenu net moyen est d'environ 30 000 à 40 000\u20AC par an." }]
  },
  avocat: {
    slug: "avocat", name: "Avocat", shortName: "Avocat au barreau",
    description: "L'avocat est un officier ministériel inscrit à un barreau. Il doit être titulaire du CAPA, prêter serment, et s'inscrire au Tableau de l'Ordre.",
    icon: "Scale", color: "amber", category: "Juridique & Finance", authority: "Barreau / Ordre des avocats", diploma: "Master 1 juridique + CAPA (1 an)",
    requirements: ["Master 1 en droit minimum (Bac+4)", "Certificat d'Aptitude à la Profession d'Avocat (CAPA)", "Prestation de serment devant la Cour d'appel", "Inscription au Tableau de l'Ordre du barreau", "Certification CARPA pour les fonds clients", "Assurance RC Professionnelle obligatoire", "Formation continue annuelle (20h minimum)"],
    tools: [{ name: "Lextenso", description: "Base de données juridique et veille légale", category: "Juridique", pricing: "Sur devis", rating: 4.6 }, { name: "Case.law", description: "Gestion de cabinet d'avocat, facturation et dossiers", category: "Gestion", pricing: "Sur devis", rating: 4.5 }, { name: "Pennylane", description: "Comptabilité et facturation pour professions juridiques", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 }, { name: "Captain Contrat", description: "Génération de contrats et documents juridiques", category: "Juridique", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro avec gestion des fonds clients", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre visibilité et attirer des clients" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site professionnel pour votre cabinet d'avocat" }, { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Développement commercial de votre cabinet" }, { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour les cabinets d'avocats" }],
    tips: ["Le réseau et la réputation sont essentiels", "Les niches juridiques (droit du numérique, startups) sont très porteuses", "La gestion des fonds clients (CARPA) est strictement réglementée", "Envisagez le modèle SELARL pour protéger votre patrimoine"],
    faq: [{ q: "Peut-on créer un cabinet d'avocat sous forme de société ?", a: "Oui, les avocats peuvent créer des SELARL, SELAS, SCP ou SEP." }, { q: "Quelle assurance est obligatoire ?", a: "La RC Professionnelle est obligatoire pour tous les avocats inscrits au barreau." }]
  },
  notaire: {
    slug: "notaire", name: "Notaire", shortName: "Notaire",
    description: "Le notaire est un officier public titulaire d'une charge notariale. L'accès est très réglementé avec un numerus clausus.",
    icon: "Stamp", color: "yellow", category: "Juridique & Finance", authority: "Chambre des notaires / Conseil Supérieur du Notariat", diploma: "Master notariat + DJCN/DSN (Bac+8)",
    requirements: ["Master 2 en droit notarial ou équivalent", "Diplôme de Notaire (DJCN ou DSN)", "Stage professionnel de 2 ans en étude notariale", "Examen d'aptitude professionnelle", "Nomination par le Garde des Sceaux", "Serment devant le Tribunal judiciaire", "Assurance RC Professionnelle obligatoire"],
    tools: [{ name: "Notary++", description: "Solution logicielle complète pour études notariales", category: "Gestion", pricing: "Sur devis", rating: 4.5 }, { name: "Pennylane", description: "Comptabilité des études notariales", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 }, { name: "Lextenso", description: "Veille juridique et bases de données notariales", category: "Juridique", pricing: "Sur devis", rating: 4.4 }],
    services: [{ slug: "business-plan", title: "Business Plan", description: "Plan financier pour la reprise ou la création d'office notarial" }, { slug: "daf-externalise", title: "DAF Externalisé", description: "Gestion financière de l'étude notariale" }],
    tips: ["Le numerus clausus rend la reprise d'office plus accessible", "Le coût de reprise varie de 200 000\u20AC à plusieurs millions d'euros", "Les aides à la reprise existent : prêt d'honneur, aides régionales"],
    faq: [{ q: "Comment devenir notaire ?", a: "Le parcours est long : Bac+8 minimum, puis 2 ans de stage en étude notariale, passage du DJCN/DSN, puis examen et nomination. Durée totale : 10-12 ans." }]
  },
  "expert-comptable": {
    slug: "expert-comptable", name: "Expert-comptable", shortName: "Expert-comptable",
    description: "L'expert-comptable est inscrit à l'Ordre des experts-comptables. Il doit être titulaire du DEC obtenu après 8 ans d'études.",
    icon: "Calculator", color: "indigo", category: "Juridique & Finance", authority: "Ordre des experts-comptables / CNCC", diploma: "DEC - Diplôme d'Expertise Comptable (8 ans)",
    requirements: ["Diplôme d'Expertise Comptable (DEC) - Bac+8", "3 ans de stage professionnel supervisé", "Inscription au Tableau de l'Ordre des experts-comptables", "Assurance RC Professionnelle obligatoire", "Respect du code de déontologie", "Formation continue annuelle (40h)"],
    tools: [{ name: "Pennylane", description: "Solution de comptabilité collaborative pour cabinets", category: "Comptabilité", pricing: "Sur devis", rating: 4.7 }, { name: "Sage", description: "Logiciel de comptabilité pour cabinets d'expertise comptable", category: "Comptabilité", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro avec synchronisation comptable automatisée", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Hiscox", description: "Assurance RC Pro pour expert-comptable", category: "Assurance", pricing: "Sur devis", rating: 4.3 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Développer la clientèle de votre cabinet" }, { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour attirer des PME clientes" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site professionnel pour votre cabinet" }, { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Stratégie de développement de votre cabinet" }],
    tips: ["La prospection digitale est le canal d'acquisition le plus efficace", "Nichez-vous : expertise sectorielle différencie votre cabinet", "Le réseau des CES est un excellent levier de développement"],
    faq: [{ q: "Comment devenir expert-comptable ?", a: "Le DEC s'obtient en 3 étapes : DCG (3 ans), DSCG (2 ans), puis DEC (stage de 3 ans). Au total : 8 ans." }]
  },
  "courtier-assurance": {
    slug: "courtier-assurance", name: "Courtier en assurance", shortName: "Courtier en assurance",
    description: "Le courtier en assurance est un intermédiaire inscrit à l'ORIAS. Il doit disposer d'une carte professionnelle, d'une garantie financière et d'une assurance RC Pro.",
    icon: "ShieldCheck", color: "cyan", category: "Juridique & Finance", authority: "ORIAS / ACPR", diploma: "Certification professionnelle ou expérience de 4 ans",
    requirements: ["Inscription à l'ORIAS (registre obligatoire)", "Garantie financière", "Assurance RC Professionnelle obligatoire", "Formation professionnelle initiale (ou 4 ans d'expérience)", "Formation continue annuelle (15h minimum)"],
    tools: [{ name: "Weex", description: "Plateforme de gestion et comparaison d'assurances", category: "Gestion", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro pour encaisser les commissions", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Indy", description: "Comptabilité simplifiée pour courtiers", category: "Comptabilité", pricing: "Gratuit", rating: 4.7 }, { name: "HubSpot", description: "CRM pour gérer le portefeuille clients", category: "CRM", pricing: "Sur devis", rating: 4.5 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de clients en ligne" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site de comparaison et prise de contact" }, { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection ciblée pour le portefeuille clients" }],
    tips: ["L'ORIAS est gratuit mais la garantie financière coûte 1 000-5 000\u20AC/an", "Les comparateurs en ligne sont vos concurrents : différenciez-vous par le conseil humain", "Le marché B2B est très porteur"],
    faq: [{ q: "Comment obtenir l'inscription ORIAS ?", a: "L'inscription se fait en ligne sur orias.fr. Justificatif de compétence, attestation de garantie financière et d'assurance RC Pro nécessaires." }]
  },
  "agent-immobilier": {
    slug: "agent-immobilier", name: "Agent immobilier", shortName: "Agent immobilier / Négociateur",
    description: "L'agent immobilier doit détenir la carte T (transaction immobilière) délivrée par la préfecture.",
    icon: "Building2", color: "orange", category: "Juridique & Finance", authority: "Préfecture / CCI", diploma: "Attestation de capacité professionnelle",
    requirements: ["Attestation de capacité professionnelle", "Carte T délivrée par la préfecture (renouvelable tous les 3 ans)", "Garantie financière obligatoire", "Assurance RC Professionnelle obligatoire", "Non-condamnation pénale", "Respect de la loi Hoguet"],
    tools: [{ name: "SeLoger Pro", description: "Portail de diffusion d'annonces immobilières", category: "Marketing", pricing: "Sur devis", rating: 4.5 }, { name: "ImmoVision", description: "Logiciel de gestion immobilière", category: "Gestion", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour encaisser les frais d'honoraire", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Mailchimp", description: "Emailing pour prospection immobilière", category: "Marketing", pricing: "Gratuit", rating: 4.4 }, { name: "Canva", description: "Création de visuels pour annonces immobilières", category: "Design", pricing: "Gratuit", rating: 4.7 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Stratégie d'acquisition et visibilité immobilière" }, { slug: "community-management", title: "Community Management", description: "Animation de vos réseaux sociaux immobiliers" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site immobilier avec portail d'annonces" }, { slug: "lead-generation", title: "Lead Generation B2B", description: "Prospection immobilière ciblée" }],
    tips: ["La franchise est un excellent moyen de démarrer", "Investissez dans la photographie professionnelle", "Google My Business est gratuit et très efficace en immobilier local"],
    faq: [{ q: "Comment obtenir la carte T d'agent immobilier ?", a: "La demande se fait auprès de la préfecture. Délai : 2-4 mois." }]
  },
  "btp-artisan": {
    slug: "btp-artisan", name: "Artisan BTP", shortName: "Plombier, électricien, maçon",
    description: "L'artisan du BTP est soumis à des obligations réglementaires majeures, notamment l'assurance décennale OBLIGATOIRE.",
    icon: "HardHat", color: "yellow", category: "BTP & Construction", authority: "Chambre des Métiers / CMA", diploma: "CAP ou BP du métier concerné",
    requirements: ["Inscription au Répertoire des Métiers", "Qualification professionnelle (CAP, BP, BTM)", "Assurance décennale OBLIGATOIRE", "Immatriculation URSSAF", "Carte BTP (obligatoire depuis 2017)", "SIRET et KBIS pour les sociétés", "Respect des normes de sécurité sur les chantiers"],
    tools: [{ name: "Tolteck", description: "Gestion de chantier, devis, factures et planning", category: "Gestion", pricing: "Sur devis", rating: 4.6 }, { name: "Obat", description: "Logiciel de devis et facturation pour artisans du BTP", category: "Comptabilité", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro avec gestion des dépenses chantier", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Hiscox", description: "Assurance décennale et RC Pro pour artisans BTP", category: "Assurance", pricing: "Sur devis", rating: 4.3 }, { name: "Google My Business", description: "Visibilité locale gratuite pour artisans", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement de l'artisan dans le développement" }, { slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre visibilité locale" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier sur Google dans votre zone" }, { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec devis en ligne et témoignages" }],
    tips: ["L'assurance décennale coûte entre 2 000\u20AC et 10 000\u20AC/an", "La qualification RGE est un avantage concurrentiel majeur", "Les avis Google sont le #1 moteur d'acquisition pour les artisans"],
    faq: [{ q: "L'assurance décennale est-elle vraiment obligatoire ?", a: "OUI. Sans assurance décennale, un artisan du BTP ne peut pas légalement exercer. Sanctions : amende de 75 000\u20AC et 6 mois d'emprisonnement." }, { q: "Qu'est-ce que la carte BTP ?", a: "La carte d'identification professionnelle BTP est obligatoire depuis le 1er janvier 2017 pour toute intervention sur un chantier." }]
  },
  architecte: {
    slug: "architecte", name: "Architecte", shortName: "Architecte",
    description: "L'architecte doit être inscrit au Tableau de l'Ordre des architectes. La maîtrise d'oeuvre est obligatoire pour les projets > 150m\u00B2.",
    icon: "Compass", color: "slate", category: "BTP & Construction", authority: "Ordre des architectes", diploma: "DEA / HMONP (Bac+5 minimum)",
    requirements: ["Diplôme d'Architecte d'État (DEA) ou HMONP", "Inscription au Tableau de l'Ordre des architectes", "Assurance décennale obligatoire", "Assurance RC Professionnelle obligatoire", "Respect de la loi MOP"],
    tools: [{ name: "ArchiPro", description: "Logiciel de conception et gestion de projets architecturaux", category: "Conception", pricing: "Sur devis", rating: 4.5 }, { name: "Pennylane", description: "Comptabilité pour agence d'architecture", category: "Comptabilité", pricing: "Sur devis", rating: 4.6 }, { name: "Qonto", description: "Compte pro pour agence d'architecture", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Visibilité et acquisition de clients pour votre agence" }, { slug: "creation-site-web", title: "Création Site Web", description: "Portfolio et site vitrine de votre agence" }, { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Développement de votre agence d'architecture" }],
    tips: ["L'intervention d'un architecte est OBLIGATOIRE pour les projets > 150m\u00B2", "Le portfolio est votre meilleur argument commercial", "Les concours d'architecture sont un excellent moyen de se faire connaître"],
    faq: [{ q: "Quand l'intervention d'un architecte est-elle obligatoire ?", a: "Pour tout projet soumis à permis de construire dépassant 150m\u00B2 de surface de plancher." }]
  },
  diagnostiqueur: {
    slug: "diagnostiqueur", name: "Diagnostiqueur immobilier", shortName: "Diagnostiqueur immobilier",
    description: "Le diagnostiqueur immobilier réalise les diagnostics techniques obligatoires lors d'une transaction (DPE, amiante, plomb, termites...).",
    icon: "Search", color: "stone", category: "BTP & Construction", authority: "COFRAC / Ministère de la Transition écologique", diploma: "Certification par organisme accrédité COFRAC",
    requirements: ["Certification par un organisme accrédité par le COFRAC", "Compétences validées par examen ou formation agréée", "Assurance RC Professionnelle obligatoire", "Matériel de diagnostic conforme aux normes", "Respect des méthodes de mesure réglementaires"],
    tools: [{ name: "Altéa", description: "Logiciel de rédaction de rapports de diagnostic immobilier", category: "Gestion", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro pour diagnostiqueur indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale pour les diagnostics immobiliers", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "seo-referencement", title: "SEO & Référencement", description: "Être visible localement sur les diagnostics obligatoires" }, { slug: "creation-site-web", title: "Création Site Web", description: "Vitrine avec tarifaire et zones d'intervention" }, { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de mandats et partenariats agences" }],
    tips: ["Le partenariat avec les agents immobiliers est la source de revenus la plus stable", "Multi-certifiez-vous pour plus de mandats", "Le marché de la rénovation énergétique booste la demande en DPE"],
    faq: [{ q: "Quels diagnostics sont obligatoires lors d'une vente ?", a: "Le DPE est obligatoire pour toutes les ventes. Selon le logement : amiante, plomb, termites, gaz, électricité..." }]
  },
  "rge-entrepreneur": {
    slug: "rge-entrepreneur", name: "Entrepreneur RGE", shortName: "Entrepreneur RGE (Éco-rénovation)",
    description: "L'entrepreneur RGE bénéficie d'une qualification certifiée permettant à ses clients d'accéder aux aides financières de l'État.",
    icon: "Leaf", color: "green", category: "BTP & Construction", authority: "Qualibat / Cerqual / France Rénov'", diploma: "Qualification RGE (renouvelable tous les 3 ans)",
    requirements: ["Qualification délivrée par Qualibat ou Cerqual", "Compétences techniques validées en économies d'énergie", "Assurance décennale et RC Professionnelle", "Renouvellement tous les 3 ans", "Respect du cahier des charges RGE"],
    tools: [{ name: "Tolteck", description: "Gestion de chantier RGE et facturation", category: "Gestion", pricing: "Sur devis", rating: 4.6 }, { name: "Hiscox", description: "Assurance décennale adaptée aux travaux RGE", category: "Assurance", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro avec suivi des subventions", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale avec badge RGE", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Visibilité RGE et acquisition de clients éco-responsables" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site avec badge RGE et simulateur d'aides" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Référencement local pour éco-rénovation" }],
    tips: ["Le label RGE est un argument commercial majeur", "Le marché de la rénovation énergétique est en pleine croissance", "Formez-vous en permanence aux nouvelles techniques"],
    faq: [{ q: "Comment obtenir la qualification RGE ?", a: "Contactez un organisme accrédité (Qualibat, Cerqual). Coût : 500 à 2 000\u20AC. Validité : 3 ans." }]
  },
  restaurateur: {
    slug: "restaurateur", name: "Restaurateur", shortName: "Restaurateur / Traiteur",
    description: "Le secteur de la restauration est soumis à des règles sanitaires strictes. Formation HACCP obligatoire, licence de restaurant, plan de maîtrise sanitaire.",
    icon: "UtensilsCrossed", color: "orange", category: "Commerce & Alimentation", authority: "DDPP / Préfecture", diploma: "Formation HACCP obligatoire (non diplômante)",
    requirements: ["Formation en hygiène alimentaire HACCP", "Déclaration d'activité auprès de la DDPP", "Plan de maîtrise sanitaire (PMS)", "Licence de restaurant (gratuite en mairie)", "Respect des normes d'hygiène CE 852/2004", "Installation conforme aux normes ERP", "Assurance RC Professionnelle", "Permis d'exploitation (si vente d'alcool)"],
    tools: [{ name: "TheFork", description: "Réservation en ligne et visibilité pour restaurants", category: "Réservation", pricing: "Commission sur couverts", rating: 4.5 }, { name: "Zenply", description: "Gestion de planning et rotations du personnel", category: "Gestion", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour restaurants", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Mailchimp", description: "Emailing pour fidéliser la clientèle", category: "Marketing", pricing: "Gratuit", rating: 4.4 }, { name: "Google My Business", description: "Avis clients et visibilité locale", category: "Marketing", pricing: "Gratuit", rating: 4.9 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Stratégie de communication et acquisition" }, { slug: "community-management", title: "Community Management", description: "Instagram, Facebook, TikTok pour votre restaurant" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec menu en ligne" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier sur Google 'restaurant [ville]'" }],
    tips: ["Les avis Google sont LE critère #1 pour choisir un restaurant", "Instagram est le réseau social le plus puissant pour la restauration", "Le menu digital réduit les coûts d'impression"],
    faq: [{ q: "Comment obtenir la licence de restaurant ?", a: "La licence est délivrée gratuitement par le maire de la commune." }, { q: "Quelle est la formation HACCP ?", a: "Formation obligatoire de 1 à 2 jours, coûtant 150-400\u20AC." }]
  },
  boulanger: {
    slug: "boulanger", name: "Boulanger pâtissier", shortName: "Boulanger / Pâtissier",
    description: "Le boulanger-pâtissier artisanal doit être titulaire d'un CAP Boulanger et respecter l'appellation 'boulanger' (pétri sur place).",
    icon: "Croissant", color: "amber", category: "Commerce & Alimentation", authority: "Chambre des Métiers / DDPP", diploma: "CAP Boulanger ou CAP Pâtissier",
    requirements: ["CAP Boulanger (ou qualification équivalente)", "Inscription au Répertoire des Métiers", "Déclaration d'activité auprès de la DDPP", "Respect de l'appellation 'boulanger' (pétrissage sur place)", "Formation en hygiène alimentaire", "Conformité du local aux normes sanitaires et ERP", "Assurance RC Professionnelle"],
    tools: [{ name: "Resengo", description: "Gestion des commandes et click & collect", category: "Ventes", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour boulangerie", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale et avis clients", category: "Marketing", pricing: "Gratuit", rating: 4.8 }, { name: "Canva", description: "Création de visuels pour réseaux sociaux", category: "Design", pricing: "Gratuit", rating: 4.7 }],
    services: [{ slug: "community-management", title: "Community Management", description: "Instagram et Facebook pour votre boulangerie" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec catalogue de produits" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Visibilité locale 'boulangerie [ville]'" }],
    tips: ["L'appellation 'boulanger' est protégée : pain pétri, façonné et cuit sur place", "Le click & collect et la livraison sont des leviers de croissance importants", "Les réseaux sociaux boostent les ventes de pâtisserie"],
    faq: [{ q: "L'appellation 'boulanger' est-elle protégée ?", a: "Oui, depuis la loi du 25 mai 1998. Pétrissage, façonnage et cuisson sur place obligatoires." }]
  },
  "boucher-charcutier": {
    slug: "boucher-charcutier", name: "Boucher charcutier", shortName: "Boucher / Charcutier / Traiteur",
    description: "Le boucher-charcutier doit être titulaire d'un CAP Boucher ou CAP Charcutier et respecter les normes sanitaires strictes (agrément sanitaire DSV).",
    icon: "Beef", color: "red", category: "Commerce & Alimentation", authority: "DSV / DDPP / Chambre des Métiers", diploma: "CAP Boucher ou CAP Charcutier Traiteur",
    requirements: ["CAP Boucher ou CAP Charcutier Traiteur", "Inscription au Répertoire des Métiers", "Agrément sanitaire délivré par la DSV", "Respect des normes d'hygiène HACCP", "Formation en hygiène alimentaire", "Installation conforme aux normes sanitaires", "Assurance RC Professionnelle"],
    tools: [{ name: "Resengo", description: "Gestion des commandes et click & collect", category: "Ventes", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour boucherie-charcuterie", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "community-management", title: "Community Management", description: "Mettre en valeur vos produits sur les réseaux sociaux" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec vos spécialités" }],
    tips: ["La diversification est clé pour la rentabilité", "Les circuits courts et le local sont des arguments commerciaux très forts"],
    faq: [{ q: "Comment obtenir l'agrément sanitaire ?", a: "L'agrément est délivré par la DSV après inspection des locaux. Délai : 1-3 mois." }]
  },
  caviste: {
    slug: "caviste", name: "Caviste", shortName: "Caviste / Débit de boissons",
    description: "L'ouverture d'un débit de boissons nécessite une licence délivrée par la préfecture (licence III ou IV).",
    icon: "Wine", color: "purple", category: "Commerce & Alimentation", authority: "Préfecture / Mairie", diploma: "Licence III ou IV + formation EFS",
    requirements: ["Licence de débit de boissons (III ou IV)", "Formation EFS de 20h", "Déclaration en mairie (ERP)", "Permis d'exploitation (si alcool fort > 15%)", "Assurance RC Professionnelle", "Respect des horaires d'ouverture"],
    tools: [{ name: "Google My Business", description: "Visibilité locale essentielle pour un caviste", category: "Marketing", pricing: "Gratuit", rating: 4.8 }, { name: "Qonto", description: "Compte pro pour caviste", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Mailchimp", description: "Newsletter pour dégustations et arrivages", category: "Marketing", pricing: "Gratuit", rating: 4.4 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Promotion et événementiel autour de vos vins" }, { slug: "community-management", title: "Community Management", description: "Instagram pour mettre en avant vos bouteilles" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site e-commerce de vente de vin en ligne" }],
    tips: ["La licence IV est plus difficile à obtenir que la licence III", "Les dégustations et ateliers vin sont très rentables", "Le commerce en ligne de vin est en forte croissance"],
    faq: [{ q: "Quelle est la différence entre licence III et IV ?", a: "La licence III autorise la vente à emporter (vin, bière). La licence IV autorise toutes les boissons y compris spiritueux et la consommation sur place." }]
  },
  "taxi-vtc": {
    slug: "taxi-vtc", name: "Taxi / VTC", shortName: "Chauffeur Taxi / VTC",
    description: "Le transport de personnes par taxi ou VTC est réglementé. Carte professionnelle et inscription au registre préfectoral obligatoires.",
    icon: "Car", color: "violet", category: "Transport & Logistique", authority: "Préfecture / DREAL", diploma: "Carte professionnelle chauffeur",
    requirements: ["Carte professionnelle de chauffeur de taxi ou VTC", "Inscription au registre préfectoral des transports", "Examen médical de conduite (taxi)", "Licence de transport (VTC)", "Assurance RC Professionnelle obligatoire", "Contrôle technique du véhicule annuel"],
    tools: [{ name: "LeCab / Heetch", description: "Plateformes de mise en relation chauffeur-client", category: "Plateforme", pricing: "Commission sur courses", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour chauffeur indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale pour taxi/VTC", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "creation-site-web", title: "Création Site Web", description: "Vitrine pour votre service de transport" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être visible localement 'taxi [ville]' ou 'VTC [ville]'" }],
    tips: ["Le taxi a l'avantage de la tarification réglementée", "Le VTC offre plus de flexibilité mais des revenus moins stables", "Les plateformes sont des compléments mais pas la source unique de revenus"],
    faq: [{ q: "Comment obtenir la carte de chauffeur de taxi ?", a: "Formation de 150h si primo-demandeur, examen médical, permis B depuis 3 ans minimum. Coût : 1 500-3 000\u20AC." }]
  },
  "transporteur-marchandises": {
    slug: "transporteur-marchandises", name: "Transporteur marchandises", shortName: "Transporteur de marchandises",
    description: "Le transporteur de marchandises doit être titulaire d'une licence de transport communautaire délivrée par la DREAL.",
    icon: "Truck", color: "blue", category: "Transport & Logistique", authority: "DREAL / Préfecture", diploma: "Attestation de capacité professionnelle (LOA)",
    requirements: ["Licence communautaire de transport de marchandises (DREAL)", "Attestation de capacité professionnelle (LOA)", "Assurance marchandises transportées obligatoire", "Respect de la réglementation sociale européenne", "Immatriculation des véhicules", "Contrôle technique régulier", "Conformité aux normes ZFE"],
    tools: [{ name: "TNT Express", description: "Solution de gestion de tournées et livraison", category: "Logistique", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro pour transporteur", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Hiscox", description: "Assurance fret et marchandises transportées", category: "Assurance", pricing: "Sur devis", rating: 4.3 }],
    services: [{ slug: "business-plan", title: "Business Plan", description: "Plan financier pour votre activité de transport" }, { slug: "copilote-entreprise", title: "Copilote Entreprise", description: "Accompagnement dans le développement de votre flotte" }],
    tips: ["Les ZFE contraignent les flottes : investissez dans des véhicules propres", "L'affacturage aide à gérer les délais de paiement", "Le fret collaboratif optimise les tournées"],
    faq: [{ q: "Comment obtenir la licence de transport ?", a: "La licence se demande auprès de la DREAL. Conditions : attestation de capacité, capacité financière, honorabilité. Valable 5 ans." }]
  },
  demenagementur: {
    slug: "demenagementur", name: "Déménageur professionnel", shortName: "Déménageur professionnel",
    description: "Le déménageur professionnel doit être titulaire d'une carte de déménageur délivrée par la préfecture et respecter la tarification réglementée.",
    icon: "Box", color: "brown", category: "Transport & Logistique", authority: "Préfecture", diploma: "Attestation de capacité professionnelle",
    requirements: ["Carte de déménageur délivrée par la préfecture", "Attestation de capacité professionnelle", "Garantie responsabilité civile professionnelle", "Assurance des marchandises transportées", "Respect de la tarification réglementée", "Véhicules adaptés et équipés"],
    tools: [{ name: "Qonto", description: "Compte pro pour entreprise de déménagement", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale pour déménageur", category: "Marketing", pricing: "Gratuit", rating: 4.8 }, { name: "Mailchimp", description: "Emailing pour fidéliser les clients", category: "Marketing", pricing: "Gratuit", rating: 4.4 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition de clients et visibilité locale" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec simulateur de devis" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'déménageur [ville]'" }],
    tips: ["La saisonnalité est forte (juin-septembre = 50% du CA) : anticipez", "Le devis gratuit et sur mesure est le principal canal d'acquisition", "Les avis Google sont cruciaux dans ce secteur"],
    faq: [{ q: "Comment obtenir la carte de déménageur ?", a: "La carte se demande auprès de la préfecture. Valable 5 ans. Délai : 2-3 mois." }]
  },
  coiffeur: {
    slug: "coiffeur", name: "Coiffeur barbier", shortName: "Coiffeur / Barbier",
    description: "Le coiffeur-barbier doit être titulaire d'un CAP Coiffure et effectuer une déclaration d'activité auprès de la Chambre des Métiers.",
    icon: "Scissors", color: "fuchsia", category: "Beauté & Bien-être", authority: "Chambre des Métiers / DDPP", diploma: "CAP Coiffure (2 ans)",
    requirements: ["CAP Coiffure (ou qualification reconnue)", "Déclaration d'activité à la Chambre des Métiers", "Formation en hygiène et sécurité", "Formation spécifique barbier (rasoir)", "Conformité du local aux normes d'hygiène et PMR", "Assurance RC Professionnelle"],
    tools: [{ name: "Resengo", description: "Gestion de rendez-vous en ligne", category: "Planning", pricing: "Sur devis", rating: 4.5 }, { name: "Qonto", description: "Compte pro pour salon de coiffure", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Avis clients et réservation", category: "Marketing", pricing: "Gratuit", rating: 4.9 }, { name: "Canva", description: "Création de visuels pour réseaux sociaux", category: "Design", pricing: "Gratuit", rating: 4.7 }],
    services: [{ slug: "community-management", title: "Community Management", description: "Instagram et TikTok pour votre salon" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV en ligne" }, { slug: "marketing-digital", title: "Marketing Digital", description: "Développement de la clientèle" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'coiffeur [ville]'" }],
    tips: ["Instagram et TikTok sont LES réseaux sociaux pour un coiffeur : publiez des before/after", "La prise de RDV en ligne augmente le taux de remplissage", "Les produits de revente sont une source de marge supplémentaire (30-50%)"],
    faq: [{ q: "Le CAP coiffure est-il obligatoire ?", a: "Pour ouvrir un salon en nom propre, le CAP n'est pas strictement obligatoire si vous embauchez un diplômé. Mais pour coiffer vous-même, le CAP est nécessaire." }]
  },
  estheticienne: {
    slug: "estheticienne", name: "Esthéticienne", shortName: "Esthéticienne / Prothésiste ongulaire",
    description: "L'esthéticienne doit être titulaire d'un BP Esthétique ou CAP et respecter les normes d'hygiène strictes.",
    icon: "Sparkles", color: "rose", category: "Beauté & Bien-être", authority: "Chambre des Métiers / DDPP", diploma: "BP Esthétique ou CAP Esthétique",
    requirements: ["BP Esthétique (2 ans) ou CAP Esthétique (2 ans)", "Déclaration d'activité à la Chambre des Métiers", "Formation en hygiène et sécurité", "Conformité du local aux normes sanitaires", "Assurance RC Professionnelle", "Respect de la réglementation des produits cosmétiques"],
    tools: [{ name: "Resengo", description: "Gestion de rendez-vous et agenda", category: "Planning", pricing: "Sur devis", rating: 4.4 }, { name: "Qonto", description: "Compte pro pour institut de beauté", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Avis clients et visibilité locale", category: "Marketing", pricing: "Gratuit", rating: 4.9 }],
    services: [{ slug: "community-management", title: "Community Management", description: "Instagram pour votre institut de beauté" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec prise de RDV et catalogue de soins" }, { slug: "marketing-digital", title: "Marketing Digital", description: "Acquisition et fidélisation de la clientèle" }],
    tips: ["Les soins du visage et la prothèse ongulaire sont les services les plus rentables", "La fidélisation est clé : cartes de fidélité et forfaits", "Instagram Stories est le format le plus engageant"],
    faq: [{ q: "Quelle différence entre CAP et BP Esthétique ?", a: "Le CAP permet les soins de base. Le BP est plus complet et inclut cosmétique, maquillage et techniques avancées." }]
  },
  "coach-sportif": {
    slug: "coach-sportif", name: "Coach sportif", shortName: "Coach sportif / Préparateur physique",
    description: "Le coach sportif doit être titulaire d'une certification professionnelle reconnue par l'État (BPJEPS, DEUST STAPS).",
    icon: "Dumbbell", color: "lime", category: "Beauté & Bien-être", authority: "DRJSCS / Préfecture", diploma: "BPJEPS ou DEUST STAPS",
    requirements: ["Certification professionnelle (BPJEPS, DEUST STAPS, Master)", "Inscription à la préfecture pour l'enseignement sportif", "Assurance RC Professionnelle OBLIGATOIRE", "Attestation de secourisme (PSC1 recommandé)", "Respect du code du sport", "Déclaration d'activité auto-entrepreneur ou société"],
    tools: [{ name: "Heitz", description: "Logiciel de gestion et facturation pour coachs sportifs", category: "Gestion", pricing: "Sur devis", rating: 4.3 }, { name: "Qonto", description: "Compte pro pour coach sportif indépendant", category: "Banque", pricing: "9\u20AC/mois", rating: 4.6 }, { name: "Google My Business", description: "Visibilité locale et avis clients", category: "Marketing", pricing: "Gratuit", rating: 4.8 }],
    services: [{ slug: "marketing-digital", title: "Marketing Digital", description: "Développer votre clientèle de coach sportif" }, { slug: "community-management", title: "Community Management", description: "Instagram et TikTok pour votre activité" }, { slug: "creation-site-web", title: "Création Site Web", description: "Site vitrine avec témoignages et programmes" }, { slug: "seo-referencement", title: "SEO & Référencement", description: "Être premier 'coach sportif [ville]'" }],
    tips: ["La certification BPJEPS APT est le minimum requis", "Instagram et TikTok sont les meilleurs canaux d'acquisition", "Le coaching en entreprise est un marché en forte croissance", "Les programmes en ligne augmentent votre CA sans augmenter votre temps"],
    faq: [{ q: "Le coach sportif doit-il obligatoirement être diplômé ?", a: "OUI. L'enseignement sportif contre rémunération est encadré par le code du sport. Certification RNCP obligatoire : BPJEPS, DEUST STAPS, Master ou titre professionnel." }]
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Try database first
  try {
    const profession = await db.regulatedProfession.findUnique({
      where: { slug },
    });

    if (profession) {
      return NextResponse.json({ profession });
    }
  } catch {
    // Fallback to static data
  }

  // Fallback to static data
  const profession = PROFESSION_DATA[slug];
  if (!profession) {
    return NextResponse.json(
      { error: "Profession non trouvée" },
      { status: 404 }
    );
  }

  return NextResponse.json({ profession });
}
