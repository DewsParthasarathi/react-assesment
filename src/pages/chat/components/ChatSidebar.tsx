import React from "react";
import type { ChatContact } from "../../../api/types";
import { renderChatAvatar } from "../utils/chatAvatarHelper";
import { CustomInput } from "../../../components/ui/CustomInput";
import { CustomButton } from "../../../components/ui/CustomButton";

interface ChatSidebarProps {
  contacts: ChatContact[];
  activeContactId: string;
  onSelectContact: (contact: ChatContact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  activeContactId,
  onSelectContact,
  searchQuery,
  onSearchChange,
}) => {
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const recentChats = filteredContacts.filter(
    (c) => c.id === "2" || c.id === "3" || c.id === activeContactId,
  );
  const otherContacts = filteredContacts.filter(
    (c) => !recentChats.some((r) => r.id === c.id),
  );

  return (
    <aside className="w-full md:w-[320px] lg:w-[340px] shrink-0 border-r border-[#dbdade]/50 flex flex-col bg-white select-none h-full overflow-hidden">
      <div className="shrink-0 sticky top-0 z-10 p-4 border-b border-[#dbdade]/50 flex items-center gap-3 bg-white">
        {renderChatAvatar("member1", "John Doe", "w-10 h-10", true, true)}

        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-[#a5a3ae] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <CustomInput
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for contact..."
            sizeVariant="sm"
            className="!pl-9 !pr-8 !py-1.5 !rounded-full border-[#dbdade]/70"
            containerClassName="w-full"
          />
          {searchQuery && (
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => onSearchChange("")}
              className="!p-0 !h-auto absolute right-2.5 top-1/2 -translate-y-1/2 text-fs15 text-[#a5a3ae] hover:text-[#5d596c] font-bold cursor-pointer"
            >
              &times;
            </CustomButton>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto py-2 chat-email-scrollbar">
        <div>
          <div className="px-5 pt-2 pb-1">
            <h4 className="text-fs17 font-bold text-[#696cff] tracking-tight">
              Chats
            </h4>
          </div>

          <div className="space-y-1 mt-1">
            {recentChats.map((contact) => {
              const isActive = contact.id === activeContactId;

              return (
                <div
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className={`flex items-center gap-3 px-3 py-2.5 mx-3 rounded-[6px] transition cursor-pointer ${
                    isActive
                      ? "bg-[#696cff] text-white shadow-[0_2px_6px_rgba(105,108,255,0.4)]"
                      : "hover:bg-[#f8f7fa] text-[#32475c]"
                  }`}
                >
                  {renderChatAvatar(
                    contact.avatar,
                    contact.name,
                    "w-10 h-10",
                    true,
                    contact.isOnline,
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-fs15 truncate ${
                          isActive
                            ? "font-semibold text-white"
                            : "font-semibold text-[#32475c]"
                        }`}
                      >
                        {contact.name}
                      </span>
                    </div>
                    <p
                      className={`text-fs13 truncate mt-0.5 ${
                        isActive ? "text-white/80" : "text-[#a5a3ae]"
                      }`}
                    >
                      {contact.lastMessage || contact.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {otherContacts.length > 0 && (
          <div className="mt-4">
            <div className="px-5 pt-2 pb-1">
              <h4 className="text-fs17 font-bold text-[#696cff] tracking-tight lowercase">
                contacts
              </h4>
            </div>

            <div className="space-y-1 mt-1">
              {otherContacts.map((contact) => {
                const isActive = contact.id === activeContactId;

                return (
                  <div
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className={`flex items-center gap-3 px-3 py-2.5 mx-3 rounded-[6px] transition cursor-pointer ${
                      isActive
                        ? "bg-[#696cff] text-white shadow-[0_2px_6px_rgba(105,108,255,0.4)]"
                        : "hover:bg-[#f8f7fa] text-[#32475c]"
                    }`}
                  >
                    {renderChatAvatar(
                      contact.avatar,
                      contact.name,
                      "w-10 h-10",
                      true,
                      contact.isOnline,
                    )}

                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-fs15 truncate block ${
                          isActive
                            ? "font-semibold text-white"
                            : "font-semibold text-[#32475c]"
                        }`}
                      >
                        {contact.name}
                      </span>
                      <p
                        className={`text-fs13 truncate mt-0.5 ${
                          isActive ? "text-white/80" : "text-[#a5a3ae]"
                        }`}
                      >
                        {contact.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
