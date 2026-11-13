import React from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import Chart from "../../../../components/ui/Chart";
import type { EcommercePerformance } from "../../../../api/types";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";

const initMore = HighchartsMore as unknown as
  | ((hc: typeof Highcharts) => void)
  | { default?: (hc: typeof Highcharts) => void };
if (typeof initMore === "function") {
  initMore(Highcharts);
} else if (initMore && typeof initMore.default === "function") {
  initMore.default(Highcharts);
}

interface PerformanceRadarCardProps {
  data?: EcommercePerformance;
  availableYears?: string[];
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
}

export const PerformanceRadarCard: React.FC<PerformanceRadarCardProps> = ({
  data,
  availableYears = ["2023", "2022"],
  selectedYear = "2023",
  onSelectYear,
}) => {
  const title = data?.title || "performance";
  const earning = data?.earning || "$846.17";
  const sales = data?.sales || "25.7M";
  const categories = data?.categories || [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];
  const series = data?.series || [
    {
      name: "Income",
      data: [40, 52, 48, 92, 82, 75],
      color: "#696cff",
    },
    {
      name: "Earning",
      data: [88, 65, 60, 42, 55, 95],
      color: "#03c3ec",
    },
  ];

  const chartOptions: Highcharts.Options = {
    chart: {
      polar: true,
      type: "area",
      height: 220,
      backgroundColor: "transparent",
      margin: [10, 10, 10, 10],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    pane: {
      startAngle: 0,
      size: "80%",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      style: { fontSize: "11px", fontFamily: "Poppins" },
    },
    xAxis: {
      categories,
      tickmarkPlacement: "on",
      lineWidth: 0,
      labels: {
        style: {
          color: "#a5a3ae",
          fontSize: "11px",
          fontFamily: "Poppins",
        },
      },
    },
    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
      max: 100,
      labels: { enabled: false },
      gridLineColor: "#ebe9f1",
    },
    plotOptions: {
      area: {
        lineWidth: 1.5,
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 3,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: series.map((s) => ({
      type: "area",
      name: s.name,
      data: s.data,
      color: s.color,
      fillColor:
        s.name.toLowerCase() === "income"
          ? "rgba(105, 108, 255, 0.65)"
          : "rgba(3, 195, 236, 0.85)",
    })),
  };

  const formattedEarning = earning.startsWith("$") ? earning : `$${earning}`;

  return (
    <div className="bg-white rounded-[6px] p-4 shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 flex flex-col justify-between h-full min-h-[340px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs18 font-bold text-[#444050] tracking-tight">
            {title}
          </h3>

          <YearSelectionPopup
            selectedYear={selectedYear}
            onSelectYear={onSelectYear || (() => {})}
            availableYears={availableYears}
          >
            <button
              type="button"
              className="text-[#a5a3ae] hover:text-[#5d596c] p-1 rounded transition cursor-pointer"
              aria-label="Performance options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </YearSelectionPopup>
        </div>

        <div className="flex items-center justify-between text-fs13 text-[#a5a3ae] mt-1">
          <span>Earning: {formattedEarning}</span>
          <span>Sales: {sales}</span>
        </div>
      </div>

      <div className="w-full h-[220px] my-auto">
        <Chart options={chartOptions} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-1 text-fs12 text-[#6f6b7d]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#696cff]" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#03c3ec]" />
          <span>Earning</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRadarCard;
