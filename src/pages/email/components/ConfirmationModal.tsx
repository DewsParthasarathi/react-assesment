import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-[0_4px_24px_rgba(47,43,61,0.16)] border border-[#dbdade]/50 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-fs18 font-bold text-[#32475c]">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
            aria-label="Close"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-fs14 text-[#6f6b7d] leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="!h-9 px-4 text-fs13"
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            variant={variant}
            size="sm"
            onClick={onConfirm}
            className="!h-9 px-4 text-fs13"
          >
            {confirmText}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

