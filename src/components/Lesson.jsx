import { useState } from 'react'
import lessons from '../data/lessons.js'

function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem('completedLessons') || '[]');
  } catch {
    return [];
  }
}

function markComplete(lessonId) {
  const completed = getCompleted();
  if (!completed.includes(lessonId)) {
    localStorage.setItem('completedLessons', JSON.stringify([...completed, lessonId]));
  }
}

export default function Lesson({ navigate, lessonId }) {
  const lesson = lessons.find((l) => l.id === lessonId);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!lesson) {
    navigate('lessons');
    return null;
  }

  const word = lesson.words[index];
  const isLast = index === lesson.words.length - 1;
  const progress = ((index + 1) / lesson.words.length) * 100;

  function handleComplete() {
    markComplete(lessonId);
    setCompleted(true);
  }

  return (
    <>
      <button className="back-btn" onClick={() => navigate('lessons')}>
        &#8592; Lessons
      </button>

      <div className="card">
        <h1 className="app-title">{lesson.title}</h1>

        {!completed ? (
          <>
            <div className="progress-section">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-label">Word {index + 1} of {lesson.words.length}</p>
            </div>

            <div className="lesson-card">
              <p className="lesson-french">{word.french}</p>
              <p className="lesson-english">{word.english}</p>
              <div className="lesson-divider" />
              <p className="lesson-example">"{word.example}"</p>
              <p className="lesson-example-translation">{word.exampleTranslation}</p>
            </div>

            <div className="lesson-nav">
              <button
                className="lesson-nav-btn"
                onClick={() => setIndex((i) => i - 1)}
                disabled={index === 0}
              >
                &#8592; Prev
              </button>

              {isLast ? (
                <button className="play-again-btn" onClick={handleComplete}>
                  Complete &#10003;
                </button>
              ) : (
                <button
                  className="lesson-nav-btn primary"
                  onClick={() => setIndex((i) => i + 1)}
                >
                  Next &#8594;
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="results">
            <h2 className="results-title">Lesson Complete!</h2>
            <p className="results-score">You finished <strong>{lesson.title}</strong></p>
            <p className="perfect">Great work — keep it up!</p>
            <div className="results-actions">
              <button className="play-again-btn" onClick={() => { setIndex(0); setCompleted(false); }}>
                Review Again
              </button>
              <button className="home-btn" onClick={() => navigate('lessons')}>
                All Lessons
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
