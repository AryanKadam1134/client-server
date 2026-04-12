import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

export default function SkillCategories() {
  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const fetchSkillCategories = async () => {
    try {
      const res = await apiEndpoints.getSkillCategories();

      const data = res.data;

      setCategories(data);
      console.log("User Skill Categories: ", data);
    } catch (error) {
      console.error("Error fetching User Skill Categories: ", error);
    }
  };

  const deleteSkillCategory = async (categoryId) => {
    try {
      await apiEndpoints.deleteSkillCategory(categoryId);

      fetchSkillCategories();
    } catch (error) {
      console.error("Error deleting Skill Category: ", error);
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
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteSkillCategory(_id)}
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
        <Plus size={18} /> Add Skill Category
      </CustomButton>

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
