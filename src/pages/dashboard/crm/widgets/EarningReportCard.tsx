import React, { useState } from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import type { EarningReportData } from "../../../../api/types";
import moreIcon from "../../../../assets/images/More.svg";
import netProfitIcon from "../../../../assets/images/Net profit.svg";
import totalIncomeIcon from "../../../../assets/images/Total income.svg";
import creditCardIcon from "../../../../assets/images/Credit Card.svg";

interface EarningReportCardProps {
  data?: EarningReportData;
  availableYears?: string[];
}

export const EarningReportCard: React.FC<EarningReportCardProps> = ({ data, availableYears = ["2023", "2022"] }) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="h-24 bg-gray-100 rounded mt-4"></div>
      </div>
    );
  }

  const activeData = data.years?.[selectedYear] || data;
  const netProfit = activeData.netProfit || data.netProfit;
  const totalIncome = activeData.totalIncome || data.totalIncome;
  const totalExpenses = activeData.totalExpenses || data.totalExpenses;
  const weeklyReport = activeData.weeklyReport || data.weeklyReport;
  const days = weeklyReport?.days || [];
  const values = weeklyReport?.values || [];
  const highlightIdx = weeklyReport?.highlightDayIndex ?? 4;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 115,
      backgroundColor: "transparent",
      margin: [10, 5, 30, 5],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 8,
      shadow: true,
      formatter: function () {
        return `<b>Day ${this.x}</b>: $${this.y}k`;
      },
    },
    xAxis: {
      categories: days,
      labels: {
        y: 20,
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
    },
    plotOptions: {
      column: {
        pointWidth: 14,
        borderRadius: 0,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        name: "Earnings",
        data: values.map((val, idx) => ({
          y: val,
          color: idx === highlightIdx ? "#696cff" : "#e7e7ff",
        })),
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-fs22 font-medium text-[#444050]">Earning Report</h3>
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

      {/* 3 Metric Rows */}
      <div className="space-y-3">
        {/* Net Profit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg bg-[#e7e7ff] text-[#696cff] flex items-center justify-center shrink-0"
              style={{ width: "36px", height: "36px", minWidth: "36px" }}
            >
              <CustomImage
                src={netProfitIcon}
                alt="Net Profit"
                containerClassName="w-[18px] h-[18px] flex items-center justify-center shrink-0"
                className="object-contain w-full h-full block"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-fs16 font-medium text-[#444050] leading-snug">{netProfit.label}</p>
              <p className="text-fs14 text-[#a5a3ae] leading-tight">{netProfit.subLabel}</p>
            </div>
          </div>
          <span className="text-fs16 font-medium text-[#444050] shrink-0">{netProfit.amount}</span>
        </div>

        {/* Total Income */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg bg-[#e8fadf] text-[#71dd37] flex items-center justify-center shrink-0"
              style={{ width: "36px", height: "36px", minWidth: "36px" }}
            >
              <CustomImage
                src={totalIncomeIcon}
                alt="Total Income"
                containerClassName="w-[18px] h-[18px] flex items-center justify-center shrink-0"
                className="object-contain w-full h-full block"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-fs16 font-medium text-[#444050] leading-snug">{totalIncome.label}</p>
              <p className="text-fs14 text-[#a5a3ae] leading-tight">{totalIncome.subLabel}</p>
            </div>
          </div>
          <span className="text-fs16 font-medium text-[#444050] shrink-0">{totalIncome.amount}</span>
        </div>

        {/* Total Expenses */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg bg-[#d7f5fc] text-[#03c3ec] flex items-center justify-center shrink-0"
              style={{ width: "36px", height: "36px", minWidth: "36px" }}
            >
              <CustomImage
                src={creditCardIcon}
                alt="Total Expenses"
                containerClassName="w-[18px] h-[18px] flex items-center justify-center shrink-0"
                className="object-contain w-full h-full block"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-fs16 font-medium text-[#444050] leading-snug">{totalExpenses.label}</p>
              <p className="text-fs14 text-[#a5a3ae] leading-tight">{totalExpenses.subLabel}</p>
            </div>
          </div>
          <span className="text-fs16 font-medium text-[#444050] shrink-0">{totalExpenses.amount}</span>
        </div>
      </div>

      {/* Weekly Column Chart */}
      <div className="mt-3 -mx-2">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default EarningReportCard;
