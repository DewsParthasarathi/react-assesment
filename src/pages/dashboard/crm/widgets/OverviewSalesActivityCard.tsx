import React, { useState } from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { OverviewSalesActivityData } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";

interface OverviewSalesActivityCardProps {
  data?: OverviewSalesActivityData;
  availableYears?: string[];
}

export const OverviewSalesActivityCard: React.FC<OverviewSalesActivityCardProps> = ({ data, availableYears = ["2023", "2022"] }) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  const activeData = data.years?.[selectedYear] || data;
  const subtitle = data.subtitle;
  const categories = data.categories;
  const sales = activeData.sales || data.sales;
  const overview = activeData.overview || data.overview;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 180,
      backgroundColor: "transparent",
      margin: [10, 10, 30, 10],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      shared: true,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 8,
      shadow: true,
      formatter: function () {
        return `<b>${this.x}</b><br/>Overview: ${Math.abs(this.points?.[0]?.y ?? 0)}%<br/>Sales: ${Math.abs(this.points?.[1]?.y ?? 0)}%`;
      },
    },
    xAxis: {
      categories,
      labels: {
        style: {
          color: "#a5a3ae",
          fontSize: "12px",
          fontFamily: "inherit",
        },
        rotation: 0,
        autoRotation: [0],
      },
      lineWidth: 0,
      tickWidth: 0,
      crosshair: false,
    },
    yAxis: {
      visible: false,
      min: -70,
      max: 40,
    },
    plotOptions: {
      column: {
        pointWidth: 10,
        borderRadius: 5,
        groupPadding: 0,
        borderWidth: 0,
        grouping: false,
      },
    },
    series: [
      {
        type: "column",
        name: "Overview",
        data: overview,
        color: "#8592a3",
        threshold: 8,
      },
      {
        type: "column",
        name: "Sales",
        data: sales,
        color: "#ff3e1d",
        threshold: -4,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs23 font-medium text-[#444050]">Overview &amp; Sales Activity</h3>
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
        <p className="text-fs17 font-normal text-[#a5a3ae] mt-0.5">{subtitle}</p>
      </div>

      
      <div className="mt-4 -mx-2">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default OverviewSalesActivityCard;
