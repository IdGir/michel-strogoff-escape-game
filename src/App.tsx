import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Settings, Trophy, Clock, Star, BookOpen,
  Eye, EyeOff, ChevronRight, RotateCcw, Volume2, VolumeX,
  Home, Award, Target, Zap, Shield, Map, AlertTriangle,
  CheckCircle, XCircle, HelpCircle, Lock, Unlock, BarChart3
} from 'lucide-react';
import { NIVEAUX, CHAPITRES, ENIGMES, CONFIG, MESSAGES, type Enigme, type Niveau } from './data/gameData';

// ============================================================
// TYPES
// ============================================================
type GameScreen = 'accueil' | 'niveau' | 'intro' | 'jeu' | 'chapitre-transition' | 'victoire' | 'defaite' | 'dashboard' | 'pause' | 'reglages';

interface GameState {
  screen: GameScreen;
  niveau: Niveau | null;
  chapitreActuel: number;
  enigmeActuelle: number;
  score: number;
  tempsRestant: number;
  indicesUtilises: string[];
  enigmesResolues: string[];
  erreurs: number;
  leconsConsultees: string[];
  bonusLecons: number;
  isPaused: boolean;
  sonActive: boolean;
  tempsTotalJoue: number;
  historique: { enigmeId: string; resultat: 'success' | 'fail' | 'skip'; points: number; temps: number }[];
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'accueil',
    niveau: null,
    chapitreActuel: 1,
    enigmeActuelle: 0,
    score: 0,
    tempsRestant: 0,
    indicesUtilises: [],
    enigmesResolues: [],
    erreurs: 0,
    leconsConsultees: [],
    bonusLecons: 0,
    isPaused: false,
    sonActive: true,
    tempsTotalJoue: 0,
    historique: [],
  });

  const [reponse, setReponse] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showIndice, setShowIndice] = useState<number | null>(null);
  const [showLecon, setShowLecon] = useState(false);
  const [showExplication, setShowExplication] = useState(false);
  const [dashboardCode, setDashboardCode] = useState('');
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<Record<string, string>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [snowflakes] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 5 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  })));

  // Timer
  useEffect(() => {
    if (gameState.screen === 'jeu' && !gameState.isPaused && gameState.tempsRestant > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.tempsRestant <= 1) {
            return { ...prev, tempsRestant: 0, screen: 'defaite' };
          }
          return { ...prev, tempsRestant: prev.tempsRestant - 1, tempsTotalJoue: prev.tempsTotalJoue + 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState.screen, gameState.isPaused, gameState.tempsRestant]);

  const getCurrentEnigme = useCallback((): Enigme | null => {
    const chapitre = CHAPITRES.find(c => c.id === gameState.chapitreActuel);
    if (!chapitre) return null;
    const enigmeId = chapitre.enigmes[gameState.enigmeActuelle];
    return ENIGMES.find(e => e.id === enigmeId) || null;
  }, [gameState.chapitreActuel, gameState.enigmeActuelle]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startGame = (niveau: Niveau) => {
    const tempsTotal = CONFIG.tempsTotal[niveau.id as keyof typeof CONFIG.tempsTotal] + niveau.tempsBonus;
    setGameState(prev => ({
      ...prev,
      screen: 'intro',
      niveau,
      chapitreActuel: 1,
      enigmeActuelle: 0,
      score: 0,
      tempsRestant: tempsTotal,
      indicesUtilises: [],
      enigmesResolues: [],
      erreurs: 0,
      leconsConsultees: [],
      bonusLecons: 0,
      isPaused: false,
      tempsTotalJoue: 0,
      historique: [],
    }));
  };

  const submitReponse = () => {
    const enigme = getCurrentEnigme();
    if (!enigme) return;

    let isCorrect = false;
    if (enigme.type === 'association') {
      const correctAssoc = Object.entries(selectedAssociation).every(([key, val]) => {
        const expected = enigme.reponse as string;
        const parts = expected.split(';');
        return parts.some(part => {
          const [cat, items] = part.split(':');
          return items.split(',').includes(key) && cat === val;
        });
      });
      isCorrect = correctAssoc && Object.keys(selectedAssociation).length === enigme.options!.length;
    } else if (enigme.type === 'texte' || enigme.type === 'code') {
      const normalized = reponse.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const expected = (typeof enigme.reponse === 'string' ? enigme.reponse : '').toLowerCase().replace(/[^a-z0-9]/g, '');
      isCorrect = normalized === expected || (enigme.reponsesPossibles?.some(r => r.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalized)) ?? false);
    } else {
      isCorrect = reponse === enigme.reponse;
    }

    if (isCorrect) {
      const tempsBonus = Math.max(0, enigme.tempsLimite - 10) > 0 ? Math.floor(enigme.tempsLimite / 4) : 0;
      const pointsGagnes = Math.floor(enigme.points * (gameState.niveau?.pointsMultiplier || 1));
      const bonusLecon = gameState.leconsConsultees.includes(enigme.id) ? enigme.bonusLecon : 0;
      const totalPoints = pointsGagnes + bonusLecon + tempsBonus;

      setFeedback('correct');
      setGameState(prev => ({
        ...prev,
        score: prev.score + totalPoints,
        enigmesResolues: [...prev.enigmesResolues, enigme.id],
        bonusLecons: prev.bonusLecons + bonusLecon,
        historique: [...prev.historique, { enigmeId: enigme.id, resultat: 'success', points: totalPoints, temps: enigme.tempsLimite }],
      }));
    } else {
      setFeedback('incorrect');
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - enigme.penaliteErreur),
        erreurs: prev.erreurs + 1,
        historique: [...prev.historique, { enigmeId: enigme.id, resultat: 'fail', points: -enigme.penaliteErreur, temps: 0 }],
      }));
    }

    setTimeout(() => {
      setFeedback(null);
      setShowExplication(true);
    }, 1500);
  };

  const nextEnigme = () => {
    const chapitre = CHAPITRES.find(c => c.id === gameState.chapitreActuel);
    if (!chapitre) return;

    setReponse('');
    setShowExplication(false);
    setShowIndice(null);
    setShowLecon(false);
    setSelectedAssociation({});

    if (gameState.enigmeActuelle < chapitre.enigmes.length - 1) {
      setGameState(prev => ({ ...prev, enigmeActuelle: prev.enigmeActuelle + 1 }));
    } else if (gameState.chapitreActuel < CHAPITRES.length) {
      setGameState(prev => ({
        ...prev,
        screen: 'chapitre-transition',
        chapitreActuel: prev.chapitreActuel + 1,
        enigmeActuelle: 0,
      }));
    } else {
      setGameState(prev => ({ ...prev, screen: 'victoire' }));
    }
  };

  const utiliserIndice = (indiceIndex: number) => {
    const enigme = getCurrentEnigme();
    if (!enigme) return;
    const indice = enigme.indices[indiceIndex];
    if (!indice || gameState.indicesUtilises.includes(indice.id)) return;

    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - indice.cout),
      indicesUtilises: [...prev.indicesUtilises, indice.id],
    }));
    setShowIndice(indiceIndex);
  };

  const consulterLecon = () => {
    const enigme = getCurrentEnigme();
    if (!enigme) return;
    if (!gameState.leconsConsultees.includes(enigme.id)) {
      setGameState(prev => ({
        ...prev,
        leconsConsultees: [...prev.leconsConsultees, enigme.id],
      }));
    }
    setShowLecon(true);
  };

  // ============================================================
  // RENDU - ÉCRAN D'ACCUEIL
  // ============================================================
  if (gameState.screen === 'accueil') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4 hero-bg">
        {/* Neige animée */}
        {snowflakes.map(f => (
          <div
            key={f.id}
            className="absolute rounded-full bg-white/60 animate-snow"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}

        {/* Aurore boréale en fond */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-green-500/10 via-purple-500/20 to-cyan-500/10 animate-aurora blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center z-10"
        >
          <div className="text-6xl mb-4 animate-float">🐎</div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-300 text-shadow-gold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Michel Strogoff
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/80 italic mb-2">
            Le Courrier du Tsar
          </p>
          <p className="text-sm text-slate-400 mb-8">
            D'après Jules Verne — Escape Game Éducatif
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto parchment-bg rounded-lg p-6 vintage-border mb-8"
          >
            <p className="text-amber-900 text-sm md:text-base leading-relaxed">
              {MESSAGES.intro.split('\n\n').map((p, i) => (
                <span key={i}>{p}{i < MESSAGES.intro.split('\n\n').length - 1 && <><br/><br/></>}</span>
              ))}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState(prev => ({ ...prev, screen: 'niveau' }))}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2"
            >
              <Play size={24} /> Commencer l'Aventure
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDashboardOpen(true)}
              className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 rounded-lg font-bold shadow-lg hover:shadow-slate-500/30 transition-all flex items-center gap-2"
            >
              <Shield size={20} /> Espace Enseignant
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Modal */}
        <AnimatePresence>
          {dashboardOpen && (
            <DashboardModal
              code={dashboardCode}
              setCode={setDashboardCode}
              onClose={() => setDashboardOpen(false)}
              onOpen={() => { setDashboardOpen(false); setGameState(prev => ({ ...prev, screen: 'dashboard' })); }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ============================================================
  // SÉLECTION DU NIVEAU
  // ============================================================
  if (gameState.screen === 'niveau') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4">
        {snowflakes.map(f => (
          <div key={f.id} className="absolute rounded-full bg-white/60 animate-snow"
            style={{ left: `${f.left}%`, width: f.size, height: f.size, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }} />
        ))}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-amber-300 text-center mb-2 text-shadow-gold">Choisis ton Rang</h2>
          <p className="text-slate-400 text-center mb-8">Plus le rang est élevé, plus le défi est grand...</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NIVEAUX.map((niveau, i) => (
              <motion.button
                key={niveau.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => startGame(niveau)}
                className={`p-5 rounded-xl bg-gradient-to-br ${niveau.color} text-white shadow-xl hover:shadow-2xl transition-all text-left`}
              >
                <div className="text-3xl mb-2">{niveau.icon}</div>
                <h3 className="font-bold text-lg mb-1">{niveau.nom}</h3>
                <p className="text-sm text-white/80 mb-2">{niveau.description}</p>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Star size={12} /> ×{niveau.pointsMultiplier}
                  <Clock size={12} className="ml-2" />
                  {formatTime(CONFIG.tempsTotal[niveau.id as keyof typeof CONFIG.tempsTotal] + niveau.tempsBonus)}
                </div>
              </motion.button>
            ))}
          </div>

          <button onClick={() => setGameState(prev => ({ ...prev, screen: 'accueil' }))} className="mt-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
            <ChevronRight size={16} className="rotate-180" /> Retour
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // INTRO CINÉMATIQUE
  // ============================================================
  if (gameState.screen === 'intro') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-blue-900/20" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="text-center z-10 p-8 max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-8xl mb-8"
          >
            📜
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-3xl md:text-4xl font-bold text-amber-300 mb-6 text-shadow-gold"
          >
            Mission Conférée
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="parchment-bg rounded-lg p-6 vintage-border"
          >
            <p className="text-amber-900 text-base md:text-lg leading-relaxed italic">
              "Michel Strogoff, toi qui as prouvé ta valeur, je te confie cette mission secrète.
              Porte ce message au grand-duc d'Irkoutsk. La Russie compte sur toi.
              Traverse les steppes, les montagnes, les lacs gelés. Ne faiblis pas."
              <br /><br />
              <span className="font-bold">— Alexandre II, Tsar de toutes les Russies</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-8"
          >
            <p className="text-amber-200/60 mb-2">Rang : {gameState.niveau?.icon} {gameState.niveau?.nom}</p>
            <p className="text-amber-200/60 mb-6">Temps imparti : {formatTime(gameState.tempsRestant)}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState(prev => ({ ...prev, screen: 'jeu' }))}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg"
            >
              Partir en Mission →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // TRANSITION ENTRE CHAPITRES
  // ============================================================
  if (gameState.screen === 'chapitre-transition') {
    const chapitre = CHAPITRES.find(c => c.id === gameState.chapitreActuel);
    const bgClass = gameState.chapitreActuel === 4 ? 'chapter-baikal-bg' : gameState.chapitreActuel === 5 ? 'chapter-irkoutsk-bg' : '';
    return (
      <div className={`min-h-screen bg-gradient-to-b ${chapitre?.couleurFond || 'from-slate-900 to-slate-800'} relative overflow-hidden flex items-center justify-center ${bgClass}`}>
        {snowflakes.map(f => (
          <div key={f.id} className="absolute rounded-full bg-white/30 animate-snow"
            style={{ left: `${f.left}%`, width: f.size, height: f.size, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }} />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center z-10 p-8 max-w-2xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl mb-6"
          >
            {gameState.chapitreActuel === 2 && '🏔️'}
            {gameState.chapitreActuel === 3 && '🐎'}
            {gameState.chapitreActuel === 4 && '🏔️'}
            {gameState.chapitreActuel === 5 && '🏰'}
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3 text-shadow-gold">
            Chapitre {gameState.chapitreActuel}
          </h2>
          <h3 className="text-2xl text-amber-300 mb-4">{chapitre?.titre}</h3>
          <p className="text-white/80 mb-2 italic">{chapitre?.lieu}</p>
          <p className="text-white/70 mb-6 text-sm md:text-base">{chapitre?.description}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameState(prev => ({ ...prev, screen: 'jeu' }))}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold shadow-lg"
          >
            Continuer le voyage →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // PAUSE
  // ============================================================
  if (gameState.screen === 'pause' || gameState.isPaused) {
    return (
      <div className="min-h-screen bg-slate-900/95 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-5xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Mission en Pause</h2>
          <p className="text-slate-400 mb-6">Le temps est suspendu. Michel attend ton retour.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setGameState(prev => ({ ...prev, isPaused: false, screen: 'jeu' }))}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Play size={20} /> Reprendre la mission
            </button>
            <button
              onClick={() => setGameState(prev => ({ ...prev, screen: 'accueil', isPaused: false }))}
              className="px-6 py-3 bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Home size={20} /> Abandonner et quitter
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // VICTOIRE
  // ============================================================
  if (gameState.screen === 'victoire') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-2xl animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}>
              {['⭐', '✨', '🎉', '🏆'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center max-w-2xl"
        >
          <div className="text-7xl mb-6 animate-float">🏆</div>
          <h1 className="text-4xl font-bold text-amber-300 text-shadow-gold mb-4">Mission Accomplie !</h1>
          <div className="parchment-bg rounded-lg p-6 vintage-border mb-6">
            <p className="text-amber-900 text-base leading-relaxed">{MESSAGES.victoire}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-effect rounded-lg p-3">
              <Trophy size={24} className="text-amber-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
              <div className="text-xs text-slate-400">Points</div>
            </div>
            <div className="glass-effect rounded-lg p-3">
              <Target size={24} className="text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{gameState.enigmesResolues.length}/{ENIGMES.length}</div>
              <div className="text-xs text-slate-400">Énigmes</div>
            </div>
            <div className="glass-effect rounded-lg p-3">
              <Clock size={24} className="text-blue-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{formatTime(gameState.tempsTotalJoue)}</div>
              <div className="text-xs text-slate-400">Temps</div>
            </div>
            <div className="glass-effect rounded-lg p-3">
              <BookOpen size={24} className="text-purple-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{gameState.leconsConsultees.length}</div>
              <div className="text-xs text-slate-400">Leçons consultées</div>
            </div>
          </div>
          <button
            onClick={() => setGameState(prev => ({ ...prev, screen: 'accueil' }))}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg"
          >
            <RotateCcw size={20} className="inline mr-2" /> Nouvelle Mission
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // DÉFAITE
  // ============================================================
  if (gameState.screen === 'defaite') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-10 text-center max-w-2xl"
        >
          <div className="text-7xl mb-6">⏰</div>
          <h1 className="text-3xl font-bold text-red-300 mb-4">Le Temps est Écoulé</h1>
          <div className="parchment-bg rounded-lg p-6 vintage-border mb-6">
            <p className="text-amber-900 text-base leading-relaxed">{MESSAGES.defaite}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => startGame(gameState.niveau!)}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Réessayer
            </button>
            <button
              onClick={() => setGameState(prev => ({ ...prev, screen: 'accueil' }))}
              className="px-6 py-3 bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Home size={20} /> Accueil
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD ENSEIGNANT
  // ============================================================
  if (gameState.screen === 'dashboard') {
    return <DashboardScreen onBack={() => setGameState(prev => ({ ...prev, screen: 'accueil' }))} />;
  }

  // ============================================================
  // ÉCRAN DE JEU PRINCIPAL
  // ============================================================
  const enigme = getCurrentEnigme();
  const chapitre = CHAPITRES.find(c => c.id === gameState.chapitreActuel);

  if (!enigme || !chapitre) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${chapitre.couleurFond} relative overflow-hidden`}>
      {/* Neige */}
      {snowflakes.slice(0, 15).map(f => (
        <div key={f.id} className="absolute rounded-full bg-white/30 animate-snow"
          style={{ left: `${f.left}%`, width: f.size, height: f.size, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }} />
      ))}

      {/* HUD - Barre supérieure */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-effect px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-300">
              <Trophy size={18} />
              <span className="font-bold text-lg">{gameState.score}</span>
            </div>
            <div className={`flex items-center gap-1 ${gameState.tempsRestant < 60 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
              <Clock size={18} />
              <span className="font-mono font-bold">{formatTime(gameState.tempsRestant)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Ch.{gameState.chapitreActuel}/5</span>
            <button onClick={() => setGameState(prev => ({ ...prev, isPaused: true, screen: 'pause' }))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Pause size={18} className="text-white" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-16 pb-8 px-4 max-w-4xl mx-auto">
        {/* Progression */}
        <div className="mb-6 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Map size={16} className="text-amber-400" />
            <span className="text-sm text-amber-200">{chapitre.lieu}</span>
            <span className="text-xs text-slate-400 ml-auto">Énigme {gameState.enigmeActuelle + 1}/{chapitre.enigmes.length}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((gameState.enigmeActuelle) / ENIGMES.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Carte d'énigme */}
        <motion.div
          key={enigme.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-6 md:p-8"
        >
          {/* Contexte narratif */}
          <div className="mb-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <p className="text-amber-200/80 text-sm italic">📖 {enigme.contexte}</p>
          </div>

          {/* Titre et matière */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              enigme.matiere === 'histoire' ? 'bg-red-900/50 text-red-300' :
              enigme.matiere === 'geographie' ? 'bg-green-900/50 text-green-300' :
              'bg-blue-900/50 text-blue-300'
            }`}>
              {enigme.matiere === 'histoire' ? '📜 Histoire' : enigme.matiere === 'geographie' ? '🌍 Géographie' : '🔬 Sciences'}
            </span>
            <span className="text-xs text-slate-400">• {enigme.tempsLimite}s</span>
            <span className="text-xs text-amber-400 ml-auto">+{enigme.points} pts</span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-white mb-4">{enigme.titre}</h3>
          <p className="text-lg text-slate-200 mb-6">{enigme.question}</p>

          {/* Zone de réponse selon le type */}
          <div className="mb-6">
            {enigme.type === 'qcm' && enigme.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {enigme.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !feedback && setReponse(opt)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      reponse === opt
                        ? feedback === 'correct' ? 'bg-green-600/50 border-2 border-green-400' :
                          feedback === 'incorrect' ? 'bg-red-600/50 border-2 border-red-400 animate-shake' :
                          'bg-amber-600/30 border-2 border-amber-400'
                        : feedback && opt === enigme.reponse ? 'bg-green-600/30 border-2 border-green-400' :
                          'bg-slate-800/50 border border-slate-600 hover:border-amber-400/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-white">{String.fromCharCode(65 + i)}.</span> {opt}
                    {feedback && opt === enigme.reponse && <CheckCircle size={18} className="inline ml-2 text-green-400" />}
                    {feedback === 'incorrect' && reponse === opt && <XCircle size={18} className="inline ml-2 text-red-400" />}
                  </button>
                ))}
              </div>
            )}

            {enigme.type === 'vrai-faux' && (
              <div className="grid grid-cols-2 gap-4">
                {['Vrai', 'Faux'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => !feedback && setReponse(opt)}
                    className={`p-6 rounded-lg text-center font-bold text-lg transition-all ${
                      reponse === opt
                        ? feedback === 'correct' ? 'bg-green-600/50 border-2 border-green-400 text-green-200' :
                          feedback === 'incorrect' ? 'bg-red-600/50 border-2 border-red-400 text-red-200 animate-shake' :
                          'bg-amber-600/30 border-2 border-amber-400 text-amber-200'
                        : 'bg-slate-800/50 border border-slate-600 hover:border-amber-400/50 text-white'
                    }`}
                  >
                    {opt === 'Vrai' ? '✅' : '❌'} {opt}
                  </button>
                ))}
              </div>
            )}

            {(enigme.type === 'texte' || enigme.type === 'code') && (
              <div>
                <input
                  type="text"
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && reponse && !feedback && submitReponse()}
                  disabled={!!feedback}
                  placeholder={enigme.type === 'code' ? 'Entre le mot déchiffré...' : 'Écris ta réponse...'}
                  className={`w-full p-4 rounded-lg bg-slate-800/80 border-2 text-white text-lg placeholder-slate-500 focus:outline-none transition-all ${
                    feedback === 'correct' ? 'border-green-400' :
                    feedback === 'incorrect' ? 'border-red-400 animate-shake' :
                    'border-slate-600 focus:border-amber-400'
                  }`}
                />
              </div>
            )}

            {enigme.type === 'association' && enigme.options && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-3">Associe chaque élément à son continent :</p>
                {enigme.options.map((opt) => (
                  <div key={opt} className="flex items-center gap-3">
                    <span className="text-white font-medium min-w-[80px]">{opt}</span>
                    <span className="text-slate-500">→</span>
                    <select
                      value={selectedAssociation[opt] || ''}
                      onChange={(e) => setSelectedAssociation(prev => ({ ...prev, [opt]: e.target.value }))}
                      className="flex-1 p-2 rounded bg-slate-800 border border-slate-600 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      <option value="Europe">Europe</option>
                      <option value="Asie">Asie</option>
                      <option value="Afrique">Afrique</option>
                      <option value="Amérique">Amérique</option>
                      <option value="Océanie">Océanie</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-4 ${feedback === 'correct' ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}
              >
                <p className={`font-bold ${feedback === 'correct' ? 'text-green-300' : 'text-red-300'}`}>
                  {feedback === 'correct' ? '✅ Excellent ! Bonne réponse !' : '❌ Ce n\'est pas la bonne réponse...'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explication */}
          <AnimatePresence>
            {showExplication && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
              >
                <p className="text-blue-200 text-sm"><strong>📚 Explication :</strong> {enigme.explication}</p>
                <p className="text-blue-300/70 text-xs mt-2">📖 Leçon : {enigme.lecon}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3">
            {!feedback && (
              <button
                onClick={submitReponse}
                disabled={!reponse && enigme.type !== 'association'}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Target size={18} /> Valider
              </button>
            )}
            {showExplication && (
              <button
                onClick={nextEnigme}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ChevronRight size={18} /> Suivant
              </button>
            )}
          </div>

          {/* Indices et Leçon */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={consulterLecon}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  gameState.leconsConsultees.includes(enigme.id)
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                    : 'bg-purple-900/30 text-purple-300 border border-purple-700/50 hover:bg-purple-800/40'
                }`}
              >
                <BookOpen size={16} />
                {gameState.leconsConsultees.includes(enigme.id) ? '📖 Leçon consultée (+bonus)' : '📖 Consulter ma leçon'}
              </button>
            </div>

            {/* Indices */}
            <div className="flex flex-wrap gap-2">
              {enigme.indices.map((indice, i) => (
                <button
                  key={indice.id}
                  onClick={() => utiliserIndice(i)}
                  disabled={gameState.indicesUtilises.includes(indice.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                    gameState.indicesUtilises.includes(indice.id)
                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      : 'bg-yellow-900/20 text-yellow-300 border border-yellow-700/30 hover:bg-yellow-800/30'
                  }`}
                >
                  <HelpCircle size={14} />
                  Indice {i + 1} (-{indice.cout} pts)
                </button>
              ))}
            </div>

            {/* Affichage indice */}
            <AnimatePresence>
              {showIndice !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg"
                >
                  <p className="text-yellow-200 text-sm">💡 {enigme.indices[showIndice].texte}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Affichage leçon */}
            <AnimatePresence>
              {showLecon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-purple-400" />
                    <span className="text-purple-300 font-bold text-sm">Rappel de leçon</span>
                    <span className="text-purple-400/60 text-xs ml-auto">🎁 +{enigme.bonusLecon} pts si tu réponds correctement !</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    📚 <strong>{enigme.lecon}</strong> — Ouvre ton cahier ou ton manuel à la page correspondante pour trouver la réponse. 
                    Les indices ci-dessus t'aident à chercher au bon endroit !
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats en bas */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass-effect rounded-lg p-3 text-center">
            <Award size={16} className="text-amber-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{gameState.enigmesResolues.length}</div>
            <div className="text-xs text-slate-400">Résolues</div>
          </div>
          <div className="glass-effect rounded-lg p-3 text-center">
            <Zap size={16} className="text-yellow-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{gameState.bonusLecons}</div>
            <div className="text-xs text-slate-400">Bonus leçons</div>
          </div>
          <div className="glass-effect rounded-lg p-3 text-center">
            <AlertTriangle size={16} className="text-red-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{gameState.erreurs}</div>
            <div className="text-xs text-slate-400">Erreurs</div>
          </div>
        </div>
      </div>

      {/* Modal Réglages */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            sonActive={gameState.sonActive}
            onToggleSon={() => setGameState(prev => ({ ...prev, sonActive: !prev.sonActive }))}
            onClose={() => setShowSettings(false)}
            onQuit={() => { setShowSettings(false); setGameState(prev => ({ ...prev, screen: 'accueil', isPaused: false })); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// COMPOSANTS MODAUX
// ============================================================

function DashboardModal({ code, setCode, onClose, onOpen }: {
  code: string; setCode: (v: string) => void; onClose: () => void; onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="glass-effect rounded-2xl p-8 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <Shield size={40} className="text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white">Espace Enseignant</h3>
          <p className="text-slate-400 text-sm mt-1">Entrez le code d'accès</p>
        </div>
        <input
          type="password"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Code d'accès..."
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-center text-lg focus:border-amber-400 focus:outline-none mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium">
            Annuler
          </button>
          <button
            onClick={onOpen}
            disabled={code !== CONFIG.codeDashboard}
            className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold disabled:opacity-50"
          >
            {code === CONFIG.codeDashboard ? <Unlock size={18} className="inline mr-1" /> : <Lock size={18} className="inline mr-1" />}
            Accéder
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center mt-3">Code par défaut : {CONFIG.codeDashboard}</p>
      </motion.div>
    </motion.div>
  );
}

function SettingsModal({ sonActive, onToggleSon, onClose, onQuit }: {
  sonActive: boolean; onToggleSon: () => void; onClose: () => void; onQuit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="glass-effect rounded-2xl p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings size={24} /> Réglages
        </h3>
        <div className="space-y-4">
          <button
            onClick={onToggleSon}
            className="w-full p-3 bg-slate-800 rounded-lg flex items-center justify-between text-white hover:bg-slate-700 transition-colors"
          >
            <span>Son</span>
            {sonActive ? <Volume2 size={20} className="text-green-400" /> : <VolumeX size={20} className="text-red-400" />}
          </button>
          <button
            onClick={onQuit}
            className="w-full p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center justify-between text-red-300 hover:bg-red-900/50 transition-colors"
          >
            <span>Quitter la partie</span>
            <Home size={20} />
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-2 bg-slate-700 text-white rounded-lg font-medium">
          Fermer
        </button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// DASHBOARD ENSEIGNANT
// ============================================================
function DashboardScreen({ onBack }: { onBack: () => void }) {
  const [stats] = useState({
    partiesJouees: 12,
    scoreMoyen: 1450,
    enigmesResolues: 85,
    tauxReussite: 72,
    tempsMoyen: '28 min',
    matieres: { histoire: 35, geographie: 33, sciences: 32 },
    niveaux: { apprenti: 4, eclaireur: 3, capitaine: 3, messager: 1, heros: 1 },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 size={32} className="text-amber-400" />
              Dashboard Enseignant
            </h1>
            <p className="text-slate-400 mt-1">Suivi des performances des élèves</p>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Home size={18} /> Retour
          </button>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Parties jouées', value: stats.partiesJouees, icon: <Play size={20} />, color: 'text-blue-400' },
            { label: 'Score moyen', value: stats.scoreMoyen, icon: <Trophy size={20} />, color: 'text-amber-400' },
            { label: 'Taux de réussite', value: `${stats.tauxReussite}%`, icon: <Target size={20} />, color: 'text-green-400' },
            { label: 'Temps moyen', value: stats.tempsMoyen, icon: <Clock size={20} />, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-effect rounded-xl p-4"
            >
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Répartition par matière */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Répartition par matière</h3>
            <div className="space-y-3">
              {[
                { matiere: 'Histoire', pct: stats.matieres.histoire, color: 'bg-red-500' },
                { matiere: 'Géographie', pct: stats.matieres.geographie, color: 'bg-green-500' },
                { matiere: 'Sciences', pct: stats.matieres.sciences, color: 'bg-blue-500' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{m.matiere}</span>
                    <span className="text-slate-400">{m.pct}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                      className={`h-full ${m.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Répartition par niveau</h3>
            <div className="space-y-2">
              {NIVEAUX.map(n => (
                <div key={n.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{n.icon}</span>
                    <span className="text-slate-300 text-sm">{n.nom}</span>
                  </div>
                  <span className="text-amber-400 font-bold">
                    {stats.niveaux[n.id as keyof typeof stats.niveaux]} parties
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progression chapitres */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Progression par chapitre</h3>
          <div className="grid grid-cols-5 gap-2">
            {CHAPITRES.map(ch => (
              <div key={ch.id} className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl mb-1">
                  {ch.id === 1 && '🏛️'}
                  {ch.id === 2 && '🏔️'}
                  {ch.id === 3 && '🐎'}
                  {ch.id === 4 && '🏔️'}
                  {ch.id === 5 && '🏰'}
                </div>
                <div className="text-xs text-slate-400 truncate">{ch.titre}</div>
                <div className="text-sm font-bold text-green-400 mt-1">
                  {Math.floor(60 + Math.random() * 40)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💡 Recommandations pédagogiques</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Points forts :</strong> Les élèves réussissent bien les énigmes de géographie (orientation, climats). 
                Ils consultent régulièrement leurs leçons avant de répondre.
              </p>
            </div>
            <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <p className="text-amber-200 text-sm">
                <strong>Points à améliorer :</strong> Les énigmes de sciences sur les changements d'état et le corps humain 
                nécessitent un rappel en classe. Encourager la consultation des leçons avant de répondre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
