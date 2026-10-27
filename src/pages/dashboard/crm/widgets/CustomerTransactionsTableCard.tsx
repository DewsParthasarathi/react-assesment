import React from "react";
import type { CustomerTransaction } from "../../../../api/types";
import { Table, type TableColumn } from "../../../../components/ui/Table";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import moreIcon from "../../../../assets/images/More.svg";
import mastercardIcon from "../../../../assets/images/Mastercard_2019_logo.png";
import visaIcon from "../../../../assets/images/Visa_Inc._logo.png";
import paypalIcon from "../../../../assets/images/Paypal.svg";
import member1 from "../../../../assets/images/member1.jpg";
import member2 from "../../../../assets/images/member2.jpg";
import member3 from "../../../../assets/images/member3.jpg";
import member4 from "../../../../assets/images/member4.jpg";
import member5 from "../../../../assets/images/member5.jpg";
import member6 from "../../../../assets/images/member6.jpg";

interface CustomerTransactionsTableCardProps {
  transactions?: CustomerTransaction[];
}

export const CustomerTransactionsTableCard: React.FC<CustomerTransactionsTableCardProps> = ({
  transactions,
}) => {
  if (!transactions) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = transactions;

  const getAvatar = (avatarName: string) => {
    switch (avatarName) {
      case "member1":
        return member1;
      case "member2":
        return member2;
      case "member3":
        return member3;
      case "member4":
        return member4;
      case "member5":
        return member5;
      case "member6":
      default:
        return member6;
    }
  };

  const getPaymentLogo = (method: string) => {
    switch (method.toLowerCase()) {
      case "mastercard":
        return mastercardIcon;
      case "visa":
        return visaIcon;
      case "paypal":
        return paypalIcon;
      default:
        return visaIcon;
    }
  };

  const columns: TableColumn<CustomerTransaction>[] = [
    {
      id: "customer",
      header: "CUSTOMER",
      headerClassName: "pb-2.5 font-medium text-fs12 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 align-middle",
      render: (tx) => (
        <div className="flex items-center gap-2.5">
          <CustomImage
            src={getAvatar(tx.avatar)}
            alt={tx.name}
            containerClassName="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full overflow-hidden shrink-0 flex items-center justify-center"
            className="w-full h-full object-cover block rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-fs14 font-semibold text-[#32475c] leading-snug">{tx.name}</p>
            <p className="text-fs12 text-[#a5a3ae] leading-tight">{tx.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      header: "AMOUNT",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs12 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center text-fs14 text-[#444050] font-medium align-middle",
      render: (tx) => tx.amount,
    },
    {
      id: "status",
      header: "STATUS",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs12 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center align-middle",
      render: (tx) => (
        <span
          className={`text-fs12 font-semibold px-2 py-0.5 rounded tracking-wide ${
            tx.statusColor || "bg-gray-100 text-gray-600"
          }`}
        >
          {tx.status}
        </span>
      ),
    },
    {
      id: "paidBy",
      header: "PAID BY",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs12 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center align-middle",
      render: (tx) => (
        <div className="inline-flex items-center justify-center h-full">
          <CustomImage
            src={getPaymentLogo(tx.paymentMethod)}
            alt={tx.paymentMethod}
            containerClassName="h-4 max-w-[34px] flex items-center justify-center shrink-0"
            className="object-contain max-h-4 max-w-[34px] block mx-auto"
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs12 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center align-middle",
      render: () => (
        <CustomButton
          variant="icon"
          className="!p-1 text-[#a5a3ae] hover:text-[#5d596c] mx-auto inline-flex items-center justify-center"
          aria-label="Transaction actions"
        >
          <CustomImage
            src={moreIcon}
            alt="more"
            containerClassName="w-1 h-3.5 flex items-center justify-center mx-auto"
            className="w-1 h-3.5 opacity-70 block"
          />
        </CustomButton>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      {/* Table using reusable Table component */}
      <Table
        columns={columns}
        data={items}
        keyExtractor={(tx) => tx.id}
        tableClassName="w-full text-left"
        headerRowClassName="border-b border-[#dbdade]/50 text-fs12 font-medium text-[#a5a3ae] uppercase tracking-wider"
        bodyClassName="divide-y divide-gray-50"
        bodyRowClassName="hover:bg-gray-50/50 transition-colors"
      />
    </div>
  );
};

export default CustomerTransactionsTableCard;
