import React, { useState, useEffect } from 'react';
import {
  NotebookTabsIcon,
  Calendar,
  Search,
  Filter,
  Clock,
  Check,
  X,
  Edit,
  Loader2,
  User,
  AlertCircle,
  XCircle,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

const AdminLeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [hoveredRequest, setHoveredRequest] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchAllLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/leaves/get-all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch leave requests.');
      const { leaves } = await response.json();
      setLeaveRequests(leaves);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error(error.message || 'Failed to fetch leave requests.');
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveRequest = async () => {
    if (!leaveToDelete) return;
    try {
      const response = await fetch(`${BASE_URL}/leaves/delete/${leaveToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete leave request.');
      
      setLeaveRequests((prev) => prev.filter((request) => request._id !== leaveToDelete._id));
      toast.success('Leave request deleted successfully.');
      setDeleteConfirmOpen(false);
      setLeaveToDelete(null);
    } catch (error) {
      console.error('Error deleting leave request:', error);
      toast.error(error.message || 'Failed to delete leave request.');
    }
  };

  const updateLeaveStatus = async () => {
    if (!currentLeave) return;
    try {
      const response = await fetch(`${BASE_URL}/leaves/update/${currentLeave._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update leave status.');
      const { message } = await response.json();
      toast.success(message || 'Leave status updated successfully.');
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request._id === currentLeave._id ? { ...request, status: newStatus } : request
        )
      );
      setIsSlideOverOpen(false);
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error(error.message || 'Failed to update leave status.');
    }
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAndSortedRequests = leaveRequests
    .filter((request) => {
      const matchesSearch =
        request.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="ml-20 px-6 py-8">
        {/* Header */}
        <header className="sticky top-0 z-10bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 -mx-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <NotebookTabsIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-semibold text-indigo-500">
                Leave Management Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by email or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-72 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-4 my-6">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Leave Requests */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-gray-400">Loading leave requests...</p>
          </div>
        ) : filteredAndSortedRequests.length > 0 ? (
          <div className="grid gap-4">
            {filteredAndSortedRequests.map((request) => (
              <div
                key={request._id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                onMouseEnter={() => setHoveredRequest(request._id)}
                onMouseLeave={() => setHoveredRequest(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700/50 rounded-full">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">{request.employeeEmail}</p>
                        <p className="text-xs text-gray-500">Requested {formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-lg font-medium">{request.reason}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentLeave(request);
                          setNewStatus(request.status);
                          setIsSlideOverOpen(true);
                        }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors group-hover:text-indigo-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setLeaveToDelete(request);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors group-hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No leave requests found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {isSlideOverOpen && currentLeave && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Edit className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Update Leave Status</h3>
                <p className="text-sm text-gray-400">Change the status of this leave request</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Current Status</p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsSlideOverOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"              
              >
                Cancel
              </button>
              <button
                onClick={updateLeaveStatus}
                className="px-4 py-2 bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && leaveToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-400">Delete Leave Request</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="w-4 h-4" />
                <span>{leaveToDelete.employeeEmail}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{leaveToDelete.reason}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(leaveToDelete.startDate)} - {formatDate(leaveToDelete.endDate)}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setLeaveToDelete(null);
                }}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteLeaveRequest}
                className="px-4 py-2 bg-rose-500 rounded-lg text-white hover:bg-rose-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right" 
        theme="dark" 
        autoClose={2000} 
        closeOnClick={true} 
        pauseOnHover={false}
        toastClassName="bg-gray-800 text-white"
      />
    </div>
  );
};

export default AdminLeaveManagement;