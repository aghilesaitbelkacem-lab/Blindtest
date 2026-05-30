import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600&display=swap');

  :root {
    --bg: #0a0a0f;
    --card: #13131a;
    --border: #222230;
    --accent: #ff3d6e;
    --accent2: #ff9a3c;
    --text: #f0f0f0;
    --muted: #989898;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .setup-wrapper {
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

  .setup-wrapper::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,61,110,0.10) 0%, transparent 70%);
    top: -150px; left: -150px;
    border-radius: 50%;
    pointer-events: none;
  }

  .setup-wrapper::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(255,154,60,0.08) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    border-radius: 50%;
    pointer-events: none;
  }

  .setup-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 8vw, 80px);
    color: var(--text);
    letter-spacing: 4px;
    text-align: center;
    margin-bottom: 4px;
    position: relative;
    z-index: 1;
  }

  .setup-title span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .setup-subtitle {
    color: var(--muted);
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 30px;
    margin-top: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .setup-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    width: 100%;
    max-width: 580px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .section-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    color: var(--text);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    flex-shrink: 0;
  }

  .pseudo-input {
    width: 100%;
    background: #0a0a0f;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .pseudo-input::placeholder { color: var(--muted); }

  .pseudo-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(255,61,110,0.15);
  }

  /* Grille genres */
  .genres-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  /* Bouton genre — couleur injectée via style inline */
 .genre-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 10px;
    background: #0a0a0f;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: var(--text);
    font-weight: 400;
    transition: border-color 0.2s,
                background 0.2s,
                color 0.2s,
                box-shadow 0.2s,
                transform 0.2s;
    user-select: none;
    width: 100%;
}

