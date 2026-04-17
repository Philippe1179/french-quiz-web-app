import { useState, useEffect } from 'react'
import './App.css'
import QuestionCard from './QuestionCard.jsx'
import allQuestions from './data/questions.js'

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getShuffledQuestions() {
  return shuffleArray(allQuestions).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [disableOptions, setDisableOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [incorrectOptions, setIncorrectOptions] = useState([]);
  const [isFirstTry, setIsFirstTry] = useState(true);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState(() => getShuffledQuestions());
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore') || '0'));
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (showResult && score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
    }
  }, [showResult]);

  function handleAnswer(option) {
    if (disableOptions) return;
    setSelectedOption(option);
    if (option === shuffledQuestions[current].answer) {
      if (isFirstTry) {
        setScore(score + 1);
      } else {
        setMissedQuestions((prev) => [
          ...prev,
          { question: shuffledQuestions[current].question, answer: shuffledQuestions[current].answer },
        ]);
      }
      setFeedback("Correct!");
      setAnswerStatus("correct");
      setDisableOptions(true);
      setTimeout(() => {
        setAnswerStatus(null);
        setSelectedOption(null);
        setIncorrectOptions([]);
        setIsFirstTry(true);
        const next = current + 1;
        if (next < shuffledQuestions.length) {
          setCurrent(next);
          setFeedback("");
          setDisableOptions(false);
        } else {
          setShowResult(true);
        }
      }, 900);
    } else {
      setFeedback("Incorrect, try again!");
      setAnswerStatus("incorrect");
      setDisableOptions(true);
      setIncorrectOptions((prev) => [...prev, option]);
      setIsFirstTry(false);
      setTimeout(() => {
        setAnswerStatus(null);
        setSelectedOption(null);
        setDisableOptions(false);
      }, 900);
    }
  }

  function restartQuiz() {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setFeedback("");
    setDisableOptions(false);
    setSelectedOption(null);
    setAnswerStatus(null);
    setIncorrectOptions([]);
    setIsFirstTry(true);
    setMissedQuestions([]);
    setShuffledQuestions(getShuffledQuestions());
  }

  const progress = (current / shuffledQuestions.length) * 100;

  return (
    <div className="app">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? 'Light' : 'Dark'}
      </button>

      {!showResult && (
        <button className="quit-btn" onClick={restartQuiz}>
          Restart
        </button>
      )}

      <div className="card">
        <h1 className="app-title">French Quiz</h1>

        {!showResult && (
          <div className="progress-section">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-label">Question {current + 1} of {shuffledQuestions.length}</p>
          </div>
        )}

        {showResult ? (
          <div className="results">
            <h2 className="results-title">Quiz Complete!</h2>
            <p className="results-score">
              You scored <span className="score-highlight">{score}</span> out of{' '}
              <span className="score-highlight">{shuffledQuestions.length}</span>
            </p>
            {score === highScore && score > 0 && (
              <p className="new-best">New best!</p>
            )}
            {highScore > 0 && (
              <p className="high-score">Best score: {highScore} / {shuffledQuestions.length}</p>
            )}
            {missedQuestions.length === 0 ? (
              <p className="perfect">Perfect score! Excellent work.</p>
            ) : (
              <div className="breakdown">
                <p className="breakdown-title">Questions you missed:</p>
                <ul className="breakdown-list">
                  {missedQuestions.map((q, i) => (
                    <li key={i} className="breakdown-item">
                      <span className="breakdown-question">{q.question}</span>
                      <span className="breakdown-answer">Answer: {q.answer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className="play-again-btn" onClick={restartQuiz}>
              Play Again
            </button>
          </div>
        ) : (
          <QuestionCard
            question={shuffledQuestions[current].question}
            options={shuffledQuestions[current].options}
            selectedOption={selectedOption}
            answerStatus={answerStatus}
            incorrectOptions={incorrectOptions}
            disableOptions={disableOptions}
            handleAnswer={handleAnswer}
            feedback={feedback}
          />
        )}
      </div>
    </div>
  );
}
