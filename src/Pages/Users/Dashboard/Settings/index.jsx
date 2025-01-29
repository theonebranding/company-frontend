import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserCog, User, ChevronRight, Loader2, CreditCard, Shield, Building } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phoneNumber: "",
      dateofBirth: "",
      address: "",
      state: "",
      city: "",
      district: "",
      pinCode: "",
    },
    professionalInfo: {
      jobRole: "",
      joinedDate: "",
      serviceTime: "",
    },
    bankAccountInfo: {
      bankName: "",
      branchName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
    },
    identificationInfo: {
      aadharNumber: "",
      panNumber: "",
      licenseInfo: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/employee/my-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch profile data");

      const { employee } = await response.json();
      setFormData({
        personalInfo: {
          name: employee.name || "",
          email: employee.email || "",
          phoneNumber: employee.phoneNumber || "",
          dateofBirth: employee.dateofBirth
            ? new Date(employee.dateofBirth).toISOString().split("T")[0]
            : "",
          address: employee.address || "",
          state: employee.state || "",
          city: employee.city || "",
          district: employee.district || "",
          pinCode: employee.pinCode || "",
        },
        professionalInfo: {
          jobRole: employee.jobRole || "",
          joinedDate: employee.joinedDate 
            ? new Date(employee.joinedDate).toISOString().split("T")[0]
            : "",
          serviceTime: employee.serviceTime || "",
        },
        bankAccountInfo: {
          bankName: employee.bankName || "",
          branchName: employee.branchName || "",
          accountNumber: employee.bankAccountNumber || "",
          confirmAccountNumber: employee.bankAccountNumber || "",
          ifscCode: employee.ifscCode || "",
        },
        identificationInfo: {
          aadharNumber: employee.aadharNumber || "",
          panNumber: employee.panNumber || "",
          licenseInfo: employee.licenseInfo || "",
        },
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error(error.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/employee/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData[section]),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to update profile data");
      }

      const { message } = await response.json();
      toast.success(message || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast.error(error.message || "Failed to update profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value,
      },
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const tabs = [
    { id: "personalInfo", label: "Personal Info", icon: User, color: "text-emerald-400" },
    { id: "professionalInfo", label: "Professional Info", icon: Building, color: "text-orange-400" },
    { id: "bankAccountInfo", label: "Bank Info", icon: CreditCard, color: "text-blue-400" },
    { id: "identificationInfo", label: "Identification", icon: Shield, color: "text-purple-400" },
  ];

  const renderForm = (section, fields) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSection(section);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(fields).map(([key, value]) => (
          <div
            key={key}
            className="group relative bg-gray-800/50 rounded-xl p-4 ring-1 ring-white/10 hover:ring-indigo-500/50 transition-all duration-300"
          >
            <label className="block text-sm font-medium mb-2 text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="relative">
              <input
                type={key.includes("email") ? "email" : key.includes("date") ? "date" : "text"}
                name={key}
                value={value}
                onChange={(e) => handleChange(e, section)}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-all duration-300"
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          {loading ? "Updating..." : `Update ${section.replace(/([A-Z])/g, " $1")}`}
        </button>
      </div>
    </form>
  );

  return (
    <div className="ml-20 min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 backdrop-blur-sm ring-1 ring-white/10">      
             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <UserCog className="w-9 h-9 text-indigo-400" />           
               Account Settings
            </h1>
          <p className="text-gray-400 mt-2">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50"
                    : "text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            {renderForm(activeTab, formData[activeTab])}
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

export default Settings;