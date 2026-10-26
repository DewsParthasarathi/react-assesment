import React from "react";
import walletIcon from "../../../assets/images/wallet.svg";

interface SalesCardProps {
  value?: string;
  growth?: string;
}

export const SalesCard: React.FC<SalesCardProps> = ({
  value = "$4,679",
  growth = "28.14%",
}) => {
  return (
    <div className="bg-white rounded-[5px] p-5 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full ">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#03c3ec]/15 flex items-center justify-center p-2.5">
          <img
            src={walletIcon}
            alt="Wallet"
            className="w-full h-full object-contain"
          />
        </div>
        <button
          type="button"
          aria-label="Options"
          className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      <div>
        <p className="text-fs14 font-medium text-[#6f6b7d]">Sales</p>
        <p className="text-fs24 font-bold text-[#32475c] mt-1">{value}</p>
        <p className="text-fs13 font-semibold text-[#71dd37] mt-3 flex items-center gap-1">
          <span>↑</span>
          <span>{growth}</span>
        </p>
      </div>
    </div>
  );
};

export default SalesCard;
