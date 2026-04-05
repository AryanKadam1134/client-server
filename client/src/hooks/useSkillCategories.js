import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../api";

export default function useSkillCategories() {
  const [categoriesLoading, setLoading] = useState(true);
  const [categoriesFilter, setCategoriesFilter] = useState([]);

  const fetchSkillCategories = async () => {
    try {
      const res = await apiEndpoints.getSkillCategories();

      const data = res.data;

      const formatted = data.map((c) => ({ label: c?.name, value: c?._id }));

      setCategoriesFilter(formatted);
      // console.log("Skill Levels: ", data);
    } catch (error) {
      console.error("Error fetching Skill Levels: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillCategories();
  }, []);

  return { categoriesLoading, categoriesFilter };
}
