import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";
import InformationTab from "./Components/InformationTab";
import HolidaysTab from "./Components/HolidaysTab";
import AttendanceTab from "./Components/AttendanceTab";
import LeaveRequestsTab from "./Components/LeaveRequestsTab";

const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("information");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/employee/find?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch employee details.");
      const data = await response.json();
      setEmployeeDetails(data.employee);
    } catch (error) {
      toast.error(error.message || "Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "information") fetchEmployeeData();
  }, [activeTab]);

  const TabButton = ({ label, tab }) => (
    <button
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 hover:text-indigo-400 ${
        activeTab === tab
          ? "border-indigo-500 text-indigo-500 bg-indigo-500/10"
          : "border-transparent text-gray-400 hover:border-indigo-400/30"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 ml-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-gray-600"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-100">Employee Profile</h1>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-700/50">
          <TabButton label="Information" tab="information" />
          <TabButton label="Holidays" tab="holidays" />
          <TabButton label="Leave Requests" tab="leaves" />          
          <TabButton label="Attendance" tab="attendance" />          
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            {activeTab === "information" && <InformationTab employeeId={id}  />}
            {activeTab === "holidays" && <HolidaysTab employeeId={id} />}
            {activeTab === "leaves" && <LeaveRequestsTab employeeId={id}/>}
            {activeTab === "attendance" && <AttendanceTab employeeId={id} />}            
          </>
        )}
      </div>
      <ToastContainer theme="dark" position="top-right" autoClose={2000} closeOnClick={true} />
    </div>
  );
};

export default AdminEmployeeProfile;
