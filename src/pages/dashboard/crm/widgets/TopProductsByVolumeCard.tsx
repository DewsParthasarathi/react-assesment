import React, { useState } from "react";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { TopProductVolume } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";
import laptopIcon from "../../../../assets/images/Laptop.svg";
import imacIcon from "../../../../assets/images/Imac.svg";
import watchIcon from "../../../../assets/images/Smart watch.svg";
import phoneIcon from "../../../../assets/images/phone2.svg";

interface TopProductsByVolumeCardProps {
  products?: TopProductVolume[];
  years?: Record<string, TopProductVolume[]>;
  availableYears?: string[];
}

export const TopProductsByVolumeCard: React.FC<TopProductsByVolumeCardProps> = ({
  products,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const items = (years && years[selectedYear]) ? years[selectedYear] : products;

  if (!items) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
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
      case "Laptop.svg":
        return laptopIcon;
      case "Imac.svg":
        return imacIcon;
      case "Smart watch.svg":
        return watchIcon;
      case "phone2.svg":
      default:
        return phoneIcon;
    }
  };

  const getIconBackground = (index: number) => {
    switch (index) {
      case 0:
        return "bg-[#ebeef0] text-[#8592a3]";
      case 1:
        return "bg-[#ffe2e3] text-[#ff3e1d]";
      case 2:
        return "bg-[#e7e7ff] text-[#696cff]";
      case 3:
        return "bg-[#fff1d6] text-[#ffab00]";
      case 4:
        return "bg-[#e8fadf] text-[#71dd37]";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-fs22 font-medium text-[#444050]">
          Top Products by <span className="text-[#696cff]">Volume</span>
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

      {/* Product List */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg flex items-center justify-center shrink-0 ${getIconBackground(
                  idx,
                )}`}
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
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-fs16 font-medium text-[#444050]">{item.volume}</span>
              <span
                className={`text-fs12 font-semibold px-2 py-0.5 rounded ${
                  item.isPositive
                    ? "bg-[#e8fadf] text-[#71dd37]"
                    : "bg-[#ffe2e3] text-[#ff3e1d]"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsByVolumeCard;
