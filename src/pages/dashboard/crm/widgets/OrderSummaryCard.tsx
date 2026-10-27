import React, { useState } from "react";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { OrderData } from "../../../../api/types";
import orderIcon from "../../../../assets/images/Order.svg";
import moreIcon from "../../../../assets/images/More.svg";

interface OrderSummaryCardProps {
  data?: OrderData;
  availableYears?: string[];
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ data, availableYears = ["2023", "2022"] }) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-gray-200 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const activeData = data.years?.[selectedYear] || data;
  const amount = activeData.amount ?? data.amount;
  const change = activeData.change ?? data.change;
  const isPositive = activeData.isPositive ?? data.isPositive;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <div className="w-6 h-6 rounded-lg bg-[#f2f3f5] flex items-center justify-center">
          <CustomImage src={orderIcon} alt="Order" containerClassName="w-5 h-5" className="w-5 h-5 opacity-80" />
        </div>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
        >
          <CustomButton
            variant="icon"
            className="!p-1 text-[#a5a3ae] hover:text-[#5d596c]"
            aria-label="More options"
          >
            <CustomImage src={moreIcon} alt="more" containerClassName="w-1 h-4" className="w-1 h-4 opacity-70" />
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div className="mt-3">
        <p className="text-fs18 font-normal text-[#a5a3ae]">Order</p>
        <p className="text-fs24 font-semibold text-[#444050] mt-1">{amount}</p>
        <p
          className={`text-fs14 font-normal mt-1 flex items-center gap-1 ${
            isPositive ? "text-[#71dd37]" : "text-[#ea5455]"
          }`}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{change}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
