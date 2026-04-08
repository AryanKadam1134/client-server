import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine } from "lucide-react";

import Table from "../../components/common/Table";
import CustomButton from "../../components/ui/CustomButton";

import { getCategoryName } from "../../utils/getCategoryName";

import { apiEndpoints } from "../../api";

import useCategoriesFilter from "../../hooks/useCategoriesFilter";

export default function Skills() {
  const { categoriesFilter } = useCategoriesFilter();

  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    try {
      const res = await apiEndpoints.getSkills();

      const data = res.data;

      setSkills(data);
      console.log("User Skills: ", data);
    } catch (error) {
      console.error("Error fetching User Skills: ", error);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await apiEndpoints.deleteSkill(id);

      fetchSkills();
    } catch (error) {
      console.error("Error deleting Skill: ", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Skill Name" },
    { label: "Category" },
    { label: "Level" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = skills?.map((data, index) => {
    const { _id, name, categoryId, level, sortOrder, visibility } = data;

    return {
      cells: [
        index + 1,
        name,
        getCategoryName(categoriesFilter, categoryId),
        level,
        sortOrder === 0 ? "0" : sortOrder,
        visibility,
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteSkill(_id)}
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
        <Plus size={18} /> Add Skill
      </CustomButton>

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
