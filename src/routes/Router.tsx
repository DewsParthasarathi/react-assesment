import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AnalyticsDashboard from "../pages/dashboard/analytics/AnalyticsDashboard";
import CRMDashboard from "../pages/dashboard/crm/CRMDashboard";
import EcommerceDashboard from "../pages/dashboard/ecommerce/EcommerceDashboard";
import EmailDashboard from "../pages/email/EmailDashboard";
import ChatPage from "../pages/chat/ChatPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import { InvoiceListPage } from "../pages/invoice/InvoiceListPage";
import { InvoicePreviewPage } from "../pages/invoice/InvoicePreviewPage";
import { InvoiceAddPage } from "../pages/invoice/InvoiceAddPage";
import { InvoiceEditPage } from "../pages/invoice/InvoiceEditPage";
import { UserPage } from "../pages/user/UserPage";
import { RolesPage } from "../pages/roles/RolesPage";
import { PermissionsPage } from "../pages/roles/PermissionsPage";
import { ProfilePage } from "../pages/pages/ProfilePage";
import Login from "../pages/login-pages/Login";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <AnalyticsDashboard />,
      },
      // 1. Dashboard Section (Nested)
      {
        path: "dashboard",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <AnalyticsDashboard />,
          },
          {
            path: "crm",
            element: <CRMDashboard />,
          },
          {
            path: "ecommerce",
            element: <EcommerceDashboard />,
          },
        ],
      },
      // 2. Apps Section (Nested)
      {
        path: "apps",
        element: <Outlet />,
        children: [
          {
            path: "email",
            element: <EmailDashboard />,
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "user",
            element: <UserPage />,
          },
          // 2.1 Invoice Routes (Nested)
          {
            path: "invoice",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <InvoiceListPage />,
              },
              {
                path: "list",
                element: <InvoiceListPage />,
              },
              {
                path: "preview",
                element: <InvoicePreviewPage />,
              },
              {
                path: "add",
                element: <InvoiceAddPage />,
              },
              {
                path: "edit",
                element: <InvoiceEditPage />,
              },
            ],
          },
          // 2.2 Roles & Permissions Routes (Nested)
          {
            path: "roles",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <RolesPage />,
              },
              {
                path: "list",
                element: <RolesPage />,
              },
              {
                path: "permissions",
                element: <PermissionsPage />,
              },
            ],
          },
          {
            path: "permissions",
            element: <PermissionsPage />,
          },
        ],
      },
      // 3. Pages Section (Nested)
      {
        path: "pages",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "teams",
            element: <ProfilePage />,
          },
          {
            path: "projects",
            element: <ProfilePage />,
          },
          {
            path: "connections",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
