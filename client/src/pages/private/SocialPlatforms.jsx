import React, { Fragment, useEffect, useState } from "react";

import { Plus, Trash2, FilePenLine } from "lucide-react";

import CustomButton from "../../components/ui/CustomButton";

import { apiEndpoints } from "../../api";
import { useNavigate } from "react-router-dom";

export default function SocialPlatforms() {
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

  const deletePlatform = async (accountId) => {
    try {
      await apiEndpoints.deleteSocialPlatform(accountId);

      fetchSocialPlatforms();
    } catch (error) {
      console.error("Error deleting Social Account: ", error);
    }
  };

  useEffect(() => {
    fetchSocialPlatforms();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-sm">
      <CustomButton onClick={() => navigate("add")} className="self-end">
        Add Social Platfrom
      </CustomButton>

      <table
        className="w-full 
        [&_th]:px-2 [&_th]:py-3 [&_th]:text-center [&_th]:min-w-[100px] [&_th]:whitespace-nowrap
        [&_td]:px-2 [&_td]:py-3 [&_td]:text-center [&_td]:min-w-[100px] [&_td]:whitespace-nowrap"
      >
        <thead>
          <tr>
            <th>Platform Name</th>
            <th>Link</th>
            <th>Sort Order</th>
            <th>Visibility</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {platforms.map((item, index) => (
            <tr
              key={item?.name || index}
              className={index % 2 === 0 ? "bg-gray-200" : ""}
            >
              <td>{item?.name}</td>
              <td>{item?.link}</td>
              <td>{item?.sortOrder}</td>
              <td>{item?.visibility}</td>
              <td>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => navigate(`${item?._id}/edit`)}
                    className="p-1 text-white bg-green-500 hover:bg-green-600 rounded transition-colors cursor-pointer"
                  >
                    <FilePenLine size={18} />
                  </button>

                  <button
                    onClick={() => deletePlatform(item?._id)}
                    className="p-1 text-white bg-red-500 hover:bg-red-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
