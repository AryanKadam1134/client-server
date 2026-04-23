import React from "react";

import { Menu } from "lucide-react";
import { Switch } from "antd";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const now = new Date();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[now.getDay()];
  const dateNum = now.getDate();

  return (
    <div
      className="
        shrink-0 h-16 w-full px-5 flex items-center justify-between
        bg-white dark:bg-[#0f0f0f]
        border-b border-gray-200 dark:border-[#272727]
        text-gray-800 dark:text-gray-100
        shadow-sm z-10
      "
    >
      {/* LEFT (Mobile Menu) */}
      <button
        onClick={onMenuClick}
        className="
            md:hidden p-2 rounded-full
            hover:bg-gray-100 dark:hover:bg-[#272727]
            transition
          "
      >
        <Menu size={22} />
      </button>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Theme Toggle */}
        <Switch
          checked={theme === "dark"}
          size="small"
          onChange={toggleTheme}
        />

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Text */}
          <div className="hidden sm:flex flex-col items-end text-xs leading-tight">
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-gray-500 dark:text-gray-400">
              {dayName}, {dateNum}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative rounded-full overflow-hidden">
            <img
              src={user?.image?.url}
              alt="User"
              className="size-9 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
