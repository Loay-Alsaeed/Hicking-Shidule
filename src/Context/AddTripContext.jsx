import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useError } from "./ErrorContext";
const AddTripContext = createContext();



export const AddTripProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [addError, setAddError] = useState(null);
    const {user} = useAuth();
    const { notifyError } = useError();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        price: "",
        maxSeats: "",
        startDate: "",
        endDate: "",
        image: null,
        tripPoints: []
    });

    const setTripPoints = useCallback((points) => {
        setFormData(prev => ({ ...prev, tripPoints: points }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            name: "",
            description: "",
            location: "",
            price: "",
            maxSeats: "",
            startDate: "",
            endDate: "",
            image: null,
            tripPoints: []
        });
        setAddError(null);
    }, []);

    const createTrip = useCallback(async () => {
        setLoading(true);
        setAddError(null);
        
        try {
          const baseUrl = import.meta.env.VITE_API_URL;
          const headers = { Accept: "application/json" };
          if (user?.user?.token) {
            headers["Authorization"] = `Bearer ${user.user.token}`;
          }

          const body = new FormData();
          body.append("EmployeeId", user?.user?.id ?? "");
          body.append("Name", formData.name ?? "");
          body.append("Description", formData.description ?? "");
          body.append("Location", formData.location ?? "");
          body.append("Price", String(formData.price ?? ""));
          body.append("MaxSeats", String(formData.maxSeats ?? ""));
          body.append("StartDate", formData.startDate ? new Date(formData.startDate).toISOString() : "");
          body.append("EndDate", formData.endDate ? new Date(formData.endDate).toISOString() : "");
          if (formData.image) body.append("Image", formData.image);
          if (formData.tripPoints) body.append("RoutePoints", JSON.stringify(formData.tripPoints));

          console.log("formData: ", formData);
          console.log(body);

          const response = await fetch(`${baseUrl}/api/trip`, {
            method: "POST",
            headers,
            body,
          });

          if (!response.ok) {
            let message = `HTTP ${response.status}`;
            try {
              const result = await response.json();
              message = result?.message || message;
            } catch {}
            notifyError(message);
            throw new Error(message);
          }

          const newTrip = await response.json();
        //   notifyError("Trip Created Successfully");
          return newTrip;
        } catch (err) {
          console.error("Error creating trip:", err);
          setAddError(err.message);
          throw err;
        } finally {
          setLoading(false);
        }
    }, [formData, notifyError, user]);
    
    return (
        <AddTripContext.Provider
          value={{
           loading,
           addError,
           formData,
           setFormData,
           setTripPoints,
           resetForm,
           createTrip
          }}
        >
          {children}
        </AddTripContext.Provider>
      );

};

export const useAddTrip = () => {
    const context = useContext(AddTripContext);
    if (!context) {
      throw new Error("useAddTrip must be used within a AddTripProvider");
    }
    return context;
  };