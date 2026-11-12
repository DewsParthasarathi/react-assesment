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
    <div className="h-screen bg-[#f8f7fa] flex text-[#32475c] overflow-hidden print:h-auto print:bg-white print:overflow-visible print:block">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 h-screen ${
          isAppPage
            ? "overflow-hidden"
            : "overflow-x-hidden overflow-y-auto"
        } print:h-auto print:overflow-visible print:block`}
      >
        <div className="sticky top-0 shrink-0 px-6 pt-6 bg-[#f8f7fa] z-30 print:hidden">
          <Navbar />
        </div>

        <main
          className={`flex-1 min-w-0 px-6 pt-6 ${
            isAppPage ? "min-h-0 pb-6 overflow-hidden flex flex-col" : "pb-16"
          } print:p-0 print:m-0`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
