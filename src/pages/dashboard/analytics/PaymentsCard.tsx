import React from "react";
import paypalIcon from "../../../assets/images/Paypal.svg";

interface PaymentsCardProps {
  value?: string;
  change?: string;
}

export const PaymentsCard: React.FC<PaymentsCardProps> = ({
  value = "$4,679",
  change = "14.82%",
}) => {
  return (
    <div className="bg-white rounded-[5px] p-5 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full min-h-[190px]">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[5px] bg-[#ea5455]/15 flex items-center justify-center p-2.5">
          <img
            src={paypalIcon}
            alt="Payments"
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
        <p className="text-fs14 font-medium text-[#6f6b7d]">Payments</p>
        <p className="text-fs24 font-bold text-[#32475c] mt-0.5">{value}</p>
        <p className="text-fs13 font-semibold text-[#ea5455] mt-3 flex items-center gap-1">
          <span>↓</span>
          <span>{change.replace("-", "")}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentsCard;
