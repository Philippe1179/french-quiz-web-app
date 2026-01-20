import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'incorrect' | null
  const [incorrectOptions, setIncorrectOptions] = useState([]); // NEW
  const [isFirstTry, setIsFirstTry] = useState(true);

  function handleAnswer(option) {
    if (disableOptions) return;
    setSelectedOption(option);
    if (option === questions[current].answer) {
      // Only count as correct if it was the first try for this question
      if (isFirstTry) {
        setScore(score + 1);
      }
      setFeedback("Correct!");
      setAnswerStatus("correct");
      setDisableOptions(true);
      setTimeout(() => {
        setAnswerStatus(null);
        setSelectedOption(null);
        setIncorrectOptions([]); // RESET for next question
        setIsFirstTry(true); // reset first-try flag for next question
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
      setIncorrectOptions((prev) => [...prev, option]); // ADD to incorrect options
      setIsFirstTry(false); // mark that the user missed the first try
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
    setIncorrectOptions([]); // RESET on restart
    setIsFirstTry(true);
  }

  return (
    <div>
      {!showResult && (
        <button
          className="quit-btn"
          onClick={restartQuiz}
          style={{
            position: "fixed",
            left: 20,
            top: 20,
            background: "#f44336",
            color: "#fff",
            border: "none",
            padding: "0.5em 1em",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          Restart Quiz
        </button>
      )}
      <div style={{ maxWidth: 400, margin: "auto", textAlign: "center", position: "relative" }}>
        <h1>French Quiz</h1>
        {showResult ? (
          <div>
            <h2>
              You scored {score} out of {questions.length}
            </h2>
            <button onClick={restartQuiz}>Restart Quiz</button>
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
            onRestart={restartQuiz}
          />
        )}
      </div>
    </div>
  );
}