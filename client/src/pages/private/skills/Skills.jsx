import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getSkillLevel } from "../../../utils/getSkillLevel";
import { getVisibility } from "../../../utils/getVisibility";
import { getCategoryName } from "../../../utils/getCategoryName";

import { apiEndpoints } from "../../../api";

import useSkillLevels from "../../../hooks/useSkillLevels";
import useVisibilities from "../../../hooks/useVisibilities";
import useCategoriesList from "../../../hooks/useCategoriesList";

import { useNotify } from "../../../context/NotificationContext";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";

export default function Skills() {
  const { notify } = useNotify();

  const { skillLevels } = useSkillLevels();
  const { visibilities } = useVisibilities();
  const { categoriesList } = useCategoriesList();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    try {
      const res = await apiEndpoints.getSkills();

      const data = res.data;

      setSkills(data);
      console.log("User Skills: ", data);
    } catch (error) {
      console.error("Error fetching User Skills: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    setDeleting(true);
    try {
      await apiEndpoints.deleteSkill(id);

      fetchSkills();
      notify.msgSuccess("Skill Deleted!");
    } catch (error) {
      console.error("Error deleting Skill: ", error);
    } finally {
      setDeleting(false);
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
        getCategoryName(categoriesList, categoryId),
        getSkillLevel(skillLevels, level),
        sortOrder === 0 ? "0" : sortOrder,
        getVisibility(visibilities, visibility),
        <div className="flex items-center justify-center gap-1">
          <EditButton onClick={() => navigate(`${_id}/edit`)} />

          <DeleteButton onClick={() => deleteSkill(_id)} disabled={deleting} />
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

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
