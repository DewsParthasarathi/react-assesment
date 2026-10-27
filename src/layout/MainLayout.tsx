import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout-components/Sidebar";
import { Navbar } from "./layout-components/Navbar";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f7fa] flex text-[#32475c]">
      {/* Sidebar on the Left */}
      <Sidebar />

      {/* Main Content Area to the Right of Sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Content Area below Navbar */}
        <main className="flex-1 p-6 max-[1440px]:p-5 max-[1024px]:p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
