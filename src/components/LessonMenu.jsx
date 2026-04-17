import lessons from '../data/lessons.js'

function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem('completedLessons') || '[]');
  } catch {
    return [];
  }
}

export default function LessonMenu({ navigate }) {
  const completed = getCompleted();

  return (
    <>
      <button className="back-btn" onClick={() => navigate('home')}>
        &#8592; Home
      </button>

      <div className="card">
        <h1 className="app-title">Lessons</h1>

        <div className="section-cards">
          {lessons.map((lesson) => {
            const isDone = completed.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className="section-card"
                onClick={() => navigate(`lesson:${lesson.id}`)}
              >
                <div className={`section-icon ${lesson.color}`}>{lesson.title[0]}</div>
                <div className="section-info">
                  <h2>{lesson.title}</h2>
                  <p>{lesson.description} &middot; {lesson.words.length} words</p>
                </div>
                {isDone
                  ? <span className="lesson-done">&#10003;</span>
                  : <span className="section-arrow">&#8250;</span>
                }
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
