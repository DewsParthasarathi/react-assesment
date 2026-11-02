import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/CustomButton";
import {
  useCreateInvoiceMutation,
  useInvoicesQuery,
} from "../../hooks/useInvoicesQuery";

interface LineItem {
  id: string;
  item: string;
  description: string;
  cost: number;
  hours: number;
  discount: string;
}

export const InvoiceAddPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInvoiceMutation();
  const { data: allInvoices = [] } = useInvoicesQuery();

  // Extract unique clients from existing database records
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

  // Form fields matching reference screenshot
  const [invoiceNumber, setInvoiceNumber] = useState("# 4987");
  const [issueDate, setIssueDate] = useState("01/13/2023");
  const [dueDate, setDueDate] = useState("01/23/2023");
  const [selectedClientName, setSelectedClientName] = useState(
    "Jordan Stevenson",
  );

  // Line items state
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "item-1",
      item: "Jordan Stevenson",
      description: "Customization & Bug Fixes",
      cost: 24,
      hours: 1,
      discount: "0%",
    },
  ]);

  // Salesperson & Notes
  const [salesperson, setSalesperson] = useState("Tommy Shelby");
  const [thanksMessage, setThanksMessage] = useState("Thanks for your business");
  const [noteText, setNoteText] = useState("Thank You !");

  // Right Panel Settings
  const [paymentMethod, setPaymentMethod] = useState("Internet Banking");
  const [paymentTermsActive, setPaymentTermsActive] = useState(true);
  const [clientNotesActive, setClientNotesActive] = useState(false);
  const [paymentStubActive, setPaymentStubActive] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Subtotal & Financial Calculations
  const subtotal = items.reduce((sum, it) => sum + (it.cost || 0) * (it.hours || 0), 0);
  const tax = 0;
  const discount = 0;
  const total = subtotal - discount + tax;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Math.random().toString(36).substring(2, 9)}`,
        item: "Web Design",
        description: "Template Customization & Layout Styling",
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

  const handleSaveInvoice = (andSend = false) => {
    const rawNumber = invoiceNumber.replace("#", "").trim() || "4987";
    const selectedClient =
      availableClients.find(
        (c) => c.name.toLowerCase() === selectedClientName.toLowerCase(),
      ) || availableClients[0];

    const newInvoice = {
      id: rawNumber,
      invoiceNumber: `#${rawNumber}`,
      clientId: `c-${rawNumber}`,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientAvatar: selectedClient.avatar,
      total: total > 0 ? total : 24,
      paidAmount: 0,
      balance: total > 0 ? total : 24,
      status: "Pending" as const,
      issueDate: issueDate || "2023-01-13",
      dueDate: dueDate || "2023-01-23",
      salesperson,
      note: noteText,
    };

    createMutation.mutate(newInvoice, {
      onSuccess: () => {
        setSuccessToast(
          andSend
            ? `Invoice #${rawNumber} saved and sent to ${selectedClient.email}!`
            : `Invoice #${rawNumber} saved successfully!`,
        );
        setTimeout(() => {
          navigate("/apps/invoice/list");
        }, 1500);
      },
    });
  };

  return (
    <div className="w-full max-w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-w-0 pb-12">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#e8fadf] text-[#71dd37] border border-[#71dd37]/40 px-4 py-3 rounded-md shadow-lg text-fs14 font-medium flex items-center gap-2 animate-in fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successToast}</span>
        </div>
      )}

      {/* LEFT COLUMN: Main Add Invoice Form Card */}
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
            <div className="relative w-full max-w-xs">
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
          </div>

          <div>
            <h3 className="text-fs14 font-semibold text-[#5d596c] mb-3">Bill To:</h3>
            <div className="space-y-1.5 text-fs13 text-[#6f6b7d]">
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">Total Due :</span>
                <span className="font-medium text-[#5d596c]">$12,110.55</span>
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

                  {/* Bottom row: Description & Discount */}
                  <div className="grid grid-cols-12 gap-3 items-center pt-1">
                    <div className="col-span-12 sm:col-span-5">
                      <textarea
                        rows={2}
                        value={row.description}
                        onChange={(e) => handleUpdateItem(row.id, "description", e.target.value)}
                        placeholder="Description..."
                        className="w-full p-2.5 border border-[#dbdade] rounded-[6px] text-fs13 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-7 flex items-center gap-2 text-fs13 text-[#6f6b7d]">
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

          {/* Summary calculations */}
          <div className="w-full sm:w-60 space-y-2 text-fs14 text-[#6f6b7d]">
            <div className="flex justify-between py-0.5">
              <span>Subtotal:</span>
              <span className="font-medium text-[#5d596c]">$00.00</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Discount:</span>
              <span className="font-medium text-[#5d596c]">$00.00</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Tax:</span>
              <span className="font-medium text-[#5d596c]">$00.00</span>
            </div>
            <div className="flex justify-between py-1 text-fs15 font-semibold text-[#5d596c] border-t border-[#dbdade]/40 pt-2">
              <span>Total:</span>
              <span className="text-[#5d596c]">$00.00</span>
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
          {/* 1. SEND INVOICE */}
          <CustomButton
            type="button"
            variant="primary"
            disabled={createMutation.isPending}
            onClick={() => handleSaveInvoice(true)}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-[#696cff] hover:bg-[#5f61e6] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{createMutation.isPending ? "SENDING..." : "SEND INVOICE"}</span>
          </CustomButton>

          {/* 2. PREVIEW */}
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => navigate("/apps/invoice/preview")}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
          >
            <span>PREVIEW</span>
          </CustomButton>

          {/* 3. SAVE */}
          <CustomButton
            type="button"
            variant="outline"
            disabled={createMutation.isPending}
            onClick={() => handleSaveInvoice(false)}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs14 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
          >
            <span>{createMutation.isPending ? "SAVING..." : "SAVE"}</span>
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
    </div>
  );
};

export default InvoiceAddPage;
