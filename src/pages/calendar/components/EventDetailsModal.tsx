import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import type { CalendarEvent } from "../../../api/types";

interface EventDetailsModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !event) return null;

  const categoryConfig: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    personal: {
      label: "Personal",
      bg: "bg-[#ffe5e5]",
      text: "text-[#ff4c51]",
      border: "border-[#ff4c51]",
    },
    business: {
      label: "Business",
      bg: "bg-[#ecebfd]",
      text: "text-[#696cff]",
      border: "border-[#696cff]",
    },
    family: {
      label: "Family",
      bg: "bg-[#e8fadf]",
      text: "text-[#71dd37]",
      border: "border-[#71dd37]",
    },
    holiday: {
      label: "Holiday",
      bg: "bg-[#fff2d6]",
      text: "text-[#ffab00]",
      border: "border-[#ffab00]",
    },
    etc: {
      label: "ETC",
      bg: "bg-[#e1f8fc]",
      text: "text-[#03c3ec]",
      border: "border-[#03c3ec]",
    },
  };

  const style = categoryConfig[event.category] || categoryConfig.etc;

  const formatDateDisplay = () => {
    if (event.startDate === event.endDate || !event.endDate) {
      return event.startDate;
    }
    return `${event.startDate} — ${event.endDate}`;
  };

  const formatTimeDisplay = () => {
    if (event.allDay) return "All Day";
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    if (event.startTime) return event.startTime;
    return "All Day";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-[#dbdade]/70 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dbdade]/50 bg-[#fafafb]">
          <div className="flex items-center gap-2">
            <span
              className={`text-fs12 font-medium px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
            >
              {style.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-fs18 font-semibold text-[#32475c] leading-snug">
            {event.title}
          </h2>

          {/* Date & Time */}
          <div className="flex items-start gap-3 text-fs14 text-[#5d596c]">
            <svg
              className="w-5 h-5 text-[#696cff] shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="font-medium text-[#32475c]">{formatDateDisplay()}</p>
              <p className="text-fs13 text-[#6f6b7d]">{formatTimeDisplay()}</p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3 text-fs14 text-[#5d596c]">
              <svg
                className="w-5 h-5 text-[#696cff] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{event.location}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="pt-2 border-t border-[#dbdade]/50">
              <p className="text-fs12 font-semibold uppercase tracking-wider text-[#a5a3ae] mb-1">
                Description
              </p>
              <p className="text-fs14 text-[#6f6b7d] whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#fafafb] border-t border-[#dbdade]/50">
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="text-fs13 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition cursor-pointer"
          >
            Delete
          </button>

          <div className="flex items-center gap-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              className="!h-9 px-4 text-fs13"
            >
              Close
            </CustomButton>

            <CustomButton
              type="button"
              variant="primary"
              onClick={() => onEdit(event)}
              className="!h-9 px-4 text-fs13 shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
            >
              Edit Event
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

