import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTrips } from "../Context/TripContext";
import { useTranslation } from "react-i18next";
import AddTripModal from "../Components/AddTripModal";
import EditTripModal from "../Components/EditTripModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FiMapPin } from "react-icons/fi";
import "moment/locale/ar";
import "moment/locale/en-gb";
import CalendarCombonents from "../Components/CalendarComponents";
import TripRouteEditor from "../Components/TripRouteEditor";



const Employee = () => {
    const { t, i18n } = useTranslation();
    const { 
      trips, 
      employeeTrips,
      loading, 
      error, 
      fetchTrips,
      getTripsForDate,
      selectedTrip,
      setSelectedTrip,
      getEmployeeCalendarEvents,
      getEmployeeTrips,
      deleteTrip
     
    } = useTrips();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState("month");
    const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
    const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
    const [tripToEdit, setTripToEdit] = useState(null);
    const [isPointsEditorOpen, setIsPointsEditorOpen] = useState(false);

    const localizer = momentLocalizer(moment);

    useEffect(() => {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        fetchTrips(month, year);
        getEmployeeTrips();
    }, [currentDate]);

    useEffect(() => {
        getEmployeeTrips();
    },[trips]);
    
    useEffect(() => {
        moment.locale(i18n.language === "ar" ? "ar" : "en-gb");
    }, [i18n.language]);

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

    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD");
    };

    const formatDateTime = (date) => {
        return moment(date).format("YYYY-MM-DD HH:mm");
    };

    const calculateDuration = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, "days") + 1;
    };

    const handleDeleteTrip = (tripId, e) => {
        e.stopPropagation(); 
        deleteTrip(tripId);
    }

    const handleEditTrip = (trip, e) => {
        e.stopPropagation();
        setTripToEdit(trip);
        setIsEditTripModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setIsEditTripModalOpen(false);
        setTripToEdit(null);
    }

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Employee Page</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                    {/* التقويم */}
                    <CalendarCombonents
                      events={getEmployeeCalendarEvents()}
                      style={{ height: 500 }}
                      date = {currentDate}
                      onNavigate={setCurrentDate}
                      onSelectSlot={handleSelectSlot}
                      onSelectEvent={handleSelectEvent}
                      view={view}
                      onView={setView}
                      />

                    {/* تفاصيل الرحلة */}
                    <div className="lg:col-span-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          {t("calendar.tripDetails")}
                        </h2>

                        {selectedTrip ? (
                          <div className="space-y-4">
                            {/* صورة الرحلة */}
                            {selectedTrip.imagePath && (
                              <div className="aspect-w-16 aspect-h-9">
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/api/trip/image/${selectedTrip.imagePath}`}
                                  alt={selectedTrip.name}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}

                            {/* تفاصيل الرحلة */}
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {selectedTrip.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <FiMapPin size={24} className="cursor-pointer"
                                  onClick={() => setIsPointsEditorOpen(true)}/>
                                </div>
                                
                              </div>

                              <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {selectedTrip.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div >
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.location")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {selectedTrip.location}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.price")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    ${selectedTrip.price}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.availableSeats")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {selectedTrip.maxSeats - selectedTrip.numberOfReservations} / {selectedTrip.maxSeats}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.duration")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {calculateDuration(selectedTrip.startDate, selectedTrip.endDate)} {t("trip.days")}
                                  </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.startDate")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {formatDateTime(selectedTrip.startDate)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.endDate")}:
                                  </span>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {formatDateTime(selectedTrip.endDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {t("trip.tripDifficulty")}:
                                  </span>
                                  <p className={`font-semibold text-gray-600 dark:text-gray-400 ${selectedTrip.tripDifficulty < 3 ? 'text-green-600' : selectedTrip.tripDifficulty < 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {selectedTrip.tripDifficulty.toFixed(2)}
                                  </p>
                                </div>

                              </div>

                              
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                              {t("calendar.selectDate")}
                            </p>
                          </div>
                        )}

                        {/* قسم الرحلات المسجل فيها الموظف */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                              {t("calendar.myRegistrations")}
                            </h2>
                            <button
                              onClick={() => setIsAddTripModalOpen(true)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              {t("addTrip.addNew")}
                            </button>
                          </div>

                          {loading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                          ) : employeeTrips && employeeTrips.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {employeeTrips.map((trip) => (
                                <div
                                  key={trip.id}
                                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  onClick={() => setSelectedTrip(trip)}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                                      {trip.name}
                                    </h3>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => handleEditTrip(trip, e)}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        title={t("editTrip.edit")}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        title={t("trip.cancelBooking")}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {formatDateTime(trip.startDate)} - {formatDateTime(trip.endDate)}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {t("trip.location")}: {trip.location}
                                    </span>
                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                      ${trip.price}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              {t("calendar.noRegistrations")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            {isPointsEditorOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold">إضافة نقاط الرحلة</h3>
                    <button onClick={() => setIsPointsEditorOpen(false)} className="px-2">✕</button>
                  </div>
                  <div className="h-[70vh]">
                    <TripRouteEditor
                      trip = {selectedTrip}
                      onSave={() => { setIsPointsEditorOpen(false); }}
                      onClose={() => setIsPointsEditorOpen(false)}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>

    <AddTripModal 
      isOpen={isAddTripModalOpen} 
      onClose={() => setIsAddTripModalOpen(false)} 
    />

    <EditTripModal 
      isOpen={isEditTripModalOpen} 
      onClose={handleCloseEditModal}
      trip={tripToEdit}
    />
    </>
    );
}
export default Employee;