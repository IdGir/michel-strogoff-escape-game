// ============================================================
// DONNÉES DU JEU - MICHEL STROGOFF ESCAPE GAME
// ============================================================

export interface Niveau {
  id: string;
  nom: string;
  description: string;
  icon: string;
  color: string;
  pointsMultiplier: number;
  tempsBonus: number; // secondes supplémentaires
}

export interface Indice {
  id: string;
  texte: string;
  cout: number; // points perdus
  categorie: 'lecon' | 'observation' | 'deduction';
}

export interface Enigme {
  id: string;
  chapitre: number;
  titre: string;
  description: string;
  type: 'qcm' | 'texte' | 'glisser' | 'code' | 'association' | 'observation' | 'vrai-faux' | 'calcul';
  question: string;
  contexte: string; // lien avec l'histoire de Michel Strogoff
  options?: string[];
  reponse: string | string[] | number;
  reponsesPossibles?: string[]; // pour les questions à plusieurs réponses valides
  explication: string;
  lecon: string; // référence à la leçon à consulter
  matiere: 'histoire' | 'geographie' | 'sciences';
  points: number;
  indices: Indice[];
  bonusLecon: number; // points bonus si l'élève consulte sa leçon
  penaliteErreur: number;
  tempsLimite: number; // en secondes
  image?: string;
}

export interface Chapitre {
  id: number;
  titre: string;
  description: string;
  lieu: string;
  ambiance: string;
  couleurFond: string;
  transition: string;
  enigmes: string[]; // IDs des énigmes
}

// ============================================================
// NIVEAUX DE DIFFICULTÉ (noms thématiques)
// ============================================================
export const NIVEAUX: Niveau[] = [
  {
    id: 'apprenti',
    nom: 'Apprenti Courrier',
    description: 'Tu débutes ton voyage. Les épreuves sont accessibles.',
    icon: '🌟',
    color: 'from-green-600 to-green-800',
    pointsMultiplier: 1,
    tempsBonus: 30,
  },
  {
    id: 'eclaireur',
    nom: 'Éclaireur de la Steppe',
    description: 'Tu connais déjà les routes. Les défis sont plus corsés.',
    icon: '🐎',
    color: 'from-blue-600 to-blue-800',
    pointsMultiplier: 1.3,
    tempsBonus: 15,
  },
  {
    id: 'capitaine',
    nom: "Capitaine de l'Oural",
    description: 'Seuls les plus aguerris atteignent ce rang.',
    icon: '⚔️',
    color: 'from-purple-600 to-purple-800',
    pointsMultiplier: 1.6,
    tempsBonus: 0,
  },
  {
    id: 'messager',
    nom: 'Messager du Tsar',
    description: 'Tu portes le sceau impérial. Aucune erreur permise.',
    icon: '📜',
    color: 'from-red-600 to-red-800',
    pointsMultiplier: 2,
    tempsBonus: -15,
  },
  {
    id: 'heros',
    nom: "Héros de l'Empire",
    description: 'Le rang suprême. Seuls les génies y parviennent.',
    icon: '👑',
    color: 'from-yellow-600 to-amber-800',
    pointsMultiplier: 2.5,
    tempsBonus: -30,
  },
];

