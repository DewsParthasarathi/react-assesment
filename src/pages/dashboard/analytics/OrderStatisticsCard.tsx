import React, { useState } from "react";
import Highcharts from "highcharts";
import { Chart } from "../../../components/ui/Chart";
import YearSelectionPopup from "../../../components/ui/YearSelectionPopup";
import electronicIcon from "../../../assets/images/Electronic.svg";
import fashionIcon from "../../../assets/images/Fashion.svg";
import decorIcon from "../../../assets/images/Decor.svg";
import sportsIcon from "../../../assets/images/Sports.svg";

interface OrderStatisticsCardProps {
  totalSales?: string;
  totalOrders?: string;
  growth?: string;
  years?: Record<
    string,
    {
      totalSales?: string;
      totalOrders?: string;
      growth?: string;
      chartSeries?: Array<{
        name: string;
        y: number;
        color?: string;
      }>;
      categories?: Array<{
        name: string;
        description: string;
        value: string;
      }>;
    }
  >;
  availableYears?: string[];
}

export const OrderStatisticsCard: React.FC<OrderStatisticsCardProps> = ({
  totalSales = "42.82K Total Sales",
  totalOrders = "8,258",
  growth = "38%",
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const active = years && years[selectedYear] ? years[selectedYear] : { totalSales, totalOrders, growth };
  const displayTotalSales = active.totalSales ?? totalSales;
  const displayTotalOrders = active.totalOrders ?? totalOrders;
  const displayGrowth = active.growth ?? growth;

  const chartSeries = active.chartSeries || (selectedYear === "2022" ? [
    { name: "Electronic", y: 30, color: "#696cff" },
    { name: "Fashion", y: 38, color: "#71dd37" },
    { name: "Decor", y: 20, color: "#03c3ec" },
    { name: "Sports", y: 12, color: "#ffab00" },
  ] : [
    { name: "Electronic", y: 45, color: "#696cff" },
    { name: "Fashion", y: 28, color: "#71dd37" },
    { name: "Decor", y: 17, color: "#03c3ec" },
    { name: "Sports", y: 10, color: "#ffab00" },
  ]);

  const donutOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      width: 120,
      height: 120,
      backgroundColor: "transparent",
      margin: [0, 0, 0, 0],
      spacing: [0, 0, 0, 0],
    },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      pointFormat: "<b>{point.name}</b>: {point.percentage:.1f}%",
      backgroundColor: "#ffffff",
      borderColor: "#dbdade",
      borderRadius: 6,
      style: { fontSize: "11px", fontFamily: "Poppins" },
    },
    plotOptions: {
      pie: {
        innerSize: "75%",
        borderWidth: 2,
        borderColor: "#ffffff",
        dataLabels: { enabled: false },
      },
    },
    series: [
      {
        type: "pie",
        name: "Categories",
        data: chartSeries,
      },
    ],
  };

  const defaultCategories = [
    {
      name: "Electronic",
      description: "Mobile, Earbuds, TV",
      value: "82.5k",
      icon: electronicIcon,
      bg: "bg-[#ea5455]/15",
    },
    {
      name: "Fashion",
      description: "Tshirt, Jeans, Shoes",
      value: "23.8k",
      icon: fashionIcon,
      bg: "bg-[#696cff]/15",
    },
    {
      name: "Decor",
      description: "Fine Art, Dining",
      value: "849",
      icon: decorIcon,
      bg: "bg-[#03c3ec]/15",
    },
    {
      name: "Sports",
      description: "Football, Cricket Kit",
      value: "99",
      icon: sportsIcon,
      bg: "bg-[#8592a3]/15",
    },
  ];

  const categories = defaultCategories.map((c) => {
    const override = active.categories?.find((item) => item.name === c.name);
    return override ? { ...c, value: override.value } : c;
  });

  return (
    <div className="bg-white rounded-[5px] p-6 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs22 font-medium text-[#444050]">
            Order Statistics
          </h3>
          <YearSelectionPopup
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            availableYears={availableYears}
          >
            <button
              type="button"
              aria-label="Options"
              className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </YearSelectionPopup>
        </div>
        <p className="text-fs16 text-[#a5a3ae] mt-0.5">{displayTotalSales}</p>

        {/* Orders Count and Donut Chart */}
        <div className="flex items-center justify-between my-5">
          <div>
            <span className="text-fs32 font-bold text-[#32475c] leading-none block">
              {displayTotalOrders}
            </span>
            <span className="text-fs13 text-[#a5a3ae] mt-1 block">
              Total Orders
            </span>
          </div>
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            <Chart key={selectedYear} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-fs18 font-bold text-[#444050] leading-none">{displayGrowth}</span>
              <span className="text-fs11 text-[#a5a3ae] leading-none mt-1">Growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4 pt-2">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center p-2.5 shrink-0`}
              >
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-fs18 font-medium text-[#444050] leading-tight">
                  {cat.name}
                </p>
                <p className="text-fs16 text-[#a5a3ae] leading-tight mt-1">
                  {cat.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-fs16 font-medium text-[#444050]">
                {cat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatisticsCard;
