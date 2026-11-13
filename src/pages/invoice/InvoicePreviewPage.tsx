import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomModal } from "../../components/ui/CustomModal";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { InvoicePreviewCard } from "./components/InvoicePreviewCard";
import { downloadInvoicePdf } from "./utils/downloadInvoicePdf";
import {
  useInvoiceByIdQuery,
  useInvoicesQuery,
  useUpdateInvoiceMutation,
} from "../../hooks/useInvoicesQuery";

export const InvoicePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");

  const { data: allInvoices = [] } = useInvoicesQuery();
  const { data: singleInvoice, isLoading } = useInvoiceByIdQuery(
    invoiceId || undefined,
  );
  const updateMutation = useUpdateInvoiceMutation();

  const invoice =
    singleInvoice ||
    (invoiceId
      ? allInvoices.find((i) => i.id === invoiceId)
      : allInvoices.find((i) => i.invoiceNumber === "#4987") || allInvoices[0]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState("");
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(
    invoice?.balance ?? 0,
  );
  const [paymentDate, setPaymentDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentNote, setPaymentNote] = useState("");

  const [sendToEmail, setSendToEmail] = useState(
    invoice?.clientEmail || "don85@johnson.com",
  );
  const [sendSubject, setSendSubject] = useState(
    `Invoice ${invoice?.invoiceNumber || "#4987"} from Sales Inc.`,
  );
  const [sendMessage, setSendMessage] = useState(
    "Hello,\n\nPlease find attached the invoice for recent services rendered. Thank you for your business!\n\nBest regards,\nTommy Shelby",
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!previewCardRef.current || !invoice) return;
    setIsDownloading(true);
    try {
      await downloadInvoicePdf(previewCardRef.current, invoice.invoiceNumber);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendModalOpen(false);
    setSendSuccessMsg(
      `Invoice ${invoice?.invoiceNumber || "#4987"} successfully sent to ${sendToEmail}!`,
    );
    setTimeout(() => setSendSuccessMsg(""), 5000);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    const amount = Number(paymentAmount);
    const newBalance = Math.max(0, (invoice.balance || 0) - amount);
    const newPaidAmount = (invoice.paidAmount || 0) + amount;
    const newStatus = newBalance === 0 ? "Paid" : invoice.status;

    updateMutation.mutate(
      {
        id: invoice.id,
        updates: {
          balance: newBalance,
          paidAmount: newPaidAmount,
          status: newStatus,
        },
      },
      {
        onSuccess: () => {
          setIsPaymentModalOpen(false);
          setSendSuccessMsg(`Payment of $${amount} added successfully!`);
          setTimeout(() => setSendSuccessMsg(""), 5000);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-12 text-[#696cff] font-medium animate-pulse">
        Loading invoice preview...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="bg-white rounded-[6px] border border-[#dbdade]/70 p-12 text-center text-[#5d596c]">
        <p className="text-fs19 font-semibold mb-4">Invoice not found</p>
        <CustomButton
          variant="primary"
          onClick={() => navigate("/apps/invoice/list")}
        >
          Back to Invoices
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-w-0 pb-10 print:block print:pb-0">
      {sendSuccessMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[#e8fadf] text-[#71dd37] border border-[#71dd37]/40 px-4 py-3 rounded-md shadow-md text-fs17 font-medium flex items-center gap-2 animate-in fade-in print:hidden">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{sendSuccessMsg}</span>
        </div>
      )}

      <InvoicePreviewCard invoice={invoice} cardRef={previewCardRef} />

      <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3.5 print:hidden">
        <CustomButton
          type="button"
          variant="primary"
          onClick={() => setIsSendModalOpen(true)}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <svg
            className="w-4 h-4 -rotate-45"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span>SEND INVOICE</span>
        </CustomButton>

        <CustomButton
          type="button"
          variant="outline"
          disabled={isDownloading}
          onClick={handleDownload}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider disabled:opacity-60"
        >
          <span>{isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}</span>
        </CustomButton>

        <CustomButton
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
        >
          <span>PRINT</span>
        </CustomButton>

        <CustomButton
          type="button"
          variant="outline"
          onClick={() => navigate(`/apps/invoice/edit?id=${invoice.id}`)}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
        >
          <span>EDIT INVOICE</span>
        </CustomButton>

        <CustomButton
          type="button"
          variant="primary"
          onClick={() => {
            setPaymentAmount(invoice.balance || 0);
            setIsPaymentModalOpen(true);
          }}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <span className="font-bold text-fs18">$</span>
          <span>ADD PAYMENT</span>
        </CustomButton>
      </div>

      <CustomModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Invoice"
        subtitle={`Send invoice ${invoice.invoiceNumber} to client via email`}
        size="md"
      >
        <form onSubmit={handleSendInvoice} className="space-y-4">
          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Recipient Email *
            </label>
            <CustomInput
              type="email"
              required
              value={sendToEmail}
              onChange={(e) => setSendToEmail(e.target.value)}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Subject
            </label>
            <CustomInput
              type="text"
              required
              value={sendSubject}
              onChange={(e) => setSendSubject(e.target.value)}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              className="w-full p-3 border border-[#dbdade] rounded-[6px] text-fs17 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dbdade]/50">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setIsSendModalOpen(false)}
              className="!h-9 px-4 text-fs17 font-medium"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              className="!h-9 px-5 text-fs17 font-medium bg-[#696cff] text-white"
            >
              Send Invoice
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      <CustomModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Add Payment"
        subtitle={`Record a payment for invoice ${invoice.invoiceNumber}`}
        size="md"
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div className="p-3 rounded bg-[#f8f7fa] flex justify-between items-center text-fs17">
            <span className="text-[#6f6b7d]">Invoice Balance:</span>
            <span className="font-bold text-[#ff4c51] text-fs19">
              ${invoice.balance}
            </span>
          </div>

          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Payment Amount ($) *
            </label>
            <CustomInput
              type="number"
              min="1"
              max={invoice.balance || 99999}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Payment Date *
            </label>
            <CustomInput
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          <div>
            <CustomDropdown
              label="Payment Method"
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(String(val))}
              sizeVariant="md"
              options={[
                { label: "Bank Transfer", value: "Bank Transfer" },
                { label: "Credit Card", value: "Credit Card" },
                { label: "Paypal", value: "Paypal" },
                { label: "Cash", value: "Cash" },
              ]}
            />
          </div>

          <div>
            <label className="block text-fs16 font-medium text-[#5d596c] mb-1">
              Internal Note (Optional)
            </label>
            <CustomInput
              type="text"
              placeholder="e.g. Wire transfer received via America Bank"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dbdade]/50">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="!h-9 px-4 text-fs17 font-medium"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
              className="!h-9 px-5 text-fs17 font-medium bg-[#696cff] text-white"
            >
              {updateMutation.isPending
                ? "Adding Payment..."
                : "Record Payment"}
            </CustomButton>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default InvoicePreviewPage;
