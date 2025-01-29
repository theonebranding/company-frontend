import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, User, Mail, Phone, Home, Briefcase, Calendar, Banknote, ShieldCheck, DollarSign } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-200">{value || "Not Provided"}</p>
    </div>
  </div>
);

const InformationTab = () => {
  const { id } = useParams();
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
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Failed to fetch employee details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-sm font-medium text-gray-400 ml-3">Loading employee data...</span>
      </div>
    );
  }

  if (!employeeDetails) {
    return (
      <div className="text-center text-gray-400">
        Failed to load employee details. Please try again later.
      </div>
    );
  }

  // Calculate service time
  const joiningDate = new Date(employeeDetails.createdAt);
  const currentDate = new Date();
  const serviceTime = Math.floor((currentDate - joiningDate) / (1000 * 60 * 60 * 24 * 365)); // in years

  return (
    <div className="space-y-8">
      {/* Personal Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={User} label="Full Name" value={employeeDetails.name} color="bg-blue-500/10 text-blue-400" />
          <InfoCard icon={Mail} label="Email Address" value={employeeDetails.email} color="bg-green-500/10 text-green-400" />
          <InfoCard icon={Phone} label="Phone Number" value={employeeDetails.phoneNumber} color="bg-yellow-500/10 text-yellow-400" />
          <InfoCard
            icon={Home}
            label="Address"
            value={`${employeeDetails.address}, ${employeeDetails.city}, ${employeeDetails.state}, ${employeeDetails.pinCode}`}
            color="bg-gray-500/10 text-gray-400"
          />
        </div>
      </div>

      {/* Professional Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Professional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={Briefcase} label="Job Role" value={employeeDetails.jobRole} color="bg-purple-500/10 text-purple-400" />
          <InfoCard icon={Calendar} label="Joining Date" value={joiningDate.toLocaleDateString()} color="bg-pink-500/10 text-pink-400" />
          <InfoCard icon={Calendar} label="Service Time" value={`${serviceTime} years`} color="bg-teal-500/10 text-teal-400" />
        </div>
      </div>

      {/* Bank Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Bank Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={DollarSign} label="Bank Name" value={employeeDetails.bankName} color="bg-green-500/10 text-green-400" />
          <InfoCard icon={DollarSign} label="Bank Branch" value={employeeDetails.bankBranch} color="bg-blue-500/10 text-blue-400" />
          <InfoCard icon={Banknote} label="Bank Account Number" value={employeeDetails.bankAccountNumber} color="bg-yellow-500/10 text-yellow-400" />
          <InfoCard icon={Banknote} label="Bank IFSC Code" value={employeeDetails.ifscCode} color="bg-indigo-500/10 text-indigo-400" />
        </div>
      </div>

      {/* Identification Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Identification Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={ShieldCheck} label="Aadhar Number" value={employeeDetails.aadharNumber} color="bg-indigo-500/10 text-indigo-400" />
          <InfoCard icon={Banknote} label="PAN Number" value={employeeDetails.panNumber} color="bg-green-500/10 text-green-400" />
          <InfoCard icon={Briefcase} label="License Number" value={employeeDetails.licenseNumber || "Not Provided"} color="bg-red-500/10 text-red-400" />
        </div>
      </div>
      <ToastContainer theme="dark" position="top-right" autoClose={2000} />
    </div>
  );
};

export default InformationTab;
