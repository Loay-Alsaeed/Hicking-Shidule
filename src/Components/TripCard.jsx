import React, { useEffect, useMemo, useState } from "react";
import { useTrips } from "../Context/TripContext";
import { useTranslation } from "react-i18next";
import { IoIosAddCircleOutline } from "react-icons/io";
import AddTripModal from "./AddTripModal";


const getDifficultyBadgeClass = (value) => {
  if (value < 3) return "bg-green-100 text-green-700 border-green-200";
  if (value < 6) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-red-100 text-red-700 border-red-200";
};

const TripCard = ({tripsShow}) => {
  const { t } = useTranslation();
  // const [trips, setTrips] = useState(tripsShow);
  const { trips, fetchTrips, loading, setSelectedTrip, registeredTrips, registerCustomerInTrip, unregisterCustomerFromTrip } = useTrips();
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);




  const sortedTrips = useMemo(() => {
    return [...(trips || [])].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return sortedTrips.filter((trip) => {
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      const afterStart = startFilter ? tripStart >= new Date(startFilter) : true;
      const beforeEnd = endFilter ? tripEnd <= new Date(endFilter) : true;
      return afterStart && beforeEnd;
    });
  }, [sortedTrips, startFilter, endFilter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-72 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
    <div className="bg-white p-6 rounded-xl shadow-lg">

      <div className="flex justify-between items-center align-middle pb-6">
        <div className="flex gap-2 align-middle items-center">
          <h3 className="font-bold text-xl">Available Trips ({trips.length})</h3>
          <IoIosAddCircleOutline size={24} className="hover:text-blue-500 cursor-pointer"
          onClick={() => {setIsAddTripModalOpen(true);}}/>
        </div>

        <div className=" flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex flex-col">
            {/* <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("trip.startDate") || "Start date"}</label> */}
            <input
                type="date"
                value={startFilter}
                onChange={(e) => setStartFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 text-sm"
                />
            </div>
            <div className="flex flex-col">
            {/* <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("trip.endDate") || "End date"}</label> */}
            <input
                type="date"
                value={endFilter}
                onChange={(e) => setEndFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 text-sm"
                />
            </div>
            <button
            type="button"
            onClick={() => { setStartFilter(""); setEndFilter(""); }}
            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
            >
            {"Clear" || "Clear"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

      {!filteredTrips || filteredTrips.length === 0 ? (
        <div className="w-full h-full flex justify-center col-span-2">
            <p className="text-gray-500 font-semibold items-center mt-8">No Trips Found</p>
        </div>
      ) : (
      <>
      {filteredTrips.map((trip) => {
        const imgSrc = trip?.imagePath
          ? `${import.meta.env.VITE_API_URL}/api/trip/image/${trip.imagePath}`
          : null;
        const availableSeats = (trip?.maxSeats || 0) - (trip?.numberOfReservations || 0);
        const diff = Number(trip?.tripDifficulty || 0);
        const diffClass = getDifficultyBadgeClass(diff);

        return (
          <div
            key={trip.id}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
            onClick={() => setSelectedTrip(trip)}
            title={trip.name}
          >
            <div className="relative h-44 w-full overflow-hidden">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={trip.name}
                  className="h-full w-full object-fill transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                  {t("trip.noImage") || "No Image"}
                </div>
              )}

              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${diffClass}`}>
                {t("trip.tripDifficulty") || "Difficulty"}: {diff.toFixed(1)}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                  {trip.name}
                </h3>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap">
                  ${trip.price}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 20s6-4.686 6-10A6 6 0 104 10c0 5.314 6 10 6 10zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate" title={trip.location}>{trip.location}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
                    <path d="M18 9H2v6a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  </svg>
                  <span className="truncate">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("trip.availableSeats") || "Available"}: {availableSeats} / {trip.maxSeats}
                </span>
                {(() => {
                  const isRegistered = Array.isArray(registeredTrips) && registeredTrips.some(rt => rt.id === trip.id);
                  const isActive = trip.state === "Active";
                  return (
                    <button
                      type="button"
                      disabled={!isActive}
                      className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-black"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isRegistered) {
                          await unregisterCustomerFromTrip(trip.id);
                        } else {
                          await registerCustomerInTrip(trip.id);
                        }
                        setSelectedTrip(trip);
                      }}
                    >
                      {isActive ? (isRegistered ? t("trip.cancelBooking") || "Cancel" : t("trip.bookNow") || "Book Now") : "Not Active"}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })}
      </>
      )}

      

      </div>
    </div>

    <AddTripModal 
    isOpen={isAddTripModalOpen} 
    onClose={() => setIsAddTripModalOpen(false)} 
    />

    </>
  );
};

export default TripCard;