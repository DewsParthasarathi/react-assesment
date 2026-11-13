import { useQuery } from "@tanstack/react-query";
import { fetchDashboardProfile } from "../api/dashboardApi";
import type { UserProfile } from "../api/types";

export const DASHBOARD_QUERY_KEY = "dashboard";

export const useDashboardQuery = (userId?: string | null) => {
  return useQuery<UserProfile, Error>({
    queryKey: [DASHBOARD_QUERY_KEY, userId || "1"],
    queryFn: () => fetchDashboardProfile(userId || "1"),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};
