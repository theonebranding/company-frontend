import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Coffee, 
  AlertCircle,
  ChevronDown,
  UserCheck,
  UserX,
  Timer
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const AttendanceTab = ({ employeeId }) => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [attendanceData, setAttendanceData] = useState([]);
  const [lateCheckinData, setLateCheckinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

  const formatTime = (time) => {
    if (!time) return "N/A";
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatRecessDuration = (milliseconds) => {
    if (!milliseconds) return "0m 0s";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatWorkingTime = (minutes) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/attendance-summary/monthly?employeeId=${employeeId}&month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch attendance data.");

      const { records } = await response.json();
      setAttendanceData(records || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLateCheckins = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/late-checkins/find?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch late check-ins.");

      const { lateCheckIns } = await response.json();
      setLateCheckinData(lateCheckIns || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch late check-ins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      if (activeTab === "attendance") {
        fetchAttendanceData();
      } else {
        fetchLateCheckins();
      }
    }
  }, [employeeId, month, year, activeTab]);

   const getStatusIcon = (status) => {
    const icons = {
      Present: <UserCheck className="w-4 h-4" />,
      Absent: <UserX className="w-4 h-4" />,
      Late: <AlertCircle className="w-4 h-4" />,
      "On Leave": <Calendar className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      Present: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Absent: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      Late: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      "On Leave": "bg-sky-500/20 text-sky-400 border-sky-500/30"
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <div className="flex gap-4 p-1 bg-gray-800/40 rounded-lg w-fit">
        <button
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === "attendance"
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          <Calendar className="w-4 h-4" />
          Attendance
        </button>
        <button
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === "lateCheckin"
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("lateCheckin")}
        >
          <Clock className="w-4 h-4" />
          Late Check-Ins
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-lg">
        <div className="relative">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          min="2000"
          max={new Date().getFullYear()}
        />
        <button
          onClick={activeTab === "attendance" ? fetchAttendanceData : fetchLateCheckins}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px] bg-gray-800/40 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="ml-3 text-gray-300">Loading records...</span>
        </div>
      ) : activeTab === "attendance" ? (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/40">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr className="text-gray-300">
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Check-In</th>
                <th className="px-6 py-4 text-left">Check-Out</th>
                <th className="px-6 py-4 text-left">Working Time</th>
                <th className="px-6 py-4 text-left">Recess Time</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {attendanceData.map((record) => (
                <tr key={record._id} className="hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {formatTime(record.checkInTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-rose-400" />
                      {formatTime(record.checkOutTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-sky-400" />
                      {formatWorkingTime(record.totalWorkingTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      {formatRecessDuration(record.totalRecessDuration)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${getStatusColor(record.currentStatus)}`}>
                        {getStatusIcon(record.currentStatus)}
                        {record.currentStatus}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/40">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr className="text-gray-300">
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Predefined Check-In</th>
                <th className="px-6 py-4 text-left">Actual Check-In</th>
                <th className="px-6 py-4 text-left">Late By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {lateCheckinData.map((record) => (
                <tr key={record._id} className="hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {record.predefinedCheckInTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {formatTime(record.actualCheckInTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-rose-400" />
                      {`${record.lateByMinutes} minutes`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer theme="dark" position="top-right" />
    </div>
  );
};

export default AttendanceTab;