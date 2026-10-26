import React from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";

interface OrderCardProps {
  value?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({ value = "276K" }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "areaspline",
      height: 105,
      backgroundColor: "transparent",
      margin: [10, 8, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      visible: false,
      minPadding: 0,
      maxPadding: 0.04,
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      visible: false,
      min: 0,
    },
    tooltip: {
      enabled: true,
      headerFormat: "",
      pointFormat: "<b>{point.y}k</b> Orders",
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      shadow: true,
      style: { fontSize: "12px", fontFamily: "Poppins" },
    },
    plotOptions: {
      areaspline: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(113, 221, 55, 0.45)"],
            [1, "rgba(113, 221, 55, 0.0)"],
          ],
        },
        lineColor: "#71dd37",
        lineWidth: 2.5,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4,
            },
          },
        },
      },
    },
    series: [
      {
        type: "areaspline",
        data: [
          20,
          75,
          8,
          52,
          40,
          {
            y: 65,
            marker: {
              enabled: true,
              radius: 4.5,
              fillColor: "#ffffff",
              lineColor: "#71dd37",
              lineWidth: 3,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-[5px] p-5 pb-2 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full overflow-hidden">
      <div>
        <p className="text-fs14 font-medium text-[#6f6b7d]">Order</p>
        <p className="text-fs24 font-bold text-[#32475c] mt-1">{value}</p>
      </div>
      <div className="mt-auto -ml-5 -mr-5 overflow-hidden">
        <Chart options={options} />
      </div>
    </div>
  );
};

export default OrderCard;
