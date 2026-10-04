// Données du jeu Michel Strogoff

export interface Niveau {
  id: string;
  nom: string;
  description: string;
  icon: string;
  color: string;
  pointsMultiplier: number;
  tempsBonus: number;
}

export interface Chapitre {
  id: number;
  titre: string;
  description: string;
  lieu: string;
  ambiance: string;
  couleurFond: string;
  transition: string;
  enigmes: string[];
}

export interface Indice {
  id: string;
  texte: string;
  cout: number;
  categorie: 'lecon' | 'observation' | 'deduction';
}

export interface Enigme {
  id: string;
  chapitre: number;
  titre: string;
  description: string;
  type: 'qcm' | 'texte' | 'glisser' | 'code' | 'association' | 'observation' | 'vrai-faux' | 'calcul';
  question: string;
  contexte: string;
  options?: string[];
  reponse: string | string[] | number;
  reponsesPossibles?: string[];
  explication: string;
  lecon: string;
  matiere: 'histoire' | 'geographie' | 'sciences';
  points: number;
  indices: Indice[];
  bonusLecon: number;
  penaliteErreur: number;
  tempsLimite: number;
  image?: string;
}

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

export const CHAPITRES: Chapitre[] = [
  {
    id: 1,
    titre: 'Le Départ de Moscou',
    description: "Le palais du Tsar est en effervescence. Michel Strogoff reçoit sa mission : traverser la Sibérie pour porter un message au grand-duc d'Irkoutsk.",
    lieu: 'Moscou, Russie',
    ambiance: 'Palais impérial, bougies, cartes géographiques',
    couleurFond: 'from-amber-900 via-red-900 to-amber-950',
    transition: "Le traîneau s'éloigne dans la neige...",
    enigmes: ['ch1_e1', 'ch1_e2', 'ch1_e3', 'ch1_e4'],
  },
  {
    id: 2,
    titre: 'La Traversée de l\'Oural',
    description: "Les montagnes de l'Oural se dressent devant Michel. Il faut comprendre ces terres pour les traverser.",
    lieu: 'Montagnes de l\'Oural',
    ambiance: 'Montagnes enneigées, forêts de conifères, vent glacial',
    couleurFond: 'from-slate-800 via-blue-900 to-slate-900',
    transition: "Le vent hurle à travers les cols...",
    enigmes: ['ch2_e1', 'ch2_e2', 'ch2_e3', 'ch2_e4'],
  },
  {
    id: 3,
    titre: 'Les Steppes de Sibérie',
    description: "L'immensité des steppes s'offre à Michel. Des peuples y ont vécu, des empires s'y sont formés.",
    lieu: 'Steppes de Sibérie',
    ambiance: 'Plaines infinies, yourtes, ciel étoilé',
    couleurFond: 'from-yellow-900 via-orange-900 to-yellow-950',
    transition: "Les chevaux galopent vers l'est...",
    enigmes: ['ch3_e1', 'ch3_e2', 'ch3_e3', 'ch3_e4'],
  },
  {
    id: 4,
    titre: 'Le Lac Baïkal',
    description: "Le plus profond lac du monde apparaît. Ses eaux recèlent des mystères scientifiques.",
    lieu: 'Lac Baïkal, Sibérie',
    ambiance: 'Lac gelé, aurores boréales, glace cristalline',
    couleurFond: 'from-cyan-900 via-blue-900 to-indigo-950',
    transition: "La glace craque sous les sabots...",
    enigmes: ['ch4_e1', 'ch4_e2', 'ch4_e3', 'ch4_e4'],
  },
  {
    id: 5,
    titre: "Irkoutsk - La Mission Accomplie",
    description: "Enfin ! Les remparts d'Irkoutsk se profilent. Mais avant de remettre le message, Michel doit encore prouver sa valeur.",
    lieu: 'Irkoutsk, Sibérie',
    ambiance: 'Ville fortifiée, torches, ambiance de siège',
    couleurFond: 'from-red-950 via-purple-900 to-red-900',
    transition: "Les portes de la ville s'ouvrent...",
    enigmes: ['ch5_e1', 'ch5_e2', 'ch5_e3', 'ch5_e4'],
  },
];

