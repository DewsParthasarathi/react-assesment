import axiosClient from "./axiosClient";
import type { CalendarEvent } from "./types";

/**
 * Retrieves all calendar events.
 */
export const fetchCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const response = await axiosClient.get<CalendarEvent[]>("/calendar/events");
  return response.data;
};

/**
 * Creates a new calendar event.
 */
export const createCalendarEvent = async (
  event: Omit<CalendarEvent, "id"> & { id?: string },
): Promise<CalendarEvent> => {
  const response = await axiosClient.post<CalendarEvent>("/calendar/events", event);
  return response.data;
};

/**
 * Updates an existing calendar event by ID.
 */
export const updateCalendarEvent = async (
  id: string,
  updates: Partial<CalendarEvent>,
): Promise<CalendarEvent> => {
  const response = await axiosClient.put<CalendarEvent>(
    `/calendar/events/${id}`,
    updates,
  );
  return response.data;
};

/**
 * Deletes a calendar event by ID.
 */
export const deleteCalendarEvent = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/calendar/events/${id}`,
  );
  return response.data;
};

