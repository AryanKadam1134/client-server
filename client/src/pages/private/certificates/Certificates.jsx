import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine, ExternalLink } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

export default function Certificates() {
  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

  const fetchCertificate = async () => {
    try {
      const res = await apiEndpoints.getCertificates();

      const data = res.data;

      setCertificates(data);
      console.log("User Certificates: ", data);
    } catch (error) {
      console.error("Error fetching User Certificates: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (certificateId) => {
    try {
      await apiEndpoints.deleteCertificate(certificateId);

      fetchCertificate();
    } catch (error) {
      console.error("Error deleting Certificates: ", error);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, []);

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
        index + 1,
        title,
        issuer,
        credentialUrl && (
          <div className="flex justify-center">
            <a
              href={`${credentialUrl}`}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        ),
        getVisibility(visibilities, visibility),
        sortOrder === 0 ? "0" : sortOrder,
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate(`${_id}/edit`)}
            className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
          >
            <FilePenLine size={18} />
          </button>

          <button
            onClick={() => deleteCertificate(_id)}
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
        <Plus size={18} /> Add Certificate
      </CustomButton>

      <Table
        loading={loading}
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    </div>
  );
}
