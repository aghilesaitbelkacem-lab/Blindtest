import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600&display=swap');

  :root {
    --bg: #0a0a0f;
    --accent: #ff3d6e;
    --accent2: #ff9a3c;
    --text: #f0f0f0;
    --muted: #666;
  }

  .home-wrapper {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
  }

  /* Cercles lumineux en arrière plan */
  .home-wrapper::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,61,110,0.12) 0%, transparent 70%);
    top: -100px;
    left: -100px;
    border-radius: 50%;
    pointer-events: none;
  }

  .home-wrapper::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,154,60,0.10) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
    border-radius: 50%;
    pointer-events: none;
  }

  /* Barres d'equalizer animées */
  .equalizer {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    margin-bottom: 32px;
    height: 48px;
  }

  .bar {
    width: 6px;
    border-radius: 3px;
    background: linear-gradient(to top, var(--accent), var(--accent2));
    animation: bounce 1s ease-in-out infinite;
  }

  .bar:nth-child(1) { height: 20px; animation-delay: 0s; }
  .bar:nth-child(2) { height: 35px; animation-delay: 0.15s; }
  .bar:nth-child(3) { height: 48px; animation-delay: 0.3s; }
  .bar:nth-child(4) { height: 28px; animation-delay: 0.45s; }
  .bar:nth-child(5) { height: 40px; animation-delay: 0.6s; }
  .bar:nth-child(6) { height: 18px; animation-delay: 0.75s; }
  .bar:nth-child(7) { height: 44px; animation-delay: 0.9s; }

  @keyframes bounce {
    0%, 100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.35); opacity: 0.6; }
  }

  /* Titre principal */
  .home-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(72px, 12vw, 130px);
    color: var(--text);
    letter-spacing: 6px;
    line-height: 1;
    margin: 0;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .home-title span {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .home-subtitle {
    font-size: 16px;
    color: var(--muted);
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 56px;
    text-align: center;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }

  /* Bouton */
  .home-btn {
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    border: none;
    padding: 18px 56px;
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 60px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 0 30px rgba(255, 61, 110, 0.4);
  }

  .home-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 0 50px rgba(255, 61, 110, 0.65);
  }

  .home-btn:active {
    transform: translateY(0px) scale(0.98);
  }

  /* Note musicale décorative */
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

  /* Ligne décorative sous le titre */
  .divider {
    width: 80px;
    height: 2px;
    background: linear-gradient(to right, var(--accent), var(--accent2));
    margin: 0 auto 16px auto;
    border-radius: 2px;
  }
`;

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="home-wrapper">

        {/* Notes décoratives */}
        <span className="note note-1">♪</span>
        <span className="note note-2">♫</span>
        <span className="note note-3">♬</span>
        <span className="note note-4">♩</span>

        {/* Equalizer animé */}
        <div className="equalizer">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Titre */}
        <h1 className="home-title">
          BLIND<span>TEST</span>
        </h1>

        <div className="divider"></div>

        <p className="home-subtitle">Reconnais la chanson · montre ton niveau </p>

        {/* Bouton */}
        <button className="home-btn" onClick={() => navigate('/setup')}>
          Commencer la partie !
        </button>

      </div>
    </>
  );
}

export default HomePage;