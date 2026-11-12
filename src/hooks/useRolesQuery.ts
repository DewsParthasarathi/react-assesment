import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../api/rolesApi";
import type { Role } from "../api/types";

export const ROLES_QUERY_KEY = "roles";


export const useRolesQuery = () => {
  return useQuery<Role[], Error>({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 5,
  });
};


export const useRoleQuery = (id: string | null) => {
  return useQuery<Role, Error>({
    queryKey: [ROLES_QUERY_KEY, id],
    queryFn: () => (id ? fetchRoleById(id) : Promise.reject(new Error("No role ID"))),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};


export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, Partial<Role>>({
    mutationFn: (newRole) => createRole(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
  });
};


export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: string; updates: Partial<Role> }>({
    mutationFn: ({ id, updates }) => updateRole(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY, variables.id] });
    },
  });
};


export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
    },
  });
};

