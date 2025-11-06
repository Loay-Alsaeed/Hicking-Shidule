import React, { useState } from "react";
import { useTrips } from "../Context/TripContext";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useError } from '../Context/ErrorContext';
import TripRouteEditor from "../Components/TripRouteEditor";
import EditTripModal from "./EditTripModal";
import { FiMapPin } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";




const TripDetails = () => {
    const { selectedTrip, setSelectedTrip, loading, registeredTrips, registerCustomerInTrip, unregisterCustomerFromTrip, fetchRegisteredTrips, deleteTrip } = useTrips();
    const { t, i18n } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const { notifyError } = useError();
    const [isPointsEditorOpen, setIsPointsEditorOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const {user} = useAuth();


    const calculateDuration = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, "days") + 1;
    };

    const formatDateTime = (date) => {
        return moment(date).format("YYYY-MM-DD HH:mm");
    };

    const handleRegisterCustomer = async (tripId) => {
        console.log(tripId);
        try {
          await registerCustomerInTrip(tripId);
    
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          var result =  await fetchRegisteredTrips(month, year);
          if (!result.success)
          {
            notifyError(result.message);
          }
        } catch (err) {
          console.error("Error registering:", err);
        }
    }
    
    const handleUnregisterCustomer = async (tripId, e) => {
        e.stopPropagation(); 
        try {
          await unregisterCustomerFromTrip(tripId);
    
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          await fetchRegisteredTrips(month, year);
        } catch (err) {
          console.error("Error unregistering:", err);
        }
    }

    return (
        <>
            <div className="lg:col-span-1 h-full ">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t("calendar.tripDetails")}
              </h2>

              {selectedTrip ? (
                <div className="space-y-4">
                  {/* صورة الرحلة */}
                  {selectedTrip.imagePath && (
                    <div className="spect-w-16 spect-h-9">
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
                    <div className=" flex justify-between">
                      <h3 className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedTrip.name}
                      </h3>
                      <div className="flex justify-between gap-4 align-middle">

                            <FiMapPin size={24} className="cursor-pointer"
                            onClick={() => setIsPointsEditorOpen(true)}/>
                          <div className={`px-3 py-1 rounded-full w-fit h-fit ${selectedTrip.state === "Active"? "bg-indigo-700" : "bg-red-500"}`}>
                            <p className="text-white">
                              {selectedTrip.state === "Active"? 'Active': "Not Active"}
                            </p>
                          </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedTrip.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
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
                      <div className="">
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

                    {(() => {
                      const isRegistered = Array.isArray(registeredTrips) && registeredTrips.some(rt => rt.id === selectedTrip.id);
                      const isActive = selectedTrip.state === "Active";
                      const isAdmin = user.user.roles === "Admin";
                      return (
                        !isAdmin? 
                        <button
                          disabled={!isActive}
                          onClick={(e) => (isRegistered ? handleUnregisterCustomer(selectedTrip.id, e) : handleRegisterCustomer(selectedTrip.id))}
                          className=" w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-black">
                          {isActive ? (isRegistered ? t("trip.cancelBooking") || "Cancel" : t("trip.bookNow") || "Book Now") : "Not Active"}
                        </button>:
                        <div className="grid grid-cols-2 gap-4">
                          <button
                          onClick={() => { setIsEditOpen(true) }}
                           className="col-span-1 bg-blue-500 active:bg-blue-700 p-2 rounded-sm text-white cursor-pointer">Edit</button>
                          <button
                          onClick={() => {deleteTrip(selectedTrip.id)}}
                           className="col-span-1 bg-red-500 active:bg-red-700 p-2 rounded-sm text-white cursor-pointer">Delete</button>
                        </div>
                      );
                    })()}

                    
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("calendar.selectDate")}
                  </p>
                </div>
              )}

              {/* قسم الرحلات المسجل فيها العميل */}
              {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {t("calendar.myRegistrations")}
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : registeredTrips && registeredTrips.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {registeredTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setSelectedTrip(trip)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                            {trip.name}
                          </h3>
                          <button
                            onClick={(e) => handleUnregisterCustomer(trip.id, e)}
                            className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title={t("trip.cancelBooking")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
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
              </div> */}
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
          {isEditOpen && (
              <EditTripModal 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                trip={selectedTrip}
              />
            )}
        </>
    );
}
export default TripDetails;