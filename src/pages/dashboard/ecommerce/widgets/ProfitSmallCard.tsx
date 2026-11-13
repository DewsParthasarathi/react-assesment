import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceProfitSmall } from "../../../../api/types";

interface ProfitSmallCardProps {
  data?: EcommerceProfitSmall;
}

export const ProfitSmallCard: React.FC<ProfitSmallCardProps> = ({ data }) => {
  const title = data?.title || "Profit";
  const value = data?.value || "624K";
  const months = data?.months || ["Jan", "Apr", "Jul", "Oct"];
  const primaryData = data?.series || [38, 22, 54, 76];
  const secondaryData =
    data?.secondarySeries || primaryData.map((v) => Math.round(v * 0.72));

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 95,
      backgroundColor: "transparent",
      margin: [10, 5, 22, 5],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      style: { fontSize: "11px", fontFamily: "Poppins" },
      pointFormat: "<b>{series.name}</b>: {point.y}K",
    },
    xAxis: {
      categories: months,
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        style: {
          color: "#a5a3ae",
          fontSize: "10px",
          fontFamily: "Poppins",
        },
        y: 14,
      },
    },
    yAxis: {
      visible: false,
      min: 0,
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        borderWidth: 0,
        groupPadding: 0.18,
        pointPadding: 0.08,
        pointWidth: 4,
      },
    },
    series: [
      {
        type: "column",
        name: "Gross Profit",
        color: "#71dd37",
        data: primaryData,
      },
      {
        type: "column",
        name: "Net Profit",
        color: "#b7f19b",
        data: secondaryData,
      },
    ],
  };

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full">
      <div>
        <span className="text-fs15 font-medium text-[#6f6b7d]">{title}</span>
        <div className="text-fs23 font-bold text-[#444050] mt-0.5 leading-tight">
          {value}
        </div>
      </div>

      <div className="w-full h-[95px] mt-1">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default ProfitSmallCard;
