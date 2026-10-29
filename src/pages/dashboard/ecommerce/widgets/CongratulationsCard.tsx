import React from "react";
import trophyImg from "../../../../assets/images/trophy.png";
import type { EcommerceCongratulations } from "../../../../api/types";

interface CongratulationsCardProps {
  data?: EcommerceCongratulations;
}

export const CongratulationsCard: React.FC<CongratulationsCardProps> = ({ data }) => {
  const sellerName = data?.sellerName || "Katie!";
  const subtitle = data?.subtitle || "Best seller of the month";
  const salesValue = data?.salesValue || "$48.9k";

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex items-center justify-between relative overflow-hidden h-full min-h-[175px]">
      <div className="flex flex-col justify-between h-full z-10">
        <div>
          <h2 className="text-fs20 font-bold text-[#444050] tracking-tight">
            Congratulations {sellerName}
          </h2>
          <p className="text-fs13 text-[#a5a3ae] mt-1">
            {subtitle}
          </p>
        </div>
        <div className="mt-4">
          <span className="text-fs34 font-semibold text-[#696cff] leading-none">
            {salesValue}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-end justify-center self-end -mb-1 pr-1">
        <img
          src={trophyImg}
          alt="Trophy illustration"
          className="h-[105px] w-auto object-contain select-none pointer-events-none drop-shadow-sm"
        />
      </div>
    </div>
  );
};

export default CongratulationsCard;
