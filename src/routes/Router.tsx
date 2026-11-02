import { createBrowserRouter } from "react-router-dom";
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
      {
        path: "dashboard",
        element: <AnalyticsDashboard />,
      },
      {
        path: "dashboard/crm",
        element: <CRMDashboard />,
      },
      {
        path: "crm",
        element: <CRMDashboard />,
      },
      {
        path: "dashboard/ecommerce",
        element: <EcommerceDashboard />,
      },
      {
        path: "ecommerce",
        element: <EcommerceDashboard />,
      },
      {
        path: "apps/email",
        element: <EmailDashboard />,
      },
      {
        path: "email",
        element: <EmailDashboard />,
      },
      {
        path: "apps/chat",
        element: <ChatPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "apps/calendar",
        element: <CalendarPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "apps/invoice/list",
        element: <InvoiceListPage />,
      },
      {
        path: "invoice/list",
        element: <InvoiceListPage />,
      },
      {
        path: "apps/invoice",
        element: <InvoiceListPage />,
      },
      {
        path: "invoice",
        element: <InvoiceListPage />,
      },
      {
        path: "apps/invoice/preview",
        element: <InvoicePreviewPage />,
      },
      {
        path: "invoice/preview",
        element: <InvoicePreviewPage />,
      },
      {
        path: "apps/invoice/add",
        element: <InvoiceAddPage />,
      },
      {
        path: "invoice/add",
        element: <InvoiceAddPage />,
      },
      {
        path: "apps/invoice/edit",
        element: <InvoiceEditPage />,
      },
      {
        path: "invoice/edit",
        element: <InvoiceEditPage />,
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
