import React, { useState } from 'react';
import { useGetDashboardDataQuery, useUpdateUserPointsMutation, useGetUserTasksQuery } from '../../redux/slices/adminApiSlice';
import { CircularProgress, Alert, Pagination, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import { PersonOutline, TaskOutlined, MailOutline } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium truncate">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
    <div className="text-indigo-600">{icon}</div>
  </div>
);

const UserTasksModal = ({ open, onClose, userId, userName }) => {
  const { data, isLoading, error } = useGetUserTasksQuery(userId, {
    skip: !open
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Completed Tasks - {userName}
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">
            {error.data?.message || 'Failed to load tasks'}
          </Alert>
        ) : (
          <div className="mt-4">
            {data?.data?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            View Link
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No completed tasks found</p>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [editingPoints, setEditingPoints] = useState(null);
  const [newPoints, setNewPoints] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [sortOrder, setSortOrder] = useState('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, error } = useGetDashboardDataQuery({ page, limit: usersPerPage });
  const [updatePoints] = useUpdateUserPointsMutation();

  const handlePointsEdit = (user) => {
    setEditingPoints(user._id);
    setNewPoints(user.points.toString());
  };

  const handlePointsSave = async (userId) => {
    try {
      const points = parseInt(newPoints);
      if (isNaN(points) || points < 0) {
        toast.error('Please enter a valid points value');
        return;
      }

      await updatePoints({ userId, points }).unwrap();
      toast.success('Points updated successfully');
      setEditingPoints(null);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update points');
    }
  };

  const handlePointsCancel = () => {
    setEditingPoints(null);
    setNewPoints('');
  };

  const handleViewTasks = (user) => {
    setSelectedUser(user);
  };

  const handleCloseTasks = () => {
    setSelectedUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
    const now = new Date();
    
    switch (e.target.value) {
      case 'today':
        const today = new Date();
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        setStartDate(weekStart.toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        setStartDate(monthStart.toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        break;
      default:
        setStartDate('');
        setEndDate('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    toast.error(error.data?.message || 'Error loading dashboard data', {
      toastId: 'dashboard-error'
    });
    return (
      <div className="p-4">
        <Alert severity="error">
          {error.data?.message || 'Failed to load dashboard data. Please try again.'}
        </Alert>
      </div>
    );
  }

  const { totalUsers, totalTasks, totalContacts, users, totalPages } = data?.data || {};

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredUsers = users?.filter(user => {
    let matchesSearch = true;
    let matchesDate = true;
    let isNotCurrentUser = true;

    // Filter out current user
    if (userInfo && user._id === userInfo._id) {
      isNotCurrentUser = false;
    }

    // Apply search filter
    if (searchTerm) {
      switch (filterType) {
        case 'name':
          matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
          break;
        case 'email':
          matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
          break;
        case 'points':
          matchesSearch = user.points >= parseInt(searchTerm) || 0;
          break;
        default:
          matchesSearch = true;
      }
    }

    // Apply date filter
    if (startDate && endDate) {
      const userDate = new Date(user.createdAt).toISOString().split('T')[0];
      matchesDate = userDate >= startDate && userDate <= endDate;
    }

    return matchesSearch && matchesDate && isNotCurrentUser;
  }).sort((a, b) => {
    if (filterType === 'points') {
      return sortOrder === 'asc' ? a.points - b.points : b.points - a.points;
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <StatCard title="Total Users" value={totalUsers} icon={<PersonOutline fontSize="large" />} />
        <StatCard title="Total Tasks" value={totalTasks} icon={<TaskOutlined fontSize="large" />} />
        <StatCard title="Total Contacts" value={totalContacts} icon={<MailOutline fontSize="large" />} />
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter By</label>
            <select
              value={filterType}
              onChange={handleFilterTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="points">Points</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Filter</label>
            <select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {timeFilter === 'custom' && (
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          
          {filterType === 'points' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <button
                onClick={handleSortOrderChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? 'Lowest to Highest' : 'Highest to Lowest'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
          {userInfo && (
            <p className="text-sm text-gray-500 mt-1">
              Note: Your own profile is hidden from this list
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Up Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingPoints === user._id ? (
                      <div className="flex items-center space-x-2">
                        <TextField
                          size="small"
                          type="number"
                          value={newPoints}
                          onChange={(e) => setNewPoints(e.target.value)}
                          className="w-24"
                        />
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handlePointsSave(user._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={handlePointsCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{user.points || 0}</span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handlePointsEdit(user)}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewTasks(user)}
                    >
                      See Tasks
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </div>

      {/* User Tasks Modal */}
      {selectedUser && (
        <UserTasksModal
          open={!!selectedUser}
          onClose={handleCloseTasks}
          userId={selectedUser._id}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 