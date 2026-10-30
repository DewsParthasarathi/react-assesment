import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchContacts,
  fetchConversation,
  sendChatMessage,
  sendGeminiChat,
} from "../api/chatApi";
import type { ChatContact, ChatMessage } from "../api/types";

export const CHAT_CONTACTS_QUERY_KEY = "chatContacts";
export const CHAT_CONVERSATION_QUERY_KEY = "chatConversation";

export const useChatContactsQuery = () => {
  return useQuery<ChatContact[], Error>({
    queryKey: [CHAT_CONTACTS_QUERY_KEY],
    queryFn: () => fetchContacts(),
    staleTime: 1000 * 15,
  });
};

export const useChatConversationQuery = (contactId?: string) => {
  return useQuery<ChatMessage[], Error>({
    queryKey: [CHAT_CONVERSATION_QUERY_KEY, contactId || ""],
    queryFn: () => (contactId ? fetchConversation(contactId) : Promise.resolve([])),
    enabled: Boolean(contactId),
    staleTime: 1000 * 5,
  });
};

export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contactId,
      text,
      senderId,
    }: {
      contactId: string;
      text: string;
      senderId?: string;
    }) => sendChatMessage(contactId, text, senderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CHAT_CONVERSATION_QUERY_KEY, variables.contactId],
      });
      queryClient.invalidateQueries({ queryKey: [CHAT_CONTACTS_QUERY_KEY] });
    },
  });
};

export const useSendGeminiMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contactId,
      messages,
      text,
      contactName,
      contactRole,
    }: {
      contactId: string;
      messages: Array<{ senderId: string; text: string }>;
      text?: string;
      contactName?: string;
      contactRole?: string;
    }) => sendGeminiChat(contactId, messages, text, contactName, contactRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CHAT_CONVERSATION_QUERY_KEY, variables.contactId],
      });
      queryClient.invalidateQueries({ queryKey: [CHAT_CONTACTS_QUERY_KEY] });
    },
  });
};
