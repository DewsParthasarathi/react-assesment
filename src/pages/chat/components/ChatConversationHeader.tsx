import React from "react";
import type { ChatContact } from "../../../api/types";
import { renderChatAvatar } from "../utils/chatAvatarHelper";

interface ChatConversationHeaderProps {
  contact: ChatContact;
  onBackToContacts?: () => void;
}

export const ChatConversationHeader: React.FC<ChatConversationHeaderProps> = ({
  contact,
  onBackToContacts,
}) => {
  return (
    <div className="shrink-0 sticky top-0 z-10 px-6 py-3.5 border-b border-[#dbdade]/50 flex items-center justify-between bg-white select-none">
      <div className="flex items-center gap-3.5">
        {/* Back button for mobile responsiveness */}
        {onBackToContacts && (
          <button
            type="button"
            onClick={onBackToContacts}
            className="md:hidden p-1 rounded hover:bg-[#f8f7fa] text-[#6f6b7d] cursor-pointer"
            aria-label="Back to contacts"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Contact Avatar */}
        {renderChatAvatar(
          contact.avatar,
          contact.name,
          "w-10 h-10",
          true,
          contact.isOnline,
        )}

        {/* Name and Designation */}
        <div>
          <h3 className="text-fs15 font-bold text-[#32475c] leading-tight">
            {contact.name}
          </h3>
          <span className="text-fs12 text-[#a5a3ae] block leading-tight mt-0.5">
            {contact.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationHeader;

