import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  eventTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-[#dbdade]/70 overflow-hidden transform transition-all p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-fs16 font-semibold text-[#32475c] mb-1">
              Delete Event
            </h3>
            <p className="text-fs14 text-[#6f6b7d] leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-[#32475c]">"{eventTitle}"</strong>? This
              action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="!h-9 px-4 text-fs14"
          >
            Cancel
          </CustomButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9 px-4 rounded-[6px] text-fs14 font-medium bg-[#ff4c51] hover:bg-[#e03e43] text-white shadow-[0_2px_4px_rgba(255,76,81,0.4)] transition cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

