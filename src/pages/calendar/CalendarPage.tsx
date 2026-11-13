import React, { useState } from "react";
import Calendar from "@fullcalendar/react/all";
import { useCalendarController } from "@fullcalendar/react";
import "@fullcalendar/react/skeleton.css";
import "./calendarTheme.css";

import type {
  CalendarEvent,
  CalendarEventCategory,
  CalendarFilterState,
} from "../../api/types";
import {
  useCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useUpdateCalendarEventMutation,
} from "../../hooks/useCalendarQuery";
import CalendarHeaderToolbar, {
  type CalendarViewType,
} from "./components/CalendarHeaderToolbar";
import CalendarSidebar from "./components/CalendarSidebar";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import EventDrawer from "./components/EventDrawer";

const formatTime12 = (timeStr?: string): string => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m}${ampm}`;
};

const formatTimeShort = (timeStr?: string): string => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12;
  if (h === 0) h = 12;
  return m === "00" ? `${h}${ampm}` : `${h}:${m}${ampm}`;
};

export const CalendarPage: React.FC = () => {
  const calendar = useCalendarController();

  const [currentDate, setCurrentDate] = useState<Date>(new Date(2023, 2, 3));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2023, 2, 3));
  const [calendarTitle, setCalendarTitle] = useState("March 2023");
  const [activeView, setActiveView] =
    useState<CalendarViewType>("dayGridMonth");

  const [filters, setFilters] = useState<CalendarFilterState>({
    viewAll: true,
    personal: true,
    business: true,
    family: true,
    holiday: true,
    etc: true,
  });

  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] =
    useState<Partial<CalendarEvent> | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data: rawEvents = [], isLoading } = useCalendarEventsQuery();
  const createMutation = useCreateCalendarEventMutation();
  const updateMutation = useUpdateCalendarEventMutation();
  const deleteMutation = useDeleteCalendarEventMutation();

  const categoryStyles: Record<
    CalendarEventCategory,
    { bg: string; border: string; text: string; dotColor: string }
  > = {
    personal: {
      bg: "bg-[#ffe5e5]",
      border: "border-[#ff4c51]",
      text: "text-[#ff4c51]",
      dotColor: "#ff4c51",
    },
    business: {
      bg: "bg-[#ecebfd]",
      border: "border-[#696cff]",
      text: "text-[#696cff]",
      dotColor: "#696cff",
    },
    family: {
      bg: "bg-[#e8fadf]",
      border: "border-[#71dd37]",
      text: "text-[#71dd37]",
      dotColor: "#71dd37",
    },
    holiday: {
      bg: "bg-[#fff2d6]",
      border: "border-[#ffab00]",
      text: "text-[#ffab00]",
      dotColor: "#ffab00",
    },
    etc: {
      bg: "bg-[#e1f8fc]",
      border: "border-[#03c3ec]",
      text: "text-[#03c3ec]",
      dotColor: "#03c3ec",
    },
  };

  const filteredEvents = rawEvents.filter((evt) => {
    if (filters.viewAll) return true;
    return Boolean(filters[evt.category]);
  });

  const fcEvents = filteredEvents.map((evt) => {
    let start = evt.startDate;
    if (!evt.allDay && evt.startTime) {
      start = `${evt.startDate}T${evt.startTime}:00`;
    }

    let end = evt.endDate || evt.startDate;
    if (evt.allDay) {
      const d = new Date(end);
      d.setDate(d.getDate() + 1);
      end = d.toISOString().split("T")[0];
    } else if (evt.endTime) {
      end = `${evt.endDate || evt.startDate}T${evt.endTime}:00`;
    }

    const catStyle = categoryStyles[evt.category] || categoryStyles.business;

    return {
      id: evt.id,
      title: evt.title,
      start,
      end,
      allDay: evt.allDay,
      color: catStyle.dotColor,
      extendedProps: { ...evt },
    };
  });

  const handlePrev = () => {
    calendar.prev();
    const d = calendar.getDate();
    if (d) setCurrentDate(d);
  };

  const handleNext = () => {
    calendar.next();
    const d = calendar.getDate();
    if (d) setCurrentDate(d);
  };

  const handleViewChange = (view: CalendarViewType) => {
    setActiveView(view);
    const targetDate = selectedDate || new Date(2023, 2, 3);
    calendar.changeView(view);
    calendar.gotoDate(targetDate);
  };

  const handleSelectMiniCalendarDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    calendar.gotoDate(date);
  };

  const handleMiniCalendarMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleOpenAddEventDrawer = (initialDateStr?: string) => {
    setEditingEvent({
      startDate: initialDateStr || "2023-03-04",
      endDate: initialDateStr || "2023-03-04",
      startTime: "09:00",
      endTime: "10:00",
      category: "business",
      allDay: true,
    });
    setIsEventDrawerOpen(true);
  };

  const handleOpenEditEventDrawer = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventDrawerOpen(true);
  };

  const handleSaveEvent = (
    eventData: Omit<CalendarEvent, "id"> & { id?: string },
  ) => {
    if (eventData.id) {
      updateMutation.mutate(
        { id: eventData.id, updates: eventData },
        {
          onSuccess: () => {
            setIsEventDrawerOpen(false);
            setEditingEvent(null);
          },
        },
      );
    } else {
      createMutation.mutate(eventData, {
        onSuccess: () => {
          setIsEventDrawerOpen(false);
          setEditingEvent(null);
        },
      });
    }
  };

  const handlePromptDelete = (id: string, title?: string) => {
    const target = rawEvents.find((e) => e.id === id);
    setEventToDelete({ id, title: title || target?.title || "this event" });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    deleteMutation.mutate(eventToDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
        setIsEventDrawerOpen(false);
        setEditingEvent(null);
      },
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col min-w-0">
      <div className="w-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 flex flex-col md:flex-row min-h-[780px]">
        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          filters={filters}
          onAddEventClick={() => handleOpenAddEventDrawer()}
          onSelectDate={handleSelectMiniCalendarDate}
          onMonthChange={handleMiniCalendarMonthChange}
          onFilterChange={setFilters}
        />

        <main className="flex-1 flex flex-col min-w-0 p-4 md:p-6 bg-white overflow-hidden">
          <CalendarHeaderToolbar
            currentTitle={calendarTitle}
            activeView={activeView}
            onPrev={handlePrev}
            onNext={handleNext}
            onViewChange={handleViewChange}
          />

          <div className="calendar-wrapper flex-1 relative min-w-0 w-full overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
                <span className="text-fs15 font-medium text-[#696cff] animate-pulse">
                  Loading calendar...
                </span>
              </div>
            )}

            <Calendar
              controller={calendar}
              initialView="dayGridMonth"
              initialDate="2023-03-03"
              headerToolbar={false}
              height="auto"
              dayMaxEvents={2}
              events={fcEvents}
              editable={true}
              selectable={true}
              allDaySlot={true}
              allDayText="all-day"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              listDayHeaderClass="fc-custom-list-day-header"
              dayCellClass={(arg) =>
                [
                  arg.isOther ? "fc-day-other" : "",
                  arg.isToday ? "fc-day-today" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
              dayCellTopInnerClass={(arg) =>
                arg.isOther
                  ? "fc-daygrid-day-number fc-other-day-number"
                  : "fc-daygrid-day-number"
              }
              views={{
                dayGridMonth: {
                  dayHeaderFormat: { weekday: "short" },
                },
                timeGridWeek: {
                  dayHeaderFormat: {
                    weekday: "short",
                    month: "numeric",
                    day: "numeric",
                    omitCommas: true,
                  },
                  titleFormat: {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                },
                timeGridDay: {
                  dayHeaderFormat: { weekday: "long" },
                },
              }}
              datesSet={(dateInfo) => {
                setCalendarTitle(dateInfo.view.title);
                setCurrentDate(dateInfo.view.currentStart);
                if (dateInfo.view.type !== activeView) {
                  setActiveView(dateInfo.view.type as CalendarViewType);
                }
              }}
              dateClick={(arg) => {
                setSelectedDate(arg.date);
                handleOpenAddEventDrawer(arg.dateStr);
              }}
              eventClick={(info) => {
                const eventObj = info.event.extendedProps as CalendarEvent;
                handleOpenEditEventDrawer(eventObj);
              }}
              eventContent={(eventInfo) => {
                const props = eventInfo.event.extendedProps as CalendarEvent;
                const cat = props.category || "business";
                const style = categoryStyles[cat] || categoryStyles.business;

                if (eventInfo.view.type === "listMonth") {
                  let timeDisplay = "all-day";
                  if (!props.allDay && props.startTime) {
                    const start12 = formatTime12(props.startTime);
                    const end12 = props.endTime
                      ? formatTime12(props.endTime)
                      : "";
                    timeDisplay = end12 ? `${start12} - ${end12}` : start12;
                  }
                  return (
                    <div className="w-full flex items-center py-2.5 px-3 hover:bg-[#f8f7fa] transition cursor-pointer select-none">
                      <div className="w-36 sm:w-44 shrink-0 text-fs14 text-[#6f6b7d] font-normal lowercase">
                        {timeDisplay}
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: style.dotColor }}
                        />
                        <span className="text-fs14 font-medium text-[#5d596c] truncate">
                          {eventInfo.event.title}
                        </span>
                      </div>
                    </div>
                  );
                }

                let timePrefix = "";
                if (
                  !props.allDay &&
                  props.startTime &&
                  eventInfo.view.type === "dayGridMonth"
                ) {
                  timePrefix = formatTimeShort(props.startTime) + " ";
                }

                return (
                  <div
                    className={`w-full px-2.5 py-1 rounded-[4px] border ${style.bg} ${style.border} ${style.text} flex items-center justify-between transition-opacity hover:opacity-90 shadow-2xs overflow-hidden select-none cursor-pointer`}
                  >
                    <span className="text-fs13 font-medium truncate">
                      {timePrefix}
                      {eventInfo.event.title}
                    </span>
                  </div>
                );
              }}
            />
          </div>
        </main>
      </div>

      <EventDrawer
        key={editingEvent?.id || (isEventDrawerOpen ? "open-new" : "closed")}
        isOpen={isEventDrawerOpen}
        initialEvent={editingEvent}
        onClose={() => {
          setIsEventDrawerOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={(id) => handlePromptDelete(id, editingEvent?.title)}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Event"
        subtitle="This action cannot be undone."
        message={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-[#32475c]">"{eventToDelete?.title}"</strong>
            ?
          </>
        }
        confirmText="Delete Event"
        variant="danger"
        icon="trash"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CalendarPage;
