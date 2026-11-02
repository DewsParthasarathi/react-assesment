import React from "react";
import { ConfirmationModal } from "../../../components/ui/ConfirmationModal";

export interface DeleteConfirmModalProps {
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
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Delete Event"
      subtitle="This action cannot be undone."
      message={
        <>
          Are you sure you want to delete{" "}
          <strong className="text-[#32475c]">"{eventTitle}"</strong>?
        </>
      }
      confirmText="Delete Event"
      variant="danger"
      icon="trash"
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeleteConfirmModal;
