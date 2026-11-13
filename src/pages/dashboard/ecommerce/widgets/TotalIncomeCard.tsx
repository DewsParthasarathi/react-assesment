import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceTotalIncome } from "../../../../api/types";

interface TotalIncomeCardProps {
  data?: EcommerceTotalIncome;
  isInsideSharedContainer?: boolean;
}

export const TotalIncomeCard: React.FC<TotalIncomeCardProps> = ({
  data,
  isInsideSharedContainer = false,
}) => {
  const title = data?.title || "Total income";
  const subtitle = data?.subtitle || "Yearly Sales Overview";
  const months = data?.months || [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const seriesData = data?.series || [
    3500, 3500, 4500, 4500, 3000, 3000, 2000, 2000, 3500, 3500, 5000, 5000,
  ];

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "line",
      height: 250,
      backgroundColor: "transparent",
      margin: [12, 10, 24, 38],
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
      valuePrefix: "$",
    },
    xAxis: {
      categories: months,
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        step: 1,
        rotation: 0,
        reserveSpace: true,
        style: {
          color: "#a5a3ae",
          fontSize: "10.5px",
          fontFamily: "Poppins",
        },
        y: 18,
      },
    },
    yAxis: {
      min: 1000,
      max: 6000,
      tickInterval: 1000,
      gridLineColor: "#ebe9f1",
      gridLineDashStyle: "Dash",
      title: { text: undefined },
      labels: {
        style: {
          color: "#a5a3ae",
          fontSize: "11px",
          fontFamily: "Poppins",
        },
        formatter: function () {
          return `$${Number(this.value) / 1000}k`;
        },
      },
    },
    plotOptions: {
      line: {
        color: "#696cff",
        lineWidth: 2.5,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5,
              fillColor: "#696cff",
              lineColor: "#ffffff",
              lineWidth: 2,
            },
          },
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Income",
        data: seriesData,
      },
    ],
  };

  const containerClass = isInsideSharedContainer
    ? "p-4 flex flex-col h-full"
    : "bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col h-full";

  return (
    <div className={containerClass}>
      <div>
        <h3 className="text-fs19 font-bold text-[#444050] tracking-tight">
          {title}
        </h3>
        <p className="text-fs14 text-[#a5a3ae] mt-0.5">{subtitle}</p>
      </div>

      <div className="w-full flex-1 min-h-[240px] mt-2">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default TotalIncomeCard;
