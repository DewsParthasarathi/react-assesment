import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./layout-components/Sidebar";
import { Navbar } from "./layout-components/Navbar";

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAppPage =
    location.pathname.startsWith("/apps/chat") ||
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/apps/email") ||
    location.pathname.startsWith("/email");

  return (
    <div className="h-screen bg-[#f8f7fa] flex text-[#32475c] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />

        <main
          className={`flex-1 min-h-0 p-4 max-[1440px]:p-3 max-[1024px]:p-4 ml-[1.5%] ${
            isAppPage
              ? "overflow-hidden flex flex-col"
              : "overflow-x-hidden overflow-y-auto"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
