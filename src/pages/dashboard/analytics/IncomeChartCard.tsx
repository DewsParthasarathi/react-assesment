import React, { useState } from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";
import { Tabs, type TabItem } from "../../../components/ui/Tabs";

type TabType = "INCOME" | "EXPENSES" | "PROFIT";

export const IncomeChartCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("INCOME");

  const tabData = {
    INCOME: {
      label: "Total Income",
      value: "$459.1k",
      percentage: "42.9%",
      points: [
        24,
        21,
        30,
        22,
        {
          y: 42,
          marker: {
            enabled: true,
            radius: 5,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
        26,
        {
          y: 35,
          marker: {
            enabled: true,
            radius: 4,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
      ],
      indicator: "6.5k",
      summary: "Income this week",
      subSummary: "$39k less than last week",
    },
    EXPENSES: {
      label: "Total Expenses",
      value: "$214.3k",
      percentage: "18.2%",
      points: [
        18,
        25,
        20,
        28,
        {
          y: 32,
          marker: {
            enabled: true,
            radius: 5,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
        24,
        {
          y: 28,
          marker: {
            enabled: true,
            radius: 4,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
      ],
      indicator: "3.2k",
      summary: "Expenses this week",
      subSummary: "$12k more than last week",
    },
    PROFIT: {
      label: "Total Profit",
      value: "$244.8k",
      percentage: "24.7%",
      points: [
        15,
        20,
        26,
        18,
        {
          y: 36,
          marker: {
            enabled: true,
            radius: 5,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
        22,
        {
          y: 30,
          marker: {
            enabled: true,
            radius: 4,
            fillColor: "#696cff",
            lineColor: "#ffffff",
            lineWidth: 2,
          },
        },
      ],
      indicator: "4.8k",
      summary: "Profit this week",
      subSummary: "$27k more than last week",
    },
  };

  const current = tabData[activeTab];

  // Same values as before; only the end marker styling is normalised so the
  // last point shows a white ring with a purple border, as in the reference.
  const seriesPoints: Highcharts.PointOptionsObject[] = (
    current.points as (number | Highcharts.PointOptionsObject)[]
  ).map((point, idx, all) => {
    const y = typeof point === "number" ? point : (point.y ?? 0);
    return idx === all.length - 1
      ? {
          y,
          marker: {
            enabled: true,
            radius: 6,
            fillColor: "#ffffff",
            lineColor: "#696cff",
            lineWidth: 3,
          },
        }
      : { y };
  });

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "areaspline",
      height: 226,
      backgroundColor: "transparent",
      margin: [25, 20, 46, 20],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      lineWidth: 0,
      tickWidth: 0,
      plotLines:
        activeTab === "INCOME"
          ? [
              {
                value: 3,
                width: 1,
                color: "#dbdade",
                dashStyle: "Dash",
                zIndex: 1,
              },
            ]
          : [],
      labels: {
        rotation: 0,
        autoRotation: [0],
        useHTML: true,
        formatter: function () {
          if (this.value === "Apr") {
            return '<span style="display: inline-block; line-height: 1.2; background: #ebeef0; color: #32475c; font-weight: 600; padding: 3px 8px; border-radius: 4px; font-size: 14px;">Apr</span>';
          }
          return `<span style="display: inline-block; line-height: 1.2; color: #a5a3ae; font-size: 14px;">${this.value}</span>`;
        },
      },
    },
    yAxis: {
      min: 0,
      max: 50,
      tickInterval: 10,
      title: { text: undefined },
      labels: { enabled: false },
      gridLineWidth: 1,
      gridLineDashStyle: "Dash",
      gridLineColor: "#ebeef0",
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      shadow: true,
      style: { fontSize: "12px", fontFamily: "Poppins" },
      formatter: function () {
        return `<div style="padding: 2px 4px;"><b>${this.x}</b><br/><span style="color: #696cff">●</span> Sales: <b>${this.y}</b></div>`;
      },
    },
    plotOptions: {
      areaspline: {
        pointPlacement: "on",
        clip: false,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(105, 108, 255, 0.4)"],
            [1, "rgba(105, 108, 255, 0.02)"],
          ],
        },
        lineColor: "#696cff",
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true, radius: 5 },
          },
        },
      },
    },
    series: [
      {
        type: "areaspline",
        data: seriesPoints,
      },
    ],
  };

  const tabItems: TabItem[] = [
    { id: "INCOME", label: "INCOME" },
    { id: "EXPENSES", label: "EXPENSES" },
    { id: "PROFIT", label: "PROFIT" },
  ];

  return (
    <div className="bg-white rounded-[6px] p-5 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full w-full min-w-0">
      {/* 3 Tabs at Top */}
      <div>
        <div className="-mx-5 -mt-3 px-5 pb-3 border-b border-[#dbdade]/50">
          <Tabs
            tabs={tabItems}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as TabType)}
            renderContent={false}
            tabListClassName="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full"
            tabButtonClassName="px-3 sm:px-4 py-1.5 rounded-[6px] text-fs13 font-medium transition cursor-pointer flex items-center gap-2 select-none"
            activeTabClassName="bg-[#696cff] text-white"
            inactiveTabClassName="text-[#6f6b7d] hover:text-[#444050]"
          />
        </div>

        <div className="mt-5 pl-2 sm:pl-5">
          <p className="text-fs14 font-normal text-[#6f6b7d]">
            {current.label}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-fs22 font-bold text-[#444050]">
              {current.value}
            </span>
            <span className="text-fs13 font-medium text-[#71dd37]">
              {current.percentage}
            </span>
          </div>
        </div>

        <div className="relative w-full mt-1">
          <Chart
            options={chartOptions}
            containerProps={{ className: "w-full" }}
          />

          {activeTab === "INCOME" && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-[#dbdade]/60 px-3 py-1.5 pointer-events-none">
              <span className="text-fs14 font-medium text-[#444050] block text-left">
                Apr
              </span>
              <span className="text-fs12 font-normal text-[#6f6b7d] flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#696cff]" />
                Series - 1: <b className="font-medium text-[#444050]">42</b>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2 mt-1">
        <div className="w-10 h-10 rounded-full border-[3px] border-[#696cff] border-t-[#d7d8ff] flex items-center justify-center shrink-0">
          <span className="text-fs12 font-normal text-[#6f6b7d] leading-none">
            {current.indicator}
          </span>
        </div>
        <div>
          <p className="text-fs14 font-medium text-[#6f6b7d] leading-tight">
            {current.summary}
          </p>
          <p className="text-fs12 font-normal text-[#a5a3ae] leading-tight mt-0.5">
            {current.subSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeChartCard;
