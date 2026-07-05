import React from "react";

import { Menu, Moon, SunDim } from "lucide-react";
import { Switch } from "antd";

import { useAuth } from "../../context/auth/useAuth";
import { useTheme } from "../../context/theme/useTheme";

import defaultProfileImage from "../../assets/profile.png";

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

  const isDark = theme === "dark";

  return (
    <div
      className="
        shrink-0 h-16 w-full px-5 sm:px-8 flex items-center justify-between
        bg-light-bg-primary dark:bg-dark-bg-primary
        border-b border-light-border-primary dark:border-dark-border-primary
        text-light-text-primary dark:text-dark-text-primary
        shadow-sm z-10
      "
    >
      {/* LEFT (Mobile Menu) */}
      <button
        onClick={onMenuClick}
        className="
            md:hidden p-2 rounded-md
            hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover
            transition
          "
      >
        <Menu size={22} />
      </button>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          aria-pressed={isDark}
          className={`relative w-[34px] h-[18px] rounded-full transition-all duration-300 cursor-pointer
          ${isDark ? "bg-zinc-800 border-zinc-600" : "bg-zinc-200 border-zinc-300"}`}
        >
          <span
            className={`absolute top-[1px] left-[1px] p-0.5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300
            ${isDark ? "translate-x-[16px] bg-zinc-900 text-violet-400" : "translate-x-0 bg-white text-amber-400"}`}
          >
            {isDark ? <Moon size={12} /> : <SunDim size={12} />}
          </span>
        </button>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Text */}
          <div className="hidden sm:flex flex-col items-end text-xs leading-tight">
            <p className="font-semibold">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {dayName}, {dateNum}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative rounded-full overflow-hidden border-2 border-light-border-primary dark:border-dark-border-primary">
            <img
              src={user?.image?.url || defaultProfileImage}
              alt="User"
              className="size-10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
