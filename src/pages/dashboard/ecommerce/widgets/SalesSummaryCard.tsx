import React from "react";
import type { EcommerceSalesSummary } from "../../../../api/types";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import { CustomButton } from "../../../../components/ui/CustomButton";

interface SalesSummaryCardProps {
  data?: EcommerceSalesSummary;
  availableYears?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
}

export const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({
  data,
  availableYears = ["2023", "2022"],
  selectedYear = "2023",
  onSelectYear,
}) => {
  const title = data?.title || "Sales";
  const value = data?.value || "$42,389";
  const growth = data?.growth || "28.14%";
  const isUp = data?.growthDirection !== "down";

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[6px] bg-[#d9f8fc] flex items-center justify-center text-[#03c3ec] font-bold text-fs21">
          $
        </div>

        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={onSelectYear || (() => {})}
          availableYears={availableYears}
        >
          <CustomButton
            type="button"
            variant="ghost"
            className="!p-1 !h-auto text-[#a5a3ae] hover:text-[#5d596c] rounded transition cursor-pointer"
            aria-label="Sales summary options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div className="mt-3">
        <span className="text-fs15 font-medium text-[#6f6b7d]">{title}</span>
        <div className="text-fs23 font-bold text-[#444050] mt-0.5 leading-tight">
          {value}
        </div>
        <div
          className={`text-fs13 font-medium flex items-center gap-1 mt-1.5 ${
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

export default SalesSummaryCard;
