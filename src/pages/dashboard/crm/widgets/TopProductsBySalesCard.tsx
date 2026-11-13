import React, { useState } from "react";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { TopProductSales } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";
import phoneIcon from "../../../../assets/images/phone2.svg";
import watchIcon from "../../../../assets/images/Smart watch.svg";
import laptopIcon from "../../../../assets/images/Laptop.svg";
import earphoneIcon from "../../../../assets/images/Earphone.svg";

interface TopProductsBySalesCardProps {
  products?: TopProductSales[];
  years?: Record<string, TopProductSales[]>;
  availableYears?: string[];
}

export const TopProductsBySalesCard: React.FC<TopProductsBySalesCardProps> = ({
  products,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const items = (years && years[selectedYear]) ? years[selectedYear] : products;

  if (!items) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case "phone2.svg":
      case "phone1.svg":
      case "phone3.svg":
        return phoneIcon;
      case "Smart watch.svg":
        return watchIcon;
      case "Laptop.svg":
      case "Imac.svg":
        return laptopIcon;
      case "Earphone.svg":
        return earphoneIcon;
      default:
        return phoneIcon;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-fs22 font-medium text-[#444050]">
          Top Products by <span className="text-[#696cff]">Sales</span>
        </h3>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
        >
          <CustomButton
            variant="icon"
            className="!p-1 text-[#a5a3ae] hover:text-[#5d596c]"
            aria-label="More options"
          >
            <CustomImage src={moreIcon} alt="more" containerClassName="w-1 h-4" className="w-1 h-4 opacity-70" />
          </CustomButton>
        </YearSelectionPopup>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg flex items-center justify-center shrink-0 ${
                  item.bg || "bg-gray-100"
                }`}
                style={{ width: "38px", height: "38px", minWidth: "38px" }}
              >
                <CustomImage
                  src={getProductIcon(item.icon)}
                  alt={item.name}
                  containerClassName="w-[22px] h-[22px] flex items-center justify-center shrink-0"
                  className="object-contain w-full h-full block"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-fs16 font-medium text-[#444050] leading-snug">{item.name}</p>
                <p className="text-fs14 text-[#a5a3ae] leading-tight">{item.brand}</p>
              </div>
            </div>
            <span className="text-fs16 font-medium text-[#444050] shrink-0">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsBySalesCard;
