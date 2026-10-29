import React from "react";
import { Table, type TableColumn } from "../../../../components/ui/Table";
import type { EcommerceProduct } from "../../../../api/types";

interface ProductTransactionsTableCardProps {
  products?: EcommerceProduct[];
}

/**
 * Dedicated, recognizable product SVGs styled within circular badges
 * matching the reference screenshot exactly.
 */
const ProductIcon: React.FC<{ name: string; brand: string }> = ({
  name,
  brand,
}) => {
  const normalized = `${name} ${brand}`.toLowerCase();

  // 1. OnePlus 7 Pro
  if (normalized.includes("oneplus")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#32475c] flex items-center justify-center shrink-0 shadow-xs">
        <svg
          className="w-4.5 h-4.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2.5" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
          <line x1="10" y1="5" x2="14" y2="5" />
        </svg>
      </div>
    );
  }

  // 2. Apple Magic Mouse
  if (normalized.includes("mouse") && normalized.includes("apple")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#eef0f3] flex items-center justify-center shrink-0 shadow-xs border border-[#dbdade]/50">
        <svg
          className="w-4.5 h-4.5 text-[#444050]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C8.686 2 6 5.582 6 10v4c0 4.418 2.686 8 6 8s6-3.582 6-8v-4c0-4.418-2.686-8-6-8zm-0.75 3.5c0-.414.336-.75.75-.75s.75.336.75.75v3.5a.75.75 0 01-1.5 0v-3.5z" />
        </svg>
      </div>
    );
  }

  // 3. iMac Pro
  if (normalized.includes("imac")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#282a36] flex items-center justify-center shrink-0 shadow-xs">
        <svg
          className="w-4.5 h-4.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="13" rx="2" />
          <path d="M8 21h8m-4-5v5" />
        </svg>
      </div>
    );
  }

  // 4. Samsung Galaxy Note 10
  if (normalized.includes("note")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 shadow-xs">
        <svg
          className="w-4.5 h-4.5 text-[#38bdf8]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <circle cx="12" cy="5" r="0.75" fill="currentColor" />
          <line x1="9" y1="19" x2="15" y2="19" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 5. iPhone 11 Pro
  if (normalized.includes("iphone")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#fce7e7] flex items-center justify-center shrink-0 shadow-xs border border-[#ffccd5]/50">
        <svg
          className="w-4.5 h-4.5 text-[#ea5455]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <circle cx="9.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </div>
    );
  }

  // 6. Mi LED TV 4X
  if (normalized.includes("tv")) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center shrink-0 shadow-xs">
        <svg
          className="w-4.5 h-4.5 text-[#ffab00]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="12" rx="1.5" />
          <polyline points="7 20 9 17 15 17 17 20" />
        </svg>
      </div>
    );
  }

  // 7. Logitech MX Master
  return (
    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center shrink-0 shadow-xs">
      <svg
        className="w-4.5 h-4.5 text-[#71dd37]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0-6 6v6a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6z" />
        <line x1="12" y1="7" x2="12" y2="11" strokeWidth="2.5" />
      </svg>
    </div>
  );
};

export const ProductTransactionsTableCard: React.FC<
  ProductTransactionsTableCardProps
> = ({ products = [] }) => {
  const columns: TableColumn<EcommerceProduct>[] = [
    {
      id: "product",
      header: "PRODUCT",
      render: (product) => (
        <div className="flex items-center gap-2.5">
          <ProductIcon name={product.name} brand={product.brand} />
          <div>
            <span className="text-fs13 font-semibold text-[#444050] block leading-tight">
              {product.name}
            </span>
            <span className="text-fs11 text-[#a5a3ae] block leading-tight mt-0.5">
              {product.brand}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "CATEGORY",
      render: (product) => (
        <span className="text-fs13 text-[#6f6b7d] capitalize">
          {product.category}
        </span>
      ),
    },
    {
      id: "payment",
      header: "PAYMENT",
      render: (product) => (
        <div>
          <div className="flex items-center gap-1 leading-tight">
            <span className="text-fs13 font-semibold text-[#696cff]">
              {product.paidAmount}
            </span>
            {product.totalAmount !== product.paidAmount && (
              <span className="text-fs11 text-[#a5a3ae]">
                / {product.totalAmount}
              </span>
            )}
          </div>
          <span className="text-fs11 text-[#a5a3ae] block leading-tight mt-0.5 capitalize">
            {product.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      id: "orderStatus",
      header: "ORDER STATUS",
      render: (product) => (
        <span
          className={`text-fs11 font-medium uppercase px-2 py-0.5 rounded-[4px] tracking-wide inline-block ${
            product.statusBadgeColor || "bg-[#e8fadf] text-[#71dd37]"
          }`}
        >
          {product.orderStatus}
        </span>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      align: "center",
      render: () => (
        <button
          type="button"
          className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
          aria-label="Product actions"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 h-full overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={products}
          keyExtractor={(item) => item.id}
          className="w-full"
          tableClassName="w-full text-left"
          headerRowClassName="border-b border-[#dbdade]/50 text-fs12 text-[#a5a3ae] font-semibold uppercase tracking-wider bg-transparent [&>th]:px-4 [&>th]:py-2.5"
          bodyRowClassName="border-b border-[#dbdade]/25 hover:bg-[#f8f7fa] transition [&>td]:px-4 [&>td]:py-1.5"
        />
      </div>
    </div>
  );
};

export default ProductTransactionsTableCard;
