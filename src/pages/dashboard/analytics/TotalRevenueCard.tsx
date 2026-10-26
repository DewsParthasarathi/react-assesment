import React, { useState } from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";

interface TotalRevenueCardProps {
  growth?: string;
  companyGrowth?: string;
  value2023?: string;
  value2022?: string;
}

export const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  growth = "78%",
  companyGrowth = "62% Company Growth",
  value2023 = "$32.5k",
  value2022 = "$41.2k",
}) => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const revenueChartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 265,
      backgroundColor: "transparent",
      margin: [15, 10, 28, 10],
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
        enabled: false,
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
        borderRadius: 5,
        pointWidth: 11,
        borderWidth: 0,
        groupPadding: 0.14,
        pointPadding: 0.04,
      },
    },
    series: [
      {
        name: "2022",
        type: "column",
        color: "#696cff",
        data: [18, 7, 15, 29, 29, 13, 11],
      },
      {
        name: "2021",
        type: "column",
        color: "#03c3ec",
        data: [-14, -16, -17, -11, -3, -14, -11],
      },
    ],
  };

  // Generate radial dashes for segmented arc
  const totalTicks = 28;
  const numericGrowth = parseInt(growth, 10) || 78;
  const activeTicks = Math.round(totalTicks * (numericGrowth / 100));
  const startAngle = 140;
  const endAngle = 400;
  const angleStep = (endAngle - startAngle) / (totalTicks - 1);

  const formattedCompanyGrowth = companyGrowth.includes("Company Growth")
    ? companyGrowth
    : `${companyGrowth} Company Growth`;

  return (
    <div className="bg-white rounded-[5px] border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] overflow-hidden h-full flex flex-col justify-between">
      <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#dbdade]/50 h-full flex-1">
        {/* Left Column: Total Revenue Bar Chart */}
        <div className="col-span-12 md:col-span-7 p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h3 className="text-fs16 font-semibold text-[#32475c]">
              Total Revenue
            </h3>
            <div className="flex items-center gap-4 text-fs13 font-medium text-[#6f6b7d]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#696cff]" />
                2022
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#03c3ec]" />
                2021
              </span>
            </div>
          </div>

          <div className="w-full my-auto">
            <Chart options={revenueChartOptions} />
          </div>
        </div>

        {/* Right Column: Semicircular Radial Segmented Growth Gauge */}
        <div className="col-span-12 md:col-span-5 p-5 flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-end relative">
            <button
              type="button"
              onClick={() => setYearDropdownOpen((prev) => !prev)}
              className="border border-[#dbdade] hover:border-[#696cff] text-[#696cff] px-2.5 py-1 rounded-[5px] text-fs12 font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{selectedYear}</span>
              <svg
                className={`w-3.5 h-3.5 text-[#696cff] transition-transform ${yearDropdownOpen ? "rotate-180" : ""}`}
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

            {yearDropdownOpen && (
              <div className="absolute right-0 top-8 bg-white border border-[#dbdade] shadow-md rounded-[5px] py-1 z-20 w-24 text-left">
                {["2023", "2022", "2021"].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setSelectedYear(yr);
                      setYearDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1 text-fs12 hover:bg-[#f5f5f9] text-[#32475c] block text-left"
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Segmented Semicircular Radial Gauge */}
          <div className="relative my-1 w-[150px] h-[150px] flex items-center justify-center">
            <svg className="w-full h-full transform" viewBox="0 0 200 200">
              {Array.from({ length: totalTicks }).map((_, idx) => {
                const angle = (startAngle + idx * angleStep) * (Math.PI / 180);
                const rInner = 74;
                const rOuter = 88;
                const x1 = 100 + rInner * Math.cos(angle);
                const y1 = 100 + rInner * Math.sin(angle);
                const x2 = 100 + rOuter * Math.cos(angle);
                const y2 = 100 + rOuter * Math.sin(angle);
                const isActive = idx < activeTicks;

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isActive ? "#696cff" : "#ebeef0"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-fs28 font-bold text-[#32475c] tracking-tight leading-none">
                {growth}
              </span>
              <span className="text-fs12 text-[#6f6b7d] mt-1 font-medium">
                Growth
              </span>
            </div>
          </div>

          {/* Company Growth Text */}
          <p className="text-fs13 font-semibold text-[#5d596c] mb-4">
            {formattedCompanyGrowth}
          </p>

          {/* Comparison Metrics with icon badges matching reference */}
          <div className="w-full grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5 justify-center">
              <div className="w-9 h-9 rounded-[5px] bg-[#696cff]/10 flex items-center justify-center text-[#696cff] font-bold text-fs14 shrink-0">
                $
              </div>
              <div className="text-left">
                <span className="block text-fs11 text-[#a5a3ae] leading-tight">2023</span>
                <span className="text-fs15 font-bold text-[#32475c] leading-tight">
                  {value2023}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 justify-center">
              <div className="w-9 h-9 rounded-[5px] bg-[#03c3ec]/10 flex items-center justify-center text-[#03c3ec] font-bold text-fs14 shrink-0">
                $
              </div>
              <div className="text-left">
                <span className="block text-fs11 text-[#a5a3ae] leading-tight">2022</span>
                <span className="text-fs15 font-bold text-[#32475c] leading-tight">
                  {value2022}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
