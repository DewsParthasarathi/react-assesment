import React, { useState } from "react";
import type { ChatContact } from "../../api/types";
import {
  useChatContactsQuery,
  useChatConversationQuery,
  useSendChatMessageMutation,
  useSendGeminiMutation,
} from "../../hooks/useChatQuery";
import ChatConversationHeader from "./components/ChatConversationHeader";
import ChatMessageInput from "./components/ChatMessageInput";
import ChatMessageList from "./components/ChatMessageList";
import ChatSidebar from "./components/ChatSidebar";

export const ChatPage: React.FC = () => {
  const [activeContactId, setActiveContactId] = useState<string>("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingContacts, setLoadingContacts] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const { data: contacts = [] } = useChatContactsQuery();
  const activeContact = contacts.find((c) => c.id === activeContactId) ||
    contacts[0] || {
      id: "2",
      name: "Jane Smith",
      role: "Financial Analyst",
      email: "user2@example.com",
      avatar: "member2",
      isOnline: true,
      isAi: false,
    };

  const { data: messages = [] } = useChatConversationQuery(activeContact.id);

  const sendMessageMutation = useSendChatMessageMutation();
  const sendGeminiMutation = useSendGeminiMutation();

  const handleSelectContact = (contact: ChatContact) => {
    setActiveContactId(contact.id);
    setShowMobileChat(true);
  };

  const handleSendMessage = (text: string) => {
    const targetContactId = activeContact.id;
    if (!text.trim() || loadingContacts[targetContactId]) return;

    setErrorMessage(null);

    sendMessageMutation.mutate({
      contactId: targetContactId,
      senderId: "user",
      text,
    });

    setLoadingContacts((prev) => ({ ...prev, [targetContactId]: true }));
    const conversationHistory = [
      ...messages.map((m) => ({ senderId: m.senderId, text: m.text })),
      { senderId: "user", text },
    ];

    sendGeminiMutation.mutate(
      {
        contactId: targetContactId,
        contactName: activeContact.name,
        contactRole: activeContact.role,
        messages: conversationHistory,
        text,
      },
      {
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to receive response.";
          setErrorMessage(message);
        },
        onSettled: () => {
          setLoadingContacts((prev) => ({ ...prev, [targetContactId]: false }));
        },
      },
    );
  };

  const isCurrentContactLoading = Boolean(loadingContacts[activeContact.id]);

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col">
      <div className="w-full h-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 overflow-hidden flex flex-row min-h-0">
        <div
          className={`${
            showMobileChat ? "hidden md:flex" : "flex"
          } w-full md:w-auto h-full overflow-hidden`}
        >
          <ChatSidebar
            contacts={contacts}
            activeContactId={activeContact.id}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loadingContacts={loadingContacts}
          />
        </div>

        <div
          className={`${
            !showMobileChat ? "hidden md:flex" : "flex"
          } flex-1 flex flex-col min-w-0 bg-[#f8f7fa] h-full overflow-hidden`}
        >
          <ChatConversationHeader
            contact={activeContact}
            onBackToContacts={() => setShowMobileChat(false)}
          />
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-fs14 rounded-[6px] flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-3 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}
          <ChatMessageList
            messages={messages}
            contact={activeContact}
            isAiTyping={isCurrentContactLoading}
          />

          <ChatMessageInput
            onSendMessage={handleSendMessage}
            disabled={isCurrentContactLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
