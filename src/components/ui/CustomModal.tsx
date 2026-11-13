import React, { useEffect, useRef } from "react";
import { CustomButton } from "./CustomButton";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[95vw] sm:max-w-4xl",
};

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasHeader = Boolean(title || subtitle || showCloseButton);

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-[0_4px_24px_rgba(47,43,61,0.18)] border border-[#dbdade]/70 flex flex-col overflow-hidden max-h-[92vh] transform transition-all animate-in zoom-in-95 duration-150 ${className}`}
      >
        {hasHeader && (
          <div
            className={`flex items-start justify-between px-6 py-4 border-b border-[#dbdade]/60 bg-[#fafafb] ${headerClassName}`}
          >
            <div className="flex-1 pr-4">
              {title &&
                (typeof title === "string" ? (
                  <h3 className="text-fs19 font-bold text-[#32475c] leading-snug">
                    {title}
                  </h3>
                ) : (
                  title
                ))}
              {subtitle && (
                <p className="text-fs14 text-[#a5a3ae] mt-0.5">{subtitle}</p>
              )}
            </div>

            {showCloseButton && (
              <CustomButton
                type="button"
                variant="ghost"
                onClick={onClose}
                className="!p-1 !h-auto text-[#a5a3ae] hover:text-[#5d596c] rounded-md transition cursor-pointer shrink-0"
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
              </CustomButton>
            )}
          </div>
        )}

        <div className={`p-6 overflow-y-auto flex-1 ${bodyClassName}`}>
          {children}
        </div>

        {footer && (
          <div
            className={`flex items-center justify-end gap-3 px-6 py-3.5 border-t border-[#dbdade]/60 bg-[#fafafb] ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
