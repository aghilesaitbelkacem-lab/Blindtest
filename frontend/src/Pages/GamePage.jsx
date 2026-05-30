import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600&display=swap');

  :root {
    --bg: #0a0a0f;
    --card: #13131a;
    --border: #222230;
    --accent: #ff3d6e;
    --accent2: #ff9a3c;
    --text: #f0f0f0;
    --muted: #666;
    --green: #2ecc71;
    --red: #e74c3c;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .game-wrapper {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
  }

  .game-wrapper::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,61,110,0.08) 0%, transparent 70%);
    top: -150px; left: -150px;
    border-radius: 50%;
    pointer-events: none;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 580px;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }

  .manche-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 3px;
    color: var(--text);
  }

  .manche-label span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .score-badge {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: var(--muted);
  }
  .score-badge span { color: var(--accent2); }

  .progress-bar-bg {
    width: 100%;
    max-width: 580px;
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(to right, var(--accent), var(--accent2));
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  .game-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 25px;
    width: 100%;
    max-width: 580px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  /* Lecteur audio */
  .player-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: #0a0a0f;
    border: 1px solid var(--border);
    border-radius: 16px;
  }

  .player-question {
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    text-align: center;
  }

  .play-btn {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-size: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 24px rgba(255,61,110,0.4);
  }

  .play-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 0 40px rgba(255,61,110,0.6);
  }

  .audio-progress-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .audio-progress-bg {
    flex: 1;
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .audio-progress-fill {
    height: 100%;
    background: linear-gradient(to right, var(--accent), var(--accent2));
    border-radius: 3px;
    transition: width 1s linear;
  }

  .audio-time {
    font-size: 13px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    min-width: 32px;
    text-align: center;
  }

  .audio-waves {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 24px;
  }

  .wave-bar {
    width: 4px;
    border-radius: 2px;
    background: linear-gradient(to top, var(--accent), var(--accent2));
    animation: waveAnim 0.8s ease-in-out infinite;
  }

  .wave-bar:nth-child(1) { height: 8px;  animation-delay: 0s; }
  .wave-bar:nth-child(2) { height: 18px; animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { height: 24px; animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { height: 14px; animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { height: 20px; animation-delay: 0.4s; }

  @keyframes waveAnim {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
  }

  /* Choix */
  .choix-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .choix-btn {
    width: 100%;
    padding: 12px 16px;
    background: #0a0a0f;
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 400;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  /* Survol seulement si pas encore validé */
  .choix-btn:hover:not(:disabled):not(.selected):not(.correct):not(.wrong) {
    border-color: rgba(255,61,110,0.4);
    background: rgba(255,61,110,0.04);
  }

  /* Sélectionné mais pas encore validé */
  .choix-btn.selected {
    border-color: var(--accent2);
    background: rgba(255,154,60,0.12);
    color: var(--accent2);
    font-weight: 600;
  }

  /* Après validation */
  .choix-btn.correct {
    border-color: var(--green);
    background: rgba(46, 204, 113, 0.12);
    color: var(--green);
    font-weight: 600;
  }

  .choix-btn.wrong {
    border-color: var(--red);
    background: rgba(231, 76, 60, 0.12);
    color: var(--red);
  }

  .choix-btn:disabled { cursor: default; }

  .choix-index {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
    color: var(--muted);
    min-width: 22px;
    transition: color 0.2s;
  }

  .choix-btn.selected .choix-index { color: var(--accent2); }
  .choix-btn.correct .choix-index,
  .choix-btn.wrong .choix-index { color: inherit; }

  /* Bouton Valider */
  .valider-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 0 24px rgba(255,61,110,0.35);
  }

  .valider-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(255,61,110,0.55);
  }

  .valider-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Bouton Suivant */
  .next-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 24px rgba(255,61,110,0.35);
    animation: fadeIn 0.3s ease;
  }

  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(255,61,110,0.55);
  }

  /* Feedback */
  .feedback {
    text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    padding: 14px 20px;
    border-radius: 12px;
    animation: fadeIn 0.3s ease;
  }

  .feedback.ok {
    color: var(--green);
    background: rgba(46, 204, 113, 0.08);
    border: 1px solid rgba(46, 204, 113, 0.2);
  }

  .feedback.ko {
    color: var(--red);
    background: rgba(231, 76, 60, 0.08);
    border: 1px solid rgba(231, 76, 60, 0.2);
  }

  .feedback .bonne-reponse {
    display: block;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    letter-spacing: 1px;
    margin-top: 6px;
    opacity: 0.85;
  }

  .artiste-reveal {
    text-align: center;
    font-size: 14px;
    color: var(--muted);
    letter-spacing: 1px;
    animation: fadeIn 0.3s ease;
  }

  .artiste-reveal span {
    color: var(--accent2);
    font-weight: 600;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Chargement */
  .loading-wrapper {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-family: 'Outfit', sans-serif;
  }

  .spinner {
    width: 56px; height: 56px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    letter-spacing: 4px;
    color: var(--muted);
  }

  .loading-text span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .loading-hint { font-size: 13px; color: var(--muted); letter-spacing: 1px; }

  @keyframes spin { to { transform: rotate(360deg); } }

  .error-wrapper {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    text-align: center;
    padding: 15px;
  }

  .error-icon { font-size: 64px; }
  .error-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    letter-spacing: 3px;
    color: var(--accent);
  }
  .error-msg { color: var(--muted); font-size: 15px; max-width: 400px; }
  .retry-btn {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    border: none;
    padding: 14px 40px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
  }
     .note {
    position: absolute;
    font-size: 80px;
    opacity: 0.04;
    pointer-events: none;
    user-select: none;
    font-family: serif;
  }

  .note-1 { top: 10%; left: 5%; font-size: 120px; }
  .note-2 { top: 60%; left: 8%; font-size: 80px; }
  .note-3 { top: 15%; right: 6%; font-size: 100px; }
  .note-4 { bottom: 10%; right: 10%; font-size: 90px; }
`;

const DUREE_AUDIO = 30;

function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pseudo, genres, difficulte } = location.state || {};

  const [chansons, setChansons]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [erreur, setErreur]                 = useState(null);
  const [mancheIndex, setMancheIndex]       = useState(0);
  const [score, setScore]                   = useState(0);
  const [manches, setManches]               = useState([]);

  // Phase : 'ecoute' | 'selection' | 'valide'
  // ecoute   = joueur écoute, aucun choix fait
  // selection = joueur a cliqué un choix mais pas encore validé
  // valide   = joueur a cliqué Valider → on révèle le résultat
  const [phase, setPhase]                   = useState('ecoute');
  const [reponseSelectionnee, setReponseSelectionnee] = useState(null); // choix surligné
  const [reponseValidee, setReponseValidee]           = useState(null); // choix confirmé
  const [isPlaying, setIsPlaying]           = useState(false);
  const [tempsEcoule, setTempsEcoule]       = useState(0);

  const audioRef    = useRef(null);
  const intervalRef = useRef(null);

  // Appel Flask
  useEffect(() => {
    const fetchChansons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/chansons', {
          params: {
            genres:     genres ? genres.join(',') : 'pop',
            difficulte: difficulte || 'facile'
          }
        });
        setChansons(response.data);
        setLoading(false);
      } catch (err) {
        setErreur('Impossible de charger les chansons. Vérifie que Flask tourne bien sur le port 5000.');
        setLoading(false);
      }
    };
    fetchChansons();
  }, []);

  // Reset à chaque nouvelle manche
  useEffect(() => {
    setPhase('ecoute');
    setReponseSelectionnee(null);
    setReponseValidee(null);
    setIsPlaying(false);
    setTempsEcoule(0);
    clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [mancheIndex]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setTempsEcoule(prev => {
          if (prev >= DUREE_AUDIO) {
            clearInterval(intervalRef.current);
            return DUREE_AUDIO;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setTempsEcoule(DUREE_AUDIO);
    clearInterval(intervalRef.current);
  };

  // Étape 1 : joueur clique sur un choix → on le surligne
  const handleSelectChoix = (choix) => {
    if (phase === 'valide') return;
    setReponseSelectionnee(choix);
    setPhase('selection');
  };

  // Étape 2 : joueur clique Valider → on révèle le résultat
  const handleValider = () => {
    if (!reponseSelectionnee || phase === 'valide') return;

    const chanson = chansons[mancheIndex];
    const correct = reponseSelectionnee === chanson.titre;

    setReponseValidee(reponseSelectionnee);
    setPhase('valide');
    if (correct) setScore(prev => prev + 1);

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    clearInterval(intervalRef.current);

    // Enregistre la manche
    setManches(prev => [...prev, {
      numero:        mancheIndex + 1,
      titre:         chanson.titre,
      artiste:       chanson.artiste,
      cover:         chanson.cover,
      bonneReponse:  chanson.titre,
      reponseJoueur: reponseSelectionnee,
      correct,
    }]);
  };

  // Manche suivante ou fin
  const handleSuivant = () => {
    if (mancheIndex + 1 >= chansons.length) {
      navigate('/result', { state: { pseudo, score, manches } });
    } else {
      setMancheIndex(prev => prev + 1);
    }
  };

  // Classe CSS de chaque bouton selon la phase
  const getChoixClass = (choix) => {
    if (phase === 'valide') {
      if (choix === chansons[mancheIndex]?.titre) return 'correct';
      if (choix === reponseValidee) return 'wrong';
      return '';
    }
    if (phase === 'selection' && choix === reponseSelectionnee) return 'selected';
    return '';
  };

  // Chargement
  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-wrapper">
        <div className="spinner" />
        <div className="loading-text">CHARGEMENT DES <span>CHANSONS</span></div>
        <div className="loading-hint">Connexion à Deezer en cours...</div>
      </div>
    </>
  );

  // Erreur
  if (erreur) return (
    <>
      <style>{styles}</style>
      <div className="error-wrapper">
        <div className="error-icon">😵</div>
        <div className="error-title">ERREUR</div>
        <div className="error-msg">{erreur}</div>
        <button className="retry-btn" onClick={() => navigate('/setup')}>← Retour au setup</button>
      </div>
    </>
  );

  const chanson         = chansons[mancheIndex];
  const progression     = (mancheIndex / chansons.length) * 100;
  const audioProgression = (tempsEcoule / DUREE_AUDIO) * 100;

  return (
    <>
      <style>{styles}</style>
      <div className="game-wrapper">

        <span className="note note-1">♪</span>
        <span className="note note-2">♫</span>
        <span className="note note-3">♬</span>
        <span className="note note-4">♩</span>

        {/* Header */}
        <div className="game-header">
          <div className="manche-label">
            MANCHE <span>{mancheIndex + 1}</span> / {chansons.length}
          </div>
        </div>

        {/* Barre progression manches */}
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progression}%` }} />
        </div>

        <div className="game-card">

          {/* Lecteur audio */}
          <div className="player-zone">
            <div className="player-question">🎵 Quelle est cette chanson ?</div>

            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            {isPlaying && (
              <div className="audio-waves">
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
              </div>
            )}

            <div className="audio-progress-container">
              <span className="audio-time">{tempsEcoule}s</span>
              <div className="audio-progress-bg">
                <div className="audio-progress-fill" style={{ width: `${audioProgression}%` }} />
              </div>
              <span className="audio-time">30s</span>
            </div>

            <audio ref={audioRef} src={chanson.preview} onEnded={handleAudioEnd} />
          </div>

          {/* Feedback après validation */}
          {phase === 'valide' && (
            <>
              <div className={`feedback ${reponseValidee === chanson.titre ? 'ok' : 'ko'}`}>
                {reponseValidee === chanson.titre
                  ? '✅ BONNE RÉPONSE !'
                  : <>
                      ❌ RATÉ !
                      <span className="bonne-reponse">
                        La bonne réponse était : {chanson.titre}
                      </span>
                    </>
                }
              </div>
              <div className="artiste-reveal">
                Artiste : <span>{chanson.artiste}</span>
              </div>
            </>
          )}

          {/* Les 5 choix */}
          <div className="choix-grid">
            {chanson.choix.map((choix, i) => (
              <button
                key={i}
                className={`choix-btn ${getChoixClass(choix)}`}
                onClick={() => handleSelectChoix(choix)}
                disabled={phase === 'valide'}
              >
                <span className="choix-index">{i + 1}</span>
                {choix}
              </button>
            ))}
          </div>

          {/* Bouton Valider — visible seulement si un choix est sélectionné */}
          {phase === 'selection' && (
            <button className="valider-btn" onClick={handleValider}>
              ✔ Valider ma réponse
            </button>
          )}

          {/* Bouton Suivant — visible seulement après validation */}
          {phase === 'valide' && (
            <button className="next-btn" onClick={handleSuivant}>
              {mancheIndex + 1 >= chansons.length
                ? '🏆 Voir mes résultats'
                : '➡️ Manche suivante'}
            </button>
          )}

        </div>
      </div>
    </>
  );
}

export default GamePage;