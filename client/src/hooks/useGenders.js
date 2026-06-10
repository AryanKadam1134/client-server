import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../services/api";

export default function useGenders() {
  const [gendersLoading, setLoading] = useState(true);
  const [genders, setGenders] = useState([]);

  const fetchGenders = async () => {
    try {
      const res = await apiEndpoints.getGenders();

      const data = res.data;

      setGenders(data);
      // console.log("All Genders: ", data);
    } catch (error) {
      console.error("Error fetching Genders: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  return { gendersLoading, genders };
}
