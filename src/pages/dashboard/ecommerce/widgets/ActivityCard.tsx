import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceActivity } from "../../../../api/types";

interface ActivityCardProps {
  data?: EcommerceActivity;
  isInsideSharedContainer?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  isInsideSharedContainer = false,
}) => {
  const title = data?.title || "Activity";
  const timeLabel = data?.timeLabel || "Last Week";
  const percentage = data?.percentage || "82%";
  const change = data?.change || "19.6%";
  const isUp = data?.changeDirection !== "down";
  const days = data?.days || ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const seriesData = data?.series || [68, 42, 60, 22, 85, 95, 52];

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "areaspline",
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
      pointFormat: "<b>{point.y}%</b> activity",
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
    },
    plotOptions: {
      areaspline: {
        lineWidth: 2.2,
        lineColor: "#71dd37",
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(113, 221, 55, 0.28)"],
            [1, "rgba(113, 221, 55, 0.0)"],
          ],
        },
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: "areaspline",
        name: "Activity",
        data: seriesData,
      },
    ],
  };

  const containerClass = isInsideSharedContainer
    ? "p-4 flex flex-col justify-between h-full"
    : "bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between">
        <h3 className="text-fs19 font-medium text-[#444050] tracking-tight">
          {title}
        </h3>
        <span className="text-fs14 text-[#a5a3ae]">{timeLabel}</span>
      </div>

      <div className="flex items-end justify-between mt-3 gap-2">
        <div className="pb-1 shrink-0">
          <span className="text-fs25 font-bold text-[#444050] leading-none">
            {percentage}
          </span>
          <div
            className={`text-fs13 font-medium flex items-center gap-1 mt-1.5 ${
              isUp ? "text-[#71dd37]" : "text-[#ea5455]"
            }`}
          >
            <span>{isUp ? "↑" : "↓"}</span>
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

export default ActivityCard;
