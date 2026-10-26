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

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "areaspline",
      height: 190,
      backgroundColor: "transparent",
      margin: [25, 10, 30, 10],
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        useHTML: true,
        formatter: function () {
          if (this.value === "Apr") {
            return '<span style="background: #ebeef0; color: #32475c; font-weight: 600; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Apr</span>';
          }
          return `<span style="color: #a5a3ae; font-size: 11px;">${this.value}</span>`;
        },
      },
    },
    yAxis: {
      visible: false,
      min: 0,
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
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(105, 108, 255, 0.45)"],
            [1, "rgba(105, 108, 255, 0.0)"],
          ],
        },
        lineColor: "#696cff",
        lineWidth: 3,
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
        data: current.points as (number | Highcharts.PointOptionsObject)[],
      },
    ],
  };

  const tabItems: TabItem[] = [
    { id: "INCOME", label: "INCOME" },
    { id: "EXPENSES", label: "EXPENSES" },
    { id: "PROFIT", label: "PROFIT" },
  ];

  return (
    <div className="bg-white rounded-[5px] p-6 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      {/* 3 Tabs at Top */}
      <div>
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as TabType)}
          renderContent={false}
          tabListClassName="flex items-center gap-1.5 p-1 bg-[#f8f7fa] rounded-lg w-fit"
        />

        {/* Total Label & Value */}
        <div className="mt-5">
          <p className="text-fs13 text-[#a5a3ae]">{current.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-fs24 font-bold text-[#32475c]">
              {current.value}
            </span>
            <span className="px-2 py-0.5 rounded text-fs12 font-medium bg-[#e8fadf] text-[#71dd37]">
              ↑ {current.percentage}
            </span>
          </div>
        </div>

        {/* Highcharts Area Spline Chart */}
        <div className="relative -mx-2 mt-1">
          <Chart options={chartOptions} />
          {/* Static reference Apr Tooltip Overlay matching screenshot */}
          {activeTab === "INCOME" && (
            <div className="absolute top-2 left-[52%] -translate-x-1/2 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-[#dbdade]/60 px-3 py-1 text-center pointer-events-none">
              <span className="text-[11px] text-[#a5a3ae] font-medium block">
                Apr
              </span>
              <span className="text-fs12 font-bold text-[#32475c] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#696cff]" />
                Sales: 42
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary Indicator */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#dbdade]/40 mt-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#696cff] flex items-center justify-center shrink-0">
          <span className="text-fs11 font-bold text-[#696cff]">
            {current.indicator}
          </span>
        </div>
        <div>
          <p className="text-fs14 font-semibold text-[#32475c] leading-tight">
            {current.summary}
          </p>
          <p className="text-fs12 text-[#a5a3ae] leading-tight mt-0.5">
            {current.subSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeChartCard;
