import { useState } from 'react'
import { matchingLevels } from '../data/vocabulary.js'

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getUnlockedLevel() {
  return parseInt(localStorage.getItem('matching_unlocked_level') || '1', 10);
}

function saveUnlockedLevel(level) {
  localStorage.setItem('matching_unlocked_level', String(level));
}

function getGameData(levelIndex) {
  const pairs = matchingLevels[levelIndex].words;
  const rightOrder = shuffleArray(pairs.map((_, i) => i));
  return { pairs, rightOrder };
}

function LevelSelect({ onSelect }) {
  const unlockedLevel = getUnlockedLevel();

  return (
    <div className="card">
      <h1 className="app-title">Matching</h1>
      <p className="game-instructions">Select a level to play.</p>
      <div className="level-list">
        {matchingLevels.map((lvl) => {
          const unlocked = lvl.level <= unlockedLevel;
          return (
            <button
              key={lvl.level}
              className={`level-item ${unlocked ? '' : 'locked'}`}
              onClick={() => unlocked && onSelect(lvl.level - 1)}
              disabled={!unlocked}
            >
              <span className="level-number">Level {lvl.level}</span>
              <span className="level-title">{lvl.title}</span>
              {!unlocked && <span className="level-lock">🔒</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Matching({ navigate }) {
  const [levelIndex, setLevelIndex] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [flashing, setFlashing] = useState(null);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  function startLevel(index) {
    setLevelIndex(index);
    setGameData(getGameData(index));
    setLeftSelected(null);
    setRightSelected(null);
    setMatched(new Set());
    setFlashing(null);
    setMoves(0);
    setDone(false);
  }

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
      if (newMatched.size === gameData.pairs.length) {
        const completedLevel = levelIndex + 1;
        const nextLevel = completedLevel + 1;
        if (nextLevel <= matchingLevels.length && nextLevel > getUnlockedLevel()) {
          saveUnlockedLevel(nextLevel);
        }
        setDone(true);
      }
    } else {
      setFlashing({ left, right });
      setTimeout(() => {
        setFlashing(null);
        setLeftSelected(null);
        setRightSelected(null);
      }, 600);
    }
  }

  if (levelIndex === null) {
    return (
      <>
        <button className="back-btn" onClick={() => navigate('games')}>&#8592; Games</button>
        <LevelSelect onSelect={startLevel} />
      </>
    );
  }

  const { pairs, rightOrder } = gameData;
  const currentLevel = matchingLevels[levelIndex];
  const isLastLevel = levelIndex === matchingLevels.length - 1;

  return (
    <>
      <button className="back-btn" onClick={() => setLevelIndex(null)}>&#8592; Levels</button>

      <div className="card">
        <h1 className="app-title">Matching</h1>
        <p className="game-instructions">Level {currentLevel.level} — {currentLevel.title}</p>

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
            {!isLastLevel && (
              <p className="unlock-msg">Level {levelIndex + 2} unlocked!</p>
            )}
            <div className="results-actions">
              <button className="play-again-btn" onClick={() => startLevel(levelIndex)}>Play Again</button>
              {!isLastLevel && (
                <button className="play-again-btn" onClick={() => startLevel(levelIndex + 1)}>Next Level</button>
              )}
              <button className="home-btn" onClick={() => setLevelIndex(null)}>Levels</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
