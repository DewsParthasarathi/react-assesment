import axiosClient from "./axiosClient";
import type { CrmDashboardData, DashboardOverview, EcommerceDashboardData, UserProfile } from "./types";

export const fetchDashboardProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axiosClient.get<UserProfile>(`/dashboard/${userId}`);
  return response.data;
};

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await axiosClient.get<DashboardOverview>("/dashboard");
  return response.data;
};

export const fetchCrmDashboard = async (year?: string): Promise<CrmDashboardData> => {
  const url = year ? `/dashboard/crm?year=${encodeURIComponent(year)}` : "/dashboard/crm";
  const response = await axiosClient.get<CrmDashboardData>(url);
  return response.data;
};

export const fetchEcommerceDashboard = async (year?: string): Promise<EcommerceDashboardData> => {
  const url = year ? `/dashboard/ecommerce?year=${encodeURIComponent(year)}` : "/dashboard/ecommerce";
  const response = await axiosClient.get<EcommerceDashboardData>(url);
  return response.data;
};
