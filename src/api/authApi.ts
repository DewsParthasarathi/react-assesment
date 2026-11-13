import axiosClient from "./axiosClient";
import type { LoginCredentials, LoginResponse, User } from "./types";

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>("/users");
  return response.data;
};
