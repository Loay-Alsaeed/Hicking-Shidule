import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTrips } from "../Context/TripContext";
import { useTranslation } from "react-i18next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/ar";
import "moment/locale/en-gb";
import TripDetails from "../Components/TripDetails";
import { useError } from '../Context/ErrorContext';
import { useAuth } from "../Context/AuthContext";
import TripCard from "../Components/TripCard";

const Customer = () => {
  const { t, i18n } = useTranslation();
  const {user} = useAuth();
  // const [registeredEvents, setRegisteredEvents] = useState([]);
  const { 
    trips, 
    registeredTrips,
    loading, 
    error, 
    fetchTrips,
    fetchRegisteredTrips,
    getCalendarEvents, 
    getTripsForDate,
    selectedTrip,
    setSelectedTrip,
    registerCustomerInTrip,
    unregisterCustomerFromTrip,
    fetchRegisteredTripsEvents
  } = useTrips();


  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month");
  const localizer = momentLocalizer(moment);
  const [ActiveBar, setActiveBar] = useState("Available Trips");
  const { notifyError } = useError();

  useEffect(() => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    fetchTrips(month, year);
    fetchRegisteredTrips(month, year);
  }, [currentDate]);

  useEffect(() => {
    moment.locale(i18n.language === "ar" ? "ar" : "en-gb");
  }, [i18n.language]);

  useEffect(() => {
    notifyError(error);
  },[error]);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    const tripsForDate = getTripsForDate(start);
    if (tripsForDate.length > 0) {
      setSelectedTrip(tripsForDate[0]); 
    } else {
      setSelectedTrip(null);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedTrip(event.resource);
    setSelectedDate(event.start);
  };


  // تنسيقات التقويم
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
    viewDetails: t("trip.viewDetails"),
    showMore: (total) => `+${total} more`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <ShowError/> */}
      <div className=" mx-auto p-6">

      <div className="  dark:bg-gray-800 rounded-lg pb-4 flex items-center align-center justify-center gap-8">
        <div className={`font-semibold text-gray-900 dark:text-white cursor-pointer ${ActiveBar === "Available Trips" ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"}`} 
            onClick={() => {
              setActiveBar("Available Trips")
              setSelectedTrip(null)}}
            title="Available Trips">All Trips</div>
        <div className={`font-semibold text-gray-900 dark:text-white cursor-pointer ${ActiveBar === "My Trips" ? "text-indigo-600" : "text-gray-500 dark:text-gray-400"}`} 
            onClick={() => {
              setActiveBar("My Trips")
              setSelectedTrip(null)}}
            title="My Trips">My Trips</div>
      </div>

        <div className={`grid grid-cols-1 ${user.user.roles !== "Customer"? "" :"lg:grid-cols-3"  } gap-6 mx-6`}>
          


         {/* Available Trips */}
         {ActiveBar === "Available Trips" && (
          <>
            <div className="lg:col-span-2 ">
              <TripCard tripsShow={trips}/>
            </div>
            <TripDetails/>
          </>
         )}
          
          {/* My Trips */}
         {ActiveBar === "My Trips" && (
          <>
            {/* التقويم */}
          <div className={`  lg:col-span-2`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t("calendar.loading")}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={fetchRegisteredTripsEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  view={view}
                  onView={setView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectSlot={null}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  messages={messages}
                  className="dark:bg-gray-800"
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
          <TripDetails/>
          </>
         )}
         

         

          {/* تفاصيل الرحلة */}
           {/* <TripDetails/> */}
          
        </div>
      </div>
    </div>
  );
};

export default Customer;