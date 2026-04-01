import React, { useState, useEffect } from "react";

import { apiEndpoints } from "../api";

export default function useEmploymentTypes() {
  const [employemntTypesLoading, setLoading] = useState(true);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const fetchEmploymentTypes = async () => {
    try {
      const res = await apiEndpoints.getEmploymentTypes();

      const data = res.data;

      setEmploymentTypes(data);
      console.log("Employment Types: ", data);
    } catch (error) {
      console.error("Error fetching Employment Types: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmploymentTypes();
  }, []);

  return { employemntTypesLoading, employmentTypes };
}
