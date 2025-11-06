import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTrips } from "../Context/TripContext";
import TripRouteEditor from "./TripRouteEditor";


const EditTripModal = ({ isOpen, onClose, trip }) => {
  const { t } = useTranslation();
  const { updateTrip, loading } = useTrips();
  
  const [formData, setFormData] = useState({
    employeeId:"",
    name: "",
    description: "",
    location: "",
    price: "",
    maxSeats: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isPointsEditorOpen, setIsPointsEditorOpen] = useState(false);


  useEffect(() => {
    if (trip && isOpen) {
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        name: trip.name || "",
        description: trip.description || "",
        location: trip.location || "",
        price: trip.price || "",
        maxSeats: trip.maxSeats || "",
        startDate: trip.startDate ? formatDateForInput(trip.startDate) : "",
        endDate: trip.endDate ? formatDateForInput(trip.endDate) : "",
      });
    }
  }, [trip, isOpen]);

  if (!isOpen || !trip) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = t("editTrip.errors.nameRequired");
    if (!formData.description.trim()) newErrors.description = t("editTrip.errors.descriptionRequired");
    if (!formData.location.trim()) newErrors.location = t("editTrip.errors.locationRequired");
    if (!formData.price || formData.price <= 0) newErrors.price = t("editTrip.errors.priceRequired");
    if (!formData.maxSeats || formData.maxSeats <= 0) newErrors.maxSeats = t("editTrip.errors.maxSeatsRequired");
    if (!formData.startDate) newErrors.startDate = t("editTrip.errors.startDateRequired");
    if (!formData.endDate) newErrors.endDate = t("editTrip.errors.endDateRequired");
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = t("editTrip.errors.endDateAfterStart");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      console.log("Form Data before submission:", formData);
      
      const tripData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        maxSeats: parseInt(formData.maxSeats),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      console.log("Trip Data to send:", tripData);

      await updateTrip(trip.id, tripData);
      
      onClose();
    } catch (err) {
      console.error("Error updating trip:", err);
      setSubmitError(err.message || t("editTrip.errors.submitFailed"));
    }
  };

  const handleClose = () => {
    if (loading) return;
    setErrors({});
    setSubmitError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("editTrip.title")}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
              {submitError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("editTrip.name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("editTrip.description")} <span className="text-red-500">*</span>
              </label>
              <textarea
              required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("addTrip.location")} <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-between align-middle gap-4 ">
                
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  />
                
               
              
              </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Price and Max Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("editTrip.price")} <span className="text-red-500">*</span>
                </label>
                <input
                required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("editTrip.maxSeats")} <span className="text-red-500">*</span>
                </label>
                <input
                required
                  type="number"
                  name="maxSeats"
                  value={formData.maxSeats}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.maxSeats ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maxSeats && <p className="text-red-500 text-sm mt-1">{errors.maxSeats}</p>}
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("editTrip.startDate")} <span className="text-red-500">*</span>
                </label>
                <input
                required
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("editTrip.endDate")} <span className="text-red-500">*</span>
                </label>
                <input
                required
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("editTrip.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("editTrip.updating") : t("editTrip.update")}
              </button>
            </div>
          </form>
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
              trip = {trip}
              onSave={() => { setIsPointsEditorOpen(false); }}
              onClose={() => setIsPointsEditorOpen(false)}
            />
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default EditTripModal;

