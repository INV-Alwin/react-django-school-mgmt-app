import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import withLogout from "../hoc/withLogout.jsx";
import { useSelector } from "react-redux";
import StudentExam from "../components/StudentExams.jsx";
import TakeExam from "../components/TakeExam.jsx";

const StudentDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [score, setScore] = useState(null);
  const name = useSelector((state) => state.user.name);
  const AppLayoutWithLogout = withLogout(AppLayout);

  const handleStartExam = (examId) => {
    setSelectedExamId(examId);
    setActiveView("TakeExam");
  };

  const handleExamSubmitted = (scoreValue) => {
    setScore(scoreValue);
    setActiveView("Result");
  };

  const renderContent = () => {
    switch (activeView) {
      case "Exam":
        return <StudentExam onStartExam={handleStartExam} />;
      case "TakeExam":
        return (
          <TakeExam
            examId={selectedExamId}
            onSubmitSuccess={handleExamSubmitted}
          />
        );
      case "Result":
        return (
          <div>
            <h2>Exam Submitted!</h2>
            <p>Your Score: {score}</p>
          </div>
        );
      default:
        return (
          <>
            <h2>Welcome, {name || "Student"}</h2>
            <p>This is your dashboard.</p>
          </>
        );
    }
  };

  return (
    <AppLayoutWithLogout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </AppLayoutWithLogout>
  );
};

export default StudentDashboard;
