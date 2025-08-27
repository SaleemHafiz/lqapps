import { createContext, useState, useEffect } from "react";

// Create the context
export const StudentContext = createContext();

// Provider component
export const StudentProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(
    localStorage.getItem("selectedStudent") || ""
  );

  // Keep localStorage in sync
  useEffect(() => {
    if (selectedStudent) {
      localStorage.setItem("selectedStudent", selectedStudent);
    }
  }, [selectedStudent]);

  return (
    <StudentContext.Provider value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
