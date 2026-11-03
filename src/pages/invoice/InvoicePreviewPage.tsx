import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomModal } from "../../components/ui/CustomModal";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomTable, type TableColumn } from "../../components/ui/Table";
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
  const { data: singleInvoice, isLoading } = useInvoiceByIdQuery(invoiceId || undefined);
  const updateMutation = useUpdateInvoiceMutation();

  // Pick target invoice, default to #4987 if available, otherwise first invoice
  const invoice =
    singleInvoice ||
    (invoiceId
      ? allInvoices.find((i) => i.id === invoiceId)
      : allInvoices.find((i) => i.invoiceNumber === "#4987") || allInvoices[0]);

  // Modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState("");

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(invoice?.balance ?? 0);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentNote, setPaymentNote] = useState("");

  // Send form state
  const [sendToEmail, setSendToEmail] = useState(invoice?.clientEmail || "don85@johnson.com");
  const [sendSubject, setSendSubject] = useState(
    `Invoice ${invoice?.invoiceNumber || "#4987"} from Sales Inc.`,
  );
  const [sendMessage, setSendMessage] = useState(
    "Hello,\n\nPlease find attached the invoice for recent services rendered. Thank you for your business!\n\nBest regards,\nTommy Shelby",
  );

  const handlePrint = () => {
    window.print();
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
        <p className="text-fs16 font-semibold mb-4">Invoice not found</p>
        <CustomButton variant="primary" onClick={() => navigate("/apps/invoice/list")}>
          Back to Invoices
        </CustomButton>
      </div>
    );
  }

  // Invoice line items matching reference screenshot
  const items = [
    {
      item: "Premium Branding Package",
      description: "Branding & Promotion",
      hours: 48,
      qty: 1,
      total: "$ 32",
    },
    {
      item: "Social Media",
      description: "Social media templates",
      hours: 42,
      qty: 1,
      total: "$ 28",
    },
    {
      item: "Web Design",
      description: "Web Designing Package",
      hours: 46,
      qty: 1,
      total: "$ 24",
    },
    {
      item: "SEO",
      description: "Search engine optimization",
      hours: 40,
      qty: 1,
      total: "$ 22",
    },
  ];

  const itemColumns: TableColumn<(typeof items)[0]>[] = [
    {
      id: "item",
      header: "ITEM",
      headerClassName:
        "py-3.5 pr-4 font-bold text-fs12 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 pr-4 font-medium text-[#5d596c] whitespace-nowrap",
      render: (row) => row.item,
    },
    {
      id: "description",
      header: "DESCRIPTION",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs12 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap",
      render: (row) => row.description,
    },
    {
      id: "hours",
      header: "HOURS",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs12 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap",
      render: (row) => row.hours,
    },
    {
      id: "qty",
      header: "QTY",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs12 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap",
      render: (row) => row.qty,
    },
    {
      id: "total",
      header: "TOTAL",
      headerClassName:
        "py-3.5 pl-4 font-bold text-fs12 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 pl-4 whitespace-nowrap font-medium text-[#5d596c]",
      render: (row) => row.total,
    },
  ];

  return (
    <div className="w-full max-w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-w-0 pb-10">
      {/* Toast Notification */}
      {sendSuccessMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[#e8fadf] text-[#71dd37] border border-[#71dd37]/40 px-4 py-3 rounded-md shadow-md text-fs14 font-medium flex items-center gap-2 animate-in fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{sendSuccessMsg}</span>
        </div>
      )}

      {/* LEFT COLUMN: Main Invoice Document Card */}
      <div className="flex-1 min-w-0 w-full max-w-full bg-white rounded-lg shadow-[0_2px_8px_rgba(47,43,61,0.06)] border border-[#dbdade]/70 p-5 sm:p-7 lg:p-8 flex flex-col print:border-none print:shadow-none print:p-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 min-w-0">
          <div className="text-fs14 text-[#6f6b7d] leading-relaxed">
            <p>450 south Brand Brooklyn</p>
            <p>San Diego Country,CA 91905,USA</p>
            <p>+1 (123) 456 789, 123465432456</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h1 className="text-fs22 font-bold text-[#32475c] tracking-tight">
              Invoice #{invoice.invoiceNumber.replace("#", "")}
            </h1>
            <p className="text-fs13 text-[#6f6b7d]">
              <span className="font-normal">Data Issued:</span>{" "}
              <span className="font-medium text-[#5d596c] ml-2">
                {invoice.issueDate || "13 Jan 2023"}
              </span>
            </p>
            <p className="text-fs13 text-[#6f6b7d]">
              <span className="font-normal">Data Due:</span>{" "}
              <span className="font-medium text-[#5d596c] ml-4">
                {invoice.dueDate || "23 Jan 2023"}
              </span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#dbdade]/50" />

        {/* Invoice To / Bill To Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-fs14 font-semibold text-[#5d596c] mb-3">Invoice To:</h3>
            <p className="text-fs13 text-[#6f6b7d] leading-relaxed">
              Lorem ipsum dolor sit amet,
              <br />
              consectetur adipiscing elit,
              <br />
              sed do eiusmod tempor.
            </p>
          </div>

          <div>
            <h3 className="text-fs14 font-semibold text-[#5d596c] mb-3">Bill To:</h3>
            <div className="space-y-1.5 text-fs13 text-[#6f6b7d]">
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">Total Due :</span>
                <span className="font-medium text-[#5d596c]">
                  ${invoice.balance?.toLocaleString() || "12,110.55"}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">Bank name :</span>
                <span className="text-[#6f6b7d]">America Bank</span>
              </div>
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">Country :</span>
                <span className="text-[#6f6b7d]">United States</span>
              </div>
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">IBAN :</span>
                <span className="text-[#6f6b7d]">ETD95xxxxxxxxxxxx</span>
              </div>
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">SWIFT code :</span>
                <span className="text-[#6f6b7d]">BRxxxxx21</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table using CustomTable */}
        <div className="mt-8 overflow-x-auto">
          <CustomTable
            columns={itemColumns}
            data={items}
            keyExtractor={(_, idx) => idx}
            className="w-full overflow-x-auto"
            tableClassName="w-full text-left border-collapse text-fs14"
            headerRowClassName="border-y border-[#dbdade]/70 text-fs12 font-bold text-[#5d596c] uppercase tracking-wider"
            bodyClassName="divide-y divide-[#dbdade]/40 text-fs13 text-[#6f6b7d]"
            bodyRowClassName="hover:bg-[#fafafb]/60 transition-colors"
          />
        </div>

        {/* Salesperson & Financial Summary */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-1">
            <p className="text-fs14 font-medium text-[#5d596c]">
              <span className="font-semibold text-[#5d596c]">Salesperson:</span> Tommy Shelby
            </p>
            <p className="text-fs13 text-[#a5a3ae]">Thanks for your business</p>
          </div>

          <div className="w-full sm:w-60 space-y-2 text-fs14 text-[#6f6b7d]">
            <div className="flex justify-between py-0.5">
              <span>Subtotal:</span>
              <span className="font-medium text-[#5d596c]">$154.25</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Discount:</span>
              <span className="font-medium text-[#5d596c]">$00.00</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Tax:</span>
              <span className="font-medium text-[#5d596c]">$50.00</span>
            </div>
            <div className="flex justify-between py-1 text-fs15 font-semibold text-[#5d596c]">
              <span>Total:</span>
              <span className="text-[#5d596c]">$204.25</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-[#dbdade]/60 text-fs13 text-[#6f6b7d] leading-relaxed">
          <p>
            <span className="font-semibold text-[#5d596c]">Note:</span> It was a pleasure working with you and your team.we hope you will keep us in mind for future freelance project .
          </p>
          <p className="mt-1">Thank You !</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Actions Sidebar */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3.5 print:hidden">
        {/* 1. SEND INVOICE Button */}
        <CustomButton
          type="button"
          variant="primary"
          onClick={() => setIsSendModalOpen(true)}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>SEND INVOICE</span>
        </CustomButton>

        {/* 2. DOWNLOAD Button */}
        <CustomButton
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
        >
          <span>DOWNLOAD</span>
        </CustomButton>

        {/* 3. PRINT Button */}
        <CustomButton
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
        >
          <span>PRINT</span>
        </CustomButton>

        {/* 4. EDIT INVOICE Button */}
        <CustomButton
          type="button"
          variant="outline"
          onClick={() => navigate(`/apps/invoice/edit?id=${invoice.id}`)}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
        >
          <span>EDIT INVOICE</span>
        </CustomButton>

        {/* 5. ADD PAYMENT Button */}
        <CustomButton
          type="button"
          variant="primary"
          onClick={() => {
            setPaymentAmount(invoice.balance || 0);
            setIsPaymentModalOpen(true);
          }}
          className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <span className="font-bold text-fs15">$</span>
          <span>ADD PAYMENT</span>
        </CustomButton>
      </div>

      {/* Modal: Send Invoice */}
      <CustomModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Invoice"
        subtitle={`Send invoice ${invoice.invoiceNumber} to client via email`}
        size="md"
      >
        <form onSubmit={handleSendInvoice} className="space-y-4">
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
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
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
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
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Message
            </label>
            <textarea
              rows={4}
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              className="w-full p-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dbdade]/50">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setIsSendModalOpen(false)}
              className="!h-9 px-4 text-fs14 font-medium"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              className="!h-9 px-5 text-fs14 font-medium bg-[#696cff] text-white"
            >
              Send Invoice
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      {/* Modal: Add Payment */}
      <CustomModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Add Payment"
        subtitle={`Record a payment for invoice ${invoice.invoiceNumber}`}
        size="md"
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div className="p-3 rounded bg-[#f8f7fa] flex justify-between items-center text-fs14">
            <span className="text-[#6f6b7d]">Invoice Balance:</span>
            <span className="font-bold text-[#ff4c51] text-fs16">${invoice.balance}</span>
          </div>

          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
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
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
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
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
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
              className="!h-9 px-4 text-fs14 font-medium"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
              className="!h-9 px-5 text-fs14 font-medium bg-[#696cff] text-white"
            >
              {updateMutation.isPending ? "Adding Payment..." : "Record Payment"}
            </CustomButton>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default InvoicePreviewPage;
