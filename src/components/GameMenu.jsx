export default function GameMenu({ navigate }) {
  return (
    <>
      <button className="back-btn" onClick={() => navigate('home')}>
        &#8592; Home
      </button>

      <div className="card">
        <h1 className="app-title">Mini Games</h1>

        <div className="section-cards">
          <div className="section-card" onClick={() => navigate('flashcards')}>
            <div className="section-icon blue">F</div>
            <div className="section-info">
              <h2>Flashcards</h2>
              <p>Flip through French vocabulary cards</p>
            </div>
            <span className="section-arrow">&#8250;</span>
          </div>

          <div className="section-card" onClick={() => navigate('matching')}>
            <div className="section-icon red">M</div>
            <div className="section-info">
              <h2>Matching</h2>
              <p>Match French words to their meanings</p>
            </div>
            <span className="section-arrow">&#8250;</span>
          </div>

          <div className="section-card" onClick={() => navigate('scramble')}>
            <div className="section-icon gray">S</div>
            <div className="section-info">
              <h2>Word Scramble</h2>
              <p>Unscramble the French word</p>
            </div>
            <span className="section-arrow">&#8250;</span>
          </div>
        </div>
      </div>
    </>
  );
}
