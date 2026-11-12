import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  toggleProfileConnection,
  fetchProfileProjects,
  fetchProfileTeams,
  fetchProfileConnections,
} from "../api/profileApi";
import type {
  UserProfile,
  ProfileConnection,
  ProfileProject,
  ProfileTeam,
} from "../api/types";

export const PROFILE_QUERY_KEY = "userProfile";
export const PROFILE_PROJECTS_QUERY_KEY = "profileProjects";
export const PROFILE_TEAMS_QUERY_KEY = "profileTeams";
export const PROFILE_CONNECTIONS_QUERY_KEY = "profileConnections";


export const useProfileQuery = () => {
  return useQuery<UserProfile, Error>({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};


export const useToggleConnectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ProfileConnection, Error, string>({
    mutationFn: (connectionId) => toggleProfileConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_CONNECTIONS_QUERY_KEY] });
    },
  });
};


export const useProfileProjectsQuery = () => {
  return useQuery<ProfileProject[], Error>({
    queryKey: [PROFILE_PROJECTS_QUERY_KEY],
    queryFn: fetchProfileProjects,
    staleTime: 1000 * 60 * 5,
  });
};


export const useProfileTeamsQuery = () => {
  return useQuery<ProfileTeam[], Error>({
    queryKey: [PROFILE_TEAMS_QUERY_KEY],
    queryFn: fetchProfileTeams,
    staleTime: 1000 * 60 * 5,
  });
};


export const useProfileConnectionsQuery = () => {
  return useQuery<ProfileConnection[], Error>({
    queryKey: [PROFILE_CONNECTIONS_QUERY_KEY],
    queryFn: fetchProfileConnections,
    staleTime: 1000 * 60 * 5,
  });
};

