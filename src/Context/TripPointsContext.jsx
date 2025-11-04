import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useError } from "./ErrorContext";
const TripPointsContext = createContext();

export const TripPointsProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [tripRoutes, setTripRoutes] = useState({});
    
    const { notifyError } = useError();

    const SavePoints = async (tripId, points) => {
        setLoading(true);
        try {
          const routePoints = points.map((p, idx) => ({
            id: p.id || crypto.randomUUID(),
            lat: p.Lat,
            lng: p.Lng,
            name: p.Name,
            terrain: p.Terrain,
            hasRappelling: !!p.HasRappelling
          }));
          const payload = { tripId, routePoints };
      
          const response = await fetch(
            'https://localhost:7198/api/TripPoint/saveroute',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
              body: JSON.stringify(payload)
            }
          );
      
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Failed to save route points');
          }
      
          // ✅ احصل على النتيجة مع الصعوبة الكلية
          const result = await response.json();
      
          setTripRoutes(prev => ({
            ...prev,
            [tripId]: { tripId, routePoints, difficulty: result.TripDifficulty }
          }));
      
          return result; // <-- حتى يمكن استخدامه في الواجهة
      
        } catch (err) {
          notifyError(err.message || 'Unknown error');
        } finally {
          setLoading(false);
        }
      };
      
    
    return (
        <TripPointsContext.Provider
          value={{
            loading,
            tripRoutes,
            SavePoints

          }}>
          {children}
        </TripPointsContext.Provider>
      );
};

export const useTripPoints = () => {
    const context = useContext(TripPointsContext);
    if (!context) {
      throw new Error("useTripPoints must be used within a TripPointsProvider");
    }
    return context;
  };