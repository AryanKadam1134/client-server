import React, { useEffect, useState } from "react";

import useSkillLevels from "../../hooks/useSkillLevels";
import useEmploymentTypes from "../../hooks/useEmploymentTypes";
import useGenders from "../../hooks/useGenders";
import useSocailPlatforms from "../../hooks/useSocailPlatforms";
import useVisibilities from "../../hooks/useVisibilities";

export default function Dashboard() {
  const { skillLevels } = useSkillLevels();
  const { employmentTypes } = useEmploymentTypes();
  const { genders } = useGenders();
  const { socialPlatforms } = useSocailPlatforms();
  const { visibilities } = useVisibilities();

  return <div>Welcome to Dashboard...</div>;
}
