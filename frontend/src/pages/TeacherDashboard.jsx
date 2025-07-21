import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import withLogout from "../hoc/withLogout";
import CreateExam from "../components/CreateExam";
import ViewStudents from "../components/ViewStudents";
import CreateQuestionsForm from "../components/CreateQuestionsForm";
import { useSelector } from "react-redux";

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [createdExamId, setCreatedExamId] = useState(null); 
  const name = useSelector((state) => state.user.name);
  const AppLayoutWithLogout = withLogout(AppLayout);

  const renderContent = () => {
    switch (activeView) {
      case "viewStudents":
        return <ViewStudents />;

      case "createExam":
        return (
          <CreateExam
            onExamCreated={(examId) => {
              setCreatedExamId(examId);              
              setActiveView("createQuestions");      
            }}
          />
        );

      case "createQuestions":
        return <CreateQuestionsForm examId={createdExamId} />;

      default:
        return (
          <>
            <h2>Welcome, {name || "Teacher"}!</h2>
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

export default TeacherDashboard;
