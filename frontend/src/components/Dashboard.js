import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true
});

const StatCard = ({ title, value, icon, gradient }) => {
  const theme = useTheme();
  return (
    <div className={`${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-[20px] p-6 shadow-lg transform transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
        <div className={`p-3 rounded-full ${gradient}`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const theme = useTheme();
  return (
    <div className={`${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden mt-8`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme.palette.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>Platform</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>Action</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>Task URL</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>Total Completions</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>Created At</th>
            </tr>
          </thead>
          <tbody className={`${theme.palette.mode === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {tasks.map((task) => (
              <tr key={task._id} className={`hover:${theme.palette.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{task.type}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{task.action}</td>
                <td className={`px-6 py-4 text-sm ${theme.palette.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:${theme.palette.mode === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                  <a href={task.link} target="_blank" rel="noopener noreferrer">{task.link}</a>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${theme.palette.mode === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                    {task.completions?.length || 0} completions
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.palette.mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    availableTasks: 0,
    myTasks: 0,
    completedTasks: 0
  });
  const [myTasks, setMyTasks] = useState([]);

  const fetchData = async (url, headers) => {
    try {
      const response = await api.get(url, { headers });
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token && !userInfo) {
        navigate('/login');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch tasks using the correct endpoint
      const tasksData = await fetchData('/tasks/list', headers);
      
      if (!tasksData.success) {
        throw new Error(tasksData.message || 'Failed to fetch tasks');
      }

      // Get available tasks and own tasks from the response
      const availableTasks = tasksData.tasks || [];
      const ownTasks = tasksData.ownTasks || [];

      // Update stats with the completed tasks count from the API
      setStats(prevStats => ({
        ...prevStats,
        totalPoints: userInfo.points || 0,
        availableTasks: availableTasks.length,
        myTasks: ownTasks.length,
        completedTasks: tasksData.completedTasksCount || 0
      }));

      // Set my tasks with completion data
      const tasksWithCompletions = ownTasks.map(task => ({
        ...task,
        completions: task.completions || []
      }));
      setMyTasks(tasksWithCompletions);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to log stats when they change
  useEffect(() => {
    console.log('Current Stats:', stats);
  }, [stats]);

  useEffect(() => {
    if (userInfo?._id) {
      fetchDashboardData();
    }
  }, [userInfo, navigate]);

  const handleRetry = async () => {
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
                </div>
                <div className="mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Retry Loading
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-8`}>
          Welcome back, {userInfo?.name || 'User'}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Points"
            value={stats.totalPoints}
            icon={<StarIcon className="text-white" />}
            gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
          />
          <StatCard
            title="Available Tasks"
            value={stats.availableTasks}
            icon={<AssignmentIcon className="text-white" />}
            gradient="bg-gradient-to-r from-blue-400 to-blue-600"
          />
          <StatCard
            title="My Added Tasks"
            value={stats.myTasks}
            icon={<TrendingUpIcon className="text-white" />}
            gradient="bg-gradient-to-r from-green-400 to-green-600"
          />
        </div>

        {/* Tasks Table */}
        <div className={`${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Added Tasks</h2>
            <span className={`px-4 py-2 ${theme.palette.mode === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} rounded-full text-sm font-semibold`}>
              Total Tasks: {myTasks.length}
            </span>
          </div>
          <TaskTable tasks={myTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 