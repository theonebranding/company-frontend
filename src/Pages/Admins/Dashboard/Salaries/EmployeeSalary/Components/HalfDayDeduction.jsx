import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ClipboardList,
  CalendarDays,
  DollarSign,
  Calendar,
  Clock,
  Sun,
  AlertCircle,
  Loader2,
} from "lucide-react";

const HalfDayDeduction = ({ employeeId, onDataFetched }) => {
  const [halfDayData, setHalfDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchHalfDays = async () => {
    try {
      setLoading(true);

      const startDate = `01-${selectedMonth.toString().padStart(2, "0")}-${selectedYear}`;
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const endDate = `${lastDay}-${selectedMonth.toString().padStart(2, "0")}-${selectedYear}`;

      const queryParams = new URLSearchParams({
        employeeId,
        startDate,
        endDate,
      }).toString();

      const response = await fetch(
        `${BASE_URL}/attendance-summary/employee-halfdays-list?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch half-days.");
      const data = await response.json();
      setHalfDayData(data);
      const totalHalfDayDeduction = data.totalDeduction || 0;

      onDataFetched(data.totalDeduction || 0);
    } catch (error) {
      console.error("Error fetching half-days:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalfDays();
  }, [employeeId, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-900/50 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-gray-400">Loading half day data...</p>
        </div>
      </div>
    );
  }

  if (!halfDayData) return null;

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              {halfDayData.employeeName}'s Half-Day Deductions
            </h2>
            <div className="px-4 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-sm">
              {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
                month: "long",
              })} {selectedYear}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Sun className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Half Days</p>
                <p className="text-2xl font-bold text-white">{halfDayData.totalHalfDays}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Deduction/Day</p>
                <p className="text-2xl font-bold text-white">₹{parseFloat(halfDayData.dailySalary / 2).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Deduction</p>
                <p className="text-2xl font-bold text-red-400">₹{parseFloat(halfDayData.totalDeduction).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Half-Day History</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CalendarDays className="w-4 h-4" />
              <span>{halfDayData.totalDaysInMonth} Days Month</span>
            </div>
          </div>

          {!halfDayData.halfDayDetails?.length ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No half-days recorded this month</p>
            </div>
          ) : (
            <div className="space-y-4">
              {halfDayData.halfDayDetails.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span className="text-white">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{entry.hoursWorked} Hours Worked</span>
                    <span className="px-2 py-1 bg-purple-500/10 rounded-full text-purple-400 text-xs ml-2">
                      -₹{(parseFloat(halfDayData.dailySalary) / 2).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HalfDayDeduction.propTypes = {
//   employeeId: PropTypes.string.isRequired,
//   onDataFetched: PropTypes.func,
// };

export default HalfDayDeduction;