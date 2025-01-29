import React, { useState, useEffect } from "react";
import { Loader2, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const AbsentEmployees = ({ startDate, endDate }) => {
  const [absentList, setAbsentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Helper function to format the date to YYYY-MM-DD for API requests
  const formatDate = (date) => {
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date; // If the date is already formatted, return as is
  };

  const fetchAbsentList = async () => {
    setLoading(true);
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const response = await fetch(
        `${BASE_URL}/attendance-summary/absentee-list?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch absent list.");

      const { absentEmployees } = await response.json(); // Access the correct key
    
      
      setAbsentList(absentEmployees || []);
    } catch (error) {
      console.error("Error fetching absent list:", error);
      toast.error(error.message || "Failed to fetch absent list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAbsentList();
    }
  }, [startDate, endDate]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <XCircle className="text-red-400 w-6 h-6" />
        <h2 className="text-lg font-semibold text-gray-200">Absent Employees</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="ml-3 text-gray-300">Loading...</span>
        </div>
      ) : absentList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-2 font-medium">Employee Name</th>
                <th className="px-4 py-2 font-medium">Employee Email</th>
                <th className="px-4 py-2 font-medium">Employee ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {absentList.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-2">{employee.name || "N/A"}</td>
                  <td className="px-4 py-2">{employee.email || "N/A"}</td>
                  <td className="px-4 py-2">{employee._id || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No employees absent for the selected dates.</p>
      )}
      <ToastContainer theme="dark" position="top-right" autoClose={2000} limit={1} />
    </div>
  );
};

export default AbsentEmployees;
