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
      height: 102,
      backgroundColor: "transparent",
      margin: [4, 0, 26, 0],
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
        y: 19,
        style: { color: "#a5a3ae", fontSize: "12px", fontFamily: "Poppins" },
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
        borderRadius: 3,
        borderWidth: 0,
        groupPadding: 0,
        pointPadding: 0.25,
      },
    },
    series: [
      {
        type: "column",
        data: [
          { y: 15, color: "#e0e1ff" },
          { y: 22, color: "#e0e1ff" },
          { y: 18, color: "#e0e1ff" },
          { y: 14, color: "#e0e1ff" },
          { y: 32, color: "#696cff" },
          { y: 16, color: "#e0e1ff" },
          { y: 24, color: "#e0e1ff" },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-[6px] p-5 pb-3 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full min-h-[190px]">
      <div>
        <p className="text-fs14 font-normal text-[#a5a3ae]">Revenue</p>
        <p className="text-fs24 font-bold text-[#444050] mt-1">{value}</p>
      </div>
      <div className="mt-1">
        <Chart options={options} />
      </div>
    </div>
  );
};

export default RevenueCard;
