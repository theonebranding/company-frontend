import React, { useState, useEffect } from 'react';
import {
  NotebookTabsIcon,
  Calendar,
  Plus,
  Clock,
  X,
  Check,
  CalendarDays,
  FileText,
  AlertCircle,
  BadgeCheck,
  Ban,
  SortAsc,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

const Leaves = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('latest'); // Sorting option

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUserLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/leaves/employee-leaves`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch leaves.');
      const { leaves } = await response.json();
      setLeaveRequests(leaves);
      // toast.success('Leaves fetched successfully.');
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error(error.message || 'Failed to fetch leaves.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/leaves/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });
      if (!response.ok) throw new Error('Failed to create leave request.');
      const { message } = await response.json();
      toast.success(message || 'Leave request created successfully.');
      setIsModalOpen(false);
      setNewRequest({ startDate: '', endDate: '', reason: '' });
      fetchUserLeaves();
    } catch (error) {
      console.error('Error creating leave request:', error);
      toast.error(error.message || 'Failed to create leave request.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        color: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
        icon: <Check className="w-4 h-4" />,
      },
      rejected: {
        color: 'bg-red-500/10 text-red-400 ring-red-500/30',
        icon: <X className="w-4 h-4" />,
      },
      pending: {
        color: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
        icon: <Clock className="w-4 h-4" />,
      },
    };
    return configs[status.toLowerCase()] || configs.pending;
  };

  // Sorting the leave requests based on selected sort option
  const sortedRequests = [...leaveRequests].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'approved') {
      if (a.status.toLowerCase() === 'approved' && b.status.toLowerCase() !== 'approved') return -1;
      if (a.status.toLowerCase() !== 'approved' && b.status.toLowerCase() === 'approved') return 1;
      return 0;
    }
    return 0;
  });

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className={`rounded-xl p-6 ring-1 transform hover:scale-105 transition-all ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-800/50">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    fetchUserLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="ml-20 px-6 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500/10 p-3 rounded-lg">
                <NotebookTabsIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold">Leave Management</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              New Leave Request
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Approved Leaves"
              value={leaveRequests.filter(req => req.status.toLowerCase() === 'approved').length}
              icon={BadgeCheck}
              colorClass="bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
            />
            <StatCard
              title="Pending Leaves"
              value={leaveRequests.filter(req => req.status.toLowerCase() === 'pending').length}
              icon={Clock}
              colorClass="bg-yellow-500/10 text-yellow-400 ring-yellow-500/30"
            />
            <StatCard
              title="Rejected Leaves"
              value={leaveRequests.filter(req => req.status.toLowerCase() === 'rejected').length}
              icon={Ban}
              colorClass="bg-red-500/10 text-red-400 ring-red-500/30"
            />
          </div>

          {/* Sorting Filter */}
          <div className="flex justify-end mb-4">
            <div className="relative">
              <SortAsc className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-900/50 rounded-lg ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none text-sm"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          {/* Leave Requests List */}
          <div className="bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/10">
            <h2 className="text-xl font-semibold mb-6">Recent Requests</h2>
            <div className="space-y-4">
              {sortedRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                return (
                  <div
                    key={request._id}
                    className="bg-gray-800/40 rounded-xl p-6 ring-1 ring-white/10 hover:bg-gray-800/60 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ring-1 ${statusConfig.color}`}
                          >
                            {statusConfig.icon}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FileText className="w-4 h-4" />
                          <span>{request.reason}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <CalendarDays className="w-4 h-4" />
                          <span>
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })} - {new Date(request.endDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 ring-1 ring-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <CalendarDays className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold">New Leave Request</h2>
            </div>
            <form onSubmit={handleNewRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Start Date</label>
                <input
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 rounded-lg ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">End Date</label>
                <input
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 rounded-lg ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Reason</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 rounded-lg ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none h-32 resize-none"
                  placeholder="Please provide a detailed reason for your leave request..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        theme="dark"
        position="top-right"
        pauseOnHover={false}
        limit={1}
        autoClose={2000}
      />
    </div>
  );
};

export default Leaves;
