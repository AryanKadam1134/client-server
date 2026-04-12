import React, { Fragment, useEffect, useState } from "react";

import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { apiEndpoints } from "../../../api";

import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await apiEndpoints.getProjects();

      const data = res.data;

      setProjects(data);
      console.log("User Projects: ", data);
    } catch (error) {
      console.error("Error fetching User Projects: ", error);
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
        visibility,
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

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
