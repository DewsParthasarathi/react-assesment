import React from "react";

export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listMonth";

interface CalendarHeaderToolbarProps {
  currentTitle: string;
  activeView: CalendarViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
}

export const CalendarHeaderToolbar: React.FC<CalendarHeaderToolbarProps> = ({
  currentTitle,
  activeView,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}) => {
  const views: Array<{ type: CalendarViewType; label: string }> = [
    { type: "dayGridMonth", label: "Month" },
    { type: "timeGridWeek", label: "Week" },
    { type: "timeGridDay", label: "Day" },
    { type: "listMonth", label: "List" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-2 border-b border-[#dbdade]/50 select-none">
      {/* Left: Chevrons & Title matching 06_Calender.png */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          title="Previous"
          className="text-[#5d596c] hover:text-[#696cff] p-1 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onNext}
          title="Next"
          className="text-[#5d596c] hover:text-[#696cff] p-1 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <h2 className="text-fs18 md:text-fs20 font-medium text-[#5d596c] tracking-tight">
          {currentTitle}
        </h2>

        <button
          type="button"
          onClick={onToday}
          title="Go to Today"
          className="ml-2 text-fs12 font-medium px-2.5 py-1 rounded border border-[#dbdade] text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] transition cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* Right: Segmented view switcher matching 06_Calender.png */}
      <div className="inline-flex items-center p-1 bg-[#ecebfd]/70 rounded-[6px]">
        {views.map((v) => {
          const isActive = activeView === v.type;
          return (
            <button
              key={v.type}
              type="button"
              onClick={() => onViewChange(v.type)}
              className={`px-3.5 py-1.5 rounded-[5px] text-fs13 font-medium transition cursor-pointer ${
                isActive
                  ? "bg-[#696cff] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
                  : "text-[#696cff] hover:bg-[#696cff]/10"
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarHeaderToolbar;

