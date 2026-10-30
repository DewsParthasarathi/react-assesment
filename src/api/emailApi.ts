import axiosClient from "./axiosClient";
import type {
  EmailComposePayload,
  EmailFolderCounts,
  EmailItem,
} from "./types";

export interface EmailListResponse {
  emails: EmailItem[];
  counts: EmailFolderCounts;
}

export interface FetchEmailsParams {
  folder?: string;
  search?: string;
  label?: string;
}

/**
 * Retrieves the email list and dynamic folder counts.
 */
export const fetchEmails = async (
  params?: FetchEmailsParams,
): Promise<EmailListResponse> => {
  const response = await axiosClient.get<EmailListResponse>("/emails", {
    params,
  });
  return response.data;
};

/**
 * Retrieves a single email by its unique ID.
 */
export const fetchEmailById = async (id: string): Promise<EmailItem> => {
  const response = await axiosClient.get<EmailItem>(`/emails/${id}`);
  return response.data;
};

/**
 * Sends a new email or saves it as a draft.
 */
export const createEmail = async (
  payload: EmailComposePayload,
): Promise<EmailItem> => {
  const response = await axiosClient.post<EmailItem>("/emails", payload);
  return response.data;
};

/**
 * Updates properties of an existing email (e.g. read status, starred, folder, labels).
 */
export const updateEmail = async (
  id: string,
  updates: Partial<EmailItem>,
): Promise<EmailItem> => {
  const response = await axiosClient.patch<EmailItem>(`/emails/${id}`, updates);
  return response.data;
};

/**
 * Permanently deletes an email by ID.
 */
export const deleteEmail = async (id: string): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/emails/${id}`,
  );
  return response.data;
};

/**
 * Batch updates multiple emails at once (e.g. mark read/unread, move to trash, restore).
 */
export const batchUpdateEmails = async (
  ids: string[],
  updates: Partial<EmailItem>,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.post<{ success: boolean }>(
    "/emails/batch-update",
    { ids, updates },
  );
  return response.data;
};

/**
 * Batch deletes multiple emails permanently.
 */
export const batchDeleteEmails = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  const response = await axiosClient.post<{ success: boolean }>(
    "/emails/batch-delete",
    { ids },
  );
  return response.data;
};

/**
 * Empties all emails currently residing in the Trash folder.
 */
export const emptyTrash = async (): Promise<{ success: boolean }> => {
  const response = await axiosClient.post<{ success: boolean }>(
    "/emails/empty-trash",
  );
  return response.data;
};

