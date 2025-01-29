import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Calendar,
  Loader2,
  Users,
  Clock,
  Timer,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Coffee,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO, addDays, subDays } from "date-fns";
import AbsentEmployees from "./Components/AbsentEmployees";
import PresentEmployees from "./Components/PresentEmployees";

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchAttendanceSummary = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(`${BASE_URL}/attendance-summary/date?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch attendance data.");

      const data = await response.json();
      const uniqueData = Array.from(
        new Map(data.summary.map((item) => [item.employeeEmail, item])).values()
      );
      setAttendanceData(uniqueData);
      toast.success("Attendance data fetched successfully.");
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error(error.message || "Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary(new Date());
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "text-green-400 bg-green-400/10";
      case "absent":
        return "text-red-400 bg-red-400/10";
      case "late":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.currentStatus?.toLowerCase() === "present").length;
    const late = attendanceData.filter(record => record.lateCheckIn === true).length;
    const absent = attendanceData.filter(record => record.currentStatus?.toLowerCase() === "absent").length;

    return { total, present, late, absent };
  };

  const stats = getAttendanceStats();

  const handlePrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
    fetchAttendanceSummary(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
    fetchAttendanceSummary(newDate);
  };

  return (
    <div className="ml-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6 mx-auto max-w-7xl">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Attendance Dashboard</h1>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-200">
                    Total Employees: {stats.total}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* <div className="flex items-center gap-4 p-4 bg-green-400/10 rounded-lg border border-green-400/20">
                  <UserCheck className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-sm text-green-400">Present</p>
                    <p className="text-2xl font-bold text-green-300">{stats.present}</p>
                  </div>
                </div> */}
                <div className="flex items-center gap-4 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-sm text-yellow-400">Late</p>
                    <p className="text-2xl font-bold text-yellow-300">{stats.late}</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-4 p-4 bg-red-400/10 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-sm text-red-400">Absent</p>
                    <p className="text-2xl font-bold text-red-300">{stats.absent}</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Date Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-indigo-400" />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevDay}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const newDate = parseISO(e.target.value);
                      setSelectedDate(newDate);
                      fetchAttendanceSummary(newDate);
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <button 
                    onClick={handleNextDay}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => fetchAttendanceSummary(selectedDate)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105"
              >
                <Clock className="w-4 h-4" />
                Fetch Attendance
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <span className="ml-3 text-gray-300">Loading attendance data...</span>
              </div>
            ) : attendanceData.length > 0 ? (
              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-700/50 text-gray-300">
                      <tr>
                        <th className="px-6 py-4 font-medium">Employee</th>
                        <th className="px-6 py-4 font-medium">Check-in</th>
                        <th className="px-6 py-4 font-medium">Check-out</th>
                        <th className="px-6 py-4 font-medium">Work Hours</th>
                        <th className="px-6 py-4 font-medium">Break Time</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Late Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {attendanceData.map((record, index) => (
                        <tr 
                          key={record._id} 
                          className={`transition-all duration-200 ${
                            hoveredRow === index ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'
                          }`}
                          onMouseEnter={() => setHoveredRow(index)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-200">{record.employeeName}</span>
                              <span className="text-xs text-gray-400">{record.employeeEmail}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {record.checkInTime ? (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-400" />
                                {new Date(record.checkInTime).toLocaleTimeString()}
                              </div>
                            ) : "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {record.checkOutTime ? (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-400" />
                                {new Date(record.checkOutTime).toLocaleTimeString()}
                              </div>
                            ) : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-indigo-400" />
                              <span className="text-gray-300">
                                {Math.floor(record.workHours / 3600000)}h{" "}
                                {Math.floor((record.workHours % 3600000) / 60000)}m
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Coffee className="w-4 h-4 text-orange-400" />
                              <span className="text-gray-300">
                                {Math.floor(record.totalRecessDuration / 3600000)}h{" "}
                                {Math.floor((record.totalRecessDuration % 3600000) / 60000)}m
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.currentStatus)}`}>
                              {record.currentStatus || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {record.lateCheckIn ? (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                <span>Yes</span>
                              </div>
                            ) : (
                              "No"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No attendance data available for the selected date.</p>
              </div>
            )}
          </div>
        </div>     
      
      {/* Absent Employees Section */}
      <AbsentEmployees startDate={selectedDate} endDate={selectedDate} />
      {/* console.log(startDate, endDate); */}

      {/* Present Employees Section */}
      <PresentEmployees startDate={selectedDate} endDate={selectedDate} />

      </div>      
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={2000} />
    </div>
  );
};

export default AdminAttendance;
