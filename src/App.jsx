import { useState, useEffect } from 'react'
import './App.css'
import Home from './components/Home.jsx'
import Quiz from './components/Quiz.jsx'
import GameMenu from './components/GameMenu.jsx'
import Flashcards from './components/Flashcards.jsx'
import Matching from './components/Matching.jsx'
import WordScramble from './components/WordScramble.jsx'
import LessonMenu from './components/LessonMenu.jsx'
import Lesson from './components/Lesson.jsx'

export default function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="app">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? 'Light' : 'Dark'}
      </button>

      {page === 'home' && <Home navigate={setPage} />}
      {page === 'quiz' && <Quiz navigate={setPage} />}
      {page === 'games' && <GameMenu navigate={setPage} />}
      {page === 'flashcards' && <Flashcards navigate={setPage} />}
      {page === 'matching' && <Matching navigate={setPage} />}
      {page === 'scramble' && <WordScramble navigate={setPage} />}
      {page === 'lessons' && <LessonMenu navigate={setPage} />}
      {page.startsWith('lesson:') && <Lesson navigate={setPage} lessonId={page.replace('lesson:', '')} />}
    </div>
  );
}
