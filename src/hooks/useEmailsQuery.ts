import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  batchDeleteEmails,
  batchUpdateEmails,
  createEmail,
  deleteEmail,
  emptyTrash,
  fetchEmails,
  updateEmail,
  type EmailListResponse,
  type FetchEmailsParams,
} from "../api/emailApi";
import type { EmailComposePayload, EmailItem } from "../api/types";

export const EMAILS_QUERY_KEY = "emails";

/**
 * Hook to retrieve email list and folder counts with folder/search/label filters.
 */
export const useEmailsQuery = (params?: FetchEmailsParams) => {
  return useQuery<EmailListResponse, Error>({
    queryKey: [
      EMAILS_QUERY_KEY,
      params?.folder || "inbox",
      params?.search || "",
      params?.label || "",
    ],
    queryFn: () => fetchEmails(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Hook to update an email (toggle starred, read/unread, move folder, labels).
 */
export const useUpdateEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<EmailItem>;
    }) => updateEmail(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to batch update multiple emails.
 */
export const useBatchUpdateEmailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      updates,
    }: {
      ids: string[];
      updates: Partial<EmailItem>;
    }) => batchUpdateEmails(ids, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to compose and send or draft an email.
 */
export const useCreateEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmailComposePayload) => createEmail(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to delete an email permanently.
 */
export const useDeleteEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to batch delete emails permanently.
 */
export const useBatchDeleteEmailsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => batchDeleteEmails(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to empty all emails in the trash folder.
 */
export const useEmptyTrashMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => emptyTrash(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMAILS_QUERY_KEY] });
    },
  });
};

