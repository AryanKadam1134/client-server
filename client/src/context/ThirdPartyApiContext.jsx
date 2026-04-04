import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export function ApiProvider({ children }) {
  const [socialApps, setSocialApps] = useState(null);
  const [appsLoading, setAppsLoading] = useState(true);

  const fetchSocialApps = async () => {
    try {
      const res = await axios.get("https://api.svgl.app/category/social");

      const data = res.data;

      if (res?.success) {
        setSocialApps(data?.socialApps);
      }

      console.log("SVGL Social Apps:", data);
    } catch (error) {
      console.error("Error fetching Social Apps: ", error);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    // fetchSocialApps();
  }, []);

  return (
    <ApiContext.Provider value={{ socialApps, appsLoading }}>
      {children}
    </ApiContext.Provider>
  );
}
