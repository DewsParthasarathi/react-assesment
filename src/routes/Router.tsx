import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AnalyticsDashboard from "../pages/dashboard/analytics/AnalyticsDashboard";
import CRMDashboard from "../pages/dashboard/crm/CRMDashboard";
import EcommerceDashboard from "../pages/dashboard/ecommerce/EcommerceDashboard";
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
