import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import type {
  EmailFolder,
  EmailFolderCounts,
  EmailLabel,
} from "../../../api/types";

interface EmailSidebarProps {
  currentFolder: EmailFolder;
  onSelectFolder: (folder: EmailFolder) => void;
  selectedLabel: EmailLabel | null;
  onSelectLabel: (label: EmailLabel | null) => void;
  counts: EmailFolderCounts;
  onCompose: () => void;
  onEmptyTrash?: () => void;
}

export const EmailSidebar: React.FC<EmailSidebarProps> = ({
  currentFolder,
  onSelectFolder,
  selectedLabel,
  onSelectLabel,
  counts,
  onCompose,
  onEmptyTrash,
}) => {
  const folders: Array<{
    id: EmailFolder;
    label: string;
    badgeCount?: number;
    badgeColor?: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "inbox",
      label: "Inbox",
      badgeCount: counts.inbox,
      badgeColor: "bg-[#e7e7ff] text-[#696cff]",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "sent",
      label: "Send",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0 rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
    },
    {
      id: "draft",
      label: "Draft",
      badgeCount: counts.draft,
      badgeColor: "bg-[#fff1d6] text-[#ffab00]",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      id: "starred",
      label: "Starred",
      badgeCount: counts.starred > 0 ? counts.starred : undefined,
      badgeColor: "bg-[#fff1d6] text-[#ffab00]",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0"
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
      ),
    },
    {
      id: "spam",
      label: "Spam",
      badgeCount: counts.spam,
      badgeColor: "bg-[#ffe2e3] text-[#ea5455]",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
    },
    {
      id: "trash",
      label: "Trash",
      badgeCount: counts.trash > 0 ? counts.trash : undefined,
      badgeColor: "bg-[#f8f7fa] text-[#a5a3ae]",
      icon: (
        <svg
          className="w-4.5 h-4.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  const labels: Array<{
    id: EmailLabel;
    label: string;
    dotColor: string;
  }> = [
    { id: "personal", label: "Personal", dotColor: "bg-[#71dd37]" },
    { id: "company", label: "Company", dotColor: "bg-[#696cff]" },
    { id: "important", label: "important", dotColor: "bg-[#ffab00]" },
    { id: "private", label: "Private", dotColor: "bg-[#ea5455]" },
  ];

  return (
    <aside className="w-[230px] lg:w-[240px] shrink-0 border-r border-[#dbdade]/50 flex flex-col bg-white select-none h-full overflow-hidden">
      <div className="p-4 pt-5 shrink-0 sticky top-0 z-10 bg-white">
        <CustomButton
          variant="primary"
          onClick={onCompose}
          className="w-full !h-10 text-fs14 font-semibold rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Compose</span>
        </CustomButton>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 chat-email-scrollbar">
        <div className="space-y-1">
          {folders.map((item) => {
            const isActive = currentFolder === item.id && !selectedLabel;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectLabel(null);
                  onSelectFolder(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-fs14 transition cursor-pointer text-left ${
                  isActive
                    ? "text-[#696cff] font-medium bg-[#e7e7ff]/40"
                    : "text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#32475c]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={isActive ? "text-[#696cff]" : "text-[#6f6b7d]"}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label} </span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`text-fs11 font-semibold px-2 py-0.5 rounded-full min-w-5 text-center leading-tight ${item.badgeColor}`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* LABELS Section */}
        <div className="mt-7">
          <div className="px-3.5 pb-2">
            <span className="text-fs11 font-medium tracking-wider text-[#a5a3ae] uppercase">
              LABELS
            </span>
          </div>

          <div className="space-y-1">
            {labels.map((item) => {
              const isSelected = selectedLabel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectLabel(isSelected ? null : item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-[6px] text-fs14 transition cursor-pointer text-left ${
                    isSelected
                      ? "text-[#696cff] font-medium bg-[#e7e7ff]/40"
                      : "text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#32475c]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {isSelected && (
                    <span className="text-fs11 font-bold text-[#696cff]">
                      &times;
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty Trash Button if currently in Trash */}
      {currentFolder === "trash" && onEmptyTrash && counts.trash > 0 && (
        <div className="p-4 pt-2 border-t border-[#dbdade]/40 shrink-0 bg-white">
          <button
            type="button"
            onClick={onEmptyTrash}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] text-fs13 font-medium text-[#ea5455] hover:bg-[#ffe2e3]/40 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Empty Trash</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default EmailSidebar;
