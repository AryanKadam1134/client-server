import React from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div
        onClick={() => navigate("change_password")}
        className="p-3 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer transition-all"
      >
        Change Password
      </div>
    </div>
  );
}
