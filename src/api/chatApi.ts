import axiosClient from "./axiosClient";
import type { ChatContact, ChatMessage } from "./types";

export interface ContactsResponse {
  contacts: ChatContact[];
}

export interface ConversationResponse {
  messages: ChatMessage[];
}

export const fetchContacts = async (): Promise<ChatContact[]> => {
  const response = await axiosClient.get<ContactsResponse>("/chat/contacts");
  return response.data.contacts;
};

export const fetchConversation = async (
  contactId: string,
): Promise<ChatMessage[]> => {
  const response = await axiosClient.get<ConversationResponse>(
    `/chat/conversations/${contactId}`,
  );
  return response.data.messages;
};

export const sendChatMessage = async (
  contactId: string,
  text: string,
  senderId?: string,
): Promise<ChatMessage> => {
  const response = await axiosClient.post<{ message: ChatMessage }>(
    "/chat/messages",
    { contactId, text, senderId },
  );
  return response.data.message;
};

export const sendGeminiChat = async (
  contactId: string,
  messages: Array<{ senderId: string; text: string }>,
  text?: string,
  contactName?: string,
  contactRole?: string,
): Promise<{ response: string; message: ChatMessage }> => {
  const response = await axiosClient.post<{
    response: string;
    message: ChatMessage;
  }>("/chat/gemini", {
    contactId,
    messages,
    text,
    contactName,
    contactRole,
  });
  return response.data;
};
