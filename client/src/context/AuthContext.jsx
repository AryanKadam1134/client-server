import React, { createContext, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

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

  let deviceId = localStorage.getItem("deviceId");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("deviceId", deviceId);
  }

  const login = async (payload) => {
    try {
      const res = await apiEndpoints.login(payload, {
        headers: {
          "x-device-id": deviceId,
        },
      });

      const data = res.data;

      if (res?.success) {
        setUser(data?.user);
        localStorage.setItem("refreshToken", data?.refreshToken);
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
        const res = await apiEndpoints.restoreSession({
          headers: {
            "x-device-id": deviceId,
            refreshtoken: refreshToken,
          },
        });

        const data = res.data;

        if (res?.success) {
          setUser(data?.user);
          localStorage.setItem("refreshToken", data?.refreshToken);
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
