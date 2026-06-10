import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../services/api";

export default function useSkillLevels() {
  const [skillLevelsLoading, setLoading] = useState(true);
  const [skillLevels, setSkillLevels] = useState([]);

  const fetchSkillLevels = async () => {
    try {
      const res = await apiEndpoints.getSkillLevels();

      const data = res.data;

      setSkillLevels(data);
      // console.log("Skill Levels: ", data);
    } catch (error) {
      console.error("Error fetching Skill Levels: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillLevels();
  }, []);

  return { skillLevelsLoading, skillLevels };
}
