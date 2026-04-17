# Apprendre — French Learning App

**Live Demo:** https://Philippe1179.github.io/french-quiz-web-app/

A French vocabulary learning app built with React. Covers lessons, mini games, and a quiz — designed to take a learner from first exposure to tested knowledge.

## Features

### Lessons
- 5 vocabulary categories: Greetings, Food & Drink, Animals, Numbers, Colours
- Word cards with French, English translation, and an example sentence
- Completion tracking saved to localStorage

### Mini Games
- **Flashcards** — flip cards to reveal translations, mark as known or needs practice
- **Matching** — match 6 French words to their English translations
- **Word Scramble** — unscramble a French word with Easy (letters shown) or Hard (from memory) modes

### Quiz
- 20 questions pulled from a randomised pool each round
- Answer options shuffled every game
- First-try scoring — points only awarded if correct on the first attempt
- Wrong answers eliminated to help narrow down the correct one
- Results breakdown showing missed questions with correct answers
- High score saved to localStorage

### General
- Dark / light mode toggle with localStorage persistence
- Keyboard shortcuts: press 1–4 to select quiz answers, Space/arrow keys in flashcards
- Fully responsive, deployed via GitHub Actions to GitHub Pages

## Tech Stack
- React 19
- Vite
- JavaScript
- CSS (custom properties for theming)
- GitHub Pages (CI/CD via GitHub Actions)

## Run Locally

```bash
git clone https://github.com/Philippe1179/french-quiz-web-app.git
cd french-quiz-web-app
npm install
npm run dev
```

Then open `http://localhost:5173`
