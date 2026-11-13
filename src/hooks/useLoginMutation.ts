import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/authApi";
import type { LoginCredentials, LoginResponse } from "../api/types";
import { loginSuccess, loginFailure } from "../store/slices/authSlice";
import { DASHBOARD_QUERY_KEY } from "./useDashboardQuery";

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.removeItem("wasLoggedOut");

      queryClient.invalidateQueries({
        queryKey: [DASHBOARD_QUERY_KEY],
      });
    },
    onError: (error) => {
      dispatch(loginFailure(error.message));
    },
  });
};
