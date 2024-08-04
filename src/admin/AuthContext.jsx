// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return { token, user: decoded };
    }
    return null;
  });
  // console.log(auth);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setAuth({ token, user: decoded });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  useEffect(() => {
    // Check token expiration and logout if necessary
    if (auth?.token) {
      const decoded = jwtDecode(auth.token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout();
      }
    }
  }, [auth?.token]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
