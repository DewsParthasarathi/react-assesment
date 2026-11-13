import axiosClient from "./axiosClient";
import type { Role } from "./types";

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>("/roles");
  return response.data;
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  const response = await axiosClient.get<Role>(`/roles/${id}`);
  return response.data;
};

export const createRole = async (
  role: Partial<Role>,
): Promise<Role> => {
  const response = await axiosClient.post<Role>("/roles", role);
  return response.data;
};

export const updateRole = async (
  id: string,
  updates: Partial<Role>,
): Promise<Role> => {
  const response = await axiosClient.put<Role>(`/roles/${id}`, updates);
  return response.data;
};

export const deleteRole = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(`/roles/${id}`);
  return response.data;
};
