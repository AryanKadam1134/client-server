import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

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

export default function Certificates() {
  const { notify } = useNotify();
  const { openPopupWindow, closePopupWindow } = usePopup();

  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
  });

  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchCertificate = async () => {
    try {
      const res = await apiEndpoints.getCertificates(params);

      const data = res.data;

      setCertificates(data?.data);
      setPagination(data?.pagination);
      console.log("User Certificates: ", data);
    } catch (error) {
      notify.msgError(error?.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (certificateId) => {
    setDeleting(true);

    try {
      await apiEndpoints.deleteCertificate(certificateId);

      fetchCertificate();
      closePopupWindow();
      notify.msgSuccess("Certificate Deleted!");
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete certificate");
    } finally {
      setDeleting(false);
    }
  };

  const deleteCertificatePopup = (_id) => {
    openPopupWindow(
      <Trash2 strokeWidth={3} />,
      "Delete Certificate",
      <DeleteItemPopup func={() => deleteCertificate(_id)} />,
      "bg-red-500",
    );
  };

  useEffect(() => {
    fetchCertificate();
  }, [params?.page]);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Title" },
    { label: "Issuer" },
    { label: "URL" },
    { label: "Visibility" },
    { label: "Sort Order" },
    { label: "Actions" },
  ];

  const tableBody = certificates?.map((data, index) => {
    const { _id, title, issuer, credentialUrl, visibility, sortOrder } = data;

    return {
      cells: [
        calculateSerialNumber(pagination?.page, index, pagination?.limit),
        title,
        issuer,
        credentialUrl && (
          <a
            href={`${credentialUrl}`}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            <ExternalLink size={18} />
          </a>
        ),
        getVisibility(visibilities, visibility),
        sortOrder === 0 ? "0" : sortOrder,
        <div className="flex items-center gap-1">
          <ActionButton
            variant="edit"
            onClick={() => navigate(`${_id}/edit`)}
            disabled={deleting}
          />

          <ActionButton
            variant="delete"
            onClick={() => deleteCertificatePopup(_id)}
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
        <Plus size={18} /> Add Certificate
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
