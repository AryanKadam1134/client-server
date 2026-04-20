import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { apiEndpoints } from "../../../api";

export default function Educations() {
  const navigate = useNavigate();

  const [educations, setEducations] = useState([]);

  const fetchEducations = async () => {
    try {
      const res = await apiEndpoints.getEducations();

      const data = res.data;

      setEducations(data);
      console.log("User Educations: ", data);
    } catch (error) {
      console.error("Error fetching User Educations: ", error);
    }
  };

  const deleteEducation = async (educationId) => {
    try {
      await apiEndpoints.deleteEducation(educationId);

      fetchEducations();
    } catch (error) {
      console.error("Error deleting Educations: ", error);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Institute Name" },
    { label: "Qualification" },
    { label: "Percentage / CGPA" },
    { label: "Is Present" },
    { label: "Actions" },
  ];

  const tableBody = educations?.map((data, index) => {
    const { _id, instituteName, qualification, percentage, cgpa, present } =
      data;

    return {
      cells: [
        index + 1,
        instituteName,
        qualification,
        percentage || cgpa,
        present ? "Yes" : "No",
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteEducation(_id)}
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
        <Plus size={18} /> Add Education
      </CustomButton>

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
