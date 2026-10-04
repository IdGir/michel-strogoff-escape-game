# 🐎 Michel Strogoff - Escape Game Éducatif

Un escape game immersif basé sur le roman de Jules Verne, conçu pour les élèves de CM1 et CM2.

## 🎮 Fonctionnalités

### Structure du jeu
- **5 chapitres** correspondant au voyage de Michel Strogoff :
  1. 🏛️ Le Départ de Moscou (Géographie - Europe)
  2. 🏔️ La Traversée de l'Oural (Sciences - Matière, Montagnes)
  3. 🐎 Les Steppes de Sibérie (Histoire - Empires, Civilisations)
  4. 🏔️ Le Lac Baïkal (Sciences - Écosystèmes, Corps humain)
  5. 🏰 Irkoutsk - La Mission Accomplie (Histoire - France, Europe)

- **20 énigmes** couvrant le programme CM1/CM2 en Histoire, Géographie et Sciences
- **5 niveaux de difficulté** nommés thématiquement :
  - 🌟 Apprenti Courrier (CE2)
  - 🐎 Éclaireur de la Steppe (CM1)
  - ⚔️ Capitaine de l'Oural (CM2)
  - 📜 Messager du Tsar (6ème)
  - 👑 Héros de l'Empire (5ème)

### Système de jeu
- ⏱️ **Chrono adaptatif** selon le niveau choisi
- 🏆 **Système de points** avec multiplicateurs selon le niveau
- 💡 **Indices** (3 par énigme) avec pénalité de points
- 📖 **Bonus leçons** : +points si l'élève consulte sa leçon avant de répondre
- ❌ **Pénalités** pour les mauvaises réponses
- ⏸️ **Mode Pause** avec sauvegarde de l'état
- ⚙️ **Réglages** (quitter la partie)

### Types d'énigmes
- QCM (Questions à choix multiples)
- Vrai/Faux
- Texte à compléter
- Association (relier des éléments)
- Code à déchiffrer

### Immersion visuelle
- ❄️ Animations CSS (neige qui tombe, aurores boréales)
- 🎨 Gradients immersifs pour chaque chapitre
- ✨ Effets visuels (flottement, brillance)
- 🎭 Emojis thématiques pour l'immersion

### Dashboard Enseignant
- 🔐 Accès protégé par code (par défaut : **TSAR2024**)
- 📊 Statistiques globales (parties, scores, temps)
- 📈 Répartition par matière et par niveau
- 📉 Progression par chapitre
- 💡 Recommandations pédagogiques automatiques

## 🚀 Installation et lancement

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```
Les fichiers seront générés dans le dossier `dist/`

### Prévisualisation du build
```bash
npm run preview
```

## 🎯 Utilisation en classe

### Pour les élèves
1. Cliquez sur **"Commencer l'Aventure"**
2. Choisissez un niveau de difficulté adapté
3. Lisez le message du Tsar et partez en mission
4. Résolvez les énigmes des 5 chapitres
5. Consultez vos leçons pour gagner des bonus !

### Pour l'enseignant
1. Cliquez sur **"Espace Enseignant"** sur l'écran d'accueil
2. Entrez le code d'accès (par défaut : **TSAR2024**)
3. Consultez les statistiques de la classe
4. Identifiez les points forts et les axes d'amélioration

### Conseils pédagogiques
- Encouragez les élèves à **consulter leurs leçons** avant de répondre (bonus de points)
- Les **indices** sont disponibles mais coûtent des points
- Le **niveau "Apprenti Courrier"** est idéal pour une première découverte
- Le **niveau "Héros de l'Empire"** convient aux élèves les plus avancés

## 📚 Programme couvert

### Histoire
- Le XIXe siècle en Europe
- La Révolution française
- Napoléon Bonaparte et l'Empire
- Les sociétés et les échanges
- Les régimes politiques
- Les grands échanges commerciaux

### Géographie
- Les capitales européennes
- Les continents et océans
- Les climats du monde
- S'orienter et se repérer

### Sciences
- Les états de l'eau et changements d'état
- Le cycle de l'eau dans la nature
- La Terre, les roches et les volcans
- Les sources d'énergie
- Les écosystèmes et la biodiversité
- Le corps humain et la santé
- L'alimentation et la santé
- Le système solaire et la Terre

## 🔧 Personnalisation

### Modifier le code du dashboard
Dans `src/data/gameData.ts`, modifiez la ligne :
```typescript
codeDashboard: 'TSAR2024',
```

### Ajouter des énigmes
Dans `src/data/gameData.ts`, ajoutez de nouvelles entrées dans le tableau `ENIGMES` et référencez-les dans les chapitres.

### Modifier les temps
Dans `src/data/gameData.ts`, ajustez les valeurs dans `CONFIG.tempsTotal`.

## 🎨 Technologies utilisées

- **React 18** - Framework JavaScript pour l'interface utilisateur
- **TypeScript** - Typage statique pour plus de robustesse
- **Tailwind CSS v4** - Framework CSS pour le design
- **Vite** - Build tool ultra-rapide

## 📝 License

Ce projet est destiné à un usage éducatif.

## 🙏 Crédits

- **Histoire** : "Michel Strogoff" de Jules Verne (1876)
- **Développement** : Escape game éducatif pour l'enseignement en CM1/CM2

---

**Bon voyage avec Michel Strogoff !** 🐎✨
