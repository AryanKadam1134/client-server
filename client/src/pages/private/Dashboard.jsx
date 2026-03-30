import React, { useEffect, useState } from "react";

import { apiEndpoints } from "../../api";

import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  const [socialPlatforms, setSocialPlatforms] = useState(null);

  useEffect(() => {
    const fetchSocialPlatforms = async () => {
      try {
        const res = await apiEndpoints.getSocialPlatforms();

        const data = res.data;

        setSocialPlatforms(data);
        console.log("Social Platforms: ", data);
      } catch (error) {
        console.error("Error fetching Social Platforms: ", error);
      }
    };

    fetchSocialPlatforms();
  }, []);

  return (
    <div>
      {socialPlatforms?.map((platform, idx) => (
        <div key={idx}>{platform?.label}</div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
