import { useState, useEffect } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Plans from "./components/Plans/Plans";
import DailySunnahs from "./components/DailySunnahs/DailySunnahs";
import Duas from "./components/Duas/Duas";
import ManageStudents from "./components/ManageStudents";
import Quiz from "./components/quiz/Quiz";

export default function App() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [selectedStudent, setSelectedStudent] = useState(localStorage.getItem("selectedStudent") || "")

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);
  const toggleTheme = () => setDark((prev) => !prev);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeSidebar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  let PageComponent;
  switch (activePage) {
    case "quiz": PageComponent = <Quiz />; break;
    case "plans": PageComponent = <Plans />; break;
    case "sunnahs": PageComponent = <DailySunnahs />; break;
    case "duas": PageComponent = <Duas />; break;
    case "manage": PageComponent = <ManageStudents />; break;
    default: PageComponent = <Home />;
  }

  return (
    <div className={dark ? "theme-dark" : "theme-light"}>
      {!open && (
        <button
          className="hamburger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={openSidebar}
        >
          <span></span><span></span><span></span>
        </button>
      )}

      <Sidebar
        open={open}
        closeSidebar={closeSidebar}
        setActivePage={setActivePage}
        dark={dark}
        toggleTheme={toggleTheme}
        selectedStudent = {selectedStudent}
        setSelectedStudent = {setSelectedStudent}
      />

      {open && <div className="overlay show" onClick={closeSidebar}></div>}

      <main className="main-screen">{PageComponent}</main>
    </div>
  );
}
