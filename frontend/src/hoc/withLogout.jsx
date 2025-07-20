import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const withLogout = (Component) => {
  return function WrappedWithLogout(props) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    return <Component {...props} onLogout={handleLogout} />;
  };
};

export default withLogout;
