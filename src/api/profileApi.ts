import axiosClient from "./axiosClient";
import type {
  UserProfile,
  ProfileConnection,
  ProfileProject,
  ProfileTeam,
} from "./types";

/**
 * Fetches the user profile data including about, contact, overview, timeline, connections, teams, and projects.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosClient.get<UserProfile>("/profile");
  return response.data;
};

/**
 * Toggles the connection status of a specific connection.
 */
export const toggleProfileConnection = async (
  connectionId: string,
): Promise<ProfileConnection> => {
  const response = await axiosClient.patch<ProfileConnection>(
    `/profile/connection/${connectionId}`,
  );
  return response.data;
};

/**
 * Fetches the list of profile projects.
 */
export const fetchProfileProjects = async (): Promise<ProfileProject[]> => {
  const response = await axiosClient.get<ProfileProject[]>("/profile/projects");
  return response.data;
};

/**
 * Fetches the list of profile teams.
 */
export const fetchProfileTeams = async (): Promise<ProfileTeam[]> => {
  const response = await axiosClient.get<ProfileTeam[]>("/profile/teams");
  return response.data;
};

/**
 * Fetches the list of profile connections.
 */
export const fetchProfileConnections = async (): Promise<ProfileConnection[]> => {
  const response = await axiosClient.get<ProfileConnection[]>("/profile/connections");
  return response.data;
};

