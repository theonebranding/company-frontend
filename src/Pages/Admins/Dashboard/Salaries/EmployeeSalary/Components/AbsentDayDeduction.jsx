import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  DollarSign, 
  ClipboardList, 
  Calendar,
  AlertCircle,
  Loader2,
  ChevronDown,
  FilterIcon,
  XCircle,
  Check
} from "lucide-react";

const AbsentDayDeduction = ({ employeeId, onDataFetched }) => {
  const [absentData, setAbsentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

const fetchAbsentDays = async () => {
    try {
      setLoading(true);

      const startDate = `01-${selectedMonth.toString().padStart(2, '0')}-${selectedYear}`;
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const endDate = `${lastDay}-${selectedMonth.toString().padStart(2, '0')}-${selectedYear}`;

      const queryParams = new URLSearchParams({
        employeeId: employeeId,
        startDate: startDate,
        endDate: endDate
      }).toString();

      const response = await fetch(
        `${BASE_URL}/attendance-summary/employee-absentee-list?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch absent days.");
      const data = await response.json();
      setAbsentData(data);
      onDataFetched(data.totalDeduction || 0);
    } catch (error) {
      console.error("Error fetching absent days:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsentDays();
  }, [employeeId, selectedMonth, selectedYear]);


  const FilterDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-gray-800/40 rounded-full text-gray-200 hover:bg-gray-700/40 transition-all duration-200 border border-gray-700/50 hover:border-indigo-500/50"
      >
        <FilterIcon className="w-4 h-4 text-indigo-400" />
        <span>Filter Period</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isFilterOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 z-10">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full bg-gray-700/50 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-600/50 hover:border-indigo-500/50 transition-all duration-200"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Select Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full bg-gray-700/50 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-600/50 hover:border-indigo-500/50 transition-all duration-200"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800/30 rounded-2xl border border-gray-700/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-gray-400 font-medium">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (!absentData) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 p-3 rounded-xl">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Absent Day Deductions
            </h2>
            <p className="text-gray-400">
              Tracking absences for {months[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
        </div>
        <FilterDropdown />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <ClipboardList className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-gray-400 font-medium">Total Absent Days</span>
          </div>
          <p className="text-3xl font-bold text-white">{absentData.totalAbsents}</p>
        </div>

        <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-gray-400 font-medium">Deduction per Day</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{parseFloat(absentData.dailySalary).toLocaleString()}</p>
        </div>

        <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-500/10 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-gray-400 font-medium">Total Deduction</span>
          </div>
          <p className="text-3xl font-bold text-red-400">₹{parseFloat(absentData.totalDeduction).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Absence Details</h3>
        </div>
        
        {absentData.absentDates?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {absentData.absentDates.map((entry, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50 hover:border-indigo-500/50"
              >
                <CalendarDays className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300 font-medium">{entry.formattedDate}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/30">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No absences recorded for {months[selectedMonth - 1]} {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// AbsentDayDeduction.propTypes = {
//   employeeId: PropTypes.string.isRequired,
//   onDataFetched: PropTypes.func,
// };

export default AbsentDayDeduction;