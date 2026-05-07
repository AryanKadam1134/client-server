import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/NotificationContext";

export default function Achievements() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const res = await apiEndpoints.getAchievements();

      const data = res.data;

      setAchievements(data);
      console.log("User Achievements: ", data);
    } catch (error) {
      console.error("Error fetching User Achievements: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (achievementId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteAchievement(achievementId);

      fetchAchievements();
      notify.msgSuccess("Achievement Deleted!");
    } catch (error) {
      console.error("Error deleting Achievement: ", error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Title" },
    { label: "Issuer" },
    { label: "Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Featured" },
    { label: "Actions" },
  ];

  const tableBody = achievements?.map((data, index) => {
    const { _id, title, issuer, link, sortOrder, visibility, featured } = data;

    return {
      cells: [
        index + 1,
        title,
        issuer,
        link && (
          <a
            href={`${link}`}
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
            onClick={() => deleteAchievement(_id)}
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
        <Plus size={18} /> Add Achievement
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
