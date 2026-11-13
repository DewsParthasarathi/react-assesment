import React, { useState } from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { SalesStatusData } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";

interface SalesStatusCardProps {
  data?: SalesStatusData;
  availableYears?: string[];
}

export const SalesStatusCard: React.FC<SalesStatusCardProps> = ({ data, availableYears = ["2023", "2022"] }) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="w-32 h-32 rounded-full bg-gray-100 mx-auto my-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  const activeData = data.years?.[selectedYear] || data;
  const percentage = activeData.percentage ?? data.percentage;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 180,
      backgroundColor: "transparent",
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: { enabled: false },
        borderWidth: 0,
        startAngle: 0,
        endAngle: 360,
        states: {
          hover: {
            halo: { size: 0 },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Sales Status",
        data: [
          {
            name: "Sales",
            y: percentage,
            color: "#71dd37",
          },
          {
            name: "Remaining",
            y: 100 - percentage,
            color: "#e8ebed",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-fs22 font-medium text-[#444050]">Sales Status</h3>
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

      <div className="relative flex items-center justify-center my-auto py-2">
        <div className="w-[180px] h-[180px]">
          <Chart options={chartOptions} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-7 h-7 flex items-center justify-center text-[#71dd37] mb-1.5">
            <svg
              className="w-[26px] h-[23px]"
              viewBox="0 0 25 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.4387 2.12669L18.909 4.20749L11.479 15.0799L8.01781 10.2814L0 22L7.74648 13.6404L11.5514 20.082L22.1143 6.90369L24.6939 9.07682L25 0L16.4387 2.12669Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-fs24 font-semibold text-[#444050] leading-none">{percentage}%</span>
          <span className="text-fs13 text-[#a5a3ae] mt-1 leading-none">Sales</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-fs13 text-[#a5a3ae] pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#696cff]" />
          <span>Conversion Ratio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#cfd3fb]" />
          <span>Total requirements</span>
        </div>
      </div>
    </div>
  );
};

export default SalesStatusCard;
