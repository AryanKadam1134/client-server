import React from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 text-sm max-w-2xl">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Settings</h2>
        <div
          onClick={() => navigate("change_password")}
          className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md"
        >
          Change Password
        </div>
      </div>
    </div>
  );
}
