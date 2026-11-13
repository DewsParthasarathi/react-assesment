import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";

export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listMonth";

interface CalendarHeaderToolbarProps {
  currentTitle: string;
  activeView: CalendarViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
  onViewChange: (view: CalendarViewType) => void;
}

export const CalendarHeaderToolbar: React.FC<CalendarHeaderToolbarProps> = ({
  currentTitle,
  activeView,
  onPrev,
  onNext,
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
      <div className="flex items-center gap-3">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={onPrev}
          title="Previous"
          className="!p-1 !h-auto text-[#5d596c] hover:text-[#696cff] transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </CustomButton>

        <CustomButton
          type="button"
          variant="ghost"
          onClick={onNext}
          title="Next"
          className="!p-1 !h-auto text-[#5d596c] hover:text-[#696cff] transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </CustomButton>

        <h2 className="text-fs17 md:text-fs19 font-medium text-[#5d596c] tracking-tight">
          {currentTitle}
        </h2>
      </div>

      <div className="inline-flex items-center p-1 bg-[#ecebfd]/70 rounded-[6px]">
        {views.map((v) => {
          const isActive = activeView === v.type;
          return (
            <CustomButton
              key={v.type}
              type="button"
              variant={isActive ? "primary" : "ghost"}
              onClick={() => onViewChange(v.type)}
              className={`!px-3.5 !py-1.5 !h-auto rounded-[5px] text-fs14 font-medium transition cursor-pointer ${
                isActive
                  ? "!bg-[#696cff] hover:!bg-[#5f61e6] !text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
                  : "!bg-transparent !text-[#696cff] hover:!bg-[#696cff]/10 hover:!text-[#696cff]"
              }`}
            >
              {v.label}
            </CustomButton>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarHeaderToolbar;
