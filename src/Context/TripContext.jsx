import { createContext, useContext, useState, useEffect } from "react";
const TripContext = createContext();
import { useAuth } from "../Context/AuthContext";
import { useError } from '../Context/ErrorContext'; 


export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [registeredTrips, setRegisteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [employeeTrips, setEmployeeTrips] = useState([]);
  const { user } = useAuth();
  const { notifyError } = useError();


  const fetchTrips = async (month, year) => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/trip/m:${month}y:${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTrips(data);
      console.log(data);
      return data;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    console.log("TripContext _:)");
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const formData = new FormData();
      formData.append('EmployeeId', user.user.id );
      formData.append('Name', tripData.name);
      formData.append('Description', tripData.description);
      formData.append('Image', tripData.image);
      formData.append('Price', tripData.price);
      formData.append('MaxSeats', tripData.maxSeats);
      formData.append('Location', tripData.location);
      formData.append('StartDate', tripData.startDate);
      formData.append('EndDate', tripData.endDate);

      const headers = {
        Accept: "application/json",
      };

      if (user?.user?.token) {
        headers["Authorization"] = `Bearer ${user.user.token}`;
      }

      const response = await fetch(`${baseUrl}/api/trip`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const newTrip = await response.json();
      setTrips(prevTrips => [...prevTrips, newTrip]);
      return newTrip;
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, tripData) => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;

      const formData = new FormData();
      console.log('Token: ',user.user.token);
      if (!user?.user?.token) return;
      formData.append('EmployeeId', user.user.id);
      formData.append('Name', tripData.name);
      formData.append('Description', tripData.description);
      formData.append('Price', tripData.price);
      formData.append('MaxSeats', tripData.maxSeats);
      formData.append('Location', tripData.location);
      formData.append('StartDate', tripData.startDate);
      formData.append('EndDate', tripData.endDate);

      const response = await fetch(`${baseUrl}/api/trip/${tripId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user.user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const updatedTrip = await response.json();
      setTrips(prevTrips => 
        prevTrips.map(trip => trip.id === tripId ? updatedTrip : trip)
      );
      return updatedTrip;
    } catch (err) {
      console.error("Error updating trip:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    setLoading(true);
    setError(null);
    if(!user?.user?.token) return
    console.log(user.user.token);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/trip/${tripId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.user.token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      return true;
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCalendarEvents = () => {
    return trips.map(trip => ({
      id: trip.id,
      title: trip.name,
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
      resource: trip,
      allDay: false,
    }));
  };

  const getEmployeeTrips = () => {
    if (!user?.user?.id) return;
    const employeeTrip = trips.filter(trip => (
      trip.employeeId === user.user.id
    ));
    setEmployeeTrips(employeeTrip);
  }

  const getEmployeeCalendarEvents = () => {
    if (!user?.user?.id) return;
    const employeeTrip = trips.filter(trip => (
      trip.employeeId === user.user.id
    ));
    return employeeTrip.map(trip => ({
      id: trip.id,
      title: trip.name,
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
      resource: trip,
      allDay: false,
    }));
  }

  const getTripsForDate = (date) => {
    const targetDate = new Date(date);
    return trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id === tripId);
  };

  const registerCustomerInTrip = async (tripId) => {
    const userId = user.user.id;
    console.log('Trip Id =', tripId );
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/tripregisteratin/register/userid:${userId}/tripid:${tripId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        // setError(result.message);
        // throw new Error(`HTTP error! status: ${response}`);
      }
      
      // Update the trip's numberOfReservations
      setTrips(prevTrips => prevTrips.map(trip => 
        trip.id === tripId 
          ? { ...trip, numberOfReservations: trip.numberOfReservations + 1 } 
          : trip
      ));

      return true;
    } catch (err) {
      console.error("Error registering customer in trip:", err);
      // setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const unregisterCustomerFromTrip = async (tripId) => {
    const userId = user.user.id;
    console.log('Unregistering from Trip Id =', tripId);
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/tripregisteratin/remove/userid:${userId}/tripid:${tripId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTrips(prevTrips => prevTrips.map(trip => 
        trip.id === tripId 
          ? { ...trip, numberOfReservations: Math.max(0, trip.numberOfReservations - 1) } 
          : trip
      ));

      return true;
    } catch (err) {
      console.error("Error unregistering customer from trip:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const fetchRegisteredTrips = async (month, year) => {
    if (!user?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const userId = user.user.id;
      const response = await fetch(`${baseUrl}/api/trip/m:${month}/y:${year}/id:${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        notifyError(result.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegisteredTrips(data);
      return data;
    } catch (err) {
      console.error("Error fetching registered trips:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredTripsEvents = () => {
    return (registeredTrips || []).map(trip => ({
      id: trip.id,
      title: trip.name,
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
      resource: trip,
      allDay: false,
    }))
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        registeredTrips,
        loading,
        error,
        selectedTrip,
        employeeTrips,
        setEmployeeTrips,
        getEmployeeTrips,
        setSelectedTrip,
        fetchTrips,
        fetchRegisteredTrips,
        createTrip,
        updateTrip,
        deleteTrip,
        getCalendarEvents,
        getTripsForDate,
        getTripById,
        registerCustomerInTrip,
        unregisterCustomerFromTrip,
        getEmployeeCalendarEvents,
        fetchRegisteredTripsEvents
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};
