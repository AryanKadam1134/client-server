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
  "px-3 py-2.5 flex items-center gap-2.5 text-sm min-w-45 rounded-md transition-all duration-200";

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
            ? "bg-light-bg-hover dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium"
            : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover hover:text-light-text-primary dark:hover:text-dark-text-primary"
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
          bg-light-bg-primary dark:bg-dark-bg-primary
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col px-2.5
          border-r border-light-border-primary dark:border-dark-border-primary
        `}
      >
        {/* Header */}
        <div className="shrink-0 h-16 flex items-center border-b border-light-border-primary dark:border-dark-border-primary">
          <div className="flex items-center gap-2.5">
            <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-full"></div>
            <p className="text-nowrap text-md font-medium text-light-text-primary dark:text-dark-text-primary">
              Profilo
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
              text-red-600 hover:text-red-700 hover:bg-red-50
              dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 dark:hover:bg-opacity-30
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
