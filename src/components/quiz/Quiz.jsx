import React, { useState, useEffect, useRef, useContext } from "react";
import "./styles/quiz.css"; // your scoped CSS file
import { quizzes } from "./data/quizzes";
import { StudentContext } from "../../contexts/StudentContext.jsx";

export default function Quiz() {
  const { selectedStudent, setSelectedStudent } = useContext(StudentContext); // use context
  const [students, setStudents] = useState([]);
  const [viewStack, setViewStack] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("start");
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPopup, setShowPopup] = useState(false);

  const timerRef = useRef(null);

  // Load students from localStorage
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("listOfStudents") || "[]");
    setStudents(list);
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentScreen === "question") {
      clearInterval(timerRef.current);
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            showCorrectAnswer();
            setTimeout(nextQuestion, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentScreen, currentQuestion]);

  // ---------------- Student Management ----------------
  const saveStudentList = (list) => {
    const unique = [...new Set(list.filter(Boolean).map(capitalizeWords))];
    localStorage.setItem("listOfStudents", JSON.stringify(unique));
    setStudents(unique);
  };

  const addStudent = (name) => {
    const updated = [...students, name];
    saveStudentList(updated);
  };

  const removeStudent = (index) => {
    const updated = [...students];
    const removedStudent = updated.splice(index, 1);
    saveStudentList(updated);
    if (selectedStudent === removedStudent[0]) setSelectedStudent("");
  };

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  // ---------------- Screens ----------------
  const showScreen = (screen) => setCurrentScreen(screen);
  const goBack = () => {
    const last = [...viewStack].pop();
    if (!last) return;
    setViewStack((prev) => prev.slice(0, -1));
    showScreen(last);
  };

  // ---------------- Levels ----------------
  const levels = [...new Set(quizzes.map((q) => q.level))];
  const selectLevel = (level) => {
    setViewStack((prev) => [...prev, "start"]);
    setCurrentLevel(level);
    showScreen("quizList");
  };

  // ---------------- Quiz List ----------------
  const selectQuiz = (index) => {
    const quiz = quizzes[index];
    setCurrentQuiz(quiz);
    setCurrentQuizIndex(index);
    const saved = getStudentProgress().find(
      (p) => p.level === quiz.level && p.quiz === quiz.quiz
    );
    setCurrentQuestion(saved?.question || 0);
    setScore(saved?.score || 0);
    setViewStack((prev) => [...prev, "quizList"]);
    showScreen("question");
  };

  // ---------------- Questions ----------------
  const checkAnswer = (selectedOption) => {
    clearInterval(timerRef.current);
    const correctAnswer = currentQuiz.questions[currentQuestion].answer;
    let isCorrect = selectedOption === correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    saveProgress(currentQuestion + 1, isCorrect ? score + 1 : score);
    setTimeout(nextQuestion, 1000);
  };

  const showCorrectAnswer = () => {};
  const nextQuestion = () => {
    if (currentQuestion + 1 >= currentQuiz.questions.length) {
      setViewStack((prev) => [...prev, "question"]);
      showScreen("result");
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // ---------------- Progress ----------------
  const getStudentProgress = () =>
    JSON.parse(localStorage.getItem("lastAnswered") || "[]").filter(
      (p) => p.student === selectedStudent
    );

  const saveProgress = (questionNum, scoreValue) => {
    if (!selectedStudent) return;
    const total = currentQuiz.questions.length;
    const percent = parseFloat(((scoreValue / total) * 100).toFixed(1));
    let progress = JSON.parse(localStorage.getItem("lastAnswered") || "[]");
    const idx = progress.findIndex(
      (p) =>
        p.student === selectedStudent &&
        p.level === currentQuiz.level &&
        p.quiz === currentQuiz.quiz
    );
    if (idx !== -1) {
      progress[idx].question = questionNum;
      progress[idx].score = scoreValue;
      progress[idx].total = total;
      progress[idx].highestPercentage = Math.max(
        progress[idx].highestPercentage || 0,
        percent
      );
    } else {
      progress.push({
        student: selectedStudent,
        level: currentQuiz.level,
        quiz: currentQuiz.quiz,
        question: questionNum,
        score: scoreValue,
        total: total,
        highestPercentage: percent,
      });
    }
    localStorage.setItem("lastAnswered", JSON.stringify(progress));
  };

  const getResultQuote = (percent) => {
    if (percent >= 90) return "Outstanding work! You didn’t just pass — you inspired!";
    if (percent >= 80) return "Excellent! Your effort and focus really shine through.";
    if (percent >= 70) return "Great job! Your hard work is paying off.";
    if (percent >= 60) return "Good going! Keep climbing — you're on the right path.";
    if (percent >= 50) return "A decent step! Let’s aim even higher next time.";
    if (percent >= 40) return "You’re growing — reflect, learn, and move forward stronger.";
    if (percent >= 30) return "It’s not the end — it's the beginning of improvement.";
    if (percent >= 20) return "Results don't define you — resilience does.";
    if (percent >= 10) return "Even small steps matter. Keep trying and keep believing.";
    return "Every result is a step forward — either a victory to celebrate or a lesson to grow from!";
  };

  // ---------------- JSX ----------------
  return (
    <div id="quiz-app">
      <div className="button-and-name">
        {viewStack.length > 0 && (
          <button className="cardy" onClick={goBack}>
            ← Back
          </button>
        )}
        <div id="student-display">{selectedStudent ? `👤 ${selectedStudent}` : ""}</div>
        <button id="manage-students-btn" onClick={() => setShowPopup(true)}>
          👤
        </button>
      </div>

      {/* Start Screen */}
      {currentScreen === "start" && (
        <div className="screen active">
          <h1>✨ Select a Level</h1>
          <ul id="level-list">
            {levels.map((level, i) => (
              <li key={i} onClick={() => selectLevel(level)}>
                Level {level}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz List Screen */}
      {currentScreen === "quizList" && (
        <div className="screen active">
          <h1>📚 Select a Quiz</h1>
          <ul id="quiz-list">
            {quizzes
              .filter((q) => q.level === currentLevel)
              .map((quiz, i) => (
                <li key={i} onClick={() => selectQuiz(quizzes.indexOf(quiz))}>
                  {quiz.title}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Question Screen */}
      {currentScreen === "question" && currentQuiz && (
        <div className="screen active">
          <div className="quiz-header">
            <div className="quiz-title-and-question-number">
              <span className="quiz-title">{currentQuiz.title}</span>
              <div className="question-number">
                Question {currentQuestion + 1} of {currentQuiz.questions.length}
              </div>
            </div>
            <div className="timer">⏱ {timeLeft}s</div>
          </div>
          <h2 id="question-text">{currentQuiz.questions[currentQuestion].question}</h2>
          <ul id="options-list">
            {currentQuiz.questions[currentQuestion].options.map((opt, i) => (
              <li key={i} onClick={() => checkAnswer(opt)}>
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Result Screen */}
      {currentScreen === "result" && currentQuiz && (
        <div className="screen active">
          <h2>🎉 Quiz Completed</h2>
          <h1 id="quote">
            {getResultQuote(Math.round((score / currentQuiz.questions.length) * 100))}
          </h1>
          <p id="score-text">
            <div className="green">
              Marks: <strong>{score}/{currentQuiz.questions.length}</strong>
            </div>
            <div className="green">
              Percentage: <strong>{Math.round((score / currentQuiz.questions.length) * 100)}%</strong>
            </div>
          </p>
          <button className="cardy" onClick={() => showScreen("start")}>
            Try Another Quiz
          </button>
        </div>
      )}

      {/* Popup Student Manager */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Manage Students</h2>
            <div id="student-inputs">
              {students.map((name, i) => (
                <div className="student-row" key={i}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const updated = [...students];
                      updated[i] = e.target.value;
                      saveStudentList(updated);
                    }}
                  />
                  <button className="remove-btn" onClick={() => removeStudent(i)}> ❌ </button>
                </div>
              ))}
              <div className="student-row">
                <input
                  type="text"
                  placeholder="Enter full name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addStudent(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
            <button id="close-popup" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
