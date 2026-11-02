import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Invoice } from "../../api/types";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomModal } from "../../components/ui/CustomModal";
import {
  useInvoiceByIdQuery,
  useInvoicesQuery,
  useUpdateInvoiceMutation,
} from "../../hooks/useInvoicesQuery";

interface LineItem {
  id: string;
  item: string;
  service: string;
  cost: number;
  hours: number;
  discount: string;
}

interface InvoiceEditFormProps {
  invoice: Invoice;
  availableClients: Array<{ name: string; email: string; avatar: string }>;
  onSave: (updates: Partial<Invoice>) => void;
  isPending: boolean;
}

const InvoiceEditForm: React.FC<InvoiceEditFormProps> = ({
  invoice,
  availableClients,
  onSave,
  isPending,
}) => {
  const navigate = useNavigate();

  // Header inputs
  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice.invoiceNumber || "# 4987",
  );
  const [issueDate, setIssueDate] = useState("01/13/2023");
  const [dueDate, setDueDate] = useState("01/23/2023");
  const [selectedClientName, setSelectedClientName] = useState(
    invoice.clientName || "Jordan Stevenson",
  );

  // Line items state
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "item-1",
      item: invoice.clientName || "Jordan Stevenson",
      service: "Customization & Bug Fixes",
      cost: 24,
      hours: 1,
      discount: "0%",
    },
  ]);

  // Salesperson & Notes
  const [salesperson, setSalesperson] = useState("Tommy Shelby");
  const [thanksMessage, setThanksMessage] = useState("Thanks for your business");
  const [noteText, setNoteText] = useState(
    "It was a pleasure working with you and your team.we hope you will keep us in mind for future freelance project . Thank You !",
  );

  // Right Panel Settings
  const [paymentMethod, setPaymentMethod] = useState("Internet Banking");
  const [paymentTermsActive, setPaymentTermsActive] = useState(true);
  const [clientNotesActive, setClientNotesActive] = useState(false);
  const [paymentStubActive, setPaymentStubActive] = useState(false);

  // Modals & Action States
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(invoice.balance || 0);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [sendToEmail, setSendToEmail] = useState(
    invoice.clientEmail || "don85@johnson.com",
  );
  const [sendSubject, setSendSubject] = useState(
    `Invoice ${invoice.invoiceNumber || "#4987"} from Sales Inc.`,
  );
  const [sendMessage, setSendMessage] = useState(
    "Hello,\n\nPlease find attached the updated invoice for recent services. Thank you for your business!\n\nBest regards,\nTommy Shelby",
  );
  const [successToast, setSuccessToast] = useState("");

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Math.random().toString(36).substring(2, 9)}`,
        item: selectedClientName,
        service: "Web Design",
        cost: 32,
        hours: 1,
        discount: "0%",
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        return {
          ...it,
          [field]: value,
        };
      }),
    );
  };

  const handleSave = (andSend = false) => {
    const rawNumber = invoiceNumber.replace("#", "").trim() || invoice.id;
    const selectedClient =
      availableClients.find(
        (c) => c.name.toLowerCase() === selectedClientName.toLowerCase(),
      ) || availableClients[0];

    onSave({
      invoiceNumber: `#${rawNumber}`,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientAvatar: selectedClient.avatar,
      issueDate: issueDate || invoice.issueDate,
      dueDate: dueDate || invoice.dueDate,
    });

    if (andSend) {
      setSuccessToast(`Invoice #${rawNumber} saved and sent to ${selectedClient.email}!`);
    } else {
      setSuccessToast(`Invoice #${rawNumber} saved successfully!`);
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    const newBalance = Math.max(0, (invoice.balance || 0) - amount);
    const newPaidAmount = (invoice.paidAmount || 0) + amount;
    const newStatus = newBalance === 0 ? "Paid" : invoice.status;

    onSave({
      balance: newBalance,
      paidAmount: newPaidAmount,
      status: newStatus,
    });

    setIsPaymentModalOpen(false);
    setSuccessToast(`Payment of $${amount} added successfully!`);
    setTimeout(() => setSuccessToast(""), 5000);
  };

  return (
    <div className="w-full max-w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-w-0 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#e8fadf] text-[#71dd37] border border-[#71dd37]/40 px-4 py-3 rounded-md shadow-lg text-fs14 font-medium flex items-center gap-2 animate-in fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successToast}</span>
        </div>
      )}

      {/* LEFT COLUMN: Main Edit Invoice Form Card */}
      <div className="flex-1 min-w-0 w-full max-w-full bg-white rounded-lg shadow-[0_2px_8px_rgba(47,43,61,0.06)] border border-[#dbdade]/70 p-5 sm:p-7 lg:p-8 flex flex-col">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 min-w-0">
          <div className="text-fs14 text-[#6f6b7d] leading-relaxed">
            <p>450 south Brand Brooklyn</p>
            <p>San Diego Country,CA 91905,USA</p>
            <p>+1 (123) 456 789, 123465432456</p>
          </div>

          <div className="space-y-3 w-full sm:w-auto">
            {/* Invoice # Input */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs14 font-semibold text-[#32475c] w-24 sm:text-right">
                Invoice
              </span>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-48 sm:w-56 h-9 px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
              />
            </div>

            {/* Data Issued Input */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs13 text-[#6f6b7d] w-24 sm:text-right">
                Data Issued:
              </span>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-48 sm:w-56 h-9 px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
              />
            </div>

            {/* Data Due Input */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs13 text-[#6f6b7d] w-24 sm:text-right">
                Data Due:
              </span>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-48 sm:w-56 h-9 px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#dbdade]/50" />

        {/* Invoice To / Bill To Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-fs14 font-semibold text-[#5d596c] mb-3">Invoice To:</h3>
            <div className="relative w-full max-w-xs mb-3">
              <select
                value={selectedClientName}
                onChange={(e) => setSelectedClientName(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white cursor-pointer appearance-none"
              >
                {availableClients.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#6f6b7d]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-fs13 text-[#6f6b7d] leading-relaxed max-w-xs">
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

        {/* Divider */}
        <div className="my-8 border-t border-[#dbdade]/50" />

        {/* Line Items Section */}
        <div>
          {/* Header row */}
          <div className="grid grid-cols-12 gap-3 text-fs12 font-semibold text-[#5d596c] mb-2 px-1">
            <div className="col-span-12 sm:col-span-5">Item</div>
            <div className="col-span-4 sm:col-span-2">Cost</div>
            <div className="col-span-4 sm:col-span-2">Hours</div>
            <div className="col-span-4 sm:col-span-3">Price</div>
          </div>

          {/* Items Cards */}
          <div className="space-y-4">
            {items.map((row) => {
              const rowPrice = ((row.cost || 0) * (row.hours || 0)).toFixed(2);

              return (
                <div
                  key={row.id}
                  className="border border-[#dbdade]/70 rounded-[6px] p-4 relative bg-white flex flex-col gap-3"
                >
                  {/* Top row */}
                  <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                    {/* Item Select */}
                    <div className="col-span-12 sm:col-span-5 relative min-w-0">
                      <select
                        value={row.item}
                        onChange={(e) => handleUpdateItem(row.id, "item", e.target.value)}
                        className="w-full min-w-0 h-9 px-3 pr-7 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white cursor-pointer appearance-none truncate"
                      >
                        <option value="Jordan Stevenson">Jordan Stevenson</option>
                        <option value="Customization & Bug Fixes">Customization & Bug Fixes</option>
                        <option value="Web Design">Web Design</option>
                        <option value="App Development">App Development</option>
                        <option value="Template Design">Template Design</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6f6b7d]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Cost Input */}
                    <div className="col-span-4 sm:col-span-2 min-w-0">
                      <input
                        type="number"
                        min="0"
                        value={row.cost}
                        onChange={(e) => handleUpdateItem(row.id, "cost", Number(e.target.value))}
                        className="w-full min-w-0 h-9 px-2 sm:px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white text-center sm:text-left"
                      />
                    </div>

                    {/* Hours Input */}
                    <div className="col-span-4 sm:col-span-2 min-w-0">
                      <input
                        type="number"
                        min="1"
                        value={row.hours}
                        onChange={(e) => handleUpdateItem(row.id, "hours", Number(e.target.value))}
                        className="w-full min-w-0 h-9 px-2 sm:px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white text-center sm:text-left"
                      />
                    </div>

                    {/* Price Output */}
                    <div className="col-span-4 sm:col-span-3 min-w-0 text-fs14 font-medium text-[#5d596c] flex items-center justify-between">
                      <span>${rowPrice}</span>
                    </div>
                  </div>

                  {/* Bottom row: Service Select & Discount */}
                  <div className="grid grid-cols-12 gap-3 items-center pt-1">
                    <div className="col-span-12 sm:col-span-5 relative min-w-0">
                      <select
                        value={row.service}
                        onChange={(e) => handleUpdateItem(row.id, "service", e.target.value)}
                        className="w-full min-w-0 h-9 px-3 pr-7 border border-[#dbdade] rounded-[6px] text-fs13 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white cursor-pointer appearance-none truncate"
                      >
                        <option value="Customization & Bug Fixes">Customization & Bug Fixes</option>
                        <option value="Web Design">Web Design</option>
                        <option value="App Development">App Development</option>
                        <option value="SEO Optimization">SEO Optimization</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6f6b7d]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-7 min-w-0 flex items-center gap-2 text-fs13 text-[#6f6b7d]">
                      <span>Discount:</span>
                      <span className="text-fs12 text-[#a5a3ae]">0% 0% 0%</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(row.id)}
                      className="absolute top-2 right-2 text-[#a5a3ae] hover:text-[#ff4c51] p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* + ADD ITEM Button */}
          <div className="mt-4">
            <CustomButton
              type="button"
              variant="primary"
              onClick={handleAddItem}
              className="!h-8 px-4 text-fs12 font-medium bg-[#696cff] hover:bg-[#5f61e6] text-white rounded-[6px] shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>ADD ITEM</span>
            </CustomButton>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#dbdade]/50" />

        {/* Salesperson & Financial Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Salesperson & message inputs */}
          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-fs13 font-medium text-[#5d596c] w-24">Invoice To:</span>
              <input
                type="text"
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                placeholder="Salesperson"
                className="w-56 h-9 px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0" />
              <input
                type="text"
                value={thanksMessage}
                onChange={(e) => setThanksMessage(e.target.value)}
                placeholder="Customer message"
                className="w-56 h-9 px-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
              />
            </div>
          </div>

          {/* Summary calculations matching reference */}
          <div className="w-full sm:w-60 space-y-2 text-fs14 text-[#6f6b7d]">
            <div className="flex justify-between py-0.5">
              <span>Subtotal:</span>
              <span className="font-medium text-[#5d596c]">$5000.25</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Discount:</span>
              <span className="font-medium text-[#5d596c]">$00.00</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Tax:</span>
              <span className="font-medium text-[#5d596c]">$100.00</span>
            </div>
            <div className="flex justify-between py-1 text-fs15 font-semibold text-[#5d596c] border-t border-[#dbdade]/40 pt-2">
              <span>Total:</span>
              <span className="text-[#5d596c]">$5100.25</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#dbdade]/50" />

        {/* Footer Note */}
        <div>
          <h4 className="text-fs13 font-semibold text-[#5d596c] mb-2">Note:</h4>
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-3 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Actions & Settings Panel */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
        {/* Top Action Buttons */}
        <div className="space-y-3">
          {/* Row 1: SEND INVOICE */}
          <CustomButton
            type="button"
            variant="primary"
            disabled={isPending}
            onClick={() => handleSave(true)}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{isPending ? "SENDING..." : "SEND INVOICE"}</span>
          </CustomButton>

          {/* Row 2: PREVIEW and SAVE Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => navigate(`/apps/invoice/preview?id=${invoice.id}`)}
              className="w-full !h-11 px-4 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
            >
              <span>PREVIEW</span>
            </CustomButton>

            <CustomButton
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleSave(false)}
              className="w-full !h-11 px-4 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
            >
              <span>{isPending ? "SAVING..." : "SAVE"}</span>
            </CustomButton>
          </div>

          {/* Row 3: ADD PAYMENT Button in Green */}
          <CustomButton
            type="button"
            onClick={() => {
              setPaymentAmount(invoice.balance || 0);
              setIsPaymentModalOpen(true);
            }}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-[#71dd37] hover:bg-[#64c631] text-white shadow-[0_2px_4px_rgba(113,221,55,0.4)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span className="font-bold text-fs15">$</span>
            <span>ADD PAYMENT</span>
          </CustomButton>
        </div>

        {/* Accept Payment Via Dropdown */}
        <div className="pt-2">
          <div className="relative">
            <label className="block text-fs12 font-medium text-[#a5a3ae] mb-1">
              Accept payment via
            </label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white cursor-pointer appearance-none"
              >
                <option value="Internet Banking">Internet Banking</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Paypal">Paypal</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#6f6b7d]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Toggles List */}
        <div className="space-y-4 pt-2">
          {/* Payment Terms Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-fs14 text-[#6f6b7d]">Payment Terms</span>
            <button
              type="button"
              role="switch"
              aria-checked={paymentTermsActive}
              onClick={() => setPaymentTermsActive(!paymentTermsActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                paymentTermsActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  paymentTermsActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Client Notes Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-fs14 text-[#6f6b7d]">Client Notes</span>
            <button
              type="button"
              role="switch"
              aria-checked={clientNotesActive}
              onClick={() => setClientNotesActive(!clientNotesActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                clientNotesActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  clientNotesActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Payment Stub Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-fs14 text-[#6f6b7d]">Payment Stub</span>
            <button
              type="button"
              role="switch"
              aria-checked={paymentStubActive}
              onClick={() => setPaymentStubActive(!paymentStubActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                paymentStubActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  paymentStubActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Payment */}
      <CustomModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Add Payment"
        subtitle={`Record a payment for invoice ${invoice.invoiceNumber}`}
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="p-3 rounded bg-[#f8f7fa] flex justify-between items-center text-fs14">
            <span className="text-[#6f6b7d]">Invoice Balance:</span>
            <span className="font-bold text-[#ff4c51] text-fs16">${invoice.balance}</span>
          </div>

          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Payment Amount ($) *
            </label>
            <input
              type="number"
              min="1"
              max={invoice.balance || 99999}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full h-10 px-3.5 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
            />
          </div>

          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full h-10 px-3.5 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
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
              className="!h-9 px-5 text-fs14 font-medium bg-[#71dd37] hover:bg-[#64c631] text-white"
            >
              Record Payment
            </CustomButton>
          </div>
        </form>
      </CustomModal>

      {/* Modal: Send Invoice */}
      <CustomModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Invoice"
        subtitle={`Send invoice ${invoice.invoiceNumber} to client via email`}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSendModalOpen(false);
            setSuccessToast(`Invoice ${invoice.invoiceNumber} sent to ${sendToEmail}!`);
            setTimeout(() => setSuccessToast(""), 5000);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Recipient Email *
            </label>
            <input
              type="email"
              required
              value={sendToEmail}
              onChange={(e) => setSendToEmail(e.target.value)}
              className="w-full h-10 px-3.5 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
            />
          </div>

          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={sendSubject}
              onChange={(e) => setSendSubject(e.target.value)}
              className="w-full h-10 px-3.5 border border-[#dbdade] rounded-[6px] text-fs14 text-[#5d596c] focus:outline-none focus:border-[#696cff]"
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
    </div>
  );
};

export const InvoiceEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");

  const { data: allInvoices = [] } = useInvoicesQuery();
  const { data: singleInvoice, isLoading } = useInvoiceByIdQuery(invoiceId || undefined);
  const updateMutation = useUpdateInvoiceMutation();

  const invoice =
    singleInvoice ||
    (invoiceId
      ? allInvoices.find((i) => i.id === invoiceId)
      : allInvoices.find((i) => i.invoiceNumber === "#4987") || allInvoices[0]);

  // Extract unique clients
  const availableClients = useMemo(() => {
    const defaultClients = [
      { name: "Jordan Stevenson", email: "don85@johnson.com", avatar: "member1" },
      { name: "Stephanie Burns", email: "brenda49@taylor.info", avatar: "member2" },
      { name: "Tony Herrera", email: "smithfany@powers.com", avatar: "member3" },
      { name: "Kevin Patton", email: "brenda49@taylor.info", avatar: "member4" },
      { name: "Mrs. Julie Donovan MD", email: "smithfany@powers.com", avatar: "member5" },
    ];

    const uniqueMap = new Map<string, { name: string; email: string; avatar: string }>();
    defaultClients.forEach((c) => uniqueMap.set(c.name.toLowerCase(), c));

    allInvoices.forEach((inv) => {
      if (inv.clientName && !uniqueMap.has(inv.clientName.toLowerCase())) {
        uniqueMap.set(inv.clientName.toLowerCase(), {
          name: inv.clientName,
          email: inv.clientEmail,
          avatar: inv.clientAvatar || "member1",
        });
      }
    });

    return Array.from(uniqueMap.values());
  }, [allInvoices]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-12 text-[#696cff] font-medium animate-pulse">
        Loading invoice...
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

  const handleSave = (updates: Partial<Invoice>) => {
    updateMutation.mutate(
      {
        id: invoice.id,
        updates,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate("/apps/invoice/list");
          }, 1500);
        },
      },
    );
  };

  return (
    <InvoiceEditForm
      key={invoice.id}
      invoice={invoice}
      availableClients={availableClients}
      onSave={handleSave}
      isPending={updateMutation.isPending}
    />
  );
};

export default InvoiceEditPage;
