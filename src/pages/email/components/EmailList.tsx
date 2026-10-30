import React from "react";
import type { EmailItem } from "../../../api/types";
import { getAvatarUrl } from "../avatarHelper";

interface EmailListProps {
  emails: EmailItem[];
  selectedIds: string[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onToggleStar: (
    id: string,
    currentStarred: boolean,
    e: React.MouseEvent,
  ) => void;
  onOpenEmail: (email: EmailItem) => void;
  isLoading?: boolean;
}

const labelColorMap: Record<string, string> = {
  personal: "bg-[#71dd37]",
  company: "bg-[#696cff]",
  important: "bg-[#ffab00]",
  private: "bg-[#ea5455]",
};

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedIds,
  searchQuery = "",
  onToggleSelect,
  onToggleStar,
  onOpenEmail,
  isLoading = false,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#dbdade]/35 chat-email-scrollbar select-none">
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-[#a5a3ae] text-fs14">
          Loading emails...
        </div>
      ) : emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <svg
            className="w-12 h-12 text-[#dbdade] mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-fs15 font-medium text-[#6f6b7d]">
            No emails found
          </p>
          <p className="text-fs13 text-[#a5a3ae] mt-1">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "This folder is currently empty"}
          </p>
        </div>
      ) : (
        emails.map((email) => {
            const isSelected = selectedIds.includes(email.id);
            const isUnread = !email.isRead;

            return (
              <div
                key={email.id}
                onClick={() => onOpenEmail(email)}
                className={`group flex items-center justify-between px-5 py-3 transition cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#e7e7ff]/30"
                    : isUnread
                      ? "bg-white hover:bg-[#f8f7fa]"
                      : "bg-[#fcfcfd] hover:bg-[#f8f7fa]"
                }`}
              >
                {/* Left section: Checkbox, Star, Avatar, Sender Name */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => onToggleSelect(email.id, e)}
                    aria-label={isSelected ? "Deselect email" : "Select email"}
                    className="cursor-pointer shrink-0"
                  >
                    {isSelected ? (
                      <div className="w-4.5 h-4.5 rounded-[4px] bg-[#696cff] border border-[#696cff] flex items-center justify-center text-white">
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-[4px] border-2 border-[#dbdade] hover:border-[#696cff] transition bg-white" />
                    )}
                  </button>

                  {/* Star Button */}
                  <button
                    type="button"
                    onClick={(e) => onToggleStar(email.id, email.isStarred, e)}
                    aria-label={email.isStarred ? "Unstar email" : "Star email"}
                    className="cursor-pointer shrink-0 p-0.5"
                  >
                    {email.isStarred ? (
                      <svg
                        className="w-4.5 h-4.5 text-[#ffab00] fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4.5 h-4.5 text-[#dbdade] group-hover:text-[#a5a3ae] transition"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Sender Avatar */}
                  <img
                    src={getAvatarUrl(email.from.avatar)}
                    alt={email.from.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#dbdade]/50"
                  />

                  {/* Sender Name */}
                  <span
                    className={`text-fs14 shrink-0 w-32 md:w-36 truncate ${
                      isUnread
                        ? "font-bold text-[#32475c]"
                        : "font-medium text-[#5d596c]"
                    }`}
                  >
                    {email.from.name}
                  </span>

                  {/* Subject and Message Snippet */}
                  <span
                    className={`text-fs14 truncate flex-1 min-w-0 ${
                      isUnread ? "text-[#32475c] font-medium" : "text-[#6f6b7d]"
                    }`}
                  >
                    {email.snippet || email.subject}
                  </span>
                </div>

                {/* Right section: Label dots and Timestamp */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {/* Label dots */}
                  {email.labels && email.labels.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {email.labels.map((lbl) => (
                        <span
                          key={lbl}
                          title={lbl}
                          className={`w-2 h-2 rounded-full ${
                            labelColorMap[lbl] || "bg-[#a5a3ae]"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span
                    className={`text-fs12 min-w-16 text-right ${
                      isUnread
                        ? "text-[#32475c] font-semibold"
                        : "text-[#a5a3ae]"
                    }`}
                  >
                    {email.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
    </div>
  );
};

export default EmailList;
