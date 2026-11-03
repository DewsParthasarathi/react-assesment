import React, { useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomModal } from "../../../components/ui/CustomModal";
import { CustomInput } from "../../../components/ui/CustomInput";
import { CustomCheckbox } from "../../../components/ui/CustomCheckbox";
import { CustomDropdown } from "../../../components/ui/CustomDropdown";
import type { CalendarEvent, CalendarEventCategory } from "../../../api/types";

interface EventModalProps {
  isOpen: boolean;
  initialEvent?: Partial<CalendarEvent> | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  isSaving?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
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
  const [allDay, setAllDay] = useState(Boolean(initialEvent?.allDay));
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [description, setDescription] = useState(
    initialEvent?.description || "",
  );
  const [color, setColor] = useState(initialEvent?.color || "");
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
    if (startDate && endDate && startDate === endDate && !allDay && startTime && endTime && endTime <= startTime) {
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
      location: location.trim(),
      description: description.trim(),
      color: color.trim(),
    });
  };

  const categoryOptions: Array<{ value: CalendarEventCategory; label: string; color: string }> = [
    { value: "business", label: "Business", color: "#696cff" },
    { value: "personal", label: "Personal", color: "#ff4c51" },
    { value: "family", label: "Family", color: "#ffab00" },
    { value: "holiday", label: "Holiday", color: "#71dd37" },
    { value: "etc", label: "ETC", color: "#03c3ec" },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Event" : "Add Event"}
      size="lg"
      bodyClassName="!p-0"
    >
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <CustomInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales Team Meeting"
              error={errors.title}
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          {/* Category using CustomDropdown */}
          <div>
            <CustomDropdown
              label="Category"
              value={category}
              onChange={(val) => setCategory(String(val) as CalendarEventCategory)}
              sizeVariant="md"
              options={categoryOptions.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
            />
          </div>

          {/* All Day Checkbox */}
          <div className="flex items-center gap-2">
            <CustomCheckbox
              id="allDayCheckbox"
              label="All Day Event"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <CustomInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                error={errors.startDate}
                sizeVariant="md"
                className="!px-3 rounded-[6px]"
              />
            </div>

            {/* Start Time */}
            {!allDay && (
              <div>
                <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
                  Start Time
                </label>
                <CustomInput
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  sizeVariant="md"
                  className="!px-3 rounded-[6px]"
                />
              </div>
            )}

            {/* End Date */}
            <div>
              <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <CustomInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                error={errors.endDate}
                sizeVariant="md"
                className="!px-3 rounded-[6px]"
              />
            </div>

            {/* End Time */}
            {!allDay && (
              <div>
                <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
                  End Time
                </label>
                <CustomInput
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  error={errors.endTime}
                  sizeVariant="md"
                  className="!px-3 rounded-[6px]"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Location
            </label>
            <CustomInput
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Conference Room A, Zoom"
              sizeVariant="md"
              className="rounded-[6px]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting notes or event details..."
              className="w-full p-3 rounded-[6px] border border-[#dbdade] text-fs14 text-[#32475c] bg-white transition focus:outline-hidden focus:border-[#696cff] resize-none"
            />
          </div>

          {/* Event Color */}
          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-1">
              Event Color
            </label>
            <div className="flex items-center gap-3">
              <CustomInput
                type="color"
                value={
                  color ||
                  categoryOptions.find((c) => c.value === category)?.color ||
                  "#696cff"
                }
                onChange={(e) => setColor(e.target.value)}
                containerClassName="w-auto"
                className="!w-9 !h-9 !p-0.5 rounded-[6px] border border-[#dbdade] bg-white cursor-pointer"
              />
              <span className="text-fs13 text-[#6f6b7d]">
                {color ? color : "Auto-matched by category"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#dbdade]/50">
            {isEditMode && onDelete && initialEvent?.id ? (
              <button
                type="button"
                onClick={() => onDelete(initialEvent.id!)}
                className="text-fs13 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded transition cursor-pointer"
              >
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <CustomButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="!h-9 px-4 text-fs13"
              >
                Cancel
              </CustomButton>

              <CustomButton
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="!h-9 px-5 text-fs13 shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
              >
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Event"
                  : "Add Event"}
              </CustomButton>
            </div>
          </div>
        </form>
    </CustomModal>
  );
};

export default EventModal;
