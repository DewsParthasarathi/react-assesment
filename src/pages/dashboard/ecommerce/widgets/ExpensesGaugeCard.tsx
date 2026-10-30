import React from "react";
import type { EcommerceExpensesGauge } from "../../../../api/types";

interface ExpensesGaugeCardProps {
  data?: EcommerceExpensesGauge;
}

export const ExpensesGaugeCard: React.FC<ExpensesGaugeCardProps> = ({
  data,
}) => {
  const title = data?.title || "Expenses";
  const percentage = data?.percentage ?? 72;
  const comparisonText =
    data?.comparisonText || "$2k expenses more than last month";

  const arcRadius = 46;
  const arcLength = Math.PI * arcRadius;
  const normalizedPercent = Math.min(100, Math.max(0, percentage));

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full">
      <div>
        <span className="text-fs14 font-medium text-[#6f6b7d]">{title}</span>
      </div>

      <div className="relative w-full flex items-center justify-center my-auto pt-1">
        <svg
          viewBox="0 0 120 70"
          className="w-[125px] h-[72px] overflow-visible"
        >
          <path
            d="M 14 62 A 46 46 0 0 1 106 62"
            fill="none"
            stroke="#f1f0f4"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 14 62 A 46 46 0 0 1 106 62"
            fill="none"
            stroke="#696cff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={arcLength * (1 - normalizedPercent / 100)}
            className="transition-all duration-700 ease-out"
          />
          <text
            x="60"
            y="57"
            textAnchor="middle"
            className="font-bold fill-[#444050] text-[21px]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {percentage}%
          </text>
        </svg>
      </div>

      <div className="text-center mt-1">
        <p className="text-fs12 text-[#a5a3ae] leading-snug">
          {comparisonText}
        </p>
      </div>
    </div>
  );
};

export default ExpensesGaugeCard;
