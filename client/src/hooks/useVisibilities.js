import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../api";

export default function useVisibilities() {
  const [visibilitiesLoading, setLoading] = useState(true);
  const [visibilities, setVisibilities] = useState([]);

  const fetchVisibiities = async () => {
    try {
      const res = await apiEndpoints.getVisibilities();

      const data = res.data;

      setVisibilities(data);
      // console.log("Visibilities: ", data);
    } catch (error) {
      console.error("Error fetching Visibilities: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisibiities();
  }, []);

  return { visibilitiesLoading, visibilities };
}
