import React, { useState } from "react";

import { apiEndpoints } from "../../api";
import { useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiEndpoints.getCurrentUser();

        const data = res.data;

        setUser(data);
        console.log("User Details: ", data);
      } catch (error) {
        console.error("Error fetching User Details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  return <div className="grid grid-cols-12 gap-6">
    
    
  </div>;
}
