import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  Users, UserCheck, UserX, Clock,
  AlertCircle
} from 'lucide-react';

const AdminDashboardHome = () => {
  const attendanceChartRef = useRef(null);
  const leaveChartRef = useRef(null);
  const departmentChartRef = useRef(null);

  // Sample data
  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Present',
        data: [92, 88, 95, 90, 87, 93],
        borderColor: '#6366f1',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Absent',
        data: [8, 12, 5, 10, 13, 7],
        borderColor: '#ef4444',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Late',
        data: [4, 6, 3, 5, 7, 4],
        borderColor: '#f59e0b',
        tension: 0.4,
        fill: false
      }
    ]
  };

  const leaveData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sick Leave',
        data: [12, 8, 10, 15, 7, 9],
        backgroundColor: '#ef4444'
      },
      {
        label: 'Vacation',
        data: [8, 15, 12, 10, 18, 14],
        backgroundColor: '#6366f1'
      },
      {
        label: 'Personal',
        data: [5, 3, 6, 4, 7, 5],
        backgroundColor: '#22c55e'
      }
    ]
  };

  const departmentData = {
    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    datasets: [{
      data: [45, 20, 30, 15, 18],
      backgroundColor: ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4']
    }]
  };

  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  useEffect(() => {
    // Initialize Attendance Chart
    const attendanceChart = new Chart(attendanceChartRef.current, {
      type: 'line',
      data: attendanceData,
      options: {
        ...chartConfig,
        plugins: {
          ...chartConfig.plugins,
          title: {
            display: false
          }
        }
      }
    });

    // Initialize Leave Chart
    const leaveChart = new Chart(leaveChartRef.current, {
      type: 'bar',
      data: leaveData,
      options: {
        ...chartConfig,
        plugins: {
          ...chartConfig.plugins,
          title: {
            display: false
          }
        }
      }
    });

    // Initialize Department Chart
    const departmentChart = new Chart(departmentChartRef.current, {
      type: 'pie',
      data: departmentData,
      options: {
        ...chartConfig,
        plugins: {
          ...chartConfig.plugins,
          title: {
            display: false
          }
        }
      }
    });

    // Cleanup
    return () => {
      attendanceChart.destroy();
      leaveChart.destroy();
      departmentChart.destroy();
    };
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
          <p className={`text-sm mt-2 ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 ml-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Dashboard Overview</h1>
        <p className="text-gray-400 mb-8">Monitor employee attendance and performance metrics</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Total Employees" 
            value="128" 
            change={2.5}
            color="bg-indigo-500/10 text-indigo-400"
          />
          <StatCard 
            icon={UserCheck} 
            label="Present Today" 
            value="112" 
            change={1.2}
            color="bg-green-500/10 text-green-400"
          />
          <StatCard 
            icon={UserX} 
            label="Absent Today" 
            value="16" 
            change={-0.8}
            color="bg-red-500/10 text-red-400"
          />
          <StatCard 
            icon={Clock} 
            label="Late Arrivals" 
            value="7" 
            change={-1.5}
            color="bg-yellow-500/10 text-yellow-400"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Trends */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Attendance Trends</h3>
            <div className="h-[300px]">
              <canvas ref={attendanceChartRef}></canvas>
            </div>
          </div>

          {/* Leave Distribution */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Leave Distribution</h3>
            <div className="h-[300px]">
              <canvas ref={leaveChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Department Distribution and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {[
                { text: "5 employees have consecutive late arrivals", type: "warning" },
                { text: "Department meeting scheduled for tomorrow", type: "info" },
                { text: "3 leave requests pending approval", type: "alert" }
              ].map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-gray-700/30">
                  <AlertCircle className={`w-5 h-5 ${
                    alert.type === 'warning' ? 'text-yellow-400' :
                    alert.type === 'info' ? 'text-blue-400' : 'text-red-400'
                  }`} />
                  <span className="text-gray-200">{alert.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Department Distribution</h3>
            <div className="h-[300px]">
              <canvas ref={departmentChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;