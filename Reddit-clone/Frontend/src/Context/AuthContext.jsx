import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);

  const checkAuth = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { withCredentials: true }
      );
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Run once on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthVersion(v => v + 1);
  };

 return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, authVersion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);