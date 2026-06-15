import React, { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken, decodeToken, isTokenExpired } from "../utils/tokenUtils";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ROLES } from "../constants/roles";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  // Initialize and check token expiry using local storage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      const storedUserStr = localStorage.getItem("user");
      if (storedToken && !isTokenExpired(storedToken) && storedUserStr) {
        setTokenState(storedToken);
        setUser(JSON.parse(storedUserStr));
      } else {
        logout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
      const { token: jwtToken, id: userId, role: userRole, username: responseUsername } = response.data;
      
      setToken(jwtToken);
      setTokenState(jwtToken);
      
      const loggedUser = {
        id: userId,
        username: responseUsername || username,
        role: userRole || ROLES.CUSTOMER,
      };
      
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      setLoading(false);
      return loggedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    setTokenState(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !isTokenExpired(token),
    isAdmin: user?.role === ROLES.ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
