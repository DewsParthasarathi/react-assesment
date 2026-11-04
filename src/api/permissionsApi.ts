import axiosClient from "./axiosClient";
import type { Permission } from "./types";

/**
 * Fetches all permissions.
 */
export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await axiosClient.get<Permission[]>("/permissions");
  return response.data;
};

/**
 * Fetches a single permission by ID.
 */
export const fetchPermissionById = async (id: string): Promise<Permission> => {
  const response = await axiosClient.get<Permission>(`/permissions/${id}`);
  return response.data;
};

/**
 * Creates a new permission.
 */
export const createPermission = async (
  permission: Partial<Permission>,
): Promise<Permission> => {
  const response = await axiosClient.post<Permission>("/permissions", permission);
  return response.data;
};

/**
 * Updates an existing permission by ID.
 */
export const updatePermission = async (
  id: string,
  updates: Partial<Permission>,
): Promise<Permission> => {
  const response = await axiosClient.put<Permission>(`/permissions/${id}`, updates);
  return response.data;
};

/**
 * Deletes a permission by ID.
 */
export const deletePermission = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(`/permissions/${id}`);
  return response.data;
};

