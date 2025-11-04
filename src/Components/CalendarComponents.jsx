import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import { useTrips } from "../Context/TripContext";
import { useTranslation } from "react-i18next";


const CalendarCombonents = ({events, style, date, onNavigate, onSelectSlot, onSelectEvent, view, onView}) => {
    const localizer = momentLocalizer(moment);
    const { t } = useTranslation();


    const { loading } = useTrips();

    const messages = {
        allDay: t("calendar.allDay") || "All Day",
        previous: t("calendar.previous"),
        next: t("calendar.next"),
        today: t("calendar.today"),
        month: t("calendar.month"),
        week: t("calendar.week"),
        day: t("calendar.day"),
        agenda: t("calendar.agenda"),
        date: "Date",
        time: "Time",
        event: "Event",
        noEventsInRange: t("calendar.noTrips"),
        showMore: (total) => `+${total} more`,
    };


    return (
        <>
            {/* التقويم */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">{t("calendar.loading")}</p>
                    </div>
                    </div>
                ) :  (
                    <Calendar
                    className="dark:bg-gray-800"
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={style}
                    view={view}
                    onView={onView}
                    date={date}
                    onNavigate={onNavigate}
                    onSelectSlot={onSelectSlot}
                    onSelectEvent={onSelectEvent}
                    selectable
                    messages={messages}
                    eventPropGetter={(event) => ({
                        style: {
                        backgroundColor: "#4F46E5",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        padding: "2px 4px",
                        },
                    })}
                    />
                )}
                </div>
            </div>
        </>
    );
}
export default CalendarCombonents;