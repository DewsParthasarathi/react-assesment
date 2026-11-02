import React, { useMemo } from "react";

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

  // Generate 7x5 or 7x6 day grid
  const daysGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    // Prev month days
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

    // Current month days
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

    // Next month days to fill up to complete weeks (multiple of 7)
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
      {/* Month Header matching 06_Calender.png */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          title="Previous Month"
          className="w-6 h-6 rounded bg-[#f5f5f9] hover:bg-[#ebebee] text-[#5d596c] flex items-center justify-center transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-fs14 font-medium text-[#5d596c]">
          {monthNames[month]} {year}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          title="Next Month"
          className="w-6 h-6 rounded bg-[#f5f5f9] hover:bg-[#ebebee] text-[#5d596c] flex items-center justify-center transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekdays Row matching reference images: Su Mo Tu We Th Fr Sa */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
          <div key={idx} className="text-fs12 font-medium text-[#a5a3ae]">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
        {daysGrid.map((item, idx) => {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`h-7 w-7 mx-auto rounded text-fs12 flex items-center justify-center transition cursor-pointer ${
                item.isSelected
                  ? "border border-[#696cff] bg-[#696cff]/10 text-[#696cff] font-medium"
                  : item.isCurrentMonth
                  ? "text-[#5d596c] hover:bg-[#f5f5f9]"
                  : "text-[#a5a3ae]/60 hover:text-[#5d596c]"
              }`}
            >
              {item.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;

