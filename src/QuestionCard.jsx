export default function QuestionCard({
  question,
  image,
  video,
  youtube,
  options,
  selectedOption,
  answerStatus,
  incorrectOptions,
  disableOptions,
  handleAnswer,
  feedback,
}) {
  return (
    <div>
      <h2 className="question-text">{question}</h2>

      {youtube && (
        <iframe
          className="media"
          width="100%"
          height="200"
          src={youtube}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {video && (
        <video className="media" src={video} controls />
      )}
      {image && (
        <img className="question-image" src={image} alt="question visual" />
      )}

      <div className="options-grid">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isUsed = incorrectOptions.includes(option);

          let className = "option-btn";
          if (isSelected && answerStatus === "correct") className += " correct";
          if (isSelected && answerStatus === "incorrect") className += " incorrect";
          if (isUsed) className += " used";

          return (
            <button
              key={option}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={disableOptions || isUsed}
            >
              <span className="option-key">{index + 1}</span>
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <p className={`feedback ${answerStatus || ''}`}>{feedback}</p>
      )}
    </div>
  );
}
