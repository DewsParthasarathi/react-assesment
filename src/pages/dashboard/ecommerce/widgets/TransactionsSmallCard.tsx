import React from "react";
import type { EcommerceMetricSmall } from "../../../../api/types";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";

interface TransactionsSmallCardProps {
  data?: EcommerceMetricSmall;
  availableYears?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
}

export const TransactionsSmallCard: React.FC<TransactionsSmallCardProps> = ({
  data,
  availableYears = ["2023", "2022"],
  selectedYear = "2023",
  onSelectYear,
}) => {
  const title = data?.title || "Transactions";
  const value = data?.value || "$14,854";
  const growth = data?.growth || "17.53%";
  const isUp = data?.growthDirection !== "down";

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[6px] bg-[#eae8fd] flex items-center justify-center text-[#696cff]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2.5" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <rect x="5" y="13.5" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={onSelectYear || (() => {})}
          availableYears={availableYears}
        >
          <button
            type="button"
            className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
            aria-label="Transactions options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </YearSelectionPopup>
      </div>

      <div className="mt-3">
        <span className="text-fs14 font-medium text-[#6f6b7d]">{title}</span>
        <div className="text-fs22 font-bold text-[#444050] mt-0.5 leading-tight">
          {value}
        </div>
        <div
          className={`text-fs12 font-medium flex items-center gap-1 mt-1.5 ${
            isUp ? "text-[#71dd37]" : "text-[#ea5455]"
          }`}
        >
          <span>{isUp ? "↑" : "↓"}</span>
          <span>{growth}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsSmallCard;