export const ENIGMES: Enigme[] = [
  // Chapitre 1 : Géographie - Europe
  {
    id: 'ch1_e1',
    chapitre: 1,
    titre: 'La Carte du Voyage',
    description: "Michel doit étudier la carte de l'Europe pour planifier son itinéraire.",
    type: 'qcm',
    question: "Quelle est la capitale de la Russie, point de départ de Michel Strogoff ?",
    contexte: "Le Tsar Alexandre II règne depuis son palais du Kremlin.",
    options: ['Saint-Pétersbourg', 'Moscou', 'Kiev', 'Irkoutsk'],
    reponse: 'Moscou',
    explication: "Moscou est la capitale de la Russie. C'est depuis le Kremlin que le Tsar envoie Michel Strogoff en mission.",
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
    question: "Associe chaque pays à son continent.",
    contexte: "Sur la carte du palais, Michel trace son itinéraire.",
    options: ['France', 'Russie', 'Chine', 'Brésil', 'Égypte', 'Japon'],
    reponse: 'Europe:France,Russie;Asie:Chine,Japon;Afrique:Égypte;Amérique:Brésil',
    explication: "La France et la Russie sont en Europe. La Chine et le Japon sont en Asie. L'Égypte est en Afrique. Le Brésil est en Amérique.",
    lecon: 'Géographie - Les continents et océans',
    matiere: 'geographie',
    points: 150,
    indices: [
      { id: 'i1', texte: "Il y a 5 continents. Consulte ta leçon.", cout: 15, categorie: 'lecon' },
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
    description: "Michel prépare ses affaires en fonction du climat.",
    type: 'qcm',
    question: "Quel type de climat Michel va-t-il rencontrer en Sibérie ?",
    contexte: "Le général Kissoff remet à Michel ses provisions.",
    options: ['Tropical humide', 'Tempéré océanique', 'Continental extrême', 'Méditerranéen'],
    reponse: 'Continental extrême',
    explication: "La Sibérie a un climat continental extrême : étés courts et chauds, hivers très longs et très froids (jusqu'à -50°C).",
    lecon: 'Géographie - Les climats du monde',
    matiere: 'geographie',
    points: 100,
    indices: [
      { id: 'i1', texte: "En Sibérie, les températures descendent très bas. Quel climat a des écarts extrêmes ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce climat se trouve au centre des grands continents, loin des océans.", cout: 20, categorie: 'deduction' },
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
    question: "Le Soleil se lève à l'Est et se couche à l'Ouest. Michel part vers le lever du Soleil.",
    contexte: "Au petit matin, Michel regarde le Soleil se lever.",
    reponse: 'Vrai',
    explication: "Le Soleil se lève à l'Est (orient) et se couche à l'Ouest (occident). Michel part vers l'Est.",
    lecon: 'Géographie - S\'orienter et se repérer',
    matiere: 'geographie',
    points: 80,
    indices: [
      { id: 'i1', texte: "Observe par où le Soleil apparaît chaque matin.", cout: 10, categorie: 'observation' },
    ],
    bonusLecon: 20,
    penaliteErreur: 10,
    tempsLimite: 45,
  },
  // Chapitre 2 : Sciences - Matière, Montagnes
  {
    id: 'ch2_e1',
    chapitre: 2,
    titre: 'Les États de l\'Eau',
    description: "L'eau gèle dans le froid sibérien.",
    type: 'qcm',
    question: "À quelle température l'eau gèle-t-elle ?",
    contexte: "La gourde de Michel gèle pendant la nuit.",
    options: ['-10°C', '0°C', '10°C', '100°C'],
    reponse: '0°C',
    explication: "L'eau gèle à 0°C et bout à 100°C.",
    lecon: 'Sciences - Les états de l\'eau',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur les changements d'état de l'eau.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "C'est la température où les glaçons se forment.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch2_e2',
    chapitre: 2,
    titre: 'Le Cycle de l\'Eau',
    description: "Michel observe la neige, la glace, le brouillard.",
    type: 'texte',
    question: "Complète : L'eau s'évapore, forme des ______, puis retombe en ______.",
    contexte: "Michel observe le brouillard matinal sur la rivière.",
    reponse: 'nuages,pluie',
    reponsesPossibles: ['nuages', 'pluie', 'neige', 'précipitations'],
    explication: "Le cycle de l'eau : évaporation → nuages → précipitations (pluie, neige).",
    lecon: 'Sciences - Le cycle de l\'eau',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "Quand l'eau s'évapore et monte, que forme-t-elle ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le premier mot est ce que tu vois dans le ciel gris.", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },
  {
    id: 'ch2_e3',
    chapitre: 2,
    titre: 'Les Roches de l\'Oural',
    description: "Les montagnes sont composées de différentes roches.",
    type: 'qcm',
    question: "Les montagnes se forment par le rapprochement de quelles structures ?",
    contexte: "Michel escalade un passage difficile.",
    options: ["Les plaques tectoniques", "Les volcans", "Les rivières", "Le vent"],
    reponse: 'Les plaques tectoniques',
    explication: "Les montagnes se forment par la collision des plaques tectoniques.",
    lecon: 'Sciences - La Terre, les roches',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "La surface de la Terre est comme un puzzle géant.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce sont des morceaux de la croûte terrestre qui bougent.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },
  {
    id: 'ch2_e4',
    chapitre: 2,
    titre: 'L\'Énergie du Froid',
    description: "Michel doit se chauffer.",
    type: 'qcm',
    question: "Quelle est la source d'énergie principale en Russie au XIXe siècle ?",
    contexte: "Michel allume un feu de bois.",
    options: ['L\'électricité', 'Le bois', 'Le pétrole', 'Le charbon uniquement'],
    reponse: 'Le bois',
    explication: "Au XIXe siècle, le bois était la principale source d'énergie.",
    lecon: 'Sciences - Les sources d\'énergie',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Quelle énergie est la plus accessible en forêt ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Regarde ce que Michel allume !", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  // Chapitre 3 : Histoire - Empires
  {
    id: 'ch3_e1',
    chapitre: 3,
    titre: 'Les Grands Empires',
    description: "Michel traverse des terres qui furent le domaine de grands empires.",
    type: 'qcm',
    question: "Quel empire a régné sur la Russie en 1860 ?",
    contexte: "Michel passe devant un ancien monastère.",
    options: ['La République', "L'Empire romain", "L'Empire russe", "L'Empire ottoman"],
    reponse: "L'Empire russe",
    explication: "En 1860, la Russie est un empire dirigé par le Tsar Alexandre II.",
    lecon: 'Histoire - Le XIXe siècle',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le Tsar est le souverain de la Russie.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le livre a été écrit en 1876. La Russie était gouvernée par un empereur.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch3_e2',
    chapitre: 3,
    titre: 'La Révolution Française',
    description: "Michel pense à la France et à son histoire.",
    type: 'vrai-faux',
    question: "La Révolution française de 1789 a mis fin à la monarchie absolue.",
    contexte: "Michel se souvient des récits sur la France.",
    reponse: 'Vrai',
    explication: "La Révolution française (1789) a renversé la monarchie absolue de Louis XVI.",
    lecon: 'Histoire - La Révolution française',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "En quelle année a eu lieu la prise de la Bastille ?", cout: 10, categorie: 'lecon' },
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
    question: "En quelle année Napoléon a-t-il envahi la Russie ?",
    contexte: "Les steppes portent les cicatrices de la Grande Armée.",
    options: ['1789', '1812', '1815', '1848'],
    reponse: '1812',
    explication: "Napoléon a envahi la Russie en 1812. Sa Grande Armée a été décimée par le froid.",
    lecon: 'Histoire - Napoléon Bonaparte',
    matiere: 'histoire',
    points: 120,
    indices: [
      { id: 'i1', texte: "C'est entre la Révolution (1789) et Waterloo (1815).", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "L'année se termine par 12.", cout: 25, categorie: 'deduction' },
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
    question: "Quel est le mode de vie des peuples nomades ?",
    contexte: "Michel croise une caravane de nomades.",
    options: [
      "Ils vivent dans des villes fortifiées",
      "Ils se déplacent avec leurs troupeaux selon les saisons",
      "Ils sont tous agriculteurs sédentaires",
      "Ils vivent uniquement sur les côtes"
    ],
    reponse: "Ils se déplacent avec leurs troupeaux selon les saisons",
    explication: "Les peuples nomades pratiquent l'élevage pastoral et se déplacent avec leurs troupeaux.",
    lecon: 'Histoire - Les sociétés et les échanges',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le mot 'nomade' signifie 'qui erre'.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Le contraire de sédentaire. Ils n'ont pas de maison fixe.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  // Chapitre 4 : Sciences - Écosystèmes, Corps humain
  {
    id: 'ch4_e1',
    chapitre: 4,
    titre: 'L\'Écosystème du Lac',
    description: "Le lac Baïkal est un écosystème unique.",
    type: 'qcm',
    question: "Qu'est-ce qu'un écosystème ?",
    contexte: "Michel observe les animaux et les plantes autour du lac.",
    options: [
      "Un groupe d'animaux identiques",
      "Un milieu et l'ensemble des êtres vivants qui y vivent",
      "Un jardin botanique",
      "Un lac très profond"
    ],
    reponse: "Un milieu et l'ensemble des êtres vivants qui y vivent",
    explication: "Un écosystème est formé par un milieu et tous les êtres vivants qui y habitent.",
    lecon: 'Sciences - Les écosystèmes',
    matiere: 'sciences',
    points: 100,
    indices: [
      { id: 'i1', texte: "Éco = maison, système = ensemble. C'est la 'maison' de tous les êtres vivants.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Pense à la chaîne alimentaire : plantes → herbivores → carnivores.", cout: 20, categorie: 'deduction' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch4_e2',
    chapitre: 4,
    titre: 'Le Corps Humain et le Froid',
    description: "Michel doit comprendre comment son corps réagit au froid.",
    type: 'qcm',
    question: "Quelle est la température normale du corps humain ?",
    contexte: "Michel sent le froid engourdir ses membres.",
    options: ['35°C', '37°C', '39°C', '41°C'],
    reponse: '37°C',
    explication: "La température normale du corps humain est d'environ 37°C.",
    lecon: 'Sciences - Le corps humain',
    matiere: 'sciences',
    points: 80,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur le corps humain.", cout: 10, categorie: 'lecon' },
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
    description: "Michel doit rationner sa nourriture.",
    type: 'texte',
    question: "Complète : Les aliments apportent de l'______ à notre corps.",
    contexte: "Michel compte ses provisions.",
    reponse: 'énergie',
    explication: "Les aliments fournissent de l'énergie et des nutriments.",
    lecon: 'Sciences - L\'alimentation',
    matiere: 'sciences',
    points: 150,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur l'alimentation.", cout: 15, categorie: 'lecon' },
      { id: 'i2', texte: "Les aliments sont le carburant de notre corps.", cout: 25, categorie: 'deduction' },
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
    question: "Quel phénomène produit les aurores boréales ?",
    contexte: "Le ciel s'illumine de vert et de violet.",
    options: [
      "Le reflet de la lune sur la glace",
      "Des particules solaires interagissant avec le champ magnétique terrestre",
      "Des volcans en éruption au loin",
      "La lumière des étoiles amplifiée par le froid"
    ],
    reponse: "Des particules solaires interagissant avec le champ magnétique terrestre",
    explication: "Les aurores boréales sont causées par des particules solaires qui interagissent avec l'atmosphère terrestre.",
    lecon: 'Sciences - Le système solaire',
    matiere: 'sciences',
    points: 120,
    indices: [
      { id: 'i1', texte: "Le Soleil envoie des particules vers la Terre.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Ce phénomène est visible surtout près des pôles.", cout: 25, categorie: 'deduction' },
    ],
    bonusLecon: 30,
    penaliteErreur: 15,
    tempsLimite: 75,
  },
  // Chapitre 5 : Histoire - France, Europe
  {
    id: 'ch5_e1',
    chapitre: 5,
    titre: 'La Monarchie et la République',
    description: "Michel pense aux différents régimes politiques.",
    type: 'qcm',
    question: "Quelle est la différence entre une monarchie et une république ?",
    contexte: "Michel arrive à Irkoutsk.",
    options: [
      "La monarchie a un roi, la république a un président élu",
      "La monarchie est plus grande que la république",
      "La république n'a pas de gouvernement",
      "Il n'y a aucune différence"
    ],
    reponse: "La monarchie a un roi, la république a un président élu",
    explication: "Dans une monarchie, le pouvoir est détenu par un roi. Dans une république, le président est élu.",
    lecon: 'Histoire - Les régimes politiques',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le Tsar est un monarque. En France, qui dirige la République ?", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Monarque = pouvoir héréditaire. République = pouvoir élu.", cout: 20, categorie: 'deduction' },
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
    question: "La Déclaration des droits de l'homme (1789) affirme que 'les hommes naissent libres et égaux en droits'.",
    contexte: "Le message secret du Tsar concerne la défense de son peuple.",
    reponse: 'Vrai',
    explication: "L'article 1 de la Déclaration des droits de l'homme stipule : 'Les hommes naissent et demeurent libres et égaux en droits.'",
    lecon: 'Histoire - La Révolution française',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Consulte ta leçon sur la Révolution française.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "Liberté, Égalité, Fraternité - c'est la devise de la France.", cout: 20, categorie: 'deduction' },
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
    question: "Quels produits s'échangeaient sur la route de la soie ?",
    contexte: "Michel traverse les marchés d'Irkoutsk.",
    options: [
      "Uniquement des armes",
      "Soie, épices, pierres précieuses, fourrures, thé",
      "Seulement de la nourriture",
      "Des livres uniquement"
    ],
    reponse: "Soie, épices, pierres précieuses, fourrures, thé",
    explication: "La route de la soie permettait d'échanger soie, épices, pierres précieuses, fourrures, thé, etc.",
    lecon: 'Histoire - Les grands échanges commerciaux',
    matiere: 'histoire',
    points: 100,
    indices: [
      { id: 'i1', texte: "Le nom 'route de la SOIE' donne un indice.", cout: 10, categorie: 'lecon' },
      { id: 'i2', texte: "La Sibérie est connue pour ses fourrures. La Chine pour la soie.", cout: 20, categorie: 'observation' },
    ],
    bonusLecon: 25,
    penaliteErreur: 15,
    tempsLimite: 60,
  },
  {
    id: 'ch5_e4',
    chapitre: 5,
    titre: 'Le Message Final',
    description: "Michel doit déchiffrer le code final.",
    type: 'code',
    question: "Si A=1, B=2, C=3... quel mot forme 12-9-2-5-18-20-5 ?",
    contexte: "Le message du Tsar est chiffré !",
    reponse: 'LIBERTE',
    explication: "L=12, I=9, B=2, E=5, R=18, T=20, E=5 → LIBERTÉ !",
    lecon: 'Transversal - Alphabet et numération',
    matiere: 'histoire',
    points: 200,
    indices: [
      { id: 'i1', texte: "Écris l'alphabet en numérotant chaque lettre.", cout: 10, categorie: 'observation' },
      { id: 'i2', texte: "12=L, 9=I, 2=B... C'est un mot de la Révolution française !", cout: 20, categorie: 'deduction' },
      { id: 'i3', texte: "Le mot commence par L et se termine par E.", cout: 30, categorie: 'deduction' },
    ],
    bonusLecon: 40,
    penaliteErreur: 25,
    tempsLimite: 120,
  },
];

export const CONFIG = {
  tempsTotal: {
    apprenti: 45 * 60,
    eclaireur: 40 * 60,
    capitaine: 35 * 60,
    messager: 30 * 60,
    heros: 25 * 60,
  },
  pointsMaxParEnigme: 200,
  nombreIndicesMax: 3,
  pauseDuree: 300,
  codeDashboard: 'TSAR2024',
};

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
