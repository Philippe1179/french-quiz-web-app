import { useState, useEffect } from 'react'
import vocabulary from '../data/vocabulary.js'

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Flashcards({ navigate }) {
  const [deck, setDeck] = useState(() => shuffleArray(vocabulary));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [needsPractice, setNeedsPractice] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (done) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((prev) => !prev);
      }
      if (flipped) {
        if (e.key === 'ArrowRight') markKnown();
        if (e.key === 'ArrowLeft') markPractice();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipped, done, index]);

  function markKnown() {
    setKnown((prev) => prev + 1);
    advance();
  }

  function markPractice() {
    setNeedsPractice((prev) => [...prev, deck[index]]);
    advance();
  }

  function advance() {
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 < deck.length) {
        setIndex((prev) => prev + 1);
      } else {
        setDone(true);
      }
    }, 200);
  }

  function restart() {
    setDeck(shuffleArray(vocabulary));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setNeedsPractice([]);
    setDone(false);
  }

  return (
    <>
      <button className="back-btn" onClick={() => navigate('games')}>
        &#8592; Games
      </button>

      <div className="card">
        <h1 className="app-title">Flashcards</h1>

        {!done ? (
          <>
            <div className="progress-section">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${(index / deck.length) * 100}%` }} />
              </div>
              <p className="progress-label">Card {index + 1} of {deck.length}</p>
            </div>

            <div className="flashcard-scene" onClick={() => setFlipped((prev) => !prev)}>
              <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
                <div className="flashcard-face flashcard-front">
                  <span className="flashcard-label">French</span>
                  <span className="flashcard-word">{deck[index].french}</span>
                  <span className="flashcard-hint">tap to reveal</span>
                </div>
                <div className="flashcard-face flashcard-back">
                  <span className="flashcard-label">English</span>
                  <span className="flashcard-word">{deck[index].english}</span>
                </div>
              </div>
            </div>

            {flipped ? (
              <div className="flashcard-actions">
                <button className="practice-btn" onClick={markPractice}>
                  &#8592; Practice more
                </button>
                <button className="known-btn" onClick={markKnown}>
                  Got it &#8594;
                </button>
              </div>
            ) : (
              <p className="flashcard-key-hint">Press Space to flip</p>
            )}
          </>
        ) : (
          <div className="results">
            <h2 className="results-title">Session Complete!</h2>
            <p className="results-score">
              <span className="score-highlight">{known}</span> / {deck.length} known
            </p>

            {needsPractice.length === 0 ? (
              <p className="perfect">You knew all of them!</p>
            ) : (
              <div className="breakdown">
                <p className="breakdown-title">Keep practising:</p>
                <ul className="breakdown-list">
                  {needsPractice.map((word, i) => (
                    <li key={i} className="breakdown-item">
                      <span className="breakdown-question">{word.french}</span>
                      <span className="breakdown-answer">{word.english}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="results-actions">
              <button className="play-again-btn" onClick={restart}>Play Again</button>
              <button className="home-btn" onClick={() => navigate('games')}>Games</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
