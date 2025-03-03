import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  saveToken: (token) => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (newToken) => {
    if (newToken) {
      setIsAuthenticated(true);
      saveToken(newToken); // Save the token
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
