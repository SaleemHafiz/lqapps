import React, { useState, useEffect, useRef } from "react";
import StartScreen from "./StartScreen";
import QuizListScreen from "./QuizListScreen";
import QuestionScreen from "./QuestionScreen";
import ResultScreen from "./ResultScreen";
import { quizzes } from "../../quizzes";

export default function Quiz({ student }) {
  const [screen, setScreen] = useState("start"); // start | quizList | question | result
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [progress, setProgress] = useState([]);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const timerRef = useRef(null);

  // Load progress for this student from localStorage
  useEffect(() => {
    if (!student) return;
    const prog = JSON.parse(localStorage.getItem("lastAnswered") || "[]").filter(
      (p) => p.student === student
    );
    setProgress(prog);
  }, [student]);

  const saveProgress = (qIndex, newScore) => {
    if (!student) return;
    const currentQuiz = quizzes[qIndex];
    const total = currentQuiz.questions.length;
    const percent = parseFloat(((newScore / total) * 100).toFixed(1));

    let allProgress = JSON.parse(localStorage.getItem("lastAnswered") || "[]");
    const idx = allProgress.findIndex(
      (p) =>
        p.student === student &&
        p.level === currentQuiz.level &&
        p.quiz === currentQuiz.quiz
    );

    if (idx !== -1) {
      allProgress[idx].question = current + 1;
      allProgress[idx].score = newScore;
      allProgress[idx].total = total;
      allProgress[idx].highestPercentage = Math.max(
        allProgress[idx].highestPercentage || 0,
        percent
      );
    } else {
      allProgress.push({
        student,
        level: currentQuiz.level,
        quiz: currentQuiz.quiz,
        question: current + 1,
        score: newScore,
        total,
        highestPercentage: percent,
      });
    }

    localStorage.setItem("lastAnswered", JSON.stringify(allProgress));
    setProgress(allProgress.filter((p) => p.student === student));
  };

  const startQuiz = (quizIndex) => {
    setCurrentQuizIndex(quizIndex);
    setScreen("question");
    setCurrent(0);
    setScore(0);
    setTimeLeft(30);
  };

  return (
    <div id="quiz-app">
      {screen === "start" && (
        <StartScreen
          quizzes={quizzes}
          progress={progress}
          setScreen={setScreen}
          setCurrentLevel={setCurrentLevel}
        />
      )}

      {screen === "quizList" && (
        <QuizListScreen
          quizzes={quizzes}
          level={currentLevel}
          progress={progress}
          startQuiz={startQuiz}
        />
      )}

      {screen === "question" && (
        <QuestionScreen
          quiz={quizzes[currentQuizIndex]}
          current={current}
          setCurrent={setCurrent}
          score={score}
          setScore={setScore}
          saveProgress={(newScore) => saveProgress(currentQuizIndex, newScore)}
          setScreen={setScreen}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          timerRef={timerRef}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          score={score}
          total={quizzes[currentQuizIndex].questions.length}
          restart={() => setScreen("start")}
        />
      )}
    </div>
  );
}
