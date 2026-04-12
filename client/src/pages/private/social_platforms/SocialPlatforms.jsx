import React, { Fragment, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FilePenLine } from "lucide-react";

import Table from "../../../components/common/Table";
import CustomButton from "../../../components/ui/CustomButton";

import { getVisibility } from "../../../utils/getVisibility";

import { apiEndpoints } from "../../../api";

import useVisibilities from "../../../hooks/useVisibilities";

export default function SocialPlatforms() {
  const { visibilities } = useVisibilities();

  const navigate = useNavigate();

  const [platforms, setPlatforms] = useState([]);

  const fetchSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getSocialPlatforms();

      const data = res.data;

      setPlatforms(data);
      console.log("User Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching User Social Platforms: ", error);
    }
  };

  const deletePlatform = async (platformId) => {
    try {
      await apiEndpoints.deleteSocialPlatform(platformId);

      fetchSocialPlatforms();
    } catch (error) {
      console.error("Error deleting Social Platform: ", error);
    }
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, []);

  const tableHeading = [
    { label: "Sr. No." },
    { label: "Platform Name" },
    { label: "Link" },
    { label: "Sort Order" },
    { label: "Visibility" },
    { label: "Actions" },
  ];

  const tableBody = platforms?.map((data, index) => {
    const { _id, name, link, sortOrder, visibility } = data;

    return {
      cells: [
        index + 1,
        name,
        link,
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
            onClick={() => deletePlatform(_id)}
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
        <Plus size={18} /> Add Social Platfrom
      </CustomButton>

      <Table tableHeading={tableHeading} tableBody={tableBody} />
    </div>
  );
}
