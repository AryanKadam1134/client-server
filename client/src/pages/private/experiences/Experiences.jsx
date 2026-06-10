import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FilePenLine, Plus, Trash2 } from "lucide-react";

import DeleteItemPopup from "../../../components/common/DeleteItemPopup";

import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import ActionButton from "../../../components/ui/ActionButton";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";
import { getLocationType } from "../../../utils/getLocationType";
import { getEmploymentType } from "../../../utils/getEmploymentType";
import { calculateSerialNumber } from "../../../utils/calculateSerialNumber";

import { experienceEndpoints } from "../../../services/experienceService";

import useVisibilities from "../../../hooks/useVisibilities";
import useEmploymentTypes from "../../../hooks/useEmploymentTypes";
import useLocationTypesList from "../../../hooks/useLocationTypesList";

import { usePopup } from "../../../context/PopupContext";
import { useNotify } from "../../../context/NotificationContext";

export default function Experiences() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();
  const { employmentTypes } = useEmploymentTypes();
  const { locationTypesList } = useLocationTypesList();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchExperiences = async () => {
    try {
      const res = await experienceEndpoints.getExperiences(params);

      const data = res.data;

      setExperiences(data?.data);
      setPagination(data?.pagination);
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
      await experienceEndpoints.deleteExperience(experienceId);

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
  }, [params?.page]);

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
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        organization,
        getEmploymentType(employmentTypes, employmentType),
        location,
        getLocationType(locationTypesList, locationType),
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

      <Pagination
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
      />
    </div>
  );
}
