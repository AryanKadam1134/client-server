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

function ProjectCard({ project, onEdit, onDelete, isDeleting }) {
  const {
    _id,
    title,
    description,
    coverImageIndex,
    projectImages,
    techStack,
    category,
    liveLink,
    githubLink,
    featured,
  } = project;

  const coverImage = projectImages?.[coverImageIndex]?.url;

  const formatText = (text, maxLines = 2) => {
    const lines = text?.split("\n").slice(0, maxLines).join("\n");
    return lines?.length > 100 ? lines?.substring(0, 100) + "..." : lines;
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden bg-light-bg-primary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:border-light-border-secondary dark:hover:border-dark-border-secondary">
      {/* Image Container */}
      <div className="relative w-full h-40 bg-light-bg-secondary dark:bg-dark-bg-secondary overflow-hidden group">
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-light-bg-hover dark:bg-dark-bg-hover">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">
              No Image
            </p>
          </div>
        )}

        {featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-light-text-primary dark:text-dark-text-primary font-semibold truncate">
            {title}
          </h3>
        </div>

        {/* Category Badge */}
        {category && (
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium capitalize">
              {category}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs leading-relaxed line-clamp-2">
            {formatText(description, 2)}
          </p>
        )}

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techStack.slice(0, 3).map((skill) => (
              <span
                key={skill._id}
                className="px-2 py-0.5 rounded text-xs font-medium bg-light-bg-hover dark:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary"
              >
                {skill.name}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                +{techStack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 pt-2">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-colors"
              title="Live Link"
            >
              <Globe size={14} />
              <span className="text-xs hidden sm:inline">Live</span>
            </a>
          )}

          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-colors"
              title="GitHub Link"
            >
              <Github size={14} />
              <span className="text-xs hidden sm:inline">Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-secondary border-t border-light-border-primary dark:border-dark-border-primary">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-colors text-xs font-medium"
        >
          <Edit2 size={14} />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs font-medium disabled:opacity-50"
        >
          <Trash size={14} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}
