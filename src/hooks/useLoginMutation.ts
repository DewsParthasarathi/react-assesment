import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";
import type { LoginCredentials, LoginResponse } from "../api/types";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess, loginFailure } from "../store/slices/authSlice";
import { DASHBOARD_QUERY_KEY } from "./useDashboardQuery";

/**
 * Custom TanStack Query mutation hook for user authentication.
 */
export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      // Synchronize with Redux auth slice and localStorage
      dispatch(loginSuccess(data.user));
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.removeItem("wasLoggedOut");

      // Invalidate existing dashboard queries so new user gets fresh data
      queryClient.invalidateQueries({
        queryKey: [DASHBOARD_QUERY_KEY],
      });
    },
    onError: (error) => {
      dispatch(loginFailure(error.message));
    },
  });
};

export default useLoginMutation;
