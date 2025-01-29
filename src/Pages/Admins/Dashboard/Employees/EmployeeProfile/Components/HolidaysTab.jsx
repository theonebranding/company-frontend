import React, { useEffect, useState } from "react";
import { Loader2, Calendar, Star, AlertCircle, PartyPopper } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HolidaysTab = ({ employeeId }) => {
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchSelectedHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/holidays/selected/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch selected holidays.");

      const data = await response.json();
      const sortedHolidays = (data.holidays || []).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSelectedHolidays(sortedHolidays);
    } catch (error) {
      console.error("Error fetching selected holidays:", error);
      toast.error(error.message || "Failed to fetch selected holidays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedHolidays();
  }, [employeeId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUpcomingStatus = (date) => {
    const holidayDate = new Date(date);
    const today = new Date();
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          <span className="text-sm font-medium text-gray-300">Loading holidays...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <PartyPopper className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Selected Holidays</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {selectedHolidays.length} holidays selected for the year
            </p>
          </div>
        </div>
      </div>

      {selectedHolidays.length > 0 ? (
        <div className="grid gap-4">
          {selectedHolidays.map((holiday) => {
            const upcomingStatus = getUpcomingStatus(holiday.date);
            
            return (
              <div
                key={holiday._id}
                className="group p-5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60 hover:border-indigo-500/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {holiday.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(holiday.date)}</span>
                    </div>
                  </div>
                  {upcomingStatus && (
                    <span className="px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-400/10 rounded-full">
                      {upcomingStatus}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-800/40 rounded-xl border border-gray-700/50">
          <AlertCircle className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-gray-300 font-medium">No holidays selected</p>
          <p className="text-gray-400 text-sm mt-1">Selected holidays will appear here</p>
        </div>
      )}

      <ToastContainer 
        theme="dark" 
        position="top-right" 
        autoClose={2000}
      />
    </div>
  );
};

export default HolidaysTab;