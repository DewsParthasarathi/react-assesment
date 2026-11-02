import React from "react";
import { ConfirmationModal } from "../../../components/ui/ConfirmationModal";

export interface InvoiceDeleteModalProps {
  isOpen: boolean;
  invoiceNumber: string;
  isMultiple?: boolean;
  count?: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const InvoiceDeleteModal: React.FC<InvoiceDeleteModalProps> = ({
  isOpen,
  invoiceNumber,
  isMultiple = false,
  count = 1,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={isMultiple ? "Delete Selected Invoices" : "Delete Invoice"}
      subtitle="This action cannot be undone."
      message={
        isMultiple ? (
          <>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-[#5d596c]">{count} selected invoices</span>?
          </>
        ) : (
          <>
            Are you sure you want to permanently delete invoice{" "}
            <span className="font-semibold text-[#5d596c]">{invoiceNumber}</span>?
          </>
        )
      }
      confirmText="Delete"
      variant="danger"
      icon="trash"
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default InvoiceDeleteModal;
