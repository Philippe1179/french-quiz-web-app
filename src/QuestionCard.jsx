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
  onRestart,
}) {
  return (
    <div>
      <h2>{question}</h2>
      {youtube && (
        <iframe
          width="100%"
          height="200"
          src={youtube}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ margin: "16px 0" }}
        ></iframe>
      )}
      {video && (
        <video
          src={video}
          controls
          style={{ maxWidth: "100%", maxHeight: 200, margin: "16px 0" }}
        />
      )}
      {image && (
        <img
          src={image}
          alt="question visual"
          style={{ maxWidth: "100%", maxHeight: 150, marginBottom: 16 }}
        />
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          margin: "20px 0",
        }}
      >
        {options.map((option) => {
          let bgColor = "";
          if (selectedOption === option && answerStatus === "correct") {
            bgColor = "green";
          } else if (selectedOption === option && answerStatus === "incorrect") {
            bgColor = "red";
          }
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={disableOptions || incorrectOptions.includes(option)}
              style={{
                backgroundColor: bgColor || undefined,
                color: bgColor ? "#fff" : undefined,
                opacity: incorrectOptions.includes(option) ? 0.5 : 1,
                transition: "background-color 0.2s, opacity 0.2s",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div style={{ margin: "10px", fontWeight: "bold" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}