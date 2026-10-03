import { useState, useEffect, useRef } from 'react';
import { NIVEAUX, CHAPITRES, ENIGMES, CONFIG, MESSAGES } from './data/gameData';

type Screen = 'accueil' | 'niveau' | 'intro' | 'jeu' | 'transition' | 'victoire' | 'defaite' | 'dashboard' | 'pause';

interface GS {
  screen: Screen;
  niveauId: string;
  ch: number;
  en: number;
  score: number;
  temps: number;
  indices: string[];
  resolues: string[];
  erreurs: number;
  lecons: string[];
  bonus: number;
  pause: boolean;
  tempsJoue: number;
}

const init: GS = {
  screen: 'accueil', niveauId: '', ch: 1, en: 0, score: 0, temps: 0,
  indices: [], resolues: [], erreurs: 0, lecons: [], bonus: 0, pause: false, tempsJoue: 0
};

export default function App() {
  const [gs, setGs] = useState<GS>(init);
  const [rep, setRep] = useState('');
  const [fb, setFb] = useState<'ok' | 'ko' | null>(null);
  const [indShow, setIndShow] = useState<number | null>(null);
  const [lecShow, setLecShow] = useState(false);
  const [expShow, setExpShow] = useState(false);
  const [assoc, setAssoc] = useState<Record<string, string>>({});
  const [codeD, setCodeD] = useState('');
  const [dashOpen, setDashOpen] = useState(false);
  const [settOpen, setSettOpen] = useState(false);
  const timer = useRef<any>(null);

  const niv = NIVEAUX.find(n => n.id === gs.niveauId) || NIVEAUX[0];
  const chap = CHAPITRES.find(c => c.id === gs.ch) || CHAPITRES[0];
  const enig = ENIGMES.find(e => e.id === chap.enigmes[gs.en]) || ENIGMES[0];

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (gs.screen === 'jeu' && !gs.pause && gs.temps > 0) {
      timer.current = setInterval(() => {
        setGs(p => p.temps <= 1 ? { ...p, temps: 0, screen: 'defaite' } : { ...p, temps: p.temps - 1, tempsJoue: p.tempsJoue + 1 });
      }, 1000);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [gs.screen, gs.pause, gs.temps]);

  const start = (id: string) => {
    const n = NIVEAUX.find(x => x.id === id) || NIVEAUX[0];
    const t = CONFIG.tempsTotal[id as keyof typeof CONFIG.tempsTotal] + n.tempsBonus;
    setGs({ ...init, screen: 'intro', niveauId: id, temps: t });
  };

  const submit = () => {
    let ok = false;
    if (enig.type === 'qcm' || enig.type === 'vrai-faux') ok = rep === enig.reponse;
    else if (enig.type === 'texte' || enig.type === 'code') {
      const n = rep.toLowerCase().replace(/[^a-z0-9]/g, '');
      const e = (enig.reponse as string).toLowerCase().replace(/[^a-z0-9]/g, '');
      ok = n === e || (enig.reponsesPossibles?.some(r => r.toLowerCase().replace(/[^a-z0-9]/g, '').includes(n)) ?? false);
    } else if (enig.type === 'association') {
      ok = Object.entries(assoc).every(([k, v]) => {
        const parts = (enig.reponse as string).split(';');
        return parts.some(p => { const [c, i] = p.split(':'); return i.split(',').includes(k) && c === v; });
      }) && Object.keys(assoc).length === (enig.options?.length || 0);
    }
    if (ok) {
      const pts = Math.floor(enig.points * niv.pointsMultiplier) + (gs.lecons.includes(enig.id) ? enig.bonusLecon : 0);
      setFb('ok');
      setGs(p => ({ ...p, score: p.score + pts, resolues: [...p.resolues, enig.id], bonus: p.bonus + (p.lecons.includes(enig.id) ? enig.bonusLecon : 0) }));
    } else {
      setFb('ko');
      setGs(p => ({ ...p, score: Math.max(0, p.score - enig.penaliteErreur), erreurs: p.erreurs + 1 }));
    }
    setTimeout(() => { setFb(null); setExpShow(true); }, 1500);
  };

  const next = () => {
    setRep(''); setExpShow(false); setIndShow(null); setLecShow(false); setAssoc({});
    if (gs.en < chap.enigmes.length - 1) setGs(p => ({ ...p, en: p.en + 1 }));
    else if (gs.ch < CHAPITRES.length) setGs(p => ({ ...p, screen: 'transition', ch: p.ch + 1, en: 0 }));
    else setGs(p => ({ ...p, screen: 'victoire' }));
  };

  const useInd = (i: number) => {
    const ind = enig.indices[i];
    if (!ind || gs.indices.includes(ind.id)) return;
    setGs(p => ({ ...p, score: Math.max(0, p.score - ind.cout), indices: [...p.indices, ind.id] }));
    setIndShow(i);
  };

  const useLec = () => {
    if (!gs.lecons.includes(enig.id)) setGs(p => ({ ...p, lecons: [...p.lecons, enig.id] }));
    setLecShow(true);
  };

  const snow = Array.from({ length: 20 }, (_, i) => i);

  // ===== ACCUEIL =====
  if (gs.screen === 'accueil') return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {snow.map(i => <div key={i} className="absolute rounded-full bg-white/60 animate-snow" style={{ left: `${Math.random() * 100}%`, width: 3, height: 3, animationDelay: `${Math.random() * 10}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-green-500/10 via-purple-500/20 to-cyan-500/10 animate-aurora blur-3xl" />
      <div className="text-center z-10">
        <div className="text-6xl mb-4 animate-float">🐎</div>
        <h1 className="text-5xl font-bold text-amber-300 mb-2" style={{ fontFamily: 'Georgia,serif', textShadow: '0 0 10px rgba(255,200,50,0.5)' }}>Michel Strogoff</h1>
        <p className="text-xl text-amber-100/80 italic mb-2">Le Courrier du Tsar</p>
        <p className="text-sm text-slate-400 mb-8">D'après Jules Verne — Escape Game Éducatif</p>
        <div className="max-w-2xl mx-auto parchment-bg rounded-lg p-6 vintage-border mb-8">
          <p className="text-amber-900 text-sm leading-relaxed">{MESSAGES.intro.split('\n\n').map((p, i) => <span key={i}>{p}{i < 2 && <><br /><br /></>}</span>)}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setGs(p => ({ ...p, screen: 'niveau' }))} className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg">▶ Commencer l'Aventure</button>
          <button onClick={() => setDashOpen(true)} className="px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 rounded-lg font-bold shadow-lg">🛡️ Espace Enseignant</button>
        </div>
      </div>
      {dashOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setDashOpen(false)}>
          <div className="glass-effect rounded-2xl p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-xl font-bold text-white">Espace Enseignant</h3>
              <p className="text-slate-400 text-sm mt-1">Entrez le code d'accès</p>
            </div>
            <input type="password" value={codeD} onChange={e => setCodeD(e.target.value)} placeholder="Code..." className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-center text-lg mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setDashOpen(false)} className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-lg">Annuler</button>
              <button onClick={() => { if (codeD === CONFIG.codeDashboard) { setDashOpen(false); setGs(p => ({ ...p, screen: 'dashboard' })); } }} className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold">
                {codeD === CONFIG.codeDashboard ? '🔓 Accéder' : '🔒 Entrer'}
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">Code : {CONFIG.codeDashboard}</p>
          </div>
        </div>
      )}
    </div>
  );

  // ===== NIVEAU =====
  if (gs.screen === 'niveau') return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {snow.map(i => <div key={i} className="absolute rounded-full bg-white/60 animate-snow" style={{ left: `${Math.random() * 100}%`, width: 3, height: 3, animationDelay: `${Math.random() * 10}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
      <div className="z-10 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-amber-300 text-center mb-2">Choisis ton Rang</h2>
        <p className="text-slate-400 text-center mb-8">Plus le rang est élevé, plus le défi est grand...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NIVEAUX.map(n => (
            <button key={n.id} onClick={() => start(n.id)} className={`p-5 rounded-xl bg-gradient-to-br ${n.color} text-white shadow-xl text-left hover:scale-105 transition-transform`}>
              <div className="text-3xl mb-2">{n.icon}</div>
              <h3 className="font-bold text-lg mb-1">{n.nom}</h3>
              <p className="text-sm text-white/80 mb-2">{n.description}</p>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>⭐ ×{n.pointsMultiplier}</span>
                <span className="ml-2">⏱️ {fmt(CONFIG.tempsTotal[n.id as keyof typeof CONFIG.tempsTotal] + n.tempsBonus)}</span>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => setGs(p => ({ ...p, screen: 'accueil' }))} className="mt-8 text-slate-400 hover:text-white flex items-center gap-2 mx-auto">← Retour</button>
      </div>
    </div>
  );

  // ===== INTRO =====
  if (gs.screen === 'intro') return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-blue-900/20" />
      <div className="text-center z-10 p-8 max-w-3xl">
        <div className="text-8xl mb-8">📜</div>
        <h2 className="text-4xl font-bold text-amber-300 mb-6">Mission Conférée</h2>
        <div className="parchment-bg rounded-lg p-6 vintage-border">
          <p className="text-amber-900 text-lg leading-relaxed italic">
            "Michel Strogoff, toi qui as prouvé ta valeur, je te confie cette mission secrète. Porte ce message au grand-duc d'Irkoutsk. La Russie compte sur toi."<br /><br />
            <span className="font-bold">— Alexandre II, Tsar de toutes les Russies</span>
          </p>
        </div>
        <p className="text-amber-200/60 mt-6 mb-2">Rang : {niv.icon} {niv.nom}</p>
        <p className="text-amber-200/60 mb-6">Temps : {fmt(gs.temps)}</p>
        <button onClick={() => setGs(p => ({ ...p, screen: 'jeu' }))} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg">Partir en Mission →</button>
      </div>
    </div>
  );

  // ===== TRANSITION =====
  if (gs.screen === 'transition') return (
    <div className={`min-h-screen bg-gradient-to-b ${chap.couleurFond} relative overflow-hidden flex items-center justify-center`}>
      {snow.map(i => <div key={i} className="absolute rounded-full bg-white/30 animate-snow" style={{ left: `${Math.random() * 100}%`, width: 3, height: 3, animationDelay: `${Math.random() * 10}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
      <div className="text-center z-10 p-8 max-w-2xl">
        <div className="text-6xl mb-6 animate-float">{['', '🏛️', '🏔️', '🐎', '🏔️', '🏰'][gs.ch]}</div>
        <h2 className="text-3xl font-bold text-white mb-3">Chapitre {gs.ch}</h2>
        <h3 className="text-2xl text-amber-300 mb-4">{chap.titre}</h3>
        <p className="text-white/80 mb-2 italic">{chap.lieu}</p>
        <p className="text-white/70 mb-6">{chap.description}</p>
        <button onClick={() => setGs(p => ({ ...p, screen: 'jeu' }))} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold shadow-lg">Continuer →</button>
      </div>
    </div>
  );

  // ===== PAUSE =====
  if (gs.screen === 'pause') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⏸️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Mission en Pause</h2>
        <p className="text-slate-400 mb-6">Le temps est suspendu.</p>
        <button onClick={() => setGs(p => ({ ...p, pause: false, screen: 'jeu' }))} className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold mb-3">▶ Reprendre</button>
        <button onClick={() => setGs(init)} className="w-full px-6 py-3 bg-slate-700 text-slate-200 rounded-lg font-bold">🏠 Quitter</button>
      </div>
    </div>
  );

  // ===== VICTOIRE =====
  if (gs.screen === 'victoire') return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      <div className="z-10 text-center max-w-2xl">
        <div className="text-7xl mb-6 animate-float">🏆</div>
        <h1 className="text-4xl font-bold text-amber-300 mb-4">Mission Accomplie !</h1>
        <div className="parchment-bg rounded-lg p-6 vintage-border mb-6">
          <p className="text-amber-900 text-base leading-relaxed">{MESSAGES.victoire}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-effect rounded-lg p-3"><div className="text-2xl">🏆</div><div className="text-xl font-bold text-white">{gs.score}</div><div className="text-xs text-slate-400">Points</div></div>
          <div className="glass-effect rounded-lg p-3"><div className="text-2xl">🎯</div><div className="text-xl font-bold text-white">{gs.resolues.length}/{ENIGMES.length}</div><div className="text-xs text-slate-400">Énigmes</div></div>
          <div className="glass-effect rounded-lg p-3"><div className="text-2xl">⏱️</div><div className="text-xl font-bold text-white">{fmt(gs.tempsJoue)}</div><div className="text-xs text-slate-400">Temps</div></div>
          <div className="glass-effect rounded-lg p-3"><div className="text-2xl">📖</div><div className="text-xl font-bold text-white">{gs.lecons.length}</div><div className="text-xs text-slate-400">Leçons</div></div>
        </div>
        <button onClick={() => setGs(init)} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold text-lg shadow-lg">🔄 Nouvelle Mission</button>
      </div>
    </div>
  );

  // ===== DEFAITE =====
  if (gs.screen === 'defaite') return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="text-7xl mb-6">⏰</div>
        <h1 className="text-3xl font-bold text-red-300 mb-4">Le Temps est Écoulé</h1>
        <div className="parchment-bg rounded-lg p-6 vintage-border mb-6">
          <p className="text-amber-900 text-base leading-relaxed">{MESSAGES.defaite}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => start(gs.niveauId)} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold">🔄 Réessayer</button>
          <button onClick={() => setGs(init)} className="px-6 py-3 bg-slate-700 text-slate-200 rounded-lg font-bold">🏠 Accueil</button>
        </div>
      </div>
    </div>
  );

  // ===== DASHBOARD =====
  if (gs.screen === 'dashboard') return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">📊 Dashboard Enseignant</h1>
          <button onClick={() => setGs(init)} className="px-4 py-2 bg-slate-700 text-white rounded-lg">🏠 Retour</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ l: 'Parties', v: '12', i: '🎮' }, { l: 'Score moyen', v: '1450', i: '🏆' }, { l: 'Réussite', v: '72%', i: '🎯' }, { l: 'Temps moyen', v: '28 min', i: '⏱️' }].map((s, i) => (
            <div key={i} className="glass-effect rounded-xl p-4">
              <div className="text-2xl mb-2">{s.i}</div>
              <div className="text-2xl font-bold text-white">{s.v}</div>
              <div className="text-xs text-slate-400">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par matière</h3>
            {[{ m: 'Histoire', p: 35, c: 'bg-red-500' }, { m: 'Géographie', p: 33, c: 'bg-green-500' }, { m: 'Sciences', p: 32, c: 'bg-blue-500' }].map((x, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{x.m}</span><span className="text-slate-400">{x.p}%</span></div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${x.c} rounded-full`} style={{ width: `${x.p}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Par niveau</h3>
            {NIVEAUX.map(n => (
              <div key={n.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg mb-2">
                <div className="flex items-center gap-2"><span className="text-lg">{n.icon}</span><span className="text-slate-300 text-sm">{n.nom}</span></div>
                <span className="text-amber-400 font-bold">{Math.floor(Math.random() * 5) + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💡 Recommandations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg"><p className="text-blue-200 text-sm"><strong>Points forts :</strong> Bonne réussite en géographie. Les élèves consultent leurs leçons.</p></div>
            <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg"><p className="text-amber-200 text-sm"><strong>À améliorer :</strong> Les sciences (changements d'état, corps humain) nécessitent un rappel.</p></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== JEU =====
  return (
    <div className={`min-h-screen bg-gradient-to-b ${chap.couleurFond} relative overflow-hidden`}>
      {snow.slice(0, 10).map(i => <div key={i} className="absolute rounded-full bg-white/30 animate-snow" style={{ left: `${Math.random() * 100}%`, width: 3, height: 3, animationDelay: `${Math.random() * 10}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}

      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-effect px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-300"><span>🏆</span><span className="font-bold text-lg">{gs.score}</span></div>
            <div className={`flex items-center gap-1 ${gs.temps < 60 ? 'text-red-400' : 'text-blue-300'}`}><span>⏱️</span><span className="font-mono font-bold">{fmt(gs.temps)}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Ch.{gs.ch}/5</span>
            <button onClick={() => setGs(p => ({ ...p, pause: true, screen: 'pause' }))} className="p-2 hover:bg-white/10 rounded-lg"><span className="text-white">⏸️</span></button>
            <button onClick={() => setSettOpen(true)} className="p-2 hover:bg-white/10 rounded-lg"><span className="text-white">⚙️</span></button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <div className="mb-6 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400">🗺️</span>
            <span className="text-sm text-amber-200">{chap.lieu}</span>
            <span className="text-xs text-slate-400 ml-auto">Énigme {gs.en + 1}/{chap.enigmes.length}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all" style={{ width: `${((gs.ch - 1) * 4 + gs.en) / ENIGMES.length * 100}%` }} />
          </div>
        </div>

        <div key={enig.id} className="glass-effect rounded-2xl p-6 md:p-8">
          <div className="mb-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <p className="text-amber-200/80 text-sm italic">📖 {enig.contexte}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-bold ${enig.matiere === 'histoire' ? 'bg-red-900/50 text-red-300' : enig.matiere === 'geographie' ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'}`}>
              {enig.matiere === 'histoire' ? '📜 Histoire' : enig.matiere === 'geographie' ? '🌍 Géo' : '🔬 Sciences'}
            </span>
            <span className="text-xs text-slate-400">⏱️ {enig.tempsLimite}s</span>
            <span className="text-xs text-amber-400 ml-auto">+{enig.points} pts</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">{enig.titre}</h3>
          <p className="text-lg text-slate-200 mb-6">{enig.question}</p>

          {/* Réponses */}
          <div className="mb-6">
            {enig.type === 'qcm' && enig.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {enig.options.map((opt: string, i: number) => (
                  <button key={i} onClick={() => !fb && setRep(opt)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      rep === opt ? (fb === 'ok' ? 'bg-green-600/50 border-2 border-green-400' : fb === 'ko' ? 'bg-red-600/50 border-2 border-red-400' : 'bg-amber-600/30 border-2 border-amber-400')
                        : fb && opt === enig.reponse ? 'bg-green-600/30 border-2 border-green-400' : 'bg-slate-800/50 border border-slate-600 hover:border-amber-400/50'
                    }`}>
                    <span className="text-white">{String.fromCharCode(65 + i)}.</span> {opt}
                    {fb && opt === enig.reponse && <span className="ml-2 text-green-400">✓</span>}
                    {fb === 'ko' && rep === opt && <span className="ml-2 text-red-400">✗</span>}
                  </button>
                ))}
              </div>
            )}
            {enig.type === 'vrai-faux' && (
              <div className="grid grid-cols-2 gap-4">
                {['Vrai', 'Faux'].map(opt => (
                  <button key={opt} onClick={() => !fb && setRep(opt)}
                    className={`p-6 rounded-lg text-center font-bold text-lg transition-all ${
                      rep === opt ? (fb === 'ok' ? 'bg-green-600/50 border-2 border-green-400 text-green-200' : fb === 'ko' ? 'bg-red-600/50 border-2 border-red-400 text-red-200' : 'bg-amber-600/30 border-2 border-amber-400 text-amber-200')
                        : 'bg-slate-800/50 border border-slate-600 hover:border-amber-400/50 text-white'
                    }`}>
                    {opt === 'Vrai' ? '✅' : '❌'} {opt}
                  </button>
                ))}
              </div>
            )}
            {(enig.type === 'texte' || enig.type === 'code') && (
              <input type="text" value={rep} onChange={e => setRep(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && rep && !fb && submit()}
                disabled={!!fb} placeholder={enig.type === 'code' ? 'Mot déchiffré...' : 'Ta réponse...'}
                className={`w-full p-4 rounded-lg bg-slate-800/80 border-2 text-white text-lg placeholder-slate-500 focus:outline-none ${fb === 'ok' ? 'border-green-400' : fb === 'ko' ? 'border-red-400' : 'border-slate-600 focus:border-amber-400'}`} />
            )}
            {enig.type === 'association' && enig.options && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-3">Associe chaque élément à son continent :</p>
                {enig.options.map((opt: string) => (
                  <div key={opt} className="flex items-center gap-3">
                    <span className="text-white font-medium min-w-[80px]">{opt}</span>
                    <span className="text-slate-500">→</span>
                    <select value={assoc[opt] || ''} onChange={e => setAssoc(p => ({ ...p, [opt]: e.target.value }))}
                      className="flex-1 p-2 rounded bg-slate-800 border border-slate-600 text-white">
                      <option value="">-- Choisir --</option>
                      <option value="Europe">Europe</option><option value="Asie">Asie</option>
                      <option value="Afrique">Afrique</option><option value="Amérique">Amérique</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fb && (
            <div className={`p-4 rounded-lg mb-4 ${fb === 'ok' ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
              <p className={`font-bold ${fb === 'ok' ? 'text-green-300' : 'text-red-300'}`}>{fb === 'ok' ? '✅ Excellent !' : '❌ Pas la bonne réponse...'}</p>
            </div>
          )}

          {expShow && (
            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm"><strong>📚 Explication :</strong> {enig.explication}</p>
              <p className="text-blue-300/70 text-xs mt-2">📖 Leçon : {enig.lecon}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!fb && <button onClick={submit} disabled={!rep && enig.type !== 'association'} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-bold disabled:opacity-50">🎯 Valider</button>}
            {expShow && <button onClick={next} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold">Suivant →</button>}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <button onClick={useLec} className={`px-4 py-2 rounded-lg text-sm font-medium mb-3 ${gs.lecons.includes(enig.id) ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-purple-900/30 text-purple-300 border border-purple-700/50'}`}>
              📖 {gs.lecons.includes(enig.id) ? 'Leçon consultée (+bonus)' : 'Consulter ma leçon'}
            </button>
            <div className="flex flex-wrap gap-2">
              {enig.indices.map((ind, i) => (
                <button key={ind.id} onClick={() => useInd(i)} disabled={gs.indices.includes(ind.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium ${gs.indices.includes(ind.id) ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-900/20 text-yellow-300 hover:bg-yellow-800/30'}`}>
                  💡 Indice {i + 1} (-{ind.cout} pts)
                </button>
              ))}
            </div>
            {indShow !== null && <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg"><p className="text-yellow-200 text-sm">💡 {enig.indices[indShow].texte}</p></div>}
            {lecShow && (
              <div className="mt-3 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <p className="text-purple-300 font-bold text-sm mb-2">📖 Rappel de leçon <span className="text-purple-400/60 text-xs">🎁 +{enig.bonusLecon} pts si bonne réponse !</span></p>
                <p className="text-purple-200 text-sm">📚 <strong>{enig.lecon}</strong> — Ouvre ton cahier ou manuel pour trouver la réponse !</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass-effect rounded-lg p-3 text-center"><div className="text-amber-400">🏅</div><div className="text-sm font-bold text-white">{gs.resolues.length}</div><div className="text-xs text-slate-400">Résolues</div></div>
          <div className="glass-effect rounded-lg p-3 text-center"><div className="text-yellow-400">⚡</div><div className="text-sm font-bold text-white">{gs.bonus}</div><div className="text-xs text-slate-400">Bonus</div></div>
          <div className="glass-effect rounded-lg p-3 text-center"><div className="text-red-400">⚠️</div><div className="text-sm font-bold text-white">{gs.erreurs}</div><div className="text-xs text-slate-400">Erreurs</div></div>
        </div>
      </div>

      {settOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSettOpen(false)}>
          <div className="glass-effect rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">⚙️ Réglages</h3>
            <button onClick={() => { setSettOpen(false); setGs(init); }} className="w-full p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 mb-3">🏠 Quitter la partie</button>
            <button onClick={() => setSettOpen(false)} className="w-full py-2 bg-slate-700 text-white rounded-lg">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
