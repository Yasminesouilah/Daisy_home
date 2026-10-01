import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "../services/adminApi.js";
import {
  getCurrentAdmin,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    getCurrentAdmin()
      .then((currentAdmin) => {
        if (active) setAdmin(currentAdmin);
      })
      .catch(() => {
        logoutRequest();
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function signIn(email, password) {
    const loggedInAdmin = await loginRequest(email, password);
    setAdmin(loggedInAdmin);
  }

  function signOut() {
    logoutRequest();
    setAdmin(null);
  }

  const value = { admin, loading, token: Boolean(admin), signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AuthProvider');
  return context;
}