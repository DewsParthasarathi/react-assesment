import axiosClient from "./axiosClient";
import type { ChatContact, ChatMessage } from "./types";

export interface ContactsResponse {
  contacts: ChatContact[];
}

export interface ConversationResponse {
  messages: ChatMessage[];
}

/**
 * Fetches all available chat contacts and recent conversation previews.
 */
export const fetchContacts = async (): Promise<ChatContact[]> => {
  const response = await axiosClient.get<ContactsResponse>("/chat/contacts");
  return response.data.contacts;
};

/**
 * Fetches the message history for a specific contact or AI.
 */
export const fetchConversation = async (
  contactId: string,
): Promise<ChatMessage[]> => {
  const response = await axiosClient.get<ConversationResponse>(
    `/chat/conversations/${contactId}`,
  );
  return response.data.messages;
};

/**
 * Sends a chat message to a contact.
 */
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

/**
 * Sends chat history to the secure server-side Gemini AI proxy and receives generated AI response for the employee conversation.
 */
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
