import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { GeneratedLeadsData } from "../../../../api/types";

interface GeneratedLeadsCardProps {
  data?: GeneratedLeadsData;
}

export const GeneratedLeadsCard: React.FC<GeneratedLeadsCardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-16 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  const { title, subtitle, value, change, percentage } = data;

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      height: 100,
      width: 100,
      backgroundColor: "transparent",
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "74%",
        dataLabels: { enabled: false },
        borderWidth: 0,
        states: {
          hover: {
            halo: { size: 0 },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Leads",
        data: [
          {
            name: "Completed",
            y: percentage,
            color: "#71dd37",
          },
          {
            name: "Remaining",
            y: 100 - percentage,
            color: "#e8fadf",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-fs22 font-medium text-[#444050]">{title}</h3>
        <p className="text-fs16 font-normal text-[#a5a3ae] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <span className="text-fs24 font-semibold text-[#444050]">{value}</span>
          <p className="text-fs14 font-normal text-[#71dd37] flex items-center gap-1 mt-1">
            <span>↑</span>
            <span>{change}</span>
          </p>
        </div>

        {/* Circular Progress with Highcharts */}
        <div className="relative w-[100px] h-[100px] flex items-center justify-center">
          <Chart options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-fs18 font-bold text-[#32475c] leading-none">{percentage}%</span>
            <span className="text-fs13 text-[#a5a3ae] mt-1 leading-none">Average</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedLeadsCard;
