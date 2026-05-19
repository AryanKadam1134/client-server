import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import DeleteItemPopup from "../../../components/common/DeleteItemPopup";
import EditButton from "../../../components/ui/EditButton";
import DeleteButton from "../../../components/ui/DeleteButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";
import { getLocationType } from "../../../utils/getLocationType";
import { getEmploymentType } from "../../../utils/getEmploymentType";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";
import useLocationTypesList from "../../../hooks/useLocationTypesList";

import { useNotify } from "../../../context/NotificationContext";
import { usePopup } from "../../../context/PopupContext";

export default function Experiences() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);

  const fetchExperiences = async () => {
    try {
      const res = await apiEndpoints.getExperiences();

      const data = res.data;

      setExperiences(data);
      // console.log("User Experiences: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (experienceId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteExperience(experienceId);

      fetchExperiences();
      closePopupWindow();
      notify.msgSuccess("Experience Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete experience");
    } finally {
      setDeleting(false);
    }
  };

  const deleteExperiencePopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Experience",
      <DeleteItemPopup func={() => deleteExperience(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Organiaztion Name" },
    { label: "Exployment Type" },
    { label: "Location" },
    { label: "Location Type" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = experiences?.map((data, index) => {
    const {
      _id,
      organization,
      employmentType,
      location,
      locationType,
      visibility,
    } = data;

    return {
      cells: [
        index + 1,
        organization,
        getEmploymentType(employmentTypes, employmentType),
        location,
        getLocationType(locationTypesList, locationType),
        getVisibility(visibilities, visibility),
        <div className="flex items-center gap-1">
          <EditButton onClick={() => navigate(`${_id}/edit`)} />

          <DeleteButton
            onClick={() => deleteExperiencePopup(_id)}
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
        <Plus size={18} /> Add Experience
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
