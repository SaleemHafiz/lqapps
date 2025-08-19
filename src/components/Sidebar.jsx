export default function Sidebar({ open, closeSidebar, setActivePage, dark, toggleTheme }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} role="navigation">
      <button
        className="hamburger inside"
        aria-label="Close menu"
        onClick={closeSidebar}
      >
        <span></span><span></span><span></span>
      </button>

      <div className="links">
        <button className="link-card" onClick={() => setActivePage("home")}>Home</button>
        <button className="link-card" onClick={() => setActivePage("game1")}>Game 1</button>
        <button className="link-card" onClick={() => setActivePage("game2")}>Game 2</button>
        <button className="link-card" onClick={() => setActivePage("game3")}>Game 3</button>
      </div>

      <button className="manage-btn" onClick={() => setActivePage("manage")}>
        Manage Students
      </button>

      <button className="theme-btn" onClick={toggleTheme}>
        Switch to {dark ? "Light" : "Dark"} Theme
      </button>
    </aside>
  );
}
