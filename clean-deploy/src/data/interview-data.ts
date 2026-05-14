// ===========================================
// Pathfinder IA - Interview Framework Data
// ===========================================

import type { InterviewStep, InterviewTemplate } from '@/types/interview';

// ===========================================
// INTERVIEW STEPS DATA (3h Framework)
// ===========================================

export const INTERVIEW_STEPS: InterviewStep[] = [
  // PHASE 1: WELCOME (15 min)
  {
    id: 'welcome-intro',
    phase: 'welcome',
    title: {
      fr: 'Accueil & Mise en confiance',
      ar: 'الترحيب وبناء الثقة'
    },
    description: {
      fr: 'Créer un environnement propice à l\'échange et établir le cadre de l\'entretien',
      ar: 'خلق بيئة مناسبة للحوار وتحديد إطار المقابلة'
    },
    duration: 15,
    checklist: [
      { id: 'w1', label: { fr: 'Accueillir chaleureusement le porteur', ar: 'الترحيب بحرارة بالحامل' }, required: true },
      { id: 'w2', label: { fr: 'Présenter le déroulement de la session', ar: 'تقديم سير الجلسة' }, required: true },
      { id: 'w3', label: { fr: 'Rappeler la confidentialité', ar: 'تذكير بالسرية' }, required: true },
      { id: 'w4', label: { fr: 'Vérifier les attentes du porteur', ar: 'التحقق من توقعات الحامل' }, required: true },
      { id: 'w5', label: { fr: 'Expliquer les outils utilisés', ar: 'شرح الأدوات المستخدمة' }, required: false }
    ],
    questions: [
      { id: 'wq1', question: { fr: 'Qu\'attendez-vous de cette session ?', ar: 'ما الذي تتوقعه من هذه الجلسة؟' }, type: 'open' },
      { id: 'wq2', question: { fr: 'Avez-vous des questions avant de commencer ?', ar: 'هل لديك أسئلة قبل البدء؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Maintenir un contact visuel bienveillant',
        'Utiliser un ton rassurant et professionnel',
        'Prendre le temps nécessaire pour mettre à l\'aise',
        'Adapter le vocabulaire au niveau du porteur'
      ],
      ar: [
        'الحفاظ على تواصل بصري لطيف',
        'استخدام نغمة مطمئنة ومهنية',
        'تخصيص الوقت اللازم للراحة',
        'تكييف المفردات مع مستوى الحامل'
      ]
    }
  },

  // PHASE 2: PROFILE (45 min)
  {
    id: 'profile-background',
    phase: 'profile',
    title: {
      fr: 'Parcours & Expérience',
      ar: 'المسار والخبرة'
    },
    description: {
      fr: 'Analyser le parcours professionnel et personnel du porteur',
      ar: 'تحليل المسار المهني والشخصي للحامل'
    },
    duration: 25,
    checklist: [
      { id: 'p1', label: { fr: 'Consulter les résultats du module Pépites', ar: 'الاطلاع على نتائج وحدة الكنوز' }, required: true },
      { id: 'p2', label: { fr: 'Revoir le CV analysé', ar: 'مراجعة السيرة الذاتية المحللة' }, required: true },
      { id: 'p3', label: { fr: 'Identifier les compétences transférables', ar: 'تحديد المهارات القابلة للنقل' }, required: true },
      { id: 'p4', label: { fr: 'Noter les points forts identifiés', ar: 'تسجيل نقاط القوة المحددة' }, required: true },
      { id: 'p5', label: { fr: 'Identifier les zones de développement', ar: 'تحديد مناطق التطوير' }, required: false }
    ],
    questions: [
      { id: 'pq1', question: { fr: 'Parlez-moi de votre parcours professionnel...', ar: 'حدثني عن مسارك المهني...' }, type: 'open' },
      { id: 'pq2', question: { fr: 'Qu\'avez-vous le plus aimé dans vos expériences passées ?', ar: 'ما الذي أحببته أكثر في خبراتك السابقة؟' }, type: 'open' },
      { id: 'pq3', question: { fr: 'Quelles compétences souhaitez-vous valoriser ?', ar: 'ما المهارات التي ترغب في تعزيزها؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Laisser le porteur s\'exprimer librement',
        'Reformuler pour valider la compréhension',
        'Lier les compétences au projet envisagé',
        'Prendre des notes structurées'
      ],
      ar: [
        'إتاحة المجال للحامل للتعبير بحرية',
        'إعادة الصياغة للتحقق من الفهم',
        'ربط المهارات بالمشروع المقصود',
        'تدوين ملاحظات منظمة'
      ]
    }
  },
  {
    id: 'profile-motivations',
    phase: 'profile',
    title: {
      fr: 'Motivations & Freins',
      ar: 'الدوافع والعوائق'
    },
    description: {
      fr: 'Approfondir les motivations et identifier les freins éventuels',
      ar: 'تعميق الدوافع وتحديد العوائق المحتملة'
    },
    duration: 20,
    checklist: [
      { id: 'pm1', label: { fr: 'Consulter les résultats du module Motivations', ar: 'الاطلاع على نتائج وحدة الدوافع' }, required: true },
      { id: 'pm2', label: { fr: 'Approfondir les motivations principales', ar: 'تعميق الدوافع الرئيسية' }, required: true },
      { id: 'pm3', label: { fr: 'Identifier les freins prioritaires', ar: 'تحديد العوائق ذات الأولوية' }, required: true },
      { id: 'pm4', label: { fr: 'Évaluer l\'impact des freins sur le projet', ar: 'تقييم تأثير العوائق على المشروع' }, required: true }
    ],
    questions: [
      { id: 'pmq1', question: { fr: 'Qu\'est-ce qui vous pousse à vouloir changer ?', ar: 'ما الذي يدفعك للرغبة في التغيير؟' }, type: 'open' },
      { id: 'pmq2', question: { fr: 'Sur une échelle de 1 à 10, à quel point êtes-vous motivé(e) ?', ar: 'على مقياس من 1 إلى 10، ما مدى تحفيزك؟' }, type: 'scale' },
      { id: 'pmq3', question: { fr: 'Quel est votre plus grand obstacle ?', ar: 'ما أكبر عقبة لديك؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Écouter activement sans juger',
        'Identifier les freins cachés',
        'Proposer des pistes de solution',
        'Évaluer le niveau de préparation'
      ],
      ar: [
        'الاستماع النشط دون حكم',
        'تحديد العوائق الخفية',
        'اقتراح حلول ممكنة',
        'تقييم مستوى الإعداد'
      ]
    }
  },

  // PHASE 3: PROJECT (45 min)
  {
    id: 'project-definition',
    phase: 'project',
    title: {
      fr: 'Définition du projet',
      ar: 'تحديد المشروع'
    },
    description: {
      fr: 'Préciser et affiner le projet professionnel du porteur',
      ar: 'تحديد وتنقيح المشروع المهني للحامل'
    },
    duration: 30,
    checklist: [
      { id: 'pr1', label: { fr: 'Valider la clarté du projet', ar: 'التحقق من وضوح المشروع' }, required: true },
      { id: 'pr2', label: { fr: 'Vérifier l\'alignement profil/projet', ar: 'التحقق من توافق الملف مع المشروع' }, required: true },
      { id: 'pr3', label: { fr: 'Identifier les alternatives', ar: 'تحديد البدائل' }, required: false },
      { id: 'pr4', label: { fr: 'Définir les objectifs à court terme', ar: 'تحديد الأهداف قصيرة المدى' }, required: true },
      { id: 'pr5', label: { fr: 'Définir les objectifs à moyen terme', ar: 'تحديد الأهداف متوسطة المدى' }, required: true }
    ],
    questions: [
      { id: 'prq1', question: { fr: 'Décrivez votre projet idéal dans 3 ans', ar: 'صف مشروعك المثالي بعد 3 سنوات' }, type: 'open' },
      { id: 'prq2', question: { fr: 'Quelle forme d\'activité envisagez-vous ?', ar: 'ما شكل النشاط الذي تفكر فيه؟' }, type: 'choice', options: ['Entreprise', 'Salarié', 'Freelance', 'Association', 'Autre'] },
      { id: 'prq3', question: { fr: 'Quelles sont vos priorités ?', ar: 'ما هي أولوياتك؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Guider sans orienter',
        'Vérifier le réalisme du projet',
        'Explorer les alternatives',
        'Documenter les objectifs SMART'
      ],
      ar: [
        'التوجيه دون فرض',
        'التحقق من واقعية المشروع',
        'استكشاف البدائل',
        'توثيق الأهداف الذكية'
      ]
    }
  },
  {
    id: 'project-alignment',
    phase: 'project',
    title: {
      fr: 'Alignement Profil/Projet',
      ar: 'توافق الملف مع المشروع'
    },
    description: {
      fr: 'Analyser la cohérence entre le profil du porteur et son projet',
      ar: 'تحليل التناسق بين ملف الحامل ومشروعه'
    },
    duration: 15,
    checklist: [
      { id: 'pa1', label: { fr: 'Comparer compétences requises vs disponibles', ar: 'مقارنة المهارات المطلوبة مع المتاحة' }, required: true },
      { id: 'pa2', label: { fr: 'Identifier les écarts de compétences', ar: 'تحديد فجوات المهارات' }, required: true },
      { id: 'pa3', label: { fr: 'Proposer un plan de montée en compétences', ar: 'اقتراح خطة تطوير المهارات' }, required: true },
      { id: 'pa4', label: { fr: 'Évaluer la faisabilité globale', ar: 'تقييم الجدوى الشاملة' }, required: true }
    ],
    questions: [
      { id: 'paq1', question: { fr: 'Quelles compétences devez-vous acquérir ?', ar: 'ما المهارات التي يجب عليك اكتسابها؟' }, type: 'open' },
      { id: 'paq2', question: { fr: 'Quel est votre niveau de préparation actuel ?', ar: 'ما مستوى إعدادك الحالي؟' }, type: 'scale' }
    ],
    tips: {
      fr: [
        'Utiliser la matrice d\'alignement',
        'Présenter les écarts visuellement',
        'Proposer des formations ciblées',
        'Définir un plan d\'action concret'
      ],
      ar: [
        'استخدام مصفوفة التوافق',
        'عرض الفجوات بصرياً',
        'اقتراح تدريبات مستهدفة',
        'تحديد خطة عمل ملموسة'
      ]
    }
  },

  // PHASE 4: MARKET (30 min)
  {
    id: 'market-analysis',
    phase: 'market',
    title: {
      fr: 'Analyse du marché',
      ar: 'تحليل السوق'
    },
    description: {
      fr: 'Évaluer la viabilité du projet sur le marché',
      ar: 'تقييم جدوى المشروع في السوق'
    },
    duration: 30,
    checklist: [
      { id: 'm1', label: { fr: 'Analyser le secteur d\'activité', ar: 'تحليل قطاع النشاط' }, required: true },
      { id: 'm2', label: { fr: 'Identifier la clientèle cible', ar: 'تحديد العملاء المستهدفين' }, required: true },
      { id: 'm3', label: { fr: 'Analyser la concurrence', ar: 'تحليل المنافسة' }, required: true },
      { id: 'm4', label: { fr: 'Évaluer les tendances du marché', ar: 'تقييم اتجاهات السوق' }, required: false },
      { id: 'm5', label: { fr: 'Identifier les opportunités', ar: 'تحديد الفرص' }, required: true }
    ],
    questions: [
      { id: 'mq1', question: { fr: 'Qui sont vos clients potentiels ?', ar: 'من هم عملاؤك المحتملون؟' }, type: 'open' },
      { id: 'mq2', question: { fr: 'Quelle est votre proposition de valeur unique ?', ar: 'ما هي قيمتك المقترحة الفريدة؟' }, type: 'open' },
      { id: 'mq3', question: { fr: 'Connaissez-vous vos concurrents ?', ar: 'هل تعرف منافسيك؟' }, type: 'choice', options: ['Oui, bien', 'Partiellement', 'Non', 'En cours de recherche'] }
    ],
    tips: {
      fr: [
        'Utiliser les données de marché disponibles',
        'Croiser avec les tendances nationales',
        'Identifier les niches porteuses',
        'Proposer une veille concurrentielle'
      ],
      ar: [
        'استخدام بيانات السوق المتاحة',
        'المقارنة مع الاتجاهات الوطنية',
        'تحديد القطاعات الواعدة',
        'اقتراح رصد المنافسة'
      ]
    }
  },

  // PHASE 5: FINANCIAL (30 min)
  {
    id: 'financial-plan',
    phase: 'financial',
    title: {
      fr: 'Planification financière',
      ar: 'التخطيط المالي'
    },
    description: {
      fr: 'Analyser la viabilité financière du projet',
      ar: 'تحليل الجدوى المالية للمشروع'
    },
    duration: 30,
    checklist: [
      { id: 'f1', label: { fr: 'Évaluer les besoins de financement', ar: 'تقييم احتياجات التمويل' }, required: true },
      { id: 'f2', label: { fr: 'Analyser les ressources disponibles', ar: 'تحليل الموارد المتاحة' }, required: true },
      { id: 'f3', label: { fr: 'Identifier les aides et subventions', ar: 'تحديد المساعدات والمنح' }, required: true },
      { id: 'f4', label: { fr: 'Calculer le point mort', ar: 'حساب نقطة التعادل' }, required: false },
      { id: 'f5', label: { fr: 'Évaluer la rentabilité prévisionnelle', ar: 'تقييم الربحية المتوقعة' }, required: true }
    ],
    questions: [
      { id: 'fq1', question: { fr: 'De quel capital avez-vous besoin ?', ar: 'ما رأس المال الذي تحتاجه؟' }, type: 'open' },
      { id: 'fq2', question: { fr: 'Quelles sont vos sources de financement ?', ar: 'ما هي مصادر تمويلك؟' }, type: 'open' },
      { id: 'fq3', question: { fr: 'Avez-vous des charges fixes importantes ?', ar: 'هل لديك نفقات ثابتة كبيرة؟' }, type: 'choice', options: ['Oui', 'Non', 'À déterminer'] }
    ],
    tips: {
      fr: [
        'Préparer un plan de trésorerie',
        'Lister les dispositifs d\'aide',
        'Calculer le seuil de rentabilité',
        'Prévoir une marge de sécurité'
      ],
      ar: [
        'إعداد خطة التدفق النقدي',
        'سرد آليات المساعدة',
        'حساب عتبة الربحية',
        'توقع هامش أمان'
      ]
    }
  },

  // PHASE 6: SYNTHESIS (15 min)
  {
    id: 'synthesis-review',
    phase: 'synthesis',
    title: {
      fr: 'Synthèse & Plan d\'action',
      ar: 'الملخص وخطة العمل'
    },
    description: {
      fr: 'Consolider les apprentissages et définir les prochaines étapes',
      ar: 'تجميع التعلمات وتحديد الخطوات التالية'
    },
    duration: 15,
    checklist: [
      { id: 's1', label: { fr: 'Résumer les points clés', ar: 'تلخيص النقاط الرئيسية' }, required: true },
      { id: 's2', label: { fr: 'Valider le plan d\'action', ar: 'التحقق من خطة العمل' }, required: true },
      { id: 's3', label: { fr: 'Définir les échéances', ar: 'تحديد المواعيد النهائية' }, required: true },
      { id: 's4', label: { fr: 'Planifier le suivi', ar: 'تخطيط المتابعة' }, required: true }
    ],
    questions: [
      { id: 'sq1', question: { fr: 'Quelles sont vos 3 prochaines actions prioritaires ?', ar: 'ما هي إجراءاتك الثلاثة التالية ذات الأولوية؟' }, type: 'open' },
      { id: 'sq2', question: { fr: 'Quand prévoyez-vous de les réaliser ?', ar: 'متى تخطط لتنفيذها؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Présenter une vision claire',
        'S\'assurer de l\'engagement du porteur',
        'Fixer des objectifs réalistes',
        'Prévoir des points d\'étape'
      ],
      ar: [
        'تقديم رؤية واضحة',
        'التأكد من التزام الحامل',
        'تحديد أهداف واقعية',
        'توقع نقاط التوقف'
      ]
    }
  },

  // PHASE 7: CONCLUSION (10 min)
  {
    id: 'conclusion-end',
    phase: 'conclusion',
    title: {
      fr: 'Conclusion & Clôture',
      ar: 'الخاتمة والإغلاق'
    },
    description: {
      fr: 'Terminer la session de manière positive',
      ar: 'إنهاء الجلسة بشكل إيجابي'
    },
    duration: 10,
    checklist: [
      { id: 'c1', label: { fr: 'Remercier le porteur', ar: 'شكر الحامل' }, required: true },
      { id: 'c2', label: { fr: 'Rappeler les prochaines étapes', ar: 'تذكير بالخطوات التالية' }, required: true },
      { id: 'c3', label: { fr: 'Programmer le suivi', ar: 'جدولة المتابعة' }, required: true },
      { id: 'c4', label: { fr: 'Générer l\'attestation', ar: 'إنشاء الشهادة' }, required: true }
    ],
    questions: [
      { id: 'cq1', question: { fr: 'Avez-vous des questions ou remarques ?', ar: 'هل لديك أسئلة أو ملاحظات؟' }, type: 'open' }
    ],
    tips: {
      fr: [
        'Terminer sur une note positive',
        'Réaffirmer la confiance',
        'Rester disponible pour le suivi',
        'Encourager la prise d\'action'
      ],
      ar: [
        'الإنهاء بنغمة إيجابية',
        'إعادة تأكيد الثقة',
        'البقاء متاحاً للمتابعة',
        'تشجيع اتخاذ الإجراء'
      ]
    }
  }
];

// ===========================================
// INTERVIEW TEMPLATE
// ===========================================

export const INTERVIEW_TEMPLATE: InterviewTemplate = {
  id: 'standard-3h',
  name: 'Trame d\'Entretien Standard (3h)',
  description: 'Framework complet guidant le conseiller étape par étape pour un entretien de 3 heures',
  totalDuration: 180,
  phases: ['welcome', 'profile', 'project', 'market', 'financial', 'synthesis', 'conclusion'],
  steps: INTERVIEW_STEPS
};

// Helper functions
export function getStepsByPhase(phase: string): InterviewStep[] {
  return INTERVIEW_STEPS.filter(s => s.phase === phase);
}

export function getStepById(id: string): InterviewStep | undefined {
  return INTERVIEW_STEPS.find(s => s.id === id);
}

export function getTotalDuration(): number {
  return INTERVIEW_STEPS.reduce((total, step) => total + step.duration, 0);
}

export function getPhaseDuration(phase: string): number {
  return INTERVIEW_STEPS
    .filter(s => s.phase === phase)
    .reduce((total, step) => total + step.duration, 0);
}
