// ===========================================
// Pathfinder IA - Motivations & Freins Data
// ===========================================

import type { Motivation, Barrier, MotivationQuestion } from '@/types/motivations';

// ===========================================
// MOTIVATIONS DATA
// ===========================================

export const MOTIVATIONS_DATA: Motivation[] = [
  {
    id: 'mot-autonomy',
    category: 'autonomy',
    name: {
      fr: 'Autonomie & Indépendance',
      ar: 'الاستقلالية والحرية'
    },
    description: {
      fr: 'Être son propre patron, prendre ses propres décisions, organiser son temps librement',
      ar: 'أن تكون رئيس نفسك، تتخذ قراراتك بنفسك، وتنظم وقتك بحرية'
    },
    icon: '🎯',
    weight: 10
  },
  {
    id: 'mot-income',
    category: 'income',
    name: {
      fr: 'Revenus & Gains financiers',
      ar: 'الدخل والأرباح المالية'
    },
    description: {
      fr: 'Augmenter ses revenus, créer de la richesse, atteindre la stabilité financière',
      ar: 'زيادة دخلك، خلق الثروة، تحقيق الاستقرار المالي'
    },
    icon: '💰',
    weight: 9
  },
  {
    id: 'mot-social-impact',
    category: 'social_impact',
    name: {
      fr: 'Impact social & Sociétal',
      ar: 'التأثير الاجتماعي والمجتمعي'
    },
    description: {
      fr: 'Contribuer à la société, aider les autres, créer un changement positif',
      ar: 'المساهمة في المجتمع، مساعدة الآخرين، إحداث تغيير إيجابي'
    },
    icon: '🌍',
    weight: 8
  },
  {
    id: 'mot-recognition',
    category: 'recognition',
    name: {
      fr: 'Reconnaissance & Statut',
      ar: 'الاعتراف والمكانة'
    },
    description: {
      fr: 'Être reconnu pour ses compétences, gagner en crédibilité, inspirer les autres',
      ar: 'أن يتم الاعتراف بكفاءاتك، اكتساب المصداقية، إلهام الآخرين'
    },
    icon: '🏆',
    weight: 7
  },
  {
    id: 'mot-learning',
    category: 'learning',
    name: {
      fr: 'Apprentissage & Développement',
      ar: 'التعلم والتطوير'
    },
    description: {
      fr: 'Apprendre continuellement, développer de nouvelles compétences, se dépasser',
      ar: 'التعلم المستمر، تطوير مهارات جديدة، تجاوز الذات'
    },
    icon: '📚',
    weight: 8
  },
  {
    id: 'mot-creativity',
    category: 'creativity',
    name: {
      fr: 'Créativité & Innovation',
      ar: 'الإبداع والابتكار'
    },
    description: {
      fr: 'Exprimer sa créativité, innover, créer quelque chose de unique',
      ar: 'التعبير عن إبداعك، الابتكار، خلق شيء فريد'
    },
    icon: '🎨',
    weight: 7
  },
  {
    id: 'mot-security',
    category: 'security',
    name: {
      fr: 'Sécurité & Stabilité',
      ar: 'الأمان والاستقرار'
    },
    description: {
      fr: 'Assurer son avenir, construire sur du solide, réduire les incertitudes',
      ar: 'تأمين مستقبلك، البناء على أساس متين، تقليل عدم اليقين'
    },
    icon: '🛡️',
    weight: 6
  },
  {
    id: 'mot-work-life-balance',
    category: 'work_life_balance',
    name: {
      fr: 'Équilibre vie pro/perso',
      ar: 'التوازن بين الحياة المهنية والشخصية'
    },
    description: {
      fr: 'Concilier travail et vie personnelle, passer du temps avec sa famille',
      ar: 'الموازنة بين العمل والحياة الشخصية، قضاء الوقت مع العائلة'
    },
    icon: '⚖️',
    weight: 8
  },
  {
    id: 'mot-leadership',
    category: 'leadership',
    name: {
      fr: 'Leadership & Management',
      ar: 'القيادة والإدارة'
    },
    description: {
      fr: 'Diriger une équipe, former des talents, avoir une influence positive',
      ar: 'قيادة فريق، تأهيل المواهب، التأثير بشكل إيجابي'
    },
    icon: '👥',
    weight: 7
  },
  {
    id: 'mot-challenge',
    category: 'challenge',
    name: {
      fr: 'Défi & Performance',
      ar: 'التحدي والأداء'
    },
    description: {
      fr: 'Se lancer des défis, se mesurer à la concurrence, repousser ses limites',
      ar: 'تحدي الذات، المنافسة، تجاوز الحدود'
    },
    icon: '🎯',
    weight: 6
  }
];

