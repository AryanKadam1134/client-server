import React from "react";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex flex-col w-full">
        <Header />

        {children}
      </div>
    </div>
  );
}
