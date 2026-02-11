import React, { useEffect, useState } from "react";

import { apiEndpoints } from "../../api";

export default function AdminDashboard() {
  const [socialPlatforms, setSocialPlatforms] = useState(null);

  const fetchSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getSocialPlatforms();

      const data = res.data?.data;

      setSocialPlatforms(data);
      console.log("Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching Social Platforms: ", error);
    }
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, []);

  return (
    <div>
      {socialPlatforms?.map((platform, idx) => (
        <div key={idx}>{platform?.label}</div>
      ))}
    </div>
  );
}
