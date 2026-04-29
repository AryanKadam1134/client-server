import React from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../../api";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const deleteUser = async () => {
    setDeleting(true);
    try {
      await apiEndpoints.deleteUser();
      setUser(null);
    } catch (error) {
      console.error("Error deleting Account: ", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="space-y-4">
        <div
          onClick={() => navigate("change_password")}
          className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md"
        >
          Change Password
        </div>

        <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md">
          Change Email
        </div>

        <div
          onClick={deleteUser}
          className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </div>
      </div>
    </div>
  );
}
