import React, { useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomInput } from "../../../components/ui/CustomInput";
import type { EmailComposePayload, EmailItem } from "../../../api/types";

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: EmailComposePayload) => void;
  onSaveDraft: (payload: EmailComposePayload) => void;
  initialData?: EmailItem | null;
}

const EmailComposeForm: React.FC<{
  onClose: () => void;
  onSend: (payload: EmailComposePayload) => void;
  onSaveDraft: (payload: EmailComposePayload) => void;
  initialData?: EmailItem | null;
}> = ({ onClose, onSend, onSaveDraft, initialData }) => {
  const [to, setTo] = useState(initialData?.to || "");
  const [cc, setCc] = useState(initialData?.cc || "");
  const [bcc, setBcc] = useState(initialData?.bcc || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [message, setMessage] = useState(initialData?.message || "");
  const [showCc, setShowCc] = useState(Boolean(initialData?.cc));
  const [showBcc, setShowBcc] = useState(Boolean(initialData?.bcc));
  const [error, setError] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      setError("Please specify at least one recipient in the 'To' field.");
      return;
    }
    if (!subject.trim()) {
      setError("Please add a subject for your email.");
      return;
    }
    setError(null);
    onSend({
      to: to.trim(),
      cc: cc.trim() || undefined,
      bcc: bcc.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      isDraft: false,
    });
    onClose();
  };

  const handleSaveDraft = () => {
    onSaveDraft({
      to: to.trim(),
      cc: cc.trim() || undefined,
      bcc: bcc.trim() || undefined,
      subject: subject.trim() || "(Untitled Draft)",
      message: message.trim(),
      isDraft: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-8 sm:bottom-6 z-50 flex items-end sm:items-auto justify-center select-none pointer-events-auto">
      <div className="w-full sm:w-[540px] md:w-[600px] bg-white rounded-t-lg sm:rounded-lg shadow-[0_8px_32px_rgba(47,43,61,0.2)] border border-[#dbdade]/80 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#696cff] text-white px-5 py-3 flex items-center justify-between">
          <span className="text-fs14 font-semibold tracking-wide">
            {initialData ? "Continue Draft" : "Compose Mail"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSaveDraft}
              title="Save as Draft"
              className="text-white/80 hover:text-white p-1 rounded transition cursor-pointer"
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="text-white/80 hover:text-white p-1 rounded transition cursor-pointer"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Validation message */}
        {error && (
          <div className="bg-[#ffe2e3] text-[#ea5455] text-fs12 px-4 py-1.5 border-b border-[#ea5455]/20 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSend} className="flex flex-col flex-1">
          {/* TO Field */}
          <div className="flex items-center px-4 py-2 border-b border-[#dbdade]/50">
            <label
              htmlFor="email-to"
              className="text-fs13 font-medium text-[#a5a3ae] w-14 shrink-0"
            >
              To:
            </label>
            <CustomInput
              id="email-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              containerClassName="flex-1"
              className="!h-auto !border-none !bg-transparent !p-0 focus:!ring-0 text-fs14 text-[#32475c] placeholder-[#a5a3ae]"
              autoFocus
            />
            <div className="flex items-center gap-2 text-fs12 text-[#696cff] shrink-0 font-medium ml-2">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="hover:underline cursor-pointer"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="hover:underline cursor-pointer"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="flex items-center px-4 py-2 border-b border-[#dbdade]/50 animate-in fade-in">
              <label
                htmlFor="email-cc"
                className="text-fs13 font-medium text-[#a5a3ae] w-14 shrink-0"
              >
                Cc:
              </label>
              <CustomInput
                id="email-cc"
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc-recipient@example.com"
                containerClassName="flex-1"
                className="!h-auto !border-none !bg-transparent !p-0 focus:!ring-0 text-fs14 text-[#32475c] placeholder-[#a5a3ae]"
              />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="flex items-center px-4 py-2 border-b border-[#dbdade]/50 animate-in fade-in">
              <label
                htmlFor="email-bcc"
                className="text-fs13 font-medium text-[#a5a3ae] w-14 shrink-0"
              >
                Bcc:
              </label>
              <CustomInput
                id="email-bcc"
                type="text"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc-recipient@example.com"
                containerClassName="flex-1"
                className="!h-auto !border-none !bg-transparent !p-0 focus:!ring-0 text-fs14 text-[#32475c] placeholder-[#a5a3ae]"
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center px-4 py-2 border-b border-[#dbdade]/50">
            <label
              htmlFor="email-subject"
              className="text-fs13 font-medium text-[#a5a3ae] w-14 shrink-0"
            >
              Subject:
            </label>
            <CustomInput
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Meeting agenda, sales inquiry..."
              containerClassName="flex-1"
              className="!h-auto !border-none !bg-transparent !p-0 focus:!ring-0 text-fs14 text-[#32475c] placeholder-[#a5a3ae]"
            />
          </div>

          {/* Message Textarea */}
          <div className="p-4 flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your email message here..."
              rows={8}
              className="w-full h-44 resize-none text-fs14 text-[#32475c] placeholder-[#a5a3ae] focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="px-4 py-3 bg-[#f8f7fa] border-t border-[#dbdade]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomButton
                type="submit"
                variant="primary"
                size="sm"
                className="!h-9 px-5 gap-2 text-fs13 shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
              >
                <span>Send</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </CustomButton>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-fs13 font-medium text-[#6f6b7d] hover:text-[#5d596c] transition cursor-pointer"
              >
                Save Draft
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              title="Discard"
              className="text-[#a5a3ae] hover:text-[#ea5455] p-1.5 rounded transition cursor-pointer"
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <EmailComposeForm
      key={initialData?.id || "new-compose"}
      onClose={onClose}
      onSend={onSend}
      onSaveDraft={onSaveDraft}
      initialData={initialData}
    />
  );
};

export default EmailComposeModal;
