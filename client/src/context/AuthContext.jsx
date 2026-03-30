import React, { createContext, useContext, useEffect, useState } from "react";
import { apiEndpoints } from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (payload) => {
    try {
      const res = await apiEndpoints.login(payload);

      const data = res.data;

      if (res?.success) {
        setUser(data?.user);
      }

      console.log("Login succesfull:", data);
    } catch (error) {
      console.error("Error while login: ", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiEndpoints.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await apiEndpoints.restoreSession();

        const data = res.data;

        if (res?.success) {
          setUser(data?.user);
        }

        console.log("Session restored: ", data);
      } catch (error) {
        console.error("Error restoring session: ", error);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
