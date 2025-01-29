import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Home from "../Pages/Home";
import Signup from "../Pages/Auth/Signup";
import ConfirmRegistration from "../Pages/Auth/ConfirmRegistration";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
// Employee Route 
import EmployeeSidebar from "../Pages/Users/Dashboard/Sidebar";
import DashboardHome from "../Pages/Users/Dashboard/Home";
import History from "../Pages/Users/Dashboard/History";
import Leaves from "../Pages/Users/Dashboard/Leaves";
import Settings from "../Pages/Users/Dashboard/Settings";
import Attendance from "../Pages/Users/Dashboard/Attendance";
import Holidays from "../Pages/Users/Dashboard/Holidays";
// Admin Route
import AdminSidebar from "../Pages/Admins/Dashboard/Sidebar";
import AdminDashboardHome from "../Pages/Admins/Dashboard/Home";
import AdminAttendance from "../Pages/Admins/Dashboard/Attendance";
import AdminSettings from "../Pages/Admins/Dashboard/Settings";
import AdminHolidays from "../Pages/Admins/Dashboard/Holidays";
import AdminManageEmployees from "../Pages/Admins/Dashboard/Employees";
import AdminEmployeeProfile from "../Pages/Admins/Dashboard/Employees/EmployeeProfile";
import AdminLeaveManagement from "../Pages/Admins/Dashboard/Leaves";
import AdminSalaryManagement from "../Pages/Admins/Dashboard/Salaries";
import AdminEmployeeSalaryProfile from "../Pages/Admins/Dashboard/Salaries/EmployeeSalary"



const AppRouter = () => {
  return ( 

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-registration" element={<ConfirmRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Private Routes */}
          <Route
          path="/employee/dashboard/home"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
               <EmployeeSidebar isActive="Home"/>
              <DashboardHome />
            </ProtectedRoute>
          }
        />        
        <Route
          path="/employee/dashboard/attendance"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSidebar isActive="Attendance" />
              <Attendance />
            </ProtectedRoute>
          }
        />
         <Route
          path="/employee/dashboard/history"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSidebar isActive="History" />
              <History />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/employee/dashboard/leaves"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSidebar isActive="Leaves" />
              <Leaves />
            </ProtectedRoute>
          }
        />
         <Route
          path="/employee/dashboard/holidays"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSidebar isActive="holidays" />
              <Holidays />
            </ProtectedRoute>
          }
        />       
         <Route
          path="/employee/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeSidebar isActive="Settings" />
              <Settings />
            </ProtectedRoute>
          }
        />

         {/* Admin Routes */}
          <Route
          path="/admin/dashboard/home"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Home" />
              <AdminDashboardHome />
            </ProtectedRoute> 
          }
        />
        <Route
          path="/admin/dashboard/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Attendance" />
              <AdminAttendance />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/dashboard/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Employees" />
              <AdminManageEmployees />
            </ProtectedRoute>
          }                 
        />
        <Route 
          path="/admin/dashboard/employees/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Employees" />
              <AdminEmployeeProfile />
            </ProtectedRoute>
          }                 
        />
        <Route 
          path="/admin/dashboard/salaries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Salaries" />
              <AdminSalaryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/salaries/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Salaries" />
              <AdminEmployeeSalaryProfile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/dashboard/leaves"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Leaves" />
              <AdminLeaveManagement />
            </ProtectedRoute>
          }                 
        />
        <Route 
          path="/admin/dashboard/holidays"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Holidays" />
              <AdminHolidays />
            </ProtectedRoute>
          }
        />            
        <Route 
          path="/admin/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar isActive="Settings" />
              <AdminSettings />
            </ProtectedRoute>
          }
        />            
      </Routes>
  );
};

export default AppRouter;
