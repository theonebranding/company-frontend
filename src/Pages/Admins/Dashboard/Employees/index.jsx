import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  User, Mail, Phone, Briefcase, Loader2, Search, 
  Filter, ChevronDown, ExternalLink, ArrowLeft,
  Users, Building2
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch employees.");

      const data = await response.json();
      setEmployees(data.employees || []);
      setUniqueRoles(["All", ...new Set(data.employees.map((emp) => emp.jobRole))]);
      toast.success("Employees fetched successfully");
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/employee/find?name=${encodeURIComponent(searchTerm)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to search employees.");

      const data = await response.json();
      setSearchResults([data.employee]);
      setIsSearchActive(true);
      toast.success("Search completed successfully");
    } catch (error) {
      console.error("Error searching employees:", error);
      toast.error(error.message || "Failed to search employees");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setIsSearchActive(false);
    setSearchResults([]);
    setSearchTerm("");
  };

  const filteredEmployees = employees.filter((employee) => {
    return selectedRole === "All" || employee.jobRole === selectedRole;
  });

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 ml-20 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500 bg-opacity-20 rounded-xl">
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Manage Employees</h1>
                <p className="text-gray-400 mt-1">Total Employees: {employees.length}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div className="md:col-span-3">
              <button
                onClick={handleSearch}
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="md:col-span-3 relative filter-dropdown">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                         flex items-center justify-between gap-2 hover:bg-gray-800
                         transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-500" />
                  <span>{selectedRole === "All" ? "All Roles" : selectedRole}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? "transform rotate-180" : ""}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-full bg-gray-900 border border-gray-700 
                               rounded-lg shadow-lg z-10 py-2 max-h-60 overflow-y-auto">
                  {uniqueRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors duration-200
                                flex items-center gap-2 ${selectedRole === role ? "bg-indigo-500 bg-opacity-20" : ""}`}
                    >
                      {role === "All" ? (
                        <Users className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Building2 className="w-4 h-4 text-indigo-500" />
                      )}
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results or Employee List */}
        {isSearchActive ? (
          <div className="space-y-4">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg 
                       flex items-center gap-2 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Employees
            </button>

            {searchResults.map((employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="ml-3 text-gray-300">Loading employees...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee._id} employee={employee} />
            ))}
          </div>
        )}
      </div>
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} closeOnClick autoClose={1500} />
    </div>
  );
};

// Enhanced Employee Card Component
const EmployeeCard = ({ employee }) => (
  <div className="group bg-gray-800 rounded-xl border border-gray-700 hover:border-indigo-500 
                  transition-all duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-indigo-500 bg-opacity-20 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-200">{employee.name}</h3>
          <span className="text-sm text-indigo-400">{employee.jobRole}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="w-8 h-8 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-green-500" />
          </div>
          {employee.email}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="w-8 h-8 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-yellow-500" />
          </div>
          {employee.phoneNumber}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="w-8 h-8 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          {employee.jobRole}
        </div>
      </div>
      
      <Link to = {`/admin/dashboard/employees/${employee._id}`}  className="mt-6 w-full px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg
        flex items-center justify-center gap-2 transition-colors duration-200  group-hover:bg-indigo-600">      
        <ExternalLink className="w-4 h-4" />
        <span>View Profile</span>        
      </Link>
    </div>
  </div>
);

export default AdminManageEmployees;