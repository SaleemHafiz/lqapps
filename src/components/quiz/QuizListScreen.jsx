import React from "react";

export default function QuizListScreen({ quizzes, level, progress, startQuiz }) {
  const list = quizzes.filter((q) => q.level === level);

  return (
    <div className="screen active">
      <h1>📚 Quizzes for {typeof level === "number" ? `Level ${level}` : level}</h1>
      <ul id="quiz-list">
        {list.map((quiz, i) => {
          const prog = progress.find(
            (p) => p.level === quiz.level && p.quiz === quiz.quiz
          );
          return (
            <li key={i} className="quiz-option" onClick={() => startQuiz(quizzes.indexOf(quiz))}>
              {quiz.title}
              {prog && <span> ✅ {prog.highestPercentage}%</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
