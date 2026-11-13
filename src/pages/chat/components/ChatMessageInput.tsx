import React, { useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomInput } from "../../../components/ui/CustomInput";

interface ChatMessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (
    e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  return (
    <div className="shrink-0 sticky bottom-0 z-10 p-4 bg-white border-t border-[#dbdade]/50 select-none">
      <form
        onSubmit={handleSubmit}
        action="#"
        method="dialog"
        className="border border-[#dbdade]/70 rounded-[6px] flex items-center px-4 py-1.5 bg-white shadow-2xs focus-within:border-[#696cff] transition"
      >
        <CustomInput
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type Your Messge here..."
          containerClassName="flex-1"
          className="!h-auto !border-none !bg-transparent !p-0 focus:!ring-0 text-fs14 text-[#32475c] placeholder-[#a5a3ae]"
        />

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            type="button"
            title="Voice input"
            className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
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
                strokeWidth={1.8}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <button
            type="button"
            title="Attach file"
            className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
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
                strokeWidth={1.8}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <CustomButton
            type="button"
            onClick={handleSubmit}
            variant="primary"
            size="sm"
            disabled={!text.trim() || disabled}
            className="!h-9 px-6 uppercase font-medium text-fs14 tracking-wider rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
          >
            SEND
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageInput;