// ============================================================
// CHAPITRES (étapes du voyage)
// ============================================================
export const CHAPITRES: Chapitre[] = [
  {
    id: 1,
    titre: 'Le Départ de Moscou',
    description: "Le palais du Tsar est en effervescence. Michel Strogoff reçoit sa mission : traverser la Sibérie pour porter un message au grand-duc d'Irkoutsk. Mais d'abord, il faut préparer le voyage...",
    lieu: 'Moscou, Russie',
    ambiance: 'Palais impérial, bougies, cartes géographiques',
    couleurFond: 'from-amber-900 via-red-900 to-amber-950',
    transition: "Le traîneau s'éloigne dans la neige...",
    enigmes: ['ch1_e1', 'ch1_e2', 'ch1_e3', 'ch1_e4'],
  },
  {
    id: 2,
    titre: 'La Traversée de l\'Oural',
    description: "Les montagnes de l'Oural se dressent devant Michel. Il faut comprendre ces terres pour les traverser. Les sciences naturelles seront ses alliées...",
    lieu: 'Montagnes de l\'Oural',
    ambiance: 'Montagnes enneigées, forêts de conifères, vent glacial',
    couleurFond: 'from-slate-800 via-blue-900 to-slate-900',
    transition: "Le vent hurle à travers les cols...",
    enigmes: ['ch2_e1', 'ch2_e2', 'ch2_e3', 'ch2_e4'],
  },
  {
    id: 3,
    titre: 'Les Steppes de Sibérie',
    description: "L'immensité des steppes s'offre à Michel. Des peuples y ont vécu, des empires s'y sont formés. L'histoire résonne dans chaque colline...",
    lieu: 'Steppes de Sibérie',
    ambiance: 'Plaines infinies, yourtes, ciel étoilé',
    couleurFond: 'from-yellow-900 via-orange-900 to-yellow-950',
    transition: "Les chevaux galopent vers l'est...",
    enigmes: ['ch3_e1', 'ch3_e2', 'ch3_e3', 'ch3_e4'],
  },
  {
    id: 4,
    titre: 'Le Lac Baïkal',
    description: "Le plus profond lac du monde apparaît. Ses eaux recèlent des mystères scientifiques. Michel doit les comprendre pour trouver son chemin...",
    lieu: 'Lac Baïkal, Sibérie',
    ambiance: 'Lac gelé, aurores boréales, glace cristalline',
    couleurFond: 'from-cyan-900 via-blue-900 to-indigo-950',
    transition: "La glace craque sous les sabots...",
    enigmes: ['ch4_e1', 'ch4_e2', 'ch4_e3', 'ch4_e4'],
  },
  {
    id: 5,
    titre: "Irkoutsk - La Mission Accomplie",
    description: "Enfin ! Les remparts d'Irkoutsk se profilent. Mais avant de remettre le message, Michel doit encore prouver sa valeur. L'histoire de France et de l'Europe sera sa dernière épreuve...",
    lieu: 'Irkoutsk, Sibérie',
    ambiance: 'Ville fortifiée, torches, ambiance de siège',
    couleurFond: 'from-red-950 via-purple-900 to-red-900',
    transition: "Les portes de la ville s'ouvrent...",
    enigmes: ['ch5_e1', 'ch5_e2', 'ch5_e3', 'ch5_e4'],
  },
];

