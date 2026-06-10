import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import DeleteItemPopup from "../../../components/common/DeleteItemPopup";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { apiEndpoints } from "../../../services/api";

import useVisibilities from "../../../hooks/useVisibilities";

import { usePopup } from "../../../context/PopupContext";
import { useNotify } from "../../../context/NotificationContext";

export default function SkillCategories() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchSkillCategories = async () => {
    try {
      const res = await apiEndpoints.getSkillCategories(params);

      const data = res.data;

      setCategories(data?.data);
      setPagination(data?.pagination);
      console.log("User Skill Categories: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch skill categories");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkillCategory = async (categoryId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteSkillCategory(categoryId);

      fetchSkillCategories();
      closePopupWindow();
      notify.msgSuccess("Category Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete skill category");
    } finally {
      setDeleting(false);
    }
  };

  const deleteSkillCategoryPopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Skill Category",
      <DeleteItemPopup func={() => deleteSkillCategory(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchSkillCategories();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Category Name" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = categories?.map((data, index) => {
    const { _id, name, sortOrder, visibility } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        name,
        sortOrder === 0 ? "0" : sortOrder,
        getVisibility(visibilities, visibility),
        <div className="flex items-center gap-1">
          <ActionButton
            icon={FilePenLine}
            variant="green"
            onClick={() => navigate(`${_id}/edit`)}
            disabled={deleting}
          />

          <ActionButton
            icon={Trash2}
            variant="red"
            onClick={() => deleteSkillCategoryPopup(_id)}
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
        <Plus size={18} /> Add Skill Category
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