// ===========================================
// BARRIERS DATA
// ===========================================

export const BARRIERS_DATA: Barrier[] = [
  {
    id: 'bar-financial',
    category: 'financial',
    name: {
      fr: 'Ressources financières insuffisantes',
      ar: 'موارد مالية غير كافية'
    },
    description: {
      fr: 'Manque de capital de départ, difficultés à obtenir un prêt, charges financières importantes',
      ar: 'نقص رأس المال الأولي، صعوبة الحصول على قرض، أعباء مالية كبيرة'
    },
    icon: '💸',
    severity: 'high',
    solutions: {
      fr: [
        'Explorer les aides et subventions disponibles',
        'Considérer un démarrage progressif en conservant un emploi salarié',
        'Rechercher des partenaires financiers ou investisseurs',
        'Établir un plan financier réaliste sur 3 ans'
      ],
      ar: [
        'استكشاف المساعدات والمنح المتاحة',
        'النظر في البدء التدريجي مع الحفاظ على وظيفة',
        'البحث عن شركاء ماليين أو مستثمرين',
        'وضع خطة مالية واقعية لمدة 3 سنوات'
      ]
    }
  },
  {
    id: 'bar-psychological',
    category: 'psychological',
    name: {
      fr: 'Peur de l\'échec / Manque de confiance',
      ar: 'الخوف من الفشل / نقص الثقة'
    },
    description: {
      fr: 'Syndrome de l\'imposteur, peur du jugement, anxiété face à l\'inconnu',
      ar: 'متلازمة المحتال، الخوف من الحكم، القلق من المجهول'
    },
    icon: '😰',
    severity: 'high',
    solutions: {
      fr: [
        'Travailler avec un coach ou mentor',
        'Décomposer les objectifs en étapes réalisables',
        'Célébrer les petites victoires',
        'Rejoindre un groupe de soutien d\'entrepreneurs'
      ],
      ar: [
        'العمل مع مدرب أو مرشد',
        'تقسيم الأهداف إلى خطوات قابلة للتحقيق',
        'الاحتفال بالانتصارات الصغيرة',
        'الانضمام إلى مجموعة دعم رواد الأعمال'
      ]
    }
  },
  {
    id: 'bar-skill-gap',
    category: 'skill_gap',
    name: {
      fr: 'Manque de compétences clés',
      ar: 'نقص المهارات الأساسية'
    },
    description: {
      fr: 'Compétences techniques manquantes, manque d\'expérience dans le domaine',
      ar: 'نقص المهارات التقنية، قلة الخبرة في المجال'
    },
    icon: '📖',
    severity: 'medium',
    solutions: {
      fr: [
        'Suivre une formation adaptée',
        'Trouver un mentor dans le domaine',
        'Recruter des collaborateurs complémentaires',
        'Commencer par un stage ou une immersion'
      ],
      ar: [
        'اتباع تدريب مناسب',
        'البحث عن مرشد في المجال',
        'توظيف متعاونين مكملين',
        'البدء بتدريب أو انغماس'
      ]
    }
  },
  {
    id: 'bar-family-support',
    category: 'family_support',
    name: {
      fr: 'Manque de soutien familial',
      ar: 'نقص الدعم العائلي'
    },
    description: {
      fr: 'Opposition du conjoint, inquiétude des proches, charges familiales importantes',
      ar: 'معارضة الزوج/ة، قلق المقربين، أعباء عائلية كبيرة'
    },
    icon: '👨‍👩‍👧',
    severity: 'medium',
    solutions: {
      fr: [
        'Impliquer la famille dans le projet',
        'Présenter un plan concret et rassurant',
        'Trouver des témoignages de réussite similaires',
        'Négocier un période d\'essai acceptée par tous'
      ],
      ar: [
        'إشراك العائلة في المشروع',
        'تقديم خطة ملموسة ومطمئنة',
        'البحث عن شهادات نجاح مماثلة',
        'التفاوض على فترة تجريبية مقبولة من الجميع'
      ]
    }
  },
  {
    id: 'bar-market-knowledge',
    category: 'market_knowledge',
    name: {
      fr: 'Méconnaissance du marché',
      ar: 'عدم معرفة السوق'
    },
    description: {
      fr: 'Manque d\'études de marché, difficulté à identifier les clients, concurrence mal analysée',
      ar: 'نقص دراسات السوق، صعوبة تحديد العملاء، تحليل غير صحيح للمنافسة'
    },
    icon: '📊',
    severity: 'medium',
    solutions: {
      fr: [
        'Réaliser une étude de marché approfondie',
        'Tester le produit/service avec un MVP',
        'Analyser la concurrence en détail',
        'Participer à des salons et événements du secteur'
      ],
      ar: [
        'إجراء دراسة سوق معمقة',
        'اختبار المنتج/الخدمة مع نموذج أولي',
        'تحليل المنافسة بالتفصيل',
        'المشاركة في المعارض والفعاليات القطاعية'
      ]
    }
  },
  {
    id: 'bar-network',
    category: 'network',
    name: {
      fr: 'Réseau professionnel limité',
      ar: 'شبكة مهنية محدودة'
    },
    description: {
      fr: 'Manque de contacts dans le secteur, difficulté à trouver des partenaires',
      ar: 'نقص جهات الاتصال في القطاع، صعوبة العثور على شركاء'
    },
    icon: '🤝',
    severity: 'medium',
    solutions: {
      fr: [
        'Rejoindre des associations professionnelles',
        'Participer à des événements networking',
        'Utiliser LinkedIn activement',
        'Trouver un mentor dans le domaine'
      ],
      ar: [
        'الانضمام إلى جمعيات مهنية',
        'المشاركة في فعاليات التواصل',
        'استخدام لينكد إن بشكل فعال',
        'البحث عن مرشد في المجال'
      ]
    }
  },
  {
    id: 'bar-time',
    category: 'time',
    name: {
      fr: 'Manque de temps disponible',
      ar: 'نقص الوقت المتاح'
    },
    description: {
      fr: 'Emploi actuel prenant, responsabilités familiales, emploi du temps chargé',
      ar: 'الوظيفة الحالية تستغرق وقتاً، مسؤوليات عائلية، جدول مزدحم'
    },
    icon: '⏰',
    severity: 'medium',
    solutions: {
      fr: [
        'Déléguer certaines tâches',
        'Optimiser son emploi du temps',
        'Considérer une transition progressive',
        'Identifier les activités à faible valeur ajoutée'
      ],
      ar: [
        'تفويض بعض المهام',
        'تحسين إدارة الوقت',
        'النظر في انتقال تدريجي',
        'تحديد الأنشطة ذات القيمة المضافة المنخفضة'
      ]
    }
  },
  {
    id: 'bar-age',
    category: 'age',
    name: {
      fr: 'Perception liée à l\'âge',
      ar: 'التصور المرتبط بالعمر'
    },
    description: {
      fr: 'Trop jeune / Trop âgé pour se lancer, préjugés du marché',
      ar: 'صغير جداً / كبير جداً للبدء، تحيزات السوق'
    },
    icon: '🎂',
    severity: 'low',
    solutions: {
      fr: [
        'Transformer l\'expérience en atout',
        'Trouver des modèles de réussite du même âge',
        'Miser sur les compétences transférables',
        'Utiliser son réseau et son expérience'
      ],
      ar: [
        'تحويل الخبرة إلى ميزة',
        'البحث عن نماذج نجاح في نفس العمر',
        'التركيز على المهارات القابلة للنقل',
        'استخدام شبكتك وخبرتك'
      ]
    }
  },
  {
    id: 'bar-qualification',
    category: 'qualification',
    name: {
      fr: 'Manque de diplômes / qualifications',
      ar: 'نقص الشهادات/المؤهلات'
    },
    description: {
      fr: 'Absence de diplôme requis, difficulté à faire reconnaître son expérience',
      ar: 'غياب الشهادة المطلوبة، صعوبة الاعتراف بالخبرة'
    },
    icon: '🎓',
    severity: 'low',
    solutions: {
      fr: [
        'Valoriser l\'expérience pratique',
        'Obtenir des certifications professionnelles',
        'Créer un portfolio de réalisations',
        'Trouver des témoignages de clients/employeurs'
      ],
      ar: [
        'تعزيز الخبرة العملية',
        'الحصول على شهادات مهنية',
        'إنشاء محفظة أعمال',
        'البحث عن شهادات العملاء/أصحاب العمل'
      ]
    }
  },
  {
    id: 'bar-geographic',
    category: 'geographic',
    name: {
      fr: 'Localisation géographique',
      ar: 'الموقع الجغرافي'
    },
    description: {
      fr: 'Zone rurale, éloignement des centres d\'activité, marché local limité',
      ar: 'منطقة ريفية، البعد عن مراكز النشاط، سوق محلي محدود'
    },
    icon: '📍',
    severity: 'medium',
    solutions: {
      fr: [
        'Développer une activité en ligne',
        'Explorer les opportunités locales inexploitées',
        'Considérer le télétravail',
        'Créer un réseau local de partenaires'
      ],
      ar: [
        'تطوير نشاط عبر الإنترنت',
        'استكشاف الفرص المحلية غير المستغلة',
        'النظر في العمل عن بعد',
        'إنشاء شبكة محلية من الشركاء'
      ]
    }
  }
];

