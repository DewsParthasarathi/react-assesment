import React from "react";
import { CustomButton } from "./CustomButton";
import { CustomModal, type ModalSize } from "./CustomModal";

export type ConfirmationVariant = "danger" | "primary" | "warning" | "info";
export type ConfirmationIconType = "trash" | "warning" | "info" | "question" | "none";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  message?: React.ReactNode;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  icon?: ConfirmationIconType | React.ReactNode;
  size?: ModalSize;
  isLoading?: boolean;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  subtitle,
  message,
  children,
  confirmText,
  cancelText = "Cancel",
  variant = "danger",
  icon = "trash",
  size = "md",
  isLoading = false,
  isDeleting = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const loading = isLoading || isDeleting;
  const handleClose = onClose || onCancel;

  const resolvedConfirmText =
    confirmText ||
    (variant === "danger"
      ? loading
        ? "Deleting..."
        : "Delete"
      : loading
        ? "Processing..."
        : "Confirm");

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (icon === "none") return null;

    if (icon === "trash" || variant === "danger") {
      return (
        <div className="w-10 h-10 rounded-full bg-[#ffe5e5] text-[#ff4c51] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      );
    }

    if (icon === "warning" || variant === "warning") {
      return (
        <div className="w-10 h-10 rounded-full bg-[#fff4e5] text-[#ffab00] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-[#e7e7ff] text-[#696cff] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  const getConfirmButtonClasses = () => {
    if (variant === "danger") {
      return "bg-[#ff4c51] hover:bg-[#e03e43] text-white shadow-[0_2px_4px_rgba(255,76,81,0.4)]";
    }
    if (variant === "warning") {
      return "bg-[#ffab00] hover:bg-[#e69a00] text-white shadow-[0_2px_4px_rgba(255,171,0,0.4)]";
    }
    return "bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)]";
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      size={size}
      className="p-6 !overflow-visible"
      bodyClassName="!p-0 flex flex-col gap-4"
    >
      <div className="flex items-start gap-3.5">
        {renderIcon()}
        <div className="flex-1">
          <h3 className="text-fs16 font-semibold text-[#5d596c] leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-fs13 text-[#a5a3ae] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {(message || children) && (
        <div className="text-fs14 text-[#6f6b7d] leading-relaxed">
          {message}
          {children}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <CustomButton
          variant="outline"
          size="sm"
          onClick={handleClose}
          disabled={loading}
          className="!h-9 px-4 text-fs14 font-medium text-[#6f6b7d] border-[#dbdade] hover:bg-[#f8f7fa] cursor-pointer"
        >
          {cancelText}
        </CustomButton>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`h-9 px-4 rounded-[6px] text-fs14 font-medium transition cursor-pointer disabled:opacity-50 ${getConfirmButtonClasses()}`}
        >
          {resolvedConfirmText}
        </button>
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
