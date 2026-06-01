import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  FilePenLine,
  ExternalLink,
  ArrowLeftRight,
  Grid3x3,
  List,
  Calendar,
  Github,
  Globe,
  Edit2,
  Trash,
} from "lucide-react";

import Table from "../../../components/common/Table";
import DeleteItemPopup from "../../../components/common/DeleteItemPopup";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";
import CustomButton from "../../../components/ui/CustomButton";
import Pagination from "../../../components/ui/Pagination";

import { getVisibility } from "../../../utils/getVisibility";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/NotificationContext";
import { usePopup } from "../../../context/PopupContext";

export default function Projects() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchProjects = async () => {
    try {
      const res = await apiEndpoints.getProjects(params);

      const data = res.data;

      setProjects(data?.data);
      setPagination(data?.pagination);
      console.log("User Projects: ", data);
    } catch (error) {
      console.error("Error fetching User Projects: ", error);
      notify.msgError(error?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteProject(projectId);

      fetchProjects();
      closePopupWindow();
      notify.msgSuccess("Project Deleted!");
    } catch (error) {
      console.error("Error deleting Project: ", error);
      notify.msgError(error?.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const deleteProjectPopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Project",
      <DeleteItemPopup func={() => deleteProject(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchProjects();
  }, [params?.page]);

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
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        title,
        liveLink && (
          <a
            href={`${liveLink}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        githubLink && (
          <a
            href={`${githubLink}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        sortOrder === 0 ? "0" : sortOrder,
        getVisibility(visibilities, visibility),
        featured ? "Yes" : "No",
        <div className="flex items-center gap-1">
          <EditButton onClick={() => navigate(`${_id}/edit`)} />

          <DeleteButton
            onClick={() => deleteProjectPopup(_id)}
            disabled={deleting}
          />
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

      <Pagination
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
      />
    </div>
  );
}
