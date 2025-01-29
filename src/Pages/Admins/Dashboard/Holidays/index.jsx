import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { 
  Calendar, PlusCircle, Trash2, Loader2, 
  AlertCircle, ChevronRight, CalendarDays, 
  CheckCircle2
} from "lucide-react";

const AdminHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchPredefinedHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/holidays/predefined`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch predefined holidays.");

      const data = await response.json();
      setHolidays(data.holidays || []);
      toast.success("Predefined holidays fetched successfully.");
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error(error.message || "Failed to fetch holidays.");
    } finally {
      setLoading(false);
    }
  };

  const addPredefinedHoliday = async () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error("Holiday name and date are required.");
      return;
    }

    try {
      setAdding(true);
      const response = await fetch(`${BASE_URL}/holidays/add-predefined-holidays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ holidays: [newHoliday] }),
      });

      if (!response.ok) throw new Error("Failed to add holiday.");

      const data = await response.json();
      toast.success(data.message || "Holiday added successfully.");
      setNewHoliday({ name: "", date: "" });
      fetchPredefinedHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error(error.message || "Failed to add holiday.");
    } finally {
      setAdding(false);
    }
  };

  const deleteHoliday = async (holidayId) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/holidays/delete-predefined-holidays/${holidayId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete holiday.");

      const data = await response.json();
      toast.success(data.message || "Holiday deleted successfully.");
      fetchPredefinedHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error(error.message || "Failed to delete holiday.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredefinedHolidays();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500 bg-opacity-20 rounded-lg">
              <Calendar className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold">Manage Holidays</h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400 ml-14">
            <ChevronRight className="w-4 h-4" />
            <span>Configure organization-wide holidays and special events</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="ml-3 text-gray-300">Loading holidays...</span>
          </div>
        ) : (
          <>
            {/* Add Holiday Form - Moved to top for better UX */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-green-500" />
                Add New Holiday
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Holiday Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                      className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                               placeholder-gray-500"
                      placeholder="Enter holiday name"
                      required
                    />
                    <CalendarDays className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Holiday Date
                  </label>
                  <input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={addPredefinedHoliday}
                  disabled={adding}
                  className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg
                             flex items-center gap-2 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                             focus:ring-offset-gray-800 ${adding ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {adding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {adding ? "Adding..." : "Add Holiday"}
                </button>
              </div>
            </div>

            {/* Enhanced Holidays Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Predefined Holidays
                </h3>
              </div>
              
              {holidays.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 text-gray-300">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold">Holiday Name</th>
                        <th className="text-left py-4 px-6 font-semibold">Date</th>
                        <th className="text-center py-4 px-6 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {holidays.map((holiday) => (
                        <tr
                          key={holiday._id}
                          className="hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="py-4 px-6 text-gray-300">{holiday.name}</td>
                          <td className="py-4 px-6 text-gray-300">
                            {new Date(holiday.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center">
                              <button
                                onClick={() => deleteHoliday(holiday._id)}
                                className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg 
                                         text-red-500 transition-colors duration-200"
                                title="Delete Holiday"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No holidays have been added yet.</p>
                  <p className="text-gray-600 mt-2">Add your first holiday using the form above.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer 
        theme="dark" 
        position="top-right" 
        pauseOnHover={false} 
        limit={1}
        closeOnClick 
        autoClose={1500} 
      />
    </div>
  );
};

export default AdminHolidays;