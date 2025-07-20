import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import withLogout from "../hoc/withLogout";
import ViewStudents from "../components/ViewStudents";
import { useSelector } from "react-redux";


const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const name = useSelector((state) => state.user.name);
  const AppLayoutWithLogout = withLogout(AppLayout);

  const renderContent = () => {
    switch (activeView) {
      case "viewStudents":
        return <ViewStudents />;
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

export default AdminDashboard;
