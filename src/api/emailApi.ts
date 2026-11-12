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


export const fetchEmails = async (
  params?: FetchEmailsParams,
): Promise<EmailListResponse> => {
  const response = await axiosClient.get<EmailListResponse>("/emails", {
    params,
  });
  return response.data;
};


export const fetchEmailById = async (id: string): Promise<EmailItem> => {
  const response = await axiosClient.get<EmailItem>(`/emails/${id}`);
  return response.data;
};


export const createEmail = async (
  payload: EmailComposePayload,
): Promise<EmailItem> => {
  const response = await axiosClient.post<EmailItem>("/emails", payload);
  return response.data;
};


export const updateEmail = async (
  id: string,
  updates: Partial<EmailItem>,
): Promise<EmailItem> => {
  const response = await axiosClient.patch<EmailItem>(`/emails/${id}`, updates);
  return response.data;
};


export const deleteEmail = async (id: string): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/emails/${id}`,
  );
  return response.data;
};


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


export const batchDeleteEmails = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  const response = await axiosClient.post<{ success: boolean }>(
    "/emails/batch-delete",
    { ids },
  );
  return response.data;
};


export const emptyTrash = async (): Promise<{ success: boolean }> => {
  const response = await axiosClient.post<{ success: boolean }>(
    "/emails/empty-trash",
  );
  return response.data;
};

