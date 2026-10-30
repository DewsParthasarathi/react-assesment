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
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EventDetailsModal from "./components/EventDetailsModal";
import EventModal from "./components/EventModal";

export const CalendarPage: React.FC = () => {
  const calendar = useCalendarController();

  // Initial reference date: Jan 23, 2023 matching 06_Calender.png
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2023, 0, 15));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2023, 0, 23));
  const [calendarTitle, setCalendarTitle] = useState("January 2023");
  const [activeView, setActiveView] = useState<CalendarViewType>("dayGridMonth");

  // Filters matching 06_Calender.png
  const [filters, setFilters] = useState<CalendarFilterState>({
    viewAll: true,
    personal: true,
    business: true,
    family: true,
    holiday: true,
    etc: true,
  });

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<CalendarEvent | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);

  // TanStack Query
  const { data: rawEvents = [], isLoading } = useCalendarEventsQuery();
  const createMutation = useCreateCalendarEventMutation();
  const updateMutation = useUpdateCalendarEventMutation();
  const deleteMutation = useDeleteCalendarEventMutation();

  // Category visual styles matching 06_Calender.png
  const categoryStyles: Record<
    CalendarEventCategory,
    { bg: string; border: string; text: string }
  > = {
    personal: {
      bg: "bg-[#ffe5e5]",
      border: "border-[#ff4c51]",
      text: "text-[#ff4c51]",
    },
    business: {
      bg: "bg-[#ecebfd]",
      border: "border-[#696cff]",
      text: "text-[#696cff]",
    },
    family: {
      bg: "bg-[#e8fadf]",
      border: "border-[#71dd37]",
      text: "text-[#71dd37]",
    },
    holiday: {
      bg: "bg-[#fff2d6]",
      border: "border-[#ffab00]",
      text: "text-[#ffab00]",
    },
    etc: {
      bg: "bg-[#e1f8fc]",
      border: "border-[#03c3ec]",
      text: "text-[#03c3ec]",
    },
  };

  // Filter events based on active category checkboxes
  const filteredEvents = rawEvents.filter((evt) => {
    if (filters.viewAll) return true;
    return Boolean(filters[evt.category]);
  });

  // Map to FullCalendar event format
  const fcEvents = filteredEvents.map((evt) => {
    let start = evt.startDate;
    if (!evt.allDay && evt.startTime) {
      start = `${evt.startDate}T${evt.startTime}:00`;
    }

    let end = evt.endDate || evt.startDate;
    if (evt.allDay) {
      // FullCalendar allDay end is exclusive
      const d = new Date(end);
      d.setDate(d.getDate() + 1);
      end = d.toISOString().split("T")[0];
    } else if (evt.endTime) {
      end = `${evt.endDate || evt.startDate}T${evt.endTime}:00`;
    }

    return {
      id: evt.id,
      title: evt.title,
      start,
      end,
      allDay: evt.allDay,
      extendedProps: { ...evt },
    };
  });

  // Navigation handlers
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

  const handleToday = () => {
    calendar.today();
    const today = calendar.getDate() || new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleViewChange = (view: CalendarViewType) => {
    setActiveView(view);
    calendar.changeView(view);
  };

  const handleSelectMiniCalendarDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    calendar.gotoDate(date);
  };

  const handleMiniCalendarMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendar.gotoDate(newDate);
  };

  // CRUD Handlers
  const handleOpenAddEventModal = (initialDateStr?: string) => {
    setEditingEvent({
      startDate: initialDateStr || new Date().toISOString().split("T")[0],
      endDate: initialDateStr || new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      category: "business",
      allDay: false,
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (eventData.id) {
      updateMutation.mutate(
        { id: eventData.id, updates: eventData },
        {
          onSuccess: () => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
            setIsDetailsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(eventData, {
        onSuccess: () => {
          setIsEventModalOpen(false);
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
        setIsDetailsModalOpen(false);
        setIsEventModalOpen(false);
      },
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col min-w-0">
      {/* Outer Card Container matching 06_Calender.png */}
      <div className="w-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 flex flex-col md:flex-row min-h-[780px]">
        {/* Left Sidebar */}
        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          filters={filters}
          onAddEventClick={() => handleOpenAddEventModal()}
          onSelectDate={handleSelectMiniCalendarDate}
          onMonthChange={handleMiniCalendarMonthChange}
          onFilterChange={setFilters}
        />

        {/* Right Main Calendar Section */}
        <main className="flex-1 flex flex-col min-w-0 p-4 md:p-6 bg-white">
          {/* Header Toolbar */}
          <CalendarHeaderToolbar
            currentTitle={calendarTitle}
            activeView={activeView}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onViewChange={handleViewChange}
          />

          {/* Calendar Grid Container */}
          <div className="calendar-wrapper flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
                <span className="text-fs14 font-medium text-[#696cff] animate-pulse">
                  Loading calendar...
                </span>
              </div>
            )}

            <Calendar
              controller={calendar}
              initialView="dayGridMonth"
              initialDate="2023-01-15"
              headerToolbar={false}
              height="auto"
              dayMaxEvents={2}
              events={fcEvents}
              editable={true}
              selectable={true}
              datesSet={(dateInfo) => {
                setCalendarTitle(dateInfo.view.title);
                setCurrentDate(dateInfo.view.currentStart);
              }}
              dateClick={(arg) => {
                handleOpenAddEventModal(arg.dateStr);
              }}
              eventClick={(info) => {
                const eventObj = info.event.extendedProps as CalendarEvent;
                setSelectedEventForDetails(eventObj);
                setIsDetailsModalOpen(true);
              }}
              eventContent={(eventInfo) => {
                const props = eventInfo.event.extendedProps as CalendarEvent;
                const cat = props.category || "business";
                const style = categoryStyles[cat] || categoryStyles.business;

                return (
                  <div
                    className={`w-full px-2.5 py-1 rounded-[4px] border ${style.bg} ${style.border} ${style.text} flex items-center justify-between transition-opacity hover:opacity-90 shadow-2xs overflow-hidden select-none`}
                  >
                    <span className="text-fs12 font-medium truncate">
                      {eventInfo.event.title}
                    </span>
                  </div>
                );
              }}
            />
          </div>
        </main>
      </div>

      {/* Add / Edit Event Modal */}
      {isEventModalOpen && (
        <EventModal
          key={editingEvent?.id || "new-event"}
          isOpen={isEventModalOpen}
          initialEvent={editingEvent}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={(id) => handlePromptDelete(id, editingEvent?.title)}
          isSaving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Event Details Popup */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        event={selectedEventForDetails}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEventForDetails(null);
        }}
        onEdit={(event) => {
          setIsDetailsModalOpen(false);
          setEditingEvent(event);
          setIsEventModalOpen(true);
        }}
        onDelete={(id) => handlePromptDelete(id, selectedEventForDetails?.title)}
      />

      {/* Delete Confirmation Popup */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        eventTitle={eventToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default CalendarPage;
