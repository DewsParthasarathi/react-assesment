import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import {
  useCreateInvoiceMutation,
  useInvoicesQuery,
} from "../../hooks/useInvoicesQuery";
import type { Invoice } from "../../api/types";

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

  const nextGeneratedId = useMemo(() => {
    if (!allInvoices || allInvoices.length === 0) return "5024";
    const nums = allInvoices
      .map((inv) => {
        const n1 = parseInt((inv.invoiceNumber || "").replace(/[^0-9]/g, ""), 10);
        const n2 = parseInt((inv.id || "").replace(/[^0-9]/g, ""), 10);
        return Math.max(isNaN(n1) ? 0 : n1, isNaN(n2) ? 0 : n2);
      })
      .filter((n) => !isNaN(n) && n > 0);
    const max = nums.length > 0 ? Math.max(...nums) : 5023;
    return String(max + 1);
  }, [allInvoices]);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    if (!invoiceNumber && nextGeneratedId) {
      setInvoiceNumber(`# ${nextGeneratedId}`);
    }
  }, [nextGeneratedId, invoiceNumber]);

  const todayFormatted = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }, []);

  const dueDateFormatted = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }, []);

  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!issueDate) setIssueDate(todayFormatted);
    if (!dueDate) setDueDate(dueDateFormatted);
  }, [todayFormatted, dueDateFormatted, issueDate, dueDate]);

  const availableClients = useMemo(() => {
    const defaultClients = [
      {
        name: "Jordan Stevenson",
        email: "don85@johnson.com",
        avatar: "member1",
      },
      {
        name: "Stephanie Burns",
        email: "brenda49@taylor.info",
        avatar: "member2",
      },
      {
        name: "Tony Herrera",
        email: "smithfany@powers.com",
        avatar: "member3",
      },
      {
        name: "Kevin Patton",
        email: "brenda49@taylor.info",
        avatar: "member4",
      },
      {
        name: "Mrs. Julie Donovan MD",
        email: "smithfany@powers.com",
        avatar: "member5",
      },
    ];

    const uniqueMap = new Map<
      string,
      { name: string; email: string; avatar: string }
    >();
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

  const [selectedClientName, setSelectedClientName] =
    useState("Jordan Stevenson");

  const selectedClient = useMemo(() => {
    return (
      availableClients.find(
        (c) => c.name.toLowerCase() === selectedClientName.toLowerCase(),
      ) || availableClients[0]
    );
  }, [availableClients, selectedClientName]);

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "item-1",
      item: "Web Design",
      description: "Customization & Bug Fixes",
      cost: 24,
      hours: 1,
      discount: "0%",
    },
  ]);

  const [tax, setTax] = useState<number>(0);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, it) => sum + (Number(it.cost) || 0) * (Number(it.hours) || 0),
      0,
    );
  }, [items]);

  const itemsDiscountTotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const base = (Number(it.cost) || 0) * (Number(it.hours) || 0);
      const disc = parseFloat(String(it.discount || "0").replace("%", "")) || 0;
      return sum + (base * disc) / 100;
    }, 0);
  }, [items]);

  const totalDiscount = itemsDiscountTotal + additionalDiscount;
  const total = Math.max(0, subtotal - totalDiscount + tax);

  const [salesperson, setSalesperson] = useState("Tommy Shelby");
  const [thanksMessage, setThanksMessage] = useState(
    "Thanks for your business",
  );
  const [noteText, setNoteText] = useState("Thank You !");

  const [paymentMethod, setPaymentMethod] = useState("Internet Banking");
  const [paymentTermsActive, setPaymentTermsActive] = useState(true);
  const [clientNotesActive, setClientNotesActive] = useState(false);
  const [paymentStubActive, setPaymentStubActive] = useState(false);
  const [successToast, setSuccessToast] = useState("");

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
    const rawNumber =
      (invoiceNumber || nextGeneratedId).replace(/[^0-9]/g, "").trim() ||
      nextGeneratedId;
    const client = selectedClient || availableClients[0];
    const finalTotal = Number(total.toFixed(2));

    const newInvoice: Partial<Invoice> = {
      id: rawNumber,
      invoiceNumber: `#${rawNumber}`,
      clientId: `c-${rawNumber}`,
      clientName: client.name,
      clientEmail: client.email,
      clientAvatar: client.avatar || "member1",
      total: finalTotal,
      paidAmount: 0,
      balance: finalTotal,
      status: "Pending",
      issueDate: issueDate || todayFormatted,
      dueDate: dueDate || dueDateFormatted,
    };

    createMutation.mutate(newInvoice, {
      onSuccess: () => {
        setSuccessToast(
          andSend
            ? `Invoice #${rawNumber} saved and sent to ${client.email}!`
            : `Invoice #${rawNumber} saved successfully!`,
        );
        setTimeout(() => {
          navigate("/apps/invoice/list");
        }, 1200);
      },
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to create invoice";
        alert(msg);
      },
    });
  };

  return (
    <div className="w-full max-w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-w-0 pb-12">
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#e8fadf] text-[#71dd37] border border-[#71dd37]/40 px-4 py-3 rounded-md shadow-lg text-fs17 font-medium flex items-center gap-2 animate-in fade-in">
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
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex-1 min-w-0 w-full max-w-full bg-white rounded-lg shadow-[0_2px_8px_rgba(47,43,61,0.06)] border border-[#dbdade]/70 p-5 sm:p-7 lg:p-8 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 min-w-0">
          <div className="text-fs17 text-[#6f6b7d] leading-relaxed">
            <p>450 south Brand Brooklyn</p>
            <p>San Diego Country,CA 91905,USA</p>
            <p>+1 (123) 456 789, 123465432456</p>
          </div>

          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs17 font-semibold text-[#32475c] w-28 sm:text-right">
                Invoice
              </span>
              <CustomInput
                type="text"
                value={invoiceNumber || `# ${nextGeneratedId}`}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                sizeVariant="sm"
                containerClassName="w-48 sm:w-56"
                className="rounded-[6px] !px-3"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs16 text-[#6f6b7d] w-28 sm:text-right">
                Data Issued:
              </span>
              <CustomInput
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                sizeVariant="sm"
                containerClassName="w-48 sm:w-56"
                className="rounded-[6px] !px-3"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-fs16 text-[#6f6b7d] w-28 sm:text-right">
                Data Due:
              </span>
              <CustomInput
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                sizeVariant="sm"
                containerClassName="w-48 sm:w-56"
                className="rounded-[6px] !px-3"
              />
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-[#dbdade]/50" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-fs17 font-semibold text-[#5d596c] mb-3">
              Invoice To:
            </h3>
            <div className="w-full max-w-xs space-y-2">
              <CustomDropdown
                value={selectedClientName}
                onChange={(val) => setSelectedClientName(String(val))}
                sizeVariant="md"
                options={availableClients.map((c) => ({
                  label: c.name,
                  value: c.name,
                }))}
              />
              {selectedClient && (
                <div className="text-fs15 text-[#6f6b7d] leading-relaxed pt-1">
                  <p className="font-semibold text-[#5d596c]">{selectedClient.name}</p>
                  <p>{selectedClient.email}</p>
                  <p>San Diego Country, CA 91905, USA</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-fs17 font-semibold text-[#5d596c] mb-3">
              Bill To:
            </h3>
            <div className="space-y-1.5 text-fs16 text-[#6f6b7d]">
              <div className="flex">
                <span className="w-28 text-[#6f6b7d]">Total Due :</span>
                <span className="font-medium text-[#5d596c]">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

        <div className="my-8 border-t border-[#dbdade]/50" />

        <div>
          <div className="grid grid-cols-12 gap-3 text-fs15 font-semibold text-[#5d596c] mb-2 px-1">
            <div className="col-span-12 sm:col-span-5">Item</div>
            <div className="col-span-4 sm:col-span-2">Cost</div>
            <div className="col-span-4 sm:col-span-2">Hours</div>
            <div className="col-span-4 sm:col-span-3">Price</div>
          </div>

          <div className="space-y-4">
            {items.map((row) => {
              const itemCost = Number(row.cost) || 0;
              const itemHours = Number(row.hours) || 0;
              const basePrice = itemCost * itemHours;
              const discPercent = parseFloat(String(row.discount || "0").replace("%", "")) || 0;
              const rowPrice = Math.max(0, basePrice - (basePrice * discPercent) / 100).toFixed(2);

              return (
                <div
                  key={row.id}
                  className="border border-[#dbdade]/70 rounded-[6px] p-4 relative bg-white flex flex-col gap-3"
                >
                  <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                    <div className="col-span-12 sm:col-span-5 min-w-0">
                      <CustomDropdown
                        value={row.item}
                        onChange={(val) =>
                          handleUpdateItem(row.id, "item", String(val))
                        }
                        sizeVariant="sm"
                        options={[
                          { label: "App Development", value: "App Development" },
                          {
                            label: "Customization & Bug Fixes",
                            value: "Customization & Bug Fixes",
                          },
                          { label: "Web Design", value: "Web Design" },
                          {
                            label: "Template Design",
                            value: "Template Design",
                          },
                          {
                            label: "SEO Optimization",
                            value: "SEO Optimization",
                          },
                        ]}
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2 min-w-0">
                      <CustomInput
                        type="number"
                        min="0"
                        value={row.cost}
                        onChange={(e) =>
                          handleUpdateItem(
                            row.id,
                            "cost",
                            Number(e.target.value),
                          )
                        }
                        sizeVariant="sm"
                        containerClassName="w-full min-w-0"
                        className="rounded-[6px] !px-2 sm:!px-3 text-center sm:text-left"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2 min-w-0">
                      <CustomInput
                        type="number"
                        min="1"
                        value={row.hours}
                        onChange={(e) =>
                          handleUpdateItem(
                            row.id,
                            "hours",
                            Number(e.target.value),
                          )
                        }
                        sizeVariant="sm"
                        containerClassName="w-full min-w-0"
                        className="rounded-[6px] !px-2 sm:!px-3 text-center sm:text-left"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3 min-w-0 text-fs17 font-medium text-[#5d596c] flex items-center justify-between">
                      <span>${rowPrice}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center pt-1">
                    <div className="col-span-12 sm:col-span-5">
                      <textarea
                        rows={2}
                        value={row.description}
                        onChange={(e) =>
                          handleUpdateItem(
                            row.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Description..."
                        className="w-full p-2.5 border border-[#dbdade] rounded-[6px] text-fs16 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-7 flex items-center gap-2 text-fs16 text-[#6f6b7d]">
                      <span>Discount:</span>
                      <CustomDropdown
                        value={row.discount || "0%"}
                        onChange={(val) =>
                          handleUpdateItem(row.id, "discount", String(val))
                        }
                        sizeVariant="sm"
                        containerClassName="w-24"
                        options={[
                          { label: "0%", value: "0%" },
                          { label: "5%", value: "5%" },
                          { label: "10%", value: "10%" },
                          { label: "15%", value: "15%" },
                          { label: "20%", value: "20%" },
                        ]}
                      />
                    </div>
                  </div>

                  {items.length > 1 && (
                    <CustomButton
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveItem(row.id)}
                      className="!p-1 !h-auto absolute top-2 right-2 text-[#a5a3ae] hover:text-[#ff4c51] transition cursor-pointer"
                      title="Remove item"
                    >
                      <svg
                        className="w-4 h-4"
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
              );
            })}
          </div>

          <div className="mt-4">
            <CustomButton
              type="button"
              variant="primary"
              onClick={handleAddItem}
              className="!h-8 px-4 text-fs15 font-medium bg-[#696cff] hover:bg-[#5f61e6] text-white rounded-[6px] shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>ADD ITEM</span>
            </CustomButton>
          </div>
        </div>

        <div className="my-8 border-t border-[#dbdade]/50" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-fs16 font-medium text-[#5d596c] w-24">
                Invoice To:
              </span>
              <CustomInput
                type="text"
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                placeholder="Salesperson"
                sizeVariant="sm"
                containerClassName="w-56"
                className="rounded-[6px] !px-3"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0" />
              <CustomInput
                type="text"
                value={thanksMessage}
                onChange={(e) => setThanksMessage(e.target.value)}
                placeholder="Customer message"
                sizeVariant="sm"
                containerClassName="w-56"
                className="rounded-[6px] !px-3"
              />
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2.5 text-fs16 text-[#6f6b7d]">
            <div className="flex justify-between items-center py-0.5">
              <span>Subtotal:</span>
              <span className="font-medium text-[#5d596c]">
                ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Discount:</span>
              <div className="flex items-center gap-1">
                <span className="text-[#5d596c]">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={additionalDiscount || (itemsDiscountTotal > 0 ? itemsDiscountTotal : 0)}
                  onChange={(e) => setAdditionalDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 px-2 py-0.5 text-right border border-[#dbdade] rounded text-fs15 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white font-medium"
                />
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Tax:</span>
              <div className="flex items-center gap-1">
                <span className="text-[#5d596c]">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 px-2 py-0.5 text-right border border-[#dbdade] rounded text-fs15 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white font-medium"
                />
              </div>
            </div>
            <div className="flex justify-between items-center py-1 text-fs18 font-semibold text-[#5d596c] border-t border-[#dbdade]/50 pt-2">
              <span>Total:</span>
              <span className="text-[#5d596c]">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-[#dbdade]/50" />

        <div>
          <h4 className="text-fs16 font-semibold text-[#5d596c] mb-2">Note:</h4>
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-3 border border-[#dbdade] rounded-[6px] text-fs17 text-[#5d596c] focus:outline-none focus:border-[#696cff] bg-white"
          />
        </div>
      </div>

      <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
        <div className="space-y-3">
          <CustomButton
            type="button"
            variant="primary"
            disabled={createMutation.isPending}
            onClick={() => handleSaveInvoice(true)}
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
            <span>
              {createMutation.isPending ? "SENDING..." : "SEND INVOICE"}
            </span>
          </CustomButton>

          <CustomButton
            type="button"
            variant="outline"
            onClick={() => navigate("/apps/invoice/preview")}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
          >
            <span>PREVIEW</span>
          </CustomButton>

          <CustomButton
            type="button"
            variant="outline"
            disabled={createMutation.isPending}
            onClick={() => handleSaveInvoice(false)}
            className="w-full !h-11 px-6 rounded-[6px] font-medium text-fs17 bg-white border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f8f7fa] flex items-center justify-center cursor-pointer uppercase tracking-wider"
          >
            <span>{createMutation.isPending ? "SAVING..." : "SAVE"}</span>
          </CustomButton>
        </div>

        <div className="pt-2">
          <CustomDropdown
            label="Accept payment via"
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(String(val))}
            sizeVariant="md"
            options={[
              { label: "Internet Banking", value: "Internet Banking" },
              { label: "Bank Transfer", value: "Bank Transfer" },
              { label: "Credit Card", value: "Credit Card" },
              { label: "Paypal", value: "Paypal" },
            ]}
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-fs17 text-[#6f6b7d]">Payment Terms</span>
            <CustomButton
              type="button"
              variant="ghost"
              role="switch"
              aria-checked={paymentTermsActive}
              onClick={() => setPaymentTermsActive(!paymentTermsActive)}
              className={`!p-0 !h-5 !w-9 relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                paymentTermsActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  paymentTermsActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </CustomButton>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-fs17 text-[#6f6b7d]">Client Notes</span>
            <CustomButton
              type="button"
              variant="ghost"
              role="switch"
              aria-checked={clientNotesActive}
              onClick={() => setClientNotesActive(!clientNotesActive)}
              className={`!p-0 !h-5 !w-9 relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                clientNotesActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  clientNotesActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </CustomButton>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-fs17 text-[#6f6b7d]">Payment Stub</span>
            <CustomButton
              type="button"
              variant="ghost"
              role="switch"
              aria-checked={paymentStubActive}
              onClick={() => setPaymentStubActive(!paymentStubActive)}
              className={`!p-0 !h-5 !w-9 relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                paymentStubActive ? "bg-[#696cff]" : "bg-[#dbdade]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  paymentStubActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceAddPage;
