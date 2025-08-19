import React from "react";

export default function StartScreen({ quizzes, progress, setScreen, setCurrentLevel }) {
  const levels = [...new Set(quizzes.map((q) => q.level))];

  return (
    <div className="screen active">
      <h1>✨ Select a Level</h1>
      <ul id="level-list">
        {levels.map((level, i) => (
          <li
            key={i}
            className="quiz-option"
            onClick={() => {
              setCurrentLevel(level);
              setScreen("quizList");
            }}
          >
            {typeof level === "number" ? `Level ${level}` : level}
          </li>
        ))}
      </ul>
    </div>
  );
}
