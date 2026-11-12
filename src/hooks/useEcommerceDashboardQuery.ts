import { useQuery } from "@tanstack/react-query";
import { fetchEcommerceDashboard } from "../api/dashboardApi";
import type { EcommerceDashboardData } from "../api/types";

export const ECOMMERCE_DASHBOARD_QUERY_KEY = "ecommerceDashboard";


export const useEcommerceDashboardQuery = (year?: string) => {
  return useQuery<EcommerceDashboardData, Error>({
    queryKey: [ECOMMERCE_DASHBOARD_QUERY_KEY, year ?? "default"],
    queryFn: () => fetchEcommerceDashboard(year),
    staleTime: 1000 * 60 * 5,
  });
};

export default useEcommerceDashboardQuery;