// ===========================================
// QUESTIONNAIRE QUESTIONS
// ===========================================

export const MOTIVATION_QUESTIONS: MotivationQuestion[] = [
  // Introduction
  {
    id: 'q-intro-1',
    type: 'open',
    category: 'autonomy',
    question: {
      fr: 'Qu\'est-ce qui vous pousse à envisager ce changement de carrière aujourd\'hui ?',
      ar: 'ما الذي يدفعك للتفكير في هذا التغيير المهني اليوم؟'
    },
    helpText: {
      fr: 'Décrivez brièvement votre situation actuelle et ce qui vous motive à changer',
      ar: 'صف بإيجاز وضعك الحالي وما يحفزك على التغيير'
    },
    required: true
  },
  
  // Motivations - Scale questions
  {
    id: 'q-mot-1',
    type: 'scale',
    category: 'autonomy',
    question: {
      fr: 'À quel point l\'indépendance et l\'autonomie sont importantes pour vous ?',
      ar: 'ما مدى أهمية الاستقلالية والحرية بالنسبة لك؟'
    },
    required: true
  },
  {
    id: 'q-mot-2',
    type: 'scale',
    category: 'income',
    question: {
      fr: 'L\'amélioration de vos revenus est-elle une priorité ?',
      ar: 'هل تحسين دخلك أولوية؟'
    },
    required: true
  },
  {
    id: 'q-mot-3',
    type: 'scale',
    category: 'social_impact',
    question: {
      fr: 'Avoir un impact positif sur la société est-il essentiel pour vous ?',
      ar: 'هل التأثير الإيجابي على المجتمع أمر ضروري بالنسبة لك؟'
    },
    required: true
  },
  {
    id: 'q-mot-4',
    type: 'scale',
    category: 'creativity',
    question: {
      fr: 'Avez-vous besoin d\'exprimer votre créativité dans votre travail ?',
      ar: 'هل تحتاج للتعبير عن إبداعك في عملك؟'
    },
    required: true
  },
  {
    id: 'q-mot-5',
    type: 'scale',
    category: 'security',
    question: {
      fr: 'La sécurité de l\'emploi et la stabilité sont-elles importantes ?',
      ar: 'هل أمان الوظيفة والاستقرار مهمان بالنسبة لك؟'
    },
    required: true
  },
  
  // Barriers - Scale questions
  {
    id: 'q-bar-1',
    type: 'scale',
    category: 'financial',
    question: {
      fr: 'Vos ressources financières sont-elles suffisantes pour vous lancer ?',
      ar: 'هل مواردك المالية كافية للبدء؟'
    },
    required: true
  },
  {
    id: 'q-bar-2',
    type: 'scale',
    category: 'psychological',
    question: {
      fr: 'Vous sentez-vous confiant(e) dans votre capacité à réussir ?',
      ar: 'هل تشعر بالثقة في قدرتك على النجاح؟'
    },
    required: true
  },
  {
    id: 'q-bar-3',
    type: 'scale',
    category: 'skill_gap',
    question: {
      fr: 'Avez-vous les compétences nécessaires pour votre projet ?',
      ar: 'هل لديك المهارات اللازمة لمشروعك؟'
    },
    required: true
  },
  {
    id: 'q-bar-4',
    type: 'scale',
    category: 'family_support',
    question: {
      fr: 'Votre entourage soutient-il votre projet ?',
      ar: 'هل يدعم محيطك مشروعك؟'
    },
    required: true
  },
  {
    id: 'q-bar-5',
    type: 'scale',
    category: 'time',
    question: {
      fr: 'Avez-vous suffisamment de temps à consacrer à votre projet ?',
      ar: 'هل لديك وقت كافٍ لتكريسه لمشروعك؟'
    },
    required: true
  },
  
  // Ranking questions
  {
    id: 'q-rank-1',
    type: 'ranking',
    category: 'autonomy',
    question: {
      fr: 'Classez vos 3 motivations principales par ordre d\'importance :',
      ar: 'رتب دوافعك الثلاثة الرئيسية حسب الأهمية:'
    },
    required: true
  },
  
  // Open questions
  {
    id: 'q-open-1',
    type: 'open',
    category: 'psychological',
    question: {
      fr: 'Quel serait votre plus grand obstacle à surmonter ?',
      ar: 'ما أكبر عقبة يجب التغلب عليها؟'
    },
    required: true
  },
  {
    id: 'q-open-2',
    type: 'open',
    category: 'autonomy',
    question: {
      fr: 'Où vous voyez-vous dans 5 ans si vous réussissez ce projet ?',
      ar: 'أين ترى نفسك بعد 5 سنوات إذا نجحت في هذا المشروع؟'
    },
    required: true
  }
];

// Helper functions
export function getMotivationById(id: string): Motivation | undefined {
  return MOTIVATIONS_DATA.find(m => m.id === id);
}

export function getBarrierById(id: string): Barrier | undefined {
  return BARRIERS_DATA.find(b => b.id === id);
}

export function getMotivationsByCategory(category: string): Motivation[] {
  return MOTIVATIONS_DATA.filter(m => m.category === category);
}

export function getBarriersByCategory(category: string): Barrier[] {
  return BARRIERS_DATA.filter(b => b.category === category);
}
