export default function Home({ navigate }) {
  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">Apprendre</h1>
        <p className="home-subtitle">Learn French, one step at a time</p>
      </div>

      <div className="section-cards">
        <div className="section-card" onClick={() => navigate('quiz')}>
          <div className="section-icon blue">Q</div>
          <div className="section-info">
            <h2>Quiz</h2>
            <p>Test your French vocabulary</p>
          </div>
          <span className="section-arrow">&#8250;</span>
        </div>

        <div className="section-card" onClick={() => navigate('games')}>
          <div className="section-icon red">G</div>
          <div className="section-info">
            <h2>Mini Games</h2>
            <p>Practice with fun games</p>
          </div>
          <span className="section-arrow">&#8250;</span>
        </div>

        <div className="section-card disabled">
          <div className="section-icon gray">L</div>
          <div className="section-info">
            <h2>Lessons</h2>
            <p>Guided vocabulary lessons</p>
          </div>
          <span className="section-badge">Soon</span>
        </div>
      </div>
    </div>
  );
}
