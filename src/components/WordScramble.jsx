import { useState, useEffect, useRef } from 'react'
import vocabulary from '../data/vocabulary.js'

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function scrambleWord(word) {
  const letters = word.split('');
  let result;
  let attempts = 0;
  do {
    result = shuffleArray(letters).join('');
    attempts++;
  } while (result === word && attempts < 20);
  return result;
}

function getWords() {
  return shuffleArray(vocabulary).map((w) => ({
    ...w,
    scrambled: scrambleWord(w.french),
  }));
}

export default function WordScramble({ navigate }) {
  const [words] = useState(() => getWords());
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!done && status === null) inputRef.current?.focus();
  }, [current, status, done]);

  function handleSubmit(e) {
    e.preventDefault();
    if (status || done) return;
    const correct = normalize(input) === normalize(words[current].french);
    setStatus(correct ? 'correct' : 'incorrect');
    if (correct) setScore((s) => s + 1);
    setTimeout(advance, 1200);
  }

  function advance() {
    setInput('');
    setStatus(null);
    if (current + 1 < words.length) {
      setCurrent((c) => c + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setCurrent(0);
    setInput('');
    setStatus(null);
    setScore(0);
    setDone(false);
  }

  const word = words[current];
  const progress = (current / words.length) * 100;

  return (
    <>
      <button className="back-btn" onClick={() => navigate('games')}>
        &#8592; Games
      </button>

      <div className="card">
        <h1 className="app-title">Word Scramble</h1>

        {!done ? (
          <>
            <div className="progress-section">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-label">Word {current + 1} of {words.length}</p>
            </div>

            <p className="scramble-hint">English: <strong>{word.english}</strong></p>
            <p className="scramble-word">{word.scrambled}</p>

            <form className="scramble-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className={`scramble-input ${status || ''}`}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type the French word..."
                disabled={!!status}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="submit"
                className="play-again-btn"
                disabled={!!status || input.trim() === ''}
              >
                Submit
              </button>
            </form>

            {status === 'correct' && (
              <p className="feedback correct">Correct!</p>
            )}
            {status === 'incorrect' && (
              <p className="feedback incorrect">Answer: <strong>{word.french}</strong></p>
            )}
          </>
        ) : (
          <div className="results">
            <h2 className="results-title">Complete!</h2>
            <p className="results-score">
              You got <span className="score-highlight">{score}</span> out of{' '}
              <span className="score-highlight">{words.length}</span> correct
            </p>
            {score === words.length && <p className="perfect">Perfect score!</p>}
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
