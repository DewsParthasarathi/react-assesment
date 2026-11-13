import React, { useState } from "react";
import paypalIcon from "../../../assets/images/Paypal.svg";
import walletIcon from "../../../assets/images/wallet.svg";
import transferIcon from "../../../assets/images/Transfer.svg";
import creditCardIcon from "../../../assets/images/Credit Card.svg";
import mastercardIcon from "../../../assets/images/Master card.svg";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomImage } from "../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../components/ui/YearSelectionPopup";
import type { MemberTransaction } from "../../../api/types";

interface TransactionsCardProps {
  transactions?: MemberTransaction[];
  years?: Record<string, MemberTransaction[]>;
  availableYears?: string[];
}

export const TransactionsCard: React.FC<TransactionsCardProps> = ({
  transactions,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const defaultTransactions: MemberTransaction[] = [
    {
      id: 1,
      type: "Paypal",
      description: "send money",
      amount: "+82.6",
      currency: "USD",
      isCredit: true,
    },
    {
      id: 2,
      type: "wallet",
      description: "Mac'D",
      amount: "+270.69",
      currency: "USD",
      isCredit: true,
    },
    {
      id: 3,
      type: "Transfer",
      description: "refund",
      amount: "+637.91",
      currency: "USD",
      isCredit: true,
    },
    {
      id: 4,
      type: "Credit Card",
      description: "Ordered food",
      amount: "-838.71",
      currency: "USD",
      isCredit: false,
    },
    {
      id: 5,
      type: "wallet",
      description: "Starbucks",
      amount: "+203.33",
      currency: "USD",
      isCredit: true,
    },
    {
      id: 6,
      type: "mastercard",
      description: "Ordered food",
      amount: "+203.33",
      currency: "USD",
      isCredit: true,
    },
  ];

  const rawItems = (years && years[selectedYear]) ? years[selectedYear] : (transactions || defaultTransactions);

  const getTxMeta = (type: string) => {
    switch (type.toLowerCase()) {
      case "paypal":
        return { icon: paypalIcon, bg: "bg-[#ffe0db]" };
      case "wallet":
        return { icon: walletIcon, bg: "bg-[#e7e7ff]" };
      case "transfer":
        return { icon: transferIcon, bg: "bg-[#d2f4fa]" };
      case "credit card":
        return { icon: creditCardIcon, bg: "bg-[#e8fadf]" };
      case "mastercard":
      default:
        return { icon: mastercardIcon, bg: "bg-[#fff1d6]" };
    }
  };

  const items = rawItems.map((t) => {
    const meta = getTxMeta(t.type);
    const isNegative = t.amount.startsWith("-");
    return {
      ...t,
      ...meta,
      isNegative,
    };
  });

  return (
    <div className="bg-white rounded-[6px] p-4 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-fs19 font-semibold text-[#444050]">Transactions</h3>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
        >
          <CustomButton
            type="button"
            variant="ghost"
            aria-label="Options"
            className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div className="space-y-4 my-auto pt-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${t.bg} flex items-center justify-center p-2.5 shrink-0`}
              >
                <CustomImage
                  src={t.icon}
                  alt={t.type}
                  containerClassName="w-full h-full shrink-0"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-fs16 font-medium text-[#444050] leading-tight">
                  {t.type}
                </p>
                <p className="text-fs14 font-normal text-[#a5a3ae] leading-tight mt-1">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-fs16 font-medium text-[#444050]">
                {t.amount}
              </span>
              <span className="text-fs14 font-normal text-[#a5a3ae] ml-2 uppercase">
                {t.currency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsCard;
