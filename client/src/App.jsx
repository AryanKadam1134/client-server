import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [socialPlatforms, setSocialPlatforms] = useState(null);

  const fetchSocialPlatforms = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/filter/social-platforms",
      );

      const data = res.data?.data;

      setSocialPlatforms(data);
      console.log("Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching jokes: ", error);
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

export default App;