// ============================================================
// ÉNIGMES COMPLÈTES
// ============================================================
export const ENIGMES: Enigme[] = [
  // ==================== CHAPITRE 1 : MOSCOU (Géographie - Europe) ====================
  {
    id: 'ch1_e1',
    chapitre: 1,
    titre: 'La Carte du Voyage',
    description: "Michel doit étudier la carte de l'Europe pour planifier son itinéraire vers la Sibérie.",
    type: 'qcm',
    question: "Quelle est la capitale de la Russie, point de départ de Michel Strogoff ?",
    contexte: "Le Tsar Alexandre II règne depuis son palais du Kremlin. Michel Strogoff est convoqué pour une mission secrète.",
    options: ['Saint-Pétersbourg', 'Moscou', 'Kiev', 'Irkoutsk'],
    reponse: 'Moscou',
    explication: "Moscou est la capitale de la Russie. C'est depuis le Kremlin de Moscou que le Tsar envoie Michel Strogoff en mission.",
    lecon: 'Géographie - Les capitales européennes',
    matiere: 'geographie',
    points: 100,
    indices: [
      { id: 'i1', texte: "Cherche dans ta leçon sur les pays d'Europe la capitale de la Russie.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le mot commence par M et c'est aussi le nom d'un célèbre théâtre.", cout: 20, categorie: 'deduction' },
      { id: 'i3', texte: "C'est là que se trouve le Kremlin.", cout: 30, categorie: 'observation' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch1_e2',
    chapitre: 1,
    titre: 'Les Frontières de l\'Empire',
    description: "Michel doit identifier les pays qu'il traversera.",
    type: 'association',
    question: "Associe chaque pays à son continent. Michel traverse l'Europe puis l'Asie.",
    contexte: "Sur la carte du palais, Michel trace son itinéraire. Il doit connaître les continents.",
    options: ['France', 'Russie', 'Chine', 'Brésil', 'Égypte', 'Japon'],
    reponse: 'Europe:France,Russie;Asie:Chine,Japon;Afrique:Égypte;Amérique:Brésil',
    explication: "La France et la Russie sont en Europe. La Chine et le Japon sont en Asie. L'Égypte est en Afrique. Le Brésil est en Amérique.",
    lecon: 'Géographie - Les continents et océans',
    matiere: 'geographie',
    points: 150,
    indices: [
      { id: 'i1', texte: "Il y a 5 continents (ou 6 selon les classifications). Consulte ta leçon.", cout: 15, categorie: 'lecon' },
      { id: 'i2', texte: "La Russie est le plus grand pays du monde, à cheval sur deux continents.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 20,
    tempsLimite: 90,
  },
  {
    id: 'ch1_e3',
    chapitre: 1,
    titre: 'Le Climat de la Steppe',
    description: "Michel prépare ses affaires en fonction du climat qu'il va rencontrer.",
    type: 'qcm',
    question: "Quel type de climat Michel va-t-il rencontrer en traversant la Sibérie ?",
    contexte: "Le général Kissoff remet à Michel ses provisions. Il doit prévoir les conditions extrêmes.",
    options: ['Tropical humide', 'Tempéré océanique', 'Continual extrême', 'Méditerranéen'],
    reponse: 'Continental extrême',
    explication: "La Sibérie a un climat continental extrême : des étés courts et chauds, des hivers très longs et très froids (jusqu'à -50°C).",
    lecon: 'Géographie - Les climats du monde',
    matiere: 'geographie',
    points: 100,
    indices: [
      { id: 'i1', texte: "En Sibérie, les températures descendent très bas en hiver. Quel climat a des écarts de température extrêmes ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce climat se trouve au centre des grands continents, loin des océans qui adoucissent les températures.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch1_e4',
    chapitre: 1,
    titre: 'Les Directions',
    description: "Michel doit s'orienter pour partir vers l'Est.",
    type: 'vrai-faux',
    question: "Le Soleil se lève à l'Est et se couche à l'Ouest. Michel Strogoff part donc vers le lever du Soleil.",
    contexte: "Au petit matin, Michel regarde le Soleil se lever pour déterminer sa direction.",
    reponse: 'Vrai',
    explication: "Le Soleil se lève toujours à l'Est (orient) et se couche à l'Ouest (occident). Michel part vers l'Est, vers la Sibérie.",
    lecon: 'Géographie - S\'orienter et se repérer',
    matiere: 'geographie',
    points: 80,
    indices: [
      { id: 'i1', texte: "Observe par où le Soleil apparaît chaque matin dans ta leçon sur l'orientation.", cout: 10, categorie: 'observation' },
    ],
    bonusLecon: 20,
    penaliteErreur: 10,
    tempsLimite: 45,
  },

  // ==================== CHAPITRE 2 : OURAL (Sciences - Matière, Montagnes) ====================
  {
    id: 'ch2_e1',
    chapitre: 2,
    titre: 'Les États de l\'Eau',
    description: "L'eau gèle dans le froid sibérien. Michel doit comprendre ce phénomène.",
    type: 'qcm',
    question: "À quelle température l'eau passe-t-elle de l'état liquide à l'état solide (gel) ?",
    contexte: "La gourde de Michel gèle pendant la nuit. Il se souvient de ses leçons sur les changements d'état de l'eau.",
    options: ['-10°C', '0°C', '10°C', '100°C'],
    reponse: '0°C',
    explication: "L'eau gèle (solidification) à 0°C et bout (vaporisation/ébullition) à 100°C. C'est la solidification : passage de l'état liquide à l'état solide.",
    lecon: 'Sciences - Les états de l\'eau et changements d\'état',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur les changements d'état de l'eau. La solidification se fait à une température précise.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "C'est la température où les glaçons se forment dans ton congélateur... ou presque !", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch2_e2',
    chapitre: 2,
    titre: 'Le Cycle de l\'Eau',
    description: "Michel observe la neige, la glace, le brouillard... Tout est lié au cycle de l'eau.",
    type: 'texte',
    question: "Complète le cycle de l'eau : L'eau des rivières s'évapore sous l'effet du soleil, forme des ______, puis retombe en ______.",
    contexte: "Michel observe le brouillard matinal sur la rivière. L'eau semble disparaître puis revenir.",
    reponse: 'nuages,pluie,neige,précipitations',
    reponsesPossibles: ['nuages', 'pluie', 'neige', 'précipitations'],
    explication: "Le cycle de l'eau : évaporation → formation de nuages (condensation) → précipitations (pluie, neige, grêle) → ruissellement vers les rivières → évaporation...",
    lecon: 'Sciences - Le cycle de l\'eau dans la nature',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "Quand l'eau s'évapore et monte dans le ciel, que forme-t-elle ? Consulte ta leçon.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le premier mot est ce que tu vois dans le ciel gris. Le second est ce qui tombe quand il pleut.", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },
  {
    id: 'ch2_e3',
    chapitre: 2,
    titre: 'Les Roches de l\'Oural',
    description: "Les montagnes de l'Oural sont composées de différentes roches. Michel doit les identifier.",
    type: 'qcm',
    question: "Les montagnes comme l'Oural sont formées par le rapprochement de quelles grandes structures de la Terre ?",
    contexte: "Michel escalade un passage difficile. Les parois rocheuses lui semblent très anciennes.",
    options: ["Les plaques tectoniques", "Les volcans", "Les rivières", "Le vent"],
    reponse: 'Les plaques tectoniques',
    explication: "Les montagnes se forment par le rapprochement et la collision des plaques tectoniques (de la croûte terrestre). L'Oural est une très ancienne chaîne de montagnes formée il y a des centaines de millions d'années.",
    lecon: 'Sciences - La Terre, les roches et les volcans',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "La surface de la Terre est comme un puzzle géant. Consulte ta leçon sur les volcans et séismes.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce sont des morceaux de la croûte terrestre qui bougent très lentement.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },
  {
    id: 'ch2_e4',
    chapitre: 2,
    titre: 'L\'Énergie du Froid',
    description: "Michel doit se chauffer. Il comprend les sources d'énergie.",
    type: 'qcm',
    question: "Quelle est la source d'énergie principale utilisée pour se chauffer dans la Russie du XIXe siècle ?",
    contexte: "Michel allume un feu de bois pour se réchauffer. Il se demande quelles autres énergies existent.",
    options: ['L\'électricité', 'Le bois (biomasse)', 'Le pétrole', 'Le charbon uniquement'],
    reponse: 'Le bois (biomasse)',
    explication: "Au XIXe siècle en Russie, le bois était la principale source d'énergie pour se chauffer. C'est une énergie renouvelable (biomasse). Le charbon commençait à être utilisé mais surtout dans les villes et l'industrie.",
    lecon: 'Sciences - Les sources d\'énergie et l\'énergie dans la vie quotidienne',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Michel est en pleine nature, en 1860. Quelle énergie est la plus accessible en forêt ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Regarde ce que Michel allume dans l'histoire !", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },

  // ==================== CHAPITRE 3 : STEPPES (Histoire - Empires, Civilisations) ====================
  {
    id: 'ch3_e1',
    chapitre: 3,
    titre: 'Les Grands Empires',
    description: "Michel traverse des terres qui furent le domaine de grands empires.",
    type: 'qcm',
    question: "Quel empire a régné sur la Russie au moment du voyage de Michel Strogoff (1860) ?",
    contexte: "Michel passe devant un ancien monastère. Il pense à la grandeur de l'Empire russe.",
    options: ['La République', "L'Empire romain", "L'Empire russe (Tsarat)", "L'Empire ottoman"],
    reponse: "L'Empire russe (Tsarat)",
    explication: "En 1860, la Russie est un empire dirigé par le Tsar Alexandre II. C'est une monarchie (un empereur/roi gouverne). Le Tsar est le souverain absolu de la Russie.",
    lecon: 'Histoire - Le XIXe siècle en Europe',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le Tsar est le souverain de la Russie. Consulte ta leçon sur le XIXe siècle.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le livre a été écrit par Jules Verne en 1876. La Russie était gouvernée par un empereur.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch3_e2',
    chapitre: 3,
    titre: 'La Révolution Française',
    description: "Michel pense à la France et à son histoire mouvementée.",
    type: 'vrai-faux',
    question: "La Révolution française de 1789 a mis fin à la monarchie absolue en France et a inspiré les peuples d'Europe, y compris les Russes.",
    contexte: "Michel se souvient des récits de son père sur la France et ses révolutions qui ont changé l'Europe.",
    reponse: 'Vrai',
    explication: "La Révolution française (1789) a renversé la monarchie absolue de Louis XVI. Elle a proclamé la Déclaration des droits de l'homme et du citoyen. Ses idées de liberté et d'égalité se sont diffusées dans toute l'Europe.",
    lecon: 'Histoire - La Révolution française',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "En quelle année a eu lieu la prise de la Bastille ? Consulte ta leçon.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "La devise de la France est : Liberté, Égalité, ...", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch3_e3',
    chapitre: 3,
    titre: 'Napoléon et la Russie',
    description: "Michel se souvient que Napoléon a tenté d'envahir la Russie.",
    type: 'qcm',
    question: "En quelle année Napoléon a-t-il envahi la Russie, menant à la désastreuse retraite de Moscou ?",
    contexte: "Les steppes portent encore les cicatrices de la Grande Armée. Michel voit des vestiges de 1812.",
    options: ['1789', '1812', '1815', '1848'],
    reponse: '1812',
    explication: "Napoléon a envahi la Russie en 1812. Sa Grande Armée de 600 000 hommes a été décimée par le froid et la stratégie russe de la terre brûlée. C'est un tournant majeur des guerres napoléoniennes.",
    lecon: 'Histoire - Napoléon Bonaparte et l\'Empire',
    matiere: 'histoire',
    points: 120,
    indices: [
      { id: 'i1', texte: "C'est entre la Révolution (1789) et Waterloo (1815). Consulte ta leçon sur Napoléon.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "L'année se termine par 12. C'est aussi le titre d'un célèbre roman de Tolstoï.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch3_e4',
    chapitre: 3,
    titre: 'Les Peuples Nomades',
    description: "Michel rencontre des peuples nomades des steppes.",
    type: 'qcm',
    question: "Quel est le mode de vie des peuples nomades des steppes que Michel rencontre ?",
    contexte: "Michel croise une caravane de nomades avec leurs troupeaux et leurs yourtes démontables.",
    options: [
      "Ils vivent dans des villes fortifiées",
      "Ils se déplacent avec leurs troupeaux selon les saisons",
      "Ils sont tous agriculteurs sédentaires",
      "Ils vivent uniquement sur les côtes"
    ],
    reponse: "Ils se déplacent avec leurs troupeaux selon les saisons",
    explication: "Les peuples nomades des steppes (comme les Mongols, les Kazakhs) pratiquent l'élevage pastoral. Ils se déplacent avec leurs troupeaux (chevaux, moutons, chameaux) selon les saisons pour trouver des pâturages. Ils vivent dans des yourtes démontables.",
    lecon: 'Histoire - Les sociétés et les échanges',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le mot 'nomade' vient du grec 'nomas' qui signifie 'qui erre'. Consulte ta leçon.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le contraire de sédentaire. Ils n'ont pas de maison fixe.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },

  // ==================== CHAPITRE 4 : BAÏKAL (Sciences - Écosystèmes, Corps humain) ====================
  {
    id: 'ch4_e1',
    chapitre: 4,
    titre: 'L\'Écosystème du Lac',
    description: "Le lac Baïkal est un écosystème unique au monde.",
    type: 'qcm',
    question: "Qu'est-ce qu'un écosystème ?",
    contexte: "Michel observe les animaux et les plantes autour du lac. Tout semble connecté.",
    options: [
      "Un groupe d'animaux identiques",
      "Un milieu et l'ensemble des êtres vivants qui y vivent et interagissent",
      "Un jardin botanique",
      "Un lac très profond"
    ],
    reponse: "Un milieu et l'ensemble des êtres vivants qui y vivent et interagissent",
    explication: "Un écosystème est un ensemble formé par un milieu de vie (biotope) et tous les êtres vivants (biocénose) qui y habitent et interagissent entre eux. Le lac Baïkal abrite plus de 1500 espèces uniques !",
    lecon: 'Sciences - Les écosystèmes et la biodiversité',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Éco = maison, système = ensemble. C'est la 'maison' de tous les êtres vivants d'un milieu.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Pense à la chaîne alimentaire : plantes → herbivores → carnivores. Tout est lié !", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch4_e2',
    chapitre: 4,
    titre: 'Le Corps Humain et le Froid',
    description: "Michel doit comprendre comment son corps réagit au froid extrême.",
    type: 'qcm',
    question: "Quelle est la température normale du corps humain ?",
    contexte: "Michel sent le froid engourdir ses membres. Il doit maintenir sa chaleur corporelle.",
    options: ['35°C', '37°C', '39°C', '41°C'],
    reponse: '37°C',
    explication: "La température normale du corps humain est d'environ 37°C. En dessous de 35°C, on parle d'hypothermie. Le corps produit de la chaleur grâce au métabolisme et aux muscles (frissons).",
    lecon: 'Sciences - Le corps humain et la santé',
    matiere: 'sciences',
    points: 80,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur le corps humain. C'est une température que tu connais !", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "C'est la température qu'on mesure avec un thermomètre quand on n'est pas malade.", cout: 15, categorie: 'observation' },
    ],
    bonusLecon: 20,
    penaliteErreur: 10,
    tempsLimite: 45,
  },
  {
    id: 'ch4_e3',
    chapitre: 4,
    titre: 'La Nourriture et l\'Énergie',
    description: "Michel doit rationner sa nourriture pour avoir assez d'énergie.",
    type: 'texte',
    question: "Complète : Les aliments apportent de l'______ à notre corps. Les trois familles d'aliments sont : les aliments bâtisseurs (______), les aliments énergétiques (______ et graisses), et les aliments protecteurs (______ et minéraux).",
    contexte: "Michel compte ses provisions. Il sait que chaque aliment a un rôle précis pour son corps.",
    reponse: 'énergie,protéines,sucres,protéines,vitamines',
    reponsesPossibles: ['énergie', 'protéines', 'sucres/glucides', 'vitamines'],
    explication: "Les aliments fournissent de l'énergie et des nutriments : les protéines (viande, poisson, œufs) construisent les muscles ; les sucres/lipides (féculents, graisses) donnent de l'énergie ; les vitamines et minéraux (fruits, légumes) protègent l'organisme.",
    lecon: 'Sciences - L\'alimentation et la santé',
    matiere: 'sciences',
    points: 150,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur l'alimentation. Les 3 familles d'aliments ont des rôles différents.", cout: 15, categorie: 'lecon' },
      { id: 'i2', texte: "Les bâtisseurs = muscles. Les énergétiques = carburant. Les protecteurs = santé.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 35,
    penaliteErreur: 20,
    tempsLimite: 90,
  },
  {
    id: 'ch4_e4',
    chapitre: 4,
    titre: 'Les Aurores Boréales',
    description: "Un spectacle magique dans le ciel sibérien !",
    type: 'qcm',
    question: "Quel phénomène naturel produit les aurores boréales que Michel observe dans le ciel ?",
    contexte: "Le ciel s'illumine de vert et de violet. Michel est émerveillé par ce spectacle.",
    options: [
      "Le reflet de la lune sur la glace",
      "Des particules solaires interagissant avec le champ magnétique terrestre",
      "Des volcans en éruption au loin",
      "La lumière des étoiles amplifiée par le froid"
    ],
    reponse: "Des particules solaires interagissant avec le champ magnétique terrestre",
    explication: "Les aurores boréales sont causées par des particules chargées émises par le Soleil qui interagissent avec les gaz de l'atmosphère terrestre, guidées par le champ magnétique. Elles sont visibles près des pôles (Nord = boréales, Sud = australes).",
    lecon: 'Sciences - Le système solaire et la Terre',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "Le Soleil envoie des particules vers la Terre. Consulte ta leçon sur le système solaire.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce phénomène est visible surtout près des pôles, là où le champ magnétique est le plus fort.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },

  // ==================== CHAPITRE 5 : IRKOUTSK (Histoire - France, Europe) ====================
  {
    id: 'ch5_e1',
    chapitre: 5,
    titre: 'La Monarchie et la République',
    description: "Michel pense aux différents régimes politiques de l'Europe.",
    type: 'qcm',
    question: "Quelle est la différence principale entre une monarchie et une république ?",
    contexte: "Michel arrive à Irkoutsk. Il compare le pouvoir du Tsar (monarchie) avec ce qu'il sait de la France.",
    options: [
      "La monarchie a un roi/reine, la république a un président élu",
      "La monarchie est plus grande que la république",
      "La république n'a pas de gouvernement",
      "Il n'y a aucune différence"
    ],
    reponse: "La monarchie a un roi/reine, la république a un président élu",
    explication: "Dans une monarchie, le pouvoir est détenu par un roi ou une reine (souvent héréditaire). Dans une république, le chef de l'État (président) est élu par les citoyens. La France est une république depuis 1870 (IIIe République).",
    lecon: 'Histoire - Les régimes politiques',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le Tsar est un monarque. En France, qui dirige la République ? Consulte ta leçon.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Monarque = pouvoir héréditaire (de père en fils). République = pouvoir élu.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch5_e2',
    chapitre: 5,
    titre: 'Les Droits de l\'Homme',
    description: "Le message que porte Michel défend les droits des citoyens.",
    type: 'vrai-faux',
    question: "La Déclaration des droits de l'homme et du citoyen (1789) affirme que 'les hommes naissent et demeurent libres et égaux en droits'.",
    contexte: "Le message secret du Tsar concerne la défense de son peuple. Michel pense aux idéaux de 1789.",
    reponse: 'Vrai',
    explication: "L'article 1 de la Déclaration des droits de l'homme et du citoyen (26 août 1789) stipule : 'Les hommes naissent et demeurent libres et égaux en droits.' C'est un texte fondamental de la Révolution française.",
    lecon: 'Histoire - La Révolution française et les droits de l\'homme',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur la Révolution française. L'article 1 est très célèbre.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Liberté, Égalité, Fraternité - c'est la devise de la France née de cette Déclaration.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch5_e3',
    chapitre: 5,
    titre: 'Le Commerce et les Échanges',
    description: "Irkoutsk est un carrefour commercial important.",
    type: 'qcm',
    question: "Quels produits s'échangeaient principalement sur la route de la soie qui passait près de la Sibérie ?",
    contexte: "Michel traverse les marchés d'Irkoutsk. Les marchands venus de tout l'Orient échangent leurs produits.",
    options: [
      "Uniquement des armes",
      "Soie, épices, pierres précieuses, fourrures, thé",
      "Seulement de la nourriture",
      "Des livres uniquement"
    ],
    reponse: "Soie, épices, pierres précieuses, fourrures, thé",
    explication: "La route de la soie était un réseau de routes commerciales reliant l'Asie à l'Europe. On y échangeait : soie (Chine), épices (Inde), pierres précieuses, fourrures (Sibérie), thé, porcelaine, etc. Ces échanges ont permis la circulation des idées et des inventions.",
    lecon: 'Histoire - Les grands échanges commerciaux',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le nom 'route de la SOIE' donne un indice. Consulte ta leçon sur les échanges.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "La Sibérie est connue pour ses fourrures. La Chine pour la soie. L'Inde pour les épices.", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch5_e4',
    chapitre: 5,
    titre: 'Le Message Final',
    description: "Michel doit déchiffrer le code final pour remettre le message au grand-duc.",
    type: 'code',
    question: "Déchiffre ce message codé : Si A=1, B=2, C=3... quel mot forme les chiffres 12-9-2-5-18-20-5 ?",
    contexte: "Le message du Tsar est chiffré ! Michel doit le décoder avant de le remettre au grand-duc d'Irkoutsk.",
    reponse: 'LIBERTE',
    explication: "A=1, B=2, C=3... L=12, I=9, B=2, E=5, R=18, T=20, E=5 → LIBERTÉ ! Le message défend la liberté du peuple sibérien.",
    lecon: 'Transversal - Alphabet et numération',
    matiere: 'histoire',
    points: 200,
    indices: [
      { id: 'i1', texte: "Écris l'alphabet en numérotant chaque lettre : A=1, B=2, C=3...", cout: 10, categorie: 'observation' },
      { id: 'i2', texte: "12=L, 9=I, 2=B... C'est un mot très important de la Révolution française !", cout: 20, categorie: 'deduction' },
      { id: 'i3', texte: "Le mot commence par L et se termine par E. C'est un des mots de la devise française.", cout: 30, categorie: 'deduction' },
    ],
    bonusLecon: 40,
    penaliteErreur: 25,
    tempsLimite: 120,
  },
];

// ============================================================
// CONFIGURATION DU JEU
// ============================================================
export const CONFIG = {
  tempsTotal: {
    apprenti: 45 * 60,    // 45 minutes
    eclaireur: 40 * 60,   // 40 minutes
    capitaine: 35 * 60,   // 35 minutes
    messager: 30 * 60,    // 30 minutes
    heros: 25 * 60,       // 25 minutes
  },
  pointsMaxParEnigme: 200,
  nombreIndicesMax: 3,
  pauseDuree: 300, // 5 minutes max
  codeDashboard: 'TSAR2024',
};

// ============================================================
// MESSAGES NARRATIFS
// ============================================================
export const MESSAGES = {
  intro: `An 1860. L'Empire russe est menacé. Le grand-duc d'Irkoutsk, isolé au fond de la Sibérie, a besoin de renforts. Le Tsar Alexandre II choisit son meilleur courier : Michel Strogoff.

Sa mission : porter un message secret à travers 5 500 kilomètres de steppes, de montagnes et de forêts gelées.

Mais les Tartares, menés par le traître Ivan Ogareff, veulent intercepter le message...

C'est toi qui incarneras Michel Strogoff. Es-tu prêt à relever le défi ?`,
  
  victoire: `🎉 MISSION ACCOMPLIE !

Michel Strogoff a remis le message au grand-duc d'Irkoutsk ! Les renforts arrivent, la ville est sauvée !

Grâce à ton courage, ta persévérance et tes connaissances, tu as traversé les 5 500 kilomètres de la Sibérie. Tu es un véritable Héros de l'Empire !

"Un courier du Tsar ne trahit jamais sa mission." - Jules Verne`,

  defaite: `Le temps est écoulé... Michel n'a pas pu atteindre Irkoutsk à temps.

Mais ne te décourage pas ! Comme le dit Jules Verne : "Celui qui tombe et se relève est bien plus fort que celui qui n'est jamais tombé."

Réessaie, consulte tes leçons, et cette fois, tu réussiras !`,
};
