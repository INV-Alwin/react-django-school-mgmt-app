import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import AddTeacherForm from "../components/AddTeacherForm";
import ViewTeachers from "../components/ViewTeachers";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "addTeacher":
        return <AddTeacherForm />;
      case "viewTeachers":
        return <ViewTeachers />;
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
    <AppLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </AppLayout>
  );
};

export default AdminDashboard;
