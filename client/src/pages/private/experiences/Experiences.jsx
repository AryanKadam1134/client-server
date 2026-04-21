import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";
import { getEmploymentType } from "../../../utils/getEmploymentType";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";
import useLocationTypesList from "../../../hooks/useLocationTypesList";
import { getLocationType } from "../../../utils/getLocationType";

export default function Experiences() {
  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);

  const fetchExperiences = async () => {
    try {
      const res = await apiEndpoints.getExperiences();

      const data = res.data;

      setExperiences(data);
      console.log("User Experiences: ", data);
    } catch (error) {
      console.error("Error fetching User Experiences: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (experienceId) => {
    try {
      await apiEndpoints.deleteExperience(experienceId);

      fetchExperiences();
    } catch (error) {
      console.error("Error deleting Experience: ", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Organiaztion Name" },
    { label: "Exployment Type" },
    { label: "Location" },
    { label: "Location Type" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = experiences?.map((data, index) => {
    const {
      _id,
      organization,
      employmentType,
      location,
      locationType,
      visibility,
    } = data;

    return {
      cells: [
        index + 1,
        organization,
        getEmploymentType(employmentTypes, employmentType),
        location,
        getLocationType(locationTypesList, locationType),
        getVisibility(visibilities, visibility),
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteExperience(_id)}
            className="p-1 text-white bg-red-500 hover:bg-red-600 rounded transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-6 text-sm">
      <CustomButton
        onClick={() => navigate("add")}
        className="self-end flex items-center gap-2"
      >
        <Plus size={18} /> Add Experience
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
