import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../interceptor";
import { useDispatch } from "react-redux";
import { setUserName, clearUserName } from "../redux/actions/userActions";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const role = localStorage.getItem("role");

    if (access && refresh && role) {
      setUser({ access, refresh, role });
    }

    setLoading(false); 
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/token/", credentials);
      const { access, refresh, role, full_name } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("role", role);

      setUser({ access, refresh, role });

      dispatch(setUserName(full_name));

      return role;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setUser(null);
    dispatch(clearUserName());
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
