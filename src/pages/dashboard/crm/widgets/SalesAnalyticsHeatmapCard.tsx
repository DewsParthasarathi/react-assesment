import React, { useState } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import type { SalesAnalyticsData } from "../../../../api/types";

interface SalesAnalyticsHeatmapCardProps {
  data?: SalesAnalyticsData;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
}

export const SalesAnalyticsHeatmapCard: React.FC<SalesAnalyticsHeatmapCardProps> = ({
  data,
  selectedYear: controlledYear,
  onYearChange,
}) => {
  const [internalYear, setInternalYear] = useState<string>("2023");
  const [hoveredCell, setHoveredCell] = useState<{ month: string; y: string; value: number } | null>(null);

  if (!data) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-44 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  const activeYear = controlledYear || internalYear || data.selectedYear || "2023";
  const availableYears = data.availableYears || ["2023", "2022", "2021"];
  const yearData = data.years?.[activeYear];
  const badge = yearData?.badge || data.badge || "+5.0";
  const months = data.months || [];
  const yCategories = data.yCategories || [];
  const matrix = yearData?.matrix || data.matrix || [];

  const handleYearSelect = (yr: string) => {
    setInternalYear(yr);
    if (onYearChange) {
      onYearChange(yr);
    }
  };

  const getCellColor = (val: number) => {
    switch (val) {
      case 3:
        return "#696cff"; // Dark vibrant purple
      case 2:
        return "#8f93ff"; // Medium purple
      case 1:
        return "#cfd3fb"; // Soft lavender
      case 0:
      default:
        return "#e7e7ff"; // Light lavender background cell
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full relative">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-fs22 font-medium text-[#444050]">Sales Analytics</h3>

          {/* Year selector using reusable CustomDropdown */}
          <div className="relative w-20">
            <CustomDropdown
              options={availableYears.map((yr) => ({ label: yr, value: yr }))}
              value={activeYear}
              onChange={(val) => handleYearSelect(String(val))}
              containerClassName="!w-20"
              className="!h-7 !py-0.5 !px-2 !text-fs12 !font-medium !text-[#696cff] !border-[#696cff] hover:!bg-[#e7e7ff]/30 !rounded"
            />
          </div>
        </div>

        {/* Subtitle badge */}
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-[#e8fadf] text-[#71dd37] text-fs12 font-semibold px-2 py-0.5 rounded">
            {badge}
          </span>
          <span className="text-fs12 text-[#a5a3ae]">Than Last year</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-4 flex">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between text-fs12 text-[#a5a3ae] pr-2.5 py-0.5 select-none text-right w-6">
          {yCategories.map((y) => (
            <span key={y} className="h-4 leading-4">
              {y}
            </span>
          ))}
        </div>

        {/* Matrix Container */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="grid grid-rows-8 gap-1 w-full">
            {matrix.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-8 gap-1 h-4">
                {row.map((cellVal, colIdx) => {
                  const mName = months[colIdx] || "";
                  const yVal = yCategories[rowIdx] || "";
                  return (
                    <div
                      key={colIdx}
                      onMouseEnter={() =>
                        setHoveredCell({ month: mName, y: yVal, value: cellVal })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ backgroundColor: getCellColor(cellVal) }}
                      className="rounded-[3px] transition-all hover:scale-105 cursor-pointer relative"
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="grid grid-cols-8 gap-1 text-center text-fs12 text-[#a5a3ae] mt-2 select-none">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip on hover */}
      {hoveredCell && (
        <div className="absolute bottom-12 right-6 bg-[#23272e] text-white text-fs12 py-1 px-2.5 rounded shadow pointer-events-none">
          {hoveredCell.month} ({hoveredCell.y}): Level {hoveredCell.value}
        </div>
      )}
    </div>
  );
};

export default SalesAnalyticsHeatmapCard;
