import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckSquare, AlertTriangle, Search, Users, Timer, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const MonthlyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [lateCheckIns, setLateCheckIns] = useState([]);
  const [totalWorkHours, setTotalWorkHours] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const employeeId = localStorage.getItem("_id");

   const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours ${remainingMinutes} minutes`;
  };

  const formatLateBy = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} minutes`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  };

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/attendance-summary/monthly?employeeId=${employeeId}&month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch monthly attendance");

      const data = await response.json();
      setRecords(data.records || []);
      const totalMinutes = parseInt(data.totalWorkHours.split(" ")[0], 10) || 0;
      setTotalWorkHours(totalMinutes/60);

      toast.success(data.message || "Monthly attendance fetched successfully");
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      toast.error(error.message || "Failed to fetch monthly attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchLateCheckIns = async () => {
    setLoading(true);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;
    try {
      const response = await fetch(
        `${BASE_URL}/late-checkins/find?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch late check-ins");

      const data = await response.json();
      setLateCheckIns(data.lateCheckIns || []);
      toast.success(data.message || "Late check-ins fetched successfully");
    } catch (error) {
      console.error("Error fetching late check-ins:", error);
      toast.error(error.message || "Failed to fetch late check-ins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance();
    fetchLateCheckIns();
  }, [month, year]);

  const handleMonthChange = (e) => setMonth(Number(e.target.value));
  const handleYearChange = (e) => setYear(Number(e.target.value));


  const getStatistics = () => {
    const totalDays = records.length;
    const totalLateCheckins = lateCheckIns.length;
    const averageWorkHours = totalDays ? (totalWorkHours / totalDays).toFixed(1) : 0;
    const onTimeCheckins = totalDays - totalLateCheckins;

    return { totalDays, totalLateCheckins, averageWorkHours, onTimeCheckins };
  };

  return (
    <div className="ml-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-10 h-10 text-indigo-400" />
                Monthly Attendance
              </h1>
              <p className="text-gray-400">Track and manage your attendance records</p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={month}
                onChange={handleMonthChange}
                className="p-3 rounded-xl bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all hover:bg-gray-700/70"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={handleYearChange}
                className="p-3 rounded-xl bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all w-32 hover:bg-gray-700/70"
                min="2000"
                max={new Date().getFullYear()}
              />
              <button
                onClick={() => {
                  fetchMonthlyAttendance();
                  fetchLateCheckIns();
                }}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20"
              >
                <Search className="w-5 h-5" />
                {loading ? "Loading..." : "Show Records"}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Days",
              value: getStatistics().totalDays,
              icon: Users,
              color: "text-blue-400",
              bgColor: "bg-blue-400/10",
              borderColor: "border-blue-400/20"
            },
            {
              title: "Average Hours/Day",
              value: `${getStatistics().averageWorkHours}h`,
              icon: Clock,
              color: "text-green-400",
              bgColor: "bg-green-400/10",
              borderColor: "border-green-400/20"
            },
            {
              title: "On-Time Check-ins",
              value: getStatistics().onTimeCheckins,
              icon: CheckSquare,
              color: "text-purple-400",
              bgColor: "bg-purple-400/10",
              borderColor: "border-purple-400/20"
            },
            {
              title: "Late Check-ins",
              value: getStatistics().totalLateCheckins,
              icon: AlertCircle,
              color: "text-red-400",
              bgColor: "bg-red-400/10",
              borderColor: "border-red-400/20"
            }
          ].map((stat, index) => (
            <div key={index} className={`p-6 rounded-2xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg">
          <div className="flex gap-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`pb-4 px-4 font-semibold transition-all ${
                activeTab === 'attendance'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Attendance Records
              </div>
            </button>
            <button
              onClick={() => setActiveTab('late')}
              className={`pb-4 px-4 font-semibold transition-all ${
                activeTab === 'late'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Late Check-ins
              </div>
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="overflow-x-auto">
            {activeTab === 'attendance' ? (
              records.length > 0 ? (
                <table className="w-full text-gray-300">
                  <thead className="text-gray-200">
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-6">Date</th>
                      <th className="text-left py-4 px-6">Check-in Time</th>
                      <th className="text-left py-4 px-6">Check-out Time</th>
                      <th className="text-left py-4 px-6">Break Duration</th>
                      <th className="text-left py-4 px-6">Total Working Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-700/50 transition-colors border-b border-gray-700/50"
                      >
                        <td className="py-4 px-6">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td className="py-4 px-6">
                          {record.checkOutTime
                            ? new Date(record.checkOutTime).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td className="py-4 px-6">
                          {record.totalRecessDuration
                            ? `${Math.floor(record.totalRecessDuration / 60000)} minutes`
                            : "0 minutes"}
                        </td>
                        <td className="py-4 px-6">
                          {record.totalWorkingTime
                            ? formatTime(record.totalWorkingTime)
                            : "0 hours 0 minutes"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No records available for the selected month and year.</p>
                </div>
              )
            ) : (
              lateCheckIns.length > 0 ? (
                <table className="w-full text-gray-300">
                  <thead className="text-gray-200">
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-6">Date</th>
                      <th className="text-left py-4 px-6">Predefined Check-in</th>
                      <th className="text-left py-4 px-6">Actual Check-in</th>
                      <th className="text-left py-4 px-6">Late By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateCheckIns.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-700/50 transition-colors border-b border-gray-700/50"
                      >
                        <td className="py-4 px-6">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-4 px-6">{record.predefinedCheckInTime}</td>
                        <td className="py-4 px-6">
                          {record.actualCheckInTime
                            ? new Date(record.actualCheckInTime).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td className="py-4 px-6 text-yellow-400">{formatLateBy(record.lateByMinutes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <CheckSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-400">No late check-ins for the selected month and year.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={2000} />
    </div>
  );
};

export default MonthlyAttendance;