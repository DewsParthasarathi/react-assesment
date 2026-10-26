import axiosClient from "./axiosClient";
import type { LoginCredentials, LoginResponse, User } from "./types";

/**
 * Validates credentials via authentication endpoint.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

/**
 * Retrieves all registered users (for user selection / mock admin).
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>("/users");
  return response.data;
};
