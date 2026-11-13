import { useQuery } from "@tanstack/react-query";
import { fetchCrmDashboard } from "../api/dashboardApi";
import type { CrmDashboardData } from "../api/types";

export const CRM_DASHBOARD_QUERY_KEY = "crmDashboard";

export const useCrmDashboardQuery = (year?: string) => {
  return useQuery<CrmDashboardData, Error>({
    queryKey: [CRM_DASHBOARD_QUERY_KEY, year ?? "default"],
    queryFn: () => fetchCrmDashboard(year),
    staleTime: 1000 * 60 * 5,
  });
};
