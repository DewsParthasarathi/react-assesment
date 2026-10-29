import React from "react";
import type { EcommerceProfitTarget } from "../../../../api/types";

interface ProfitTargetCardProps {
  data?: EcommerceProfitTarget;
}

export const ProfitTargetCard: React.FC<ProfitTargetCardProps> = ({ data }) => {
  const title = data?.title || "Profit";
  const value = data?.value || "482K";
  const growth = data?.growth || "+34%";
  const targetLabel = data?.targetLabel || "Sales Target";
  const targetPercentage = data?.targetPercentage ?? 78;

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full min-h-[160px]">
      <div>
        <div>
          <span className="text-fs14 font-medium text-[#6f6b7d]">{title}</span>
          <div className="text-fs22 font-bold text-[#444050] mt-0.5 leading-tight">
            {value}
          </div>
        </div>

        <span className="bg-[#d9f8fc] text-[#03c3ec] text-fs11 font-semibold px-2 py-0.5 rounded-[4px] inline-block mt-2">
          {growth}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-fs12 text-[#a5a3ae] block mb-2">
          {targetLabel}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-[#f1f0f2] overflow-hidden">
            <div
              className="h-full bg-[#03c3ec] rounded-full transition-all duration-500"
              style={{ width: `${targetPercentage}%` }}
            />
          </div>
          <span className="text-fs11 text-[#a5a3ae] shrink-0 font-medium">
            {targetPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfitTargetCard;
