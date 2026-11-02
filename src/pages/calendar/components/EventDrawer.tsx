import React, { useState } from "react";
import type { CalendarEvent, CalendarEventCategory } from "../../../api/types";

interface EventDrawerProps {
  isOpen: boolean;
  initialEvent?: Partial<CalendarEvent> | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  isSaving?: boolean;
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  isOpen,
  initialEvent,
  onClose,
  onSave,
  onDelete,
  isSaving = false,
}) => {
  const isEditMode = Boolean(initialEvent?.id);
  const todayStr = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [category, setCategory] = useState<CalendarEventCategory>(
    initialEvent?.category || "business",
  );
  const [startDate, setStartDate] = useState(
    initialEvent?.startDate || todayStr,
  );
  const [startTime, setStartTime] = useState(
    initialEvent?.startTime || "09:00",
  );
  const [endDate, setEndDate] = useState(
    initialEvent?.endDate || initialEvent?.startDate || todayStr,
  );
  const [endTime, setEndTime] = useState(initialEvent?.endTime || "10:00");
  const [allDay, setAllDay] = useState(
    initialEvent?.allDay !== undefined ? initialEvent.allDay : true,
  );
  const [url, setUrl] = useState(initialEvent?.url || "");
  const [guests, setGuests] = useState(initialEvent?.guests || "");
  const [description, setDescription] = useState(
    initialEvent?.description || "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Event title is required";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    }
    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = "End date cannot be earlier than start date";
    }
    if (
      startDate &&
      endDate &&
      startDate === endDate &&
      !allDay &&
      startTime &&
      endTime &&
      endTime <= startTime
    ) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSaving) return;

    onSave({
      ...(initialEvent?.id ? { id: initialEvent.id } : {}),
      title: title.trim(),
      category,
      startDate,
      startTime: allDay ? "" : startTime,
      endDate: endDate || startDate,
      endTime: allDay ? "" : endTime,
      allDay,
      url: url.trim(),
      guests: guests.trim(),
      description: description.trim(),
    });
  };

  const handleReset = () => {
    if (isEditMode && initialEvent) {
      setTitle(initialEvent.title || "");
      setCategory(initialEvent.category || "business");
      setStartDate(initialEvent.startDate || todayStr);
      setStartTime(initialEvent.startTime || "09:00");
      setEndDate(initialEvent.endDate || initialEvent.startDate || todayStr);
      setEndTime(initialEvent.endTime || "10:00");
      setAllDay(initialEvent.allDay !== undefined ? initialEvent.allDay : true);
      setUrl(initialEvent.url || "");
      setGuests(initialEvent.guests || "");
      setDescription(initialEvent.description || "");
    } else {
      setTitle("");
      setCategory("business");
      setStartDate(todayStr);
      setStartTime("09:00");
      setEndDate(todayStr);
      setEndTime("10:00");
      setAllDay(true);
      setUrl("");
      setGuests("");
      setDescription("");
    }
    setErrors({});
  };

  const categoryOptions: Array<{ value: CalendarEventCategory; label: string }> = [
    { value: "business", label: "Business" },
    { value: "personal", label: "Personal" },
    { value: "family", label: "Family" },
    { value: "holiday", label: "Holiday" },
    { value: "etc", label: "ETC" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Background Dimmed Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2f3349]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Right-Side Sliding Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#dbdade]/60">
            <h3 className="text-fs18 font-medium text-[#5d596c]">
              {isEditMode ? "Update Event" : "Add Event"}
            </h3>

            <div className="flex items-center gap-2">
              {/* Trash Icon for Deleting in Edit Mode */}
              {isEditMode && onDelete && initialEvent?.id && (
                <button
                  type="button"
                  onClick={() => onDelete(initialEvent.id!)}
                  title="Delete Event"
                  className="p-1.5 text-[#a5a3ae] hover:text-[#ff4c51] rounded transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="p-1.5 text-[#a5a3ae] hover:text-[#5d596c] rounded transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Drawer Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Title Input */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={`w-full h-11 px-3.5 rounded-[6px] border text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden ${
                  errors.title
                    ? "border-[#ff4c51] focus:border-[#ff4c51]"
                    : "border-[#dbdade] focus:border-[#696cff]"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-fs12 text-[#ff4c51]">{errors.title}</p>
              )}
            </div>

            {/* Calendar (Category) Select */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Calendar
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarEventCategory)}
                className="w-full h-11 px-3.5 pr-8 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff] cursor-pointer appearance-none capitalize"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a5a3ae]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Start Date */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-[6px] border text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden ${
                  errors.startDate
                    ? "border-[#ff4c51] focus:border-[#ff4c51]"
                    : "border-[#dbdade] focus:border-[#696cff]"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-fs12 text-[#ff4c51]">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-[6px] border text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden ${
                  errors.endDate
                    ? "border-[#ff4c51] focus:border-[#ff4c51]"
                    : "border-[#dbdade] focus:border-[#696cff]"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-fs12 text-[#ff4c51]">{errors.endDate}</p>
              )}
            </div>

            {/* All Day Toggle Switch */}
            <div className="flex items-center gap-3 select-none py-1">
              <button
                type="button"
                role="switch"
                aria-checked={allDay}
                onClick={() => setAllDay(!allDay)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  allDay ? "bg-[#696cff]" : "bg-[#dbdade]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    allDay ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className="text-fs14 text-[#5d596c] font-normal cursor-pointer"
                onClick={() => setAllDay(!allDay)}
              >
                All Day
              </span>
            </div>

            {/* Times when not All Day */}
            {!allDay && (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff]"
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff]"
                  />
                </div>
              </div>
            )}

            {/* Event URL */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Event URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Event URL"
                className="w-full h-11 px-3.5 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff]"
              />
            </div>

            {/* Guests Select */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full h-11 px-3.5 pr-8 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff] cursor-pointer appearance-none"
              >
                <option value="">Guests</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="John Doe">John Doe</option>
                <option value="Robert Johnson">Robert Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
                <option value="Michael Brown">Michael Brown</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#a5a3ae]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-fs12 text-[#a5a3ae] font-normal z-10">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-3.5 rounded-[6px] border border-[#dbdade] text-fs14 text-[#5d596c] bg-white transition focus:outline-hidden focus:border-[#696cff] resize-none"
              />
            </div>

            {/* Action Buttons: ADD/UPDATE and RESET */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#696cff] hover:bg-[#5f61e6] text-white font-medium text-fs14 uppercase rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)] transition cursor-pointer"
              >
                {isSaving ? "Saving..." : isEditMode ? "UPDATE" : "ADD"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-white border border-[#dbdade] hover:border-[#c7c5ca] text-[#8592a3] hover:text-[#5d596c] font-medium text-fs14 uppercase rounded-[6px] transition cursor-pointer"
              >
                RESET
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDrawer;
