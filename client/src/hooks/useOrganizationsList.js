import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../api";

export default function useOrganizationsList() {
  const [organiaztionsLoading, setLoading] = useState(true);
  const [organizationsList, setOrganizationsList] = useState([]);

  const fetchOrganizationsList = async () => {
    try {
      const res = await apiEndpoints.getOrganizationsList();

      const data = res.data;

      setOrganizationsList(data);
      // console.log("Organizations List: ", data);
    } catch (error) {
      console.error("Error fetching Organizations List: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsList();
  }, []);

  return { organiaztionsLoading, organizationsList };
}
