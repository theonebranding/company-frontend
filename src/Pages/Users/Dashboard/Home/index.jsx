import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Clock, CheckCircle } from "lucide-react";
import {toast, ToastContainer} from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Dummy Data for Charts
  const dailyWorkingHoursData = [8, 7.5, 6, 8.5, 7, 5.5, 8]; // Example daily hours for the current week
  const weeklyHoursWorkedData = [40, 35, 42, 38]; // Example weekly hours for the current month

  useEffect(() => {
    // Line Chart for Daily Working Hours
    const lineChart = new ChartJS(lineChartRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Daily Working Hours",
            data: dailyWorkingHoursData,
            borderColor: "#4F46E5",
            backgroundColor: "rgba(79, 70, 229, 0.3)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#E5E7EB",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#E5E7EB",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "#E5E7EB",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });

    // Bar Chart for Weekly Hours Worked
    const barChart = new ChartJS(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Week 1 (1-7)", "Week 2 (8-14)", "Week 3 (15-21)", "Week 4 (22-28)"],
        datasets: [
          {
            label: "Hours Worked",
            data: weeklyHoursWorkedData,
            backgroundColor: "#22C55E",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#E5E7EB",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#E5E7EB",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "#E5E7EB",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });

    return () => {
      lineChart.destroy();
      barChart.destroy();
    };
  }, []);

  return (
    <div className="p-6 ml-8 min-h-screen pl-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-500" />
            Dashboard Home
          </h1>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Hours Worked This Week */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:scale-105 transform transition-all duration-300">
            <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-200">Total Hours Worked This Week</h3>
            <p className="text-2xl font-bold text-gray-100">40 hrs</p>
          </div>

          {/* Active Days */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:scale-105 transform transition-all duration-300">
            <CheckCircle className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-200">Active Days this week </h3>
            <p className="text-2xl font-bold text-gray-100">6 Days</p>
          </div>

          {/* Monthly Attendance */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:scale-105 transform transition-all duration-300">
            <CheckCircle className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-200">Monthly Attendance</h3>
            <p className="text-2xl font-bold text-gray-100">95%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart for Daily Working Hours */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Daily Working Hours</h3>
            <canvas ref={lineChartRef}></canvas>
          </div>

          {/* Bar Chart for Weekly Hours Worked */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Weekly Hours Worked</h3>
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-right" pauseOnHover={false} limit={1} autoClose={2000} />
    </div>
  );
};

export default DashboardHome;
