import React from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";

interface RevenueCardProps {
  value?: string;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({ value = "425K" }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 85,
      backgroundColor: "transparent",
      margin: [5, 0, 20, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        step: 1,
        style: { color: "#a5a3ae", fontSize: "11px", fontFamily: "Poppins" },
      },
    },
    yAxis: {
      visible: false,
      min: 0,
    },
    tooltip: {
      headerFormat: "<b>Day {point.key}</b><br/>",
      pointFormat: "{point.y}k Revenue",
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      style: { fontSize: "12px", fontFamily: "Poppins" },
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        pointWidth: 9,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        data: [
          { y: 15, color: "#e7e7ff" },
          { y: 22, color: "#e7e7ff" },
          { y: 18, color: "#e7e7ff" },
          { y: 14, color: "#e7e7ff" },
          { y: 32, color: "#696cff" },
          { y: 16, color: "#e7e7ff" },
          { y: 24, color: "#e7e7ff" },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-[5px] p-5 pb-3 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full min-h-[190px]">
      <div>
        <p className="text-fs14 font-medium text-[#6f6b7d]">Revenue</p>
        <p className="text-fs24 font-bold text-[#32475c] mt-0.5">{value}</p>
      </div>
      <div className="mt-1">
        <Chart options={options} />
      </div>
    </div>
  );
};

export default RevenueCard;
