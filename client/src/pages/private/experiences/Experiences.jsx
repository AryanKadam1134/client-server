import React, { Fragment, useEffect, useState } from "react";

import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { apiEndpoints } from "../../../api";

import { useNavigate } from "react-router-dom";

export default function Experiences() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);

  const fetchExperiences = async () => {
    try {
      const res = await apiEndpoints.getExperiences();

      const data = res.data;

      setExperiences(data);
      console.log("User Experiences: ", data);
    } catch (error) {
      console.error("Error fetching User Experiences: ", error);
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
    { label: "Organization Website" },
    { label: "Location" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = experiences?.map((data, index) => {
    const {
      _id,
      organization,
      employmentType,
      organizationWebsite,
      location,
      visibility,
    } = data;

    return {
      cells: [
        index + 1,
        organization,
        employmentType,
        organizationWebsite,
        location,
        visibility,
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

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
