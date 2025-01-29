import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Calendar, CheckCircle } from "lucide-react";

const Holidays = () => {
  const [holidays, setHolidays] = useState([]); // All predefined holidays
  const [customHolidays, setCustomHolidays] = useState([]); // Custom holidays added by user
  const [selectedHolidays, setSelectedHolidays] = useState([]); // User-selected holidays
  const [customHoliday, setCustomHoliday] = useState({ name: "", date: "" }); // New custom holiday
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch predefined holidays
  const fetchPredefinedHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/holidays/predefined`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch predefined holidays");

      const data = await response.json();
      setHolidays(data.holidays || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error(error.message || "Failed to fetch holidays.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user-selected holidays
  const fetchSelectedHolidays = async () => {
    try {
      const response = await fetch(`${BASE_URL}/holidays/selected`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch selected holidays");

      const data = await response.json();
      setSelectedHolidays(data.holidays || []);
      setCustomHolidays(data.holidays.filter((h) => h.isCustom) || []); // Filter custom holidays
    } catch (error) {
      console.error("Error fetching selected holidays:", error);
      toast.error(error.message || "Failed to fetch selected holidays.");
    }
  };

  useEffect(() => {
    fetchPredefinedHolidays();
    fetchSelectedHolidays();
  }, []);

  // Handle holiday selection
  const toggleHolidaySelection = (holiday) => {
    const isPastDate = new Date(holiday.date) < new Date();
    if (isPastDate) {
      toast.error("You cannot select a holiday for a past date.");
      return;
    }

    if (selectedHolidays.some((h) => h.name === holiday.name)) {
      setSelectedHolidays(selectedHolidays.filter((h) => h.name !== holiday.name));
    } else if (selectedHolidays.length < 10) {
      setSelectedHolidays([...selectedHolidays, holiday]);
    } else {
      toast.error("You can select a maximum of 10 holidays.");
    }
  };

  // Update selected holidays API call
  const updateSelectedHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/holidays/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ selectedHolidays }),
      });

      if (!response.ok) throw new Error("Failed to update selected holidays");

      const data = await response.json();
      toast.success(data.message || "Holidays updated successfully.");
    } catch (error) {
      console.error("Error updating holidays:", error);
      toast.error(error.message || "Failed to update holidays.");
    } finally {
      setLoading(false);
    }
  };

  // Add custom holiday
  const addCustomHoliday = async () => {
    const { name, date } = customHoliday;

    if (!name || !date) {
      toast.error("Please provide both holiday name and date.");
      return;
    }

    const isPastDate = new Date(date) < new Date();
    if (isPastDate) {
      toast.error("You cannot add a holiday for a past date.");
      return;
    }

    try {
      const newCustomHoliday = { ...customHoliday, isCustom: true };

      const response = await fetch(`${BASE_URL}/holidays/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ selectedHolidays: [...selectedHolidays, newCustomHoliday] }),
      });

      if (!response.ok) throw new Error("Failed to add custom holiday");

      setCustomHolidays([...customHolidays, newCustomHoliday]);
      setSelectedHolidays([...selectedHolidays, newCustomHoliday]);
      setCustomHoliday({ name: "", date: "" });
      toast.success("Custom holiday added successfully.");
    } catch (error) {
      console.error("Error adding custom holiday:", error);
      toast.error(error.message || "Failed to add custom holiday.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-500" />
            Holiday Management
          </h1>
        </div>

        {/* Holiday Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Available Holidays</h3>
          {holidays.length > 0 ? (
            <table className="w-full text-gray-400">
              <thead>
                <tr>
                  <th className="text-left py-2">Holiday</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-center py-2">Select</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => {
                  const isSelected = selectedHolidays.some((h) => h.name === holiday.name);
                  const isPastDate = new Date(holiday.date) < new Date();
                  return (
                    <tr
                      key={holiday.name}
                      className={`hover:bg-gray-700 ${
                        isPastDate ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <td className="py-2">{holiday.name}</td>
                      <td className="py-2">{new Date(holiday.date).toLocaleDateString()}</td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleHolidaySelection(holiday)}
                          disabled={isPastDate}
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No holidays available.</p>
          )}
        </div>

        {/* Custom Holiday Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Add Custom Holiday</h3>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Holiday Name"
              value={customHoliday.name}
              onChange={(e) => setCustomHoliday({ ...customHoliday, name: e.target.value })}
              className="p-2 w-1/2 bg-gray-900 text-white border border-gray-700 rounded-lg"
            />
            <input
              type="date"
              value={customHoliday.date}
              onChange={(e) => setCustomHoliday({ ...customHoliday, date: e.target.value })}
              className="p-2 w-1/2 bg-gray-900 text-white border border-gray-700 rounded-lg"
            />
            <button
              onClick={addCustomHoliday}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Custom Holiday
            </button>
          </div>

          {/* Custom Holidays Table */}
          {customHolidays.length > 0 && (
            <table className="w-full text-gray-400">
              <thead>
                <tr>
                  <th className="text-left py-2">Holiday</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {customHolidays.map((holiday, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="py-2">{holiday.name}</td>
                    <td className="py-2">{new Date(holiday.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Update Holidays Button */}
        <div className="text-right">
          <button
            onClick={updateSelectedHolidays}
            disabled={loading}
            className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md focus:outline-none focus:ring focus:ring-indigo-500 disabled:opacity-50 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update My Holidays"}
          </button>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={2000} />
    </div>
  );
};

export default Holidays;
