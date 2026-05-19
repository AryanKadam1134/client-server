import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import DeleteItemPopup from "../../../components/common/DeleteItemPopup";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";
import CustomButton from "../../../components/ui/CustomButton";

import { apiEndpoints } from "../../../api";

import { useNotify } from "../../../context/NotificationContext";
import { usePopup } from "../../../context/PopupContext";

export default function Educations() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState([]);

  const fetchEducations = async () => {
    try {
      const res = await apiEndpoints.getEducations();

      const data = res.data;

      setEducations(data);
      console.log("User Educations: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch educations");
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (educationId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteEducation(educationId);

      fetchEducations();
      closePopupWindow();
      notify.msgSuccess("Education Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete education");
    } finally {
      setDeleting(false);
    }
  };

  const deleteEducationPopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Education",
      <DeleteItemPopup func={() => deleteEducation(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Institute Name" },
    { label: "Qualification" },
    { label: "Percentage / CGPA" },
    { label: "Is Present" },
    { label: "Actions" },
  ];

  const tableBody = educations?.map((data, index) => {
    const { _id, instituteName, qualification, percentage, cgpa, isCurrent } =
      data;

    return {
      cells: [
        index + 1,
        instituteName,
        qualification,
        percentage || cgpa,
        isCurrent ? "Yes" : "No",
        <div className="flex items-center gap-1">
          <EditButton onClick={() => navigate(`${_id}/edit`)} />

          <DeleteButton
            onClick={() => deleteEducationPopup(_id)}
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
        <Plus size={18} /> Add Education
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
