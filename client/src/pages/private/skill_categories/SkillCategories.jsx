import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine } from "lucide-react";

import Table from "../../../components/common/Table";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

import { useNotify } from "../../../context/NotificationContext";

export default function SkillCategories() {
  const { notify } = useNotify();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchSkillCategories = async () => {
    try {
      const res = await apiEndpoints.getSkillCategories();

      const data = res.data;

      setCategories(data);
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
      notify.msgSuccess("Category Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete skill category");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchSkillCategories();
  }, []);

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
        index + 1,
        name,
        sortOrder === 0 ? "0" : sortOrder,
        getVisibility(visibilities, visibility),
        <div className="flex items-center gap-1">
          <EditButton onClick={() => navigate(`${_id}/edit`)} />

          <DeleteButton
            onClick={() => deleteSkillCategory(_id)}
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
    </div>
  );
}
