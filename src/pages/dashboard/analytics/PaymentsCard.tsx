import React, { useState } from "react";
import paypalIcon from "../../../assets/images/Paypal.svg";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomImage } from "../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../components/ui/YearSelectionPopup";

interface PaymentsCardProps {
  value?: string;
  change?: string;
  changeDirection?: "up" | "down";
  years?: Record<
    string,
    { value: string; change?: string; changeDirection?: "up" | "down" }
  >;
  availableYears?: string[];
}

export const PaymentsCard: React.FC<PaymentsCardProps> = ({
  value = "$4,679",
  change = "14.82%",
  changeDirection = "down",
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const active =
    years && years[selectedYear]
      ? years[selectedYear]
      : { value, change, changeDirection };
  const displayValue = active.value ?? value;
  const displayChange = active.change ?? change;
  const isUp =
    (active.changeDirection ?? changeDirection) === "up" ||
    (!displayChange.startsWith("-") && displayChange.startsWith("+"));

  return (
    <div className="bg-white rounded-[6px] p-4 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      <div className="flex items-center justify-between w-full">
        <div className="w-10 h-10 rounded-lg bg-[#ea5455]/15 flex items-center justify-center p-2.5 shrink-0">
          <CustomImage
            src={paypalIcon}
            alt="Payments"
            containerClassName="w-full h-full shrink-0"
            className="w-full h-full object-contain"
          />
        </div>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
          className="shrink-0"
        >
          <CustomButton
            type="button"
            variant="icon"
            aria-label="Options"
            className="!p-0 !h-auto !w-auto text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div>
        <p className="text-fs18 font-medium text-[#a5a3ae]">Payments</p>
        <p className="text-fs25 font-bold text-[#444050] mt-0.5">
          {displayValue}
        </p>
        <p
          className={`text-fs14 font-medium mt-2 flex items-center gap-1 ${
            isUp ? "text-[#71dd37]" : "text-[#ea5455]"
          }`}
        >
          <span>{isUp ? "↑" : "↓"}</span>
          <span>{displayChange.replace(/^[+-]/, "")}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentsCard;
