import React, { useState } from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";
import YearSelectionPopup from "../../../components/ui/YearSelectionPopup";
import type { TotalRevenueData } from "../../../api/types";

interface TotalRevenueCardProps {
  data?: TotalRevenueData;
  growth?: string;
  companyGrowth?: string;
  value2023?: string;
  value2022?: string;
  availableYears?: string[];
}

export const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  data,
  growth = "78%",
  companyGrowth = "62% Company Growth",
  value2023 = "$32.5k",
  value2022 = "$41.2k",
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState("2023");

  const activeData = data?.years?.[selectedYear] || data;
  const currentGrowth = activeData?.growthIndicator || (selectedYear === "2022" ? "64%" : growth);
  const currentCompanyGrowth = activeData?.companyGrowth || (selectedYear === "2022" ? "51% Company Growth" : companyGrowth);
  const legendItems = activeData?.legend || (selectedYear === "2022" ? ["2022", "2021"] : ["2023", "2022"]);
  const comparisonItems = activeData?.comparison || (selectedYear === "2022"
    ? [{ year: "2022", amount: "$28.4k" }, { year: "2021", amount: "$36.8k" }]
    : [{ year: "2023", amount: value2023 }, { year: "2022", amount: value2022 }]);
  const seriesData = activeData?.series || [
    {
      name: legendItems[0],
      data: selectedYear === "2022" ? [14, 11, 18, 22, 20, 16, 14] : [18, 7, 15, 29, 29, 13, 11],
    },
    {
      name: legendItems[1],
      data: selectedYear === "2022" ? [-10, -12, -14, -9, -5, -11, -8] : [-14, -16, -17, -11, -3, -14, -11],
    },
  ];

  const revenueChartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 265,
      backgroundColor: "transparent",
      margin: [15, 10, 28, 40],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      shared: true,
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      shadow: true,
      style: { fontSize: "12px", fontFamily: "Poppins" },
    },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        style: { color: "#a5a3ae", fontSize: "13px", fontFamily: "Poppins" },
        y: 20,
      },
    },
    yAxis: {
      min: -20,
      max: 32,
      tickInterval: 10,
      title: { text: undefined },
      gridLineDashStyle: "Dash",
      gridLineColor: "#ebeef0",
      labels: {
        x: -6,
        style: { color: "#c3c2c9", fontSize: "13px", fontFamily: "Poppins" },
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: "#ebeef0",
          dashStyle: "Dash",
          zIndex: 1,
        },
      ],
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointWidth: 16,
        borderWidth: 5,
        borderColor: "#ffffff",
        borderRadius: { radius: 8, scope: "point" },
        groupPadding: 0,
        pointPadding: 0,
      },
    },
    series: seriesData.map((s, idx) => ({
      name: s.name,
      type: "column" as const,
      color: idx === 0 ? "#696cff" : "#03c3ec",
      data: s.data,
    })),
  };

  // Segmented gauge: rectangular segments laid out on a 240deg arc.
  // 0deg points right, angles grow clockwise (SVG convention).
  const totalTicks = 36;
  const parsedGrowth = parseInt(currentGrowth, 10);
  const numericGrowth = Number.isFinite(parsedGrowth)
    ? Math.min(100, Math.max(0, parsedGrowth))
    : 78;
  // The remaining (100 - growth)% of segments render pale at the start of the arc
  const paleTicks = Math.round(totalTicks * (1 - numericGrowth / 100));
  const startAngle = 125;
  const endAngle = 365;
  const angleStep = (endAngle - startAngle) / (totalTicks - 1);
  const gaugeCenter = 100;
  const gaugeOuterRadius = 94;
  const segmentWidth = 7;
  const segmentHeight = 20;

  const formattedCompanyGrowth = currentCompanyGrowth.includes("Company Growth")
    ? currentCompanyGrowth
    : `${currentCompanyGrowth} Company Growth`;

  return (
    <div className="bg-white rounded-[5px] border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] overflow-hidden h-full flex flex-col justify-between">
      <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#dbdade]/50 h-full flex-1">
        {/* Left Column: Total Revenue Bar Chart */}
        <div className="col-span-12 md:col-span-7 p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h3 className="text-fs22 font-medium text-[#444050]">
              Total Revenue
            </h3>
            <div className="flex items-center gap-4 text-fs16 font-normal text-[#6f6b7d]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#696cff]" />
                {legendItems[0]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#03c3ec]" />
                {legendItems[1]}
              </span>
            </div>
          </div>

          <div className="w-full my-auto">
            <Chart key={selectedYear} options={revenueChartOptions} />
          </div>
        </div>

        {/* Right Column: Semicircular Radial Segmented Growth Gauge */}
        <div className="col-span-12 md:col-span-5 p-5 flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-end relative">
            <YearSelectionPopup
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              availableYears={availableYears}
            >
              <button
                type="button"
                className="border border-[#dbdade] hover:border-[#696cff] text-[#696cff] px-2.5 py-1 rounded-[5px] text-fs12 font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{selectedYear}</span>
                <svg
                  className="w-3.5 h-3.5 text-[#696cff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </YearSelectionPopup>
          </div>

          {/* Segmented Semicircular Radial Gauge */}
          <div className="relative my-1 w-[190px] h-[190px] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {Array.from({ length: totalTicks }).map((_, idx) => {
                const angle = startAngle + idx * angleStep;
                // A segment drawn at the 12 o'clock position (270deg) needs no rotation
                const rotation = angle - 270;
                const isPale = idx < paleTicks;
                // Fade the pale segments out towards the start of the arc
                const opacity = isPale
                  ? 0.15 + (idx / Math.max(paleTicks, 1)) * 0.35
                  : 1;

                return (
                  <rect
                    key={idx}
                    x={gaugeCenter - segmentWidth / 2}
                    y={gaugeCenter - gaugeOuterRadius}
                    width={segmentWidth}
                    height={segmentHeight}
                    rx={1}
                    fill="#696cff"
                    opacity={Number.isFinite(opacity) ? opacity : 1}
                    transform={`rotate(${Number.isFinite(rotation) ? rotation : 0} ${gaugeCenter} ${gaugeCenter})`}
                  />
                );
              })}
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-fs24 font-semibold text-[#444050] leading-none">
                {currentGrowth}
              </span>
              <span className="text-fs18 text-[#a5a3ae] mt-1.5 font-normal">
                Growth
              </span>
            </div>
          </div>

          {/* Company Growth Text */}
          <p className="text-fs18 font-medium text-[#6f6b7d] mb-5">
            {formattedCompanyGrowth}
          </p>

          {/* Comparison Metrics */}
          <div className="w-full flex items-center justify-center gap-6 pt-2">
            {comparisonItems.map((item, idx) => (
              <div key={item.year} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    idx === 0 ? "bg-[#e7e7ff] text-[#696cff]" : "bg-[#d2f4fa] text-[#03c3ec]"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-fs14 font-normal text-[#a5a3ae] leading-tight">
                    {item.year}
                  </span>
                  <span className="block text-fs18 font-semibold text-[#444050] leading-tight mt-1">
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
