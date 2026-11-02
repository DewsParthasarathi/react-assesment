import React from "react";
import type { InvoiceStatus } from "../../../api/types";

interface InvoiceStatusIconProps {
  status: InvoiceStatus;
}

export const InvoiceStatusIcon: React.FC<InvoiceStatusIconProps> = ({ status }) => {
  const norm = status.toLowerCase();

  if (norm === "paid") {
    return (
      <div
        title="Paid"
        className="w-7 h-7 rounded-full bg-[#e8fadf] text-[#71dd37] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (norm === "downloaded") {
    return (
      <div
        title="Downloaded"
        className="w-7 h-7 rounded-full bg-[#d2f4f8] text-[#03c3ec] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    );
  }

  if (norm === "pending") {
    return (
      <div
        title="Pending"
        className="w-7 h-7 rounded-full bg-[#e8fadf] text-[#71dd37] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  }

  if (norm === "draft") {
    return (
      <div
        title="Draft"
        className="w-7 h-7 rounded-full bg-[#ecebfd] text-[#696cff] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      </div>
    );
  }

  if (norm === "sent") {
    return (
      <div
        title="Sent"
        className="w-7 h-7 rounded-full bg-[#f0f0f2] text-[#8592a3] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
    );
  }

  if (norm === "overdue") {
    return (
      <div
        title="Overdue"
        className="w-7 h-7 rounded-full bg-[#ffe5e5] text-[#ff4c51] flex items-center justify-center shrink-0 shadow-2xs"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  }

  // Cancelled or other fallback
  return (
    <div
      title={status}
      className="w-7 h-7 rounded-full bg-[#f0f0f2] text-[#8592a3] flex items-center justify-center shrink-0 shadow-2xs"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
};

export default InvoiceStatusIcon;

