import React from "react";
import type { EcommerceReport } from "../../../../api/types";
import paypalIcon from "../../../../assets/images/Paypal.svg";
import { CustomButton } from "../../../../components/ui/CustomButton";
import { CustomImage } from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";

interface ReportCardProps {
  data?: EcommerceReport;
  availableYears?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
  isInsideSharedContainer?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  data,
  availableYears = ["2023", "2022"],
  selectedYear = "2023",
  onSelectYear,
  isInsideSharedContainer = false,
}) => {
  const title = data?.title || "Report";
  const subtitle = data?.subtitle || "Monthly Avg $45,578k";
  const items = data?.items || [
    {
      label: "Income",
      amount: "$42,845",
      change: "+2.7k",
      changeType: "positive" as const,
      type: "income" as const,
    },
    {
      label: "Expense",
      amount: "$38,658",
      change: "-1.15k",
      changeType: "negative" as const,
      type: "expense" as const,
    },
    {
      label: "Profit",
      amount: "$18,220",
      change: "+1.34k",
      changeType: "positive" as const,
      type: "profit" as const,
    },
  ];

  const containerClass = isInsideSharedContainer
    ? "p-4 flex flex-col justify-between h-full"
    : "bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full";

  return (
    <div className={containerClass}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-fs19 font-bold text-[#444050] tracking-tight">
            {title}
          </h3>
          <p className="text-fs13 text-[#a5a3ae] mt-0.5">{subtitle}</p>
        </div>

        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={onSelectYear || (() => {})}
          availableYears={availableYears}
        >
          <CustomButton
            type="button"
            variant="ghost"
            className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
            aria-label="Report options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div className="space-y-2 my-auto pt-1">
        {items.map((item, idx) => {
          const isIncome = item.type === "income";
          const isExpense = item.type === "expense";
          const isProfit = item.type === "profit";

          const changeColor =
            item.changeType === "positive"
              ? "text-[#71dd37]"
              : "text-[#ea5455]";

          return (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#f8f7fa] rounded-[6px] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0">
                  {isIncome && (
                    <CustomImage
                      src={paypalIcon}
                      alt="Income PayPal"
                      containerClassName="w-4 h-4 shrink-0"
                      className="w-full h-full object-contain"
                    />
                  )}
                  {isExpense && (
                    <svg
                      className="w-4.5 h-3.5"
                      viewBox="0 0 25 18"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 3.28V16.81C0 17.46 0.53 18 1.24 18H23.41V12.67H18.84C18.12 12.67 17.43 12.39 16.92 11.9L16.88 11.86C16.36 11.36 16.13 10.7 16.13 9.79C16.13 9.1 16.42 8.44 16.93 7.96C17.44 7.47 18.13 7.19 18.84 7.19H23.41V3.8H1.47C0.93 3.8 0.41 3.61 0 3.28ZM23.81 7.97H25V11.89H18.84C18.34 11.89 17.85 11.7 17.5 11.36C17.14 11.02 16.94 10.56 16.94 9.79C16.94 9.31 17.14 8.84 17.5 8.5C17.86 8.16 18.34 7.97 18.85 7.97H23.81ZM19.17 10.27C18.96 10.23 18.81 10.03 18.85 9.82C18.89 9.61 19.1 9.47 19.32 9.51C19.54 9.55 19.69 9.75 19.65 9.96C19.61 10.17 19.4 10.31 19.18 10.27Z"
                        fill="#696cff"
                      />
                    </svg>
                  )}
                  {isProfit && (
                    <span className="text-fs17 font-bold text-[#71dd37] leading-none">
                      $
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-fs13 text-[#a5a3ae] block leading-none capitalize">
                    {item.label}
                  </span>
                  <span className="text-fs16 font-bold text-[#444050] block mt-1.5 leading-none">
                    {item.amount}
                  </span>
                </div>
              </div>

              <span className={`text-fs13 font-medium ${changeColor}`}>
                {item.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportCard;
