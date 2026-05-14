export interface Article {
  slug: string;
  title: string;
  description: string;
  category: "guide" | "actualite" | "comparatif" | "conseil";
  categoryLabel: string;
  image: string;
  author: string;
  date: string;
  readingTime: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "eliminer-calcaire-naturellement",
    title: "Comment éliminer le calcaire naturellement : guide complet 2024",
    description: "Découvrez les méthodes naturelles pour lutter contre le calcaire : vinaigre blanc, bicarbonate, acide citrique. Leurs limites et les solutions durables.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-10-15",
    readingTime: "7 min",
    content: `<h2>Le calcaire : un problème quotidien dans 80% des foyers français</h2>
<p>En France, plus de 80% de la population est alimentée par une eau classée comme « dure » ou « très dure ». Le calcaire, ou tartre, se forme naturellement lorsque l'eau chargée en calcium et magnésium se réchauffe ou s'évapore. Le résultat ? Des dépôts blanchâtres sur vos robinetteries, des traces sur la vaisselle et une usure prématurée de vos équipements.</p>
<p>Face à ce fléau, de nombreuses solutions naturelles existent. Mais sont-elles vraiment efficaces sur le long terme ? Faisons le point.</p>

<h2>Vinaigre blanc : l'incontournable du ménage écologique</h2>
<p>Le vinaigre blanc est sans doute la solution la plus connue. Son acidité (pH environ 2,5) permet de dissoudre les dépôts de calcaire. Pour l'utiliser efficacement :</p>
<ul>
<li><strong>Robinetts et pommeaux de douche :</strong> imbibez un chiffon de vinaigre pur, enveloppez la zone entartrée et laissez agir 1 à 2 heures, puis rincez.</li>
<li><strong>Machine à laver :</strong> versez 1 litre de vinaigre blanc dans le tambour et lancez un cycle à vide à 90°C une fois par mois.</li>
<li><strong>Bouilloire :</strong> remplissez d'eau et de vinaigre (50/50), portez à ébullition, laissez refroidir puis rincez.</li>
</ul>
<p>Le vinaigre blanc coûte moins de 1€ le litre et est totalement biodégradable. C'est un excellent entretien ponctuel, mais il ne prévient pas la formation du calcaire.</p>

<h2>Bicarbonate de soude : l'agent nettoyant polyvalent</h2>
<p>Le bicarbonate de soude est légèrement abrasif et possède des propriétés anti-calcaires. Mélangé au vinaigre, il crée une réaction effervescente qui déloge le tartre incrusté. Il est particulièrement efficace pour :</p>
<ul>
<li>Nettoyer les surfaces émaillées (baignoire, lavabo)</li>
<li>Désodoriser et détartrer simultanément</li>
<li>Entretenir les joints silicones</li>
</ul>

<h2>Acide citrique : l'alternative au vinaigre</h2>
<p>Moins odorant que le vinaigre, l'acide citrique est tout aussi efficace. On le trouve en poudre dans le commerce (environ 3€ les 100g). Dilué à 2 cuillères à soupe par litre d'eau chaude, il s'utilise de la même manière que le vinaigre.</p>

<h2>Les limites des solutions naturelles</h2>
<p>Si ces méthodes sont excellentes pour l'entretien ponctuel, elles ont des limites importantes :</p>
<ul>
<li><strong>Action curative uniquement :</strong> elles nettoient le tartre déjà formé mais ne l'empêchent pas de revenir</li>
<li><strong>Efficacité partielle :</strong> le calcaire incrusté dans les canalisations reste inaccessible</li>
<li><strong>Effort régulier :</strong> un nettoyage hebdomadaire est nécessaire pour maintenir un résultat acceptable</li>
<li><strong>Coût cumulé :</strong> sur un an, le coût des produits s'accumule sans résoudre le problème à la source</li>
</ul>

<blockquote><strong>Le conseil AQUABION :</strong> Les solutions naturelles sont idéales pour le nettoyage de surface. Pour une protection durable de toute votre installation, un traitement anti-calcaire au niveau de l'arrivée d'eau reste la seule solution pérenne.</blockquote>

<h2>Les solutions pérennes contre le calcaire</h2>
<p>Au-delà des remèdes naturels, des solutions technologiques permettent de traiter le calcaire à la source. Le traitement physique par principe galvanique, comme celui utilisé par AQUABION®, transforme la calcite (calcaire incrustant) en aragonite (poudre non adhérente) sans modifier la composition chimique de l'eau. Le résultat : une eau qui protège vos installations tout en conservant ses minéraux bénéfiques.</p>`
  },
  {
    slug: "adoucisseur-couts-caches",
    title: "Adoucisseur d'eau à sel : les coûts cachés que personne ne vous dit",
    description: "Un adoucisseur à sel coûte bien plus que son prix d'achat. Découvrez tous les coûts cachés : sel, entretien, résines, eau gaspillée. Comparaison avec les alternatives.",
    category: "comparatif",
    categoryLabel: "Comparatif",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-10-10",
    readingTime: "8 min",
    content: `<h2>L'achat n'est que la première dépense</h2>
<p>Quand on envisage l'installation d'un adoucisseur d'eau à sel, le premier réflexe est de comparer les prix d'achat. Entre 800€ et 2 500€ selon la capacité, l'investissement initial est déjà conséquent. Mais c'est véritablement après l'installation que les coûts cachés apparaissent.</p>
<p>Voici un panorama complet des dépenses récurrentes que votre installateur omet souvent de mentionner.</p>

<h2>Le sel : une dépense mensuelle incontournable</h2>
<p>Un adoucisseur à sel consomme entre 25 et 50 kg de sel par mois selon la dureté de votre eau et votre consommation. Au prix moyen de 0,30€/kg, cela représente <strong>90 à 180€ par an</strong>, soit 720 à 1 440€ sur 8 ans — la durée de vie moyenne d'un adoucisseur.</p>

<h2>L'entretien régulier : un coût en temps et en argent</h2>
<p>Un adoucisseur n'est pas un appareil « install-and-forget ». Il nécessite :</p>
<ul>
<li><strong>Recharge en sel</strong> toutes les 4 à 6 semaines</li>
<li><strong>Nettoyage du bac à sel</strong> tous les 2 à 3 mois (formation de croûtes)</li>
<li><strong>Remplacement des résines</strong> tous les 5 à 8 ans (300 à 600€)</li>
<li><strong>Révision annuelle</strong> par un professionnel (80 à 150€)</li>
</ul>

<h2>La consommation d'eau : un gaspillage silencieux</h2>
<p>Lors de chaque cycle de régénération, un adoucisseur consomme entre 50 et 150 litres d'eau pour rincer les résines. Avec une régénération tous les 2 à 4 jours, cela représente <strong>5 000 à 27 000 litres d'eau gaspillés par an</strong>. Sur votre facture d'eau, comptez 15 à 80€ supplémentaires annuellement.</p>

<h2>L'impact environnemental : un coût collectif</h2>
<p>Le rejet de saumure (eau chargée en sel) dans les égouts pose problème aux stations d'épuration. Le sel perturbe les processus biologiques de traitement des eaux usées. C'est pourquoi certaines communes commencent à <strong>restreindre ou interdire</strong> les adoucisseurs à sel.</p>

<h2>Coût total sur 8 ans : le vrai chiffre</h2>
<p>En additionnant tous les coûts, le budget total d'un adoucisseur à sel sur 8 ans est estimé entre :</p>
<ul>
<li>Achat : 1 000 à 1 800€</li>
<li>Sel : 720 à 1 440€</li>
<li>Entretien/résines : 900 à 2 000€</li>
<li>Eau gaspillée : 120 à 640€</li>
<li><strong>TOTAL : 2 740 à 5 880€</strong></li>
</ul>

<blockquote><strong>Alternative :</strong> Les systèmes anti-calcaire physiques comme AQUABION® ne consomment ni sel ni électricité, ne nécessitent aucun entretien et ne gaspillent pas d'eau. Sur 8 ans, le coût se réduit à l'achat initial uniquement.</blockquote>`
  },
  {
    slug: "aragonite-vs-calcite",
    title: "Aragonite vs calcite : comprendre la transformation qui change tout",
    description: "Calcite et aragonite sont deux formes cristallines du carbonate de calcium. Découvrez pourquoi transformer la calcite en aragonite résout le problème du calcaire.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-10-08",
    readingTime: "6 min",
    content: `<h2>Deux cristaux, un seul minéral</h2>
<p>Le calcaire qui se dépose dans vos canalisations est principalement composé de carbonate de calcium (CaCO₃). Ce que l'on sait moins, c'est que ce minéral peut cristalliser sous deux formes très différentes : la <strong>calcite</strong> et l'<strong>aragonite</strong>.</p>
<p>Bien qu'elles aient la même composition chimique, leurs structures cristallines sont fondamentalement différentes — et cela change tout pour votre plomberie.</p>

<h2>La calcite : le calcaire incrustant</h2>
<p>La calcite est la forme cristalline la plus courante dans l'eau naturelle. Ses cristaux se présentent sous forme de prismes hexagonaux qui s'accrochent facilement aux surfaces. C'est cette forme qui est responsable du tartre incrustant dans vos canalisations, sur vos résistances électriques et dans vos appareils ménagers.</p>
<p>Les dépôts de calcite sont durs, adhérents et très difficiles à éliminer une fois installés. Ils forment une couche isolante qui réduit le diamètre de vos tuyaux et isole thermiquement vos résistances.</p>

<h2>L'aragonite : une poudre inoffensive</h2>
<p>L'aragonite possède une structure cristalline orthorhombique en forme d'aiguilles. Ses cristaux sont allongés et ne s'accrochent pas aux surfaces. Au lieu de former des dépôts durs, l'aragonite reste en suspension dans l'eau sous forme de microcristallites poudreuses.</p>
<p>Lorsque l'eau contenant de l'aragonite s'écoule, ces microcristallites sont simplement évacuées avec le flux, sans laisser de dépôts significatifs.</p>

<h2>Comment provoquer cette transformation ?</h2>
<p>Le passage de calcite à aragonite peut être induit par plusieurs procédés :</p>
<ul>
<li><strong>Principe galvanique :</strong> une anode de zinc sacrificielle placée dans le flux d'eau crée un champ électrochimique qui modifie la cristallisation (technologie AQUABION®)</li>
<li><strong>Champ magnétique :</strong> des aimants permanents peuvent partiellement influencer la cristallisation</li>
<li><strong>Changement de pression/température :</strong> un processus naturel mais non contrôlable</li>
</ul>
<p>Le principe galvanique est considéré comme le plus efficace car il agit de manière continue sur la totalité de l'eau consommée.</p>

<blockquote><strong>Point clé :</strong> La transformation de calcite en aragonite ne modifie pas la composition chimique de l'eau. Le calcium et le magnésium, minéraux bénéfiques pour la santé, restent présents. Seule la forme cristalline change.</blockquote>

<h2>Pourquoi c'est révolutionnaire</h2>
<p>Contrairement à un adoucisseur qui retire les minéraux de l'eau, le traitement par transformation cristalline préserve la qualité de l'eau tout en éliminant les inconvénients du calcaire. C'est une approche qui respecte à la fois votre plomberie, votre santé et l'environnement.</p>`
  },
  {
    slug: "carte-durete-eau-france",
    title: "Carte de la dureté de l'eau en France : où habitez-vous ?",
    description: "Découvrez la dureté de l'eau dans votre département en France. Carte complète des niveaux de calcaire par région et conseils adaptés à votre situation.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    author: "Sophie Martin",
    date: "2024-09-28",
    readingTime: "7 min",
    content: `<h2>Qu'est-ce que la dureté de l'eau ?</h2>
<p>La dureté de l'eau, mesurée en degrés français (°TH ou °f), indique sa teneur en calcium et en magnésium. Plus ce chiffre est élevé, plus l'eau est « dure » et calcaire.</p>
<ul>
<li><strong>0 à 15 °TH :</strong> eau très douce (peu de calcaire)</li>
<li><strong>15 à 25 °TH :</strong> eau douce (calcaire modéré)</li>
<li><strong>25 à 35 °TH :</strong> eau moyennement dure (calcaire sensible)</li>
<li><strong>35 à 45 °TH :</strong> eau dure (calcaire important)</li>
<li><strong>> 45 °TH :</strong> eau très dure (calcaire très important)</li>
</ul>

<h2>Les régions les plus touchées par le calcaire</h2>
<p>En France, la répartition du calcaire est très inégale :</p>
<ul>
<li><strong>Paris et Île-de-France :</strong> 25 à 35 °TH — zone urbanisée fortement impactée</li>
<li><strong>Provence-Alpes-Côte d'Azur :</strong> 30 à 45 °TH — l'une des régions les plus calcaires de France</li>
<li><strong>Bretagne et Pays de la Loire :</strong> 5 à 15 °TH — eaux naturellement douces</li>
<li><strong>Grand Est :</strong> 20 à 40 °TH — forte disparité départementale</li>
<li><strong>Auvergne-Rhône-Alpes :</strong> 15 à 35 °TH — des eaux douces à très dures selon les zones</li>
<li><strong>Nouvelle-Aquitaine :</strong> 15 à 40 °TH — grande variabilité géologique</li>
<li><strong>Hauts-de-France :</strong> 15 à 30 °TH — zone intermédiaire</li>
<li><strong>Occitanie :</strong> 20 à 45 °TH — zone très calcaire dans le Sud</li>
</ul>

<h2>Comment connaître la dureté de votre eau ?</h2>
<p>Plusieurs méthodes existent :</p>
<ul>
<li><strong>Rapport annuel de votre fournisseur d'eau :</strong> il indique la dureté moyenne de l'eau distribuée</li>
<li><strong>Test en pharmacie :</strong> des kits de test sont disponibles pour environ 5€</li>
<li><strong>Bandelettes test :</strong> vendues en magasin de bricolage</li>
<li><strong>Site du ministère de la Santé :</strong> les résultats d'analyses de l'eau potable sont publics</li>
</ul>

<blockquote><strong>Bon à savoir :</strong> Même dans les régions à eau douce, le calcaire peut causer des problèmes à partir de 15 °TH. Si votre eau dépasse 25 °TH, un traitement anti-calcaire est fortement recommandé pour protéger vos installations.</blockquote>`
  },
  {
    slug: "calcaire-electromenager",
    title: "Impact du calcaire sur l'électroménager : protéger ou remplacer ?",
    description: "Le calcaire détruit vos appareils électroménagers. Machine à laver, lave-vaisselle, bouilloire... Calculez le coût réel et découvrez comment les protéger.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    author: "Marie Dupont",
    date: "2024-09-20",
    readingTime: "5 min",
    content: `<h2>Vos appareils sous haute tension</h2>
<p>Le calcaire est l'ennemi n°1 de vos appareils électroménagers utilisant de l'eau. Chaque année, des millions de foyers français constatent la dégradation prématurée de leurs équipements à cause du tartre. Le constat est sans appel : dans les zones d'eau dure, la durée de vie des appareils est réduite de <strong>30 à 50%</strong>.</p>

<h2>Machine à laver : le premier concerné</h2>
<p>Une machine à laver en eau très dure (>35°TH) accumule jusqu'à 7 kg de calcaire par an à l'intérieur de son tambour et de ses circuits. Les conséquences :</p>
<ul>
<li>Surconsommation électrique due à l'encrassement de la résistance (+30%)</li>
<li>Usure prématurée des joints et des pièces mécaniques</li>
<li>Dépôts sur le linge (taches grises, raidissement des tissus)</li>
<li>Pannes fréquentes : pompe bouchée, electrovanne grippée</li>
</ul>
<p>Coût moyen d'un remplacement anticipé : <strong>400 à 800€</strong>.</p>

<h2>Lave-vaisselle : performances réduites</h2>
<p>Le calcaire se dépose sur les bras de lavage, les filtres et les résistances. Résultat : la vaisselle ressort terne, couverte de traces blanches. Les fabricants recommandent l'utilisation de sel régénérant et de liquide de rinçage, soit un surcoût de 40 à 80€ par an.</p>

<h2>Bouilloires et cafetières : les victimes silencieuses</h2>
<p>La bouilloire est l'appareil le plus rapidement affecté car l'eau y est portée à ébullition, ce qui précipite le calcaire. En eau dure, une couche de tartre de 3 mm se forme en seulement 2 mois, augmentant le temps de chauffe de 25% et la consommation électrique associée.</p>

<blockquote><strong>Le calcul :</strong> Sur 8 ans, le calcaire peut coûter entre 1 500 et 3 000€ en remplacements anticipés, réparations et surconsommation d'énergie. Un investissement dans un traitement anti-calcaire à la source est rentabilisé en 2 à 3 ans.</blockquote>`
  },
  {
    slug: "traitement-galvanique-fonctionnement",
    title: "Traitement anti-calcaire galvanique : le principe révolutionnaire expliqué",
    description: "Comment fonctionne le traitement anti-calcaire par principe galvanique ? Découvrez la science derrière la protection au zinc sans sel ni électricité.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-09-15",
    readingTime: "6 min",
    content: `<h2>Qu'est-ce que le traitement galvanique ?</h2>
<p>Le traitement anti-calcaire par principe galvanique est une technologie qui utilise les propriétés électrochimiques du zinc pour modifier la cristallisation du carbonate de calcium dans l'eau. Contrairement aux adoucisseurs qui retirent les minéraux, cette méthode les préserve tout en neutralisant leur capacité à former des dépôts incrustants.</p>

<h2>Le principe scientifique</h2>
<p>Le fonctionnement repose sur trois phénomènes physiques combinés :</p>
<ul>
<li><strong>Pile galvanique :</strong> une anode en zinc pur et une cathode en acier inoxydable créent un courant galvanique naturel lorsque l'eau les traverse. Aucune source d'énergie externe n'est nécessaire.</li>
<li><strong>Effet électrochimique :</strong> le courant modifie les charges de surface des cristaux de carbonate de calcium, favorisant la formation d'aragonite au détriment de la calcite.</li>
<li><strong>Effet de nucléation :</strong> les ions de zinc libérés servent de sites de nucléation privilégiés, orientant la cristallisation vers la forme aragonitique.</li>
</ul>

<h2>Les avantages concrets</h2>
<ul>
<li><strong>Zéro entretien :</strong> pas de sel à recharger, pas de résine à remplacer, pas de réglage</li>
<li><strong>Zéro consommation électrique :</strong> le processus est auto-alimenté par la pile galvanique</li>
<li><strong>Préservation des minéraux :</strong> calcium et magnésium restent dans l'eau, bénéfiques pour la santé</li>
<li><strong>Durée de vie : 8 à 10 ans</strong> selon le modèle et l'utilisation</li>
<li><strong>Respect de l'environnement :</strong> aucun rejet chimique dans les eaux usées</li>
</ul>

<h2>AQUABION® : le pionnier du traitement galvanique</h2>
<p>La technologie AQUABION®, développée en Suisse, est l'un des systèmes les plus éprouvés sur le marché. Chaque appareil intègre un corps en laiton de haute qualité, une anode en zinc de très haute pureté et un noyau vortex qui optimise le temps de contact entre l'eau et l'anode.</p>

<blockquote><strong>Résultat :</strong> Dès les premières semaines d'utilisation, les utilisateurs constatent une réduction visible des dépôts calcaires. Sur le long terme, les canalisations existantes se nettoient progressivement grâce à l'action dissolvante de l'eau traitée.</blockquote>`
  },
  {
    slug: "calcaire-peau-problemes",
    title: "Calcaire et problèmes de peau : le lien que votre dermatologue oublie",
    description: "Eczéma, peau sèche, démangeaisons : le calcaire de l'eau pourrait être en cause. Découvrez les études et témoignages sur le lien eau dure - problèmes cutanés.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    author: "Sophie Martin",
    date: "2024-09-10",
    readingTime: "6 min",
    content: `<h2>Eau dure et peau : un lien de plus en plus documenté</h2>
<p>Si vous souffrez de peau sèche, de démangeaisons ou d'eczéma, votre eau du robinet pourrait être un facteur aggravant. Plusieurs études dermatologiques ont mis en évidence un lien entre la dureté de l'eau et la prévalence de certaines affections cutanées.</p>

<h2>Le mécanisme en cause</h2>
<p>L'eau calcaire interfère avec la peau à plusieurs niveaux :</p>
<ul>
<li><strong>Altération du film hydrolipidique :</strong> le calcium contenu dans l'eau dure se lie aux savons et crée un résidu (le « savon de calcium ») qui obstrue les pores et perturbe la barrière cutanée naturelle.</li>
<li><strong>Irritation :</strong> les dépôts calcaires sur la peau créent des micro-irritations qui amplifient les sensations de sécheresse et de tiraillement après la douche.</li>
<li><strong>Aggravation de l'eczéma :</strong> une étude publiée dans le Journal of Allergy and Clinical Immunology a montré que les enfants vivant dans des zones d'eau dure ont un risque augmenté de 54% de développer de l'eczéma atopique.</li>
</ul>

<h2>Les symptômes qui doivent vous alerter</h2>
<ul>
<li>Peau qui tire après la douche, même en utilisant des crèmes hydratantes</li>
<li>Démangeaisons sans raison apparente, surtout après le bain</li>
<li>Eczéma qui ne répond pas aux traitements habituels</li>
<li>Cheveux rêches et ternes malgré l'utilisation de soins adaptés</li>
<li>Apparition de petites taches blanches sur la peau après séchage</li>
</ul>

<h2>Solutions pour soulager votre peau</h2>
<p>Bien que l'installation d'un traitement anti-calcaire ne soit pas un traitement médical, de nombreux dermatologues recommandent aux patients vivant en eau dure de traiter leur eau. Les solutions les plus respectueuses de la peau sont les traitements physiques qui ne retirent pas les minéraux de l'eau.</p>

<blockquote><strong>Témoignage :</strong> « Depuis l'installation d'un AQUABION, les crises d'eczéma de mon fils de 6 ans ont été réduites de 80%. Notre dermatologue est convaincu du lien. » — Céline, Lyon</blockquote>`
  },
  {
    slug: "economie-energie-anti-calcaire",
    title: "Anti-calcaire et économies d'énergie : jusqu'à 25% sur votre facture",
    description: "Le calcaire est un isolant thermique qui augmente votre consommation d'énergie. Découvrez comment un traitement anti-calcaire peut réduire votre facture de 25%.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-09-05",
    readingTime: "5 min",
    content: `<h2>Le calcaire : un isolant thermique dans vos appareils</h2>
<p>Le tartre qui se dépose sur vos résistances électriques et dans votre ballon d'eau chaude agit comme un isolant thermique. Moins de 2 mm de calcaire suffisent pour réduire l'efficacité de transfert thermique de <strong>15 à 25%</strong>.</p>
<p>Concrètement, cela signifie que votre chauffe-eau, votre machine à laver et votre lave-vaisselle consomment significativement plus d'énergie pour chauffer la même quantité d'eau.</p>

<h2>Chiffres clés par appareil</h2>
<ul>
<li><strong>Chauffe-eau :</strong> 3 mm de tartre = +25% de consommation de gaz ou d'électricité</li>
<li><strong>Machine à laver :</strong> résistance entartrée = +30% d'électricité par cycle</li>
<li><strong>Lave-vaisselle :</strong> tartre sur résistance = +20% de consommation</li>
<li><strong>Chaudière (toute eau) :</strong> entartrage des échangeurs = jusqu'à +15% de consommation</li>
</ul>

<h2>Calcul des économies potentielles</h2>
<p>Pour un foyer moyen en France :</p>
<ul>
<li>Coût annuel de l'eau chaude : environ 400€</li>
<li>Surconsommation due au calcaire en eau dure (30°TH) : +20% soit 80€/an</li>
<li>Sur 8 ans : <strong>640€ d'économies potentielles</strong></li>
<li>En ajoutant la protection de l'électroménager (remplacements évités) : économies totales de <strong>1 500 à 3 000€ sur 8 ans</strong></li>
</ul>

<h2>L'anti-calcaire : un investissement rentable</h2>
<p>Un système anti-calcaire comme AQUABION®, qui ne nécessite aucun entretien et aucune consommation, se rentabilise typiquement en 2 à 3 ans grâce aux économies d'énergie et à la protection des équipements.</p>

<blockquote><strong>En résumé :</strong> L'anti-calcaire n'est pas une dépense, c'est un investissement. En éliminant les dépôts de tartre, vous réduisez votre consommation d'énergie, prolongez la durée de vie de vos appareils et améliorez votre confort quotidien.</blockquote>`
  },
  {
    slug: "guide-installation-anti-calcaire",
    title: "Installation d'un système anti-calcaire : le guide complet",
    description: "Tout savoir sur l'installation d'un anti-calcaire : où placer l'appareil, les prérequis, le choix du modèle, faire appel à un pro ou installer soi-même.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-08-28",
    readingTime: "7 min",
    content: `<h2>Avant de commencer : les prérequis</h2>
<p>L'installation d'un système anti-calcaire est une intervention simple mais qui nécessite quelques vérifications préalables :</p>
<ul>
<li><strong>Connaître la dureté de votre eau</strong> (en °TH) pour choisir le modèle adapté</li>
<li><strong>Connaître le débit d'eau</strong> de votre habitation (indiqué sur votre compteur ou facture)</li>
<li><strong>Identifier le point d'entrée d'eau</strong> après le compteur</li>
<li><strong>Vérifier l'espace disponible</strong> pour l'appareil (environ 40 cm de longueur)</li>
</ul>

<h2>Où installer l'appareil ?</h2>
<p>L'anti-calcaire doit être installé sur l'arrivée d'eau générale, juste après le compteur d'eau et avant toute dérivation. Ainsi, l'ensemble de votre installation (eau froide et eau chaude) est protégé.</p>
<p>L'emplacement idéal doit respecter ces critères :</p>
<ul>
<li>Accès facile pour une éventuelle vérification</li>
<li>Température ambiante supérieure à 4°C (protection contre le gel)</li>
<li>Espace suffisant autour de l'appareil pour la circulation de l'air</li>
</ul>

<h2>Faire appel à un professionnel ou installer soi-même ?</h2>
<p>Les systèmes anti-calcaire physiques (sans électricité) sont généralement simples à installer. Cependant, l'intervention d'un plombier professionnel est recommandée car :</p>
<ul>
<li>Il garantit une installation conforme aux normes en vigueur</li>
<li>Il peut vérifier l'état de votre réseau existant</li>
<li>Il vous fournit une attestation d'installation (utile pour la garantie)</li>
<li>L'intervention est rapide (30 à 60 minutes) et coûte entre 80 et 200€</li>
</ul>

<h2>Choisir le bon modèle</h2>
<p>Le choix du modèle dépend de votre consommation d'eau :</p>
<ul>
<li><strong>Appartement (1-2 personnes) :</strong> modèle S-15 (jusqu'à 15 m³/h)</li>
<li><strong>Maison (3-5 personnes) :</strong> modèle S-20 ou S-25</li>
<li><strong>Grande maison ou immeuble :</strong> modèle S-35 ou supérieur</li>
</ul>

<blockquote><strong>Conseil :</strong> Quel que soit le modèle choisi, privilégiez un appareil avec certification de conformité et une garantie constructeur d'au moins 5 ans. Un installateur certifié vous orientera vers le dimensionnement optimal.</blockquote>`
  },
  {
    slug: "calcaire-canalisation-risque",
    title: "Calcaire dans les canalisations : un danger silencieux pour votre plomberie",
    description: "Le calcaire bouche vos canalisations progressivement. Découvrez les risques, les signes d'alerte et les solutions pour protéger votre réseau de plomberie.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&q=80",
    author: "Marie Dupont",
    date: "2024-08-20",
    readingTime: "6 min",
    content: `<h2>Un processus lent et destructif</h2>
<p>L'accumulation de calcaire dans les canalisations est un phénomène progressif qui peut prendre 5 à 15 ans avant de provoquer les premiers symptômes visibles. Pourtant, les dégâts commencent bien avant que vous ne les remarquiez.</p>
<p>En moyenne, le calcaire réduit le diamètre intérieur des tuyaux de <strong>1 à 3 mm par décennie</strong> dans les zones d'eau très dure.</p>

<h2>Les signes qui doivent vous alerter</h2>
<ul>
<li><strong>Baisse de pression :</strong> le débit d'eau diminue progressivement, surtout aux étages supérieurs</li>
<li><strong>Bruit de canalisation :</strong> un sifflement ou un grondement lorsque vous ouvrez le robinet</li>
<li><strong>Eau tiède seulement :</strong> le calcaire obstrue partiellement le chauffe-eau ou la chaudière</li>
<li><strong>Fuites récurrentes :</strong> les joints se détériorent sous l'effet des dépôts calcaires</li>
<li><strong>Robinetts qui gouttent :</strong> le tartre empêche la fermeture complète</li>
</ul>

<h2>Les conséquences financières</h2>
<p>Le coût de réparation d'une canalisation entartrée est élevé :</p>
<ul>
<li>Détartrage chimique professionnel : 200 à 500€ par intervention</li>
<li>Remplacement de sections de tuyauterie : 500 à 2 000€</li>
<li>Détartrage de ballon d'eau chaude : 150 à 300€</li>
<li>Remplacement complet du réseau (cas extrême) : 3 000 à 10 000€</li>
</ul>

<h2>Prévenir plutôt que guérir</h2>
<p>Un traitement anti-calcaire installé sur l'arrivée d'eau protège l'ensemble du réseau. Les systèmes physiques comme AQUABION® empêchent la formation de nouveaux dépôts et peuvent même contribuer à dissoudre progressivement le tartre existant.</p>

<blockquote><strong>Important :</strong> Si vos canalisations sont déjà fortement entartrées (baisse de pression significative), un détartrage préalable par un professionnel est recommandé avant l'installation d'un système anti-calcaire pour des résultats optimaux.</blockquote>`
  },
  {
    slug: "eau-douce-eau-dure-avantages",
    title: "Eau douce vs eau dure : avantages, inconvénients et santé",
    description: "Eau douce ou eau dure : laquelle est meilleure pour la santé ? Comparaison complète des avantages et inconvénients de chaque type d'eau.",
    category: "comparatif",
    categoryLabel: "Comparatif",
    image: "https://images.unsplash.com/photo-1548839140-29a74941b49d?w=800&q=80",
    author: "Sophie Martin",
    date: "2024-08-15",
    readingTime: "6 min",
    content: `<h2>Définitions et mesures</h2>
<p>L'eau douce contient peu de calcium et de magnésium (< 15°TH), tandis que l'eau dure en est riche (> 25°TH). En France, la dureté moyenne de l'eau est d'environ 25°TH, avec de fortes variations régionales.</p>

<h2>Avantages et inconvénients de l'eau dure</h2>
<p><strong>Avantages :</strong></p>
<ul>
<li>Source naturelle de calcium et de magnésium, minéraux essentiels</li>
<li>Goût parfois perçu comme plus « minéral » et agréable</li>
<li>Aucun traitement nécessaire pour la consommation humaine</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
<li>Dépôts de calcaire dans les canalisations et appareils</li>
<li>Surconsommation de savon et de détergent (+20 à 50%)</li>
<li>Peau sèche, cheveux ternes</li>
<li>Usure prématurée de l'électroménager et de la plomberie</li>
</ul>

<h2>Avantages et inconvénients de l'eau douce</h2>
<p><strong>Avantages :</strong></p>
<ul>
<li>Moins de dépôts calcaires, plus grand confort au quotidien</li>
<li>Économies sur les produits d'entretien et de lavage</li>
<li>Meilleur état de la peau et des cheveux</li>
<li>Plus longue durée de vie des appareils</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
<li>Aucun apport minéral significatif par l'eau (l'alimentation compense)</li>
<li>Si l'eau est adoucie chimiquement, goût parfois désagréable</li>
<li>Risque de corrosion accru dans certaines canalisations en eau très douce</li>
</ul>

<h2>Le juste milieu : traiter sans déminéraliser</h2>
<p>La solution idéale est de conserver les minéraux de l'eau tout en empêchant le calcaire de se déposer. Les traitements physiques (galvanique, magnétique) transforment la structure cristalline du calcaire sans retirer les minéraux bénéfiques.</p>

<blockquote><strong>Verdict :</strong> Sur le plan de la santé, l'eau dure n'est pas nocive — elle apporte même des minéraux. C'est son effet mécanique (dépôts, usure) qui pose problème. Un traitement anti-calcaire physique offre le meilleur des deux mondes.</blockquote>`
  },
  {
    slug: "aquabion-vs-adoucisseur-classique",
    title: "Aquabion vs adoucisseur classique : comparatif détaillé 2024",
    description: "Adoucisseur à sel ou Aquabion ? Comparaison complète : fonctionnement, coût, entretien, santé, environnement. Lequel choisir pour votre maison ?",
    category: "comparatif",
    categoryLabel: "Comparatif",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-08-10",
    readingTime: "7 min",
    content: `<h2>Deux approches radicalement différentes</h2>
<p>L'adoucisseur classique et AQUABION® ont le même objectif — protéger votre installation du calcaire — mais utilisent des principes fondamentalement opposés.</p>

<h2>Critère 1 : Principe de fonctionnement</h2>
<ul>
<li><strong>Adoucisseur à sel :</strong> échange les ions calcium et magnésium contre des ions sodium par résine échangeuse d'ions. L'eau est chimiquement modifiée.</li>
<li><strong>AQUABION® :</strong> utilise le principe galvanique pour transformer la calcite en aragonite. L'eau n'est pas chimiquement modifiée.</li>
</ul>

<h2>Critère 2 : Entretien</h2>
<ul>
<li><strong>Adoucisseur :</strong> recharge en sel toutes les 4 à 6 semaines, nettoyage du bac, remplacement des résines, révision annuelle</li>
<li><strong>AQUABION® :</strong> aucun entretien, zéro consommation, fonctionnement autonome</li>
</ul>

<h2>Critère 3 : Coût sur 8 ans</h2>
<ul>
<li><strong>Adoucisseur :</strong> 2 740 à 5 880€ (achat + sel + entretien + eau gaspillée)</li>
<li><strong>AQUABION® :</strong> 600 à 1 500€ (achat unique, pas de coût récurrent)</li>
</ul>

<h2>Critère 4 : Santé</h2>
<ul>
<li><strong>Adoucisseur :</strong> augmente la teneur en sodium de l'eau, déconseillé aux personnes suivant un régime sans sel et aux nourrissons</li>
<li><strong>AQUABION® :</strong> conserve tous les minéraux naturels, sans ajout de sodium</li>
</ul>

<h2>Critère 5 : Environnement</h2>
<ul>
<li><strong>Adoucisseur :</strong> rejet de saumure polluante, gaspillage d'eau lors des régénérations</li>
<li><strong>AQUABION® :</strong> aucun rejet, zéro gaspillage, matériaux recyclables</li>
</ul>

<blockquote><strong>Conclusion :</strong> Pour les foyers soucieux de leur santé, de leur budget et de l'environnement, AQUABION® offre une alternative supérieure sur quasiment tous les critères. L'adoucisseur reste adapté aux cas où une adoucissance totale de l'eau est médicalement prescrite.</blockquote>`
  },
  {
    slug: "bienfaits-eau-sans-calcaire-sante",
    title: "Les bienfaits de l'eau sans calcaire sur votre santé au quotidien",
    description: "Une eau sans dépôts calcaires améliore votre peau, vos cheveux et votre bien-être. Découvrez les bénéfices santé d'une eau traitée contre le calcaire.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80",
    author: "Sophie Martin",
    date: "2024-08-05",
    readingTime: "5 min",
    content: `<h2>Au-delà de la plomberie : votre santé au quotidien</h2>
<p>Si l'anti-calcaire est souvent associé à la protection des installations, ses bénéfices pour la santé et le bien-être sont tout aussi significatifs. Voici les principaux bienfaits rapportés par les utilisateurs.</p>

<h2>Peau plus hydratée et plus douce</h2>
<p>Sans les résidus de calcaire qui obstruent les pores, la peau retrouve son équilibre naturel. Les utilisateurs constatent :</p>
<ul>
<li>Moins de sécheresse cutanée après la douche</li>
<li>Réduction des irritations et des démangeaisons</li>
<li>Besoin réduit en crèmes hydratantes</li>
<li>Meilleure efficacité des soins de la peau</li>
</ul>

<h2>Cheveux plus brillants et plus souples</h2>
<p>Le calcaire se dépose sur les cheveux et les rend ternes, rêches et cassants. Avec une eau sans calcaire adhérent, les cheveux retrouvent brillance et souplesse. Les shampoings moussent mieux et sont plus efficaces.</p>

<h2>Conservation des minéraux essentiels</h2>
<p>Contrairement à un adoucisseur qui retire calcium et magnésium, un traitement anti-calcaire physique préserve la composition minérale de l'eau. Vous continuez à bénéficier des apports en calcium (os, dents) et en magnésium (système nerveux, muscles).</p>

<h2>Un confort de vie global</h2>
<p>Au-delà des bénéfices mesurables, les utilisateurs décrivent un sentiment de bien-être : douches plus agréables, vaisselle plus propre, moins de temps consacré au nettoyage domestique.</p>

<blockquote><strong>Le saviez-vous ?</strong> L'Organisation Mondiale de la Santé (OMS) recommande de ne pas adoucir l'eau de boisson en dessous d'un certain seuil de minéralité. Les traitements physiques anti-calcaire respectent cette recommandation car ils ne retirent pas les minéraux.</blockquote>`
  },
  {
    slug: "proteger-machine-laver-calcaire",
    title: "Comment protéger votre machine à laver du calcaire efficacement",
    description: "Calcaire dans la machine à laver : signes, prévention et solutions. Protégez votre électroménager et prolongez sa durée de vie avec nos conseils.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    author: "Marie Dupont",
    date: "2024-07-28",
    readingTime: "5 min",
    content: `<h2>Les signes d'une machine entartrée</h2>
<p>Comment savoir si le calcaire a déjà attaqué votre machine à laver ? Voici les indices :</p>
<ul>
<li>Les textiles ressortent rigides et rêches</li>
<li>Des traces blanches apparaissent sur les vêtements foncés</li>
<li>Le tambour est recouvert d'un dépôt blancâtre</li>
<li>La machine fait plus de bruit qu'avant</li>
<li>Les cycles de lavage sont plus longs</li>
<li>Une odeur de renfermé se dégage de l'appareil</li>
</ul>

<h2>Prévention : les gestes essentiels</h2>
<ul>
<li><strong>Réglez la température :</strong> lavez à 30-40°C autant que possible — le calcaire précipite davantage à haute température</li>
<li><strong>Dosez correctement :</strong> trop de lessive crée plus de résidus qui fixent le calcaire</li>
<li><strong>Nettoyage mensuel :</strong> cycle à vide à 90°C avec 1 litre de vinaigre blanc</li>
<li><strong>Laissez le hublot ouvert :</strong> après chaque lavage pour éviter l'humidité résiduelle</li>
<li><strong>Nettoyez le joint de porte :</strong> zone de prédilection du calcaire et des moisissures</li>
</ul>

<h2>La solution radicale : traiter l'eau à la source</h2>
<p>Les produits anti-calcaire (calgon, pastilles) ne sont que des palliatifs coûteux. Ils protègent partiellement la machine mais ne résolvent pas le problème à la source. Un traitement anti-calcaire installé sur l'arrivée d'eau protège non seulement votre machine à laver, mais l'ensemble de vos appareils et canalisations.</p>

<blockquote><strong>Calcul :</strong> En France, on utilise en moyenne 35€ de produits anti-calcaire par an pour la machine à laver. Sur 8 ans, cela représente 280€ — sans compter les dégâts que le calcaire continue de causer malgré ces produits.</blockquote>`
  },
  {
    slug: "anti-calcaire-ecologique-sans-sel",
    title: "Anti-calcaire écologique : pourquoi le sans sel est l'avenir",
    description: "Les adoucisseurs à sel polluent et gaspillent l'eau. Découvrez pourquoi les solutions anti-calcaire écologiques et sans sel sont l'alternative d'avenir.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-07-20",
    readingTime: "6 min",
    content: `<h2>L'impact environnemental des adoucisseurs à sel</h2>
<p>Chaque année, les adoucisseurs d'eau à sel rejettent des milliers de tonnes de saumure dans les réseaux d'assainissement français. Ce rejet concentré en chlorure de sodium perturbe gravement le fonctionnement des stations d'épuration et la biodiversité aquatique.</p>

<h2>Les chiffres de la pollution par le sel</h2>
<ul>
<li>Un adoucisseur moyen rejette <strong>400 à 800 kg de sel par an</strong></li>
<li>La saumure augmente la toxicité des effluents pour les micro-organismes épurateurs</li>
<li>Certains cours d'eau en France dépassent déjà les seuils de salinité recommandés</li>
<li>Le sel n'est pas biodégradable et s'accumule dans les sols</li>
</ul>

<h2>Le contexte réglementaire</h2>
<p>Face à ces constats, plusieurs pays et régions ont commencé à restreindre l'utilisation des adoucisseurs à sel. En France, certaines communes imposent désormais des conditions strictes d'installation, et la tendance est à un encadrement de plus en plus strict.</p>

<h2>Les alternatives écologiques</h2>
<p>Les traitements physiques anti-calcaire représentent l'alternative la plus respectueuse de l'environnement :</p>
<ul>
<li><strong>Zéro rejet chimique :</strong> pas de sel, pas de produits chimiques, pas de saumure</li>
<li><strong>Zéro gaspillage d'eau :</strong> pas de cycle de régénération</li>
<li><strong>Zéro consommation électrique :</strong> pour les systèmes galvaniques</li>
<li><strong>Matériaux recyclables :</strong> laiton et zinc, entièrement recyclables</li>
</ul>

<blockquote><strong>Tendance :</strong> Avec la prise de conscience écologique croissante et le renforcement des normes environnementales, les solutions sans sel comme AQUABION® sont appelées à devenir le standard dans les années à venir. Préparer sa transition dès maintenant, c'est anticiper la réglementation de demain.</blockquote>`
  },
  {
    slug: "prix-eau-france-2024-hausse",
    title: "Prix de l'eau en France 2024 : hausse record et solutions concrètes",
    description: "Le prix de l'eau augmente en France en 2024. Découvrez les causes, les chiffres par région et les solutions pour réduire votre facture d'eau.",
    category: "actualite",
    categoryLabel: "Actualité",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    author: "Marie Dupont",
    date: "2024-09-15",
    readingTime: "6 min",
    content: `<h2>Une hausse sans précédent</h2>
<p>En 2024, le prix moyen de l'eau en France a atteint un niveau historique. Selon l'Observatoire des services publics de l'eau et de l'assainissement (SISPEA), la facture moyenne d'un foyer a augmenté de <strong>3 à 10% selon les communes</strong>. Cette hausse s'inscrit dans une tendance de fond amorcée depuis 2010.</p>

<h2>Les causes de cette augmentation</h2>
<ul>
<li><strong>Mise aux normes des stations d'épuration :</strong> directive européenne imposant des seuils plus stricts</li>
<li><strong>Renouvellement des infrastructures :</strong> 60% des réseaux ont plus de 30 ans</li>
<li><strong>Sécheresses récurrentes :</strong> raréfaction de la ressource et coûts de traitement accrus</li>
<li><strong>Répercussion du coût de l'énergie :</strong> le pompage et le traitement sont très énergivores</li>
</ul>

<h2>Des prix très inégaux selon les régions</h2>
<p>Le prix du mètre cube d'eau varie de 1,50€ en zone rurale à plus de 6€ dans certaines communes littorales. Les Île-de-France, la Côte d'Azur et le bassin rhodanien figurent parmi les zones les plus chères.</p>

<h2>Réduire sa consommation : des solutions immédiates</h2>
<ul>
<li>Installer des réducteurs de débit sur les robinets et pommeaux de douche</li>
<li>Réparer les fuites (une fuite goutte-à-goutte = 4 000 litres/an gaspillés)</li>
<li>Opter pour une chaudière ou un chauffe-eau haute performance</li>
<li>Installer un traitement anti-calcaire pour réduire la surconsommation énergétique liée au tartre</li>
</ul>

<blockquote><strong>Le saviez-vous ?</strong> En réduisant les dépôts de calcaire dans votre chauffe-eau, vous pouvez économiser jusqu'à 25% sur la partie énergétique de votre facture d'eau chaude. C'est une mesure simple avec un impact durable sur votre budget.</blockquote>`
  },
  {
    slug: "secheresse-2024-qualite-eau-france",
    title: "Sécheresse 2024 : impact sur la qualité de l'eau en France",
    description: "Les sécheresses successives modifient la qualité de l'eau potable en France. Concentration en calcaire, nitrates, pesticides : comprendre les risques.",
    category: "actualite",
    categoryLabel: "Actualité",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-08-20",
    readingTime: "6 min",
    content: `<h2>Un été de plus en plus sec</h2>
<p>L'année 2024 confirme la tendance à la sécheresse en France. Après les épisodes critiques de 2022 et 2023, les nappes phréatiques peinent à se reconstituer. En conséquence, la qualité de l'eau distribuée se dégrade dans de nombreuses régions.</p>

<h2>Des nappes plus concentrées en minéraux</h2>
<p>Lorsque le niveau des nappes baisse, les minéraux dissous — dont le calcium et le magnésium — se concentrent. Résultat : la dureté de l'eau augmente dans les zones concernées. Les départements du Sud-Ouest, de la Provence et du Centre-Val de Loire sont particulièrement touchés.</p>

<h2>Autres conséquences sur la qualité de l'eau</h2>
<ul>
<li><strong>Montée des nitrates :</strong> les pollutions agricoles sont moins diluées</li>
<li><strong>Pesticides :</strong> concentration accrue dans les cours d'eau et nappes</li>
<li><strong>Algues toxiques :</strong> prolifération dans les eaux de surface</li>
<li><strong>Restrictions d'usage :</strong> arrosage, remplissage de piscines limités</li>
</ul>

<h2>Protéger ses installations en période de sécheresse</h2>
<p>L'augmentation de la dureté de l'eau en période de sécheresse accélère la formation de calcaire dans vos canalisations. C'est précisément dans ces périodes que l'installation d'un traitement anti-calcaire prend tout son sens — elle protège votre installation face à une eau de plus en plus agressive.</p>

<blockquote><strong>Avertissement :</strong> Selon Météo France, la tendance au réchauffement climatique va accentuer les épisodes de sécheresse dans les années à venir. Protéger son installation n'est plus un luxe mais une nécessité.</blockquote>`
  },
  {
    slug: "aides-renovation-energetique-2024",
    title: "Aides rénovation énergétique 2024 : le rôle sous-estimé du calcaire",
    description: "MaPrimeRénov', CEE, éco-PTZ... Découvrez comment le traitement du calcaire peut compléter vos travaux de rénovation énergétique et améliorer vos résultats.",
    category: "actualite",
    categoryLabel: "Actualité",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-07-10",
    readingTime: "5 min",
    content: `<h2>Le calcaire, facteur de gaspillage énergétique ignoré</h2>
<p>En 2024, le gouvernement français maintient et renforce ses dispositifs d'aide à la rénovation énergétique (MaPrimeRénov', CEE, éco-PTZ). Pourtant, un facteur majeur de gaspillage énergétique reste largement ignoré : le calcaire.</p>

<h2>Le lien calcaire – performance énergétique</h2>
<p>Le calcaire qui s'accumule dans votre ballon d'eau chaude, votre chaudière et vos radiateurs agit comme un isolant thermique. Cela signifie que votre installation, même neuve et performante, perd une partie significative de son rendement :</p>
<ul>
<li>Chauffe-eau entartré : perte de rendement de 15 à 25%</li>
<li>Chaudière avec échangeur entartré : surconsommation de 10 à 15%</li>
<li>Radiateurs obstrués : perte de diffusion thermique de 20%</li>
</ul>

<h2>Optimiser vos travaux de rénovation</h2>
<p>Avant d'investir dans une nouvelle chaudière ou un nouveau chauffe-eau, il est essentiel de s'assurer que votre réseau d'eau est propre. Un chauffe-eau haute performance installé dans un réseau entartré ne donnera jamais son rendement optimal.</p>

<h2>Le traitement anti-calcaire comme investissement complémentaire</h2>
<p>Installer un traitement anti-calcaire en même temps que vos travaux de rénovation énergétique, c'est garantir la performance de vos nouveaux équipements sur le long terme. C'est un investissement complémentaire qui protège votre investissement principal.</p>

<blockquote><strong>Conseil pratique :</strong> Lors de votre bilan thermique, demandez à votre diagnostiqueur d'évaluer l'état de votre réseau d'eau. Un réseau entartré peut annuler jusqu'à 20% des gains attendus d'une nouvelle installation de chauffage.</blockquote>`
  },
  {
    slug: "normes-traitement-eau-france",
    title: "Normes et réglementation du traitement de l'eau en France en 2024",
    description: "Quelles sont les normes applicables au traitement de l'eau en France ? ACS, NF, réglementation européenne : guide complet de la conformité.",
    category: "actualite",
    categoryLabel: "Actualité",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    author: "Équipe AQUABION",
    date: "2024-06-25",
    readingTime: "7 min",
    content: `<h2>Le cadre réglementaire français</h2>
<p>En France, le traitement de l'eau potable et des eaux destinées à la consommation humaine est strictement encadré. Voici les principales normes et réglementations à connaître en 2024.</p>

<h2>La certification ACS : obligatoire</h2>
<p>Tout matériel en contact avec l'eau destinée à la consommation humaine doit être certifié <strong>ACS (Attestation de Conformité Sanitaire)</strong>. Cette certification garantit que le matériel ne relargue pas de substances nocives dans l'eau.</p>
<ul>
<li>Délivrée par des laboratoires agréés par le ministère de la Santé</li>
<li>Valable pour une durée de 5 ans</li>
<li>Exige des tests de migration sur les matériaux en contact avec l'eau</li>
</ul>

<h2>La norme NF EN 14743</h2>
<p>Cette norme européenne spécifie les exigences de performance pour les dispositifs de traitement physico-chimique de l'eau. Elle définit les tests d'efficacité anti-calcaire que doivent passer les appareils.</p>

<h2>Le Code de la santé publique</h2>
<p>L'article L.1321-1 du Code de la santé publique définit les eaux destinées à la consommation humaine et encadre les traitements autorisés. Les fabricants doivent respecter les limites de concentrations en substances chimiques.</p>

<h2>Que vérifier avant d'acheter ?</h2>
<ul>
<li>Certification ACS en cours de validité</li>
<li>Marquage CE conforme</li>
<li>Conformité aux normes NF applicables</li>
<li>Garantie constructeur d'au moins 5 ans</li>
<li>Attestation de conformité de l'installateur</li>
</ul>

<blockquote><strong>Attention :</strong> Les systèmes anti-calcaire importés de pays hors UE ne sont pas toujours conformes aux normes françaises. Vérifiez toujours la présence du marquage CE et de la certification ACS avant tout achat.</blockquote>`
  },
  {
    slug: "eau-potable-france-traitements-autorises",
    title: "Eau potable en France : quels traitements sont réellement autorisés ?",
    description: "Quels traitements de l'eau sont autorisés en France pour la consommation humaine ? Focus sur la réglementation, les additifs et vos droits de consommateur.",
    category: "actualite",
    categoryLabel: "Actualité",
    image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
    author: "Sophie Martin",
    date: "2024-10-05",
    readingTime: "6 min",
    content: `<h2>L'eau du robinet : la plus contrôlée de France</h2>
<p>L'eau potable distribuée en France est l'un des aliments les plus contrôlés au monde. Plus de 50 paramètres sont analysés régulièrement (bactériologie, physico-chimie, pesticides, métaux lourds). Pourtant, cette eau peut subir des traitements avant d'arriver à votre robinet.</p>

<h2>Les traitements autorisés par les distributeurs</h2>
<p>Les traitements appliqués par les services des eaux sont strictement réglementés :</p>
<ul>
<li><strong>Chloration :</strong> désinfection obligatoire, dose maximale réglementée</li>
<li><strong>Filtration :</strong> sur sable, charbon actif, membranes</li>
<li><strong>Correction de pH :</strong> pour la protection des canalisations</li>
<li><strong>Fluoration :</strong> autorisée mais non obligatoire, de plus en plus rare</li>
</ul>

<h2>Les traitements individuels : ce que vous avez le droit d'installer</h2>
<p>Vous pouvez installer un traitement complémentaire chez vous, à condition que l'appareil soit certifié ACS :</p>
<ul>
<li><strong>Filtres à charbon actif :</strong> pour améliorer le goût</li>
<li><strong>Adoucisseurs à sel :</strong> autorisés mais déconseillés pour l'eau de boisson</li>
<li><strong>Anti-calcaire physiques :</strong> galvanique, magnétique, électromagnétique</li>
<li><strong>Osmoseurs :</strong> filtration très fine, nécessite un rejet d'eau</li>
</ul>

<h2>Vos droits en tant que consommateur</h2>
<ul>
<li>Droit d'accès aux résultats d'analyse de votre eau (site du ministère de la Santé)</li>
<li>Droit à une eau conforme aux limites de qualité réglementaires</li>
<li>Droit d'être informé en cas de non-conformité</li>
<li>Droit de contester la facture si l'eau ne répond pas aux normes</li>
</ul>

<blockquote><strong>Bon à savoir :</strong> Si votre eau du robinet est conforme aux normes mais très calcaire (>30°TH), un traitement anti-calcaire vous est parfaitement accessible et ne modifie pas la potabilité de l'eau. Vérifiez simplement que l'appareil porte la certification ACS.</blockquote>`
  },
  {
    slug: "calcaire-chaudiere-enemie-silencieuse",
    title: "Calcaire et chaudière : l'ennemi silencieux qui vous coûte cher",
    description: "Le calcaire encrasse votre chaudière et réduit son rendement. Découvrez les impacts, les coûts et comment protéger votre installation de chauffage.",
    category: "guide",
    categoryLabel: "Guide",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80",
    author: "Thomas Laurent",
    date: "2024-09-01",
    readingTime: "5 min",
    content: `<h2>Votre chaudière sous emprise</h2>
<p>La chaudière est le cœur de votre installation de chauffage et d'eau chaude. C'est aussi l'un des appareils les plus vulnérables au calcaire. L'eau qui la traverse en permanence y dépose des cristaux de carbonate de calcium qui s'accumulent au fil des mois et des années.</p>

<h2>Les impacts mesurables du calcaire sur une chaudière</h2>
<ul>
<li><strong>Rendement réduit :</strong> 1 mm de tartre = perte de rendement de 7 à 8%</li>
<li><strong>Surconsommation de gaz ou d'électricité :</strong> jusqu'à +15% pour un encrassement significatif</li>
<li><strong>Usure accélérée :</strong> les pièces mécaniques (pompe, vanne 3 voies) se grippent</li>
<li><strong>Pannes plus fréquentes :</strong> le calcaire obstrue les circuits et les capteurs</li>
<li><strong>Remplacement prématuré :</strong> une chaudière entartrée dure 5 à 8 ans au lieu de 15 à 20 ans</li>
</ul>

<h2>Coûts engendrés</h2>
<p>Une chaudière qui consomme 15% de plus en gaz, c'est environ <strong>150 à 250€ par an de gaspillage</strong>. En ajoutant les réparations (200 à 500€ par intervention) et le remplacement anticipé, le coût total du calcaire sur votre chaudière peut atteindre <strong>3 000 à 8 000€</strong> sur sa durée de vie.</p>

<h2>Prévention et protection</h2>
<p>Un détartrage annuel par un professionnel (80 à 200€) est la base. Mais pour une protection continue, l'installation d'un traitement anti-calcaire sur l'arrivée d'eau est la solution la plus efficace. Les systèmes physiques comme AQUABION® empêchent la formation de tartre dans l'ensemble du circuit, y compris la chaudière.</p>

<blockquote><strong>Conseil :</strong> Si vous envisagez le remplacement de votre chaudière, installez un traitement anti-calcaire en même temps. Votre nouvelle chaudière conservera son rendement optimal pendant toute sa durée de vie.</blockquote>`
  },
  {
    slug: "debit-eau-calcaire-pression",
    title: "Débit d'eau et calcaire : comment restaurer la pression chez vous",
    description: "Baisse de pression d'eau ? Le calcaire pourrait en être la cause. Comprendre le lien calcaire-pression et les solutions pour retrouver un débit normal.",
    category: "conseil",
    categoryLabel: "Conseil",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    author: "Marie Dupont",
    date: "2024-08-10",
    readingTime: "5 min",
    content: `<h2>Quand le calcaire étrangle vos canalisations</h2>
<p>Une baisse progressive du débit d'eau est l'un des symptômes les plus courants de l'entartrage des canalisations. Au fil des années, le calcaire se dépose sur les parois internes des tuyaux, réduisant progressivement leur diamètre utile.</p>

<h2>Le calcul implacable</h2>
<p>La réduction de débit suit une loi mathématique : si le diamètre intérieur d'un tuyau de 20 mm est réduit de 3 mm par le calcaire, la section d'écoulement diminue de <strong>27%</strong>. Pour un tuyau réduit de 5 mm, la perte de section atteint <strong>40%</strong>.</p>
<p>C'est suffisant pour transformer une douche agréable en un filet d'eau frustrant.</p>

<h2>Diagnostic : calcaire ou autre cause ?</h2>
<p>Avant de conclure au calcaire, vérifiez d'autres causes possibles :</p>
<ul>
<li>Fuite sur le réseau (vérifiez votre compteur)</li>
<li>Robinet thermostatique en fin de vie</li>
<li>Pression d'arrivée insuffisante (contactez votre fournisseur)</li>
<li>Filtre d'arrivée colmaté</li>
</ul>

<h2>Solutions pour restaurer le débit</h2>
<ul>
<li><strong>Détartrage chimique :</strong> efficace mais temporaire (200 à 500€)</li>
<li><strong>Remplacement des sections entartrées :</strong> solution radicale mais coûteuse</li>
<li><strong>Hydrocurage :</strong> nettoyage par jet d'eau haute pression (professionnel)</li>
<li><strong>Traitement anti-calcaire :</strong> prévention des nouveaux dépôts, dissolution lente du tartre existant</li>
</ul>

<blockquote><strong>Prévention :</strong> L'installation d'un anti-calcaire empêche la formation de nouveaux dépôts et peut contribuer à la dissolution progressive du tartre existant. C'est un investissement qui se rentabilise en avoided réfections de plomberie.</blockquote>`
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category?: string, limit = 3): Article[] {
  const sameCategory = articles.filter(a => a.slug !== currentSlug && a.category === (category || articles.find(ar => ar.slug === currentSlug)?.category));
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = articles.filter(a => a.slug !== currentSlug && !sameCategory.includes(a));
  return [...sameCategory, ...others].slice(0, limit);
}

export function getArticlesByCategory(category: string | null): Article[] {
  if (!category) return articles;
  return articles.filter(a => a.category === category);
}
