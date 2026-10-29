import React from "react";
import Highcharts from "highcharts";
import Chart from "../../../../components/ui/Chart";
import type { EcommerceConversionRate } from "../../../../api/types";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";

interface ConversionRateCardProps {
  data?: EcommerceConversionRate;
  availableYears?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
}

export const ConversionRateCard: React.FC<ConversionRateCardProps> = ({
  data,
  availableYears = ["2023", "2022"],
  selectedYear = "2023",
  onSelectYear,
}) => {
  const title = data?.title || "Conversion Rate";
  const subtitle = data?.subtitle || "Compared to Last Month";
  const rate = data?.rate || "8.72%";
  const sparkline = data?.sparkline || [12, 24, 15, 30];
  const lastMonthSparkline =
    data?.lastMonthSparkline || [8, 18, 11, 24];
  const metrics = data?.metrics || [
    {
      label: "Impressions",
      subtext: "12.4k Visits",
      value: "12.8%",
      changeDirection: "up" as const,
    },
    {
      label: "Added To Cart",
      subtext: "32 Product in cart",
      value: "-8.3%",
      changeDirection: "down" as const,
    },
    {
      label: "checkout",
      subtext: "21 Product checkout",
      value: "9.12%",
      changeDirection: "up" as const,
    },
    {
      label: "Purcghased",
      subtext: "12 orders",
      value: "2.24%",
      changeDirection: "up" as const,
    },
  ];

  // Map current month points so the final point renders a hollow circle ring marker
  const currentSparklinePoints: Highcharts.PointOptionsObject[] = sparkline.map(
    (val, idx, arr) =>
      idx === arr.length - 1
        ? {
            y: val,
            marker: {
              enabled: true,
              radius: 4,
              fillColor: "#ffffff",
              lineColor: "#696cff",
              lineWidth: 2.5,
            },
          }
        : {
            y: val,
            marker: { enabled: false },
          },
  );

  // Map last month points (faded line with no markers)
  const lastMonthPoints: Highcharts.PointOptionsObject[] =
    lastMonthSparkline.map((val) => ({
      y: val,
      marker: { enabled: false },
    }));

  const sparklineOptions: Highcharts.Options = {
    chart: {
      type: "spline",
      height: 42,
      width: 95,
      backgroundColor: "transparent",
      margin: [5, 6, 5, 5],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: { visible: false },
    yAxis: { visible: false },
    plotOptions: {
      spline: {
        states: {
          hover: { lineWidth: 2 },
        },
      },
    },
    series: [
      {
        type: "spline",
        name: "Last Month",
        data: lastMonthPoints,
        color: "rgba(105, 108, 255, 0.32)",
        lineWidth: 2,
        zIndex: 1,
      },
      {
        type: "spline",
        name: "Current Month",
        data: currentSparklinePoints,
        color: "#696cff",
        lineWidth: 2.2,
        zIndex: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full min-h-[340px]">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-fs18 font-bold text-[#444050] tracking-tight">
              {title}
            </h3>
            <p className="text-fs12 text-[#a5a3ae] mt-0.5">{subtitle}</p>
          </div>

          <YearSelectionPopup
            selectedYear={selectedYear}
            onSelectYear={onSelectYear || (() => {})}
            availableYears={availableYears}
          >
            <button
              type="button"
              className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
              aria-label="Conversion rate options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </YearSelectionPopup>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-fs28 font-bold text-[#444050] leading-none">
            {rate}
          </span>
          <div className="w-[95px] h-[42px]">
            <Chart options={sparklineOptions} />
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {metrics.map((metric, idx) => {
          return (
            <div
              key={idx}
              className="flex items-center justify-between"
            >
              <div>
                <span className="text-fs13 font-medium text-[#444050] block leading-tight">
                  {metric.label}
                </span>
                <span className="text-fs11 text-[#a5a3ae] block leading-tight mt-0.5">
                  {metric.subtext}
                </span>
              </div>

              <span className="text-fs13 font-normal text-[#6f6b7d]">
                {metric.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionRateCard;
