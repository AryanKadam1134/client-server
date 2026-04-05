import React from "react";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-col w-full overflow-hidden">
        <Header />

        <div className="flex-1 p-8 h-full bg-gray-100 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
