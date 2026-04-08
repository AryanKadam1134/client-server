import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../api";

export default function useCategoriesFilter() {
  const [categoriesLoading, setLoading] = useState(true);
  const [categoriesFilter, setCategoriesFilter] = useState([]);

  const fetchSkillCategories = async () => {
    try {
      const res = await apiEndpoints.getSkillCategoriesFilter();

      const data = res.data;

      setCategoriesFilter(data);
      console.log("Skill Categories Filter: ", data);
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
