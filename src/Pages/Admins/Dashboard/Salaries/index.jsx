import React, { useState, useEffect } from "react";
import {
  Search,
  DollarSign,
  Users,
  Briefcase,
  ArrowUpRight,
  UserPlus,
  Filter,
  ChevronDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminSalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch employees.");
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.message || "Failed to fetch employees.");
    }
  };

  const fetchSalaries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/salary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch salaries.");
      const data = await response.json();
      setSalaries(data.salaries || []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
      toast.error(error.message || "Failed to fetch salaries.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, []);

  const getEmployeeSalary = (email) => {
    const salaryEntry = salaries.find((salary) => salary.email === email);
    return salaryEntry ? salaryEntry.salary : "N/A";
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Active Departments",
      value: "3",
      icon: Briefcase,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="ml-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              <Briefcase className="w-8 h-8 inline-block text-indigo-400" /> Salary
              Management
            </h1>
            <p className="text-gray-400">Streamline employee compensation and benefits</p>
          </div>
          <button
            className="mt-4 md:mt-0 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add New Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 text-gray-300 hover:border-gray-600/50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => navigate(`/admin/dashboard/salaries/${employee._id}`)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-xl">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium text-white group-hover:text-indigo-400 transition-colors">
                    {employee.name}
                  </p>
                  <p className="text-sm text-gray-400">{employee.email}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  <span className="text-white font-medium">₹{getEmployeeSalary(employee.email)}</span> / month
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                  Full Time
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        theme="dark"
        pauseOnHover={false}
        limit={1}
        autoClose={2000}
      />
    </div>
  );
};

export default AdminSalaryManagement;
