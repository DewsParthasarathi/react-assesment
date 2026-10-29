import React, { useState } from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { CustomerRatingsData } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";
import starIcon from "../../../../assets/images/star.png";
import darkStarIcon from "../../../../assets/images/darkStar.png";

interface CustomerRatingsCardProps {
  data?: CustomerRatingsData;
  availableYears?: string[];
}

export const CustomerRatingsCard: React.FC<CustomerRatingsCardProps> = ({ data, availableYears = ["2023", "2022"] }) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-32 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  const activeData = data.years?.[selectedYear] || data;
  const rating = activeData.rating ?? data.rating;
  const badge = activeData.badge ?? data.badge;
  const primarySeriesData = activeData.primarySeries || data.primarySeries || [];
  const secondarySeriesData = activeData.secondarySeries || data.secondarySeries || [];
  const categories = data.categories;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "spline",
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
      valueDecimals: 1,
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
      min: 1.0,
      max: 4.5,
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false,
        },
      },
      series: {
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
      },
    },
    series: [
      {
        type: "spline",
        name: "Ratings",
        data: primarySeriesData.map((val, idx) => {
          if (idx === 3) {
            // Highlight Apr
            return {
              y: val,
              marker: {
                enabled: true,
                radius: 6,
                fillColor: "#23272e",
                lineColor: "#ffffff",
                lineWidth: 2,
              },
            };
          }
          if (idx === primarySeriesData.length - 1) {
            // Highlight Jul
            return {
              y: val,
              marker: {
                enabled: true,
                radius: 5,
                fillColor: "#696cff",
                lineColor: "#ffffff",
                lineWidth: 2,
              },
            };
          }
          return { y: val };
        }),
        color: "#696cff",
        lineWidth: 2.5,
      },
      {
        type: "spline",
        name: "Previous",
        data: secondarySeriesData,
        color: "#cfd3fb",
        lineWidth: 1.8,
        dashStyle: "Dash",
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs22 font-medium text-[#444050]">Customer Ratings</h3>
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

        {/* Rating and stars */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-fs32 font-bold text-[#32475c]">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <CustomImage
                key={i}
                src={starIcon}
                alt="star"
                containerClassName="w-4 h-4"
                className="w-4 h-4 object-contain"
              />
            ))}
            <CustomImage
              src={darkStarIcon}
              alt="empty star"
              containerClassName="w-4 h-4"
              className="w-4 h-4 object-contain opacity-30"
            />
          </div>
        </div>

        {/* Badge */}
        {(() => {
          const match = badge?.match(/^([+-]?[0-9.]+)\s*(.*)$/);
          const badgeVal = match ? match[1] : "+5.0";
          const badgeLabel = match ? match[2] : "Points from last month";
          return (
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-[#e7e7ff] text-[#696cff] text-fs12 font-semibold px-2 py-0.5 rounded">
                {badgeVal}
              </span>
              <span className="text-fs13 text-[#a5a3ae]">
                {badgeLabel}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Chart */}
      <div className="mt-4 -mx-2">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default CustomerRatingsCard;
