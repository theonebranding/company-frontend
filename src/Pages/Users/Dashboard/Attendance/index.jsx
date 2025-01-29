import React, { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Coffee, StopCircle, Timer, Calendar, Users, AlertTriangle  } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import confetti from "canvas-confetti";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
  const [status, setStatus] = useState("");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [totalRecessDuration, setTotalRecessDuration] = useState("0 minutes");
  const [totalWorkingTime, setTotalWorkingTime] = useState("0 minutes");
  const [liveWorkingTime, setLiveWorkingTime] = useState("0 minutes");
  const [loading, setLoading] = useState(false);  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isLate, setIsLate] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000; // Reduced duration to 3 seconds
    const colors = ["#10B981", "#ffffff"]; // Emerald and white to match theme
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
 
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/attendance/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch attendance status");

      const { data } = await response.json();
      setStatus(data.status || "No status available");
      setCheckInTime(data.checkInTime);
      setCheckOutTime(data.checkOutTime);
      setTotalRecessDuration(data.totalRecessDuration || "0 minutes");
      setTotalWorkingTime(data.totalWorkingTime || "0 minutes");
      setLiveWorkingTime(data.liveWorkingTime || "0 minutes");
      setIsLate(data.lateCheckIn || false);   
      // console.log(lateCheckIn)   
    } catch (error) {
      console.error("Error fetching attendance status:", error);
      toast.error(error.message || "Failed to fetch attendance status.");
    }
  };

  const handleAttendanceAction = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/attendance/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || `Failed to ${action}`);
      }

      const { attendance, message, lateCheckIn } = await response.json();
      // console.log(lateCheckIn)

      setStatus(attendance.currentStatus || "No status available");
      setCheckInTime(attendance.checkInTime);
      setCheckOutTime(attendance.checkOutTime);
      setTotalRecessDuration(
        attendance.totalRecessDuration
          ? `${Math.floor(attendance.totalRecessDuration / 60000)} minutes`
          : "0 minutes"
      );

      setLiveWorkingTime(attendance.liveWorkingTime || "0 minutes");

      const totalWorkingTime =
        attendance.checkOutTime && attendance.checkInTime
          ? `${Math.floor(
              (new Date(attendance.checkOutTime) -
                new Date(attendance.checkInTime) -
                (attendance.totalRecessDuration || 0)) /
                3600000
            )} hours ${Math.floor(
              ((new Date(attendance.checkOutTime) -
                new Date(attendance.checkInTime) -
                (attendance.totalRecessDuration || 0)) %
                3600000) /
                60000
            )} minutes`
          : "0 minutes";

      setTotalWorkingTime(totalWorkingTime);
      toast.success(message || `${action} successful`);

      // Show different toast for late check-in
      // console.log(attendance.lateCheckIn)
      if (action === 'checkin' && attendance.lateCheckIn) {
        
        toast.warning(lateCheckIn || "Late Check-in", {          
          icon: "⚠️"
        });
      } else {
        // toast.success(message || `${action} successful`);
        
      }
      
      // Trigger confetti for check-in and check-out actions
      if (action === 'checkin' || action === 'checkout') {
        triggerConfetti();
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error.message);
      toast.error(error.message || `Failed to ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "Checked In") {
      const interval = setInterval(() => {
        fetchAttendanceStatus();
      }, 120000);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "Checked In":
        return "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50";
      case "Checked Out":
        return "bg-red-500/20 text-red-400 ring-1 ring-red-500/50";
      case "In Recess":
        return "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/50";
    }
  };

  const getActionButtonStyle = (action, disabled) => {
    if (disabled) return "bg-gray-800/50 text-gray-600 cursor-not-allowed opacity-50";
    
    switch (action) {
      case "checkin":
        return "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 hover:bg-emerald-500/20";
      case "checkout":
        return "bg-red-500/10 text-red-400 ring-1 ring-red-500/50 hover:bg-red-500/20";
      case "start-recess":
        return "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/50 hover:bg-amber-500/20";
      case "end-recess":
        return "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50 hover:bg-indigo-500/20";
      default:
        return "bg-gray-700 text-gray-300 hover:bg-gray-600";
    }
  };

  const isDisabled = (buttonStatus) => {
    if (status === "In Recess") {
      return buttonStatus !== "end-recess";
    }

    if (status !== "Checked In" && buttonStatus !== "checkin") {
      return true;
    }

    if (buttonStatus === "checkin" && status === "Checked In") {
      return true;
    }

    if (buttonStatus === "checkout" && (status === "Checked Out" || status === "In Recess")) {
      return true;
    }

    if (buttonStatus === "start-recess" && (status === "Checked Out" || status === "In Recess")) {
      return true;
    }

    if (buttonStatus === "end-recess" && status !== "In Recess") {
      return true;
    }

    return false;
  };

  return (
    <div className="ml-20 p-6 min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl ring-1 ring-indigo-500/30">
              <Clock className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Attendance Dashboard</h1>
              <p className="text-gray-400">
                {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className={`px-6 py-3 rounded-xl ${getStatusColor()} backdrop-blur-sm`}>
              <span className="font-semibold text-lg">{status || "No Status"}</span>
            </div>
            {isLate &&  (
              <div className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50 backdrop-blur-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Late Check In</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg ring-1 ring-emerald-500/30">
                <LogIn className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Check-in</h3>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-200">Check-in</h3>
                {isLate && <span className="text-xs text-yellow-400">Late Arrival</span>}
            </div>
            <p className="text-gray-400">
              {checkInTime ? new Date(checkInTime).toLocaleString() : "Not checked in"}
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg ring-1 ring-red-500/30">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Check-out</h3>
            </div>
            <p className="text-gray-400">
              {checkOutTime ? new Date(checkOutTime).toLocaleString() : "Not checked out"}
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg ring-1 ring-amber-500/30">
                <Coffee className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Break Time</h3>
            </div>
            <p className="text-gray-400">{totalRecessDuration}</p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/30">
                <Timer className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Working Time</h3>
            </div>
            <p className="text-gray-400">{liveWorkingTime}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "checkin", icon: LogIn, label: "Check In" },
            { id: "checkout", icon: LogOut, label: "Check Out" },
            { id: "start-recess", icon: Coffee, label: "Start Break" },
            { id: "end-recess", icon: StopCircle, label: "End Break" }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleAttendanceAction(id)}
              disabled={isDisabled(id)}
              className={`p-4 rounded-xl transition-all duration-300 ${getActionButtonStyle(
                id,
                isDisabled(id)
              )} group flex flex-col items-center gap-3`}
            >
              <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg ring-1 ring-purple-500/30">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Today's Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Working Hours</span>
                <span className="text-gray-200">{totalWorkingTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Break Duration</span>
                <span className="text-gray-200">{totalRecessDuration}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg ring-1 ring-blue-500/30">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Current Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Live Working Time</span>
                <span className="text-gray-200">{liveWorkingTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current State</span>
                <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor()}`}>
                  {status || "No Status"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        theme="dark" 
        position="top-right" 
        pauseOnHover={false} 
        limit={1} 
        autoClose={2000}
        toastClassName="bg-gray-800 ring-1 ring-white/10"
      />
    </div>
  );
};

export default Attendance;