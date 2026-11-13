import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceNewVisitors } from "../../../../api/types";

interface NewVisitorsCardProps {
  data?: EcommerceNewVisitors;
  isInsideSharedContainer?: boolean;
}

export const NewVisitorsCard: React.FC<NewVisitorsCardProps> = ({
  data,
  isInsideSharedContainer = false,
}) => {
  const title = data?.title || "New Visitors";
  const timeLabel = data?.timeLabel || "Last Week";
  const percentage = data?.percentage || "23%";
  const change = data?.change || "13.24%";
  const isDown = data?.changeDirection !== "up";
  const days = data?.days || ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const seriesData = data?.series || [18, 32, 22, 28, 48, 62, 34];

  const coloredData = seriesData.map((val, idx) => ({
    y: val,
    color: idx === 5 ? "#696cff" : "#d2d3ff",
  }));

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 95,
      backgroundColor: "transparent",
      margin: [10, 0, 20, 0],
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
      pointFormat: "<b>{point.y}</b> visitors",
    },
    xAxis: {
      categories: days,
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
        y: 15,
      },
    },
    yAxis: {
      visible: false,
      min: 0,
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        pointWidth: 8,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        name: "Visitors",
        data: coloredData,
      },
    ],
  };

  const containerClass = isInsideSharedContainer
    ? "p-4 flex flex-col justify-between h-full"
    : "bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between">
        <h3 className="text-fs18 font-medium text-[#444050] tracking-tight">
          {title}
        </h3>
        <span className="text-fs13 text-[#a5a3ae]">{timeLabel}</span>
      </div>

      <div className="flex items-end justify-between mt-3 gap-2">
        <div className="pb-1 shrink-0">
          <span className="text-fs24 font-bold text-[#444050] leading-none">
            {percentage}
          </span>
          <div
            className={`text-fs12 font-medium flex items-center gap-1 mt-1.5 ${
              isDown ? "text-[#ea5455]" : "text-[#71dd37]"
            }`}
          >
            <span>{isDown ? "↓" : "↑"}</span>
            <span>{change}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 h-[95px] ml-3">
          <Chart options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default NewVisitorsCard;
