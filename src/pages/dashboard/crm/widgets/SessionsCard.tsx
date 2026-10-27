import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { SessionsData } from "../../../../api/types";

interface SessionsCardProps {
  data?: SessionsData;
}

export const SessionsCard: React.FC<SessionsCardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const { value, series: seriesData } = data;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "areaspline",
      height: 60,
      backgroundColor: "transparent",
      margin: [5, 2, 0, 2],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      min: 5,
    },
    plotOptions: {
      areaspline: {
        marker: {
          enabled: false,
        },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(255, 171, 0, 0.25)"],
            [1, "rgba(255, 171, 0, 0.0)"],
          ],
        },
      },
    },
    series: [
      {
        type: "areaspline",
        name: "Sessions",
        data: seriesData.map((val, idx) => {
          if (idx === seriesData.length - 1) {
            return {
              y: val,
              marker: {
                enabled: true,
                radius: 4,
                fillColor: "#ffffff",
                lineColor: "#ffab00",
                lineWidth: 2.5,
              },
            };
          }
          return { y: val };
        }),
        color: "#ffab00",
        lineWidth: 2.5,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <p className="text-fs18 font-normal text-[#a5a3ae]">sessions</p>
        <p className="text-fs24 font-semibold text-[#444050] mt-1">{value}</p>
      </div>
      <div className="mt-2 -mx-2 -mb-2">
        <Chart options={chartOptions} />
      </div>
    </div>
  );
};

export default SessionsCard;
