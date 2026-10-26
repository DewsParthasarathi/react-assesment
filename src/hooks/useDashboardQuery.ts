import { useQuery } from "@tanstack/react-query";
import { fetchDashboardProfile, type UserProfile } from "../api";

export const DASHBOARD_QUERY_KEY = "dashboard";

/**
 * Custom TanStack Query hook to fetch user-specific dashboard profile and report data.
 */
export const useDashboardQuery = (userId?: string | null) => {
  return useQuery<UserProfile, Error>({
    queryKey: [DASHBOARD_QUERY_KEY, userId || "1"],
    queryFn: () => fetchDashboardProfile(userId || "1"),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

export default useDashboardQuery;
