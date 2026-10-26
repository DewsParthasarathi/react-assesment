import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CustomButton } from "../components/ui/CustomButton";

interface SubmenuItem {
  id: string;
  title: string;
  path: string;
}

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  hasSubmenu?: boolean;
  subItems?: SubmenuItem[];
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navItems: NavItem[] = [
    {
      id: "email",
      title: "Email",
      path: "/apps/email",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "chat",
      title: "Chat",
      path: "/apps/chat",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "calendar",
      title: "Calendar",
      path: "/apps/calendar",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "invoice",
      title: "Invoice",
      hasSubmenu: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      subItems: [
        { id: "invoice-list", title: "List", path: "/apps/invoice/list" },
        {
          id: "invoice-preview",
          title: "Preview",
          path: "/apps/invoice/preview",
        },
      ],
    },
    {
      id: "user",
      title: "User",
      hasSubmenu: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      subItems: [
        { id: "user-list", title: "List", path: "/apps/user/list" },
        { id: "user-view", title: "View", path: "/apps/user/view" },
      ],
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      hasSubmenu: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      subItems: [
        { id: "roles-list", title: "Roles", path: "/apps/roles/list" },
        { id: "permissions", title: "Permissions", path: "/apps/permissions" },
      ],
    },
    {
      id: "pages",
      title: "Pages",
      hasSubmenu: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      subItems: [
        { id: "profile", title: "User Profile", path: "/pages/profile" },
        { id: "faq", title: "FAQ", path: "/pages/faq" },
      ],
    },
    {
      id: "auth-pages",
      title: "Auth Pages",
      hasSubmenu: true,
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      subItems: [
        { id: "auth-login", title: "Login", path: "/login" },
        { id: "auth-register", title: "Register", path: "/register" },
      ],
    },
  ];

  const dashboardItems = [
    { id: "analytics", title: "Analytics", path: "/dashboard" },
    { id: "crm", title: "CRM", path: "/dashboard/crm" },
    { id: "ecommerce", title: "eCommerce", path: "/dashboard/ecommerce" },
  ];

  const isAnalyticsActive =
    location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <aside className="sticky top-0 h-screen w-[260px] max-[1440px]:w-[240px] max-[1280px]:w-[220px] max-[1024px]:w-[200px] shrink-0 bg-white border-r border-[#dbdade]/50 flex flex-col pt-6 pb-3 select-none z-20">
      {/* Top Dashboards Navigation Group using CustomButton */}
      <div className="px-3 mb-1">
        <CustomButton
          variant="ghost"
          onClick={() => setDashboardOpen((prev) => !prev)}
          className={`w-full !justify-between px-3 !py-2.5 !h-auto rounded-lg text-fs14 font-medium transition cursor-pointer ${
            isAnalyticsActive
              ? "!bg-[#e7e7ff] !text-[#696cff]"
              : "!text-[#6f6b7d] hover:!bg-[#f5f5f9] hover:!text-[#5d596c]"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Dashboards</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${dashboardOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </CustomButton>

        {/* Dashboard Submenu */}
        {dashboardOpen && (
          <div className="mt-1 pl-4 space-y-0.5">
            {dashboardItems.map((item) => {
              const active =
                item.id === "analytics"
                  ? isAnalyticsActive
                  : location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-fs14 transition ${
                    active
                      ? "text-[#696cff] font-medium"
                      : "text-[#6f6b7d] hover:text-[#5d596c] hover:bg-[#f5f5f9]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      active
                        ? "bg-[#696cff] ring-2 ring-[#696cff]/20"
                        : "bg-[#a5a3ae]"
                    }`}
                  />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* APPS & PAGES Section Heading */}
      <div className="px-5 pt-4 pb-1">
        <span className="text-fs12 font-medium tracking-wider text-[#a5a3ae] uppercase">
          APPS & PAGES
        </span>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#dbdade]/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#a5a3ae]">
        {navItems.map((item) => {
          const isGroupExpanded = Boolean(expandedGroups[item.id]);

          if (item.hasSubmenu) {
            return (
              <div key={item.id} className="space-y-0.5">
                <CustomButton
                  variant="ghost"
                  onClick={() => toggleGroup(item.id)}
                  className="w-full !justify-between px-3 !py-2 !h-auto rounded-md text-fs14 !text-[#6f6b7d] hover:!bg-[#f5f5f9] hover:!text-[#5d596c] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#6f6b7d]">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-[#a5a3ae] transition-transform duration-200 ${
                      isGroupExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </CustomButton>

                {isGroupExpanded && item.subItems && (
                  <div className="pl-6 space-y-0.5">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.id}
                        to={sub.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1.5 rounded-md text-fs13 transition ${
                            isActive
                              ? "text-[#696cff] font-medium"
                              : "text-[#6f6b7d] hover:text-[#5d596c] hover:bg-[#f5f5f9]"
                          }`
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a5a3ae]" />
                        <span>{sub.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path || "#"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-fs14 transition ${
                  isActive
                    ? "bg-[#e7e7ff] text-[#696cff] font-medium"
                    : "text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c]"
                }`
              }
            >
              <span className="text-[#6f6b7d]">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
