import React from "react";
import {
  ConfirmationModal as ReusableConfirmationModal,
  type ConfirmationModalProps,
} from "../../../components/ui/ConfirmationModal";

export const ConfirmationModal: React.FC<ConfirmationModalProps> = (props) => {
  return <ReusableConfirmationModal {...props} />;
};

export default ConfirmationModal;
