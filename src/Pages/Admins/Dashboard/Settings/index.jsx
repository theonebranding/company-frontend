import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Settings, Phone, Mail, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [originalData, setOriginalData] = useState({}); // For tracking changes
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch Admin Profile
  const fetchAdminSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/adminProfile/get-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setFormData({
        name: data.admin.name || "",
        email: data.admin.email || "",
        phoneNumber: data.admin.phoneNumber || "",
      });
      setOriginalData({
        name: data.admin.name || "",
        email: data.admin.email || "",
        phoneNumber: data.admin.phoneNumber || "",
      }); // Store original data
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      toast.error(error.message || "Failed to fetch admin settings.");
    } finally {
      setLoading(false);
    }
  };

  // Update Admin Profile
  const updateAdminSettings = async (e) => {
    e.preventDefault();

    // Filter out unchanged fields
    const updatedData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== originalData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/adminProfile/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      const data = await response.json();
      setOriginalData(formData); // Update original data to match the current form
      toast.success(data.message || "Settings updated successfully.");
    } catch (error) {
      console.error("Error updating admin settings:", error);
      toast.error(error.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">Admin Settings</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="ml-3 text-gray-300">Loading settings...</span>
          </div>
        ) : (
          <form
            onSubmit={updateAdminSettings}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md focus:outline-none focus:ring focus:ring-indigo-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={2000} />
    </div>
  );
};

export default AdminSettings;
