import { useState, useEffect, useContext } from "react";
import { StudentContext } from "../contexts/StudentContext";

export default function Sidebar({
  open,
  closeSidebar,
  setActivePage,
  dark,
  toggleTheme,
}) {
  const [students, setStudents] = useState([]);
  const { selectedStudent, setSelectedStudent } = useContext(StudentContext);

  // Load students from localStorage on mount
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("listOfStudents") || "[]");
    setStudents(list);

    // If saved student exists in list, set it
    const saved = selectedStudent || "";
    if (saved && list.includes(saved)) {
      setSelectedStudent(saved);
    }
  }, []);

  // Handle selecting a student
  const handleStudentChange = (e) => {
    const name = e.target.value;
    setSelectedStudent(name);
    closeSidebar(); // closes sidebar after selecting a student
  };

  // Helper: switch page + close sidebar
  const handleNavClick = (page) => {
    setActivePage(page);
    closeSidebar();
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} role="navigation">
      <div
        className="sidebar-header"
        style={{ display: "flex", alignItems: "center", padding: "12px" }}
      >
        <select
          className="student-select"
          value={selectedStudent}
          onChange={handleStudentChange}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
          }}
        >
          <option value="" disabled>
            -- Select Student --
          </option>
          {students.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="hamburger inside"
          aria-label="Close menu"
          onClick={closeSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="links">
        <button className="link-card" onClick={() => handleNavClick("home")}>
          Home
        </button>
        <button className="link-card" onClick={() => handleNavClick("quiz")}>
          Quiz
        </button>
        <button className="link-card" onClick={() => handleNavClick("plans")}>
          Plans
        </button>
        <button className="link-card" onClick={() => handleNavClick("sunnahs")}>
          Daily Sunnahs
        </button>
        <button className="link-card" onClick={() => handleNavClick("duas")}>
          Duas
        </button>
      </div>

      <button className="manage-btn" onClick={() => handleNavClick("manage")}>
        Manage Students
      </button>

      {/* Theme button does NOT close sidebar */}
      <button className="theme-btn" onClick={toggleTheme}>
        Switch to {dark ? "Light" : "Dark"} Theme
      </button>
    </aside>
  );
}
