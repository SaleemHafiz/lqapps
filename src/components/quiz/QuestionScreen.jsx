import React, { useEffect } from "react";

export default function QuestionScreen({
  quiz,
  current,
  setCurrent,
  score,
  setScore,
  saveProgress,
  setScreen,
  timeLeft,
  setTimeLeft,
  timerRef,
}) {
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAnswer(null); // timeout
          return 30;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current]);

  const handleAnswer = (answer) => {
    clearInterval(timerRef.current);
    const isCorrect = quiz.questions[current].answer === answer;
    if (isCorrect) setScore(score + 1);

    saveProgress(isCorrect ? score + 1 : score);

    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
      setTimeLeft(30);
    } else {
      setScreen("result");
    }
  };

  return (
    <div className="screen active">
      <h2>{quiz.questions[current].question}</h2>
      <ul id="options-list">
        {quiz.questions[current].options.map((opt, i) => (
          <li key={i} className="quiz-option" onClick={() => handleAnswer(opt)}>
            {opt}
          </li>
        ))}
      </ul>
      <p>⏱ {timeLeft}s left</p>
      <p>
        Score: {score} / {quiz.questions.length}
      </p>
    </div>
  );
}
