import { useState, useEffect } from 'react'
import './App.css'
import QuestionCard from './QuestionCard.jsx'

const questions = [
  {
    question: "What is the French word for 'apple'?",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    options: ["pomme", "banane", "orange", "raisin"],
    answer: "pomme",
  },
  {
    question: "How do you say 'thank you' in French?",
    options: ["merci", "bonjour", "au revoir", "s'il vous plaît"],
    answer: "merci",
  },
  {
    question: "What does 'chat' mean in English?",
    options: ["dog", "cat", "bird", "fish"],
    answer: "cat",
  },
  {
    question: "How do you say 'good night' in French?",
    options: ["bonne nuit", "bonsoir", "bonjour", "salut"],
    answer: "bonne nuit",
  },
  {
    question: "What is the French word for 'book'?",
    options: ["stylo", "livre", "chaise", "table"],
    answer: "livre",
  },
];

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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function handleAnswer(option) {
    if (disableOptions) return;
    setSelectedOption(option);
    if (option === questions[current].answer) {
      if (isFirstTry) {
        setScore(score + 1);
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
        if (next < questions.length) {
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
  }

  const progress = (current / questions.length) * 100;

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
            <p className="progress-label">Question {current + 1} of {questions.length}</p>
          </div>
        )}

        {showResult ? (
          <div className="results">
            <h2 className="results-title">Quiz Complete!</h2>
            <p className="results-score">
              You scored <span className="score-highlight">{score}</span> out of{' '}
              <span className="score-highlight">{questions.length}</span>
            </p>
            <button className="play-again-btn" onClick={restartQuiz}>
              Play Again
            </button>
          </div>
        ) : (
          <QuestionCard
            question={questions[current].question}
            image={questions[current].image}
            video={questions[current].video}
            options={questions[current].options}
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
