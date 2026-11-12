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
  const [isAiTyping, setIsAiTyping] = useState(false);
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
    if (!text.trim() || isAiTyping) return;

    sendMessageMutation.mutate({
      contactId: activeContact.id,
      senderId: "user",
      text,
    });

    setIsAiTyping(true);
    const conversationHistory = [
      ...messages.map((m) => ({ senderId: m.senderId, text: m.text })),
      { senderId: "user", text },
    ];

    sendGeminiMutation.mutate(
      {
        contactId: activeContact.id,
        contactName: activeContact.name,
        contactRole: activeContact.role,
        messages: conversationHistory,
        text,
      },
      {
        onSettled: () => {
          setIsAiTyping(false);
        },
      },
    );
  };

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
          <ChatMessageList
            messages={messages}
            contact={activeContact}
            isAiTyping={isAiTyping}
          />

          <ChatMessageInput
            onSendMessage={handleSendMessage}
            disabled={isAiTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
