import { useState, useEffect } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";
import Game3 from "./components/Game3";
import ManageStudents from "./components/ManageStudents";

export default function App() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [activePage, setActivePage] = useState("home");

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
    case "game1": PageComponent = <Game1 />; break;
    case "game2": PageComponent = <Game2 />; break;
    case "game3": PageComponent = <Game3 />; break;
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
      />

      {open && <div className="overlay show" onClick={closeSidebar}></div>}

      <main className="main-screen">{PageComponent}</main>
    </div>
  );
}
