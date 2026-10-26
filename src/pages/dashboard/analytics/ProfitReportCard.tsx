import React from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";

interface ProfitReportCardProps {
  year?: string;
  growth?: string;
  value?: string;
}

export const ProfitReportCard: React.FC<ProfitReportCardProps> = ({
  year = "Year 2023",
  growth = "14.82%",
  value = "$84,686k",
}) => {
  const curveData = [10, 28, 13, 23, 17, 25, 21];

  const splineOptions: Highcharts.Options = {
    chart: {
      type: "spline",
      height: 90,
      backgroundColor: "transparent",
      margin: [5, 2, 8, 2],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: { visible: false },
    yAxis: { visible: false, min: 0 },
    tooltip: {
      headerFormat: "",
      pointFormat: "<b>{point.y}k</b> Profit",
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      style: { fontSize: "12px", fontFamily: "Poppins" },
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true, radius: 4 },
          },
        },
      },
    },
    series: [
      // Outer soft glow layer
      {
        type: "spline",
        data: curveData,
        lineWidth: 8,
        color: "rgba(255, 171, 0, 0.22)",
        enableMouseTracking: false,
        marker: { enabled: false },
      },
      // Middle intense glow layer
      {
        type: "spline",
        data: curveData,
        lineWidth: 5,
        color: "rgba(255, 171, 0, 0.45)",
        enableMouseTracking: false,
        marker: { enabled: false },
      },
      // Core glossy orange line
      {
        type: "spline",
        data: curveData,
        lineWidth: 3.5,
        color: "#ffab00",
        shadow: {
          color: "rgba(255, 171, 0, 0.4)",
          width: 5,
          offsetY: 2,
          offsetX: 0,
        },
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true, radius: 4 },
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-[5px] p-5 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between">
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-fs16 font-semibold text-[#32475c]">
          Profit Report
        </h3>
        <span className="inline-block px-2.5 py-0.5 rounded-[5px] text-fs12 font-medium bg-[#fff1d6] text-[#ffab00]">
          {year}
        </span>
      </div>

      <div className="grid grid-cols-12 items-center gap-2 mt-3">
        <div className="col-span-5">
          <p className="text-fs13 font-semibold text-[#71dd37] flex items-center gap-1">
            <span>↑</span>
            <span>{growth}</span>
          </p>
          <p className="text-fs22 font-bold text-[#32475c] mt-0.5 tracking-tight">
            {value}
          </p>
        </div>

        <div className="col-span-7 -mb-2">
          <Chart options={splineOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProfitReportCard;
