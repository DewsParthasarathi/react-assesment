import React from "react";
import paypalIcon from "../../../assets/images/Paypal.svg";
import walletIcon from "../../../assets/images/wallet.svg";
import transferIcon from "../../../assets/images/Transfer.svg";
import creditCardIcon from "../../../assets/images/Credit Card.svg";
import mastercardIcon from "../../../assets/images/Master card.svg";

interface TransactionItem {
  id: number;
  type: string;
  description: string;
  amount: string;
  currency: string;
  icon: string;
  bg: string;
  isNegative?: boolean;
}

export const TransactionsCard: React.FC = () => {
  const transactions: TransactionItem[] = [
    {
      id: 1,
      type: "Paypal",
      description: "send money",
      amount: "+82.6",
      currency: "USD",
      icon: paypalIcon,
      bg: "bg-[#ea5455]/15",
    },
    {
      id: 2,
      type: "wallet",
      description: "Mac'D",
      amount: "+270.69",
      currency: "USD",
      icon: walletIcon,
      bg: "bg-[#696cff]/15",
    },
    {
      id: 3,
      type: "Transfer",
      description: "refund",
      amount: "+637.91",
      currency: "USD",
      icon: transferIcon,
      bg: "bg-[#03c3ec]/15",
    },
    {
      id: 4,
      type: "Credit Card",
      description: "Ordered food",
      amount: "-838.71",
      currency: "USD",
      icon: creditCardIcon,
      bg: "bg-[#71dd37]/15",
      isNegative: true,
    },
    {
      id: 5,
      type: "wallet",
      description: "Starbucks",
      amount: "+203.33",
      currency: "USD",
      icon: walletIcon,
      bg: "bg-[#696cff]/15",
    },
    {
      id: 6,
      type: "mastercard",
      description: "Ordered food",
      amount: "+203.33",
      currency: "USD",
      icon: mastercardIcon,
      bg: "bg-[#ffab00]/15",
    },
  ];

  return (
    <div className="bg-white rounded-[5px] p-6 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-fs16 font-semibold text-[#32475c]">Transactions</h3>
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

      {/* Transaction Rows */}
      <div className="space-y-4 my-auto pt-3">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${t.bg} flex items-center justify-center p-2 shrink-0`}
              >
                <img
                  src={t.icon}
                  alt={t.type}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-fs14 font-semibold text-[#32475c] leading-tight">
                  {t.type}
                </p>
                <p className="text-fs12 text-[#a5a3ae] leading-tight mt-0.5">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-fs14 font-bold text-[#32475c]">
                {t.amount}
              </span>
              <span className="text-fs12 text-[#a5a3ae] ml-1 uppercase">
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
