/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../Contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from AuthContext

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Use the login function from AuthContext
        // console.log(result.token, result.role, result._id, result.email);
        login(result.token, result.role, result._id, result.email);
        toast.success("Login successful! Redirecting to dashboard...");
        if(result.role === "admin") {
          setTimeout(() => {
            navigate("/admin/dashboard/attendance");
          }, 1000);
          return;
        }        
        else if(result.role === "employee") {
        setTimeout(() => {
          navigate("/employee/dashboard/attendance");
        }, 1000);
      }
      } else {
        const errorData = await response.json();
        setErrors({ apiError: errorData.message || "Invalid credentials" });
        toast.error(errorData.message || "Invalid credentials");
      }
    } catch (error) {
      setErrors({ apiError: "Network error. Please try again later." });
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-center text-yellow-500 mb-6">
          Welcome Back
        </h2>

        {/* API Error Message */}
        {errors.apiError && (
          <p className="text-red-500 text-center mb-4">{errors.apiError}</p>
        )}

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded-md bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none`}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-700"
            } rounded-md bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none`}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <a
            href="/forgot-password"
            className="text-sm text-yellow-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-yellow-500 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </form>

      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={1500} />
    </div>
  );
};

export default Login;
