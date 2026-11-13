import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceExpensesComparison } from "../../../../api/types";

interface ExpensesComparisonCardProps {
  data?: EcommerceExpensesComparison;
}

export const ExpensesComparisonCard: React.FC<ExpensesComparisonCardProps> = ({
  data,
}) => {
  const title = data?.title || "Expenses";
  const value = data?.value || "$84.7K";
  const growth = data?.growth || "28.14%";
  const period = data?.period || "JULY 2023";
  const series = data?.series || [
    {
      name: "positive",
      data: [25, 45, 18, 38, 55, 34, 18, 30, 24],
    },
    {
      name: "negative",
      data: [-18, -16, -16, -16, -16, -16, -32, -16, -16],
    },
  ];

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 105,
      backgroundColor: "transparent",
      margin: [5, 0, 5, 0],
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
      pointFormat: "<b>{point.y}k</b>",
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      gridLineWidth: 0,
      min: -40,
      max: 65,
    },
    plotOptions: {
      column: {
        grouping: false,
        pointPadding: 0.15,
        groupPadding: 0,
        borderRadius: 2,
        borderWidth: 0,
        pointWidth: 4,
      },
    },
    series: [
      {
        type: "column",
        name: "Positive",
        color: "#696cff",
        threshold: 4,
        data: series[0]?.data || [25, 45, 18, 38, 55, 34, 18, 30, 24],
      },
      {
        type: "column",
        name: "Negative",
        color: "#ffab00",
        threshold: -4,
        data:
          series[1]?.data || [-18, -16, -16, -16, -16, -16, -32, -16, -16],
      },
    ],
  };

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full">
      <div>
        <span className="text-fs17 font-semibold text-[#444050]">{title}</span>
      </div>

      <div className="flex items-end justify-between flex-1 mt-1">
        <div className="flex flex-col justify-between h-full py-1">
          <div>
            <div className="text-fs23 font-bold text-[#444050] mt-0.5 leading-tight">
              {value}
            </div>
            <div className="text-fs13 font-medium text-[#71dd37] flex items-center gap-1 mt-1">
              <span>↑</span>
              <span>{growth}</span>
            </div>
          </div>

          <div className="mt-2">
            <span className="bg-[#f1f0f4] text-[#a5a3ae] text-fs12 font-medium px-2 py-0.5 rounded-[4px] tracking-wider uppercase inline-block">
              {period}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 h-[105px] ml-6">
          <Chart options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpensesComparisonCard;
