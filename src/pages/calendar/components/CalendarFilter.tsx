import React from "react";
import type { CalendarEventCategory, CalendarFilterState } from "../../../api/types";

interface CalendarFilterProps {
  filters: CalendarFilterState;
  onFilterChange: (filters: CalendarFilterState) => void;
}

export const CalendarFilter: React.FC<CalendarFilterProps> = ({
  filters,
  onFilterChange,
}) => {
  const filterConfig: Array<{
    key: keyof CalendarFilterState;
    label: string;
    color: string;
  }> = [
    { key: "viewAll", label: "view All", color: "#696cff" },
    { key: "personal", label: "personal", color: "#ff4c51" },
    { key: "business", label: "Business", color: "#696cff" },
    { key: "family", label: "Family", color: "#ffab00" },
    { key: "holiday", label: "Holiday", color: "#71dd37" },
    { key: "etc", label: "ETC", color: "#03c3ec" },
  ];

  const handleToggle = (key: keyof CalendarFilterState) => {
    if (key === "viewAll") {
      const nextViewAll = !filters.viewAll;
      onFilterChange({
        viewAll: nextViewAll,
        personal: nextViewAll,
        business: nextViewAll,
        family: nextViewAll,
        holiday: nextViewAll,
        etc: nextViewAll,
      });
      return;
    }

    const nextFilters = {
      ...filters,
      [key]: !filters[key],
    };

    const allCategories: CalendarEventCategory[] = [
      "personal",
      "business",
      "family",
      "holiday",
      "etc",
    ];
    const allChecked = allCategories.every((cat) => nextFilters[cat]);
    nextFilters.viewAll = allChecked;

    onFilterChange(nextFilters);
  };

  return (
    <div className="w-full select-none">
      <h3 className="text-fs12 font-semibold uppercase tracking-wider text-[#a5a3ae] mb-3">
        FILTER
      </h3>

      <div className="flex flex-col space-y-2.5">
        {filterConfig.map((item) => {
          const isChecked = filters[item.key];
          return (
            <label
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                style={{
                  backgroundColor: isChecked ? item.color : "transparent",
                  borderColor: isChecked ? item.color : "#dbdade",
                }}
                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0`}
              >
                {isChecked && (
                  <svg
                    className="w-2.5 h-2.5 text-white stroke-[3]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <span
                className={`text-fs14 transition-colors ${
                  isChecked
                    ? "text-[#5d596c]"
                    : "text-[#a5a3ae] group-hover:text-[#6f6b7d]"
                }`}
              >
                {item.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarFilter;
