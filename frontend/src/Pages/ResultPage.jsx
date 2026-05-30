import { useLocation, useNavigate } from 'react-router-dom';

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

  .result-wrapper {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    gap: 24px;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .result-wrapper::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,61,110,0.08) 0%, transparent 70%);
    top: -150px; left: -150px;
    border-radius: 50%;
    pointer-events: none;
  }

  /* ── Colonne gauche haut : score ── */
  .left-top {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  .result-pseudo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(18px, 2.5vw, 26px);
    letter-spacing: 4px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .result-pseudo span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .score-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 15px;
    letter-spacing: 4px;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .score-display {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    line-height: 1;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px 40px;
    margin-bottom: 20px;
  }

  .score-big {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(80px, 12vw, 120px);
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    filter: drop-shadow(0 0 20px rgba(255,61,110,0.35));
  }

  .score-denom {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(28px, 4vw, 44px);
    color: var(--muted);
    margin-bottom: 12px;
    letter-spacing: 2px;
  }

  .score-emoji {
    font-size: clamp(40px, 5vw, 56px);
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin-bottom: 12px;
  }

  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .score-message {
    font-size: clamp(16px, 2vw, 22px);
    color: var(--text);
    font-weight: 600;
    font-style: italic;
    opacity: 0.9;
    animation: fadeIn 0.5s ease 0.3s both;
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Colonne droite : détails ── */
  .right-col {
    grid-row: 1 / 3;
    grid-column: 2;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    max-height: calc(100vh - 96px);
  }

  .right-col::-webkit-scrollbar { width: 4px; }
  .right-col::-webkit-scrollbar-track { background: transparent; }
  .right-col::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .details-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    color: var(--text);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .details-title .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    flex-shrink: 0;
  }

  /* Ligne manche */
  .manche-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px;
    border-radius: 12px;
    margin-bottom: 8px;
    border: 1px solid transparent;
    animation: slideIn 0.3s ease both;
  }

  .manche-row:last-child { margin-bottom: 0; }

  .manche-row.ok {
    background: rgba(46, 204, 113, 0.06);
    border-color: rgba(46, 204, 113, 0.15);
  }

  .manche-row.ko {
    background: rgba(231, 76, 60, 0.06);
    border-color: rgba(231, 76, 60, 0.15);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .manche-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .manche-icon { font-size: 16px; flex-shrink: 0; }

  .manche-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    letter-spacing: 2px;
    color: var(--muted);
    flex-shrink: 0;
    min-width: 72px;
  }

  .manche-titre {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    flex: 1;
  }

  .manche-artiste {
    font-size: 11px;
    color: var(--muted);
    margin-left: 96px;
    margin-top: 2px;
  }

  .manche-bottom {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 96px;
    margin-top: 2px;
  }

  .manche-wrong-answer {
    font-size: 11px;
    color: var(--red);
    opacity: 0.85;
  }

  .manche-correct-answer {
    font-size: 11px;
    color: var(--green);
    font-weight: 600;
  }

  /* ── Boutons bas gauche ── */
  .left-bottom {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .btn-rejouer {
    width: 100%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    border: none;
    padding: 16px 20px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 24px rgba(255,61,110,0.35);
  }

  .btn-rejouer:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(255,61,110,0.55);
  }

  .btn-accueil {
    width: 100%;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    padding: 16px 20px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .btn-accueil:hover {
    border-color: var(--accent);
    background: rgba(255,61,110,0.06);
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
  
  /* Responsive mobile */
  @media (max-width: 640px) {
    .result-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      padding: 24px 16px;
    }

    .right-col {
      grid-row: 2;
      max-height: 400px;
    }

    .left-bottom {
      grid-row: 3;
    }
  }
`;

const getMessageScore = (score) => {
  if (score === 10) return { message: " WOW t'es injouable !" };
  if (score >= 7)   return { message:" très bien joué !"};
  if (score >= 5)   return { message: ' Bien joué !' };
  if (score >= 1)   return { message: ' Refais une partie mon ami... ' };
  return              {  message: "C'est bien l'école en fin de compte !" };
};

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { pseudo, score, manches } = location.state || { pseudo: '???', score: 0, manches: [] };
  const { emoji, message } = getMessageScore(score);

  return (
    <>
      <style>{styles}</style>
      <div className="result-wrapper">

        <span className="note note-1">♪</span>
        <span className="note note-2">♫</span>
        <span className="note note-3">♬</span>
        <span className="note note-4">♩</span>

        {/* ── Haut gauche : score ── */}
        <div className="left-top">
          <div className="result-pseudo">
            Joueur : <span>{pseudo}</span>
          </div>

          <div>
            <div className="score-label">TON SCORE EST DE</div>
            <div className="score-display">
              <span className="score-big">{score}</span>
              <span className="score-denom">/10</span>
            </div>
          </div>

          <div className="score-emoji">{emoji}</div>

          <div className="score-message">"{message}"</div>
        </div>

        {/* ── Droite : détails manches ── */}
        <div className="right-col">
          <div className="details-title">
            <div className="dot" />
            DÉTAILS DE LA PARTIE
          </div>

          {manches.map((manche, i) => (
            <div
              key={i}
              className={`manche-row ${manche.correct ? 'ok' : 'ko'}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="manche-top">
                <span className="manche-icon">{manche.correct ? '✅' : '❌'}</span>
                <span className="manche-num">MANCHE {manche.numero}</span>
                <span className="manche-titre">{manche.titre} - {manche.artiste}</span>
              </div>

              {!manche.correct && (
                <div className="manche-bottom">
                  <span className="manche-wrong-answer">Ta réponse : {manche.reponseJoueur}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Bas gauche : boutons ── */}
        <div className="left-bottom">
          <button className="btn-rejouer" onClick={() => navigate('/setup')}>
             Rejouer une partie
          </button>
          <button className="btn-accueil" onClick={() => navigate('/')}>
             Retour à l'accueil
          </button>
        </div>

      </div>
    </>
  );
}

export default ResultPage;