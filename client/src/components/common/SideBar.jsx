import React from "react";

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
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function NavItem({ menu }) {
  const Icon = menu.icon;

  return (
    <NavLink
      to={menu.path}
      className={({ isActive }) =>
        `px-3 py-2 flex items-center justify-start gap-2.5 ${isActive ? `border-l bg-gray-200` : ``} text-gray-800 hover:text-black hover:bg-gray-200 rounded-sm transition-colors`
      }
    >
      <Icon size={17} />

      <p className="text-nowrap">{menu.name}</p>
    </NavLink>
  );
}

export default function SideBar() {
  const { logout } = useAuth();

  const menus = [
    { name: "Basic Details", path: "/details", icon: User },
    { name: "Social Platforms", path: "/social", icon: Share2 },
    { name: "Skills", path: "/skills", icon: Zap },
    { name: "Skill Categories", path: "/skill-categories", icon: Layers },
    { name: "Projects", path: "/projects", icon: FolderOpen },
    { name: "Experience", path: "/experiences", icon: Briefcase },
    { name: "Education", path: "/education", icon: GraduationCap },
    { name: "Certificates", path: "/certificates", icon: Award },
    { name: "Achievements", path: "/achievements", icon: Trophy },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 h-15 px-2.5 flex items-center border-b border-gray-600">
        <div className="flex items-center justify-start gap-2.5">
          <div className="p-5 bg-gray-500 rounded-full"></div>
          <p className="text-nowrap text-md font-medium">Portfolio SAAS</p>
        </div>
      </div>

      {/* Menus List */}
      <div className="pl-2.5 pr-4 py-3 flex flex-col justify-between text-sm h-full">
        <div className="flex-1 flex flex-col gap-2">
          {menus.map((menu) => (
            <NavItem menu={menu} />
          ))}
        </div>

        <button
          onClick={logout}
          className="px-3 py-2 flex items-center justify-start gap-2.5 text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 rounded-sm transition-colors cursor-pointer"
        >
          <LogOut size={17} />

          <p className="text-nowrap">Logout</p>
        </button>
      </div>
    </div>
  );
}
