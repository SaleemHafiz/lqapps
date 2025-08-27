// ManageStudents.jsx
import React, { useEffect, useState } from "react";

// Utility: Capitalize each word
const capitalizeWords = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean) // remove accidental double spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  // Load students from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("listOfStudents") || "[]");
    setStudents(saved.length ? saved : [""]); // always at least one empty field
  }, []);

  // Save to localStorage whenever students state changes
  const saveStudents = (list) => {
    // Clean, capitalize, unique
    let cleaned = list.map((n) => capitalizeWords(n.trim())).filter(Boolean);
    cleaned = [...new Set(cleaned.map((n) => n.toLowerCase()))].map((n) =>
      capitalizeWords(n)
    );

    // Always ensure empty input at the end
    if (cleaned.length === 0 || cleaned[cleaned.length - 1] !== "") {
      cleaned.push("");
    }

    setStudents(cleaned);
    localStorage.setItem("listOfStudents", JSON.stringify(cleaned));
  };

  // Handle typing
  const handleChange = (value, index) => {
    let list = [...students];
    list[index] = value;

    // Don’t save if last char is space
    if (value.endsWith(" ")) {
      setStudents(list);
      return;
    }

    saveStudents(list);
  };

  // Handle remove
  const handleRemove = (index) => {
    let list = students.filter((_, i) => i !== index);
    if (list.length === 0) list = [""];
    saveStudents(list);
  };

  return (
    <div className="manage-students popup-content student-manager">
      <h2>Manage Students</h2>
      <div className="student-inputs">
        {students.map((name, idx) => {
          // Check duplicate (ignore case, skip empty and self)
          const isDuplicate =
            name &&
            students.some(
              (n, i) =>
                i !== idx && n.toLowerCase().trim() === name.toLowerCase().trim()
            );

          return (
            <div key={idx} className="student-row">
              <input
                type="text"
                value={name}
                placeholder="Enter full name"
                onChange={(e) => handleChange(e.target.value, idx)}
                style={{
                  border: isDuplicate ? "2px solid red" : undefined,
                }}
              />
              {name && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemove(idx)}
                >
                  ❌
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
