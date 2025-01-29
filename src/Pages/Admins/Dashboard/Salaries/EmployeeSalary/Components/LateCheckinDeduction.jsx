import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  DollarSign,
  Calendar,
  ChevronDown,
  FilterIcon,
} from "lucide-react";

const LateCheckinDeduction = ({ employeeId, onDataFetched }) => {
  const [lateCheckinData, setLateCheckinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deductions, setDeductions] = useState({
    lateCheckins: 0,
    totalDeduction: 0,
    finalSalary: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const fetchLateCheckinDeductions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/late-checkins/deduction?employeeId=${employeeId}&month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch late check-in deductions.");

      const data = await response.json();
      setLateCheckinData(data.lateCheckInDetails || []);

      setDeductions({
        lateCheckins: data.totalLateCheckIns || 0,
        totalDeduction: data.totalDeduction || 0,
        finalSalary: data.finalSalary || 0,
        totalLateCheckinDeduction : data.totalDeduction|| 0
      });
       onDataFetched(data.totalDeduction || 0);
    } catch (error) {
      console.error("Error fetching late check-in deductions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLateCheckinDeductions();
  }, [employeeId, selectedMonth, selectedYear]);

  const FilterDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
      >
        <FilterIcon className="w-4 h-4" />
        <span>Filter</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Late Check-in Deductions</h2>
            <div className="px-4 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-sm">
              {months[selectedMonth - 1]} {selectedYear}
            </div>
          </div>
          <FilterDropdown />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <ClipboardList className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Late Check-ins</p>
                <p className="text-2xl font-bold text-white">{deductions.lateCheckins}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Deduction</p>
                <p className="text-2xl font-bold text-white">₹{deductions.totalDeduction.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Final Salary</p>
                <p className="text-2xl font-bold text-white">₹{deductions.finalSalary.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Late Check-in History</h3>
          </div>

          {lateCheckinData.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No late check-ins recorded for {months[selectedMonth - 1]} {selectedYear}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-400">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                    <th className="px-4 py-3">Late By (mins)</th>
                    <th className="px-4 py-3">Predefined Check-in</th>
                    <th className="px-4 py-3 rounded-r-lg">Actual Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {lateCheckinData.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-full">
                          {entry.lateByMinutes} mins
                        </span>
                      </td>
                      <td className="px-4 py-3">{entry.predefinedCheckInTime}</td>
                      <td className="px-4 py-3">
                        {new Date(entry.actualCheckInTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// LateCheckinDeduction.propTypes = {
//   employeeId: PropTypes.string.isRequired,
//   onDataFetched: PropTypes.func,
// };

export default LateCheckinDeduction;