import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/authApi";
import type { User } from "../api/types";

export const USERS_QUERY_KEY = "users";

/**
 * Custom TanStack Query hook to fetch all available users.
 */
export const useUsersQuery = () => {
  return useQuery<User[], Error>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 10,
  });
};

export default useUsersQuery;
