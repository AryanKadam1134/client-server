import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

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

export default function Achievements() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchAchievements = async () => {
    try {
      const res = await apiEndpoints.getAchievements(params);

      const data = res.data;

      setAchievements(data?.data);
      setPagination(data?.pagination);
      console.log("User Achievements: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (achievementId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteAchievement(achievementId);

      fetchAchievements();
      closePopupWindow();
      notify.msgSuccess("Achievement Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete achievement");
    } finally {
      setDeleting(false);
    }
  };

  const deleteAchievementPopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Achievement",
      <DeleteItemPopup func={() => deleteAchievement(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchAchievements();
  }, [params?.page]);

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
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
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
            onClick={() => deleteAchievementPopup(_id)}
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

      <Pagination
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
      />
    </div>
  );
}
