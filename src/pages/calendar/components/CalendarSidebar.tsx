import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import type { CalendarFilterState } from "../../../api/types";
import CalendarFilter from "./CalendarFilter";
import MiniCalendar from "./MiniCalendar";

interface CalendarSidebarProps {
  currentDate: Date;
  selectedDate: Date;
  filters: CalendarFilterState;
  onAddEventClick: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: (newDate: Date) => void;
  onFilterChange: (filters: CalendarFilterState) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentDate,
  selectedDate,
  filters,
  onAddEventClick,
  onSelectDate,
  onMonthChange,
  onFilterChange,
}) => {
  return (
    <aside className="w-full md:w-[260px] lg:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-[#dbdade]/50 p-6 flex flex-col gap-6 bg-white">
      <CustomButton
        variant="primary"
        onClick={onAddEventClick}
        className="w-full !h-10 uppercase tracking-wider font-medium text-fs15 rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span className="text-fs19 font-light leading-none">+</span>
        <span>ADD EVENT</span>
      </CustomButton>

      <div className="pt-2">
        <MiniCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onMonthChange={onMonthChange}
        />
      </div>

      <div className="h-px bg-[#dbdade]/40 w-full" />

      <CalendarFilter filters={filters} onFilterChange={onFilterChange} />
    </aside>
  );
};

export default CalendarSidebar;
