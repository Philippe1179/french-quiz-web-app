import { useState } from 'react'
import vocabulary from '../data/vocabulary.js'

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getGameData() {
  const pairs = shuffleArray(vocabulary).slice(0, 6);
  const rightOrder = shuffleArray(pairs.map((_, i) => i));
  return { pairs, rightOrder };
}

export default function Matching({ navigate }) {
  const [gameData, setGameData] = useState(() => getGameData());
  const { pairs, rightOrder } = gameData;

  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [flashing, setFlashing] = useState(null);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  function handleLeftClick(pairIndex) {
    if (matched.has(pairIndex) || flashing) return;
    setLeftSelected(pairIndex);
    if (rightSelected !== null) attemptMatch(pairIndex, rightSelected);
  }

  function handleRightClick(pairIndex) {
    if (matched.has(pairIndex) || flashing) return;
    setRightSelected(pairIndex);
    if (leftSelected !== null) attemptMatch(leftSelected, pairIndex);
  }

  function attemptMatch(left, right) {
    setMoves((m) => m + 1);
    if (left === right) {
      const newMatched = new Set(matched);
      newMatched.add(left);
      setMatched(newMatched);
      setLeftSelected(null);
      setRightSelected(null);
      if (newMatched.size === pairs.length) setDone(true);
    } else {
      setFlashing({ left, right });
      setTimeout(() => {
        setFlashing(null);
        setLeftSelected(null);
        setRightSelected(null);
      }, 600);
    }
  }

  function restart() {
    setGameData(getGameData());
    setLeftSelected(null);
    setRightSelected(null);
    setMatched(new Set());
    setFlashing(null);
    setMoves(0);
    setDone(false);
  }

  return (
    <>
      <button className="back-btn" onClick={() => navigate('games')}>
        &#8592; Games
      </button>

      <div className="card">
        <h1 className="app-title">Matching</h1>

        {!done ? (
          <>
            <p className="game-instructions">Match each French word to its English translation.</p>

            <div className="matching-grid">
              <div className="matching-col">
                {pairs.map((pair, i) => {
                  const isMatched = matched.has(i);
                  const isFlashing = flashing?.left === i;
                  let cls = "match-item";
                  if (isMatched) cls += " matched";
                  else if (isFlashing) cls += " incorrect";
                  else if (leftSelected === i) cls += " selected";

                  return (
                    <button key={i} className={cls} onClick={() => handleLeftClick(i)} disabled={isMatched}>
                      {pair.french}
                    </button>
                  );
                })}
              </div>

              <div className="matching-col">
                {rightOrder.map((pairIndex, pos) => {
                  const isMatched = matched.has(pairIndex);
                  const isFlashing = flashing?.right === pairIndex;
                  let cls = "match-item";
                  if (isMatched) cls += " matched";
                  else if (isFlashing) cls += " incorrect";
                  else if (rightSelected === pairIndex) cls += " selected";

                  return (
                    <button key={pos} className={cls} onClick={() => handleRightClick(pairIndex)} disabled={isMatched}>
                      {pairs[pairIndex].english}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="game-stat">Attempts: {moves}</p>
          </>
        ) : (
          <div className="results">
            <h2 className="results-title">All Matched!</h2>
            <p className="results-score">
              Completed in <span className="score-highlight">{moves}</span> attempts
            </p>
            {moves === pairs.length && <p className="perfect">Perfect — no wrong guesses!</p>}
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
