import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);

  // Check authentication on mount and update when login/logout happens
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const _id = localStorage.getItem("_id");
    const email = localStorage.getItem("email");

    if (token && role && _id && email) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(_id);
      setEmail(email);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setEmail(null);
    }
  }, []);

  const login = (token, role, _id, email) => {
    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("_id", _id);
    localStorage.setItem("email", email);
    // console.log(token, role, _id, email);

    // Update state
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(_id);
    setEmail(email);

  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("_id");
    localStorage.removeItem("email");

    // Update state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userId,
        email,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);