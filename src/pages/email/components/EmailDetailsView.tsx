import React, { useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import type { EmailItem, EmailLabel } from "../../../api/types";
import { getAvatarUrl } from "../avatarHelper";

interface EmailDetailsViewProps {
  email: EmailItem;
  onBack: () => void;
  onToggleStar: (id: string, isStarred: boolean) => void;
  onDelete: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onReply: (email: EmailItem, replyText: string) => void;
  onForward: (email: EmailItem) => void;
}

const labelBadgeMap: Record<EmailLabel, { name: string; color: string }> = {
  personal: { name: "Personal", color: "bg-[#e8fadf] text-[#71dd37]" },
  company: { name: "Company", color: "bg-[#e7e7ff] text-[#696cff]" },
  important: { name: "important", color: "bg-[#fff1d6] text-[#ffab00]" },
  private: { name: "Private", color: "bg-[#ffe2e3] text-[#ea5455]" },
};

export const EmailDetailsView: React.FC<EmailDetailsViewProps> = ({
  email,
  onBack,
  onToggleStar,
  onDelete,
  onMarkAsUnread,
  onReply,
  onForward,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(email, replyText.trim());
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
      <div className="shrink-0 sticky top-0 z-10 px-5 py-3 border-b border-[#dbdade]/50 flex items-center justify-between bg-white select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-[4px] hover:bg-[#f8f7fa] text-[#6f6b7d] hover:text-[#32475c] transition cursor-pointer flex items-center gap-1.5 text-fs13 font-medium"
            title="Back to list"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-[#dbdade] mx-1" />

          <button
            type="button"
            onClick={() => onDelete(email.id)}
            title="Delete email"
            className="p-1.5 rounded-[4px] hover:bg-[#f8f7fa] text-[#6f6b7d] hover:text-[#ea5455] transition cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
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
          </button>

          <button
            type="button"
            onClick={() => onMarkAsUnread(email.id)}
            title="Mark as unread"
            className="p-1.5 rounded-[4px] hover:bg-[#f8f7fa] text-[#6f6b7d] hover:text-[#5d596c] transition cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
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
          </button>
        </div>

        <button
          type="button"
          onClick={() => onToggleStar(email.id, email.isStarred)}
          title={email.isStarred ? "Unstar" : "Star"}
          className="p-1.5 rounded-[4px] hover:bg-[#f8f7fa] transition cursor-pointer"
        >
          {email.isStarred ? (
            <svg
              className="w-5 h-5 text-[#ffab00] fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-[#a5a3ae] hover:text-[#ffab00] transition"
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
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 chat-email-scrollbar">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#dbdade]/50">
          <h2 className="text-fs20 font-bold text-[#32475c] leading-snug">
            {email.subject}
          </h2>

          {email.labels && email.labels.length > 0 && (
            <div className="flex items-center gap-1.5">
              {email.labels.map((lbl) => {
                const badge = labelBadgeMap[lbl];
                if (!badge) return null;
                return (
                  <span
                    key={lbl}
                    className={`text-fs11 font-semibold px-2.5 py-0.5 rounded-full ${badge.color}`}
                  >
                    {badge.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Sender Information Card */}
        <div className="flex items-start justify-between gap-4 py-5 border-b border-[#dbdade]/40">
          <div className="flex items-center gap-3.5">
            <img
              src={getAvatarUrl(email.from.avatar)}
              alt={email.from.name}
              className="w-10 h-10 rounded-full object-cover border border-[#dbdade]/60 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-fs15 font-bold text-[#32475c]">
                  {email.from.name}
                </span>
                <span className="text-fs12 text-[#a5a3ae]">
                  &lt;{email.from.email}&gt;
                </span>
              </div>
              <div className="text-fs12 text-[#6f6b7d] mt-0.5">
                to:{" "}
                <span className="text-[#32475c] font-medium">{email.to}</span>
                {email.cc && (
                  <span className="ml-2 text-[#a5a3ae]">cc: {email.cc}</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-fs12 text-[#a5a3ae] shrink-0 whitespace-nowrap">
            {email.timestamp} ({new Date(email.date).toLocaleDateString()})
          </div>
        </div>

        {/* Full Message Body */}
        <div className="py-6 text-fs14 text-[#444050] whitespace-pre-wrap leading-relaxed min-h-[160px]">
          {email.message}
        </div>

        {/* Action Buttons (Reply, Forward) */}
        <div className="pt-4 border-t border-[#dbdade]/40 flex items-center gap-3">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setShowReplyBox((prev) => !prev)}
            className="!h-9 px-4 gap-2 text-fs13 border-[#dbdade]"
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
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span>Reply</span>
          </CustomButton>

          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => onForward(email)}
            className="!h-9 px-4 gap-2 text-fs13 border-[#dbdade]"
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
                d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"
              />
            </svg>
            <span>Forward</span>
          </CustomButton>
        </div>

        {/* Inline Reply Box */}
        {showReplyBox && (
          <div className="mt-5 p-4 rounded-lg bg-[#f8f7fa] border border-[#dbdade]/60 animate-in fade-in">
            <div className="text-fs13 font-semibold text-[#32475c] mb-2">
              Reply to {email.from.name}
            </div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full p-3 bg-white rounded-md border border-[#dbdade] text-fs14 text-[#32475c] focus:outline-hidden focus:border-[#696cff] transition resize-none"
              autoFocus
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                }}
                className="!h-8 px-3 text-fs12"
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                size="sm"
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="!h-8 px-4 text-fs12 shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
              >
                Send Reply
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetailsView;
