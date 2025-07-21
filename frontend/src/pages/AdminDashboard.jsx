import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import withLogout from "../hoc/withLogout";
import AddTeacherForm from "../components/AddTeacherForm";
import AddStudentForm from "../components/AddStudentForm";
import ViewTeachers from "../components/ViewTeachers";
import ViewStudents from "../components/ViewStudents";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const AppLayoutWithLogout = withLogout(AppLayout);

  const renderContent = () => {
    switch (activeView) {
      case "addTeacher":
        return <AddTeacherForm />;
      case "viewTeachers":
        return <ViewTeachers />;
      case "addStudent":
        return <AddStudentForm />;
      case "viewStudents":
        return <ViewStudents />;
      default:
        return (
          <>
            <h2>Welcome, Admin!</h2>
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

export default AdminDashboard;
