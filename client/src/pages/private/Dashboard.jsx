import React, { useEffect, useState } from "react";

import { apiEndpoints } from "../../api";

export default function Dashboard() {
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
    <div className="p-5 bg-gray-400 h-full">
      {socialPlatforms?.map((platform, idx) => (
        <div key={idx}>{platform?.label}</div>
      ))}
    </div>
  );
}
