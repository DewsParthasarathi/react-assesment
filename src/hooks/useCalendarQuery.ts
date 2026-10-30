import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvents,
  updateCalendarEvent,
} from "../api/calendarApi";
import type { CalendarEvent } from "../api/types";

export const CALENDAR_EVENTS_QUERY_KEY = "calendarEvents";

export const useCalendarEventsQuery = () => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: [CALENDAR_EVENTS_QUERY_KEY],
    queryFn: () => fetchCalendarEvents(),
    staleTime: 1000 * 30,
  });
};

export const useCreateCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Omit<CalendarEvent, "id"> & { id?: string }) =>
      createCalendarEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CalendarEvent>;
    }) => updateCalendarEvent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY_KEY] });
    },
  });
};

export const useDeleteCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY_KEY] });
    },
  });
};

