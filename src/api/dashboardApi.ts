import axiosClient from "./axiosClient";
import type { DashboardOverview, UserProfile } from "./types";

/**
 * Retrieves the dashboard profile and reports for a specific user ID.
 */
export const fetchDashboardProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axiosClient.get<UserProfile>(`/dashboard/${userId}`);
  return response.data;
};

/**
 * Retrieves general dashboard overview / navigation metadata.
 */
export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await axiosClient.get<DashboardOverview>("/dashboard");
  return response.data;
};
