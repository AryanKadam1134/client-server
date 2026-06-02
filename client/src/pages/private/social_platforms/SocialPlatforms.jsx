import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import Table from "../../../components/common/Table";
import DeleteItemPopup from "../../../components/common/DeleteItemPopup";

import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

import { usePopup } from "../../../context/PopupContext";
import { useNotify } from "../../../context/NotificationContext";

export default function SocialPlatforms() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getSocialPlatforms(params);

      const data = res.data;

      setPlatforms(data?.data);
      setPagination(data?.pagination);
      console.log("User Social Platforms: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch social platforms");
    } finally {
      setLoading(false);
    }
  };

  const deletePlatform = async (platformId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteSocialPlatform(platformId);

      fetchSocialPlatforms();
      closePopupWindow();
      notify.msgSuccess("Platform Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete social platform");
    } finally {
      setDeleting(false);
    }
  };

  const deletePlatformPopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Platform",
      <DeleteItemPopup func={() => deletePlatform(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Platform Name" },
    { label: "Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = platforms?.map((data, index) => {
    const { _id, name, link, sortOrder, visibility } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        name,
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
        <div className="flex items-center gap-1">
          <ActionButton
            variant="edit"
            onClick={() => navigate(`${_id}/edit`)}
            disabled={deleting}
          />

          <ActionButton
            variant="delete"
            onClick={() => deletePlatformPopup(_id)}
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
        <Plus size={18} /> Add Social Platfrom
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
