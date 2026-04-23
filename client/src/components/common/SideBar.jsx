import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Share2,
  Zap,
  Layers,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  LogOut,
  Settings,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const menus = [
  { name: "User Details", path: "/details", icon: User },
  { name: "Social Platforms", path: "/social", icon: Share2 },
  { name: "Skills", path: "/skills", icon: Zap },
  { name: "Skill Categories", path: "/skill-categories", icon: Layers },
  { name: "Projects", path: "/projects", icon: FolderOpen },
  { name: "Experience", path: "/experiences", icon: Briefcase },
  { name: "Education", path: "/educations", icon: GraduationCap },
  { name: "Certificates", path: "/certificates", icon: Award },
  { name: "Achievements", path: "/achievements", icon: Trophy },
];

const menuStyle =
  "px-3 py-2 flex items-center gap-2.5 text-[13.5px] min-w-45 rounded-md transition-all duration-200";

function NavItem({ menu, onClick }) {
  const Icon = menu.icon;

  return (
    <NavLink
      to={menu.path}
      onClick={onClick}
      className={({ isActive }) =>
        `${menuStyle}
        ${
          isActive
            ? "bg-gray-200 text-black dark:bg-[#272727] dark:text-white"
            : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-[#1f1f1f] dark:hover:text-white"
        }
        `
      }
    >
      <Icon size={17} />
      <p className="text-nowrap">{menu.name}</p>
    </NavLink>
  );
}

export default function SideBar({ isOpen, onClose }) {
  const { logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-64
          bg-white dark:bg-[#0f0f0f]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col px-2.5
          border-r border-gray-200 dark:border-[#272727]
        `}
      >
        {/* Header */}
        <div className="shrink-0 h-15 flex items-center border-b border-gray-200 dark:border-[#272727]">
          <div className="flex items-center gap-2.5">
            <div className="p-4 bg-gray-300 dark:bg-[#272727] rounded-full"></div>
            <p className="text-nowrap text-md font-medium text-gray-800 dark:text-white">
              Portfolio SAAS
            </p>
          </div>
        </div>

        {/* Menus */}
        <div className="py-3 flex flex-col gap-2 justify-between h-full">
          <div className="flex-1 flex flex-col gap-1.5">
            {menus.map((menu) => (
              <NavItem key={menu.name} menu={menu} onClick={onClose} />
            ))}
          </div>

          <NavItem
            menu={{ name: "Settings", path: "/settings", icon: Settings }}
            onClick={onClose}
          />

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className={`
              ${menuStyle}
              text-gray-700 hover:text-red-600 hover:bg-red-100
              dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-[#2a1515]
              cursor-pointer
            `}
          >
            <LogOut size={17} />
            <p className="text-nowrap">Logout</p>
          </button>
        </div>
      </div>
    </>
  );
}
