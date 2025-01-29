import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Info,
  AlertCircle,
  CalendarDays,
  UserCheck,
  ClipboardList,
  ChevronLeft,
  Building,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import LateCheckinDeduction from "./Components/LateCheckinDeduction";
import HalfDayDeduction from "./Components/HalfDayDeduction";
import AbsentDayDeduction from "./Components/AbsentDayDeduction";
import OverallCalculation from "./Components/OverallCalculation";
import { toast } from "react-toastify";

const AdminEmployeeSalaryProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [activeTab, setActiveTab] = useState("salary");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ baseSalary: "", bonuses: "", deductions: "" });
  const [deductions, setDeductions] = useState({
    lateCheckinsTotalDeduction: 0,
    totalHalfDayDeduction: 0,
    totalAbsentDayDeduction: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleLateCheckinDeduction = (lateDeduction) => {
    setDeductions((prev) => ({
      ...prev,
      totalLateCheckinDeduction: lateDeduction,
    }));
  };

  const handleHalfDayDeduction = (halfDayDeduction) => {
    setDeductions((prev) => ({
      ...prev,
      totalHalfDayDeduction: halfDayDeduction,
    }));
  };

  const handleAbsentDayDeduction = (absentDeduction) => {
    setDeductions((prev) => ({
      ...prev,
      totalAbsentDayDeduction: absentDeduction,
    }));
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employee/find?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch employee details.");
      const data = await response.json();
      setEmployeeData(data.employee);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details.");
    }
  };

  const fetchSalaryDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/salary/find/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch salary details.");
      const data = await response.json();
      setSalaryData(data.salaries);
    } catch (error) {
      console.error("Error fetching salary details:", error);
      toast.error("Failed to fetch salary details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (salary) => {
    setEditData({
      baseSalary: salary.baseSalary,
      bonuses: salary.bonuses,
      deductions: salary.deductions,
    });
    setIsEditing(true);
  };

  const handleUpdate = async (salaryId) => {
    try {
      const response = await fetch(`${BASE_URL}/salary/${salaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error("Failed to update salary details.");
      toast.success("Salary updated successfully!");
      setIsEditing(false);
      fetchSalaryDetails();
    } catch (error) {
      console.error("Error updating salary details:", error);
      toast.error("Failed to update salary details.");
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchSalaryDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!employeeData || salaryData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-gray-400 mb-6">We couldn't find any details for this employee.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "salary", label: "Salary Details", icon: DollarSign },
    { id: "late-checkins", label: "Late Check-ins", icon: ClipboardList },
    { id: "absent-days", label: "Absent Days", icon: UserCheck },
    { id: "half-day", label: "Half Days", icon: CalendarDays },
    { id: "overview", label: "Overview", icon: BadgeCheck },
  ];

  const renderSalaryDetails = () => {
    return salaryData.map((salary) => (
      <div key={salary._id} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Salary Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-400 mb-4" />
            <p className="text-gray-400 mb-2">Base Salary</p>
            <p className="text-2xl font-bold">₹{salary?.baseSalary}</p>
          </div>
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <Info className="w-8 h-8 text-yellow-400 mb-4" />
            <p className="text-gray-400 mb-2">Bonuses</p>
            <p className="text-2xl font-bold">₹{salary?.bonuses}</p>
          </div>
          <div className="bg-gray-700/50 p-6 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
            <p className="text-gray-400 mb-2">Deductions</p>
            <p className="text-2xl font-bold">₹{salary?.deductions}</p>
          </div>
        </div>
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <p className="text-gray-400 mb-2">Total Salary</p>
          <p className="text-2xl font-bold">₹{salary?.totalSalary}</p>
        </div>
        <button
          onClick={() => handleEdit(salary)}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Edit Salary
        </button>
      </div>
    ));
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "salary":
        return renderSalaryDetails();
      case "late-checkins":
        return <LateCheckinDeduction 
          employeeId={id} 
          onDataFetched={handleLateCheckinDeduction} 
        />;
      case "half-day":
        return <HalfDayDeduction 
          employeeId={id} 
          onDataFetched={handleHalfDayDeduction}
        />;
      case "absent-days":
        return <AbsentDayDeduction 
          employeeId={id} 
          onDataFetched={handleAbsentDayDeduction}
        />;
      case "overview":
        return (
          <OverallCalculation
            baseSalary={salaryData[0].baseSalary}
            bonuses={salaryData[0].bonuses}
            deductions={deductions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="ml-10 p-6 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Salary Management</span>
          </button>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white">{employeeData.name}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{employeeData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>Employee ID: {id}</span>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-500/10 px-4 py-2 rounded-lg">
                <p className="text-indigo-400 font-semibold">Active Employee</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">{renderActiveTab()}</div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Salary</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 block mb-1">Base Salary</label>
                <input
                  type="number"
                  value={editData.baseSalary}
                  onChange={(e) => setEditData({ ...editData, baseSalary: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Bonuses</label>
                <input
                  type="number"
                  value={editData.bonuses}
                  onChange={(e) => setEditData({ ...editData, bonuses: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Deductions</label>
                <input
                  type="number"
                  value={editData.deductions}
                  onChange={(e) => setEditData({ ...editData, deductions: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(salaryData[0]._id)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeSalaryProfile;