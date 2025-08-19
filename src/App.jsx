import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true); // default dark theme

  // toggle sidebar
  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  // toggle theme
  const toggleTheme = () => setDark((prev) => !prev);

  // close with ESC key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeSidebar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={dark ? "theme-dark" : "theme-light"}>
      {/* Hamburger (outside when sidebar closed) */}
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

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`} role="navigation">
        <button
          className="hamburger inside"
          aria-label="Close menu"
          onClick={closeSidebar}
        >
          <span></span><span></span><span></span>
        </button>

        <div className="links">
          <a className="link-card" href="#">Dashboard</a>
          <a className="link-card" href="#">Reports</a>
          <a className="link-card" href="#">Assignments</a>
          <a className="link-card" href="#">Settings</a>
        </div>

        <button className="manage-btn">Manage Students</button>

        <button className="theme-btn" onClick={toggleTheme}>
          Switch to {dark ? "Light" : "Dark"} Theme
        </button>
      </aside>

      {/* Overlay */}
      {open && <div className="overlay show" onClick={closeSidebar}></div>}

      {/* Home */}
      <main className="home">
        <img
          className="logo"
          src="https://learnquraan.co.uk/vendor/local/imgs/hr-logo-white.svg"
          alt="Learn Qur'an Logo"
        />
        <div className="subtitle">Welcome to the Learn Qur'an Apps</div>
      </main>
    </div>
  );
}
