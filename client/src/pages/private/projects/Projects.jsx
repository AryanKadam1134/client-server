import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

export default function Projects() {
  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await apiEndpoints.getProjects();

      const data = res.data;

      setProjects(data);
      console.log("User Projects: ", data);
    } catch (error) {
      console.error("Error fetching User Projects: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await apiEndpoints.deleteProject(projectId);

      fetchProjects();
    } catch (error) {
      console.error("Error deleting Project: ", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Project Name" },
    { label: "Live Link" },
    { label: "Github Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Featured" },
    { label: "Actions" },
  ];

  const tableBody = projects?.map((data, index) => {
    const {
      _id,
      title,
      liveLink,
      githubLink,
      sortOrder,
      visibility,
      featured,
    } = data;

    return {
      cells: [
        index + 1,
        title,
        liveLink && (
          <div className="flex justify-center">
            <a
              href={`${liveLink}`}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        ),
        githubLink && (
          <div className="flex justify-center">
            <a
              href={`${githubLink}`}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        ),
        sortOrder === 0 ? "0" : sortOrder,
        getVisibility(visibilities, visibility),
        featured ? "Yes" : "No",
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteProject(_id)}
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
        <Plus size={18} /> Add Project
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
