import React, { useMemo } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onMonthChange: (newDate: Date) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  onMonthChange,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    onMonthChange(next);
  };

  const daysGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, totalDaysInPrevMonth - i);
      days.push({
        date: d,
        dayNumber: totalDaysInPrevMonth - i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
      });
    }

    const today = new Date();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      const isSelected =
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === i;
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === i;

      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        isSelected,
        isToday,
      });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
          date: d,
          dayNumber: i,
          isCurrentMonth: false,
          isSelected: false,
          isToday: false,
        });
      }
    }

    return days;
  }, [year, month, selectedDate]);

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-4">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={handlePrevMonth}
          title="Previous Month"
          className="!w-6 !h-6 !p-0 rounded bg-[#f5f5f9] hover:bg-[#ebebee] text-[#5d596c] flex items-center justify-center transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </CustomButton>

        <span className="text-fs15 font-medium text-[#5d596c]">
          {monthNames[month]} {year}
        </span>

        <CustomButton
          type="button"
          variant="ghost"
          onClick={handleNextMonth}
          title="Next Month"
          className="!w-6 !h-6 !p-0 rounded bg-[#f5f5f9] hover:bg-[#ebebee] text-[#5d596c] flex items-center justify-center transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </CustomButton>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
          <div key={idx} className="text-fs13 font-medium text-[#a5a3ae]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
        {daysGrid.map((item, idx) => {
          return (
            <CustomButton
              key={idx}
              type="button"
              variant="ghost"
              onClick={() => onSelectDate(item.date)}
              className={`!h-7 !w-7 !p-0 mx-auto rounded text-fs13 flex items-center justify-center transition cursor-pointer ${
                item.isSelected
                  ? "border border-[#696cff] bg-[#696cff]/10 text-[#696cff] font-medium"
                  : item.isCurrentMonth
                  ? "text-[#5d596c] hover:bg-[#f5f5f9]"
                  : "text-[#a5a3ae]/60 hover:text-[#5d596c]"
              }`}
            >
              {item.dayNumber}
            </CustomButton>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
