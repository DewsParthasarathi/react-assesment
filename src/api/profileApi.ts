import axiosClient from "./axiosClient";
import type {
  UserProfile,
  ProfileConnection,
  ProfileProject,
  ProfileTeam,
} from "./types";

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosClient.get<UserProfile>("/profile");
  return response.data;
};

export const toggleProfileConnection = async (
  connectionId: string,
): Promise<ProfileConnection> => {
  const response = await axiosClient.patch<ProfileConnection>(
    `/profile/connection/${connectionId}`,
  );
  return response.data;
};

export const fetchProfileProjects = async (): Promise<ProfileProject[]> => {
  const response = await axiosClient.get<ProfileProject[]>("/profile/projects");
  return response.data;
};

export const fetchProfileTeams = async (): Promise<ProfileTeam[]> => {
  const response = await axiosClient.get<ProfileTeam[]>("/profile/teams");
  return response.data;
};

export const fetchProfileConnections = async (): Promise<ProfileConnection[]> => {
  const response = await axiosClient.get<ProfileConnection[]>("/profile/connections");
  return response.data;
};
