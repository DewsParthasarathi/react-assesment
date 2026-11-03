import axiosClient from "./axiosClient";
import type { Role } from "./types";

/**
 * Fetches all roles.
 */
export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>("/roles");
  return response.data;
};

/**
 * Fetches a single role by its ID.
 */
export const fetchRoleById = async (id: string): Promise<Role> => {
  const response = await axiosClient.get<Role>(`/roles/${id}`);
  return response.data;
};

/**
 * Creates a new role.
 */
export const createRole = async (
  role: Partial<Role>,
): Promise<Role> => {
  const response = await axiosClient.post<Role>("/roles", role);
  return response.data;
};

/**
 * Updates an existing role by ID.
 */
export const updateRole = async (
  id: string,
  updates: Partial<Role>,
): Promise<Role> => {
  const response = await axiosClient.put<Role>(`/roles/${id}`, updates);
  return response.data;
};

/**
 * Deletes a role by ID.
 */
export const deleteRole = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(`/roles/${id}`);
  return response.data;
};

