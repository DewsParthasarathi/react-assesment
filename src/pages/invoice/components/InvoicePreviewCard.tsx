import React from "react";
import { CustomTable, type TableColumn } from "../../../components/ui/Table";
import type { Invoice } from "../../../api/types";

interface InvoicePreviewCardProps {
  invoice: Invoice;
  cardRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const InvoicePreviewCard: React.FC<InvoicePreviewCardProps> = ({
  invoice,
  cardRef,
  className = "",
}) => {
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
        "py-3.5 pr-4 font-bold text-fs15 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 pr-4 font-medium text-[#5d596c] whitespace-nowrap",
      render: (row) => row.item,
    },
    {
      id: "description",
      header: "DESCRIPTION",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs15 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap print:whitespace-normal",
      render: (row) => row.description,
    },
    {
      id: "hours",
      header: "HOURS",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs15 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap",
      render: (row) => row.hours,
    },
    {
      id: "qty",
      header: "QTY",
      headerClassName:
        "py-3.5 px-4 font-bold text-fs15 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 px-4 whitespace-nowrap",
      render: (row) => row.qty,
    },
    {
      id: "total",
      header: "TOTAL",
      headerClassName:
        "py-3.5 pl-4 font-bold text-fs15 text-[#5d596c] uppercase tracking-wider",
      className: "py-4 pl-4 whitespace-nowrap font-medium text-[#5d596c]",
      render: (row) => row.total,
    },
  ];

  const totalAmount = invoice.total != null ? Number(invoice.total) : 204.25;
  const taxAmount = 50.0;
  const subtotalAmount = totalAmount > taxAmount ? totalAmount - taxAmount : totalAmount;

  return (
    <div
      ref={cardRef}
      className={`flex-1 min-w-0 w-full max-w-full bg-white rounded-lg shadow-[0_2px_8px_rgba(47,43,61,0.06)] border border-[#dbdade]/70 p-5 sm:p-7 lg:p-8 flex flex-col print:border-none print:shadow-none print:rounded-none print:p-0 ${className}`}
    >
      <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-4 sm:gap-6 min-w-0">
        <div className="text-fs17 text-[#6f6b7d] leading-relaxed">
          <p>450 south Brand Brooklyn</p>
          <p>San Diego Country,CA 91905,USA</p>
          <p>+1 (123) 456 789, 123465432456</p>
        </div>

        <div className="text-left sm:text-right print:text-right space-y-1">
          <h1 className="text-fs25 font-bold text-[#32475c] tracking-tight">
            Invoice #{invoice.invoiceNumber ? invoice.invoiceNumber.replace("#", "") : "4987"}
          </h1>
          <p className="text-fs16 text-[#6f6b7d]">
            <span className="font-normal">Data Issued:</span>{" "}
            <span className="font-medium text-[#5d596c] ml-2">
              {invoice.issueDate || "13 Jan 2023"}
            </span>
          </p>
          <p className="text-fs16 text-[#6f6b7d]">
            <span className="font-normal">Data Due:</span>{" "}
            <span className="font-medium text-[#5d596c] ml-4">
              {invoice.dueDate || "23 Jan 2023"}
            </span>
          </p>
        </div>
      </div>

      <div className="my-8 border-t border-[#dbdade]/50" />

      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-fs17 font-semibold text-[#5d596c] mb-3">
            Invoice To:
          </h3>
          <p className="text-fs16 text-[#6f6b7d] leading-relaxed">
            <span className="font-semibold text-[#5d596c]">{invoice.clientName || "Shelby Company Limited"}</span>
            <br />
            {invoice.clientEmail || "don85@johnson.com"}
            <br />
            San Diego Country, CA 91905, USA
          </p>
        </div>

        <div>
          <h3 className="text-fs17 font-semibold text-[#5d596c] mb-3">
            Bill To:
          </h3>
          <div className="space-y-1.5 text-fs16 text-[#6f6b7d]">
            <div className="flex">
              <span className="w-28 text-[#6f6b7d]">Total Due :</span>
              <span className="font-medium text-[#5d596c]">
                ${invoice.balance != null ? Number(invoice.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "12,110.55"}
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

      <div className="mt-8 overflow-x-auto print:overflow-visible">
        <CustomTable
          columns={itemColumns}
          data={items}
          keyExtractor={(_, idx) => idx}
          className="w-full overflow-x-auto print:overflow-visible"
          tableClassName="w-full text-left border-collapse text-fs17"
          headerRowClassName="border-y border-[#dbdade]/70 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider"
          bodyClassName="divide-y divide-[#dbdade]/40 text-fs16 text-[#6f6b7d]"
          bodyRowClassName="hover:bg-[#fafafb]/60 transition-colors"
        />
      </div>

      <div className="mt-6 pt-4 flex flex-col sm:flex-row print:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <p className="text-fs17 font-medium text-[#5d596c]">
            <span className="font-semibold text-[#5d596c]">Salesperson:</span>{" "}
            Tommy Shelby
          </p>
          <p className="text-fs16 text-[#a5a3ae]">Thanks for your business</p>
        </div>

        <div className="w-full sm:w-60 print:w-60 space-y-2 text-fs17 text-[#6f6b7d]">
          <div className="flex justify-between py-0.5">
            <span>Subtotal:</span>
            <span className="font-medium text-[#5d596c]">
              ${subtotalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Discount:</span>
            <span className="font-medium text-[#5d596c]">$00.00</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Tax:</span>
            <span className="font-medium text-[#5d596c]">
              ${taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1 text-fs18 font-semibold text-[#5d596c]">
            <span>Total:</span>
            <span className="text-[#5d596c]">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#dbdade]/60 text-fs16 text-[#6f6b7d] leading-relaxed">
        <p>
          <span className="font-semibold text-[#5d596c]">Note:</span> It was a
          pleasure working with you and your team.we hope you will keep us in
          mind for future freelance project.
        </p>
        <p className="mt-1">Thank You !</p>
      </div>
    </div>
  );
};

export default InvoicePreviewCard;

