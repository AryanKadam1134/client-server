import React, { createContext, useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../services/authService";

import { useNotify } from "./NotificationContext";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export function AuthProvider({ children }) {
  const { notify } = useNotify();

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("deviceId", deviceId);
  }

  const googleAuth = async (credentialResponse, rememberMe) => {
    try {
      const res = await authEndpoints.googleAuth(
        { credential: credentialResponse.credential, rememberMe },
        {
          headers: {
            "x-device-id": deviceId,
          },
        },
      );

      const data = res.data;

      if (res?.success) {
        setUser(data?.user);
      }

      console.log("Login with Google succesfull:", data);
    } catch (error) {
      console.error("Error Login with Google: ", error);
    }
  };

  const login = async (payload) => {
    try {
      const res = await authEndpoints.login(payload, {
        headers: {
          "x-device-id": deviceId,
        },
      });
      const data = res.data;
      const success = res.success;

      if (success) {
        setUser(data?.user);
      }

      setError(null);
      return success;

      // console.log("Login succesfull:", data);
    } catch (error) {
      console.error("Error while login: ", error);
      notify.msgError("Login failed!");
      setError(error?.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authEndpoints.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await authEndpoints.restoreSession({
          headers: {
            "x-device-id": deviceId,
          },
        });

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
    <AuthContext.Provider
      value={{
        error,
        setError,
        user,
        authLoading,
        googleAuth,
        login,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