.genre-btn:hover,
.genre-btn.selected {
    transform: scale(1.10);
}


  /* Difficulté */
  .diff-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .diff-item { display: none; }

  .diff-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 10px;
    background: #0a0a0f;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .diff-label:hover { border-color: rgba(255,61,110,0.4);
                      transform: scale(1.05); }

  .diff-emoji { font-size: 24px; }

  .diff-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    color: var(--text);
    transition: color 0.2s;
  }

  .diff-desc {
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    opacity: 0.7;
  }

  .diff-item:checked + .diff-label {
    background: linear-gradient(135deg, rgba(255,61,110,0.15), rgba(255,154,60,0.15));
    border-color: var(--accent);
    box-shadow: 0 0 12px rgba(255,61,110,0.2);
     transform: scale(1.05);
  }

  .diff-item:checked + .diff-label .diff-name,
  .diff-item:checked + .diff-label .diff-desc { color: var(--text); }

  .start-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    border: none;
    padding: 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 0 30px rgba(255,61,110,0.4);
  }

  .start-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(255,61,110,0.6);
  }

  .start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .error-msg {
    color: var(--accent);
    font-size: 13px;
    text-align: center;
    margin-top: -16px;
    animation: fadeIn 0.3s ease;
  }
  .note {
    position: absolute;
    font-size: 80px;
    opacity: 0.4;
    pointer-events: none;
    user-select: none;
    font-family: serif;
  }

  .note-1 { top: 10%; left: 5%; font-size: 120px; }
  .note-2 { top: 60%; left: 8%; font-size: 80px; }
  .note-3 { top: 15%; right: 6%; font-size: 100px; }
  .note-4 { bottom: 10%; right: 10%; font-size: 90px; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const GENRES = [
  { id: 'rap',     label: 'Rap',  color: '#6b21a8', colorRgb: '107,33,168' },
  { id: 'rap_fr',  label: 'Rap & Urbain FR',  color: '#1d4ed8', colorRgb: '29,78,216'  },
  { id: 'rnb',     label: 'R&B',  color: '#be123c', colorRgb: '190,18,60'  },
  { id: 'rock',    label: 'Rock',  color: '#4b5563', colorRgb: '75,85,99'   },
  { id: 'techno',  label: 'Techno', color: '#0e7490', colorRgb: '14,116,144' },
  { id: 'house',   label: 'House',  color: '#c2410c', colorRgb: '194,65,12'  },
  { id: 'pop',     label: 'Pop', color: '#db2777', colorRgb: '219,39,119' },
  { id: 'soul',    label: 'Soul',  color: '#b45309', colorRgb: '180,83,9'   },
  { id: 'jazz',    label: 'Jazz',  color: '#15803d', colorRgb: '21,128,61'  },
  { id: 'latino',  label: 'Latino', color: '#dc2626', colorRgb: '220,38,38'  },
  { id: 'rai',     label: 'Raï', color: '#ca8a04', colorRgb: '202,138,4'  },
];

const DIFFICULTES = [
  { id: 'facile',    label: 'Facile',desc: 'Tubes connus' },
  { id: 'moyen',     label: 'Moyen', desc: 'Un peu plus dur' },
  { id: 'difficile', label: 'Difficile', desc: 'Pour les experts' },
];

function GenreBtn({ genre, selected, onToggle }) {
  const [hovered, setHovered] = useState(false);

  const getStyle = () => {
    if (selected) {
      return {
        background: genre.color,
        borderColor: genre.color,
        color: '#fff',
        boxShadow: `0 0 16px rgba(${genre.colorRgb}, 0.5)`,
        fontWeight: 600,
      };
    }
    if (hovered) {
      return {
        background: `rgba(${genre.colorRgb}, 0.08)`,
        borderColor: genre.color,
        color: '#fff',
      };
    }
    return {};
  };

  return (
    <button
      className="genre-btn"
      style={getStyle()}
      onClick={() => onToggle(genre.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {genre.emoji} {genre.label}
    </button>
  );
}

function SetupPage() {
  const navigate = useNavigate();
  const [pseudo, setPseudo]         = useState('');
  const [genres, setGenres]         = useState([]);
  const [difficulte, setDifficulte] = useState('');
  const [error, setError]           = useState('');

  const toggleGenre = (id) => {
    setGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (!pseudo.trim())      { setError('Entre ton pseudo pour commencer !'); return; }
    if (genres.length === 0) { setError('Choisis au moins un genre musical !'); return; }
    if (!difficulte)         { setError('Choisis un niveau de difficulté !'); return; }
    setError('');
    navigate('/game', { state: { pseudo: pseudo.trim(), genres, difficulte } });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="setup-wrapper">

        <span className="note note-1">♪</span>
        <span className="note note-2">♫</span>
        <span className="note note-3">♬</span>
        <span className="note note-4">♩</span>

        <h1 className="setup-title">PRÉPARE <span>TA PARTIE</span></h1>
        <p className="setup-subtitle">Configure ton blind test</p>

        <div className="setup-card">

          {/* Pseudo */}
          <div>
            <div className="section-label"><div className="dot" />TON PSEUDO</div>
            <input
              className="pseudo-input"
              type="text"
              placeholder="Entre ton pseudo..."
              value={pseudo}
              onChange={e => setPseudo(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Genres */}
          <div>
            <div className="section-label"><div className="dot" />GENRES MUSICAUX</div>
            <div className="genres-grid">
              {GENRES.map(g => (
                <GenreBtn
                  key={g.id}
                  genre={g}
                  selected={genres.includes(g.id)}
                  onToggle={toggleGenre}
                />
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <div className="section-label"><div className="dot" />DIFFICULTÉ</div>
            <div className="diff-grid">
              {DIFFICULTES.map(d => (
                <div key={d.id}>
                  <input
                    type="radio"
                    className="diff-item"
                    id={`diff-${d.id}`}
                    name="difficulte"
                    value={d.id}
                    checked={difficulte === d.id}
                    onChange={() => setDifficulte(d.id)}
                  />
                  <label className="diff-label" htmlFor={`diff-${d.id}`}>
                    <span className="diff-emoji">{d.emoji}</span>
                    <span className="diff-name">{d.label}</span>
                    <span className="diff-desc">{d.desc}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="error-msg">⚠️ {error}</p>}

          <button className="start-btn" onClick={handleStart}>
            🎵 Lancer la partie
          </button>

        </div>
      </div>
    </>
  );
}

export default SetupPage;