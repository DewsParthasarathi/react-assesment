import React, { useEffect, useRef } from "react";
import type { ChatContact, ChatMessage } from "../../../api/types";
import { renderChatAvatar } from "../utils/chatAvatarHelper";

interface ChatMessageListProps {
  messages: ChatMessage[];
  contact: ChatContact;
  isAiTyping?: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  contact,
  isAiTyping = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevContactIdRef = useRef<string>(contact.id);
  const prevMessagesLengthRef = useRef<number>(messages.length);

  // Controlled intelligent auto-scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isContactChanged = prevContactIdRef.current !== contact.id;
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const lastMsg = messages[messages.length - 1];
    const isUserSentLast = lastMsg?.senderId === "user";

    // Detect if user is already near the bottom (within 150px)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    // Scroll to bottom when:
    // 1. Switching to another contact's conversation
    // 2. The user just sent a message
    // 3. New message arrives or AI is typing AND user is already viewing the bottom
    if (
      isContactChanged ||
      isUserSentLast ||
      (isNearBottom && (isNewMessage || isAiTyping))
    ) {
      bottomRef.current?.scrollIntoView({
        behavior: isContactChanged ? "auto" : "smooth",
      });
    }

    prevContactIdRef.current = contact.id;
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isAiTyping, contact.id]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto p-6 bg-[#f8f7fa] space-y-4 chat-email-scrollbar"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-20 text-[#a5a3ae]">
          <div className="w-14 h-14 rounded-full bg-[#f1f0f2] flex items-center justify-center text-[#a5a3ae] mb-3">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-fs15 font-semibold text-[#6f6b7d]">
            No messages yet
          </p>
          <p className="text-fs13 text-[#a5a3ae] mt-1">
            Say hello to start the conversation!
          </p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOutgoing = msg.senderId === "user";
          const nextMsg = messages[index + 1];
          const isLastInCluster = !nextMsg || nextMsg.senderId !== msg.senderId;

          if (isOutgoing) {
            // Outgoing Message (Right-aligned, Purple Bubble)
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="flex items-end gap-2.5 max-w-[80%] md:max-w-[70%]">
                  <div className="flex flex-col items-end">
                    <div className="bg-[#696cff] text-white rounded-lg shadow-[0_2px_4px_rgba(105,108,255,0.4)] px-4 py-2.5 text-fs14 leading-relaxed whitespace-pre-wrap select-text">
                      {msg.text}
                    </div>
                    {isLastInCluster && (
                      <span className="text-fs11 text-[#a5a3ae] mt-1 mr-1">
                        {msg.timestamp}
                      </span>
                    )}
                  </div>

                  {/* Outgoing User Avatar (member1) on last message of cluster */}
                  <div className="w-8 h-8 shrink-0">
                    {isLastInCluster ? (
                      renderChatAvatar("member1", "John Doe", "w-8 h-8", false)
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Incoming Message - Always uses the selected employee's profile avatar
          return (
            <div key={msg.id} className="flex flex-col items-start">
              <div className="flex items-end gap-2.5 max-w-[80%] md:max-w-[70%]">
                {/* Contact Avatar on last message of cluster */}
                <div className="w-8 h-8 shrink-0">
                  {isLastInCluster ? (
                    renderChatAvatar(
                      contact.avatar,
                      contact.name,
                      "w-8 h-8",
                      false,
                    )
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <div className="bg-white rounded-lg shadow-xs border border-[#dbdade]/50 px-4 py-2.5 text-fs14 text-[#32475c] leading-relaxed whitespace-pre-wrap select-text">
                    {msg.text}
                  </div>
                  {isLastInCluster && (
                    <span className="text-fs11 text-[#a5a3ae] mt-1 ml-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Typing Indicator */}
      {isAiTyping && (
        <div className="flex items-end gap-2.5 max-w-[70%] animate-in fade-in">
          <div className="w-8 h-8 shrink-0">
            {renderChatAvatar(contact.avatar, contact.name, "w-8 h-8", false)}
          </div>
          <div className="bg-white rounded-lg shadow-xs border border-[#dbdade]/50 px-4 py-2.5 flex items-center gap-2">
            <span className="text-fs12 text-[#6f6b7d] font-medium">
              {contact.name} is typing...
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#696cff] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#696cff] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#696cff] animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageList;
