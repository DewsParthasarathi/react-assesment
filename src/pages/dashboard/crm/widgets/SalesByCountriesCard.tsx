import React, { useState } from "react";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { CountrySales } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";
import usFlag from "../../../../assets/images/United state of america.png";
import brazilFlag from "../../../../assets/images/Brazil.png";
import indiaFlag from "../../../../assets/images/India.png";
import franceFlag from "../../../../assets/images/France.png";
import belgiumFlag from "../../../../assets/images/belgium.png";
import chinaFlag from "../../../../assets/images/China.png";

interface SalesByCountriesCardProps {
  countries?: CountrySales[];
  years?: Record<string, CountrySales[]>;
  availableYears?: string[];
}

export const SalesByCountriesCard: React.FC<SalesByCountriesCardProps> = ({
  countries,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const items = (years && years[selectedYear]) ? years[selectedYear] : countries;

  if (!items) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getFlagImage = (flagName: string) => {
    switch (flagName) {
      case "United state of america.png":
        return usFlag;
      case "Brazil.png":
        return brazilFlag;
      case "India.png":
        return indiaFlag;
      case "France.png":
        return franceFlag;
      case "belgium.png":
        return belgiumFlag;
      case "China.png":
        return chinaFlag;
      default:
        return usFlag;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs23 font-medium text-[#444050]">Sales by countries</h3>
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
        <p className="text-fs17 font-normal text-[#a5a3ae] mt-0.5">Monthly Sales Overview</p>
      </div>

      <div className="space-y-3.5 mt-3">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomImage
                src={getFlagImage(c.flag)}
                alt={c.country}
                containerClassName="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-xs"
                className="w-full h-full object-cover"
              />
              <div>
                <p className="text-fs17 font-medium text-[#444050] leading-tight">{c.sales}</p>
                <p className="text-fs15 text-[#a5a3ae]">{c.country}</p>
              </div>
            </div>
            <span className="text-fs17 font-medium text-[#444050]">{c.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByCountriesCard;
