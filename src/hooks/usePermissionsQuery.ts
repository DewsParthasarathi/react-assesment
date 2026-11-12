import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPermissions,
  fetchPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../api/permissionsApi";
import type { Permission } from "../api/types";

export const PERMISSIONS_QUERY_KEY = "permissions";


export const usePermissionsQuery = () => {
  return useQuery<Permission[], Error>({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 5,
  });
};


export const usePermissionQuery = (id: string | null) => {
  return useQuery<Permission, Error>({
    queryKey: [PERMISSIONS_QUERY_KEY, id],
    queryFn: () => (id ? fetchPermissionById(id) : Promise.reject(new Error("No permission ID"))),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};


export const useCreatePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, Partial<Permission>>({
    mutationFn: (newPermission) => createPermission(newPermission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PERMISSIONS_QUERY_KEY] });
    },
  });
};


export const useUpdatePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, { id: string; updates: Partial<Permission> }>({
    mutationFn: ({ id, updates }) => updatePermission(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PERMISSIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PERMISSIONS_QUERY_KEY, variables.id] });
    },
  });
};


export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PERMISSIONS_QUERY_KEY] });
    },
  });
};

