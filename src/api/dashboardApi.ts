import axiosClient from "./axiosClient";
import type { CrmDashboardData, DashboardOverview, EcommerceDashboardData, UserProfile } from "./types";

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

/**
 * Retrieves CRM dashboard dynamic dataset, optionally filtered by year.
 */
export const fetchCrmDashboard = async (year?: string): Promise<CrmDashboardData> => {
  const url = year ? `/dashboard/crm?year=${encodeURIComponent(year)}` : "/dashboard/crm";
  const response = await axiosClient.get<CrmDashboardData>(url);
  return response.data;
};

/**
 * Retrieves E-commerce dashboard dynamic dataset, optionally filtered by year.
 */
export const fetchEcommerceDashboard = async (year?: string): Promise<EcommerceDashboardData> => {
  const url = year ? `/dashboard/ecommerce?year=${encodeURIComponent(year)}` : "/dashboard/ecommerce";
  const response = await axiosClient.get<EcommerceDashboardData>(url);
  return response.data;
};


