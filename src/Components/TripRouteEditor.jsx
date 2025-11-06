import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTripPoints } from "../Context/TripPointsContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Context/AuthContext";

const getMarkerIcon = (color) =>
  new L.Icon({
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    crossOrigin: true,
  });

  const getMarkerColor = (difficulty) => {
    if (difficulty < 3) return "green";
    if (difficulty < 6) return "yellow";
    return "red";
  };

function ClickCapture({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick({ Lat: lat, Lng: lng });
    },
  });
  return null;
}

export default function TripRouteEditor({ onSave, onClose, trip }) {
  const [points, setPoints] = useState([]);
  const [draftPoint, setDraftPoint] = useState(null);
  const [tripId, setTripId] = useState(trip.id);
  const { SavePoints } = useTripPoints();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const {user} = useAuth();


  useEffect(() => {
    // console.log("Got trip prop:", trip); // See what trip is
    setTripId(trip?.id);
    // console.log(tripId);
    if (trip.id) GetTripPoints(tripId);
    console.log("Roles: ", user.user.roles);
  }, [trip]);

  const GetTripPoints = async (tripId) => {
    if (!tripId) {
      alert('No trip selected!');
      return;
    }
    try {
      console.log("TripId: ", tripId);
      const response = await fetch(
        `https://localhost:7198/api/TripPoint/GetTripPoints/${tripId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trip points");
        setLoading(false);
      }

      const points = await response.json();

      // Map response to internal structure if needed
      const formattedPoints = points.map(p => ({
        id: p.id,
        Lat: p.lat,
        Lng: p.lng,
        Name: p.name,
        Terrain: p.terrain,
        HasRappelling: p.hasRappelling,
        OrderIndex: p.orderIndex ?? 0,
        DifficultyLevel: p.difficultyLevel ?? 0
      }));
      console.log("Formatted Points: ", formattedPoints);

      setPoints(formattedPoints);
      setLoading(false);

    } catch (error) {
      // Optional: handle error by showing notification or logging
      setPoints([]); // fallback: reset points if fetch fails
      setLoading(false);

    }
  };
  
  
  const handleMapClick = ({ Lat, Lng }) => {
    setDraftPoint({ Lat, Lng, Name: "", Terrain: "", HasRappelling: false });
  };

  const handleDraftChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraftPoint(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addDraftPoint = () => {
    if (!draftPoint || !draftPoint.Name || !draftPoint.Terrain) return;
    setPoints(prev => [...prev, draftPoint]);
    setDraftPoint(null);
  };

  const removePoint = (index) => {
    setPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const result = await SavePoints(tripId, points);
    if (result && result.TripDifficulty !== undefined) {
      alert(`Route saved successfully! Total Difficulty: ${result.TripDifficulty.toFixed(2)}`);
    }
    if (onSave) onSave();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-full h-full overflow-scroll">
      <div className="flex-1 min-h-[400px] mb-12">
        <MapContainer
          center={[31.95, 35.9]}
          zoom={12}
          className="h-[500px] rounded-lg shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClickCapture onMapClick={handleMapClick} />
          {points.map((p, i) => (
            <Marker
            className="z-50"
              key={i}
              position={[p.Lat, p.Lng]}
              icon={getMarkerIcon(getMarkerColor(p.DifficultyLevel ?? 0))}>            
              <Tooltip  direction="top">
              <div className="text-xs text-center">
                <strong>{p.Name}</strong><br />
                {p.Terrain}<br />
                Difficulty: {p.DifficultyLevel?.toFixed(1) ?? 0}
              </div>
            </Tooltip>
          </Marker>
          ))}
          <Polyline
            positions={points.map((p) => [p.Lat, p.Lng])}
            color={
              points.length === 0
                ? "blue"
                : points.reduce((a, b) => a + (b.DifficultyLevel ?? 0), 0) / points.length > 6
                ? "red"
                : "green"
            }
          />

          {/* <Polyline positions={points.map((p) => [p.Lat, p.Lng])} color="blue" /> */}
        </MapContainer>
      </div>
      {user.user.roles !== "Customer" ? 
            loading ? 
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">{t("calendar.loading")}</p>
                </div>
              </div>
               : 
              <div className="w-full md:w-[360px] bg-white rounded-lg shadow p-4 h-fit">
                <h3 className="font-bold mb-3">Point Details</h3>
                {!draftPoint && (
                  <p className="text-sm text-gray-600 mb-3">Click on map to add new points</p>
                )}
                {draftPoint && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Place Name </label>
                      <input name="Name" value={draftPoint.Name} onChange={handleDraftChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Terrain Type</label>
                      <select name="Terrain" value={draftPoint.Terrain} onChange={handleDraftChange} className="w-full px-3 py-2 border rounded">
                        <option value="">Select terrain</option>
                        <option value="Mountain">Mountain</option>
                        <option value="Valley">Valley</option>
                        <option value="Hill">Hill</option>
                        <option value="Forest">Forest</option>
                        <option value="Desert">Desert</option>
                        <option value="Cave">Cave</option>
                        <option value="Rocky_Slope">Rocky_Slope</option>
                        <option value="Stream">Stream</option>
                        <option value="Dirt_Trail">Dirt_Trail</option>
                        <option value="Waterfall_Area">Waterfall_Area</option>
                        <option value="Swamp">Swamp</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="HasRappelling" type="checkbox" name="HasRappelling" checked={!!draftPoint.HasRappelling} onChange={handleDraftChange} />
                      <label htmlFor="HasRappelling">Has Rappelling</label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addDraftPoint} className="px-3 py-2 bg-blue-600 text-white rounded">Add Point</button>
                      <button onClick={() => setDraftPoint(null)} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
                    </div>
                  </div>
                )}
        
                {points.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-semibold mb-2">Added Points:</h4>
                    <ul className="space-y-1 max-h-48 overflow-auto pr-1">
                      {points.map((p, i) => (
                        <li key={i} className="flex flex-col border-b py-1 text-sm">
                          <div className="flex justify-between">
                            <span>
                              🏞️ {p.Name} – {p.Terrain} – {p.HasRappelling ? "With rappelling" : "Without Rappelling"}
                            </span>
                            <button onClick={() => removePoint(i)} className="text-red-600 hover:underline">Remove</button>
                          </div>
                          {p.DifficultyLevel !== undefined && (
                            <span className="text-gray-500 ml-2">
                              Difficulty: <b>{p.DifficultyLevel.toFixed(1)}</b>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>

                  </div>
                )}
        
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                  <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                </div>
              </div>
       : <></>      
      } 
    </div>
    
  );
}
