import React from "react";

export default function ResultScreen({ score, total, restart }) {
  return (
    <div className="screen active">
      <h1>🎉 Quiz Completed!</h1>
      <p>
        You scored <b>{score}</b> out of <b>{total}</b>
      </p>
      <button onClick={restart}>Back to Levels</button>
    </div>
  );
}
